import NextAuth from 'next-auth';
import Twitter from 'next-auth/providers/twitter';
import Google from 'next-auth/providers/google';
import { authConfig } from './auth.config';
// import Credentials from 'next-auth/providers/credentials';
// import { getUser } from '@/lib/data';
// import bcrypt from "bcryptjs";
// import {z} from 'zod';

 
export const { handlers, auth, signIn, signOut } = NextAuth({
     debug: true,
  ...authConfig,
  providers: [ 
    // Credentials({
    //     async authorize(credentials) {
    //         console.log('credentials');
    //         console.log(credentials);
    //         const parsedCredentials = z
    //         .object({email: z.string().email(), password: z.string().min(6) }).safeParse(credentials);

    //         if (parsedCredentials.success) {
    //            const {email, password} =parsedCredentials.data;
    //            const user = await getUser(email);
    //            if(!user)  return null;
    //            const PasswordMatch = await bcrypt.compare(password, user.hashedPassword);
    //            console.log(user);
    //            if(PasswordMatch) return user;
    //         }
    //         console.log('Credentials not valid');
    //         return null;
    //     },
    // }),
    
    Twitter({
        clientId: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
    }),
    Google({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
   ],
});
