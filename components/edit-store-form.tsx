'use client';

import React  from 'react';
import { useActionState } from 'react';
import { updateStore, deleteStore } from '@/lib/actions';
import { useState } from 'react';
import { useEffect } from 'react';
import { Store } from '@/lib/definitions';
import { getStore } from '@/lib/data';

export default function Form({stores}: {stores: Store[]} ) {
  const [selectedstore_id, setSelectedstore_id] = useState<string>(''); 
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const updateStoreWithId = updateStore.bind(null ,selectedstore_id);
  const [errorMessage, formAction, isPending] = useActionState(updateStoreWithId, undefined);

  useEffect(() => {
    if (selectedstore_id === '') {
      setSelectedStore(null);
      return;
    }
    getStore(selectedstore_id).then((data) => {
      if (data) {
        setSelectedStore(data);
      }
    }
  )},[selectedstore_id]);

  const handleDelete = async () => {
    if (selectedstore_id) {
      await deleteStore(selectedstore_id);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">店舗編集</h1>
      <form
        className="space-y-4"
        action={formAction}
      >
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
            onChange={(e) => {
              setSelectedstore_id(e.target.value);
            }}
          >
            <option value="">選択してください</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))} 
          </select>
        </div>

        {/* 店舗名 */}
        <div>
          <label htmlFor="name" className="block font-medium mb-1">
            店舗名
          </label>
          <input
            id="name"
            name="name"
            defaultValue={selectedStore?.name}
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
            defaultValue={selectedStore?.description}
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
              defaultValue={selectedStore?.business_start}
              type="time"
              className="border rounded px-3 py-2"
              required
            />
            <span>〜</span>
            <input
              id="business_end"
              name="business_end"
              defaultValue={selectedStore?.business_end}
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
            defaultValue={selectedStore?.address}
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

        {/* 送信ボタンと削除ボタン */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isPending ? '送信中...' : '確定'}
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={!selectedstore_id}
            className={`flex-1 px-4 py-2 rounded ${
              selectedstore_id 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            削除
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
