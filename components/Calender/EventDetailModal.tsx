'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { EnrichedEvent, UserAccount } from '@/lib/definitions';
import parseDaytoDisplay from "@/lib/utils";
import Image from 'next/image';
import { getParticipantUserAccounts, upsertParticipantEvent } from '@/lib/data';
import { useSession } from 'next-auth/react';
import UserImageDisplay from '@/components/UserImageDisplay';


type EventDetailModalProps = {
  event: EnrichedEvent;
  onClose: () => void;
}



export default function EventDetailModal({ event, onClose }: EventDetailModalProps) {

 const { data: session } = useSession();
 const [ participantUserAccounts, setParticipantUserAccounts] = useState<UserAccount[]>([]);
 const [ isParticipant, setIsParticipant] = useState(false);
  useEffect(() => {
    // モーダル表示中は背景のスクロールを無効化
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const fetchParticipantUserAccounts = async () => {
      const userAccounts = await getParticipantUserAccounts(event.id);
      console.log("ユーザー情報", userAccounts);
      setParticipantUserAccounts(userAccounts || []);
    };
    fetchParticipantUserAccounts();
  }, [event.id]);

  useEffect(() => {
    const userParticipantStatus = participantUserAccounts.some(
      user => user.provider_account_id === session?.user.providerAccountId
    );
    setIsParticipant(userParticipantStatus);
    console.log("isParticipant", userParticipantStatus);
  }, [participantUserAccounts ,session?.user.providerAccountId]);
  

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
          <Image width={128} height={128}className="w-10 h-10 rounded-full object-cover" src={event.extendedProps.storeImage} alt="Store" />
        </div>
        <div className="text-center mt-2">
          <p className="text-sm font-semibold">{event.title}</p>
        </div>

        <div className="bg-black text-white text-center mt-4 text-lg font-bold w-full">
          {parseDaytoDisplay(event.start)}
        </div>

        {/* <!-- 詳細リスト --> */}
        <div className="mt-4 space-y-10 text-sm text-center">
          <p>{event.description}</p>
        </div>

        {/* <!-- ボタン群 --> */}
        <div className="mt-4 flex flex-col space-y-2">
          {/* <!-- 店舗ページボタン --> */}
          <button className="flex-1 py-2 bg-gray-300 rounded text-center text-sm">
            <Link href={`/user/stores/${event.extendedProps.storeId}`}>
              店舗ページ
            </Link>
          </button>
          {/* <!-- 興味あり --> */}
          <button onClick={
            async () => {
              if (event.id && session?.user.providerAccountId) {
                if (!isParticipant) {
                  await upsertParticipantEvent({
                    event_id: event.id,
                    provider_account_id: session.user.providerAccountId || '',
                    status: 'interested'
                  });
                  setIsParticipant(true);
                } else {
                  await upsertParticipantEvent({
                    event_id: event.id,
                    provider_account_id: session.user.providerAccountId || '',
                    status: 'pending'
                  });
                  setIsParticipant(false);
                }
              }
            }

           } className={`flex-1 py-2 ${isParticipant ? 'bg-green-300' : 'bg-yellow-300'} rounded text-center text-sm`}>
            興味あり
          </button>
          <div className="flex flex-row space-x-2 justify-center items-center">
              <UserImageDisplay users={participantUserAccounts} />
          </div>
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

  );
}
