/**
 * Get the base URL for the application - single source of truth
 */
export function getBaseUrl(): string {
  // Check if we're in Node.js environment
  if (typeof process !== 'undefined' && process.env) {
    return process.env.FRONTEND_URL || process.env.BASE_URL || 'https://live.linkedtrust.us';
  }
  
  // Browser environment - could check window.location or use a default
  if (typeof window !== 'undefined' && window.location) {
    // Could use window.location.origin for same-origin API calls
    // but for now, use the default
  }
  
  return 'https://live.linkedtrust.us';
}

/**
 * Validation limits and constraints
 */
export const VALIDATION_LIMITS = {
  minScore: -1,
  maxScore: 1,
  minStars: 0,
  maxStars: 5,
  minConfidence: 0,
  maxConfidence: 1,
  maxStatementLength: 5000,
  maxUriLength: 2048
} as const;

/**
 * Default values
 */
export const DEFAULTS = {
  confidence: 1.0,
  howKnown: 'FIRST_HAND',
  issuerIdType: 'URL'
} as const;

/**
 * API endpoints - relative to baseUrl
 */
export const ENDPOINTS = {
  claims: '/api/claims',
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    refresh: '/api/auth/refresh',
    logout: '/api/auth/logout'
  },
  nodes: '/api/nodes',
  graph: '/api/graph'
} as const;
