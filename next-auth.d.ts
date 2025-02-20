import NextAuth from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        name: string;
        email: string;
        hashedPassword: string;
        isAdmin: boolean;
    }

    interface Session {
        user: User;
    }

}
