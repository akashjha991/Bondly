"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImageToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
});
const uploadImageToCloudinary = async (fileBuffer, mimeType, fileUri) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({
            folder: "bondly",
        }, (error, result) => {
            if (error || !result) {
                console.error("Cloudinary upload failed:", error);
                return reject(new Error("Upload failed"));
            }
            resolve(result.secure_url);
        });
        if (fileBuffer) {
            uploadStream.end(fileBuffer);
        }
        else if (fileUri) {
            const base64Data = fileUri.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(base64Data, 'base64');
            uploadStream.end(imageBuffer);
        }
        else {
            return reject(new Error("No file buffer or URI provided"));
        }
    });
};
exports.uploadImageToCloudinary = uploadImageToCloudinary;
//# sourceMappingURL=cloudinary.js.map