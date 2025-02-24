'use client';
import jaLocale from "@fullcalendar/core/locales/ja";  // 日本語ロケールをインポート
import FullCalendar from '@fullcalendar/react';
import { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { getEvents } from '@/lib/data';
import { useState, useEffect } from 'react';
import type { CalendarEvent } from '@/lib/definitions';
import SideBar from "@/components/sideBar";

export default function Calender() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  function formatDate2JST(isoString: string) {
    const date = new Date(isoString);
    const formatted = date.toLocaleString("ja-JP", {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    // 一部環境では、toLocaleStringで「YYYY/MM/DD, HH:MM:SS」形式になる場合があるため、
    // スラッシュをハイフンに、カンマをスペースに置換します。
    return formatted.replace(/\//g, "-").replace(",", "");
  }
  
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
  };

  const handleDateClick = () => {
    console.log("date clicked");
  };

  return (
      <main className="flex-1 p-4 overflow-auto">
        <div className="calendar-container">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locales={[jaLocale]}
            locale="ja"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth',
            }}
            titleFormat={{ year: 'numeric', month: 'long' }}
            events={events}
            eventClick={handleEventClick}
            dateClick={handleDateClick}
          />
        </div>
      </main>
  );
}
