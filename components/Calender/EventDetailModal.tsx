'use client';
import React, { useEffect } from 'react';
import { CalendarDisplayEventsWithStoreInfo } from '@/lib/definitions';
import parseDaytoDisplay from "@/lib/utils";
import Image from 'next/image';


type EventDetailModalProps = {
  event: CalendarDisplayEventsWithStoreInfo;
  onClose: () => void;
};

export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {
  useEffect(() => {
    // モーダル表示中は背景のスクロールを無効化
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  console.log("イベント詳細モーダル")

  return (
  <div className='fixed inset-0 z-30 flex items-center justify-center'>
    {/* 背景オーバーレイ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
    <div className="relative bg-white p-4 rounded-lg max-w-md w-full h-screen z-40">
      <header className="bg-black text-white text-center py-3 text-xl font-bold">
        TCG HUB
      </header>
      <main className="max-w-md mx-auto p-4">
        <div className="flex justify-center mt-4">
          <Image width={128} height={128}className="w-10 h-10 rounded-full object-cover" src={event.store_image!} alt="Store" />
        </div>
        <div className="text-center mt-2">
          <p className="text-sm font-semibold">{event.store_name}</p>
        </div>

        <div className="bg-black text-white text-center mt-4 text-lg font-bold w-full">
          {parseDaytoDisplay(event.start)}
        </div>

        {/* <!-- 詳細リスト --> */}
        <div className="mt-4 space-y-1 text-sm text-center">
          <p>{event.description}</p>
        </div>

        {/* <!-- ボタン群 --> */}
        <div className="mt-4 flex flex-col space-y-2">
          {/* <!-- 店舗ページボタン --> */}
          <button className="flex-1 py-2 bg-gray-300 rounded text-center text-sm">
            店舗ページ
          </button>
          {/* <!-- 興味ありボタン --> */}
          <button className="flex-1 py-2 bg-yellow-300 rounded text-center text-sm">
            興味あり
          </button>
        </div>

        {/* <!-- 戻るボタン --> */}
        <div className="mt-6 flex justify-center">
        <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
          BACK
        </button>
      </div>
    </main>
  </div>
</div>

    // <div className="fixed inset-0 z-50 flex items-center justify-center">
    //   {/* 背景オーバーレイ */}
    //   <div
    //     className="absolute inset-0 bg-black bg-opacity-50"
    //     onClick={onClose}
    //   ></div>
    //   {/* モーダル本体 */}
    //   <div className="relative bg-white p-4 rounded-lg max-w-md w-full z-10">
    //     <div className="flex justify-between items-center mb-4">
    //       <h2 className="text-xl font-bold">イベント詳細</h2>
    //       <button
    //         onClick={onClose}
    //         className="text-gray-600 text-2xl leading-none"
    //       >
    //         &times;
    //       </button>
    //     </div>
    //     <div>
    //       <h3 className="text-lg font-semibold">{event.title}</h3>
    //       <p className="mt-2 text-sm text-gray-600">{event.description}</p>
    //       <p className="mt-2">
    //         <strong>開始日時:</strong> 
    //         {/* {parseDaytoDisplay(event.start)} */}
    //       </p>
    //       {/* 必要に応じて追加情報を表示 */}
    //     </div>
    //   </div>
      
    // </div>
  );
}
