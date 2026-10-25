// The face icon for each check-in reaction, shared by the check-in screen
// and the History tab.

import { Frown, Meh, Smile, type LucideIcon } from 'lucide-react';
import type { Reaction } from '../game/attributeChange';

// In display order: 喜欢, 还行, 不喜欢.
export const REACTIONS: Reaction[] = ['liked', 'okay', 'disliked'];

export const REACTION_ICONS: Record<Reaction, LucideIcon> = {
  liked: Smile,
  okay: Meh,
  disliked: Frown,
};
