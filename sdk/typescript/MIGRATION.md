# Migration Guide

## Migrating from trust-claim-client (talent app)

### 1. Install the new SDK

```bash
npm uninstall # (no package to uninstall, it was local)
npm install @cooperation/linked-claims
```

### 2. Update imports

```typescript
// Old - talent/lib/trust-claim-client.ts
import { trustClaimClient } from './lib/trust-claim-client';

// New
import { linkedClaims } from '@cooperation/linked-claims';
```

### 3. No code changes needed!

All methods have the same names and signatures:

```typescript
// These all work exactly the same
await linkedClaims.githubAuth(code);
await linkedClaims.createClaim(claimData);
await linkedClaims.getClaimsBySubject(uri, page, limit);
linkedClaims.isAuthenticated();
linkedClaims.clearTokens();
```

### 4. Delete the old client file

You can now delete `talent/lib/trust-claim-client.ts` and `talent/lib/auth-cookies.ts`.

## Migrating from linkedtrust-client (certify app)

### 1. Install the new SDK

```bash
npm install @cooperation/linked-claims
```

### 2. Update imports

```typescript
// Old - certify/lib/linkedtrust-client.ts
import { linkedTrustClient } from './lib/linkedtrust-client';

// New
import { linkedClaims } from '@cooperation/linked-claims';
```

### 3. Update method calls

Most methods are compatible, but some have slightly different names:

```typescript
// Old
await linkedTrustClient.createClaimV4(claimData);

// New (standard create method works with v4 API)
await linkedClaims.claims.create(claimData);

// Old
await linkedTrustClient.getClaimsBySubjectV4(uri);

// New
await linkedClaims.claims.getBySubject(uri);
```

### 4. Volunteer badge methods

The volunteer badge specific methods would need to be implemented in your app code using the generic claim creation:

```typescript
// Old
await linkedTrustClient.createVolunteerBadge(payload);

// New - create as a verifiable credential claim
const credential = {
    '@context': ['https://www.w3.org/2018/credentials/v1'],
    type: ['VerifiableCredential', 'VolunteerBadge'],
    credentialSubject: payload,
    // ... other credential fields
};

await linkedClaims.claims.create({
    subject: credential.credentialSubject.id,
    claim: 'credential',
    statement: `Volunteer badge for ${payload.volunteerName}`,
    object: JSON.stringify(credential),
    effectiveDate: payload.issueDate
});
```

## Migrating from Python linkedtrust_client

The TypeScript SDK can be used from Node.js backends as well:

```javascript
// Node.js usage
const { LinkedClaims } = require('@cooperation/linked-claims');

const client = new LinkedClaims({
    baseUrl: process.env.LINKEDTRUST_BASE_URL
});

// Authenticate
await client.auth.login(email, password);

// Create claims
await client.claims.create({
    subject: 'https://example.org/entity',
    claim: 'impact',
    statement: 'Made an impact',
    howKnown: 'FIRST_HAND'
});
```

## Using the new Semantic Helpers

The new SDK includes semantic helpers not available in the old clients:

```typescript
// Get user-friendly guidance
const guidance = linkedClaims.semantic.getFieldGuidance('effectiveDate', {
    domain: 'impact'
});
console.log(guidance.help);
// "The date when the claimed event or situation occurred (not today's date)"

// Simplify howKnown options for UI
const howKnownOptions = linkedClaims.semantic.getSimplifiedHowKnown();
// Returns 4 user-friendly options instead of 11 technical ones

// Build valid URIs
const uri = linkedClaims.semantic.buildURI('PERSON', 'alice');
// Returns: https://example.org/person/alice

// Get source requirements based on howKnown
const sourceReq = linkedClaims.semantic.getSourceRequirements('WEB_DOCUMENT');
if (sourceReq.required) {
    console.log(sourceReq.help);
    // "Please provide the URL of the web page where you found this information"
}
```

## Environment Variables

The SDK automatically picks up existing environment variables:

- `NEXT_PUBLIC_TRUST_CLAIM_BACKEND_URL` (from talent app)
- `NEXT_PUBLIC_LINKEDTRUST_API_URL` (from certify app)  
- `LINKEDTRUST_BASE_URL` (from Python client)

## Advanced: Custom Configuration

If you need custom configuration:

```typescript
import LinkedClaims from '@cooperation/linked-claims';

const client = new LinkedClaims({
    baseUrl: 'https://your-api.example.com',
    auth: {
        storage: 'memory', // for server-side usage
        autoRefresh: true
    },
    onAuthError: () => {
        // Custom auth error handling
        router.push('/login');
    }
});
```

## TypeScript Types

The SDK exports all types for TypeScript users:

```typescript
import type {
    Claim,
    CreateClaimInput,
    HowKnown,
    EntityType,
    AuthResponse,
    User
} from '@cooperation/linked-claims';

// Use in your components
interface Props {
    claim: Claim;
    onUpdate: (input: CreateClaimInput) => Promise<void>;
}
```

## Troubleshooting

### "Cannot find module" error

Make sure you've installed the package:
```bash
npm install @cooperation/linked-claims
```

### Authentication not persisting

Check that localStorage is available (client-side) or use memory storage:
```typescript
const client = new LinkedClaims({
    auth: { storage: 'memory' }
});
```

### CORS errors

The SDK uses the same endpoints as the old clients. If you're getting CORS errors, check:
1. Your API URL is correct
2. Your domain is whitelisted in the backend CORS config

### TypeScript errors

The SDK includes TypeScript definitions. If you see type errors:
1. Update to TypeScript 4.0 or later
2. Enable `esModuleInterop` in tsconfig.json
3. Use the exported types instead of defining your own

## Getting Help

- GitHub Issues: https://github.com/Cooperation-org/LinkedClaims/issues
- Documentation: https://cooperation.org/linkedclaims
- API Reference: See README.md
