'use client';

import Link from "next/link"
import clsx from "clsx"
import { useParams } from "next/navigation"
import { useState, useEffect } from "react";

const links = [
    { name: 'イベント登録', href: '/owner/event/create'},
    { name: 'イベント編集', href: '/owner/event/edit' },
    { name: 'マイぺージ編集', href: '/owner/mypage/edit' },
    { name: 'マイぺージ作成', href: '/owner/mypage/create' },
    { name: '店舗作成', href: '/owner/store/create' },
    { name: '店舗編集', href: '/owner/store/edit' }
];

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const params = useParams();

  // ESCキーでサイドバーを閉じる
  useEffect(() => {
    const handleEsc = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);
  
  // 外側クリックでサイドバーを閉じる
  const handleOutsideClick = (e: MouseEvent) => {
    if (isOpen && e.target instanceof HTMLElement && e.target.classList.contains('overlay')) {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* ハンバーガーメニューボタン */}
      <button 
        className="fixed top-20 left-4 z-40 p-2 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="メニューを開く"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      {/* オーバーレイ - サイドバーが開いているときだけ表示 */}
      {isOpen && (
        <div 
          className="overlay fixed inset-0 bg-black bg-opacity-40 z-40"
          onClick={handleOutsideClick as unknown as React.MouseEventHandler<HTMLDivElement>}
        />
      )}
      
      {/* サイドバー */}
      <aside 
        className={`fixed top-0 left-0 w-64 bg-gray-200 p-4 h-full z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            <Link href={"/owner"} className="hover:underline">
              TCG 管理者ページ
            </Link>
          </h2>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-full hover:bg-gray-300 focus:outline-none"
            aria-label="メニューを閉じる"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        
        <nav className="space-y-3">
          {links.map((link) => (
            <Link
              key={link.name} 
              href={link.href}
              className={clsx("block text-blue-500 hover:underline", {
                "font-bold": params.id === link.href,
              })}
              onClick={() => setIsOpen(false)}
            >
              <p className="block">{link.name}</p>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}