import { describe, expect, it } from 'vitest';
import { gameDay, gameWeekStart } from './chinaTime';

// Builds a moment from a China-time wall clock reading, e.g. '2026-10-24 04:00'.
function chinaTime(text: string): Date {
  return new Date(text.replace(' ', 'T') + ':00+08:00');
}

// Calendar used below: 2026-10-24 is a Saturday, 2026-10-26 is a Monday.

describe('gameDay', () => {
  it('starts a new day at 4:00 a.m. China time', () => {
    expect(gameDay(chinaTime('2026-10-24 03:59'))).toBe('2026-10-23');
    expect(gameDay(chinaTime('2026-10-24 04:00'))).toBe('2026-10-24');
    expect(gameDay(chinaTime('2026-10-24 23:59'))).toBe('2026-10-24');
  });

  it('does not depend on how the moment was written', () => {
    // 2026-10-23 20:00 UTC is 2026-10-24 04:00 in China.
    expect(gameDay(new Date('2026-10-23T20:00:00Z'))).toBe('2026-10-24');
    // The same moment written in New York time (UTC-4 in October).
    expect(gameDay(new Date('2026-10-23T16:00:00-04:00'))).toBe('2026-10-24');
  });

  it('handles the end of a year', () => {
    expect(gameDay(chinaTime('2027-01-01 03:59'))).toBe('2026-12-31');
    expect(gameDay(chinaTime('2027-01-01 04:00'))).toBe('2027-01-01');
  });
});

describe('gameWeekStart', () => {
  it('returns the Monday of the week', () => {
    expect(gameWeekStart(chinaTime('2026-10-24 12:00'))).toBe('2026-10-19');
  });

  it('starts a new week at 4:00 a.m. China time on Monday', () => {
    expect(gameWeekStart(chinaTime('2026-10-26 03:59'))).toBe('2026-10-19');
    expect(gameWeekStart(chinaTime('2026-10-26 04:00'))).toBe('2026-10-26');
  });

  it('treats Sunday as the last day of the week', () => {
    expect(gameWeekStart(chinaTime('2026-10-25 22:00'))).toBe('2026-10-19');
  });

  it('handles a week that spans two years', () => {
    // 2027-01-01 is a Friday; its week began on Monday 2026-12-28.
    expect(gameWeekStart(chinaTime('2027-01-01 12:00'))).toBe('2026-12-28');
  });
});
