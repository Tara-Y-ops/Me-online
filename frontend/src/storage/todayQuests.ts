// Saves today's quests on the device, so reloading the page shows the same
// set (PRD FR-2.4), and keeps a list of every quest shown so far, so quests
// do not repeat during the test week (FR-2.2).
// The rules themselves are in game/today.ts.

import { gameDay } from '../game/chinaTime';
import type { DailyQuest, PickContext } from '../game/questPicker';
import { markDone, startDay, swapToday, type TodayState } from '../game/today';
import type { Character } from './character';
import { loadJson, saveJson } from './localStore';
import type { PlayerSetup } from './playerSetup';

const TODAY_KEY = 'today';
const SHOWN_KEY = 'shownQuestIds';

// Returns today's quests, picking and saving a new set on a new game day.
export function openToday(character: Character, setup: PlayerSetup, now = new Date()): TodayState {
  const saved = loadJson<TodayState>(TODAY_KEY);
  const state = startDay(saved, gameDay(now), pickContext(character, setup));
  // startDay returns the saved object unchanged on the same day.
  if (state !== saved) {
    saveJson(TODAY_KEY, state);
    recordShown(state.quests);
  }
  return state;
}

// Swaps one of today's quests and saves the result.
export function swapTodayQuest(
  state: TodayState,
  index: number,
  character: Character,
  setup: PlayerSetup,
): TodayState {
  const next = swapToday(state, index, pickContext(character, setup));
  saveJson(TODAY_KEY, next);
  recordShown([next.quests[index]]);
  return next;
}

// Marks one of today's quests as checked in and saves the result.
export function completeTodayQuest(state: TodayState, questId: string): TodayState {
  const next = markDone(state, questId);
  saveJson(TODAY_KEY, next);
  return next;
}

// What the quest picker needs, from the player's saved data.
function pickContext(character: Character, setup: PlayerSetup): PickContext {
  return {
    sides: character.sides,
    questStyle: setup.questStyle,
    focusAttributes: setup.focusAttributes,
    usedQuestIds: loadJson<string[]>(SHOWN_KEY) ?? [],
  };
}

function recordShown(quests: DailyQuest[]) {
  const shown = loadJson<string[]>(SHOWN_KEY) ?? [];
  saveJson(SHOWN_KEY, [...shown, ...quests.map((item) => item.questId)]);
}
