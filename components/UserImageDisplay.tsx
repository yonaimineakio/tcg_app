import React, { useState } from 'react';
import { UserAccount } from '@/lib/definitions';
import Image from 'next/image';
export default function UserImageDisplay({ users }: { users: UserAccount[] }) {
  const [showAll, setShowAll] = useState(false);
  const maxVisibleUsers = 5; // 表示する最大ユーザー数（+1で「他X人」ボタンを表示）
  
  // 表示するユーザーを制限
  const visibleUsers = showAll ? users : users.slice(0, maxVisibleUsers);
  // 省略されたユーザー数
  const hiddenCount = users.length - maxVisibleUsers;
  
  return (
    <div className="flex items-center">
      {/* 表示するユーザー画像 */}
      <div className="flex -space-x-2">
        {visibleUsers.map((user, index) => (
          <div 
            key={user.id || index} 
            className="relative rounded-full border-2 border-white w-8 h-8 overflow-hidden"
            style={{ zIndex: 10 - index }} // 重なり順を制御
          >
            <Image
              src={user.image_url || `/api/placeholder/32/32`}
              alt={user.name || `User ${index + 1}`}
              className="w-full h-full object-cover"
              width={32}
              height={32}
            />
          </div>
        ))}
        
        {/* 6人以上の場合に「他X人」ボタンを表示 */}
        {!showAll && users.length > maxVisibleUsers && (
          <div 
            className="relative rounded-full border-2 border-white w-8 h-8 bg-gray-200 flex items-center justify-center cursor-pointer"
            onClick={() => setShowAll(true)}
            style={{ zIndex: 0 }}
          >
            <span className="text-xs font-medium text-gray-600">+{hiddenCount}</span>
          </div>
        )}
      </div>
      
      {/* すべて表示/折りたたむボタン */}
      {users.length > maxVisibleUsers && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="ml-2 text-xs text-blue-600 hover:underline"
        >
          {showAll ? '折りたたむ' : 'すべて表示'}
        </button>
      )}
    </div>
  );
};
