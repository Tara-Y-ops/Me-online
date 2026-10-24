// Top bar for pages with a centered title and a back arrow.

import { ChevronLeft } from 'lucide-react';
import { TEXT } from '../text';

interface PageHeaderProps {
  title: string;
  onBack: () => void;
}

export function PageHeader({ title, onBack }: PageHeaderProps) {
  return (
    <header className="page-header">
      <button type="button" className="icon-button" aria-label={TEXT.back} onClick={onBack}>
        <ChevronLeft size={26} aria-hidden="true" />
      </button>
      <h1>{title}</h1>
      {/* Empty cell keeps the title centered. */}
      <span />
    </header>
  );
}
