# LinkedClaims

Vocabulary and examples for expressing assertions about addressable things.

The LinkedClaim vocabulary enables linking to
third party sources (possibly unsigned) or to other claims, using the `digestMultibase` field
to verify that the linked object has not changed. 

Update Feb 2025: [LinkedClaims: An Open Standard](https://identity.foundation/labs-linkedclaims/) published at Decentralized Identity Foundation with minimal requirements clarified.

This repo contains an SDK for creating applications in the decentralized web of trust.  See [./VISION.md](./VISION.md) for the LinkedClaims vision of how this decentralized web can work in a simple way that is inclusive of external projects and sources as well.

---

[LinkedClaim Context](./context.json) file is published at [http://cooperation.org/credentials/v1](cooperation.org/credentials/v1)

[demo-app](./demo-app) is a small reference application in python for signing claims using didkit

[examples](./examples) contains simulated and actual real-world examples
  * [Product Review](./examples/product-review) Product review scraped from existing site
  * [Self-Asserted Skill](./examples/self-asserted-skill) Worker asserting skills and receiving recommendations from colleagues
  * [Social Impact](./examples/social-impact) NGO recipients attesting to impact
  * [Worker Reputation](./examples/worker-reputation) Worker exporting their earned reputation from a gig site
  * [Real World Harm](./examples/real-world-harm) A real life example of a student activist disappeared in Myanmar, and the connected claim that POSCO still does business with the military junta, using a wikipedia URL to identify the junta in both claims.

**Development Server:** https://dev.linkedtrust.us/api/docs/
**Production Server:** https://live.linkedtrust.us/api/docs/

The API documentation includes interactive examples for all endpoints.

This repo is normally mirrored at both
[https://github.com/Cooperation-org/LinkedClaims](https://github.com/Cooperation-org/LinkedClaims) and [https://codeberg.org/cooperation/LinkedClaims](https://codeberg.org/cooperation/LinkedClaims)

The context and examples here came out of a draft paper at RWoT : [Composable Credentials](https://github.com/WebOfTrustInfo/rwot11-the-hague/blob/master/draft-documents/composable-credentials.md)
and from some design work at http://cooperation.org/linked_trust
