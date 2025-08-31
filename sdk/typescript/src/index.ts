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
export { AuthAPI, ProfileAPI } from './auth-api';
export { SemanticHelpers } from './semantic-helpers';
export { BaseAPIClient } from './base-api-client';

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
