# LinkedClaims Architecture

## Overview

LinkedClaims is a decentralized web-of-trust framework. Claims are signed assertions
about URI-identified subjects that are themselves URI-addressable, forming a graph where
claims can reference other claims.

The ecosystem is transport-agnostic. Claims can flow through HTTP APIs, ATProto (Bluesky),
blockchain, W3C Verifiable Credentials, or any other mechanism. What matters is the
structure, not how it gets there.

## The Graph

```
Subject (URI) <── Claim (has URI, is signed) <── Claim-about-Claim (has URI, is signed)
     │                     │                              │
     └─ any entity         └─ creates Node + Edge         └─ endorsement, dispute,
        with a URI            in the graph                    revocation, superseding
```

Nodes emerge from subjects, objects, and sources. Edges emerge from claims. The graph
grows organically as attestations are added from any source.

## Components

### 1. The Spec (this repo)

The [LinkedClaims specification](../spec.md) defines what a valid claim looks like. It's
published at the Decentralized Identity Foundation. This is the contract everyone follows.

### 2. Core SDK (`@cooperation/linkedclaims`)

TypeScript library in [sdk/](../sdk/). Provides:
- **Types** — `Claim`, `CreateClaimInput`, `HowKnown`, etc.
- **Validators** — `validateClaim()`, `isValidUri()` — enforce field rules
- **Normalizers** — `starsToScore()`, `normalizeUri()` — convert between formats
- **API Client** — `LinkedClaims` class for talking to any backend

Use this when building a web app or backend that creates/queries claims via HTTP.

### 3. ATProto SDK (`@cooperation/claim-atproto`)

TypeScript library at [github.com/Cooperation-org/claim-atproto](https://github.com/Cooperation-org/claim-atproto). Provides:
- **Lexicon** — `com.linkedclaims.claim` record type
- **ClaimBuilder** — fluent API for constructing valid claims
- **ClaimClient** — publish, query, delete claims on ATProto
- **Helpers** — `createEndorsement()`, `createDispute()`, `createRevocation()`
- **Content hashing** — `computeDigestMultibase()` for source integrity

Use this when publishing claims to the ATProto network (Bluesky).

### 4. Reference Backend (`trust_claim_backend`)

Node.js/Express/Prisma backend at [github.com/Whats-Cookin/trust_claim_backend](https://github.com/Whats-Cookin/trust_claim_backend).
Live at `live.linkedtrust.us`.

This backend serves as an **AppView** — it aggregates claims from multiple sources:
- Claims created through the web UI
- Claims published via the REST API
- Claims from ATProto (via Jetstream firehose subscription)
- Claims from W3C VCs, blockchain, or other transports (via import)

Key services:
- **ATProto Publisher** — when a claim is created via the API, it's also published to
  ATProto under the server's DID. The AT-URI is stored in `claimAddress`.
- **ATProto Indexer** — subscribes to the ATProto firehose, filters for
  `com.linkedclaims.claim` records, and indexes ALL publishers (not just ours).
- **Graph Engine** — builds Node/Edge graph from claims. Subjects, objects, and sources
  become nodes. Claims become edges.

### 5. Reference Frontend (`trust_claim`)

React app at [github.com/Whats-Cookin/trust_claim](https://github.com/Whats-Cookin/trust_claim).
Live at `live.linkedtrust.us`.

Includes an ATProto feed view (`/at` route) and a `<linked-claims-atproto>` web component
for embedding ATProto claim feeds in any page.

## How Claims Flow

### Path A: Web UI → Backend → ATProto

1. User creates claim in LinkedTrust web UI
2. Backend stores claim in database
3. Backend publishes to ATProto via Publisher service (non-blocking)
4. AT-URI stored in `claim.claimAddress`
5. Other ATProto AppViews can discover and index the claim

### Path B: ATProto → Backend

1. Anyone publishes a `com.linkedclaims.claim` record to their ATProto PDS
2. Jetstream firehose emits the event
3. Backend Indexer picks it up, validates, creates Claim + Image rows
4. Claim appears in the graph alongside web-created claims
5. `claimAddress` = the AT-URI, `issuerId` = the publisher's DID

### Path C: Direct API

1. External app calls `POST /api/claims` with a valid claim body
2. Backend validates, stores, publishes to ATProto (same as Path A)
3. Claim gets an AT-URI and participates in both ecosystems

### Path D: Build Your Own

1. Read the [Field Reference](./field-reference.md)
2. Build your own backend, use your own database
3. Publish claims to ATProto using `@cooperation/claim-atproto`
4. Other AppViews (including ours) can index your claims
5. Or don't use ATProto at all — just follow the spec and use URIs

## Claims About Claims

A claim's subject can be another claim's URI. This creates a graph of attestations:

```
Claim A: "Alice has skill React"
  URI: at://did:plc:alice/com.linkedclaims.claim/abc

Claim B: "I endorse Claim A" (subject = Claim A's URI)
  URI: at://did:plc:bob/com.linkedclaims.claim/def

Claim C: "I dispute Claim A" (subject = Claim A's URI)
  URI: at://did:plc:carol/com.linkedclaims.claim/ghi
```

The `@cooperation/claim-atproto` SDK has helpers for this:
- `createEndorsement(claimUri, statement, options)` — endorse another claim
- `createDispute(claimUri, statement, options)` — dispute another claim
- `createSuperseding(claimUri, statement)` — supersede/update another claim
- `createRevocation(claimUri, reason)` — revoke a claim

## What You Don't Need

- **You don't need our backend.** The spec is open. Build your own.
- **You don't need ATProto.** Claims can be published and linked via any transport.
- **You don't need our frontend.** Build your own UI. Use the SDK or raw API calls.
- **You don't need to ask permission.** The spec is public, the SDK is MIT-licensed.

What you DO need: follow the [Field Reference](./field-reference.md) so claims are
interoperable. Use the field names as specified. Validate inputs. Don't invent new
`howKnown` values. If claims from your app are going to be indexed by other AppViews,
they need to be valid.
