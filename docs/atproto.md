# ATProto Integration

LinkedClaims uses the [AT Protocol](https://atproto.com/) (the protocol behind Bluesky)
as one transport layer for claims. This means claims can be published to a user's Personal
Data Server (PDS), discovered via the firehose, and indexed by any AppView.

## Lexicon

The ATProto record type is `com.linkedclaims.claim`, defined in the
[claim-atproto](https://github.com/Cooperation-org/claim-atproto) repository.

Namespace: `com.linkedclaims` (maps to domain `linkedclaims.com` via DNS TXT record).

A claim published on ATProto looks like:

```json
{
  "$type": "com.linkedclaims.claim",
  "subject": "https://github.com/username",
  "claimType": "HAS_SKILL",
  "object": "React",
  "statement": "Expert React developer",
  "stars": 4,
  "confidence": 0.8,
  "source": {
    "uri": "https://github.com/username/react-project",
    "howKnown": "FIRST_HAND",
    "dateObserved": "2024-06-15"
  },
  "evidence": [
    {
      "uri": "https://example.com/screenshot.png",
      "mediaType": "image/png",
      "description": "Screenshot of the project"
    }
  ],
  "createdAt": "2024-06-15T10:00:00Z"
}
```

Note: ATProto uses `claimType` where the REST API uses `claim`, and nests source fields
under a `source` object. See the
[Field Name Mapping](./field-reference.md#field-name-mapping) for the complete mapping.

## SDK

The [@cooperation/claim-atproto](https://github.com/Cooperation-org/claim-atproto) package
provides everything you need:

```bash
npm install @cooperation/claim-atproto @atproto/api
```

### Publish a Claim

```typescript
import { createClaim, ClaimClient } from '@cooperation/claim-atproto';
import { Agent } from '@atproto/api';

// Authenticate (app password for server-side use)
const agent = new Agent('https://bsky.social');
await agent.login({
  identifier: 'yourhandle.bsky.social',
  password: 'your-app-password'
});

const client = new ClaimClient(agent);

const claim = createClaim()
  .subject('https://github.com/username')
  .type('HAS_SKILL')
  .object('React')
  .statement('Expert React developer')
  .stars(4)
  .confidence(0.8)
  .build();

const published = await client.publish(claim);
console.log(published.uri);
// at://did:plc:xyz/com.linkedclaims.claim/abc123
```

### Endorse a Claim

```typescript
import { createEndorsement } from '@cooperation/claim-atproto';

const endorsement = createEndorsement(
  'at://did:plc:xyz/com.linkedclaims.claim/abc123',
  'I can confirm this — worked with them for 2 years',
  { confidence: 0.9, howKnown: 'FIRST_HAND' }
).build();

await client.publish(endorsement);
```

### Dispute a Claim

```typescript
import { createDispute } from '@cooperation/claim-atproto';

const dispute = createDispute(
  'at://did:plc:xyz/com.linkedclaims.claim/abc123',
  'This is inaccurate — they used Vue, not React',
  { evidence: 'https://github.com/username/vue-project', howKnown: 'FIRST_HAND' }
).build();

await client.publish(dispute);
```

### Hash Source Content

```typescript
import { computeDigestMultibase, fetchAndHash } from '@cooperation/claim-atproto';

// Hash a string
const hash = await computeDigestMultibase('content to hash');
// Returns: zQm... (SHA-256, base58btc)

// Fetch and hash a URL
const urlHash = await fetchAndHash('https://example.com/document.pdf');
```

## How Publishing Works

When the reference backend (`trust_claim_backend`) creates a claim:

1. Claim is stored in the database
2. `AtprotoPublisher` fires (non-blocking, fire-and-forget)
3. Publisher maps DB fields → ATProto record fields (see field mapping)
4. Publishes via `com.atproto.repo.createRecord` to the server's PDS
5. Stores the returned AT-URI in `claim.claimAddress`

If the claim already has a `claimAddress` starting with `at://`, it's skipped (already
on ATProto — don't re-publish).

The publisher is controlled by env vars:
- `ATPROTO_HANDLE` — Bluesky handle (required to enable)
- `ATPROTO_APP_PASSWORD` — app password (required to enable)
- `ATPROTO_SERVICE` — PDS URL (default: `https://bsky.social`)

If these aren't set, publishing is silently disabled.

Source: [atprotoPublisher.ts](https://github.com/Whats-Cookin/trust_claim_backend/blob/main/src/services/atprotoPublisher.ts)

## How Indexing Works

The reference backend can act as an AppView for `com.linkedclaims.claim`:

1. Connects to Jetstream (ATProto's firehose) via WebSocket
2. Filters for `com.linkedclaims.claim` collection events
3. On `create` or `update`: validates and imports as a Claim row
4. Evidence items become Image rows
5. Sets `claimAddress` = AT-URI, `issuerId` = publisher DID

This means **any** ATProto user who publishes a `com.linkedclaims.claim` record will
have their claims indexed by the reference backend, not just claims created through our
site.

Deduplication: if `claimAddress` already exists in the database, the record is skipped.

Controlled by env vars:
- `ATPROTO_INDEX_ENABLED=true` — enable the indexer
- `ATPROTO_INDEX_REPOS` — comma-separated DIDs to backfill on startup
- `ATPROTO_JETSTREAM_URL` — custom Jetstream endpoint (optional)

Source: [atprotoIndexer.ts](https://github.com/Whats-Cookin/trust_claim_backend/blob/main/src/services/atprotoIndexer.ts)

## API Endpoints

The backend exposes ATProto-specific endpoints:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/atproto/claims` | Query indexed ATProto claims. Params: `subject`, `issuer`, `limit` |
| `GET` | `/api/atproto/check` | Check if an AT-URI exists in the DB. Params: `claimAddress` |
| `POST` | `/api/atproto/backfill` | Trigger backfill of a repo. Body: `{ repo: "did:plc:xyz" }` |

Source: [atproto.ts](https://github.com/Whats-Cookin/trust_claim_backend/blob/main/src/api/atproto.ts)

## Frontend

The reference frontend has:
- `/at` route — shows all ATProto claims with dual-source fetching (backend index first,
  direct ATProto fallback)
- `<linked-claims-atproto>` web component — embeddable ATProto feed

Source: [AtprotoFeed/index.tsx](https://github.com/Whats-Cookin/trust_claim/blob/main/src/containers/AtprotoFeed/index.tsx)

## Building Your Own ATProto Client

You don't need our backend. If you want to publish and read LinkedClaims on ATProto:

1. `npm install @cooperation/claim-atproto @atproto/api`
2. Authenticate with ATProto (app password or OAuth)
3. Use `ClaimClient` to publish claims
4. Read claims from any PDS using `com.atproto.repo.listRecords`
5. Subscribe to the firehose for real-time discovery

Your claims will be discoverable by any AppView that indexes `com.linkedclaims.claim`.

## OAuth (for user-facing apps)

If your app needs users to publish claims under their own DID (not a server account),
you need ATProto OAuth 2.1. Key points:

- Minimal scope: `atproto` (identity only — DID + profile)
- Full scope: `atproto transition:generic` (needed for publishing)
- Use `@atproto/oauth-client-node` for server-side OAuth
- Session store must be persistent (not in-memory)
- To upgrade scope: revoke existing session first, then re-authorize

See the [claim-atproto README](https://github.com/Cooperation-org/claim-atproto) for
OAuth examples.
