import { Router } from 'express';
import { prisma } from '../lib/db';
import { z } from 'zod';
import { authMiddleware } from '../middleware/auth';

const router = Router();

const InvitePartnerSchema = z.object({
    inviteCode: z.string().min(1, 'Invite code is required'),
});

router.post('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { inviteCode } = InvitePartnerSchema.parse(req.body);

        const partner = await prisma.user.findUnique({
            where: { bondlyId: inviteCode },
            include: { relationship: true },
        });

        if (!partner) {
            return res.status(404).json({ error: 'Invalid invite code' });
        }

        if (partner.id === userId) {
            return res.status(400).json({ error: 'You cannot invite yourself' });
        }

        const currentUser = await prisma.user.findUnique({ where: { id: userId } });

        if (partner.relationshipId || currentUser?.relationshipId) {
            return res.status(400).json({ error: 'One of the users is already in a relationship' });
        }

        // Create a new relationship
        const relationshipId = await prisma.$transaction(async (tx: any) => {
            const newRelationship = await tx.relationship.create({
                data: {
                    inviteCode: `BOND-${partner.bondlyId}-${userId.substring(0, 4)}`,
                },
            });

            // Connect both users to the new relationship
            await tx.user.update({
                where: { id: userId },
                data: { relationshipId: newRelationship.id }
            });

            await tx.user.update({
                where: { id: partner.id },
                data: { relationshipId: newRelationship.id }
            });

            return newRelationship.id;
        });

        return res.status(200).json({ relationshipId });
    } catch (error: any) {
        if (error.name === 'ZodError') {
            return res.status(422).json({ error: 'Invalid request data', details: error.errors });
        }
        console.error('Invite error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
