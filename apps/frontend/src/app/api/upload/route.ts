import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { uploadImageToCloudinary } from "@/lib/cloudinary/index";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const authSession = await getAuthSession();
        const userId = authSession?.user?.id;
        const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
        const session = user ? { user } : null;
        if (!session?.user?.id) {
            return new Response("Unauthorized", { status: 401 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File | null;

        if (!file) {
            return new Response("No file provided", { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const imageUrl = await uploadImageToCloudinary(buffer, file.type);

        return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
    } catch (error: any) {
        console.error("Upload error details:", error);
        console.error("Error message:", error?.message);
        if (error?.response) {
            console.error("Cloudinary response:", error.response);
        }
        return new Response(JSON.stringify({ error: "Failed to upload image", details: error?.message }), { status: 500 });
    }
}
