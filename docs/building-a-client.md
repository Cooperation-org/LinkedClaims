# Building a Client

How to build your own app on LinkedClaims without breaking the ecosystem.

## Before You Start

Read the [Field Reference](./field-reference.md). It's the contract. Use those exact field
names, types, and validation rules.

## Choose Your Path

### A. Use the existing backend (simplest)

Point your app at `live.linkedtrust.us` or `dev.linkedtrust.us` and make REST calls.
You get the graph, the indexer, and ATProto publishing for free.

**Good for:** apps that need claims but don't need their own infrastructure.

### B. Use the SDK + existing backend

Install `@cooperation/linkedclaims` and use the API client. You get type safety,
validation, and normalization.

**Good for:** TypeScript apps that want a better developer experience.

### C. Publish directly to ATProto

Install `@cooperation/claim-atproto` and publish claims to the ATProto network. Any
AppView (including ours) can index your claims.

**Good for:** apps that want decentralized identity and don't want a dependency on
our backend.

### D. Build your own backend

Follow the spec, use the field reference, build your own storage. Optionally publish
to ATProto so claims are discoverable.

**Good for:** apps with specific requirements that don't fit the reference backend.

## Rules for Interoperability

These rules keep claims from different apps compatible:

### 1. Use the field names exactly

The REST API uses `claim` for the claim type. ATProto uses `claimType`. Don't use
`type`, `category`, `kind`, or anything else. See the
[Field Name Mapping](./field-reference.md#field-name-mapping).

### 2. Don't invent howKnown values

`howKnown` is an enum. The valid values are listed in the
[Field Reference](./field-reference.md#howknown-optional). If none fit, omit the field.
The indexer rejects unrecognized values.

### 3. Subjects must be valid URIs

Not strings. Not names. URIs with a scheme. `https://github.com/username` is valid.
`github.com/username` is not. `did:plc:abc123` is valid. `abc123` is not.

### 4. Don't set claimAddress yourself

`claimAddress` is assigned by the system — it's the AT-URI for ATProto claims or a
backend-generated URI. If you set it, you'll collide with the indexer's deduplication.

### 5. Source vs Evidence

These are different things:

- **Source** = WHERE the claim information comes from (a person, a website, a document).
  One per claim. Fields: `sourceURI`, `howKnown`, `digestMultibase`, `dateObserved`,
  `author`, `curator`.
- **Evidence** = WHAT backs up the claim (photos, videos, documents). Multiple per claim.
  Array of `{ uri, digestMultibase, mediaType, description }`.

Don't put evidence URIs in `sourceURI`. Don't put the source in the evidence array.

### 6. Confidence is 0-1, Stars is 0-5

`confidence` is how sure the signer is. `stars` is a rating. They're different things.
Don't normalize one into the other. The SDK provides `starsToScore()` and `scoreToStars()`
if you need to convert between stars (0-5) and score (-1 to +1).

### 7. Claims about claims use the subject field

To endorse, dispute, or revoke another claim, set `subject` to that claim's URI. Don't
create a custom linking mechanism.

```typescript
// Endorse a claim
{
  subject: 'at://did:plc:alice/com.linkedclaims.claim/abc123',
  claim: 'ENDORSES',
  statement: 'I can confirm this is accurate',
  confidence: 0.9,
  howKnown: 'FIRST_HAND'
}
```

## Walkthrough: Skill Attestation App

Here's a concrete example. You're building an app where people attest to each other's
skills.

### Step 1: Define your claim structure

```typescript
// Every skill attestation follows this pattern
const skillClaim = {
  subject: 'did:plc:bob',           // Who has the skill (their DID or profile URL)
  claim: 'HAS_SKILL',               // Claim type
  object: 'React',                  // The skill name
  statement: 'Bob built our entire frontend in React over 2 years',
  stars: 4,                         // How skilled (1-5)
  confidence: 0.8,                  // How sure you are (0-1)
  sourceURI: 'https://github.com/bob/react-project',
  howKnown: 'FIRST_HAND',           // You worked with Bob directly
  effectiveDate: '2024-06-15'       // When you observed this
};
```

### Step 2: Validate

```typescript
import { validateClaim } from '@cooperation/linkedclaims';

const errors = validateClaim(skillClaim);
if (errors.length > 0) {
  // Don't submit — show errors to user
  console.error(errors);
}
```

### Step 3: Submit

**Option A — REST API:**
```typescript
const response = await fetch('https://live.linkedtrust.us/api/claims', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify(skillClaim)
});
```

**Option B — ATProto:**
```typescript
import { createClaim, ClaimClient } from '@cooperation/claim-atproto';

const client = new ClaimClient(atprotoAgent);
const claim = createClaim()
  .subject('did:plc:bob')
  .type('HAS_SKILL')
  .object('React')
  .statement('Bob built our entire frontend in React over 2 years')
  .stars(4)
  .confidence(0.8)
  .build();

const published = await client.publish(claim);
```

### Step 4: Query

```bash
# All claims about Bob
curl "https://live.linkedtrust.us/api/feed?subject=did:plc:bob"

# Just skill claims
curl "https://live.linkedtrust.us/api/feed?subject=did:plc:bob&claim=HAS_SKILL"

# ATProto-sourced claims only
curl "https://live.linkedtrust.us/api/atproto/claims?subject=did:plc:bob"
```

### Step 5: Let others endorse

```typescript
import { createEndorsement } from '@cooperation/claim-atproto';

const endorsement = createEndorsement(
  published.uri,  // The AT-URI of the skill claim
  'I also worked with Bob on React — can confirm',
  { confidence: 0.9, howKnown: 'FIRST_HAND' }
).build();

await client.publish(endorsement);
```

## Authentication

### REST API

The reference backend uses JWT authentication. Register, login, get a token:

```bash
# Register
curl -X POST https://live.linkedtrust.us/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "password": "..."}'

# Login
curl -X POST https://live.linkedtrust.us/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "you@example.com", "password": "..."}'
# Returns: { "token": "eyJ..." }
```

### ATProto

Use an app password (for server-side) or OAuth 2.1 (for user-facing apps). See the
[ATProto integration docs](./atproto.md) for details.

## API Reference

Full API docs: https://live.linkedtrust.us/api/docs/

Key endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/claims` | Create a claim |
| `GET` | `/api/feed` | Query claims (supports `subject`, `claim`, `issuer` filters) |
| `GET` | `/api/nodes` | Get graph nodes |
| `GET` | `/api/graph` | Get graph structure |
| `GET` | `/api/atproto/claims` | Query ATProto-sourced claims |
| `POST` | `/api/atproto/backfill` | Trigger backfill of an ATProto repo |
