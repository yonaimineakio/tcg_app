import type { NextAuthConfig, User as NextAuthUser } from 'next-auth';
// import { NextRequest } from 'next/server';
import { createUserAccount, getUserAccount } from '@/lib/data';

export const authConfig = {
  pages: {
    signIn: '/login',
    
  },
  callbacks: {
    async signIn({ user, account }: { user: NextAuthUser, account: any }) {
      console.log('signIn');
      console.log(user);
      console.log(account);


      if(account.provider == process.env.ADMIN_PROVIDER && account.providerAccountId == process.env.ADMIN_PROVIDER_ACCOUNT_ID) {
        return true;
      }
      
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

    async session({ session, token }) {
      console.log('session');
      console.log(session);
      console.log(token);
      return {
        ...session,
        user: {
          ...session.user,
          providerAccountId: token.providerAccountId as string,
          provider: token.provider as string,
        }
      };
    },



    // authorized({ auth, request: {nextUrl}}: {auth: Session | null, request: NextRequest}) {
    //   console.log('authorized');
    //   console.log(auth);
    //   console.log(nextUrl);
    //   const isLogin = !!auth?.user;
    //   return isLogin;
    // },
  },
  
  providers: [],
} satisfies NextAuthConfig;