import { CalendarEvent } from "@/lib/definitions";
import { v4 as uuidv4 } from 'uuid';

function weekdayStringToNumber(day: string): number {
  const map: Record<string, number> = {
    SU: 0,
    MO: 1,
    TU: 2,
    WE: 3,
    TH: 4,
    FR: 5,
    SA: 6,
  };
  return map[day] ?? 0;
}

function parseDate(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}

function getStartOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * 指定条件から繰り返しイベントを生成する関数
 * @param startDateStr 開始日時（例："2025-03-15T10:00:00"）
 * @param untilDateStr 終了日（例："2025-06-26"）
 * @param interval 何週ごとに発生させるか（例：2）
 * @param byweekday 繰り返し対象の曜日（例：["MO", "TU"]）
 * @returns CalendarEvent の配列
 */
export function generateRecurringEvents(
  startDateStr: string,
  untilDateStr: string,
  interval: number,
  byweekday: string[]
): CalendarEvent[] {
  const events: CalendarEvent[] = [];
  const recurrenceId = 'recurrence-' + uuidv4();

  const startDate = new Date(startDateStr);
  const untilDate = parseDate(untilDateStr);
  const startHours = startDate.getHours();
  const startMinutes = startDate.getMinutes();
  const startSeconds = startDate.getSeconds();

  const currentWeekStart = getStartOfWeek(startDate);
  let weekCount = 0;

  while (currentWeekStart <= untilDate) {
    if (weekCount % interval === 0) {
      for (const dayStr of byweekday) {
        const targetDay = weekdayStringToNumber(dayStr);
        const eventDate = new Date(currentWeekStart);
        const currentDay = eventDate.getDay();
        const offset = (targetDay - currentDay + 7) % 7;
        eventDate.setDate(eventDate.getDate() + offset);

        if (eventDate >= startDate && eventDate <= untilDate) {
          eventDate.setHours(startHours, startMinutes, startSeconds, 0);
          const endDate = new Date(eventDate.getTime() + 60 * 60 * 1000);
          events.push({
            id: recurrenceId,
            title: '',
            description: '',
            startAt: eventDate.toISOString(),
            endAt: endDate.toISOString(),
            store_id: '',
            isrrule: true,
            rruleid: recurrenceId,
            event_type: '',
          });
        }
      }
    }
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    weekCount++;
  }
  return events;
} 