// The quest bank. The content lives in data/quests.json at the repo root,
// so quests can be edited without touching code (PRD "Scope").

import questData from '../../../data/quests.json';
import type { AttributeId, Pole } from './attributes';

// Each quest has Chinese and English text, ready for Sprint 2 (FR-8.2).
export interface LocalizedText {
  zh: string;
  en: string;
}

export interface Quest {
  id: string; // e.g. "cur-01"
  attribute: AttributeId;
  pole: Pole; // The side of the attribute this quest belongs to
  category: string; // e.g. "food", "social"
  minutes: number; // Estimated time, shown on the quest card
  title: LocalizedText;
  description: LocalizedText;
  doneWhen: LocalizedText; // How the player knows the quest is finished
}

// JSON imports are typed loosely (attribute is just a string), so the cast
// is backed by the checks in quests.test.ts.
export const QUESTS = questData as Quest[];
