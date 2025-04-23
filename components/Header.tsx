'use client'
import { signOut, useSession} from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import NotificationModal from '@/components/NotificationModal';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { data: session, status } = useSession();
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  if( status !== "authenticated") {
    return <></>
  }

  return (
    <header className="flex justify-between items-center p-4 border-b border-gray-200">
      {/* 左側に空のdivを配置してフレックスボックスのスペースを確保 */}
      <div className="w-[90px]" /> {/* 右側のアイコンと同じ幅を確保 */}
      
      {/* ロゴを中央に配置 */}
      <h1 className="text-2xl font-bold">
        <Link href="/user">TCG HUB</Link>
      </h1>

      {/* 右側のアイコン群 */}
      <div className="flex flex-row gap-2">
        <Image 
          src="/closed-envelope.png" 
          alt="通知" 
          width={45} 
          height={45} 
          onClick={() => setIsNotificationModalOpen(true)}
        />
        <NotificationModal
          isOpen={isNotificationModalOpen}
          onClose={() => setIsNotificationModalOpen(false)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Image 
              src={session.user?.image || "/administorator.png" } 
              alt="user" 
              width={45} 
              height={45} 
              className="rounded-full cursor-pointer" 
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/user/login" })}>
              ログアウト
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link 
                href="https://docs.google.com/forms/d/e/1FAIpQLSdjke6VmU346R8PEHQe0Upc1HZj8f7TgJkaJJ5D26QB41kW-A/viewform" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full"
              >
                フィードバック
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}