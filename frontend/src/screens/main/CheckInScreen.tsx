// 09 Check-in: the player picks how the quest felt, and can add a short note
// and up to three tags of their own (PRD FR-3.2, FR-3.3).
// A reaction is required to save; the note and tags are optional.

import { Plus, X } from 'lucide-react';
import { useState, type KeyboardEvent } from 'react';
import { PageHeader } from '../../components/PageHeader';
import { REACTION_ICONS, REACTIONS } from '../../components/reactionIcons';
import type { Reaction } from '../../game/attributeChange';
import { cleanTags, MAX_NOTE_LENGTH, MAX_TAG_LENGTH, MAX_TAGS } from '../../game/checkIn';
import type { QuestKind } from '../../game/questPicker';
import type { Quest } from '../../game/quests';
import type { CheckInForm } from '../../storage/checkIns';
import { TEXT } from '../../text';

interface CheckInScreenProps {
  quest: Quest;
  kind: QuestKind;
  onBack: () => void;
  onSave: (form: CheckInForm) => void;
}

export function CheckInScreen({ quest, kind, onBack, onSave }: CheckInScreenProps) {
  const [reaction, setReaction] = useState<Reaction | null>(null);
  const [note, setNote] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  // The text box for a new tag, shown after tapping "添加".
  const [tagDraft, setTagDraft] = useState<string | null>(null);

  // Adds the typed tag (cleaned up the same way as when saving) and closes the box.
  function commitTag() {
    if (tagDraft !== null) {
      setTags(cleanTags([...tags, tagDraft]));
      setTagDraft(null);
    }
  }

  function handleTagKey(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      commitTag();
    }
  }

  return (
    <div className="page">
      <PageHeader title={TEXT.checkIn.title} onBack={onBack} />

      <div className="page-body">
        <div className="check-in-quest">
          <span className={kind === 'stretch' ? 'tag tag-stretch' : 'tag'}>{TEXT.questKind[kind]}</span>
          <p className="quest-card-title">{quest.title.zh}</p>
        </div>

        <h2 className="form-heading">{TEXT.checkIn.feeling}</h2>
        <div className="reaction-row" role="radiogroup">
          {REACTIONS.map((value) => {
            const Icon = REACTION_ICONS[value];
            return (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={reaction === value}
                className={reaction === value ? 'reaction reaction-selected' : 'reaction'}
                onClick={() => setReaction(value)}
              >
                <Icon size={32} strokeWidth={1.5} aria-hidden="true" />
                {TEXT.checkIn.reactions[value]}
              </button>
            );
          })}
        </div>

        <h2 className="form-heading">{TEXT.checkIn.why}</h2>
        <textarea
          className="note-input"
          value={note}
          maxLength={MAX_NOTE_LENGTH}
          placeholder={TEXT.checkIn.notePlaceholder}
          aria-label={TEXT.checkIn.why}
          onChange={(event) => setNote(event.target.value)}
        />

        <h2 className="form-heading">{TEXT.checkIn.tags}</h2>
        <div className="chip-row">
          {tags.map((tag) => (
            <span key={tag} className="chip chip-selected tag-chip">
              {tag}
              <button
                type="button"
                className="tag-remove"
                aria-label={TEXT.checkIn.removeTag(tag)}
                onClick={() => setTags(tags.filter((item) => item !== tag))}
              >
                <X size={14} aria-hidden="true" />
              </button>
            </span>
          ))}
          {tagDraft !== null && (
            <input
              className="chip tag-input"
              value={tagDraft}
              maxLength={MAX_TAG_LENGTH}
              autoFocus
              aria-label={TEXT.checkIn.addTag}
              onChange={(event) => setTagDraft(event.target.value)}
              onKeyDown={handleTagKey}
              onBlur={commitTag}
            />
          )}
          {tagDraft === null && tags.length < MAX_TAGS && (
            <button type="button" className="chip tag-add" onClick={() => setTagDraft('')}>
              {TEXT.checkIn.addTag}
              <Plus size={14} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>

      <div className="page-footer">
        <button
          type="button"
          className="button-primary"
          disabled={!reaction}
          onClick={() => reaction && onSave({ reaction, note, tags })}
        >
          {TEXT.checkIn.save}
        </button>
      </div>
    </div>
  );
}
