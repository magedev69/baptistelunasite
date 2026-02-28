export type RelationshipParts = {
  years: number;
  months: number;
  weeks: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function daysInMonth(year: number, monthIndex: number) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

function addMonths(date: Date, months: number) {
  const result = new Date(date);
  const day = result.getDate();

  result.setDate(1);
  result.setMonth(result.getMonth() + months);

  const maxDay = daysInMonth(result.getFullYear(), result.getMonth());
  result.setDate(Math.min(day, maxDay));

  return result;
}

export function getRelationshipParts(
  startIso: string,
  nowDate = new Date()
): RelationshipParts {
  const start = new Date(startIso);
  const now = new Date(nowDate);

  if (Number.isNaN(start.getTime()) || now.getTime() <= start.getTime()) {
    return {
      years: 0,
      months: 0,
      weeks: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };
  }

  let cursor = new Date(start);
  let totalMonths = 0;

  while (true) {
    const next = addMonths(cursor, 1);
    if (next.getTime() <= now.getTime()) {
      cursor = next;
      totalMonths += 1;
    } else {
      break;
    }
  }

  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;

  let remainingMs = now.getTime() - cursor.getTime();

  const secondMs = 1000;
  const minuteMs = 60 * secondMs;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;
  const weekMs = 7 * dayMs;

  const weeks = Math.floor(remainingMs / weekMs);
  remainingMs -= weeks * weekMs;

  const days = Math.floor(remainingMs / dayMs);
  remainingMs -= days * dayMs;

  const hours = Math.floor(remainingMs / hourMs);
  remainingMs -= hours * hourMs;

  const minutes = Math.floor(remainingMs / minuteMs);
  remainingMs -= minutes * minuteMs;

  const seconds = Math.floor(remainingMs / secondMs);

  return {
    years,
    months,
    weeks,
    days,
    hours,
    minutes,
    seconds,
  };
}

export function padTimeUnit(value: number) {
  return value.toString().padStart(2, "0");
}