import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            relationshipId: string | null;
            bondlyId?: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        relationshipId: string | null;
        bondlyId?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        relationshipId: string | null;
        bondlyId?: string | null;
    }
}
