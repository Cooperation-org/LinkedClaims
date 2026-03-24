# LinkedClaims Field Reference

This is the canonical reference for all claim fields. If you are building a client, use
these exact field names, types, and validation rules. This is the contract.

## All Fields at a Glance

| Field | Required | Type | REST API name | ATProto name | Notes |
|-------|----------|------|---------------|--------------|-------|
| subject | **Yes** | string (URI) | `subject` | `subject` | What the claim is about |
| claim type | **Yes** | string | `claim` | `claimType` | Category of the assertion |
| object | No | string | `object` | `object` | Target: skill name, rating value, etc. |
| statement | No | string | `statement` | `statement` | Human-readable explanation |
| stars | No | number (0-5) | `stars` | `stars` | Star rating |
| confidence | No | number (0-1) | `confidence` | `confidence` | Signer's confidence |
| score | No | number (-1 to 1) | `score` | — | Normalized score (REST only) |
| aspect | No | string | `aspect` | `aspect` | What dimension is being rated |
| sourceURI | No | string (URI) | `sourceURI` | `source.uri` | Where claim info comes from |
| howKnown | No | string (enum) | `howKnown` | `source.howKnown` | How signer knows this |
| digestMultibase | No | string | `digestMultibase` | `source.digestMultibase` | Hash of source content |
| dateObserved | No | string (ISO 8601) | `dateObserved` | `source.dateObserved` | When source was observed |
| evidence | No | array | Image table | `evidence[]` | Supporting photos/videos/docs |
| effectiveDate | No | string (ISO 8601) | `effectiveDate` | `effectiveDate` | When claim became true |
| respondAt | No | string (URI) | `respondAt` | `respondAt` | Inbox for endorsements/disputes |
| issuerId | Auto | string (URI/DID) | `issuerId` | DID (from repo) | Who signed it |
| claimAddress | Auto | string (AT-URI) | `claimAddress` | AT-URI (response) | Where claim lives |
| createdAt | Auto | string (ISO 8601) | `createdAt` | `createdAt` | When created |
| embeddedProof | No | object | `proof` | `embeddedProof` | External crypto signature |

---

## Core Fields

### subject (REQUIRED)

What the claim is about. Any valid URI.

| Property | Value |
|----------|-------|
| Type | `string` |
| Required | Yes |
| Validation | Must be a valid URI (has scheme, no whitespace) |
| Examples | `https://github.com/username`, `did:plc:abc123`, `at://did:plc:abc/com.linkedclaims.claim/xyz` |

The subject can be a URL, a DID, an AT-URI, an IPFS CID, or any other valid URI. When a
claim's subject is another claim's URI, you're making a **claim about a claim** (endorsement,
dispute, etc.).

### claim (REQUIRED)

The type of claim being made. A short string categorizing the assertion.

| Property | Value |
|----------|-------|
| Type | `string` |
| Required | Yes |
| Validation | Non-empty string |
| ATProto name | `claimType` |

Common values (not an exhaustive list):
- `HAS_SKILL` — attesting someone has a skill
- `ENDORSES` — endorsing a claim or entity
- `VALIDATES` — validation assertion
- `HAS` — generic ownership or membership
- `IMPACT` — social impact attestation
- `RISK` — risk assessment
- `rated` — rating with stars
- `reviewed` — review with statement
- `claim` — generic claim

**Note:** In the backend database this field is called `claim`. In the ATProto lexicon
it is called `claimType` (because `claim` is too generic for ATProto). The SDK and
indexer handle this mapping automatically. When building a client against the REST API,
use `claim`. When building against ATProto, use `claimType`.

### object (optional)

The target or object of the claim — the skill name, the rating value, etc.

| Property | Value |
|----------|-------|
| Type | `string` |
| Required | No |
| Validation | If provided, should be a valid URI or free text depending on context |
| Examples | `React`, `https://example.com/product`, `Excellent quality` |

### statement (optional)

Human-readable explanation of the claim.

| Property | Value |
|----------|-------|
| Type | `string` |
| Required | No |
| Validation | Max 10,000 characters (ATProto), 5,000 characters (REST API) |

## Rating Fields

### stars (optional)

Star rating.

| Property | Value |
|----------|-------|
| Type | `number` |
| Required | No |
| Validation | 0-5 (REST API allows 0-5, ATProto allows 1-5) |

### confidence (optional)

How confident the signer is in this claim.

| Property | Value |
|----------|-------|
| Type | `number` |
| Required | No |
| Validation | 0 to 1 |

### score (optional)

Normalized score. REST API only — not in ATProto lexicon.

| Property | Value |
|----------|-------|
| Type | `number` |
| Required | No |
| Validation | -1 to 1 |
| Conversion | `score = (stars - 2.5) / 2.5` |

### aspect (optional)

What dimension is being rated (quality, reliability, etc.).

| Property | Value |
|----------|-------|
| Type | `string` |
| Required | No |

## Source Fields

Source describes WHERE the claim information comes from — the provenance. This is NOT
the evidence (see Evidence below). Source is the website, document, or basis for the claim.

### sourceURI (optional)

URI of the source.

