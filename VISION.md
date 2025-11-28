# Vision: Linked Trust

**Anyone, anywhere can contribute their knowledge as attestations into a decentralized web of trust.**

## The Problem

Digital trust is fragmented. Credentials live in silos. Reputation doesn't travel. Verification requires centralized gatekeepers.

## The Solution

LinkedClaims: a minimal standard where claims are addressable, signed, and can reference each other—creating a traversable graph of evidence and attestation.

Not everyone has a [DID](https://www.w3.org/TR/did-1.1/). The system accommodates this: a server can sign claims on behalf of users, pointing to unsigned web2 URLs (optionally with content hash) as source. Users or agents with DIDs can authenticate and sign directly.


## Core Principle
```
Subject → Claim → Object (with Source)
```

Nodes emerge from subjects, objects, and sources. Edges emerge from claims. The graph grows organically as anyone adds attestations.

## Specifications

- [LinkedClaims Spec](https://identity.foundation/labs-linkedclaims/) — DIF Incubation Lab
- [Companion Paper: Addressability is The Missing Link](./Addressability_the_Missing_Link.md)

## Ecosystem

LinkedClaims is not the center of the universe. Claims don't need to originate here—any signed claim with a URI subject can participate. Existing claims can be referenced as sources, or wrapped by extracting their subject-claim-object structure. A claim becomes part of the active ecosystem when it's imported or wrapped.


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

*This vision applies across all repos in the ecosystem. Each repo may add specifics but should link back here to the master for this first part: [https://github.com/Cooperation-org/LinkedClaims/blob/main/VISION.md](https://github.com/Cooperation-org/LinkedClaims/blob/main/VISION.md).*
