import type { NextAuthConfig, Session, User as NextAuthUser } from 'next-auth';
import { JWT } from "next-auth/jwt";
import { NextRequest } from 'next/server';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }:{ session: Session; token: JWT }) {
      session.user = token.user as NextAuthUser;
      return session;
    },
    authorized({ auth, request: {nextUrl}}: {auth: Session | null, request: NextRequest}) {
        const isLogin = !!auth?.user;
        return isLogin;
    }
  },
  providers: [],
} satisfies NextAuthConfig;