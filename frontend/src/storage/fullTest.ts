// Saves progress on the full 60-item test, so it resumes where it stopped,
// and saves the rescored character at the end (PRD FR-1.6).
// The rules are in game/fullTest.ts.

import { gameWeekStart } from '../game/chinaTime';
import { applyFullTest } from '../game/fullTest';
import type { QuizAnswers } from '../game/quiz';
import type { Character } from '../game/types';
import { saveCharacter } from './character';
import { loadJson, saveJson } from './localStore';
import { loadQuizProgress, type QuizProgress } from './quizProgress';

const FULL_TEST_PROGRESS_KEY = 'fullTestProgress';

// index is the position in REMAINING_ITEMS. A new test starts with the 15
// quiz answers, so they are not asked again.
export function loadFullTestProgress(): QuizProgress {
  return loadJson<QuizProgress>(FULL_TEST_PROGRESS_KEY) ?? { answers: loadQuizProgress().answers, index: 0 };
}

export function saveFullTestProgress(progress: QuizProgress): boolean {
  return saveJson(FULL_TEST_PROGRESS_KEY, progress);
}

// Rescores and saves the character. The answers stay saved for the research.
export function finishFullTest(character: Character, answers: QuizAnswers, now = new Date()): Character {
  const next = applyFullTest(character, answers, gameWeekStart(now), now);
  saveCharacter(next);
  return next;
}
