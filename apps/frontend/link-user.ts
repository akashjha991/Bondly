import { PrismaClient } from '@prisma/client'

const db = new PrismaClient()

async function main() {
    const user = await db.user.findFirst({
        where: { email: 'testuser@example.com' }
    })

    if (!user) {
        console.log("Test user not found")
        return
    }

    try {
        if (!user.relationshipId) {
            console.log("Creating new relationship for unlinked test user...")
            const rel = await db.relationship.create({
                data: {
                    inviteCode: `BOND-TEST-${Date.now()}`,
                    users: {
                        connect: [{ id: user.id }]
                    }
                }
            })
            console.log("Successfully linked user to relationship:", rel.id)
        } else {
            console.log("User is already linked to relationship:", user.relationshipId)
        }

    } catch (e: any) {
        console.error("Link failed:", e.message)
    }
}
main()
