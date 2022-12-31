# LinkedClaims

Vocabulary and examples for expressing assertions about addressable things.

The LinkedClaim vocabulary enables linking to
third party sources (possibly unsigned) or to other claims, using the `digestMultibase` field
to verify that the linked object has not changed. 

[./context.json](LinkedClaim Context) file is published at [http://cooperation.org/credentials/v1](cooperation.org/credentials/v1)

[./demo-app](demo-app) is a small reference application in python for signing claims using didkit

[./examples](examples) contains simulated real-world examples
  [./examples/product-review](Product Review) Product review scraped from existing site
  [./examples/self-asserted-skill](Self-Asserted Skill) Worker asserting skills and receiving recommendations from colleagues
  [./examples/social-impact](Social Impact) NGO recipients attesting to impact
  [./examples/worker-reputation](Worker Reputation) Worker exporting their earned reputation from a gig site
