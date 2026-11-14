// All interface text, in Chinese (zh.ts) and English (en.ts). Screens read
// TEXT while rendering; setLanguage swaps it, and App re-renders every
// screen so the new language shows at once.

import type { LocalizedText } from '../game/quests';
import type { Language } from '../game/types';
import { EN } from './en';
import { ZH, type Text } from './zh';

let language: Language = 'zh';

export let TEXT: Text = ZH;

export function setLanguage(next: Language): void {
  language = next;
  TEXT = next === 'en' ? EN : ZH;
  document.documentElement.lang = next === 'en' ? 'en' : 'zh-CN';
}

// Picks the current language from bilingual content.
export function localize(text: LocalizedText): string {
  return text[language];
}
