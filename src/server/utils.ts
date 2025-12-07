import { createHash } from 'crypto';
import type { StoryGenerationConfig } from '@/lib/types';

/**
 * Compute a unique hash for story generation config
 * Used to detect duplicate story requests
 * NOTE: This is server-only (uses Node.js crypto)
 */
export function computeConfigHash(config: StoryGenerationConfig): string {
  const normalized = {
    theme: config.theme.toLowerCase(),
    length: config.length.toLowerCase(),
    faith: config.faithPreference.toLowerCase(),
    parent1: config.parentOneName.trim().toLowerCase(),
    parent2: (config.parentTwoName || '').trim().toLowerCase(),
    baby: (config.babyNickname || '').trim().toLowerCase(),
    // NOTE: dueDate intentionally excluded from hash
  };

  const json = JSON.stringify(normalized, Object.keys(normalized).sort());
  return createHash('sha256').update(json).digest('hex').slice(0, 32);
}

