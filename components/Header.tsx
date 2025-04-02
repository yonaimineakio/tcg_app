'use client'
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
// import { useSearchParams } from 'next/navigation';

export default function Header() {
  const { data: session, status } = useSession();
  // const searchParams = useSearchParams();
  // const callbackUrl = searchParams.get('callbackUrl') || session && session.user ? '/user' : '';
  // console.log("session", session);
  // console.log("status", status);
  // console.log("callbackUrl", callbackUrl);
  if( status !== "authenticated") {
    return <></>
  }

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200">
    <button  onClick={() => signOut({ callbackUrl: "/user/login" })}>Sign Out</button>
    <h1 className="text-2xl font-bold">TCG HUB</h1>
    <Image src={session.user?.image || "/administorator.png" } alt="user" width={45} height={45} className="rounded-full" />
    </header>
  );;
}
