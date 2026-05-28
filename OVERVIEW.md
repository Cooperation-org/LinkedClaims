# LinkedClaims — Overview

A one-page introduction to the trust layer. For detail on the spec,
see `spec.md`, `LinkedClaimsRFC.md`, and `VISION.md`. For the SDK,
see `sdk/` and `SDK_ROADMAP.md`.

---

## What this is

**LinkedClaims** is the open spec and SDK for portable, signed
attestations — small encapsulated claims about people, organizations,
resources, contributions, anything addressable by URI. A claim is a
self-contained unit that someone signed and published.

**LinkedTrust** is a service built on top of LinkedClaims. You give
it a URI; it returns a trust score *relative to you*, computed from
the web of claims you and your trusted sources have attested. The
canonical instance lives at `live.linkedtrust.us`. Other instances
can exist; the spec is open.

Together they form the trust layer the rest of the system queries
when it needs to make a judgement.

## The contract

Simple in, simple out. A consumer gives LinkedTrust a URI; it returns
a trust score. The complexity behind the endpoint — the LinkedClaims
graph, signature verification, source trust policy, traversal — is
encapsulated. Consumers don't need to understand it.

LinkedTrust **scores**. It does not **decide**. The asking agent (or
person) decides what to do with the score.

## What flows in and out

- **Publish in:** anyone can sign and submit a LinkedClaim. Sources
  include: a person's abra exporting a binding as a claim, an
  organization issuing credentials, a third-party verifier attesting
  to a contribution, an automated pipeline submitting structured
  facts.
- **Query out:** any consumer (amebo or another agent, a dashboard,
  a person directly) can query for a score on a URI, or pull the
  raw claim list to render the evidence themselves.

Both flows go through the open LinkedClaims spec, so consumers and
publishers can be swapped without coordinating with the trust service.

## When it matters

LinkedTrust is invoked when an action benefits from a trust judgement:

- Amebo about to act on a non-trivial email — does the sender have
  attestations from people the recipient trusts?
- A new contact appearing in someone's map — is there a credential
  chain backing them?
- A claim about a resource (a CDN provider, a vendor, a referral
  partner) — what is the recipient's score for them given their own
  trusted sources?
- The user's view (canvas) surfacing reputation signals visibly so
  the person can act on them with context

The full role grows over time. Architecturally, the door stays open
from day one: the publish path and the query path are defined; the
detail of how scoring works can deepen without changing what
consumers do.

---

## How LinkedClaims connects to the other two systems

- **Abra (the map of what's important).** Abra holds the person's
  durable map. Some bindings in that map can be optionally published
  out as LinkedClaims to share with the world. Each binding stays in
  abra; the claim is an export.
- **Amebo (the friendly claw).** Amebo queries LinkedTrust before
  acting on things that need trust judgement. Amebo can also publish
  out — for example, attesting that it completed a task for an org,
  with the org's signature.

The three systems are independent. LinkedClaims/LinkedTrust can be
swapped for a different trust system without touching abra or amebo,
as long as the new system honors the spec.

For the full picture, see the abra overview and the amebo overview
in their respective repos.

---

## Detail docs

- `VISION.md` — why LinkedClaims exists
- `spec.md` — the data spec
- `LinkedClaimsRFC.md` — the formal RFC
- `sdk/` — open source SDK
- `SDK_ROADMAP.md` — what is built, what is next
- `Addressability_the_Missing_Link.md` — addressability concept
- `live.linkedtrust.us` — the canonical LinkedTrust instance

## Related repos

LinkedClaims is the open spec and SDK core. Other repos in the
LinkedTrust ecosystem (trust_claim, trust_claim_backend, claim-atproto,
linked-resume, linked-badge, others) implement specific pieces of the
larger system. Not all are open source; the canonical reference for
the spec lives in this repo.
