# LinkedClaims

The intention is to have a broad standard that is implementation independent

## What is a LinkedClaim?

---

 A signed, structured document with a claim about a URI, that itself has a URI.

---

Specifically, a LinkedClaim

* MUST have a subject that can be any valid URI

* MUST itself have a URI to be addressed at

* SHOULD be hashable, ie, have determinate content when retrieved from the URI
 (possibly when retrieved with a specific content-type or with a specific query parameter)

* MUST be cryptographically signed, such as with a DID

* MUST include a date that is in the signed data

* SHOULD have the ability to point to a source, possibly separate from the issuer

* SHOULD have the ability to point to hashlinked evidence, or may be linked to evidence by a connecting claim

* MAY be a verifiable credential

* MAY have a subject that itself is a claim

* MAY have a separate published date and effective date

* MAY be published in an open data stream

* MAY be consumed and rolled up into predictions and scores (which themselves may be claims)
