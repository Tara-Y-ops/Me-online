import { describe, expect, it } from 'vitest';
import type { PickContext } from './questPicker';
import { canSwap, markDone, startDay, swapToday, type TodayState } from './today';

const context: PickContext = {
  sides: { curiosity: 'high', discipline: 'low', socialEnergy: 'low', warmth: 'low', calm: 'low' },
  questStyle: 'comfort',
  focusAttributes: ['socialEnergy'],
  usedQuestIds: [],
};

// Returns 0, 0.1, 0.2, ... so picks are predictable but not all the same.
function counter(): () => number {
  let n = 0;
  return () => (n++ % 10) / 10;
}

describe('startDay', () => {
  it('starts a new day with three fresh quests', () => {
    const state = startDay(null, '2026-10-25', context, counter());
    expect(state.day).toBe('2026-10-25');
    expect(state.quests).toHaveLength(3);
    expect(state.swapUsed).toBe(false);
    expect(state.doneQuestIds).toEqual([]);
  });

  it('keeps the saved quests on the same day, so reloading does not reshuffle', () => {
    const saved = startDay(null, '2026-10-25', context, counter());
    expect(startDay(saved, '2026-10-25', context, counter())).toBe(saved);
  });

  it('drops yesterday’s quests, swap, and check-ins on a new day', () => {
    const yesterday: TodayState = {
      ...startDay(null, '2026-10-24', context, counter()),
      swapUsed: true,
      doneQuestIds: ['cur-01'],
    };
    const today = startDay(yesterday, '2026-10-25', context, counter());
    expect(today.day).toBe('2026-10-25');
    expect(today.swapUsed).toBe(false);
    expect(today.doneQuestIds).toEqual([]);
  });
});

describe('swapToday', () => {
  it('replaces only the chosen quest and uses up the swap', () => {
    const state = startDay(null, '2026-10-25', context, counter());
    const swapped = swapToday(state, 1, context, counter());
    expect(swapped.quests[0]).toEqual(state.quests[0]);
    expect(swapped.quests[1].questId).not.toBe(state.quests[1].questId);
    expect(swapped.quests[2]).toEqual(state.quests[2]);
    expect(swapped.swapUsed).toBe(true);
  });

  it('allows only one swap a day', () => {
    const swapped = swapToday(startDay(null, '2026-10-25', context, counter()), 0, context);
    expect(canSwap(swapped, 2)).toBe(false);
    expect(() => swapToday(swapped, 2, context)).toThrow('cannot be swapped');
  });

  it('does not swap a quest that is already checked in', () => {
    const state = startDay(null, '2026-10-25', context, counter());
    const done = markDone(state, state.quests[0].questId);
    expect(canSwap(done, 0)).toBe(false);
    expect(canSwap(done, 1)).toBe(true);
  });
});

describe('markDone', () => {
  it('records a check-in once', () => {
    const state = startDay(null, '2026-10-25', context, counter());
    const id = state.quests[2].questId;
    const once = markDone(state, id);
    expect(once.doneQuestIds).toEqual([id]);
    expect(markDone(once, id)).toBe(once);
  });
});
