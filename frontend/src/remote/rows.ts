// Turns the data saved on the device into rows for the Supabase tables
// (docs/data-model.md), works out which check-ins still need uploading, and
// turns downloaded rows back into device data after signing in.
// These functions only compute; remote/sync.ts and remote/auth.ts do the
// network calls.

import type { AttributeId, Pole } from '../game/attributes';
import type { Reaction, Side } from '../game/attributeChange';
import { REMAINING_ITEMS } from '../game/fullTest';
import type { QuestKind } from '../game/questPicker';
import { SHORT_FORM_ITEMS, type QuizAnswers } from '../game/quiz';
import type { Character, WeekStart } from '../storage/character';
import type { CheckIn } from '../storage/checkIns';
import type { PlayerSetup, QuestStyle, SelfCheck } from '../storage/playerSetup';
import type { Profile } from '../storage/profile';
import type { QuizProgress } from '../storage/quizProgress';

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

// Column names match the files in supabase/migrations.
export interface PlayerRow {
  user_id: string;
  anonymous_id: string;
  name: string;
  consented_at: string;
  quiz_answers: QuizAnswers;
  full_test_at: string | null;
  scores: Record<AttributeId, number> | null;
  sides: Record<AttributeId, Side> | null;
  week_start: WeekStart | null;
  self_check: Record<AttributeId, SelfCheck> | null;
  quest_style: QuestStyle | null;
  focus_attributes: AttributeId[] | null;
  updated_at: string;
}

export interface CheckInRow {
  user_id: string;
  quest_id: string;
  created_at: string;
  kind: QuestKind;
  day: string;
  reaction: Reaction;
  note: string;
  tags: string[];
  attribute: AttributeId;
  moved_toward: Pole | null;
  amount: number;
  capped: boolean;
  flipped: boolean;
}

export function playerRow(data: PlayerData, now: Date): PlayerRow {
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
    week_start: character?.weekStart ?? null,
    self_check: setup?.selfCheck ?? null,
    quest_style: setup?.questStyle ?? null,
    focus_attributes: setup?.focusAttributes ?? null,
    updated_at: now.toISOString(),
  };
}

export function checkInRow(userId: string, checkIn: CheckIn): CheckInRow {
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

// Everything written back to the device after signing in to an account
// that already has data (FR-9.1). Today's quests are not stored in Supabase,
// so the app picks a new set; the quests already checked in are marked as
// shown so they do not come back (FR-2.2).
export interface RestoredData {
  profile: Profile;
  quizProgress: QuizProgress;
  fullTestProgress: QuizProgress | null; // null if the full test was never started
  character: Character | null; // null if the quiz was not finished
  setup: PlayerSetup | null; // null if setup was not finished
  checkIns: CheckIn[]; // Oldest first
  shownQuestIds: string[];
}

// The downloaded players row also has the time it was created.
export type SavedPlayerRow = PlayerRow & { created_at: string };

export function restoredData(player: SavedPlayerRow, checkInRows: CheckInRow[]): RestoredData {
  const answers = player.quiz_answers;
  const checkIns = [...checkInRows]
    .sort((a, b) => Date.parse(a.created_at) - Date.parse(b.created_at))
    .map(
      (row): CheckIn => ({
        questId: row.quest_id,
        kind: row.kind,
        day: row.day,
        createdAt: new Date(row.created_at).toISOString(),
        reaction: row.reaction,
        note: row.note,
        tags: row.tags,
        attribute: row.attribute,
        movedToward: row.moved_toward,
        amount: Number(row.amount),
        capped: row.capped,
        flipped: row.flipped,
      }),
    );

  const startedFullTest = REMAINING_ITEMS.some((item) => answers[item.id] !== undefined);
  return {
    profile: { name: player.name, consentedAt: player.consented_at },
    quizProgress: { answers, index: resumeIndex(SHORT_FORM_ITEMS, answers) },
    fullTestProgress: startedFullTest ? { answers, index: resumeIndex(REMAINING_ITEMS, answers) } : null,
    character:
      player.scores && player.sides
        ? {
            scores: player.scores,
            sides: player.sides,
            createdAt: player.created_at,
            ...(player.week_start && { weekStart: player.week_start }),
            ...(player.full_test_at && { fullTestAt: player.full_test_at }),
          }
        : null,
    setup:
      player.self_check && player.quest_style && player.focus_attributes
        ? {
            selfCheck: player.self_check,
            questStyle: player.quest_style,
            focusAttributes: player.focus_attributes,
            completedAt: player.updated_at,
          }
        : null,
    checkIns,
    shownQuestIds: [...new Set(checkIns.map((checkIn) => checkIn.questId))],
  };
}

// The first unanswered item, or the last item if all are answered.
function resumeIndex(items: { id: number }[], answers: QuizAnswers): number {
  const index = items.findIndex((item) => answers[item.id] === undefined);
  return index === -1 ? items.length - 1 : index;
}
