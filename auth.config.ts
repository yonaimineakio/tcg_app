import type { NextAuthConfig, Session, User as NextAuthUser, AdapterUser, AdapterSession } from 'next-auth';
import { JWT } from "next-auth/jwt";
import { NextRequest } from 'next/server';
import { createUserAccount, getUserAccount } from '@/lib/data';

type CustomSession = Session & {
  providerAccountId: string;
  user: AdapterUser;
} & AdapterSession;

export const authConfig = {
  pages: {
    signIn: '/login',
    
  },
  callbacks: {
    async signIn({ user, account }: { user: NextAuthUser, account: any }) {
      console.log('signIn');
      console.log(user);
      console.log(account);
      if(account.provider !== 'credentials') {
        const existingUserAccount = await getUserAccount(account.providerAccountId, account.provider);
        console.log('existingUserAccount');
        console.log(existingUserAccount);
        if (!existingUserAccount) {
          await createUserAccount({
            id: user.id || '',
            name: user.name || '',
            image_url: user.image || '',
            provider: account.provider || '',
            provider_account_id: account.providerAccountId || ''
          });
        }  
      } 
      return true;
    },

    async jwt({ token, user, account }) {
      if (user) {
        token.user = user;
      }
      if (account) {
        token.providerAccountId = account.provider !== 'credentials' ? account.providerAccountId : '';
        token.provider = account.provider;
      } 
      console.log('jwt');
      console.log(token);
      return token;
    },






    async session({ session, token }:{ session: CustomSession; token: JWT }) {
      session.user = token.user as NextAuthUser;
      console.log("token.user", token.user);
      session.user.providerAccountId = token.providerAccountId;
      session.user.provider = token.provider;
      console.log('session');
      console.log(session);
      return session;
    },


    authorized({ auth, request: {nextUrl}}: {auth: Session | null, request: NextRequest}) {
        const isLogin = !!auth?.user;
        return isLogin;
    }
  },
  providers: [],
} satisfies NextAuthConfig;