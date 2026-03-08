"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("../lib/cloudinary");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only images are allowed'));
        }
    }
});
router.post('/', auth_1.authMiddleware, upload.single('file'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }
        // Call cloudinary upload directly with buffer
        const imageUrl = await (0, cloudinary_1.uploadImageToCloudinary)(file.buffer, file.mimetype);
        return res.status(200).json({ imageUrl });
    }
    catch (error) {
        console.error('Upload route error:', error);
        return res.status(500).json({ error: 'Failed to upload image', details: error.message });
    }
});
exports.default = router;
//# sourceMappingURL=upload.js.map