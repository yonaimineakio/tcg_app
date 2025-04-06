// components/StoreCreationForm.tsx
'use client';

import React from 'react';
import { useActionState } from 'react';
import { createStore } from '@/lib/actions';

export default function Form() {
  // createStore の呼び出し結果を useActionState で管理
  const [errorMessage, formAction, isPending] = useActionState(createStore, undefined);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">店舗作成</h1>
      <form
        className="space-y-4"
        action={formAction}
      >
        {/* 店舗名 */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            店舗名
          </label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="店舗名を入力"
            required
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* 店舗詳細情報 */}
        <div>
          <label htmlFor="description" className="block font-medium mb-1">
            店舗詳細情報
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="店舗の詳細情報を入力"
            rows={4}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* 営業時間設定 */}
        <div>
          <label className="block font-medium mb-1">営業時間設定</label>
          <div className="flex items-center space-x-2">
            <input
              id="business_start"
              name="business_start"
              type="time"
              className="border rounded px-3 py-2"
              required
            />
            <span>〜</span>
            <input
              id="business_end"
              name="business_end"
              type="time"
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* 住所 */}
        <div>
          <label htmlFor="address" className="block font-medium mb-1">
            住所
          </label>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="住所を入力"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* 店舗アイコン */}
        <div>
          <label htmlFor="icon" className="block font-medium mb-1">
            店舗アイコン
          </label>
          <input
            id="icon"
            name="icon"
            type="file"
            accept="image/png, image/jpeg"
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* 送信ボタン */}
        <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isPending ? '送信中...' : '確定'}
          </button>
        </div>
      {/* エラーメッセージ表示 */}
      {errorMessage && (
        <p className="mt-2 text-red-500 text-center">{errorMessage}</p>
      )}
      </form>
    </div>
  );
}
