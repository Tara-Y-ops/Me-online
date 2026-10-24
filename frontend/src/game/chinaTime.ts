// Game days and weeks, always in China time (UTC+8), whatever time zone
// the phone is set to.
//
// - A game day starts at 4:00 a.m. China time, when quests refresh (PRD FR-2.4).
//   So 3:59 a.m. still belongs to the previous day.
// - A game week starts at 4:00 a.m. China time on Monday, the same moment
//   as that day's quest refresh. Weeks are used for the weekly cap (FR-4.1).
//
// Dates are returned as "YYYY-MM-DD" strings, which are easy to save and
// compare (a later date is also a larger string).

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

// China is 8 hours ahead of UTC, and the game day begins 4 hours after
// midnight. Shifting by 8 - 4 = 4 hours turns "4:00 a.m. China time" into
// midnight, so the UTC calendar date of the shifted time is the game day.
const GAME_DAY_SHIFT_MS = (8 - 4) * HOUR_MS;

// The game day a moment belongs to, e.g. "2026-10-24".
export function gameDay(now: Date = new Date()): string {
  return toDateString(shiftToGameTime(now));
}

// The Monday that starts the game week a moment belongs to, e.g. "2026-10-19".
export function gameWeekStart(now: Date = new Date()): string {
  const shifted = shiftToGameTime(now);
  // getUTCDay: 0 is Sunday, 1 is Monday, ..., 6 is Saturday.
  const daysSinceMonday = (shifted.getUTCDay() + 6) % 7;
  return toDateString(new Date(shifted.getTime() - daysSinceMonday * DAY_MS));
}

function shiftToGameTime(now: Date): Date {
  return new Date(now.getTime() + GAME_DAY_SHIFT_MS);
}

// Only UTC methods are used, so the phone's own time zone never matters.
function toDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}
