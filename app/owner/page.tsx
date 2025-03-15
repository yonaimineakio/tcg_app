'use client';
import jaLocale from "@fullcalendar/core/locales/ja";  // 日本語ロケールをインポート
import FullCalendar from '@fullcalendar/react';
import { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule';
import interactionPlugin from "@fullcalendar/interaction";
import { getEvents } from '@/lib/data';
import { useState, useEffect } from 'react';
import type { CalendarDisplayEvent } from '@/lib/definitions';

export default function Calender() {

  const [events, setEvents] = useState<CalendarDisplayEvent[]>([]);
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
    // ここにイベントクリック時の処理を記述
    console.log("event clicked", clickInfo.event);
  };
  console.log('Fetched events:', events);

  const handleDateClick = () => {
    console.log("date clicked");
  };

  return (
      <main className="flex-1 p-4 overflow-auto">
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, rrulePlugin ,interactionPlugin]}
            initialView="dayGridMonth"
            locales={[jaLocale]}
            locale="ja"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth',
            }}
            titleFormat={{ year: 'numeric', month: 'long' }}
            // events={events}
            events={events} 
            eventClick={handleEventClick}
            dateClick={handleDateClick}
          />
        </div>
      </main>
  );
}
