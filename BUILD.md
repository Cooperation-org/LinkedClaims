# Development Guide

## Repository Structure

```
LinkedClaims/
  spec.md                    # DIF Labs specification
  LinkedClaimsRFC.md         # RFC (core MUST/SHOULD/MAY requirements)
  context.json               # JSON-LD context
  VISION.md                  # Strategic vision
  sdk/typescript/            # @cooperation/linked-claims SDK
  docs/                      # Developer documentation
    field-reference.md       # Canonical field reference (THE contract)
    architecture.md          # How the ecosystem fits together
    building-a-client.md     # Guide to building your own app
    atproto.md               # ATProto integration
  examples/                  # Real-world claim examples (JSON)
  historical/                # Old reference implementations (Flask demo, drafts)
```

## SDK Development

The core SDK is in `sdk/typescript/`. It publishes as `@cooperation/linked-claims`.

```bash
cd sdk/typescript
npm install
npm run build    # tsup → dist/
npm test         # jest
```

### What the SDK provides

- **Types** — `Claim`, `CreateClaimInput`, `HowKnown`, `EntityType`, etc.
- **Validators** — `validateClaim()`, `validateClaimField()`, `isValidUri()`
- **Normalizers** — `starsToScore()`, `scoreToStars()`, `normalizeUri()`, `userIdToUri()`
- **Constants** — `VALIDATION_LIMITS`, `DEFAULTS`, `ENDPOINTS`
- **API Client** — `LinkedClaims` class with `claims`, `credentials`, `auth`, `profile` modules

### Key files

| File | Purpose |
|------|---------|
| `src/types.ts` | All TypeScript interfaces |
| `src/validators.ts` | Field and claim validation |
| `src/normalizers.ts` | Score/URI normalization |
| `src/constants.ts` | Limits, defaults, endpoints |
| `src/client.ts` | API client |
| `src/index.ts` | Public exports |

## Related Repositories

| Repo | Purpose | npm package |
|------|---------|-------------|
| [claim-atproto](https://github.com/Cooperation-org/claim-atproto) | ATProto lexicon + SDK | `@cooperation/claim-atproto` |
| [trust_claim_backend](https://github.com/Whats-Cookin/trust_claim_backend) | Reference backend API | — |
| [trust_claim](https://github.com/Whats-Cookin/trust_claim) | Reference frontend | — |

## Backend

The reference backend is at [trust_claim_backend](https://github.com/Whats-Cookin/trust_claim_backend).

- **Production:** https://live.linkedtrust.us
- **Dev:** https://dev.linkedtrust.us
- **API docs:** https://live.linkedtrust.us/api/docs/

You do NOT need to run the backend locally to develop the SDK or build a client. Point
at `live.linkedtrust.us` or `dev.linkedtrust.us`.

## Standard Claim Types

Use these existing types. Don't invent new ones without coordination.

| Type | Purpose |
|------|---------|
| `HAS_SKILL` | Skill attestation |
| `ENDORSES` | Endorsement |
| `VALIDATES` | Validation of another claim |
| `HAS` | Possession of credential/membership |
| `IMPACT` | Social impact measurement |
| `RISK` | Risk assessment |
| `rated` | Star rating |
| `reviewed` | Review with statement |
| `claim` | Generic claim |

## Working with Credentials

When your app uses rich credential formats (OpenBadges, Blockcerts, W3C VCs):

1. Submit full credential to `/api/credentials` — backend stores it and auto-extracts a LinkedClaim
2. The extracted claim participates in the graph
3. Full credential is retrievable via `/api/credentials/{id}`

This preserves rich credential formats while gaining LinkedClaims graph integration.

## Rules

- Follow the [Field Reference](./docs/field-reference.md) exactly
- Don't change existing API contracts in the backend
- Don't invent `howKnown` values — use the enum in the field reference
- Subject must always be a valid URI
- If you need a new claim type, coordinate with the team
