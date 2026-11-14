// 13 Character tab: name, check-in count, the five attribute bars, and the
// player's quest style (PRD FR-5.1).
// Offers the full 60-item test until it is done (FR-1.6).
// The top right shows "登录保存进度", or the email once signed up (13, 22),
// with a sign-out link at the bottom (FR-9.1).
// The quest style card opens a page to change the style and focus (FR-1.9).

import { ChevronRight, CircleCheck, User } from 'lucide-react';
import { AttributeBar } from '../../components/AttributeBar';
import { FullTestCard } from '../../components/FullTestCard';
import { ATTRIBUTE_IDS } from '../../game/attributes';
import type { Character, PlayerSetup, Profile } from '../../game/types';
import { TEXT } from '../../text';

interface CharacterTabProps {
  profile: Profile;
  character: Character;
  setup: PlayerSetup;
  checkInCount: number;
  accountEmail: string | null; // null for an anonymous player
  onFullTest: () => void;
  onEditStyle: () => void;
  onSignIn: () => void;
  onSignOut: () => void;
}

export function CharacterTab(props: CharacterTabProps) {
  const { profile, character, setup, checkInCount, accountEmail, onFullTest, onEditStyle, onSignIn, onSignOut } =
    props;
  const styleTitle = TEXT.questStyle.options[setup.questStyle].title;
  const focusNames = setup.focusAttributes.map((attribute) => TEXT.attributeNames[attribute]);

  return (
    <>
      <div className="screen-title-row">
        <h1 className="screen-title">{TEXT.screenTitles.character}</h1>
        {accountEmail ? (
          <span className="account-link">
            <CircleCheck size={18} aria-hidden="true" />
            <span className="account-email">{accountEmail}</span>
          </span>
        ) : (
          <button type="button" className="account-link" onClick={onSignIn}>
            <User size={18} aria-hidden="true" />
            {TEXT.characterTab.signIn}
          </button>
        )}
      </div>

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

      <button type="button" className="info-card character-style-card" onClick={onEditStyle}>
        <span>
          <span className="option-title">{TEXT.characterTab.questStyle(styleTitle)}</span>
          <span className="hint">{TEXT.characterTab.focus(focusNames)}</span>
        </span>
        <span className="style-edit">
          {TEXT.characterTab.edit}
          <ChevronRight size={20} aria-hidden="true" />
        </span>
      </button>

      {!character.fullTestAt && <FullTestCard title={TEXT.fullTest.characterCard} onOpen={onFullTest} />}

      {/* Signing out clears the device and returns to the welcome screen. */}
      {accountEmail && (
        <button type="button" className="text-button" onClick={onSignOut}>
          {TEXT.characterTab.signOut}
        </button>
      )}
    </>
  );
}
