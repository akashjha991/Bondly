import { v2 as cloudinary } from "cloudinary";
import * as dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function run() {
    try {
        console.log("Cloud Name:", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME);
        console.log("API Key length:", process.env.CLOUDINARY_API_KEY?.length);

        console.log("Testing ping...");
        const res = await cloudinary.api.ping();
        console.log("Ping successful:", res);
    } catch (err) {
        console.error("Cloudinary error:", err);
    }
}
run();
