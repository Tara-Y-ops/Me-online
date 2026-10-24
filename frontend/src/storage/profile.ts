// The player's basic profile, saved on the device after onboarding.

import { loadJson, saveJson } from './localStore';

const PROFILE_KEY = 'profile';

export interface Profile {
  name: string; // Display name picked before the quiz (FR-1.1)
  consentedAt: string; // When the player agreed to join the test, ISO time (NFR-1)
}

// Returns the saved profile, or null for a first-time player.
export function loadProfile(): Profile | null {
  return loadJson<Profile>(PROFILE_KEY);
}

export function saveProfile(profile: Profile): boolean {
  return saveJson(PROFILE_KEY, profile);
}
