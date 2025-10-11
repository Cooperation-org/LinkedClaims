# CLAUDE.md - LinkedClaims Project Guide

## Core Principles

LinkedClaims are addressable claims about addressable subjects. Every claim has a URI, points to a URI subject, and is cryptographically signed. This creates a web of trust across domains.

See full spec: `/Users/gv/parent/linked-claims/linked-claims-spec.md` or https://identity.foundation/labs-linkedclaims/

## Architecture 

This is AN implementation using the simple schema at https://cooperation.org/credentials/v1/

`trust_claim_backend` is a shared backend that enables different domains to have different views of the basic semantic schema. Multiple frontend apps can use the same backend API and share the trust graph.

## Implementation

### Authentication

The backend supports OAuth and password auth:

```bash
# OAuth endpoints (GitHub, Google, LinkedIn)
GET  /api/auth/{provider}           # Initiate OAuth
GET  /api/auth/{provider}/callback  # OAuth callback
POST /api/auth/logout               # Logout

# Password auth
POST /api/auth/register             # Create account
POST /api/auth/login                # Login with email/password
POST /api/auth/refresh              # Refresh tokens
```

### Core API Endpoints

```bash
# Claims
POST /api/claims         # Create claim
GET  /api/claims/{id}    # Get specific claim
GET  /api/feed           # Get claims with filters
GET  /api/graph/{id}     # Get trust graph

# Credentials  
POST /api/credentials    # Submit credential
GET  /api/credentials/{id}  # Get credential

# Validation
GET  /api/claims/subject/{uri}?claim=VALIDATES  # Get validations
```

### Standard Claim Types

Use these existing types:
- `HAS_SKILL` - skill possession
- `ENDORSES` - professional endorsement
- `VALIDATES` - validation of another claim
- `HAS` - possession of credentials
- `IMPACT` - impact measurement
- `RISK` - risk assessment

### Creating Claims

```javascript
// Example: Create skill claim
POST /api/claims
{
    "subject": "https://github.com/username",
    "claim": "HAS_SKILL", 
    "object": "React",
    "statement": "Expert React developer",
    "score": 0.8,  // -1 to 1 normalized
    "sourceURI": "https://github.com/username/react-project"
}

// Score normalization from stars:
// score = (stars - 2.5) / 2.5
```

### URI Patterns

```
https://live.linkedtrust.us/claim/{id}
https://github.com/{username}
https://linkedin.com/in/{profile}
did:example:{identifier}
```

## Backend Details

**Development Backend:** http://localhost:3000  
**Production Backend:** https://live.linkedtrust.us  
**API Docs:** https://live.linkedtrust.us/api/docs

Environment variables:
```bash
NEXT_PUBLIC_BACKEND_URL=https://live.linkedtrust.us
# or for local development
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

## Examples

### Working Implementations

1. **Talent App** - Professional verification
   - Location: `/Users/gv/parent/linked-trust/talent`
   - Features: Video validations, public profiles
   - Uses: OAuth auth, creates ENDORSES claims

2. **Trust Claim Frontend** - Main UI
   - Location: `/Users/gv/parent/linked-trust/trust_claim`  
   - Features: Full claim creation, graph viz
   - Uses: All claim types

3. **Create Trust App** - Scaffolding tool
   - Location: `/Users/gv/parent/linked-trust/create-trust-app`
   - Run: `npx create-trust-app my-app`

### Building Your App

Two options:

**Option 1: Frontend Only**
- Point to existing backend
- Use standard claim types
- Follow examples in talent app

**Option 2: Frontend + Your Backend**
- Your backend for domain logic
- Call trust_claim_backend for claims
- See: `/Users/gv/parent/linked-trust/trust_claim_backend/GUIDE_TO_TRUST_APPS.md`

## Key Files

- **Backend Guide:** `/Users/gv/parent/linked-trust/trust_claim_backend/GUIDE_TO_TRUST_APPS.md`
- **Integration Guide:** `/Users/gv/parent/linked-trust/INTEGRATION_GUIDE.md`
- **Ecosystem Guide:** `/Users/gv/parent/linked-trust/ECOSYSTEM_GUIDE.md`

## Don'ts

- Don't create new API endpoints in trust_claim_backend
- Don't change existing API contracts
- Don't invent claim types without coordination
- Don't store claims in your own database - use the shared backend