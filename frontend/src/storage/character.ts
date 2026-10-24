// The player's character: the five attribute scores and which side each leans.
// Created when the quiz is finished, then changed by check-ins.

import { ATTRIBUTE_IDS, type AttributeId } from '../game/attributes';
import { initialSide, type Side } from '../game/attributeChange';
import { loadJson, saveJson } from './localStore';

const CHARACTER_KEY = 'character';

export interface Character {
  scores: Record<AttributeId, number>; // 0 to 100
  sides: Record<AttributeId, Side>;
  createdAt: string; // When the quiz was finished, ISO time
}

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
