// Quiz answers saved after every tap, so an unfinished quiz resumes where it
// stopped (PRD FR-1.3). The answers are kept after the quiz ends so the full
// 60-item test can reuse them later (FR-1.6).

import type { QuizAnswers } from '../game/quiz';
import { loadJson, saveJson } from './localStore';

const QUIZ_PROGRESS_KEY = 'quizProgress';

export interface QuizProgress {
  answers: QuizAnswers; // Keyed by BFI-2 item number
  index: number; // Position of the item on screen, 0-based
}

export function loadQuizProgress(): QuizProgress {
  return loadJson<QuizProgress>(QUIZ_PROGRESS_KEY) ?? { answers: {}, index: 0 };
}

export function saveQuizProgress(progress: QuizProgress): boolean {
  return saveJson(QUIZ_PROGRESS_KEY, progress);
}
