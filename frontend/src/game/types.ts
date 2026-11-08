// The player's data, shared by the game rules, device storage, Supabase
// uploads, and screens. Defined here so the rules do not depend on how the
// data is saved. Saving and loading live in storage/.

import type { AttributeId, Pole } from './attributes';
import type { Reaction, Side } from './attributeChange';
import type { QuestKind } from './questPicker';

// The display name and consent, saved after Name (FR-1.1, NFR-1).
export interface Profile {
  name: string; // Display name picked before the quiz
  consentedAt: string; // When the player agreed to join the test, ISO time
}

// Scores at the start of a game week, for the weekly cap (PRD FR-4.1).
export interface WeekStart {
  week: string; // Monday of the game week, e.g. "2026-10-19" (see chinaTime.ts)
  scores: Record<AttributeId, number>;
}

// The five attribute scores and which side each leans. Created when the
// quiz is finished, then changed by check-ins.
export interface Character {
  scores: Record<AttributeId, number>; // 0 to 100
  sides: Record<AttributeId, Side>;
  createdAt: string; // When the quiz was finished, ISO time
  weekStart?: WeekStart; // Set by the first check-in of each week
  fullTestAt?: string; // When the full 60-item test was finished, ISO time (FR-1.6)
}

// "Does this sound like you?" Saved only as feedback; scores do not change.
export type SelfCheck = 'yes' | 'partly' | 'no';

// Comfort: one stretch quest a day. Explore: two (FR-2.1).
export type QuestStyle = 'comfort' | 'explore';

// The answers after meeting the character (FR-1.7, FR-1.8). Saving this
// marks the end of onboarding.
export interface PlayerSetup {
  selfCheck: Record<AttributeId, SelfCheck>;
  questStyle: QuestStyle;
  focusAttributes: AttributeId[]; // One or two; stretch quests come from these
  completedAt: string; // ISO time
}

// One saved check-in. Used by the result card, History, and Preference Map.
export interface CheckIn {
  questId: string;
  kind: QuestKind;
  day: string; // Game day of the check-in
  createdAt: string; // ISO time
  reaction: Reaction;
  note: string; // May be empty
  tags: string[]; // Up to three
  // How the attribute moved, as shown on the result card.
  attribute: AttributeId;
  movedToward: Pole | null;
  amount: number;
  capped: boolean;
  flipped: boolean;
}

// What the player fills in on the check-in screen.
export interface CheckInForm {
  reaction: Reaction;
  note: string;
  tags: string[];
}
