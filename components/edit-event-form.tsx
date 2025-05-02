'use client';

import React, { useState, useEffect } from 'react';
import { Store, CalendarEvent, EventTypes } from '@/lib/definitions';
import { getEventsByStore, getEvent, getEventTypes } from '@/lib/data';
import { updateEvent, deleteEvent } from '@/lib/actions';
import { useActionState } from 'react';

type EventFormState = {
  store_id: string;
  events: CalendarEvent[];
  event_id: string;
  event: CalendarEvent | null;
  event_types: EventTypes[];
  event_type: string;
};

export default function Form({ stores }: { stores: Store[] }) {
  const [formState, setFormState] = useState<EventFormState>({
    store_id: '',
    events: [],
    event_id: '',
    event: null,
    event_types: [],
    event_type: '',
  });

  const updateEventWithId = updateEvent.bind(null, formState.event_id);
  const [errorMessage, formAction, isPending] = useActionState(
    updateEventWithId,
    undefined
  );

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        const data = await getEventTypes();
        if (data) {
          setFormState(prev => ({ ...prev, event_types: data }));
        }
      } catch (error) {
        console.error('Failed to fetch event types:', error);
      }
    };
    fetchEventTypes();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      if (formState.store_id === '') {
        setFormState(prev => ({ ...prev, events: [], event_id: '', event: null }));
        return;
      }

      try {
        const data = await getEventsByStore(formState.store_id);
        if (data) {
          setFormState(prev => ({
            ...prev,
            events: data,
            event_id: '',
            event: null,
          }));
        } else {
          setFormState(prev => ({
            ...prev,
            events: [],
            event_id: '',
            event: null,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
        setFormState(prev => ({
          ...prev,
          events: [],
          event_id: '',
          event: null,
        }));
      }
    };

    fetchEvents();
  }, [formState.store_id]);

  useEffect(() => {
    if (formState.event_id === '') {
      setFormState(prev => ({ ...prev, event: null }));
      return;
    }
    console.log(formState.event_id)
    getEvent(formState.event_id).then((data) => {
      if (data) {
        setFormState(prev => ({ ...prev, event: data, event_type: data.event_type }));
      }
    })
  }, [formState.event_id])

  const handleDelete = async () => {
    if (formState.event_id) {
      await deleteEvent(formState.event_id);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">イベント編集</h1>
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
            value={formState.store_id}
            onChange={(e) => {
              setFormState(prev => ({ ...prev, store_id: e.target.value }));
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
              setFormState(prev => ({ ...prev, event_id: e.target.value }));
            }}
          >
            <option value="">選択してください</option>
            {formState.events.map((event) => (
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
            defaultValue={formState.event?.title}
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
            defaultValue={formState.event?.description}
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
              defaultValue={formState.event?.startAt}
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
          value={formState.event?.isrrule ? "true" : "false"}
        />
        <div>

          <label className="block font-medium mb-1">イベント属性</label>
          <p>{formState.event_type}</p>
          <select
            id="event_type"
            name="event_type"
            className="w-full border rounded px-3 py-2"
            value={formState.event_type}
            onChange={(e) => {
              setFormState(prev => ({ ...prev, event_type: e.target.value }));
            }}
            required
          >
            {formState.event_types.map((eventType) => (
              <option key={eventType.name} value={eventType.name}  >
                {eventType.name}
              </option>
            ))}
          </select>
        </div>

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
            disabled={!formState.event_id}
            className={`flex-1 px-4 py-2 rounded ${
              formState.event_id 
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
)}