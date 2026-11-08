// The player's answers after meeting their character: whether each attribute
// feels like them, and how they want to play (PRD FR-1.7, FR-1.8).
// Saving this marks the end of onboarding.

import type { PlayerSetup } from '../game/types';
import { loadJson, saveJson } from './localStore';

const PLAYER_SETUP_KEY = 'playerSetup';

// Returns the saved setup, or null if onboarding is not finished yet.
export function loadPlayerSetup(): PlayerSetup | null {
  return loadJson<PlayerSetup>(PLAYER_SETUP_KEY);
}

export function savePlayerSetup(setup: PlayerSetup): boolean {
  return saveJson(PLAYER_SETUP_KEY, setup);
}
