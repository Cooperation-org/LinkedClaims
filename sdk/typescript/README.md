# LinkedClaims TypeScript SDK

Official TypeScript SDK for LinkedClaims - create and manage verifiable trust claims.

## Installation

```bash
npm install @cooperation/linked-claims
# or
yarn add @cooperation/linked-claims
```

## Quick Start

```typescript
import LinkedClaims from '@cooperation/linked-claims';

// Initialize client (defaults to production API)
const client = new LinkedClaims();

// Authenticate
await client.auth.login('user@example.com', 'password');

// Create a claim
const { claim } = await client.claims.create({
    subject: 'https://github.com/alice',
    claim: 'endorsement',
    statement: 'Alice is an excellent TypeScript developer',
    effectiveDate: '2024-01-15',
    howKnown: 'FIRST_HAND'
});

console.log(`Claim created: ${claim.id}`);
```

## Drop-in Replacement

This SDK is designed as a drop-in replacement for existing LinkedTrust client libraries:

### Migrating from trust-claim-client

```typescript
// Old way
import { trustClaimClient } from './lib/trust-claim-client';
await trustClaimClient.createClaim({...});

// New way
import { linkedClaims } from '@cooperation/linked-claims';
await linkedClaims.createClaim({...}); // Same API!
```

### Migrating from linkedtrust-client

```typescript
// Old way
import { linkedTrustClient } from './lib/linkedtrust-client';

// New way  
import { linkedClaims } from '@cooperation/linked-claims';
// All the same methods are available
```

## Authentication

### Email/Password

```typescript
const authResponse = await client.auth.login('user@example.com', 'password');
console.log(`Logged in as ${authResponse.user.email}`);
```

### OAuth

```typescript
// GitHub
const authResponse = await client.auth.githubAuth(code);

// Google
const authResponse = await client.auth.googleAuth(code);

// LinkedIn
const authResponse = await client.auth.linkedinAuth(code);
```

## Creating Claims

### Basic Claim

```typescript
const { claim } = await client.claims.create({
    subject: 'https://example.org/project/123',
    claim: 'impact',
    statement: 'This project provided clean water to 500 families',
    effectiveDate: '2024-01-15',
    howKnown: 'FIRST_HAND'
});
```

### With Evidence

```typescript
const { claim } = await client.claims.create({
    subject: 'https://example.org/project/123',
    claim: 'impact',
    statement: 'Project impact documented in report',
    effectiveDate: '2024-01-15',
    howKnown: 'WEB_DOCUMENT',
    sourceURI: 'https://example.org/impact-report.pdf',
    confidence: 0.95
});
```

### Rating Claim

```typescript
const { claim } = await client.claims.create({
    subject: 'https://example.org/product/456',
    claim: 'rating',
    statement: 'Excellent product quality',
    aspect: 'quality',
    stars: 5,        // 1-5 stars
    score: 1.0,      // -1 to 1 normalized
    howKnown: 'FIRST_HAND'
});
```

## Querying Claims

### By Subject

```typescript
const response = await client.claims.getBySubject(
    'https://github.com/alice',
    1,  // page
    50  // limit
);

console.log(`Found ${response.claims.length} claims`);
```

### With Filters

```typescript
const response = await client.claims.query({
    claim: 'endorsement',
    issuer_id: 'https://example.org/user/123',
    page: 1,
    limit: 20
});
```

## Semantic Helpers

The SDK includes semantic helpers to guide users in creating valid claims:

### Field Guidance

```typescript
// Get help text for fields
const guidance = client.semantic.getFieldGuidance('subject', {
    domain: 'impact',
    claimType: 'impact'
});

console.log(guidance.help);
// "Enter the URL of the project, organization, or initiative that created impact"
```

### Simplified How Known Options

```typescript
// Get user-friendly options for howKnown field
const options = client.semantic.getSimplifiedHowKnown();
// Returns 3-4 simple options instead of 11 technical values
```

### URI Building

```typescript
// Build valid URIs
const uri = client.semantic.buildURI(
    'PERSON',
    'alice',
    'https://example.org'
);
// Returns: https://example.org/person/alice
```

## Configuration

### Custom API Endpoint

```typescript
const client = new LinkedClaims({
    baseUrl: 'https://your-api.example.com'
});
```

### Token Storage Options

```typescript
const client = new LinkedClaims({
    auth: {
        storage: 'memory',  // 'localStorage' | 'memory' | 'none'
        autoRefresh: true
    }
});
```

### Auth Error Handling

```typescript
const client = new LinkedClaims({
    onAuthError: () => {
        // Redirect to login
        window.location.href = '/login';
    }
});
```

## Environment Variables

The SDK respects these environment variables:

- `NEXT_PUBLIC_TRUST_CLAIM_BACKEND_URL` - API base URL (Next.js)
- `REACT_APP_TRUST_CLAIM_BACKEND_URL` - API base URL (Create React App)
- `LINKEDTRUST_BASE_URL` - API base URL (Node.js)
- `NEXT_PUBLIC_GITHUB_CLIENT_ID` - GitHub OAuth client ID
- `NEXT_PUBLIC_LINKEDIN_CLIENT_ID` - LinkedIn OAuth client ID

## TypeScript Support

Full TypeScript support with exported types:

```typescript
import type { 
    Claim, 
    CreateClaimInput,
    HowKnown,
    EntityType 
} from '@cooperation/linked-claims';
```

## License

MIT - See LICENSE file in the repository
