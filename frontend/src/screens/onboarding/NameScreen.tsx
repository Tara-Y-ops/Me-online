// 03 Name: the player picks a display name for their character (FR-1.1).

import { useState, type FormEvent } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { TEXT } from '../../text';

// Long enough for a nickname, short enough to fit on one line on a phone.
const MAX_NAME_LENGTH = 12;

interface NameScreenProps {
  onBack: () => void;
  onSubmit: (name: string) => void;
}

export function NameScreen({ onBack, onSubmit }: NameScreenProps) {
  const [name, setName] = useState('');
  const trimmed = name.trim();

  // A form lets the keyboard's "go" key submit too.
  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (trimmed) {
      onSubmit(trimmed);
    }
  }

  return (
    <form className="page" onSubmit={handleSubmit}>
      <PageHeader title={TEXT.name.title} onBack={onBack} />

      <div className="page-body">
        <input
          className="text-input"
          value={name}
          maxLength={MAX_NAME_LENGTH}
          autoFocus
          aria-label={TEXT.name.title}
          onChange={(event) => setName(event.target.value)}
        />
        <p className="hint">{TEXT.name.examples}</p>
        <p className="hint">{TEXT.name.quizIntro}</p>
      </div>

      <div className="page-footer">
        <button type="submit" className="button-primary" disabled={!trimmed}>
          {TEXT.name.start}
        </button>
      </div>
    </form>
  );
}
