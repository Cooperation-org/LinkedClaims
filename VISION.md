# Vision: Linked Trust

**Anyone, anywhere can contribute their knowledge as attestations into a decentralized web of trust.**

## The Problem

Digital trust is fragmented. Credentials live in silos. Reputation doesn't travel. Verification requires centralized gatekeepers.

## The Solution

LinkedClaims: a minimal standard where claims are addressable, signed, and can reference each other—creating a traversable graph of evidence and attestation.

## Core Principle
```
Subject → Claim → Object (with Source)
```

Nodes emerge from subjects, objects, and sources. Edges emerge from claims. The graph grows organically as anyone adds attestations.

## Specifications

- [LinkedClaims Spec](https://identity.foundation/labs-linkedclaims/) — DIF Incubation Lab
- [Companion Paper: Addressability is The Missing Link](./Addressability_the_Missing_Link.md)

## Ecosystem

| Repo | Purpose |
|------|---------|
| [LinkedClaims](https://github.com/Cooperation-org/LinkedClaims) | Spec, SDK, reference implementation |
| [trust_claim_backend](https://github.com/Whats-Cookin/trust_claim_backend) | Live API at live.linkedtrust.us |
| [trust_claim](./trust_claim) | Frontend for credential viewing/graph |
| [Cooperation-org repos](https://github.com/Cooperation-org/) | Domain-specific applications |

## Near-Term Focus

1. ATProto lexicon for LinkedClaim vocabulary
2. Usable certificates with evidence exploration
3. Identity linking (SAME_AS attestations across DIDs)

---

*This vision applies across all repos in the ecosystem. Each repo may add specifics but should link back here.*
