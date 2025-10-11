# LinkedClaims SDK - Quick Start

## Installation

```bash
npm install @cooperation/linked-claims
```

## Core Features: Validation & Normalization

```typescript
import {
  validateClaim,
  normalizeUri,
  starsToScore,
  userIdToUri
} from '@cooperation/linked-claims';

// 1. Validate claims before sending
const claim = {
  subject: "github.com/alice",  // Missing https://
  claim: "ENDORSES",
  stars: 5
};

const errors = validateClaim(claim);
if (errors.length > 0) {
  console.log(errors);
  // [{field: 'subject', error: 'Subject must be a valid URI'}]
}

// 2. Fix the issues using normalizers
claim.subject = normalizeUri("github.com/alice");
// Returns: "https://github.com/alice"

claim.score = starsToScore(5);
// Converts 5 stars → 1.0 score

// 3. Convert user IDs to URIs
const uri = userIdToUri(123);
// Returns: "https://live.linkedtrust.us/user/123"

// 4. Now the claim validates!
const valid = validateClaim(claim);
// Returns: [] (no errors)
```

## Complete Example: Creating a Claim

```typescript
import LinkedClaims, { validateClaim, normalizeUri, starsToScore } from '@cooperation/linked-claims';

const client = new LinkedClaims();

// Build your claim
const claimData = {
  subject: normalizeUri("github.com/alice"),
  claim: "ENDORSES",
  aspect: "typescript",
  statement: "Alice is an excellent TypeScript developer",
  stars: 5,
  score: starsToScore(5),
  howKnown: "FIRST_HAND" as const,
  sourceURI: normalizeUri("github.com/alice/awesome-project"),
  confidence: 0.95
};

// Validate before sending
const errors = validateClaim(claimData);
if (errors.length > 0) {
  throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
}

// Send to API
const response = await client.claims.create(claimData);
console.log(`Created claim ${response.claim.id}`);
```

## Key Utilities

### Validation
- `isValidUri(uri)` - Check if string is valid URI
- `validateClaimField(field, value)` - Validate single field
- `validateClaim(claim)` - Validate entire claim

### Normalization
- `normalizeUri(uri)` - Add https:// if needed
- `userIdToUri(id)` - Convert user ID to URI
- `starsToScore(stars)` - 0-5 stars → -1 to 1 score
- `scoreToStars(score)` - -1 to 1 score → 0-5 stars

### Constants
- `getBaseUrl()` - Get configured base URL
- `VALIDATION_LIMITS` - Min/max for scores, stars, etc.

## For create-trust-app Templates

Use the SDK to ensure all apps follow the same validation rules:

```typescript
// In your app's claim form component
import { validateClaim, normalizeUri, starsToScore } from '@cooperation/linked-claims';

function ClaimForm() {
  const handleSubmit = (formData) => {
    // Normalize user input
    const claim = {
      ...formData,
      subject: normalizeUri(formData.subject),
      object: formData.object ? normalizeUri(formData.object) : undefined,
      score: formData.stars ? starsToScore(formData.stars) : undefined
    };

    // Validate
    const errors = validateClaim(claim);
    if (errors.length > 0) {
      showErrors(errors);
      return;
    }

    // Submit valid claim
    submitClaim(claim);
  };
}
```