'use client';

import React from 'react';
import { useActionState } from 'react';
import { createEvent } from '@/lib/actions';
import { Store } from '@/lib/definitions';

export default function Form({stores}: {stores: Store[]}) {
  // フォームの各入力値を管理する state
  const initialStores = stores;
//   const [initialStores, setInitialStoresStores] = useState<Store[]>(stores);
//   const [loading, setLoading] = useState(true);
  const [ errorMessage, formAction, isPending] = useActionState(
    createEvent, undefined
  )


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
            name='description'
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
              id="start"
              name="start"
              type="datetime-local"
              className="border rounded px-3 py-2"
              required
            />
            <span>〜</span>
            <input
              id="end"
              name="end"
              type="datetime-local"
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* 繰り返し入力設定ボタン */}
  
        <div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
          { isPending ? '送信中‥‥' : '確定'}
          </button>
        </div>
        {errorMessage && (
            <p className="mt-2 text-red-500 text-center">{errorMessage}</p>
          )}
      </form>
    </div>
  );
}
