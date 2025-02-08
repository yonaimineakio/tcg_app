import FullCalendar from '@fullcalendar/react';
import { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from '@fullcalendar/list';
import { getEvents } from '@/lib/data';
import { useState, useEffect } from 'react';
import type { CalendarEvent } from '@/lib/definitions';

export default function Calender() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getEvents();
        if (fetchedEvents) {
          setEvents(fetchedEvents);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    }
    fetchEvents();
  }, []);

  const handleEventClick = (clickInfo: EventClickArg) => {
    alert(`イベント名: ${clickInfo.event.title}\n開始時刻: ${clickInfo.event.startStr}\n終了時刻: ${clickInfo.event.endStr || 'なし'}`);
  };

  const handleDateClick = () => {
    alert(`date clicked`);
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin, listPlugin]}
      initialView="dayGridMonth"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,listWeek', // 表示切り替えボタン
      }}
      events={events}
      eventClick={handleEventClick}
      dateClick={handleDateClick}
    />
  );
}


//         events={[
//           { title: 'ミーティング', start: '2025-01-13T10:00:00', end: '2025-01-14T11:00:00' },
//           { title: 'ランチ', start: '2025-01-16T12:30:00', end: '2025-01-16T13:30:00' },
//           { title: 'プレゼン準備', start: '2025-01-17T15:00:00', end: '2025-01-17T16:30:00' },
//         ]}
