// Turns the data saved on the device into rows for the Supabase tables
// (docs/data-model.md), and works out which check-ins still need uploading.
// These functions only compute; remote/sync.ts sends the rows.

import type { QuizAnswers } from '../game/quiz';
import type { Character } from '../storage/character';
import type { CheckIn } from '../storage/checkIns';
import type { PlayerSetup } from '../storage/playerSetup';
import type { Profile } from '../storage/profile';

// Everything the players row is built from. Only the profile is required;
// the other parts are added as the player gets to them.
export interface PlayerData {
  userId: string;
  anonymousId: string;
  profile: Profile;
  answers: QuizAnswers;
  character: Character | null;
  setup: PlayerSetup | null;
}

// Column names match supabase/migrations/20261107000000_init.sql.
export function playerRow(data: PlayerData, now: Date) {
  const { character, setup } = data;
  return {
    user_id: data.userId,
    anonymous_id: data.anonymousId,
    name: data.profile.name,
    consented_at: data.profile.consentedAt,
    quiz_answers: data.answers,
    full_test_at: character?.fullTestAt ?? null,
    scores: character?.scores ?? null,
    sides: character?.sides ?? null,
    self_check: setup?.selfCheck ?? null,
    quest_style: setup?.questStyle ?? null,
    focus_attributes: setup?.focusAttributes ?? null,
    updated_at: now.toISOString(),
  };
}

export function checkInRow(userId: string, checkIn: CheckIn) {
  return {
    user_id: userId,
    quest_id: checkIn.questId,
    created_at: checkIn.createdAt,
    kind: checkIn.kind,
    day: checkIn.day,
    reaction: checkIn.reaction,
    note: checkIn.note,
    tags: checkIn.tags,
    attribute: checkIn.attribute,
    moved_toward: checkIn.movedToward,
    amount: checkIn.amount,
    capped: checkIn.capped,
    flipped: checkIn.flipped,
  };
}

// What has reached Supabase so far, saved on the device.
export interface SyncState {
  userId: string; // The Supabase user the uploads belong to
  checkInsUploaded: number; // Check-ins are saved oldest first, so the first N are uploaded
}

// The check-ins still to upload for this user. If the user has changed, for
// example because the anonymous user was deleted and a new one signed in,
// everything is uploaded again under the new user.
export function pendingCheckIns(checkIns: CheckIn[], state: SyncState | null, userId: string): CheckIn[] {
  const uploaded = state?.userId === userId ? state.checkInsUploaded : 0;
  return checkIns.slice(uploaded);
}
