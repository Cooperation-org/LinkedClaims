# LinkedClaims

An open standard and SDK for creating addressable, signed claims about anything with a URI -- forming a decentralized web of trust.

**Spec:** [LinkedClaims at DIF Labs](https://identity.foundation/labs-linkedclaims/) | [spec.md](./spec.md)

**Vision:** [How the decentralized web of trust works](./VISION.md)

## What is a LinkedClaim?

A signed, structured document with a claim about a URI, that itself has a URI.

```
Subject (any URI) <-- Claim (has its own URI, is signed) <-- Claim-about-Claim
```

Every claim MUST:
- Have a **subject** that is any valid URI
- Itself have an **identifier** that is a well-formed URI
- Be **cryptographically signed** (such as with a DID)

That's the minimum. See the [full spec](./spec.md) for SHOULD and MAY requirements.

## Quick Start

### Option 1: Use the API directly

The simplest path. Point your app at an existing backend and make HTTP calls.

```bash
# Create a claim
curl -X POST https://live.linkedtrust.us/api/claims \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "subject": "https://github.com/username",
    "claim": "HAS_SKILL",
    "object": "React",
    "statement": "Expert React developer",
    "stars": 4,
    "sourceURI": "https://github.com/username/react-project",
    "howKnown": "FIRST_HAND"
  }'

# Query claims about a subject
curl "https://live.linkedtrust.us/api/feed?subject=https://github.com/username"
```

API docs: https://live.linkedtrust.us/api/docs/

### Option 2: Use the TypeScript SDK

```bash
npm install @cooperation/linked-claims
```

```typescript
import { LinkedClaims, validateClaim, starsToScore } from '@cooperation/linked-claims';

const client = new LinkedClaims({
  baseUrl: 'https://live.linkedtrust.us'
});

// Validate before sending
const errors = validateClaim({
  subject: 'https://github.com/username',
  claim: 'HAS_SKILL',
  object: 'React',
  stars: 4
});

if (errors.length === 0) {
  const claim = await client.claims.create({
    subject: 'https://github.com/username',
    claim: 'HAS_SKILL',
    object: 'React',
    statement: 'Expert React developer',
    stars: 4,
    sourceURI: 'https://github.com/username/react-project',
    howKnown: 'FIRST_HAND'
  });
}
```

### Option 3: Publish claims on ATProto (Bluesky network)

```bash
npm install @cooperation/claim-atproto @atproto/api
```

```typescript
import { createClaim, ClaimClient } from '@cooperation/claim-atproto';
import { Agent } from '@atproto/api';

const agent = new Agent('https://bsky.social');
await agent.login({ identifier: 'you.bsky.social', password: 'app-password' });

const client = new ClaimClient(agent);
const claim = createClaim()
  .subject('https://github.com/username')
  .type('HAS_SKILL')
  .object('React')
  .statement('Expert React developer')
  .stars(4)
  .build();

const published = await client.publish(claim);
// published.uri = at://did:plc:xyz/com.linkedclaims.claim/abc123
```

See [@cooperation/claim-atproto](https://github.com/Cooperation-org/claim-atproto) for the full ATProto SDK.

## Documentation

| Doc | What it covers |
|-----|---------------|
| [Field Reference](./docs/field-reference.md) | Every field, its type, validation rules, and meaning. **Read this first if you're building a client.** |
| [Architecture](./docs/architecture.md) | How the ecosystem fits together: backends, frontends, ATProto, the graph |
| [Building a Client](./docs/building-a-client.md) | Step-by-step guide to building your own app on LinkedClaims |
| [ATProto Integration](./docs/atproto.md) | How LinkedClaims works on the ATProto/Bluesky network |

## Ecosystem

LinkedClaims is not the center of the universe. Claims don't need to originate here. Any signed claim with a URI subject can participate.

| Repo | What it is |
|------|-----------|
| **This repo** | Spec, core SDK, docs |
| [claim-atproto](https://github.com/Cooperation-org/claim-atproto) | ATProto lexicon + SDK for publishing claims on Bluesky |
| [trust_claim_backend](https://github.com/Whats-Cookin/trust_claim_backend) | Reference backend API (Node/Prisma) at live.linkedtrust.us |
| [trust_claim](https://github.com/Whats-Cookin/trust_claim) | Reference frontend (React) at live.linkedtrust.us |
| [certify](https://github.com/Cooperation-org/certify) | W3C Verifiable Credential issuance using LinkedClaims |
| [linked-resume](https://github.com/Cooperation-org/linked-resume) | Resume/credential app using VC storage |
| [talent](https://github.com/Cooperation-org/talent) | Professional credential verification |

## npm Packages

| Package | Purpose |
|---------|---------|
| `@cooperation/linked-claims` | Core types, validators, normalizers, API client |
| `@cooperation/claim-atproto` | ATProto lexicon, ClaimBuilder, publish/query client |
| `@cooperation/vc-storage` | Google Drive credential storage with DID integration |

## Spec

The [LinkedClaims specification](./spec.md) is published at the [Decentralized Identity Foundation](https://identity.foundation/labs-linkedclaims/). The [RFC](./LinkedClaimsRFC.md) defines the core MUST/SHOULD/MAY requirements.

The [JSON-LD context](./context.json) is published at [cooperation.org/credentials/v1](http://cooperation.org/credentials/v1).

## Examples

The [examples/](./examples) directory contains real-world usage patterns:
- [Product Review](./examples/product-review) - Scraped from existing review site
- [Self-Asserted Skill](./examples/self-asserted-skill) - Worker asserting skills
- [Social Impact](./examples/social-impact) - NGO recipients attesting to impact
- [Worker Reputation](./examples/worker-reputation) - Exported gig site reputation
- [Real World Harm](./examples/real-world-harm) - Documenting human rights violations with linked evidence

## Historical

The [historical/](./historical) directory contains older reference implementations:
- `demo-app/` - Python Flask app for signing claims with didkit (2022)
- `AdvanceReadingDrafts/` - Early design documents

## Origins

This work grew from a draft paper at [RWoT](https://github.com/WebOfTrustInfo/rwot11-the-hague/blob/master/draft-documents/composable-credentials.md) and design work at [cooperation.org/linked_trust](http://cooperation.org/linked_trust).

Mirrored at [GitHub](https://github.com/Cooperation-org/LinkedClaims) and [Codeberg](https://codeberg.org/cooperation/LinkedClaims).

## License

MIT
