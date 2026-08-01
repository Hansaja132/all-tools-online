import jwt from 'jsonwebtoken';
import { UserDTO } from '@tools-website/shared-types';

const ACCESS_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_that_is_at_least_thirty_two_chars_long';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'super_secret_refresh_jwt_key_that_is_at_least_thirty_two_chars_long';

export class TokenService {
  static generateAccessToken(user: UserDTO): string {
    return jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      ACCESS_SECRET,
      { expiresIn: (process.env.JWT_ACCESS_EXPIRATION || '15m') as any }
    );
  }

  static generateRefreshToken(user: UserDTO): string {
    return jwt.sign(
      { id: user.id },
      REFRESH_SECRET,
      { expiresIn: (process.env.JWT_REFRESH_EXPIRATION || '7d') as any }
    );
  }

  static verifyAccessToken(token: string): { id: string; email: string; role: string } | null {
    try {
      return jwt.verify(token, ACCESS_SECRET) as any;
    } catch {
      return null;
    }
  }

  static verifyRefreshToken(token: string): { id: string } | null {
    try {
      return jwt.verify(token, REFRESH_SECRET) as any;
    } catch {
      return null;
    }
  }
}
