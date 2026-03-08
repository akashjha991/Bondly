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

        // Forward the FormData to the backend Express server
        const backendUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:10000";
        const cookieHeader = req.headers.get("cookie") || "";

        const backendUploadRes = await fetch(`${backendUrl}/api/upload`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${(authSession as any)?.token || ""}`,
                Cookie: cookieHeader,
            },
            body: formData,
        });

        if (!backendUploadRes.ok) {
            const errorData = await backendUploadRes.text();
            throw new Error(`Backend upload failed: ${errorData}`);
        }

        const data = await backendUploadRes.json();
        const imageUrl = data.imageUrl; // The backend returns { imageUrl: string }

        return new Response(JSON.stringify({ url: imageUrl }), { status: 200 });
    } catch (error: any) {
        console.error("Upload error details:", error);
        return new Response(JSON.stringify({ error: "Failed to upload image", details: error?.message }), { status: 500 });
    }
}
