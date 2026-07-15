import { Router, Response } from 'express';
import { requireAdmin, AuthenticatedRequest } from '../middleware/auth.middleware';
import { prisma } from '../database/prisma';

const router = Router();

// Get users list
router.get('/users', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        provider: true,
        emailVerified: true,
        createdAt: true,
      },
    });
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
});

// Get site statistics
router.get('/stats', requireAdmin, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    const toolCount = await prisma.tool.count();
    const viewCount = await prisma.toolView.count();
    const likeCount = await prisma.toolLike.count();

    res.json({
      users: userCount,
      tools: toolCount,
      views: viewCount,
      likes: likeCount,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
});

export default router;
