# Data Model

This page lists what Me Online stores, where, and who can see it. It covers Sprint 1.

## Where data lives

The app saves everything on the phone first, in the browser's localStorage. It then uploads a copy to Supabase for the research. If an upload fails, the data stays on the phone and the app tries again later (PRD NFR-3).

Each phone signs in to Supabase anonymously the first time the app opens. The player does not see this step. Each phone gets its own user in Supabase, and row-level security lets a player read and write only their own rows. The researcher sees all rows in the Supabase dashboard.

The tables are created by [supabase/migrations/20261107000000_init.sql](../supabase/migrations/20261107000000_init.sql).

## Tables

### players

One row per player. It is updated whenever the player's data changes.

| Column | Type | What it holds |
| --- | --- | --- |
| `user_id` | uuid | Supabase user ID, the primary key |
| `anonymous_id` | text | The device ID saved in localStorage |
| `name` | text | Display name (FR-1.1) |
| `consented_at` | timestamptz | When the player agreed to join the test (NFR-1) |
| `quiz_answers` | jsonb | BFI-2 item number → answer from 1 to 5, for the 15-item quiz and, if taken, the full test |
| `full_test_at` | timestamptz | When the full 60-item test was finished (FR-1.6), or null |
| `scores` | jsonb | Attribute → current score from 0 to 100 |
| `sides` | jsonb | Attribute → `low`, `high`, or `neutral` |
| `self_check` | jsonb | Attribute → `yes`, `partly`, or `no` (FR-1.7) |
| `quest_style` | text | `comfort` or `explore` (FR-1.8) |
| `focus_attributes` | text[] | One or two attributes the player wants to explore |
| `created_at`, `updated_at` | timestamptz | When the row was created and last changed |

### check_ins

One row per check-in. Rows are never changed after they are saved.

| Column | Type | What it holds |
| --- | --- | --- |
| `user_id` | uuid | Supabase user ID |
| `quest_id` | text | Quest ID from `data/quests.json`, such as `soc-01` |
| `created_at` | timestamptz | Time on the phone when the check-in was saved |
| `kind` | text | `stretch` or `home` |
| `day` | date | Game day, which starts at 4:00 a.m. China time |
| `reaction` | text | `liked`, `okay`, or `disliked` (FR-3.2) |
| `note` | text | The player's note, or an empty string |
| `tags` | text[] | Up to three tags (FR-3.3) |
| `attribute` | text | The quest's attribute |
| `moved_toward` | text | `low` or `high`, or null if the score did not move |
| `amount` | numeric | How many points the score moved |
| `capped` | boolean | Whether the weekly limit reduced the move (FR-4.1) |
| `flipped` | boolean | Whether the player's side switched (FR-4.3) |
| `uploaded_at` | timestamptz | When the row reached Supabase |

The primary key is `user_id`, `created_at`, and `quest_id`, so uploading the same check-in twice saves it once.

## Who can see what

- **Player.** Can read, add, and update their own `players` row, and read and add their own `check_ins`. Nobody can delete through the app.
- **Researcher.** Sees and exports every table from the Supabase dashboard.
- **Everyone else.** The publishable key in the app is public, but without a signed-in user it opens no rows.

## Deleting a tester's data

To delete a tester's data on request (NFR-4), find their user under Authentication > Users in the Supabase dashboard and delete it. Their `players` row and `check_ins` are deleted with it. To find the right user, ask the tester for their display name and look it up in `players`.

## Data on the phone

These localStorage keys all start with `me-online:`.

| Key | What it holds |
| --- | --- |
| `anonymousId` | The device ID |
| `profile` | Name and consent time |
| `quizProgress` | 15-item quiz answers and position |
| `fullTestProgress` | Full test answers and position |
| `character` | Scores, sides, weekly start scores, and when the full test was done |
| `playerSetup` | Self-check answers, quest style, and focus attributes |
| `today` | Today's quests, swap, and finished quests |
| `shownQuestIds` | Quests shown this week, so none repeat |
| `checkIns` | Every check-in, oldest first |

Supabase also keeps the anonymous session in localStorage under its own key.
