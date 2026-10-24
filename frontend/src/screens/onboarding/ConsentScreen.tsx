// 02 Consent: the player must tick the box before continuing (NFR-1).

import { useState } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { TEXT } from '../../text';

interface ConsentScreenProps {
  onBack: () => void;
  onAgree: () => void;
}

export function ConsentScreen({ onBack, onAgree }: ConsentScreenProps) {
  const [checked, setChecked] = useState(false);

  return (
    <div className="page">
      <PageHeader title={TEXT.consent.title} onBack={onBack} />

      <div className="page-body">
        <h2 className="section-heading">{TEXT.consent.heading}</h2>
        {TEXT.consent.paragraphs.map((paragraph) => (
          <p key={paragraph} className="body-text">
            {paragraph}
          </p>
        ))}

        <label className="consent-box">
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
          {TEXT.consent.checkbox}
        </label>
      </div>

      <div className="page-footer">
        <button type="button" className="button-primary" disabled={!checked} onClick={onAgree}>
          {TEXT.consent.continue}
        </button>
      </div>
    </div>
  );
}
