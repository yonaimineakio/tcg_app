import { RRuleData } from "@/lib/definitions";
  
export function parseRRuleInput(input: string): RRuleData {
    // 入力例:
    // DTSTART:20250315T035100Z
    // RRULE:FREQ=WEEKLY;INTERVAL=1;UNTIL=20250619T000000Z;BYDAY=MO,TU
  
    // 改行で分割
    const lines = input.split(/\r?\n/);
  
    let dtstart = "";
    let freq = "";
    let interval = 0;
    let until = "";
    let byday: string[] = [];
  
    // 1行目: DTSTART
    const dtstartLine = lines.find(line => line.startsWith("DTSTART:"));
    if (dtstartLine) {
      dtstart = dtstartLine.split("DTSTART:")[1].trim();
    }
  
    // 2行目: RRULE
    const rruleLine = lines.find(line => line.startsWith("RRULE:"));
    if (rruleLine) {
      // "RRULE:"の部分を除去
      const rruleBody = rruleLine.substring("RRULE:".length);
      // セミコロンで各パラメータに分割
      const parts = rruleBody.split(";");
      for (const part of parts) {
        const [key, value] = part.split("=");
        if (!key || value === undefined) continue;
        switch (key.toUpperCase()) {
          case "FREQ":
            freq = value;
            break;
          case "INTERVAL":
            interval = Number(value);
            break;
          case "UNTIL":
            until = value;
            break;
          case "BYDAY":
            byday = value.split(",").map(v => v.trim());
            break;
          default:
            break;
        }
      }
    }
  
    return { dtstart, freq, interval, until, byday };
  }


export function parseRRuleDateLocal(rruleDate: string): string {
    // 例: "20250315T120200Z"
    const year = parseInt(rruleDate.substring(0, 4), 10).toString().padStart(2, "0");
    const month = parseInt(rruleDate.substring(4, 6), 10).toString().padStart(2, "0");
    const day = parseInt(rruleDate.substring(6, 8), 10).toString().padStart(2, "0");
    const hours = parseInt(rruleDate.substring(9, 11), 10).toString().padStart(2, "0");
    const minutes = parseInt(rruleDate.substring(11, 13), 10).toString().padStart(2, "0");
    const seconds = parseInt(rruleDate.substring(13, 15), 10).toString().padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
  }
  