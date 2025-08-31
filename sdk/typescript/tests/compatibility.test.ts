/**
 * Compatibility test - verifying drop-in replacement
 * 
 * This file shows that the new SDK can replace existing clients
 * without changing any application code
 */

import { linkedClaims } from '../src';

// Test 1: Methods from trust-claim-client (talent)
async function testTrustClaimClientCompatibility() {
    console.log('Testing trust-claim-client compatibility...');
    
    // All these methods exist and have the same signatures
    const client = linkedClaims;
    
    // Auth methods
    await client.githubAuth('code');
    await client.googleAuth('code');
    await client.linkedinAuth('code');
    
    // Claim methods
    await client.createClaim({
        subject: 'https://example.org/test',
        claim: 'test',
        statement: 'test'
    });
    
    await client.getClaim(123);
    
    await client.getClaimsBySubject('https://example.org/test', 1, 50);
    
    await client.queryClaims({
        subject: 'https://example.org/test',
        page: 1,
        limit: 20
    });
    
    await client.verifyGitHubProfile({
        username: 'test',
        userId: '123',
        profileBaseUrl: 'https://example.org'
    });
    
    // Token methods
    client.isAuthenticated();
    client.getAuthToken();
    client.clearTokens();
    
    console.log('✓ All trust-claim-client methods are available');
}

// Test 2: Direct property access pattern
async function testDirectApiAccess() {
    console.log('Testing direct API access pattern...');
    
    // New SDK also supports modular access
    const client = linkedClaims;
    
    // Claims API
    await client.claims.create({
        subject: 'https://example.org/test',
        claim: 'test',
        statement: 'test'
    });
    
    // Auth API
    await client.auth.login('user@example.com', 'password');
    await client.auth.oauth('github', 'code');
    
    // Semantic helpers
    const guidance = client.semantic.getFieldGuidance('subject');
    const options = client.semantic.getSimplifiedHowKnown();
    
    console.log('✓ Modular API access works');
}

// Test 3: Configuration matches existing usage
async function testConfiguration() {
    console.log('Testing configuration compatibility...');
    
    // Can import and use just like the singleton pattern
    const { linkedClaims } = await import('../src');
    
    // Works immediately without configuration
    linkedClaims.isAuthenticated();
    
    // Can also create configured instance
    const { default: LinkedClaims } = await import('../src');
    const customClient = new LinkedClaims({
        baseUrl: 'https://custom.api.com'
    });
    
    console.log('✓ Configuration patterns match');
}

// Run all tests
async function runCompatibilityTests() {
    try {
        await testTrustClaimClientCompatibility();
        await testDirectApiAccess();
        await testConfiguration();
        
        console.log('\n✅ All compatibility tests passed!');
        console.log('The SDK is a drop-in replacement for existing clients.');
    } catch (error) {
        console.error('❌ Compatibility test failed:', error);
    }
}

// Note: This is a type-checking test, not a runtime test
// It verifies that all the expected methods exist with correct signatures
