// Uploads the device's data to Supabase: the players row and any check-ins
// not uploaded yet (PRD FR-9.2). Runs when the app opens, after each save
// (including today's quests changing), and when the phone comes back online. If anything fails, the data stays
// on the device and the next run tries again (NFR-3). Nothing is shown to
// the player either way.

import { loadCharacter } from '../storage/character';
import { loadCheckIns } from '../storage/checkIns';
import { loadFullTestProgress } from '../storage/fullTest';
import { getAnonymousId, loadJson, saveJson } from '../storage/localStore';
import { loadPlayerSetup } from '../storage/playerSetup';
import { loadProfile } from '../storage/profile';
import { loadQuizProgress } from '../storage/quizProgress';
import { loadSavedToday } from '../storage/todayQuests';
import { checkInRow, pendingCheckIns, playerRow, type SyncState } from './rows';
import { ensureSignedIn, supabase } from './supabase';

const SYNC_STATE_KEY = 'syncState';

// One upload at a time. A request during an upload runs once it finishes,
// so data saved meanwhile is not missed.
let running: Promise<void> | null = null;
let again = false;

// Starts an upload in the background. Safe to call often.
export function syncToServer(): void {
  if (running) {
    again = true;
    return;
  }
  running = uploadAll().finally(() => {
    running = null;
    if (again) {
      again = false;
      syncToServer();
    }
  });
}

// Records that the device's first `count` check-ins are already on the
// server for this user, e.g. right after downloading them at sign-in.
export function markUploaded(userId: string, count: number): void {
  saveJson(SYNC_STATE_KEY, { userId, checkInsUploaded: count } satisfies SyncState);
}

async function uploadAll(): Promise<void> {
  // Nothing to upload before the player has a name and has consented.
  const profile = loadProfile();
  if (!supabase || !profile) {
    return;
  }
  const userId = await ensureSignedIn();
  if (!userId) {
    return;
  }

  // The full test's answers include the 15 quiz answers.
  const answers = { ...loadQuizProgress().answers, ...loadFullTestProgress().answers };
  const player = playerRow(
    {
      userId,
      anonymousId: getAnonymousId(),
      profile,
      answers,
      character: loadCharacter(),
      setup: loadPlayerSetup(),
      today: loadSavedToday(),
    },
    new Date(),
  );
  const { error: playerError } = await supabase.from('players').upsert(player);
  if (playerError) {
    return;
  }

  const checkIns = loadCheckIns();
  const state = loadJson<SyncState>(SYNC_STATE_KEY);
  const pending = pendingCheckIns(checkIns, state, userId);
  if (pending.length > 0) {
    // ignoreDuplicates: a check-in that reached the server before a failed
    // run is skipped instead of causing an error.
    const { error } = await supabase
      .from('check_ins')
      .upsert(
        pending.map((checkIn) => checkInRow(userId, checkIn)),
        { onConflict: 'user_id,created_at,quest_id', ignoreDuplicates: true },
      );
    if (error) {
      return;
    }
  }
  markUploaded(userId, checkIns.length);
}
