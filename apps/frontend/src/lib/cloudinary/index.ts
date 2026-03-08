import { writeFile, mkdir } from "fs/promises";
import path from "path";
import crypto from "crypto";

export async function uploadImageToCloudinary(fileBuffer: Buffer, mimeType: string): Promise<string> {
    try {
        const uploadDir = path.join(process.cwd(), "public", "uploads");
        await mkdir(uploadDir, { recursive: true });

        const extension = mimeType.split("/")[1] || "png";
        const filename = `${crypto.randomUUID()}.${extension}`;
        const filepath = path.join(uploadDir, filename);

        await writeFile(filepath, fileBuffer);

        return `/uploads/${filename}`;
    } catch (error) {
        console.error("Local upload failed:", error);
        throw new Error("Upload failed");
    }
}
