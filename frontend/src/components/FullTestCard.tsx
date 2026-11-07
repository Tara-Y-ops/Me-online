// Dashed card that opens the full 60-item test (wireframes 05 and 13).
// Screens hide it once the test is done (FR-1.6).

import { ChevronRight } from 'lucide-react';

interface FullTestCardProps {
  title: string;
  note?: string;
  onOpen: () => void;
}

export function FullTestCard({ title, note, onOpen }: FullTestCardProps) {
  return (
    <button type="button" className="full-test-card" onClick={onOpen}>
      <span>
        <span className="option-title">{title}</span>
        {note && <span className="hint">{note}</span>}
      </span>
      <ChevronRight size={22} aria-hidden="true" />
    </button>
  );
}
