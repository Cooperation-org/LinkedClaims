import { isValidUri } from './validators';
import { getBaseUrl } from './constants';

/**
 * Normalize a URI - returns null if invalid
 */
export function normalizeUri(uri: string): string | null {
  if (!uri || typeof uri !== 'string') {
    return null;
  }
  
  // Already valid URI
  if (isValidUri(uri)) {
    return uri;
  }
  
  // Try adding https:// for domain-like strings
  if (/^([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(\/.*)?$/.test(uri)) {
    const withScheme = `https://${uri}`;
    if (isValidUri(withScheme)) {
      return withScheme;
    }
  }
  
  return null;
}

/**
 * Convert a numeric user ID to a proper URI
 */
export function userIdToUri(userId: string | number | undefined): string | null {
  if (!userId) {
    return null;
  }
  
  const baseUrl = getBaseUrl();
  
  if (typeof userId === 'number' || (typeof userId === 'string' && /^\d+$/.test(userId))) {
    // Convert numeric ID to URI format
    return `${baseUrl}/user/${userId}`;
  } else if (typeof userId === 'string' && isValidUri(userId)) {
    // Already a valid URI (including DIDs)
    return userId;
  }
  
  return null;
}

/**
 * Convert 0-5 star rating to -1 to 1 score
 * 0 stars = -1, 2.5 stars = 0, 5 stars = 1
 */
export function starsToScore(stars: number): number {
  if (stars < 0 || stars > 5) {
    throw new Error('Stars must be between 0 and 5');
  }
  return (stars - 2.5) / 2.5;
}

/**
 * Convert -1 to 1 score to 0-5 star rating
 * -1 = 0 stars, 0 = 2.5 stars, 1 = 5 stars
 */
export function scoreToStars(score: number): number {
  if (score < -1 || score > 1) {
    throw new Error('Score must be between -1 and 1');
  }
  return score * 2.5 + 2.5;
}

/**
 * Round stars to nearest half or whole
 */
export function roundStars(stars: number): number {
  return Math.round(stars * 2) / 2;
}

/**
 * Ensure a number is within bounds
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}
