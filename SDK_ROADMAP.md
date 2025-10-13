# LinkedClaims SDK Enhancement Roadmap

## Core Philosophy
- **Minimal opinions** - SDK provides validation & helpers, not business logic
- **Universal claim support** - Works for ALL claim types (impact, skills, risk, etc.)
- **Developer friendly** - Clear errors, good defaults, but flexible

## SDK Structure

```
@cooperation/linked-claims/
├── src/
│   ├── index.ts           # Exports everything
│   ├── types.ts           # Keep existing types
│   ├── validators.ts      # URI validation, field validation
│   ├── normalizers.ts     # Score/stars conversion, URI normalization
│   ├── client.ts          # Keep existing API client
│   ├── semantic-helpers.ts # Keep existing but make generic
│   └── constants.ts       # Base URLs, limits, etc.
```

## Implementation Steps

### Step 1: Add validators.ts
```typescript
// Core validation that ALL apps need
- isValidUri(uri: string): boolean
- validateClaimField(field: string, value: any): ValidationResult
- validateClaim(claim: Partial<Claim>): ValidationResult[]
```

### Step 2: Add normalizers.ts
```typescript
// Data normalization
- normalizeUri(uri: string): string | null
- userIdToUri(userId: string | number): string | null
- starsToScore(stars: number): number  // 0-5 → -1 to 1
- scoreToStars(score: number): number  // -1 to 1 → 0-5
```

### Step 3: Add constants.ts
```typescript
// Shared constants
- getBaseUrl(): string  // Respects env vars
- VALIDATION_LIMITS = { minScore: -1, maxScore: 1, minStars: 0, maxStars: 5 }
```

### Step 4: Update types.ts
- Add `ValidationResult` type
- Keep all existing types

### Step 5: Update semantic-helpers.ts
- Remove opinionated field labels
- Keep generic helpers like `buildURI`, `parseURI`
- Let apps customize labels for their use case

### Step 6: Update index.ts
- Export all new modules

### Step 7: Test with trust_claim app
- Replace local validation with SDK validation
- Replace local normalizers with SDK normalizers

### Step 8: Update Python pipeline
- Create equivalent validators.py
- Create equivalent normalizers.py
- Ensure same validation logic

## Usage Examples

```typescript
import { LinkedClaimsClient, validators, normalizers } from '@cooperation/linked-claims';

// Validate before sending
const claim = {
  subject: "123",  // Invalid
  claim: "RATED",
  stars: 5
};

const errors = validators.validateClaim(claim);
// [{field: 'subject', error: 'Must be valid URI'}]

// Normalize data
claim.subject = normalizers.userIdToUri(123);  // → "https://live.linkedtrust.us/user/123"
claim.score = normalizers.starsToScore(5);     // → 1.0

// Send claim
const client = new LinkedClaimsClient({ baseUrl });
await client.claims.create(claim);
```

## What Apps Handle Themselves
- Form labels ("Rate your experience" vs "Report issue")
- Which fields to show
- Business logic (what claims to allow)
- UI components

## Success Criteria
- All apps use same validation logic
- Score/stars conversion is consistent everywhere
- URIs are validated the same way
- Python pipeline matches TypeScript validation
