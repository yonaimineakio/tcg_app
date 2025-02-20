import jaLocale from "@fullcalendar/core/locales/ja";  // 日本語ロケールをインポート
import FullCalendar from '@fullcalendar/react';
import { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { getEvents } from '@/lib/data';
import { useState, useEffect } from 'react';
import type { CalendarEvent } from '@/lib/definitions';
// import { library } from "@fortawesome/fontawesome-svg-core";
import { faCoffee, faRunning } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

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
    <div className="calendar-container">
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      locales={[jaLocale]}
      locale="ja"
      headerToolbar={{
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth', // 表示切り替えボタン
      }}
      titleFormat={{ year: 'numeric', month: 'long' }}
      events={events}
      eventContent={function (arg) { 
        return (
          <div>
            <FontAwesomeIcon icon={faCoffee} />
            <span>{arg.timeText}</span>
            <span>{arg.event.title}</span>
          </div>
        );
      }}
      eventClick={handleEventClick}
      dateClick={handleDateClick}
    />
    </div>
  );
}