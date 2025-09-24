# LinkedClaims SDK Enhancement Roadmap

## Overview
Enhance the existing LinkedClaims SDK to be the single source of truth for validation, normalization, and core claim operations across all LinkedTrust applications.

## Core Philosophy
- **Minimal opinions** - SDK provides validation & helpers, not business logic
- **Universal claim support** - Works for ALL claim types (impact, skills, risk, endorsements, etc.)
- **Developer friendly** - Clear errors, good defaults, but flexible
- **Single source of truth** - All apps use the same validation logic

## SDK Structure
```
@cooperation/linked-claims/
├── src/
│   ├── index.ts           # Exports everything
│   ├── types.ts           # Keep existing types + add ValidationResult
│   ├── validators.ts      # NEW - URI validation, field validation
│   ├── normalizers.ts     # NEW - Score/stars conversion, URI normalization
│   ├── constants.ts       # NEW - Base URLs, limits, etc.
│   ├── client.ts          # Keep existing API client
│   └── semantic-helpers.ts # Keep existing but make generic
```

## Implementation Tasks

### 1. Add Core Validation (`validators.ts`)
```typescript
export interface ValidationResult {
  field: string;
  valid: boolean;
  error?: string;
  details?: any;
}

// Core validators needed:
- isValidUri(uri: string): boolean
- validateClaimField(field: string, value: any): ValidationResult
- validateClaim(claim: Partial<Claim>): ValidationResult[]
- isValidDID(did: string): boolean
- isValidScore(score: number): boolean
- isValidStars(stars: number): boolean
```

### 2. Add Data Normalizers (`normalizers.ts`)
```typescript
// Data transformation functions:
- normalizeUri(uri: string): string | null
- userIdToUri(userId: string | number): string | null
- starsToScore(stars: number): number  // 0-5 → -1 to 1
- scoreToStars(score: number): number  // -1 to 1 → 0-5
- normalizeConfidence(value: any): number | null
```

### 3. Add Constants (`constants.ts`)
```typescript
// Shared configuration:
- getBaseUrl(): string  // Respects FRONTEND_URL, BASE_URL env vars
- VALIDATION_LIMITS = {
    minScore: -1,
    maxScore: 1,
    minStars: 0,
    maxStars: 5,
    minConfidence: 0,
    maxConfidence: 1
  }
- URI_PATTERNS = {
    http: /^https?:\/\//,
    did: /^did:[a-z0-9]+:.+/,
    urn: /^urn:[a-z0-9]+:.+/
  }
```

### 4. Update Existing Files

#### `types.ts`
- Add `ValidationResult` interface
- Add `ValidationError` type
- Keep all existing types unchanged

#### `semantic-helpers.ts`
- Remove opinionated labels (let apps decide)
- Keep generic helpers: `buildURI()`, `parseURI()`, `isValidURI()`
- Make field guidance optional/customizable

#### `index.ts`
- Export all validators as `validators`
- Export all normalizers as `normalizers`
- Export constants
- Maintain backwards compatibility

## Usage Examples

### Basic Validation
```typescript
import { validators, normalizers } from '@cooperation/linked-claims';

// Validate a URI
if (!validators.isValidUri(subject)) {
  throw new Error('Invalid subject URI');
}

// Validate entire claim
const errors = validators.validateClaim({
  subject: "123",  // Invalid - not a URI
  claim: "RATED",
  stars: 6         // Invalid - out of range
});
// Returns: [{field: 'subject', error: 'Must be valid URI'}, {field: 'stars', error: 'Must be 0-5'}]
```

### Data Normalization
```typescript
// Convert user ID to URI
const uri = normalizers.userIdToUri(123);
// Returns: "https://live.linkedtrust.us/user/123"

// Score conversion
const score = normalizers.starsToScore(5);    // → 1.0
const stars = normalizers.scoreToStars(0.6);  // → 4
```

### Different Use Cases

#### Impact Claims
```typescript
const impactClaim = {
  subject: normalizers.userIdToUri(projectId),
  claim: "IMPACT",
  object: "https://sdgs.un.org/goals/goal6",  // Clean water SDG
  amt: 50000,
  unit: "liters",
  statement: "Provided clean water access"
};
validators.validateClaim(impactClaim);
```

#### Skill Endorsements
```typescript
const skillClaim = {
  subject: "https://linkedin.com/in/developer",
  claim: "HAS_SKILL",
  object: "https://skills.example.com/javascript",
  stars: 5,
  score: normalizers.starsToScore(5)
};
```

#### Risk Reports
```typescript
const riskClaim = {
  subject: "https://example.com/entity/123",
  claim: "RISK_LEVEL",
  aspect: "financial",
  score: -0.8,  // High risk
  confidence: 0.95
};
```

## Testing Requirements
1. Unit tests for all validators
2. Unit tests for all normalizers
3. Integration test with real claims
4. Backwards compatibility tests

## Migration Guide for Apps

### trust_claim Frontend
```typescript
// Before
import { isValidUri } from '../lib/validators';
transformedDto.score = transformedDto.stars;

// After
import { validators, normalizers } from '@cooperation/linked-claims';
if (!validators.isValidUri(uri)) { ... }
transformedDto.score = normalizers.starsToScore(transformedDto.stars);
```

### trust_claim_backend
```typescript
// Before
import { isValidUri, userIdToUri } from '../lib/validators';

// After
import { validators, normalizers } from '@cooperation/linked-claims';
const isValid = validators.isValidUri(uri);
const uri = normalizers.userIdToUri(userId);
```

### Python Pipeline
```python
# Create Python equivalent
from linkedclaims import validators, normalizers

if not validators.is_valid_uri(uri):
    return None
    
score = normalizers.stars_to_score(5)
```

## Success Criteria
- [ ] All validation logic in one place
- [ ] Score normalization consistent across all apps
- [ ] No duplicate URI validation code
- [ ] Clear error messages for developers
- [ ] Works for all claim types without modification
- [ ] Python SDK matches TypeScript functionality

## Next Steps
1. Implement validators.ts
2. Implement normalizers.ts
3. Implement constants.ts
4. Update exports
5. Test with trust_claim app
6. Create Python equivalent
7. Update all apps to use SDK

## Enhancement Ideas for create-trust-app

### Current Issues
- Templates are too generic
- No validation built in
- No guidance on claim types

### Proposed Enhancements
1. **Template Selection**
   - Impact tracking app template
   - Skills/endorsement app template
   - Risk assessment template
   - Generic template (current)

2. **Built-in SDK Integration**
   ```typescript
   // Generated code should include:
   import { LinkedClaimsClient, validators, normalizers } from '@cooperation/linked-claims';
   
   // Pre-configured validation
   const validateInput = (data) => {
     const errors = validators.validateClaim(data);
     if (errors.length > 0) {
       // Handle errors
     }
   };
   ```

3. **Interactive Setup**
   - Ask: "What type of claims will this app handle?"
   - Ask: "Do you need authentication?"
   - Ask: "Will you store claims locally or use API?"

4. **Better Examples**
   - Show real-world claim examples for chosen type
   - Include validation in examples
   - Show score vs stars usage

5. **Configuration File**
   ```json
   // .linkedclaimsrc.json
   {
     "claimTypes": ["IMPACT", "HAS_SKILL"],
     "baseUrl": "https://api.linkedtrust.us",
     "features": {
       "auth": true,
       "localFirst": false,
       "validation": "strict"
     }
   }
   ```

This roadmap provides a complete plan that can be followed even if this conversation ends. The SDK becomes the single source of truth while remaining flexible enough for any claim type.
