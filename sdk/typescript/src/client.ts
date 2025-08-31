import { TokenManager } from './token-manager';
import { ClaimsAPI } from './claims-api';
import { AuthAPI, ProfileAPI } from './auth-api';
import { SemanticHelpers } from './semantic-helpers';
import { LinkedClaimsConfig, User } from './types';

/**
 * Main LinkedClaims client
 * Drop-in replacement for trust-claim-client and linkedtrust-client
 */
export class LinkedClaims {
    private baseUrl: string;
    private tokenManager: TokenManager;
    private onAuthError?: () => void;
    
    // API modules
    public claims: ClaimsAPI;
    public auth: AuthAPI;
    public profiles: ProfileAPI;
    public semantic: SemanticHelpers;
    
    constructor(config?: LinkedClaimsConfig) {
        // Default to production API
        this.baseUrl = config?.baseUrl || 
                      process.env.NEXT_PUBLIC_TRUST_CLAIM_BACKEND_URL ||
                      process.env.REACT_APP_TRUST_CLAIM_BACKEND_URL ||
                      process.env.LINKEDTRUST_BASE_URL ||
                      'https://api.linkedtrust.us';
        
        // Set up token management
        const storage = config?.auth?.storage || 'localStorage';
        this.tokenManager = new TokenManager(storage);
        
        this.onAuthError = config?.onAuthError;
        
        // Initialize API modules
        this.claims = new ClaimsAPI(this.baseUrl, this.tokenManager, this.onAuthError);
        this.auth = new AuthAPI(this.baseUrl, this.tokenManager, this.onAuthError);
        this.profiles = new ProfileAPI(this.baseUrl, this.tokenManager, this.onAuthError);
        this.semantic = new SemanticHelpers();
    }
    
    /**
     * Convenience methods for compatibility
     */
    
    isAuthenticated(): boolean {
        return this.auth.isAuthenticated();
    }
    
    getAuthToken(): string | null {
        return this.auth.getAuthToken();
    }
    
    clearTokens(): void {
        this.auth.logout();
    }
    
    getCurrentUser(): User | null {
        // This would need to be implemented based on token payload
        // or by calling a /me endpoint
        const token = this.tokenManager.getAccessToken();
        if (!token) return null;
        
        try {
            const payload = this.tokenManager.decodeToken(token);
            return {
                id: parseInt(payload.sub),
                email: payload.email
            };
        } catch {
            return null;
        }
    }
    
    /**
     * Legacy method names for drop-in compatibility
     */
    
    // From trust-claim-client
    async createClaim(claim: any) {
        return this.claims.createClaim(claim);
    }
    
    async getClaim(id: number) {
        return this.claims.getClaim(id);
    }
    
    async getClaimsBySubject(uri: string, page?: number, limit?: number) {
        return this.claims.getClaimsBySubject(uri, page, limit);
    }
    
    async queryClaims(params: any) {
        return this.claims.queryClaims(params);
    }
    
    async githubAuth(code: string) {
        return this.auth.githubAuth(code);
    }
    
    async googleAuth(code: string) {
        return this.auth.googleAuth(code);
    }
    
    async linkedinAuth(code: string) {
        return this.auth.linkedinAuth(code);
    }
    
    async verifyGitHubProfile(params: any) {
        return this.profiles.verifyGitHubProfile(params);
    }
}

/**
 * Default export - pre-configured instance
 * Works out of the box like trust-claim-client
 */
export const linkedClaims = new LinkedClaims();

// Also export class for custom configuration
export default LinkedClaims;
