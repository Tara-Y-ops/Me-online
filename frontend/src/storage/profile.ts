// The player's basic profile, saved on the device after onboarding.

import type { Profile } from '../game/types';
import { loadJson, saveJson } from './localStore';

const PROFILE_KEY = 'profile';

// Returns the saved profile, or null for a first-time player.
export function loadProfile(): Profile | null {
  return loadJson<Profile>(PROFILE_KEY);
}

export function saveProfile(profile: Profile): boolean {
  return saveJson(PROFILE_KEY, profile);
}
