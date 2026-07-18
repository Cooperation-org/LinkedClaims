# Magic-link invite flow — the pattern and the parts

How our apps onboard a new person with one link: an admin enters who they are
and mints an invite; the person clicks a magic link, lands on a page already
filled in for them, and comes out the other side signed in via SSO with the
memberships they need. First shipped for the Earned Governance Accelerator
(workers.vc + GovKit + LinkedTrust SSO); the parts are reusable on any
deployment.

## The flow

```
admin mints invite (name, email, audience, drafted words)
        │  invite gets an opaque code; magic link = {doorway}/i/<code>/
        ▼
person opens the magic link
        │  doorway resolves the code server-to-server, renders the join
        │  page PREFILLED (their name, words drafted for them, role fixed)
        ▼
person submits (may edit words, add photo/video)
        │  possession of a valid code IS the authorization — no review queue
        │  doorway reports back; invite: created → committed
        ▼
success page hands them the SSO accept link
        │  they sign in (LinkedTrust OIDC — Google/Bluesky underneath)
        │  accept: membership created; invite → accepted
        ▼
signed-in member with access to the org's SSO-controlled tools
```

Design facts learned shipping it:

- **The code is the gate, not the email.** The invited email is display/audit
  only — an OAuth identity may legitimately carry a different verified email
  than the one invited (`govkit/apps/orgs/invites.py`).
- **The invite lands on the real join page, prefilled** — not a separate
  one-button page. Same page walk-ups use, so there is one join experience
  to maintain (workers.vc commit ca6b4ef).
- **The inviter and the doorway can be different services.** They talk over
  a small server-to-server contract; either side can be swapped.
- **Statuses:** created → committed → accepted, plus revoked at any point.
  Accept works from `created` too, so a failed callback never strands anyone.

## The server-to-server contract

Doorway ↔ invite-owner, bearer-token auth (`GOVKIT_S2S_TOKEN` both sides;
empty disables the endpoints — every call 401s):

```
GET  {base}/api/v1/orgs/{slug}/invites/{code}/            → invite detail
POST {base}/api/v1/orgs/{slug}/invites/{code}/committed/  → mark committed
```

The GET payload includes `accept_url` (the SSO accept ceremony) — the doorway
never constructs the inviter's URLs.

## The parts (all open source)

| Part | Repo | Where to look |
|---|---|---|
| Invite model + mint API + accept ceremony | [Cooperation-org/govkit](https://github.com/Cooperation-org/govkit) | `apps/orgs/models.py` (Invite, statuses), `apps/orgs/invites.py`, `apps/orgs/api.py` (mint + S2S endpoints), `apps/orgs/views.py` (`accept_invite`, `invite_create`) |
| Doorway: magic-link page, prefilled join, S2S client | [Cooperation-org/workers.vc](https://github.com/Cooperation-org/workers.vc) | `doorway/govkit.py` (S2S client, the contract in one file), `doorway/views.py` (`earnedgov_invite_view`), `doorway/templates/earnedgov_commit.html` |
| Identity provider (OIDC issuer; brokers Google + Bluesky + LinkedTrust accounts) | [Whats-Cookin/trust_claim_backend](https://github.com/Whats-Cookin/trust_claim_backend) | `src/lib/oidc.ts`, `src/api/oidcApi.ts`, `scripts/register-oidc-client.ts` (mint a client per app; confidential clients, secret shown once) |
| "Sign in with LinkedTrust" for Django apps + stateless invites | [Cooperation-org/django-linkedtrust-auth](https://github.com/Cooperation-org/django-linkedtrust-auth) | `linkedtrust_auth/invites.py` (HMAC-signed tokens), `views.py` (invite carried through the OIDC round-trip), `taiga_adapter.py` / `cases_adapter.py`, `management/commands/lt_mint_invite.py`; README is the runbook |
| "Sign in with LinkedTrust" for Taiga | [Cooperation-org/taiga-contrib-linkedtrust-auth](https://github.com/Cooperation-org/taiga-contrib-linkedtrust-auth) | README is the install runbook: register client → pip install on taiga-back → env |
| Taiga frontend with the LT login button | [Cooperation-org/marten](https://github.com/Cooperation-org/marten) | `src/lib/auth/linkedtrust.ts` — deployment-agnostic: issuer + client_id from env, redirect_uri from origin; same build serves multiple Taiga instances |
| Taiga automation (tasks, tags, memberships via API) | [Cooperation-org/mcp-taiga](https://github.com/Cooperation-org/mcp-taiga) | reference for driving the Taiga REST API |

## Two invite variants

**Stateful, with a public doorway page** (the accelerator shape above):
invites are DB rows owned by one service (govkit's orgs app), resolved over
the S2S contract, and the person lands on a rich prefilled join page before
SSO. Use when joining is itself a public act (a claim on a wall) or the
inviter and doorway are different services.

**Stateless, signed link** (`django-linkedtrust-auth` `invites.py`): the
invite IS the link — an HMAC-SHA256 signed, self-contained token (email,
role, app scope, expiry; no DB, no shared storage). The same
`LINKEDTRUST_INVITE_SECRET` on multiple apps means one link works at all of
them. Minting: `manage.py lt_mint_invite --email ... --role ...` or the
built-in staff-only one-field admin page at
`/api/v1/auth/linkedtrust/invites/`. On callback the signature/expiry/
email/app-scope are verified; `LINKEDTRUST_REQUIRE_INVITE = True` refuses
account creation without one; the verified payload reaches your
`LINKEDTRUST_USER_HANDLER` as `userinfo["invite"]` so the adapter assigns
the role and project memberships (see `taiga_adapter.py`,
`cases_adapter.py`). Use for tool access onboarding — e.g. volunteers into
Taiga + a cases app with one emailed link.

## Standing one up on new infra

1. **Register OIDC clients** on the identity provider — one confidential
   client per app (`register-oidc-client.ts`; redirect URI =
   `{app-origin}/oauth/callback`). Scopes: `openid email profile trust`.
2. **Taiga:** install `taiga-contrib-linkedtrust-auth` on taiga-back, point
   Marten's env at the issuer + client_id. Its README covers both steps.
3. **Other apps:** django-linkedtrust-auth (Django) or the OIDC client
   pattern in Marten (SvelteKit) / govkit `apps/accounts/oidc.py`.
4. **Invites:** pick a variant. Stateless: set `LINKEDTRUST_INVITE_SECRET`
   (same value on every app one link should open) + `LINKEDTRUST_REQUIRE_INVITE`
   and mint from the admin page or `lt_mint_invite`. Stateful/doorway: run
   govkit's orgs app as the invite owner, or implement the Invite model +
   the two S2S endpoints in an app you already run — the contract is small
   on purpose.
5. **On accept**, create the memberships the org needs (e.g. Taiga project
   memberships via the Taiga API) in the accept handler.
