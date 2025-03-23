
'use client';

import Link from "next/link"
import clsx from "clsx"
import { useParams } from "next/navigation"
const links = [
    { name: 'イベント登録', href: '/owner/event/create'},
    { name: 'イベント編集', href: '/owner/event/edit' },
    { name: 'マイぺージ編集', href: '/owner/mypage/edit' },
    { name: 'マイぺージ作成', href: '/owner/mypage/create' },
    { name: '店舗作成', href: '/owner/store/create' },
    { name: '店舗編集', href: '/owner/store/edit' }

  ];

export default function SideBar() {

  const params = useParams();
    return (
      <aside className="absolute w-64 bg-gray-200 p-4 top-0 left-0 h-full">
      <h2 className="text-xl font-bold mb-4" >
        <Link href={"/owner"} className="hover:underline">
          TCG 管理者ページ
        </Link>
       
        </h2>
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