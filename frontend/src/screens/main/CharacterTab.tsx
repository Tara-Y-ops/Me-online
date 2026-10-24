// 13 Character tab: name, check-in count, the five attribute bars, and the
// player's quest style (PRD FR-5.1).
// Not here yet: editing the quest style (FR-1.9, next PR), the full 60-item
// test entry, and the sign-in link (hidden until accounts exist).

import { User } from 'lucide-react';
import { AttributeBar } from '../../components/AttributeBar';
import { ATTRIBUTE_IDS } from '../../game/attributes';
import type { Character } from '../../storage/character';
import type { PlayerSetup } from '../../storage/playerSetup';
import type { Profile } from '../../storage/profile';
import { TEXT } from '../../text';

interface CharacterTabProps {
  profile: Profile;
  character: Character;
  setup: PlayerSetup;
  checkInCount: number;
}

export function CharacterTab({ profile, character, setup, checkInCount }: CharacterTabProps) {
  const styleTitle = TEXT.questStyle.options[setup.questStyle].title;
  const focusNames = setup.focusAttributes
    .map((attribute) => TEXT.attributeNames[attribute])
    .join('、');

  return (
    <>
      <h1 className="screen-title">{TEXT.screenTitles.character}</h1>

      <div className="profile-row">
        <div className="avatar">
          <User size={32} aria-hidden="true" />
        </div>
        <div>
          <p className="profile-name">{profile.name}</p>
          <p className="hint">{TEXT.characterTab.checkInCount(checkInCount)}</p>
        </div>
      </div>

      <div className="attribute-list">
        {ATTRIBUTE_IDS.map((attribute) => (
          <AttributeBar
            key={attribute}
            attribute={attribute}
            score={character.scores[attribute]}
            side={character.sides[attribute]}
          />
        ))}
      </div>

      <div className="info-card character-style-card">
        <p className="option-title">{TEXT.characterTab.questStyle(styleTitle)}</p>
        <p className="hint">{TEXT.characterTab.focus(focusNames)}</p>
      </div>
    </>
  );
}
