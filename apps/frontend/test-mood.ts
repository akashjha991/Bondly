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

    // Create Mood  
    try {
        const mood = await db.mood.create({
            data: {
                emoji: '🤩',
                user: { connect: { id: user.id } },
                relationship: { connect: { id: user.relationshipId! } },
            }
        })
        console.log("Mood created successfully:", mood.id)
    } catch (e: any) {
        console.error("Mood creation failed:", e.message)
    }
}
main()
