'use client'
import { Store, Notification} from '@/lib/definitions';
import React, { useState, useEffect } from 'react';
import { getNotificationsByStore, getNotification } from '@/lib/data';
import { updateNotification } from '@/lib/actions';
import { useActionState } from 'react';


export default function Form({stores}: {stores: Store[]}) {
    const [selectedstoreId, setSelectedstorId] = useState<string>('');
    const [notifications, setNotifications] = useState<Notification[] | null>(null);
    const [selectedNotificationId, setSelectedNotificationId] = useState<string>('');
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [notify , setNotify] = useState<boolean>(selectedNotification ? selectedNotification.notify : false);
    const updateNotificationWithId = updateNotification.bind(null, selectedNotificationId);
    const [ errorMessage, formAction, isPending] = useActionState(
        updateNotificationWithId, undefined
    );

    useEffect(() => {
        if (selectedstoreId === '') {
            setNotifications(null);
            return;
        }
        console.log(selectedstoreId)

        getNotificationsByStore(selectedstoreId).then((data) => {
            if (data) {
                setNotifications(data);
            }
        });

    }, [selectedstoreId]);

    useEffect(() => {
        if (selectedNotificationId === '') {
            setSelectedNotification(null);
            return;
        }
        console.log(selectedNotificationId)
        getNotification(selectedNotificationId).then((data) => {
            if (data) {
                setSelectedNotification(data);
            }    

    })}, [selectedNotificationId]);

    useEffect(() => {
        if (selectedNotification) {
            setNotify(selectedNotification.notify);
        }
    }, [selectedNotification]);


    return (
    <div className="max-w-xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">マイページ編集</h1>
        <form className="space-y-4" action={formAction}>
        { /* 店舗選択 */ }
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
                setSelectedstorId(e.target.value);
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
        { /* 掲示番号選択 */ }
        <div>
            <label htmlFor="store" className="block font-medium mb-1">
              掲示板号
            </label>
            <select
              id="store"
              name="store"
              className="w-full border rounded px-3 py-2"
              required
              onChange={(e) => {
                setSelectedNotificationId(e.target.value);
              }}
            >
              <option value="">選択してください</option>
              {notifications?.map((notification) => (
                <option key={notification.id} value={notification.id} >
                { "掲示板号:" + notification.index}{" 掲示文言: " +notification.summary}
                </option>
              ))} 
            </select>
        </div>

         {/* 文字入力フォーム */}
        <div>
            <label htmlFor="description" className="block font-medium mb-1">
                詳細
            </label>
            <textarea
                id="description"
                name='description'
                defaultValue={selectedNotification?.description}
                className="w-full border rounded px-3 py-2"
                placeholder="イベントの詳細情報"
                rows={4}
            ></textarea>
        </div>
        {/* 通知アイコン */}
        <div>
          <label htmlFor="icon" className="block font-medium mb-1">
            通知画像
          </label>
          <input
            id="icon"
            name="icon"
            type="file"
            accept="image/png, image/jpeg"
            className="w-full border rounded px-3 py-2"
          />
        </div>


        {/* 通知設定 */}
        <div>
            <label htmlFor="notify" className="block font-medium mb-1">
            通知設定
            </label>
            <input
                id="notify"
                name="notify"
                // defaultchecked={false}
                checked={notify}
                onChange={(e) => setNotify(e.target.checked)}
                type="checkbox"
                className="border rounded px-3 py-2"/>
       </div>
        <div>
            <label htmlFor="summary" className="block font-medium mb-1">
                通知文言
            </label>
            <textarea
                id="summary"
                name='summary'
                defaultValue={selectedNotification?.summary}
                className="w-full border rounded px-3 py-2"
                placeholder="通知文言"
                rows={2}
            ></textarea>
        </div>
                {/* 送信ボタン */}
                <div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded"
          >
            {isPending ? '送信中...' : '確定'}
          </button>
        {/* エラーメッセージ表示 */}
      {errorMessage && (
        <p className="mt-2 text-red-500 text-center">{errorMessage}</p>
      )}
        </div>
    </form>
</div>
    )

}