import jaLocale from "@fullcalendar/core/locales/ja";  // 日本語ロケールをインポート
import FullCalendar from '@fullcalendar/react';
import { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import { getEvents } from '@/lib/data';
import { useState, useEffect } from 'react';
import type { CalendarEvent } from '@/lib/definitions';
// import { library } from "@fortawesome/fontawesome-svg-core";
import { faCoffee } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import EventModal from "@/components/Calender/EventModal";


export default function Calender() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isOpen, setIsOpen] = useState(false); 
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

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
  
    setSelectedEvent({
      id: clickInfo.event.id,
      title: clickInfo.event.title,
      description: clickInfo.event.extendedProps.description,
      startAt: formatDate2JST(clickInfo.event.startStr),
      endAt: formatDate2JST(clickInfo.event.endStr),
      store_id: clickInfo.event.extendedProps.store_id,
    });

    setIsOpen(true);
  };

  const handleDateClick = () => {
    setSelectedEvent(null);
    setIsOpen(true);
  };

  return (
    <div className="user calendar-container">
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

      <EventModal isOpen={isOpen} onClose={ () => setIsOpen(false) } calenderEvent={selectedEvent}>
        <h2 className="text-xl font-bold">{selectedEvent?.title}</h2>
        <p className="text-gray-600">{selectedEvent?.description}</p>
        <p className="text-gray-700 mt-2">{selectedEvent?.startAt}</p>
        <p className="text-gray-700 mt-2">{selectedEvent?.endAt}</p>
      </ EventModal>
    </div>
  );
}