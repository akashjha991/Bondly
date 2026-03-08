"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../lib/db");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const zod_1 = require("zod");
const AnniversarySchema = zod_1.z.object({
    dateStr: zod_1.z.string().datetime({ offset: true }).or(zod_1.z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Invalid date format")),
});
router.put('/anniversary', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await db_1.prisma.user.findUnique({
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
        await db_1.prisma.relationship.update({
            where: { id: user.relationshipId },
            data: { anniversaryDate: date },
        });
        return res.json({ success: true });
    }
    catch (error) {
        console.error('Anniversary update error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.post('/disconnect', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        const user = await db_1.prisma.user.findUnique({
            where: { id: userId },
            select: { relationshipId: true },
        });
        if (!user?.relationshipId) {
            return res.status(404).json({ error: 'No relationship found' });
        }
        await db_1.prisma.user.updateMany({
            where: { relationshipId: user.relationshipId },
            data: { relationshipId: null },
        });
        return res.json({ success: true });
    }
    catch (error) {
        console.error('Disconnect error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
router.delete('/account', auth_1.authMiddleware, async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId)
            return res.status(401).json({ error: 'Unauthorized' });
        await db_1.prisma.user.delete({
            where: { id: userId },
        });
        return res.json({ success: true });
    }
    catch (error) {
        console.error('Delete account error:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
//# sourceMappingURL=profile.js.map