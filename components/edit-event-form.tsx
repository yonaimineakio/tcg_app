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
  const [ errorMessage, formAction, isPending] = useActionState(
    updateEventWithId, undefined
  ) 

  useEffect(() => {
    getEventsByStore(selectedstore_id).then((data) => {
      if (data) {
        console.log(data)
        console.log("selected")
        setSelectedEvents(data);
      }
      setselectedEventId('');
      setSelectedEvent(null)
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
            value={selectedstore_id}
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
                {event.title}
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
          <label className="block font-medium mb-1">開始日時</label>
          <div className="flex items-center space-x-2">
            <input
              id="start"
              name="start"
              defaultValue={selectedEvent?.startAt
              }
              type="datetime-local"
              className="border rounded px-3 py-2"
              required
              // required={!isrrule} // 繰り返し設定が有効な場合は不要
            />
          </div>
        </div>
        <input
          type="hidden"
          id="isrrule"
          name="isrrule"
          value={selectedEvent?.isrrule ? "true" : "false"}
        />

    {/* 繰り返し設定
    <div>
          <div className="flex items-center space-x-2">
          <label className="font-medium mb-1">繰り返し</label>
            <input
              id="isrrule"
              name="isrrule"
              type="checkbox"
              checked={isrrule}
              className="border rounded px-3 py-2"
              onChange={(e) => setIsRrule(e.target.checked)}
            />
          </div>
    </div> *
          {/* {isrrule && (
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
                  defaultValue={rruleData?.dtstart}
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
                  defaultValue={rruleData?.until}
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
                  defaultValue={rruleData?.byday}
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
                  defaultValue={rruleData?.interval}
                  type="number"
                  className="border rounded px-1 py-2"
                  required={isrrule} 
                />
              </div>
            </div>
          )}
        </div>
    */}

      
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