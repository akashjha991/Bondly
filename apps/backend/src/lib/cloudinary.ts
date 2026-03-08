import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
});

export const uploadImageToCloudinary = async (
    fileBuffer: Buffer | null,
    mimeType?: string | null,
    fileUri?: string
): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: "bondly",
            },
            (error, result) => {
                if (error || !result) {
                    console.error("Cloudinary upload failed:", error);
                    return reject(new Error("Upload failed"));
                }
                resolve(result.secure_url);
            }
        );

        if (fileBuffer) {
            uploadStream.end(fileBuffer);
        } else if (fileUri) {
            const base64Data = fileUri.replace(/^data:image\/\w+;base64,/, "");
            const imageBuffer = Buffer.from(base64Data, 'base64');
            uploadStream.end(imageBuffer);
        } else {
            return reject(new Error("No file buffer or URI provided"));
        }
    });
};
