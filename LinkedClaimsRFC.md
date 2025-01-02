# LinkedClaims

The intention is to have a broad standard that is implementation independent, for making claims about entities that can be connected together across different platforms, storages and implementations.  Such claims may be public or private/access-gated.

## What is a LinkedClaim?

---

 A signed, structured document with a claim about a URI, that itself has a URI.

---

Specifically, a LinkedClaim

* MUST have a subject that can be any valid URI

* MUST itself have an identifier that is a well-formed URI (URN is acceptable)

* MUST be cryptographically signed, such as with a DID

* SHOULD be hashable, ie, have determinate content when retrieved from the URI
 (possibly when retrieved with a specific content-type or with a specific query parameter)

* SHOULD include a date that is in the signed data

* SHOULD contain evidence such as links to a source or attachments, optionally hashlinked

* MAY have a narrative statement

* MAY be a W3C Verifiable Credential or similar digital credential specification

* MAY provide a way for the issuer to mutate or revoke the claim

* MAY have a subject that itself is a claim

* MAY have a separate published date and effective date

* MAY be public or access controlled

