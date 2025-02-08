import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { getUser } from '@/lib/data';
import bcrypt from 'bcrypt';
import {z} from 'zod';

 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [ 
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
            .object({email: z.string().email(), password: z.string().min(6) }).safeParse(credentials);

            if (parsedCredentials.success) {
               const {email, password} =parsedCredentials.data;
               const user = await getUser(email);
               if(!user)  return null;
               const PasswordMatch = await bcrypt.compare(password, user.hashedPassword);
               if(PasswordMatch) return user;
            }
            console.log('Credentials not valid');
            return null;
        },
    }),
   ],
});