// 04 Quiz: the 15-item short form, one item per screen with a progress bar.
// The player can go back but cannot skip an item (FR-1.2, FR-1.3).
// Every answer is saved right away, so closing the app mid-quiz loses nothing.

import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { ANSWER_LABELS, SHORT_FORM_ITEMS, type Answer, type QuizAnswers } from '../../game/quiz';
import { loadQuizProgress, saveQuizProgress } from '../../storage/quizProgress';
import { TEXT } from '../../text';

const ANSWERS: Answer[] = [1, 2, 3, 4, 5];

interface QuizScreenProps {
  onFinish: (answers: QuizAnswers) => void;
}

export function QuizScreen({ onFinish }: QuizScreenProps) {
  // Starts from saved progress, or the first item for a new quiz.
  const [progress, setProgress] = useState(loadQuizProgress);
  const { answers, index } = progress;

  const total = SHORT_FORM_ITEMS.length;
  const item = SHORT_FORM_ITEMS[index];
  const selected = answers[item.id];
  const isLast = index === total - 1;

  // Updates the screen and saves in one step.
  function update(next: typeof progress) {
    setProgress(next);
    saveQuizProgress(next);
  }

  function choose(answer: Answer) {
    update({ index, answers: { ...answers, [item.id]: answer } });
  }

  function goNext() {
    if (isLast) {
      onFinish(answers);
    } else {
      update({ answers, index: index + 1 });
    }
  }

  function goBack() {
    update({ answers, index: index - 1 });
  }

  return (
    <div className="page">
      {/* The header back arrow works like "previous" and is hidden on the first item. */}
      <PageHeader title={TEXT.quiz.title} onBack={index > 0 ? goBack : undefined} />

      <div className="page-body">
        <p className="hint">{TEXT.quiz.progress(index + 1, total)}</p>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>

        <p className="quiz-stem">{TEXT.quiz.stem}</p>
        <h2 className="quiz-item">{item.text}</h2>

        <div className="options" role="radiogroup">
          {ANSWERS.map((answer) => (
            <label
              key={answer}
              className={answer === selected ? 'option option-selected' : 'option'}
            >
              <input
                type="radio"
                name={`item-${item.id}`}
                checked={answer === selected}
                onChange={() => choose(answer)}
              />
              {ANSWER_LABELS[answer]}
            </label>
          ))}
        </div>
      </div>

      <div className="page-footer button-row">
        <button type="button" className="button-secondary" disabled={index === 0} onClick={goBack}>
          {TEXT.quiz.previous}
        </button>
        <button
          type="button"
          className="button-primary"
          disabled={selected === undefined}
          onClick={goNext}
        >
          {isLast ? TEXT.quiz.finish : TEXT.quiz.next}
        </button>
      </div>
    </div>
  );
}
