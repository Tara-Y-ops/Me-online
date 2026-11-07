// Connection to Supabase, where player data is uploaded for the research
// (PRD FR-9.2). Each device signs in anonymously, so row-level security in
// the database limits every player to their own rows (docs/data-model.md).
// The URL and publishable key come from .env.local (see .env.example) and
// the Vercel project settings. Without them the app still runs, with data
// on the device only.

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const publishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// null when the environment variables are missing.
export const supabase: SupabaseClient | null =
  url && publishableKey ? createClient(url, publishableKey) : null;

// Returns this device's Supabase user ID, signing in anonymously the first
// time. The session is kept in localStorage, so later calls reuse it.
// Returns null when Supabase is not set up or cannot be reached; callers
// then keep the data on the device and try again later (NFR-3).
export async function ensureSignedIn(): Promise<string | null> {
  if (!supabase) {
    return null;
  }
  try {
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      return data.session.user.id;
    }
    const { data: signedIn, error } = await supabase.auth.signInAnonymously();
    if (error || !signedIn.user) {
      return null;
    }
    return signedIn.user.id;
  } catch {
    // Network errors, e.g. Supabase is unreachable.
    return null;
  }
}
