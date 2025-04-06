'use client';

import Image from 'next/image';
import { getStore, getNotificationsByStore } from '@/lib/data';
import { useEffect,useState} from 'react';
import TruncatedDescription from '@/components/TruncatedDescription'; // パスは実際のファイル構造に合わせて調整してください
import { Store, Notification } from '@/lib/definitions';
export default function StoreMypage(params: {id: string}) {
  const id = params.id
  console.log("id", id);
  const [store, setStore] = useState<Store | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const store = await getStore(id);
      const notifications = await getNotificationsByStore(id);
      setStore(store);
      setNotifications(notifications || []);
    };
    fetchData();
  }, [id]);

  if (!store) {
    return 
  }
  
  return (
    <div className="h-screen w-full flex flex-col items-center justify-start pt-5 gap-4">
      {/* 共通の横幅を持った枠 */}
      <div className="flex flex-col sm:flex-row items-stretch w-full max-w-4xl">
        <div className="flex w-full sm:w-1/4 bg-white rounded-lg justify-center items-center p-4">
          <Image src={store.image_url || ''} alt={store.name} width={100} height={100} className="object-contain" />
        </div>
        <div className="flex flex-col w-full sm:w-3/4 bg-white rounded-lg p-4">
          <h1 className="text-2xl font-bold mb-4 inline-block underline decoration-blue-500 underline-offset-8">
            {store.name}
          </h1>
          <TruncatedDescription text={store.description} maxLength={150} />
        </div>
      </div>

      {/* 通知リスト */}
      <div className="w-full max-w-4xl bg-white rounded-lg p-4 flex flex-col gap-4">
        { !notifications || notifications.length === 0 ? (
          <div className="text-center text-gray-700">
            通知はありません
          </div>
        ) : (
          notifications.map((notification) => (
            <div key={notification.id} className="mb-2 px-2 py-4 shadow-md rounded-lg">
              <h1 className="text-lg font-bold text-left pl-4 mb-4 inline-block underline decoration-blue-500 underline-offset-8">
                {notification.summary}
              </h1>
              <div className="flex flex-col lg:flex-row items-center">
                <div className="w-full lg:w-1/4 flex justify-center mb-4 lg:mb-0">
                  <Image 
                    src={notification.profile_image_url || "/administorator.png"} 
                    alt="画像なし" 
                    width={120} 
                    height={120} 
                    className="rounded-full"
                  />
                </div>
                <div className="w-full lg:w-3/4 px-4">
                  <TruncatedDescription text={notification.description} maxLength={150} />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}