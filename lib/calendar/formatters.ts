export function parseDaytoDisplay(rawdate: string): string {
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