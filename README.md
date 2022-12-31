# LinkedClaims

Vocabulary and examples for expressing assertions about addressable things.

The LinkedClaim vocabulary enables linking to
third party sources (possibly unsigned) or to other claims, using the `digestMultibase` field
to verify that the linked object has not changed. 

[LinkedClaim Context](./context.json) file is published at [http://cooperation.org/credentials/v1](cooperation.org/credentials/v1)

[demo-app](./demo-app) is a small reference application in python for signing claims using didkit

[examples](./examples) contains simulated and actual real-world examples
  * [Product Review](./examples/product-review) Product review scraped from existing site
  * [Self-Asserted Skill](./examples/self-asserted-skill) Worker asserting skills and receiving recommendations from colleagues
  * [Social Impact](./examples/social-impact) NGO recipients attesting to impact
  * [Worker Reputation](./examples/worker-reputation) Worker exporting their earned reputation from a gig site
  * [Real World Harm](./examples/real-world-harm) A real life example of a student activist disappeared in Myanmar, and the connected claim that POSCO still does business with the military junta, using a wikipedia URL to identify the junta in both claims.


This repo is normally mirrored at both
[https://github.com/Cooperation-org/LinkedClaims](https://github.com/Cooperation-org/LinkedClaims) and [https://codeberg.org/cooperation/LinkedClaims](https://codeberg.org/cooperation/LinkedClaims)
