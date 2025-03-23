// import { RRuleData } from "@/lib/definitions";
import { CalendarEvent } from "@/lib/definitions";
import { v4 as uuidv4 } from 'uuid';
  


// export function parseRRuleDateLocal(rruleDate: string): string {
//     // 例: "20250315T120200Z"
//     const year = parseInt(rruleDate.substring(0, 4), 10).toString().padStart(2, "0");
//     const month = parseInt(rruleDate.substring(4, 6), 10).toString().padStart(2, "0");
//     const day = parseInt(rruleDate.substring(6, 8), 10).toString().padStart(2, "0");
//     const hours = parseInt(rruleDate.substring(9, 11), 10).toString().padStart(2, "0");
//     const minutes = parseInt(rruleDate.substring(11, 13), 10).toString().padStart(2, "0");
//     const seconds = parseInt(rruleDate.substring(13, 15), 10).toString().padStart(2, "0");
//     return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
//   }



// ここで前提となるヘルパー関数も定義しておく
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
  // すべてのイベントに共通のIDを生成
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
            id: recurrenceId, // すべて同じID
            title: '',
            description: '',
            startAt: eventDate.toISOString(),
            endAt: endDate.toISOString(),
            store_id: '',
            isrrule: true,
            rruleid: recurrenceId,
          });
        }
      }
    }
    currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    weekCount++;
  }
  return events;
}

export default function parseDaytoDisplay (rawdate: string): string {

  const date = new Date(rawdate);
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const week = date.getDay();
  const weeklist = ["日", "月", "火", "水", "木", "金", "土"];
  const weekname = weeklist[week];
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${month}月${day}日(${weekname}) ${hour}時${minute}分`;

}  
// loadingテスト用の関数
// export function delay(ms: number): Promise<void> {
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }