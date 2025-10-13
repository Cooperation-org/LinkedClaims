/**
 * LinkedClaims SDK
 * 
 * Drop-in replacement for trust-claim-client and linkedtrust-client
 * Works out of the box with trust_claim_backend API
 */

// Main client
export { LinkedClaims, linkedClaims, default } from './client';

// Types
export * from './types';

// Individual modules for advanced usage
export { TokenManager } from './token-manager';
export { ClaimsAPI } from './claims-api';
export { CredentialsAPI } from './credentials-api';
export { AuthAPI, ProfileAPI } from './auth-api';
export { SemanticHelpers } from './semantic-helpers';
export { BaseAPIClient } from './base-api-client';

// New validation and normalization modules
export * as validators from './validators';
export * as normalizers from './normalizers';
export * as constants from './constants';

// Direct exports for convenience
export { isValidUri, validateClaim, validateClaimField } from './validators';
export { starsToScore, scoreToStars, normalizeUri, userIdToUri } from './normalizers';
export { getBaseUrl, VALIDATION_LIMITS, DEFAULTS, ENDPOINTS } from './constants';

// Convenience re-exports for common types
export type {
    Claim,
    CreateClaimInput,
    User,
    AuthResponse,
    HowKnown,
    EntityType,
    IssuerIdType
} from './types';
