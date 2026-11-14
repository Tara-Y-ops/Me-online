// A thin bar at the top of every screen with the button that switches
// between Chinese and English. The button is labeled in the other language.

import { TEXT } from '../text';

interface LanguageButtonProps {
  onClick: () => void;
}

export function LanguageButton({ onClick }: LanguageButtonProps) {
  return (
    <div className="language-bar">
      <button type="button" className="language-button" aria-label={TEXT.languageSwitch.ariaLabel} onClick={onClick}>
        {TEXT.languageSwitch.label}
      </button>
    </div>
  );
}
