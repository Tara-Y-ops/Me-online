// The state of one game day: its three quests, whether the daily swap is
// used, and which quests are checked in. See PRD FR-2.3, FR-2.4, FR-3.1.
// These functions only compute; storage/todayQuests.ts saves the result.

import {
  pickDailyQuests,
  swapQuest,
  type DailyQuest,
  type PickContext,
} from './questPicker';

export interface TodayState {
  day: string; // Game day, e.g. "2026-10-25" (see chinaTime.ts)
  quests: DailyQuest[];
  swapUsed: boolean; // One swap per day
  doneQuestIds: string[]; // Quests checked in today
}

type Random = () => number;

// Returns the saved state if it is still the same game day, so reloading
// never reshuffles. Otherwise starts a new day with fresh quests; unfinished
// quests from the old day do not carry over.
export function startDay(
  saved: TodayState | null,
  day: string,
  context: PickContext,
  random: Random = Math.random,
): TodayState {
  if (saved && saved.day === day) {
    return saved;
  }
  return { day, quests: pickDailyQuests(context, random), swapUsed: false, doneQuestIds: [] };
}

// A quest can be swapped if today's swap is unused and it is not checked in.
export function canSwap(state: TodayState, index: number): boolean {
  return !state.swapUsed && !state.doneQuestIds.includes(state.quests[index].questId);
}

// Replaces the quest at `index` and uses up today's swap.
export function swapToday(
  state: TodayState,
  index: number,
  context: PickContext,
  random: Random = Math.random,
): TodayState {
  if (!canSwap(state, index)) {
    throw new Error(`Quest ${index} cannot be swapped`);
  }
  const replacement = swapQuest(state.quests, index, context, random);
  return {
    ...state,
    quests: state.quests.map((item, i) => (i === index ? replacement : item)),
    swapUsed: true,
  };
}

// Records a check-in, so the quest shows as done and can no longer be swapped.
export function markDone(state: TodayState, questId: string): TodayState {
  if (state.doneQuestIds.includes(questId)) {
    return state;
  }
  return { ...state, doneQuestIds: [...state.doneQuestIds, questId] };
}
