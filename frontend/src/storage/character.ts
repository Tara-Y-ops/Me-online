// Saves the player's character on the device (type in game/types.ts).

import { ATTRIBUTE_IDS, type AttributeId } from '../game/attributes';
import { initialSide, type Side } from '../game/attributeChange';
import type { Character } from '../game/types';
import { loadJson, saveJson } from './localStore';

const CHARACTER_KEY = 'character';

// Builds a new character from quiz scores. A score of exactly 50 starts neutral.
export function createCharacter(scores: Record<AttributeId, number>): Character {
  const sides = {} as Record<AttributeId, Side>;
  for (const attribute of ATTRIBUTE_IDS) {
    sides[attribute] = initialSide(scores[attribute]);
  }
  return { scores, sides, createdAt: new Date().toISOString() };
}

// Returns the saved character, or null if the quiz is not finished yet.
export function loadCharacter(): Character | null {
  return loadJson<Character>(CHARACTER_KEY);
}

export function saveCharacter(character: Character): boolean {
  return saveJson(CHARACTER_KEY, character);
}
