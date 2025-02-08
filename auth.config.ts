import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    authorized({ auth, request: {nextUrl}}) {
        const isLogin = !!auth?.user
        if(isLogin) {
            return true;
        } else {
            return Response.redirect(new URL('/user/login', nextUrl));
        }
    }
  },
  providers: [],
} satisfies NextAuthConfig;