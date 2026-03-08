import { Router } from 'express';
import multer from 'multer';
import { uploadImageToCloudinary } from '../lib/cloudinary';
import { authMiddleware } from '../middleware/auth';

const router = Router();
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req: any, file: any, cb: any) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only images are allowed'));
        }
    }
});

router.post('/', authMiddleware, upload.single('file'), async (req: any, res: any) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        // Call cloudinary upload directly with buffer
        const imageUrl = await uploadImageToCloudinary(file.buffer, file.mimetype);

        return res.status(200).json({ imageUrl });
    } catch (error: any) {
        console.error('Upload route error:', error);
        return res.status(500).json({ error: 'Failed to upload image', details: error.message });
    }
});

export default router;
