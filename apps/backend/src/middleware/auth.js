"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jwt_1 = require("@auth/core/jwt");
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.cookies['next-auth.session-token'] || req.cookies['__Secure-next-auth.session-token'];
        if (!token) {
            res.status(401).json({ error: 'Unauthorized: No token provided' });
            return;
        }
        const decoded = await (0, jwt_1.decode)({
            token,
            secret: process.env.NEXTAUTH_SECRET || "super_secret_bondly_key_12345",
            salt: req.cookies['__Secure-next-auth.session-token']
                ? '__Secure-next-auth.session-token'
                : 'next-auth.session-token',
        });
        if (!decoded || !decoded.sub && !decoded.id) {
            res.status(401).json({ error: 'Unauthorized: Invalid token' });
            return;
        }
        req.user = { id: (decoded.id || decoded.sub) };
        next();
    }
    catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Unauthorized: Token verification failed' });
        return;
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.js.map