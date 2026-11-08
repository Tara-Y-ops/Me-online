// Saves check-ins on the device. Saving one check-in updates three things
// together: the check-in list, the character's scores, and today's done list.
// The rules are in game/checkIn.ts.

import { gameWeekStart } from '../game/chinaTime';
import { checkInCharacter, cleanNote, cleanTags } from '../game/checkIn';
import { findQuest } from '../game/quests';
import type { TodayState } from '../game/today';
import type { Character, CheckIn, CheckInForm } from '../game/types';
import { saveCharacter } from './character';
import { loadJson, saveJson } from './localStore';
import { completeTodayQuest } from './todayQuests';

const CHECK_INS_KEY = 'checkIns';

// Oldest first.
export function loadCheckIns(): CheckIn[] {
  return loadJson<CheckIn[]>(CHECK_INS_KEY) ?? [];
}

// Replaces the whole list, e.g. with an account's check-ins after sign-in.
export function saveCheckIns(checkIns: CheckIn[]): boolean {
  return saveJson(CHECK_INS_KEY, checkIns);
}

// Saves a check-in for one of today's quests and returns the updated data.
export function submitCheckIn(
  character: Character,
  today: TodayState,
  questId: string,
  form: CheckInForm,
  now = new Date(),
): { character: Character; today: TodayState; checkIn: CheckIn } {
  const quest = findQuest(questId);
  const daily = today.quests.find((item) => item.questId === questId);
  if (!daily || today.doneQuestIds.includes(questId)) {
    throw new Error(`Quest ${questId} cannot be checked in today`);
  }

  const { character: nextCharacter, result } = checkInCharacter(
    character,
    quest,
    form.reaction,
    gameWeekStart(now),
  );
  const checkIn: CheckIn = {
    questId,
    kind: daily.kind,
    day: today.day,
    createdAt: now.toISOString(),
    reaction: form.reaction,
    note: cleanNote(form.note),
    tags: cleanTags(form.tags),
    attribute: quest.attribute,
    movedToward: result.movedToward,
    amount: result.amount,
    capped: result.capped,
    flipped: result.flipped,
  };
  saveJson(CHECK_INS_KEY, [...loadCheckIns(), checkIn]);
  saveCharacter(nextCharacter);
  const nextToday = completeTodayQuest(today, questId);

  return { character: nextCharacter, today: nextToday, checkIn };
}
