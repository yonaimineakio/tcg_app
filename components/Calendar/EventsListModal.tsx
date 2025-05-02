'use client';

import React, { useEffect, useState } from 'react';
import { EnrichedEvent } from '@/lib/definitions';
import { parseDaytoDisplay } from "@/lib/calendar/formatters";
import EventDetailModal from '@/components/Calender/EventDetailModal';
import Image from 'next/image';

type EventListModalProps = {
  events: EnrichedEvent[];
  onClose: () => void;
};

export default function EventListModal({ events, onClose }: EventListModalProps) {
  // slideIn state: コンポーネントマウント後にスライドアップをトリガーする
  const [slideIn, setSlideIn] = useState(false);
  const [eventDetailModal, setEventDetailModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EnrichedEvent | null>(null);

  useEffect(() => {
    // 背景スクロールをロック
    document.body.style.overflow = 'hidden';
    // 少し待ってからスライドインを開始
    const timeout = setTimeout(() => setSlideIn(true), 50);
    return () => {
      document.body.style.overflow = '';
      clearTimeout(timeout);
    };
  }, []);



  return (
  <div>
    <div className="fixed inset-0 z-10">
      {/* 背景オーバーレイ */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>
      {/* 下からスライドアップするモーダル */}
      <div
        className={`absolute bottom-0 w-full bg-white rounded-t-lg p-4 transform transition-transform duration-300 ease-out ${
          slideIn ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-md mx-auto p-4">
          <h2 className="text-2xl font-bold mb-4 text-center"> DETAILS</h2>
          <div className="space-y-4">
        {events.length === 0 ? (
          <p>予定はありません。</p>
        ) : (
          <ul>
            {events.map((event) => (
              <li key={event.id} className="border-b py-2" onClick={ () => {setEventDetailModal(true); setSelectedEvent(event)}}>
                  <div className='bg-white rounded-md shadow p-4'>
                    <div className='flex justify-between items-center'>
                      <p className="text-sm font-semibold">{parseDaytoDisplay(event.start)}</p>
    
                    <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03
                              L22 9.24l-7.19-.61L12 2 9.19 8.63
                              2 9.24l5.46 4.73L5.82 21z"/>
                    </svg>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <Image width={128} height={128} className="w-10 h-10 rounded-full object-cover" src={event.extendedProps.storeImage} alt="Store" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold">{event.title}</p>
                      </div>
                      <button className="text-gray-600 text-xl">&gt;</button>
                  </div>                
              </li>
            ))}
          </ul>
        )}
            </div>
            <div className="mt-4 text-center">
              <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-300 rounded"
            >
              BACK
            </button>
            </div>
        </div>
      </div>
    </div>
    {eventDetailModal && (
      <EventDetailModal
        event={selectedEvent!}
        onClose={() => setEventDetailModal(false)}
      />
    )};
  </div>
  );
}
