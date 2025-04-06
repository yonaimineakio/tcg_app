'use client'
import { signOut, useSession} from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import NotificationModal from '@/components/NotificationModal';
import { useState } from 'react';
// import { useSearchParams } from 'next/navigation';

export default function Header() {
  const { data: session, status } = useSession();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
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
    <h1 className="text-2xl font-bold">
      <Link href="/user">TCG HUB</Link>
    </h1>
    <div className="flex flex-row gap-2">
      <Image src="/closed-envelope.png" alt="通知" width={45} height={45} onClick={ () => setIsNotificationModalOpen(true)}/>
      <NotificationModal
        isOpen={isNotificationModalOpen}
        onClose={() => setIsNotificationModalOpen(false)}
      />
      <Image src={session.user?.image || "/administorator.png" } alt="user" width={45} height={45} className="rounded-full" />
    </div>
    </header>
  );;
}
