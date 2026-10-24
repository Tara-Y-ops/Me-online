// The five game attributes and how a score is shown to the player.
// See PRD FR-1 ("Attribute poles") and the display rule under it.

// Each attribute is one Big Five trait, renamed for the game.
export type AttributeId =
  | 'curiosity' // Openness: Familiar (low) to Explorer (high)
  | 'discipline' // Conscientiousness: Free-flowing (low) to Planner (high)
  | 'socialEnergy' // Extraversion: Recharge alone (low) to Recharge with people (high)
  | 'warmth' // Agreeableness: Independent (low) to Caring (high)
  | 'calm'; // Emotional stability: Sensitive (low) to Steady (high)

// Fixed display order for attribute lists and bars.
export const ATTRIBUTE_IDS: AttributeId[] = [
  'curiosity',
  'discipline',
  'socialEnergy',
  'warmth',
  'calm',
];

// The two ends of an attribute. Neither side is better than the other.
export type Pole = 'low' | 'high';

// Scores run from 0 (fully low pole) to 100 (fully high pole).
export const MIN_SCORE = 0;
export const MAX_SCORE = 100;

// Keeps a score inside 0 to 100.
export function clampScore(score: number): number {
  return Math.min(MAX_SCORE, Math.max(MIN_SCORE, score));
}

// How far the player leans toward a given pole, as a percentage.
// Example: a score of 35 is 65% toward 'low' and 35% toward 'high'.
export function percentToward(score: number, pole: Pole): number {
  return pole === 'high' ? score : MAX_SCORE - score;
}

// Formats a percentage with one decimal place, e.g. 65 -> "65.0%".
// Screens never show the raw 0 to 100 score, only this.
export function formatPercent(percent: number): string {
  return `${percent.toFixed(1)}%`;
}
