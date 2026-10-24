// The player's answers after meeting their character: whether each attribute
// feels like them, and how they want to play (PRD FR-1.7, FR-1.8).
// Saving this marks the end of onboarding.

import type { AttributeId } from '../game/attributes';
import { loadJson, saveJson } from './localStore';

const PLAYER_SETUP_KEY = 'playerSetup';

// "Does this sound like you?" Saved only as feedback; scores do not change.
export type SelfCheck = 'yes' | 'partly' | 'no';

// Comfort: one stretch quest a day. Explore: two (FR-2.1).
export type QuestStyle = 'comfort' | 'explore';

export interface PlayerSetup {
  selfCheck: Record<AttributeId, SelfCheck>;
  questStyle: QuestStyle;
  focusAttributes: AttributeId[]; // One or two; stretch quests come from these
  completedAt: string; // ISO time
}

// Returns the saved setup, or null if onboarding is not finished yet.
export function loadPlayerSetup(): PlayerSetup | null {
  return loadJson<PlayerSetup>(PLAYER_SETUP_KEY);
}

export function savePlayerSetup(setup: PlayerSetup): boolean {
  return saveJson(PLAYER_SETUP_KEY, setup);
}
