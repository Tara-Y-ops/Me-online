// The interface language the player picked, saved on the device.

import type { Language } from '../game/types';
import { loadJson, saveJson } from './localStore';

const LANGUAGE_KEY = 'language';

// Chinese until the player switches.
export function loadLanguage(): Language {
  return loadJson<Language>(LANGUAGE_KEY) === 'en' ? 'en' : 'zh';
}

export function saveLanguage(language: Language): boolean {
  return saveJson(LANGUAGE_KEY, language);
}
