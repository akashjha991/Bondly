import { Router } from 'express';
import { prisma } from '../lib/db';
import { authMiddleware } from '../middleware/auth';

const router = Router();
import { z } from 'zod';

const AnniversarySchema = z.object({
    dateStr: z.string().datetime({ offset: true }).or(z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Invalid date format")),
});

router.put('/anniversary', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { relationshipId: true },
        });

        if (!user?.relationshipId) {
            return res.status(404).json({ error: 'No relationship found' });
        }

        const bodyParse = AnniversarySchema.safeParse(req.body);
        if (!bodyParse.success) {
            return res.status(400).json({ error: 'Invalid date format' });
        }

        const date = new Date(bodyParse.data.dateStr);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: 'Invalid date value' });
        }

        await prisma.relationship.update({
            where: { id: user.relationshipId },
            data: { anniversaryDate: date },
        });

        return res.json({ success: true });
    } catch (error) {
        console.error('Anniversary update error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/disconnect', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { relationshipId: true },
        });

        if (!user?.relationshipId) {
            return res.status(404).json({ error: 'No relationship found' });
        }

        await prisma.user.updateMany({
            where: { relationshipId: user.relationshipId },
            data: { relationshipId: null },
        });

        return res.json({ success: true });
    } catch (error) {
        console.error('Disconnect error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/account', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) return res.status(401).json({ error: 'Unauthorized' });

        await prisma.user.delete({
            where: { id: userId },
        });

        return res.json({ success: true });
    } catch (error) {
        console.error('Delete account error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
