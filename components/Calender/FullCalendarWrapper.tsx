'use client';
import jaLocale from "@fullcalendar/core/locales/ja";  // 日本語ロケールをインポート
import FullCalendar from '@fullcalendar/react';
import { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule';
import interactionPlugin from "@fullcalendar/interaction";
import EventListModal from "@/components/Calender/EventsListModal"
import { useState, useEffect} from 'react';
import type { EnrichedEvent, EventTypes } from '@/lib/definitions';
import { getEventByDayWithStoreName, getEventTypes } from "@/lib/data";
import { getEventsWithStoreName } from "@/lib/data";
import Image from 'next/image';

type EventTypeWithColor = EventTypes & { color: string }


export default function Calender() {

  const [events, setEvents] = useState<EnrichedEvent[]>([]);
  // 選択されたイベントタイプを配列で管理
  const [selectedEventTypes, setSelectedEventTypes] = useState<string[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<EnrichedEvent[] | null>(null);
  const [eventListModalVisible, setEventListModalVisible] = useState(false);
  const [eventTypes, setEventTypes] = useState<EventTypeWithColor[] | null>(null);


  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getEventsWithStoreName();
        if (fetchedEvents) {
          setEvents(fetchedEvents.map((event) => ({
            id: event.id,
            title: event.title,
            start: event.start,
            description: event.description,
            extendedProps: {
              storeId: event.store_id,
              storeName: event.store_name,
              storeImage: event.store_image,
              eventType: event.event_type,
              color: "#ffffff",
            }
          })));
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    }
    fetchEvents();

  }, []);

  // 選択されたイベントタイプに基づいてフィルタリングされたイベントを取得
  const getFilteredEvents = () => {
    if (selectedEventTypes.length === 0) {
      return events; // フィルターが選択されていない場合は全てのイベントを表示
    }
    return events.filter(event => 
      selectedEventTypes.includes(event.extendedProps.eventType)
    );
  };

  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvents(null);
    const date = info.event.startStr.substring(0, 10);
    getEventByDayWithStoreName(date).then((data) => {
      if (data) {
        // データを EnrichedEvent[] に変換
        const enrichedData = data.map((event) => ({
          id: event.id,
          title: event.title,
          start: event.start,
          description: event.description,
          extendedProps: {
            storeId: event.store_id,
            storeName: event.store_name,
            storeImage: event.store_image,
            eventType: event.event_type,
            color: eventTypes?.find((eventType) => eventType.name === event.event_type)?.color || '#ffffff'
          }
        }));

        // フィルタリングされたイベントがある場合は、選択されたイベントタイプのみを表示
        if (selectedEventTypes.length > 0) {
          setSelectedEvents(enrichedData.filter(event => 
            selectedEventTypes.includes(event.extendedProps.eventType)
          ));
        } else {
          // フィルタリングされていない場合は全てのイベントを表示
          setSelectedEvents(enrichedData);
        }
      }
    });
    setEventListModalVisible(true);
  };

  // イベントタイプの選択・解除を処理する関数
  const toggleEventTypeFilter = (eventType: EventTypes) => {
    setSelectedEventTypes(prev => {
      const eventTypeName = eventType.name;
      // すでに選択されている場合は、それを削除
      if (prev.includes(eventTypeName)) {
        return prev.filter(type => type !== eventTypeName);
      } 
      // 選択されていない場合は、それを追加
      else {
        return [...prev, eventTypeName];
      }
    });
  };

  useEffect(() => {
    getEventTypes().then((data) => {
      if (data) {
        const eventTypesWithColors = data.map((eventType) => {
          let color;
          switch (eventType.num) {
            case 1:
              color = '#a8fc4e';
              break;
            case 2:
              color = '#f7d149';
              break;
            case 3:
              color = '#e15140';
              break;
            default:
              color = '#ffffff';
          }
          return { ...eventType, color };
        });
        setEventTypes(eventTypesWithColors);
      }
    });
  }, []);

  return (
    <main className="flex-1 p-1 overflow-hidden h-screen w-full flex flex-col">
      <div className="flex flex-row justify-center items-center gap-2 pb-2 overflow-x-auto w-full flex-shrink-0">
        {eventTypes?.map((eventType) => (
          <div key={eventType.num} className="flex flex-row justify-center items-center">
            <span 
              onClick={() => toggleEventTypeFilter(eventType)} 
              className={`h-8 text-center border px-2 py-1 rounded text-xs semi-bold shadow whitespace-nowrap inline-block max-w-full ${
                selectedEventTypes.includes(eventType.name) 
                  ? 'border-black font-bold' 
                  : 'border-gray-300'
              }`}  
              style={{ 
                backgroundColor: eventType.color
              }}
            >
              {eventType.name}
            </span>
          </div>
        ))}
      </div>
      <div className="w-full flex-grow overflow-hidden">
        <FullCalendar
          plugins={[dayGridPlugin, rrulePlugin ,interactionPlugin]}
          initialView="dayGridMonth"
          locales={[jaLocale]}
          locale="ja"
          height="100%"
          headerToolbar={{
            left: 'prev',
            center: 'title',
            right: 'next',
          }}
          titleFormat={{ month: 'long' }}
          events={getFilteredEvents()} 
          eventContent={(eventInfo) => {
            const startTime = new Date(eventInfo.event.startStr).toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
            return (
              <div className="flex items-start gap-1 text-xs w-full break-words overflow-hidden">
                <Image 
                  src={eventInfo.event.extendedProps.storeImage || '/default-store.png'} 
                  alt="store" 
                  width={16}
                  height={16}
                  className="rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <span className="font-bold block truncate sm:whitespace-normal sm:truncate-none" style={{ backgroundColor: eventTypes?.find((eventType) => eventType.name === eventInfo.event.extendedProps.eventType)?.color || '#ffffff' }}>
                    {startTime}
                  </span>
                </div>
              </div>
            );
          }}
          eventClick={handleEventClick}
        />

        {eventListModalVisible && (
          <EventListModal
            events={selectedEvents || []}
            onClose={() => setEventListModalVisible(false)}
          />
        )}
      </div>
    </main>
  );
}