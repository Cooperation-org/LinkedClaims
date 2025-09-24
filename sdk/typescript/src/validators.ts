import { Claim } from './types';

export interface ValidationResult {
  field: string;
  error: string;
  value?: any;
}

/**
 * Check if a string is a valid URI with proper scheme and structure
 */
export function isValidUri(uri: string): boolean {
  if (!uri || typeof uri !== 'string') {
    return false;
  }
  
  // Check for basic URI pattern - must have a scheme
  const uriPattern = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(uri);
  
  if (!uriPattern) {
    return false;
  }
  
  try {
    // Use URL constructor for http/https URLs
    if (uri.startsWith('http://') || uri.startsWith('https://')) {
      new URL(uri);
      return true;
    }
    
    // For other schemes (urn:, did:, etc.), just check basic structure
    return /^[a-zA-Z][a-zA-Z0-9+.-]*:[^\s]+$/.test(uri);
  } catch {
    return false;
  }
}

/**
 * Validate a single claim field
 */
export function validateClaimField(field: string, value: any): ValidationResult | null {
  switch (field) {
    case 'subject':
      if (!value) {
        return { field, error: 'Subject is required' };
      }
      if (!isValidUri(value)) {
        return { field, error: 'Subject must be a valid URI', value };
      }
      break;
      
    case 'claim':
      if (!value || typeof value !== 'string') {
        return { field, error: 'Claim type is required and must be a string' };
      }
      break;
      
    case 'object':
      if (value && !isValidUri(value)) {
        return { field, error: 'Object must be a valid URI if provided', value };
      }
      break;
      
    case 'sourceURI':
      if (value && value !== '' && !isValidUri(value)) {
        return { field, error: 'Source URI must be a valid URI if provided', value };
      }
      break;
      
    case 'issuerId':
      if (value && !isValidUri(value)) {
        return { field, error: 'Issuer ID must be a valid URI (including DIDs)', value };
      }
      break;
      
    case 'confidence':
      if (value !== undefined && value !== null) {
        const conf = Number(value);
        if (isNaN(conf) || conf < 0 || conf > 1) {
          return { field, error: 'Confidence must be between 0 and 1', value };
        }
      }
      break;
      
    case 'stars':
      if (value !== undefined && value !== null) {
        const stars = Number(value);
        if (isNaN(stars) || stars < 0 || stars > 5) {
          return { field, error: 'Stars must be between 0 and 5', value };
        }
      }
      break;
      
    case 'score':
      if (value !== undefined && value !== null) {
        const score = Number(value);
        if (isNaN(score) || score < -1 || score > 1) {
          return { field, error: 'Score must be between -1 and 1', value };
        }
      }
      break;
      
    case 'amt':
      if (value !== undefined && value !== null) {
        const amt = Number(value);
        if (isNaN(amt)) {
          return { field, error: 'Amount must be a valid number', value };
        }
      }
      break;
  }
  
  return null;
}

/**
 * Validate an entire claim
 */
export function validateClaim(claim: Partial<Claim>): ValidationResult[] {
  const errors: ValidationResult[] = [];
  
  // Validate each field
  Object.entries(claim).forEach(([field, value]) => {
    const error = validateClaimField(field, value);
    if (error) {
      errors.push(error);
    }
  });
  
  // Additional cross-field validation
  if (!claim.subject) {
    errors.push({ field: 'subject', error: 'Subject is required' });
  }
  
  if (!claim.claim) {
    errors.push({ field: 'claim', error: 'Claim type is required' });
  }
  
  return errors;
}
