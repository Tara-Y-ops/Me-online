// What a check-in does to the character, and cleanup of the player's note
// and tags. See PRD FR-3.2 to FR-3.4 and FR-4.
// These functions only compute; storage/checkIns.ts saves the result.

import { applyCheckIn, type CheckInResult, type Reaction } from './attributeChange';
import type { Quest } from './quests';
import type { Character } from '../storage/character';

export const MAX_TAGS = 3;
export const MAX_TAG_LENGTH = 10;
export const MAX_NOTE_LENGTH = 200;

// Applies one check-in to the quest's attribute.
//
// Weekly cap: the first check-in of a game week records the current scores
// as that week's starting point. No score changes between the Monday 4:00 a.m.
// refresh and the first check-in, so this equals the Monday score.
export function checkInCharacter(
  character: Character,
  quest: Quest,
  reaction: Reaction,
  week: string, // Monday of the current game week, from gameWeekStart()
): { character: Character; result: CheckInResult } {
  const weekStart =
    character.weekStart?.week === week ? character.weekStart : { week, scores: { ...character.scores } };

  const attribute = quest.attribute;
  const result = applyCheckIn({
    score: character.scores[attribute],
    side: character.sides[attribute],
    weekStartScore: weekStart.scores[attribute],
    questPole: quest.pole,
    reaction,
  });

  return {
    character: {
      ...character,
      scores: { ...character.scores, [attribute]: result.score },
      sides: { ...character.sides, [attribute]: result.side },
      weekStart,
    },
    result,
  };
}

// Trims the note and cuts it to the maximum length.
export function cleanNote(note: string): string {
  return note.trim().slice(0, MAX_NOTE_LENGTH);
}

// Trims tags, drops empty and repeated ones, and keeps at most three.
export function cleanTags(tags: string[]): string[] {
  const cleaned = tags.map((tag) => tag.trim().slice(0, MAX_TAG_LENGTH)).filter(Boolean);
  return [...new Set(cleaned)].slice(0, MAX_TAGS);
}
