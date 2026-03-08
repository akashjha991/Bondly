import { getAuthSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { InvitePartnerSchema } from "@/lib/validations";

export async function POST(req: Request) {
    try {
        const authSession = await getAuthSession();
    const userId = authSession?.user?.id;
    const user = userId ? await db.user.findUnique({ where: { id: userId } }) : null;
    const session = user ? { user } : null;
        if (!session?.user) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await req.json();
        const { inviteCode } = InvitePartnerSchema.parse(body);

        const partner = await db.user.findUnique({
            where: { bondlyId: inviteCode },
            include: { relationship: true }
        });

        if (!partner) {
            return new Response("Invalid invite code", { status: 404 });
        }

        if (partner.id === session.user.id) {
            return new Response("You cannot invite yourself", { status: 400 });
        }

        if (partner.relationshipId || session.user.relationshipId) {
            return new Response("One of the users is already in a relationship", { status: 400 });
        }

        // Create a new relationship
        const relationshipId = await db.$transaction(async (tx) => {
            const newRelationship = await tx.relationship.create({
                data: {
                    inviteCode: `BOND-${partner.bondlyId}-${session.user.id.substring(0, 4)}`,
                    users: {
                        connect: [{ id: session.user.id }, { id: partner.id }],
                    },
                },
            });

            return newRelationship.id;
        });

        return new Response(JSON.stringify({ relationshipId }), { status: 200 });
    } catch (error: any) {
        if (error?.name === "ZodError") {
            return new Response("Invalid request data", { status: 422 });
        }
        return new Response("Internal Server Error", { status: 500 });
    }
}
