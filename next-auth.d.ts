import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        name: string;
        isAdmin: boolean;
        image?: string;
        providerAccountId?: string;
        provider?: string;
    }

    interface Session {
        user: User;
    }



}
