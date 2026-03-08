import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: "bondly",
    api_key: "355978725286336",
    api_secret: "KTqe0H_ryaX6N6LSXBzj05MWdZ0",
});

async function main() {
    try {
        const res = await cloudinary.uploader.upload("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=", {
            folder: "bondly_test"
        });
        console.log("Success:", res.secure_url);
    } catch (e) {
        console.error("Cloudinary failed:", e);
    }
}

main();
