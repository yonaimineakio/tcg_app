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

type EventTypeWithColor = EventTypes & { color: string }


export default function Calender() {

  const [events, setEvents] = useState<EnrichedEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<EnrichedEvent[]>([]);
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


  const handleEventClick = (info: EventClickArg) => {
    setSelectedEvents(null)
    const date = info.event.startStr.substring(0,10);
    getEventByDayWithStoreName(date).then((data) => {
      if (data) {
        setSelectedEvents(data.map((event) => ({
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
        })));
      }
    }
  )
  setEventListModalVisible(true);
};



function filterEventsByEventType(eventType: EventTypes) {
  console.log("eventType", eventType);
  if(filteredEvents.length === 0 ||  (filteredEvents.length > 0 && filteredEvents[0].extendedProps.eventType !== eventType.name)) {
    setFilteredEvents(events.filter((event) => event.extendedProps.eventType === eventType.name));
  } else {
    setFilteredEvents([]);

  }

}



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
            <span onClick={() => filterEventsByEventType(eventType)} className="h-8 text-center border border-black px-2 py-1 rounded text-xs semi-bold shadow whitespace-nowrap inline-block max-w-full"  style={{ backgroundColor: eventType.color }}>{eventType.name}</span>
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
            events={ filteredEvents.length > 0 ? filteredEvents : events} 
            eventContent={(eventInfo) => {
              return (
                <div className="flex items-start gap-1 text-xs w-full break-words overflow-hidden">
                <span className="text-white-500 shrink-0 mt-[2px]">●</span>
                <div className="flex-1 min-w-0">
                  <span className="font-bold block truncate sm:whitespace-normal sm:truncate-none" style={{ backgroundColor: eventTypes?.find((eventType) => eventType.name === eventInfo.event.extendedProps.eventType)?.color || '#ffffff' }}>
                    {eventInfo.event.title}
                  </span>
                </div>
              </div>
              )
            }}
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
