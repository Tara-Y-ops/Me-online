// Bottom navigation bar linking the four main pages (see docs/user-flows.md).

import { History, House, Map as MapIcon, User } from 'lucide-react';
import { TEXT } from '../text';

export type Tab = 'today' | 'character' | 'map' | 'history';

// Tabs in display order, each with its icon.
const TABS = [
  { id: 'today', icon: House },
  { id: 'character', icon: User },
  { id: 'map', icon: MapIcon },
  { id: 'history', icon: History },
] as const;

interface BottomNavProps {
  current: Tab;
  onChange: (tab: Tab) => void;
}

export function BottomNav({ current, onChange }: BottomNavProps) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, icon: Icon }) => (
        <button
          key={id}
          type="button"
          className="bottom-nav-item"
          aria-current={id === current ? 'page' : undefined}
          onClick={() => onChange(id)}
        >
          <Icon size={24} aria-hidden="true" />
          <span>{TEXT.tabs[id]}</span>
        </button>
      ))}
    </nav>
  );
}
