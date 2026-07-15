import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { prisma } from '../database/prisma';
import { TokenService } from '../services/token.service';
import { EmailService } from '../services/email.service';
import { RegisterSchema, LoginSchema, ForgotPasswordSchema, ResetPasswordSchema, VerifyEmailSchema, UserDTO } from '@tools-website/shared-types';

function mapToUserDTO(user: any): UserDTO {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    provider: user.provider,
    providerId: user.providerId,
    role: user.role,
    emailVerified: user.emailVerified,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
  };
}

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const parsed = RegisterSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Validation failed', errors: parsed.error.format() });
      }

      const { name, email, password } = parsed.data;

      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      });

      // Generate verification token
      const verificationToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await prisma.emailVerificationToken.create({
        data: {
          userId: user.id,
          token: verificationToken,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        },
      });

      await EmailService.sendVerificationEmail(email, verificationToken);

      const userDTO = mapToUserDTO(user);
      const accessToken = TokenService.generateAccessToken(userDTO);
      const refreshToken = TokenService.generateRefreshToken(userDTO);

      // Save refresh token in DB
      await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      res.status(201).json({
        user: userDTO,
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const parsed = LoginSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Validation failed', errors: parsed.error.format() });
      }

      const { email, password } = parsed.data;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      const userDTO = mapToUserDTO(user);
      const accessToken = TokenService.generateAccessToken(userDTO);
      const refreshToken = TokenService.generateRefreshToken(userDTO);

      // Save refresh token in DB
      await prisma.session.create({
        data: {
          userId: user.id,
          token: refreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        },
      });

      res.json({
        user: userDTO,
        accessToken,
        refreshToken,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
      }

      const payload = TokenService.verifyRefreshToken(refreshToken);
      if (!payload) {
        return res.status(401).json({ message: 'Invalid or expired refresh token' });
      }

      const session = await prisma.session.findUnique({ where: { token: refreshToken } });
      if (!session || session.expiresAt < new Date()) {
        return res.status(401).json({ message: 'Session expired' });
      }

      const user = await prisma.user.findUnique({ where: { id: payload.id } });
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      const userDTO = mapToUserDTO(user);
      const accessToken = TokenService.generateAccessToken(userDTO);

      res.json({
        accessToken,
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  static async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;
      if (refreshToken) {
        await prisma.session.deleteMany({ where: { token: refreshToken } });
      }
      res.json({ message: 'Logged out successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const parsed = VerifyEmailSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Validation failed', errors: parsed.error.format() });
      }

      const { token } = parsed.data;

      const record = await prisma.emailVerificationToken.findUnique({ where: { token } });
      if (!record || record.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired verification token' });
      }

      await prisma.user.update({
        where: { id: record.userId },
        data: { emailVerified: true },
      });

      await prisma.emailVerificationToken.delete({ where: { token } });

      res.json({ message: 'Email verified successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const parsed = ForgotPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Validation failed', errors: parsed.error.format() });
      }

      const { email } = parsed.data;

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        // Return 200 to prevent user enumeration attacks
        return res.json({ message: 'If email exists, a password reset link has been sent' });
      }

      const resetToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          token: resetToken,
          expiresAt: new Date(Date.now() + 1 * 60 * 60 * 1000), // 1 hour
        },
      });

      await EmailService.sendPasswordResetEmail(email, resetToken);

      res.json({ message: 'If email exists, a password reset link has been sent' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const parsed = ResetPasswordSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ message: 'Validation failed', errors: parsed.error.format() });
      }

      const { token, password } = parsed.data;

      const record = await prisma.passwordResetToken.findUnique({ where: { token } });
      if (!record || record.expiresAt < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await prisma.user.update({
        where: { id: record.userId },
        data: { password: hashedPassword },
      });

      await prisma.passwordResetToken.delete({ where: { token } });

      res.json({ message: 'Password reset successfully' });
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
  }
}
