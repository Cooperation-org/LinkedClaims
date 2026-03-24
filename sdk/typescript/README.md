# @cooperation/linkedclaims

Core TypeScript SDK for [LinkedClaims](https://github.com/Cooperation-org/LinkedClaims) — types, validators, normalizers, and API client for the decentralized web of trust.

Also published as `@linked-claims/linkedclaims`.

**Spec:** [LinkedClaims at DIF Labs](https://identity.foundation/labs-linkedclaims/)
**Docs:** [LinkedClaims repo](https://github.com/Cooperation-org/LinkedClaims/tree/main/docs)
**Field Reference:** [docs/field-reference.md](https://github.com/Cooperation-org/LinkedClaims/blob/main/docs/field-reference.md)

For ATProto/Bluesky publishing, see [@cooperation/claim-atproto](https://github.com/Cooperation-org/claim-atproto).

## Installation

```bash
npm install @cooperation/linkedclaims
```

## Quick Start

```typescript
import LinkedClaims, { validateClaim, starsToScore } from '@cooperation/linkedclaims';

// Initialize client (defaults to live.linkedtrust.us)
const client = new LinkedClaims();

// Or point at a different backend
const client = new LinkedClaims({ baseUrl: 'https://dev.linkedtrust.us' });

// Validate a claim before sending
const errors = validateClaim({
  subject: 'https://github.com/alice',
  claim: 'HAS_SKILL',
  object: 'React',
  stars: 4
});

if (errors.length === 0) {
  await client.auth.login('user@example.com', 'password');

  const { claim } = await client.claims.create({
    subject: 'https://github.com/alice',
    claim: 'HAS_SKILL',
    object: 'React',
    statement: 'Alice is an excellent React developer',
    stars: 4,
    howKnown: 'FIRST_HAND',
    sourceURI: 'https://github.com/alice/react-project'
  });
}
```

## What's in the SDK

### Types

```typescript
import type { Claim, CreateClaimInput, HowKnown, EntityType, IssuerIdType } from '@cooperation/linkedclaims';
```

### Validators

```typescript
import { validateClaim, validateClaimField, isValidUri } from '@cooperation/linkedclaims';

validateClaim({ subject: 'not-a-uri', claim: 'HAS_SKILL' });
// [{ field: 'subject', error: 'Subject must be a valid URI' }]

isValidUri('https://github.com/alice');  // true
isValidUri('did:plc:abc123');            // true
isValidUri('just a string');             // false
```

### Normalizers

```typescript
import { starsToScore, scoreToStars, normalizeUri, userIdToUri } from '@cooperation/linkedclaims';

starsToScore(5);    // 1.0
starsToScore(0);    // -1.0
scoreToStars(0);    // 2.5
normalizeUri('github.com/alice');  // 'https://github.com/alice'
```

### API Client

```typescript
import LinkedClaims from '@cooperation/linkedclaims';

const client = new LinkedClaims({ baseUrl: 'https://live.linkedtrust.us' });

// Auth
await client.auth.login(email, password);
await client.auth.register(email, password, name);

// Claims
const { claim } = await client.claims.create({ subject, claim: 'HAS_SKILL', ... });
const response = await client.claims.getBySubject('https://github.com/alice');

// Credentials
const cred = await client.credentials.submit(credential);
```

## Configuration

```typescript
const client = new LinkedClaims({
  baseUrl: 'https://live.linkedtrust.us',  // default
  auth: {
    storage: 'memory',      // 'localStorage' | 'memory' | 'none'
    autoRefresh: true
  },
  onAuthError: () => { /* redirect to login */ }
});
```

## Related Packages

| Package | Purpose |
|---------|---------|
| [@cooperation/claim-atproto](https://github.com/Cooperation-org/claim-atproto) | Publish claims on ATProto/Bluesky |
| [@cooperation/vc-storage](https://www.npmjs.com/package/@cooperation/vc-storage) | Sign and store verifiable credentials |

## License

MIT
