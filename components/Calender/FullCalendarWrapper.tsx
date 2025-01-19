
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import listPlugin from '@fullcalendar/list';

export default function Calender() {

  const handleEventClick = (clickInfo: any) => {
    alert(`イベント名: ${clickInfo.event.title}\n開始時刻: ${clickInfo.event.startStr}\n終了時刻: ${clickInfo.event.endStr || 'なし'}`);
  };

  const handleDateClick = () => {
    alert(`date Click`);
  };


  return (
      <FullCalendar
        plugins={[ dayGridPlugin , interactionPlugin ,listPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,listWeek', // 表示切り替えボタン
        }}
        events={[
          { title: 'ミーティング', start: '2025-01-13T10:00:00', end: '2025-01-14T11:00:00' },
          { title: 'ランチ', start: '2025-01-16T12:30:00', end: '2025-01-16T13:30:00' },
          { title: 'プレゼン準備', start: '2025-01-17T15:00:00', end: '2025-01-17T16:30:00' },
        ]}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
      />
      );
}
