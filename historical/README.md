# Historical

These files are kept for reference but are no longer actively maintained.

## demo-app/

A Python Flask reference implementation from 2022 for signing claims using didkit.
Predates the ATProto integration and the TypeScript SDK.

Still useful as a reference for how claim signing works with didkit, but new
implementations should use the `@cooperation/linkedclaims` SDK or the ATProto
integration via `@cooperation/claim-atproto`.

## examples/

Real-world claim examples in JSON from 2022-2023. These use the older VC/JSON-LD format
but the patterns (product review, skills attestation, social impact, worker reputation,
real-world harm documentation) are still valid conceptually. For current SDK usage, see
the [docs/](../docs/) directory.

## AdvanceReadingDrafts/

Early drafts and reading materials from the initial LinkedClaims design process,
including notes on Ceramic-based Verifiable Credentials and claim presentations.
