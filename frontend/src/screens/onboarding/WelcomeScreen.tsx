// 01 Welcome: explains the idea in two sentences and shows a sample quest.
// The "sign in" link from the wireframe is hidden until accounts exist.

import { TEXT } from '../../text';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <div className="page">
      <div className="page-body welcome">
        <h1 className="welcome-title">{TEXT.appName}</h1>
        {TEXT.welcome.tagline.map((line) => (
          <p key={line} className="welcome-tagline">
            {line}
          </p>
        ))}

        <p className="welcome-sample-label">{TEXT.welcome.sampleLabel}</p>
        <div className="quest-card quest-card-sample">
          <div className="quest-card-meta">
            <span className="tag tag-stretch">{TEXT.questKind.stretch}</span>
            <span className="tag">{TEXT.attributeNames.curiosity}</span>
            <span className="quest-card-time">{TEXT.welcome.sampleQuestTime}</span>
          </div>
          <p className="quest-card-title">{TEXT.welcome.sampleQuestTitle}</p>
        </div>
      </div>

      <div className="page-footer">
        <button type="button" className="button-primary" onClick={onStart}>
          {TEXT.welcome.start}
        </button>
      </div>
    </div>
  );
}
