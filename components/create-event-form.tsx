'use client';

import React, { useState } from 'react';
import { useActionState } from 'react';
import { createEvent } from '@/lib/actions';
import { Store } from '@/lib/definitions';

export default function Form({ stores }: { stores: Store[] }) {
  const initialStores = stores;
  const [isrrule, setRrule] = useState<boolean>(false);
  const [selectedstore_id, setSelectedstore_id] = useState<string>('');
  const createEventWithStoreId = createEvent.bind(null, selectedstore_id);
  const [errorMessage, formAction, isPending] = useActionState(createEventWithStoreId, undefined);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">イベント登録</h1>
      <form className="space-y-4" action={formAction}>
        {/* 店舗選択 */}
        <div>
          <label htmlFor="store" className="block font-medium mb-1">
            店舗
          </label>
          <select
            id="store"
            name="store"
            className="w-full border rounded px-3 py-2"
            required
            onChange={(e) => setSelectedstore_id(e.target.value)}
          >
            <option value="">選択してください</option>
            {initialStores.map((store: Store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>

        {/* タイトル入力フォーム */}
        <div>
          <label htmlFor="title" className="block font-medium mb-1">
            タイトル
          </label>
          <input
            id="title"
            type="text"
            name="title"
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
            name="description"
            className="w-full border rounded px-3 py-2"
            placeholder="イベントの詳細情報"
            rows={4}
          ></textarea>
        </div>

        {/* 日時設定 */}
        <div hidden={ isrrule ? true : false}>
          <label className="block font-medium mb-1">開始日時</label>
          <div className="flex items-center space-x-2">
            <input
              id="start"
              name="start"
              type="datetime-local"
              className="border rounded px-3 py-2"
              required={!isrrule} // 繰り返し設定が有効な場合は不要
            />
          </div>
        </div>

        {/* 繰り返し設定 */}
        <div>
          <div className="flex items-center space-x-2">
          <label className="font-medium mb-1">繰り返し</label>
            <input
              id="isrrule"
              name="isrrule"
              type="checkbox"
              // value="yes"
              className="border rounded px-3 py-2"
              onChange={(e) => setRrule(e.target.checked)}
            />
          </div>
          {isrrule && (
            <div className="mt-4 p-1 border rounded bg-gray-50">
              <div className="mb-4 flex items-center space-x-2">
                <label className="font-medium mb-1">繰り返し設定</label>
                <select id="freq" name="freq" className="border rounded px-3 py-2">
                  <option value="weekly">週次</option>
                </select>
              </div>
              <div className="mb-4 flex items-center space-x-2">
                <label htmlFor="dtstart" className="block font-medium mb-3">
                  開始日時
                </label>
                <input
                  id="dtstart"
                  name="dtstart"
                  type="datetime-local"
                  className="border rounded px-3 py-2"
                  required={isrrule} 
                />
              </div>
              <div className="mb-4 flex items-center space-x-2">
                <label htmlFor="until" className="block font-medium mb-1">
                  終了日時
                </label>
                <input
                  id="until"
                  name="until"
                  type="date"
                  className="border rounded px-3 py-2"
                  required={isrrule} 
                />
              </div>
              <div className="mb-4 flex items-center space-x-2">
                <label htmlFor="byweekday" className="block font-medium mb-1">
                  曜日指定
                </label>
                <select
                  name="byweekday"
                  id="byweekday"
                  className="border rounded px-3 py-2 w-32 h-13"
                  required={isrrule} 
                  multiple
                >
                  <option value="MO">月曜日</option>
                  <option value="TU">火曜日</option>
                  <option value="WE">水曜日</option>
                  <option value="TH">木曜日</option>
                  <option value="FR">金曜日</option>
                  <option value="SA">土曜日</option>
                  <option value="SU">日曜日</option>
                </select>
              </div>
              <div>
                <label htmlFor="interval" className="font-medium mb-1">
                  繰り返し間隔
                </label>
                <input
                  id="interval"
                  name="interval"
                  type="number"
                  className="border rounded px-1 py-2"
                  required={isrrule} 
                />
              </div>
            </div>
          )}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
          {isPending ? '送信中‥‥' : '確定'}
        </button>
        {errorMessage && (
          <p className="mt-2 text-red-500 text-center">{errorMessage}</p>
        )}
      </form>
    </div>
  );
}