| Property | Value |
|----------|-------|
| Type | `string` |
| Required | No |
| Validation | Valid URI if provided |
| ATProto path | `source.uri` |

### howKnown (optional)

How the signer knows this claim to be true.

| Property | Value |
|----------|-------|
| Type | `string` (enum) |
| Required | No |
| ATProto path | `source.howKnown` |

Valid values:
- `FIRST_HAND` — direct personal experience
- `SECOND_HAND` — told by someone who experienced it
- `WEB_DOCUMENT` — found on a website
- `VERIFIED_LOGIN` — verified via authenticated login
- `BLOCKCHAIN` — verified on-chain
- `SIGNED_DOCUMENT` — from a cryptographically signed document
- `PHYSICAL_DOCUMENT` — from a physical document
- `INTEGRATION` — from an automated integration
- `RESEARCH` — from research or investigation
- `MACHINE_LEARNING` — from ML/AI analysis

**Do not invent new values.** If none of these fit, omit the field. The indexer will
reject unrecognized values.

### digestMultibase (optional)

Hash of the source content for integrity verification. SHA-256 in base58btc encoding
(starts with `zQm...`).

| Property | Value |
|----------|-------|
| Type | `string` |
| Required | No |
| ATProto path | `source.digestMultibase` |

### dateObserved (optional)

When the source was observed.

| Property | Value |
|----------|-------|
| Type | `string` (ISO 8601 date or datetime) |
| Required | No |
| ATProto path | `source.dateObserved` |

## Evidence

Evidence is supporting material — photos, videos, documents. Distinct from Source.
Evidence is WHAT backs up the claim. Source is WHERE the claim information comes from.

In the REST API, evidence is stored in the `Image` table as related rows.
In ATProto, evidence is an array on the claim record.

### evidence[] (optional)

| Property | Value |
|----------|-------|
| Type | `array` of evidence items |
| Required | No |

Each evidence item:

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `uri` | string | Yes | URL of the evidence |
| `digestMultibase` | string | No | Hash of the content |
| `mediaType` | string | No | MIME type (e.g., `image/jpeg`, `video/mp4`) |
| `description` | string | No | Caption or description |

When indexed into the backend:
- Each evidence item becomes an `Image` row
- Videos are detected by URI extension (`.webm`, `.mp4`) or mediaType containing `video`
- `Image.metadata` stores `{ type: 'video', contentType, description }` for videos

## Identity Fields

### issuerId (optional, set by backend)

Who signed/created the claim. Usually set automatically.

| Property | Value |
|----------|-------|
| Type | `string` |
| Required | No (auto-set) |
| Validation | Valid URI (including DIDs) |

For ATProto claims, this is the publisher's DID (e.g., `did:plc:abc123`).
For web-created claims, this is the user's profile URL or DID.

### issuerIdType (optional, set by backend)

Type of the issuer identifier.

| Property | Value |
|----------|-------|
| Type | `string` |
| Values | `DID`, `URL`, `ETH` |

## Lifecycle Fields

### effectiveDate (optional)

When the claim became or becomes true (distinct from when it was created/signed).

| Property | Value |
|----------|-------|
| Type | `string` (ISO 8601) |
| Required | No |

### createdAt (auto-set)

When the claim record was created. Auto-set by the backend or ATProto.

### claimAddress (auto-set)

The canonical URI where this claim lives. For ATProto claims, this is the AT-URI
(`at://did:plc:xyz/com.linkedclaims.claim/tid`). Set automatically on publish.

**Do not set this yourself.** It's assigned by the system.

### respondAt (optional)

URI where endorsements or disputes of this claim should be sent. Inbox-like mechanism.

| Property | Value |
|----------|-------|
| Type | `string` (URI) |
| Required | No |

## Embedded Proof (optional)

For claims that carry an external cryptographic signature (MetaMask, aca-py, etc.)
in addition to the transport-level signature.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `embeddedProof.type` | string | Yes | e.g., `EthereumEip712Signature2021`, `Ed25519Signature2020` |
| `embeddedProof.verificationMethod` | string | Yes | DID or key URI of the signer |
| `embeddedProof.proofValue` | string | Yes | The signature |
| `embeddedProof.proofPurpose` | string | No | Default: `assertionMethod` |
| `embeddedProof.created` | string | Yes | ISO 8601 datetime |

## Field Name Mapping

Some fields have different names in the REST API vs ATProto. If you're building a client,
here's the complete mapping:

| REST API (backend DB) | ATProto (lexicon) | Notes |
|-----------------------|-------------------|-------|
| `claim` | `claimType` | "claim" is too generic for ATProto namespace |
| `sourceURI` | `source.uri` | ATProto nests source fields |
| `howKnown` | `source.howKnown` | |
| `digestMultibase` | `source.digestMultibase` | |
| `dateObserved` | `source.dateObserved` | |
| `claimAddress` | AT-URI (response) | Set automatically, not sent by client |
| `issuerId` | DID (from repo) | Auto-set from ATProto identity |
| (Image table) | `evidence[]` | Separate table vs inline array |

The SDKs handle this mapping for you. If you're making raw API calls, use the REST API
column names. If you're building ATProto records directly, use the ATProto column.
