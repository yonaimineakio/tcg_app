'use client';
import jaLocale from "@fullcalendar/core/locales/ja";  // 日本語ロケールをインポート
import FullCalendar from '@fullcalendar/react';
import { EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import rrulePlugin from '@fullcalendar/rrule';
import interactionPlugin from "@fullcalendar/interaction";
import EventListModal from "@/components/Calender/EventsListModal"
import { useState, useEffect} from 'react';
import type { CalendarDisplayEventsWithStoreInfo } from '@/lib/definitions';
import { getEventByDayWithStoreName } from "@/lib/data";
import { getEventsWithStoreName } from "@/lib/data";

export default function Calender() {

  const [events, setEvents] = useState<CalendarDisplayEventsWithStoreInfo[]>([]);
  const [selectedEvents, setSelectedEvents] = useState<CalendarDisplayEventsWithStoreInfo[] | null>(null);
  const [eventListModalVisible, setEventListModalVisible] = useState(false);
  

  useEffect(() => {
    async function fetchEvents() {
      try {
        const fetchedEvents = await getEventsWithStoreName();
        if (fetchedEvents) {
          setEvents(fetchedEvents);
        }
      } catch (error) {
        console.error('Failed to fetch events:', error);
      }
    }
    fetchEvents();
  }, []);


  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvents(null)
    console.log("event clicked", info.event);
    const date = info.event.startStr.substring(0,10);
    getEventByDayWithStoreName(date).then((data) => {
      if (data) {
        setSelectedEvents(data);
      }
    }
  )
  setEventListModalVisible(true);
};



  console.log('Fetched events:', events);


  

  return (
      <main className="flex-1 p-4 overflow-auto">
        <div className="max-w-4xl mx-auto w-full">
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
          />

      { eventListModalVisible && (
              <EventListModal
                events={selectedEvents || []}
                onClose={() => setEventListModalVisible(false)}
              />
            )}
        </div>
      </main>

  );
}
