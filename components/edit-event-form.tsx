'use client';

import React, { useState,useEffect } from 'react';
import { Store, CalendarEvent } from '@/lib/definitions';
import { getEventsByStore, getEvent } from '@/lib/data';
import { updateEvent } from '@/lib/actions';
import { useActionState } from 'react';



export default function Form({stores}: {stores: Store[]}) {

  const [selectedstore_id, setSelectedstore_id] = useState<string>('');
  const [selectedEvents, setSelectedEvents] = useState<CalendarEvent[]>([]);
  const [selectedEventId, setselectedEventId ] = useState<string>('');
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const updateEventWithId = updateEvent.bind(null, selectedEventId)
  // const [errorMessage, formAction, isPending] = useActionState(
  //   updateEventWithId, undefined
  // ) 
  const [ errorMessage, formAction, isPending] = useActionState(
    updateEventWithId, undefined
  ) 
  useEffect(() => {
    getEventsByStore(selectedstore_id).then((data) => {
      if (data) {
        setSelectedEvents(data);
      }
    }

  )}, [selectedstore_id])

  useEffect(() => {
    if (selectedEventId === '') {
      setSelectedEvent(null);
      return;
    }
    console.log(selectedEventId)
    getEvent(selectedEventId).then((data) => {
      if (data) {
        setSelectedEvent(data);
      }
  })}, [selectedEventId])
  


  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">イベント編集</h1>
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

        {/* イベント選択 */}
        <div>
          <label htmlFor="event" className="block font-medium mb-1">
            イベント
          </label>
          <select
            id="event"
            name="event"
            className="w-full border rounded px-3 py-2"
            required
            onChange={(e) => {
              setselectedEventId(e.target.value);
            }}
          >
            <option value="">選択してください</option>
            {selectedEvents.map((event) => (
              <option key={event.id} value={event.id}>
                {event.startAt + " ~ " + event.endAt + " " + event.title}
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
            defaultValue={ selectedEvent?.title}
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
            defaultValue={selectedEvent?.description}
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
              defaultValue={selectedEvent?.startAt
              }
              type="datetime-local"
              className="border rounded px-3 py-2"
              required
            />
            <span>〜</span>
            <input
              id="end"
              name="end"
              defaultValue={selectedEvent?.endAt}
              type="datetime-local"
              className="border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* 繰り返し入力設定ボタン */}
  
        <div>
          <button type="submit" className="w-full bg-blue-500 text-white px-4 py-2 rounded">
          {isPending ? '送信中‥‥' : '確定'}
          </button>
        </div>
              {/* エラーメッセージ表示 */}
      {errorMessage && (
        <p className="mt-2 text-red-500 text-center">{errorMessage}</p>
      )}
      </form>

    </div>
)}
