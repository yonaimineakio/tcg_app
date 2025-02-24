'use client';

import React, { useState } from 'react';

interface EventDetails {
  id: string;
  store: string;
  title: string;
  description: string;
  startDateTime: string; // 例: '2025-02-21T15:00'
  endDateTime: string;   // 例: '2025-02-21T17:00'
  recurring: boolean;
}

// サンプルのイベントデータ
const sampleEvents: EventDetails[] = [
  {
    id: 'event1',
    store: 'store1',
    title: '店舗1のイベント1',
    description: '店舗1におけるイベント1の詳細',
    startDateTime: '2025-02-21T15:00',
    endDateTime: '2025-02-21T17:00',
    recurring: false,
  },
  {
    id: 'event2',
    store: 'store1',
    title: '店舗1のイベント2',
    description: '店舗1におけるイベント2の詳細',
    startDateTime: '2025-03-01T10:00',
    endDateTime: '2025-03-01T12:00',
    recurring: true,
  },
  {
    id: 'event3',
    store: 'store2',
    title: '店舗2のイベント1',
    description: '店舗2におけるイベント1の詳細',
    startDateTime: '2025-04-01T10:00',
    endDateTime: '2025-04-01T12:00',
    recurring: false,
  },
];

export default function Page() {
  const [selectedStore, setSelectedStore] = useState<string>('store1');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState('');
  const [endDateTime, setEndDateTime] = useState('');
  const [isRecurring, setIsRecurring] = useState(false);

  // 店舗選択に応じてイベントをフィルター
  const availableEvents = sampleEvents.filter(event => event.store === selectedStore);

  // 店舗変更時の処理
  const handleStoreChange = (store: string) => {
    setSelectedStore(store);
    // 店舗変更時はイベント選択やフォーム内容をリセット
    setSelectedEventId(null);
    setTitle('');
    setDescription('');
    setStartDateTime('');
    setEndDateTime('');
    setIsRecurring(false);
  };

  // イベント選択時の処理
  const handleEventSelect = (eventId: string) => {
    const event = availableEvents.find(ev => ev.id === eventId);
    if (event) {
      setSelectedEventId(eventId);
      setTitle(event.title);
      setDescription(event.description);
      setStartDateTime(event.startDateTime);
      setEndDateTime(event.endDateTime);
      setIsRecurring(event.recurring);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const updatedEventData = {
      store: selectedStore,
      eventId: selectedEventId,
      title,
      description,
      startDateTime,
      endDateTime,
      recurring: isRecurring,
    };
    console.log("更新されたイベントデータ:", updatedEventData);
    // API呼び出し等の更新処理を実装してください
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">イベント編集</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 店舗選択トグル */}
        <div>
          <label className="block font-medium mb-1">店舗選択</label>
          <div className="flex space-x-2">
            <button
              type="button"
              className={`px-4 py-2 border rounded ${
                selectedStore === 'store1'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-black'
              }`}
              onClick={() => handleStoreChange('store1')}
            >
              店舗1
            </button>
            <button
              type="button"
              className={`px-4 py-2 border rounded ${
                selectedStore === 'store2'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white text-black'
              }`}
              onClick={() => handleStoreChange('store2')}
            >
              店舗2
            </button>
          </div>
        </div>

        {/* イベント選択トグル */}
        <div>
          <label className="block font-medium mb-1">イベント選択</label>
          <div className="flex space-x-2">
            {availableEvents.length > 0 ? (
              availableEvents.map((ev) => (
                <button
                  key={ev.id}
                  type="button"
                  className={`px-4 py-2 border rounded ${
                    selectedEventId === ev.id
                      ? 'bg-green-500 text-white'
                      : 'bg-white text-black'
                  }`}
                  onClick={() => handleEventSelect(ev.id)}
                >
                  {ev.title}
                </button>
              ))
            ) : (
              <span className="text-gray-500">該当するイベントはありません</span>
            )}
          </div>
        </div>

        {/* タイトル入力フォーム */}
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            タイトル
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="イベントタイトル"
            required
          />
        </div>

        {/* 詳細入力フォーム */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            詳細
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="イベントの詳細情報"
            rows={4}
          ></textarea>
        </div>

        {/* 日時設定 */}
        <div>
          <label className="block font-medium mb-1">日時設定</label>
          <div className="flex items-center space-x-2">
            <input
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              className="border rounded px-3 py-2"
              required
            />
            <span>〜</span>
            <input
              type="datetime-local"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* 繰り返し入力設定ボタン */}
        <div>
          <button
            type="button"
            className={`px-4 py-2 border rounded ${
              isRecurring ? 'bg-green-500 text-white' : 'bg-white text-black'
            }`}
            onClick={() => setIsRecurring(!isRecurring)}
          >
            {isRecurring ? '繰り返し設定解除' : '繰り返し設定'}
          </button>
        </div>

        {/* 送信ボタン */}
        <div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
            更新
          </button>
        </div>
      </form>
    </div>
  );
}
