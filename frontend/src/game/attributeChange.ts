// How a check-in moves an attribute score. See PRD FR-4 and FR-3.4.

import { clampScore, type Pole } from './attributes';

// Which side the player currently leans toward on one attribute.
// 'neutral' only happens when the starting quiz score is exactly 50.
export type Side = Pole | 'neutral';

// The player's reaction to a quest at check-in.
export type Reaction = 'liked' | 'okay' | 'disliked';

// Points moved per check-in, and the most a score may drift from its
// week-start value in either direction (net change, not total movement).
export const LIKED_STEP = 0.5;
export const DISLIKED_STEP = 0.1;
export const WEEKLY_CAP = 1;

// The side for a starting quiz score. Exactly 50 stays neutral so the
// player is not pushed to either side.
export function initialSide(score: number): Side {
  if (score > 50) return 'high';
  if (score < 50) return 'low';
  return 'neutral';
}

export interface CheckInInput {
  score: number; // Current score, 0 to 100
  side: Side; // Current side
  weekStartScore: number; // Score at the start of this week (Monday)
  questPole: Pole; // The pole the quest belongs to
  reaction: Reaction;
}

export interface CheckInResult {
  score: number; // New score
  side: Side; // New side
  movedToward: Pole | null; // Pole the score moved toward; null if it did not move
  amount: number; // Points actually moved, shown as "+amount%" toward movedToward
  capped: boolean; // true if the weekly cap reduced or blocked the move
  flipped: boolean; // true if the side switched from one pole to the other
}

// Applies one check-in to one attribute.
//
// - Liked: 0.5 toward the quest's pole.
// - Disliked: 0.1 toward the opposite pole.
// - Okay: no change.
// - Weekly cap on net change: within one week the score stays between
//   weekStartScore - 1 and weekStartScore + 1. Moving back toward the
//   week-start score is always allowed. The caller decides when a week starts.
// - Scores stay within 0 to 100.
export function applyCheckIn(input: CheckInInput): CheckInResult {
  const { score, side, weekStartScore, questPole, reaction } = input;

  if (reaction === 'okay') {
    return { score, side, movedToward: null, amount: 0, capped: false, flipped: false };
  }

  const direction: Pole =
    reaction === 'liked' ? questPole : questPole === 'high' ? 'low' : 'high';
  const step = reaction === 'liked' ? LIKED_STEP : DISLIKED_STEP;

  // Room left before hitting the weekly limit in this direction.
  const room =
    direction === 'high'
      ? weekStartScore + WEEKLY_CAP - score
      : score - (weekStartScore - WEEKLY_CAP);
  const allowed = roundScore(Math.max(0, room));
  const capped = step > allowed;

  const signedStep = Math.min(step, allowed) * (direction === 'high' ? 1 : -1);
  const newScore = roundScore(clampScore(score + signedStep));
  const amount = roundScore(Math.abs(newScore - score));

  const newSide = sideAfterMove(side, score, newScore);
  const flipped = side !== 'neutral' && newSide !== 'neutral' && newSide !== side;

  return {
    score: newScore,
    side: newSide,
    movedToward: amount > 0 ? direction : null,
    amount,
    capped,
    flipped,
  };
}

// The side after a score moves from oldScore to newScore.
// Above 50 is high and below 50 is low. Landing exactly on 50 counts as the
// side the score moved toward. If the score did not move, the side stays.
function sideAfterMove(side: Side, oldScore: number, newScore: number): Side {
  if (newScore > 50) return 'high';
  if (newScore < 50) return 'low';
  if (newScore > oldScore) return 'high';
  if (newScore < oldScore) return 'low';
  return side;
}

// Rounds away floating-point noise, so steps of 0.1 add up exactly
// (e.g. 49.9 + 0.1 is exactly 50, not 50.00000000000001).
function roundScore(score: number): number {
  return Math.round(score * 1e6) / 1e6;
}
