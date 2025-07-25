// Main lyrics index file
import { chainReactionLyrics } from './chainReaction';
import { frenchStorytellerLyrics } from './frenchStoryteller';
import { noirStorytellerLyrics } from './noirStoryteller';
import { oldTechLyrics } from './oldTech';

// Export all lyrics in an array indexed by their track number
export const allLyrics = [
  chainReactionLyrics,     // Track 0
  frenchStorytellerLyrics, // Track 1
  noirStorytellerLyrics,   // Track 2
  oldTechLyrics            // Track 3
];

// Types for the lyrics system
export interface LyricItem {
  type: 'heading' | 'subheading' | 'line' | 'note' | 'spacer';
  text?: string;
}

export interface SongLyrics {
  title: string;
  style: string;
  lyrics: LyricItem[];
  typewriterMode?: boolean;
}
