// app/login/page.tsx
'use client';

// import { useEffect, useState } from 'react';
// import { useSearchParams } from 'next/navigation';
// import { useSession } from 'next-auth/react';
// import { isSignedUpBefore } from '@/lib/data';
import { signIn } from 'next-auth/react';

export default function UserLoginForm() {

//   const { data: session } = useSession();
//   const [isSignedUp, setIsSignedUp] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchIsSignedUp = async () => {
//       const isSignedUp = await isSignedUpBefore(session?.user.providerAccountId || '', session?.user.provider || '');
//       console.log("isSignedUp", isSignedUp);
//       setIsSignedUp(isSignedUp);
//     };
//     fetchIsSignedUp();
//   }, [session?.user.providerAccountId, session?.user.provider]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">ユーザーログイン</h1>
      <button onClick={() => {
        signIn("twitter", { redirectTo: "/user" });
      }} className="bg-blue-500 text-white px-4 py-2 rounded-md">Login With X</button>
      <button onClick={() => {
        signIn("google", { redirectTo: "/user" });
      }} className="bg-red-500 text-white px-4 py-2 rounded-md">Login With Google</button>
    </div>  
  );
}
