# LinkedClaims

The trust layer.

**LinkedClaims** is the open spec for portable, signed attestations — small encapsulated claims about anything addressable by URI.

**LinkedTrust** is the service built on top. You give it a URI; it returns a trust score relative to *you*, computed from claims you and your trusted sources have attested.

```
                                                trust score
       any URI  ──────────→  [ LinkedTrust ]  ──────────→  (relative to you)
                                    ▲
                                    │  composed from
                                    │
                          web of signed LinkedClaims
                          (published by people, orgs,
                           abra, amebo, anyone)
```

URI in, score out. The complexity is encapsulated.

LinkedTrust scores. It does not decide. The agent or person asking decides what to do with the score.

Canonical instance: [`live.linkedtrust.us`](https://live.linkedtrust.us). The spec is open; other instances can exist.

---

**Detail**
- [`VISION.md`](VISION.md) — why
- [`spec.md`](spec.md) — data spec
- [`LinkedClaimsRFC.md`](LinkedClaimsRFC.md) — formal RFC
- [`sdk/`](sdk/) + [`SDK_ROADMAP.md`](SDK_ROADMAP.md) — SDK
- [`Addressability_the_Missing_Link.md`](Addressability_the_Missing_Link.md)

**Related systems** (own repos)
- [abra](https://github.com/Cooperation-org/abra) — can publish bindings out as LinkedClaims
- [amebo](https://github.com/Cooperation-org/amebo) — queries LinkedTrust for trust scores
