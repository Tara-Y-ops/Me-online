// Saves check-ins on the device. Saving one check-in updates three things
// together: the check-in list, the character's scores, and today's done list.
// The rules are in game/checkIn.ts.

import type { AttributeId, Pole } from '../game/attributes';
import type { Reaction } from '../game/attributeChange';
import { gameWeekStart } from '../game/chinaTime';
import { checkInCharacter, cleanNote, cleanTags } from '../game/checkIn';
import type { QuestKind } from '../game/questPicker';
import { findQuest } from '../game/quests';
import type { TodayState } from '../game/today';
import { saveCharacter, type Character } from './character';
import { loadJson, saveJson } from './localStore';
import { completeTodayQuest } from './todayQuests';

const CHECK_INS_KEY = 'checkIns';

// One saved check-in. Used by the result card, History, and Preference Map.
export interface CheckIn {
  questId: string;
  kind: QuestKind;
  day: string; // Game day of the check-in
  createdAt: string; // ISO time
  reaction: Reaction;
  note: string; // May be empty
  tags: string[]; // Up to three
  // How the attribute moved, as shown on the result card.
  attribute: AttributeId;
  movedToward: Pole | null;
  amount: number;
  capped: boolean;
  flipped: boolean;
}

// What the player fills in on the check-in screen.
export interface CheckInForm {
  reaction: Reaction;
  note: string;
  tags: string[];
}

// Oldest first.
export function loadCheckIns(): CheckIn[] {
  return loadJson<CheckIn[]>(CHECK_INS_KEY) ?? [];
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
