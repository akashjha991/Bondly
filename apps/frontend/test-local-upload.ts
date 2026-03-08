import { uploadImageToCloudinary } from "./src/lib/cloudinary/index";

async function run() {
    try {
        const buffer = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", "base64");
        const url = await uploadImageToCloudinary(buffer, "image/png");
        console.log("Uploaded successfully to:", url);
    } catch (e) {
        console.error("Test failed", e);
    }
}
run();
