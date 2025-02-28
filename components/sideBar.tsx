
'use client';

import Link from "next/link"
import clsx from "clsx"
import { useParams } from "next/navigation"
const links = [
    { name: 'イベント登録', href: '/owner/event/create'},
    { name: 'イベント編集', href: '/owner/event/edit' },
    { name: 'マイぺージ編集', href: '/owner/mypage/edit' },

  ];

export default function SideBar() {

  const params = useParams();
    return (
      <aside className="w-64 bg-gray-200 p-4">
      <h2 className="text-xl font-bold mb-4">TCG 管理者ページ</h2>
      <nav>
            {links.map((link) => (
                <Link
                    key={link.name} 
                    href={link.href}
                    className={clsx("text-blue-500 hover:underline", {
                    "font-bold": params.id === link.href,
                    })}>
                <p className="hidden md:block">{link.name}</p>
                </Link>
            ))}
      </nav>
    </aside>
    )
}