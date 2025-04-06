import { useEffect, useState } from 'react';
import { getNotifications } from '@/lib/data';
import { Notification } from '@/lib/definitions';
import Image from 'next/image';

type NotificationModalProps = {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationModal({ isOpen, onClose }: NotificationModalProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      const notifications = await getNotifications();
      if (notifications) {
        setNotifications(notifications);
      }
    }
    fetchNotifications();
  }, []);
  
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md mx-4 max-h-[80vh] flex flex-col">
        {/* ヘッダー */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">お知らせ</h2>
        </div>
        
        {/* 通知コンテンツ - スクロール可能エリア */}
        <div className="px-6 py-4 overflow-y-auto flex-grow">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center my-8">通知はありません</p>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification) => (
                <div key={notification.id} className="pb-4 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-start mb-2">
                    <div className="flex-shrink-0 mr-3">
                      <Image src={notification.profile_image_url || "/administorator.png"} alt="通知" width={45} height={45} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-lg text-gray-800 truncate">{notification.summary}</h3>
                      <p className="text-gray-600 mt-1 whitespace-pre-line break-words text-sm">
                        {notification.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* フッター */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          <button 
            onClick={onClose}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
}