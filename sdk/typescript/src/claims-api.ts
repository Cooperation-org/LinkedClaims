import { BaseAPIClient } from './base-api-client';
import {
    Claim,
    CreateClaimInput,
    ClaimFilters,
    ClaimListResponse,
    PaginationOptions
} from './types';

export class ClaimsAPI extends BaseAPIClient {
    /**
     * Create a new claim
     * Drop-in compatible with existing trust-claim-client
     */
    async create(claim: CreateClaimInput): Promise<{ claim: Claim }> {
        this.validateClaim(claim);
        return this.post<{ claim: Claim }>('/api/claims', claim);
    }
    
    /**
     * Get a claim by ID
     * Compatible with getClaim from trust-claim-client
     */
    async getById(id: number): Promise<{ claim: Claim }> {
        return this.get<{ claim: Claim }>(`/api/claims/${id}`);
    }
    
    /**
     * Get claims by subject URI
     * Compatible with getClaimsBySubject from trust-claim-client
     */
    async getBySubject(
        uri: string,
        page: number = 1,
        limit: number = 50
    ): Promise<ClaimListResponse> {
        // Base64 encode the URI to avoid issues with slashes in Express routes
        const encodedUri = Buffer.from(uri).toString('base64');
        return this.get<ClaimListResponse>(
            `/api/claims/subject/${encodedUri}`,
            { page, limit }
        );
    }
    
    /**
     * Query claims with filters
     * Compatible with queryClaims from trust-claim-client
     */
    async query(
        params: ClaimFilters & PaginationOptions
    ): Promise<ClaimListResponse> {
        return this.get<ClaimListResponse>('/api/claim', params);
    }
    
    /**
     * Alternative method names for compatibility
     */
    async createClaim(claim: CreateClaimInput): Promise<{ claim: Claim }> {
        return this.create(claim);
    }
    
    async getClaim(id: number): Promise<{ claim: Claim }> {
        return this.getById(id);
    }
    
    async getClaimsBySubject(
        uri: string,
        page?: number,
        limit?: number
    ): Promise<ClaimListResponse> {
        return this.getBySubject(uri, page, limit);
    }
    
    async queryClaims(params: ClaimFilters & PaginationOptions): Promise<ClaimListResponse> {
        return this.query(params);
    }
    
    /**
     * Get claims by object URI (new method)
     */
    async getByObject(
        uri: string,
        options?: PaginationOptions
    ): Promise<ClaimListResponse> {
        return this.get<ClaimListResponse>('/api/claim', {
            object: uri,
            page: options?.page || 1,
            limit: options?.limit || 50
        });
    }
    
    /**
     * Get validations for a claim
     */
    async getValidations(claimId: number): Promise<Claim[]> {
        // Get claims where the object is this claim's URI
        const claimResponse = await this.getById(claimId);
        const claimUri = claimResponse.claim.claimAddress || 
                        `${this.baseUrl}/claim/${claimId}`;
        
        const response = await this.getByObject(claimUri);
        return response.claims;
    }
    
    /**
     * Validate claim input
     */
    private validateClaim(claim: CreateClaimInput): void {
        if (!claim.subject) {
            throw new Error('subject is required');
        }
        
        if (!this.isValidURI(claim.subject)) {
            throw new Error('subject must be a valid URI');
        }
        
        if (!claim.claim) {
            throw new Error('claim is required');
        }
        
        if (!claim.statement) {
            throw new Error('statement is required');
        }
        
        if (claim.object && !this.isValidURI(claim.object)) {
            throw new Error('object must be a valid URI');
        }
        
        if (claim.sourceURI && !this.isValidURI(claim.sourceURI)) {
            throw new Error('sourceURI must be a valid URI');
        }
        
        if (claim.score !== undefined && (claim.score < -1 || claim.score > 1)) {
            throw new Error('score must be between -1 and 1');
        }
        
        if (claim.stars !== undefined && (claim.stars < 1 || claim.stars > 5)) {
            throw new Error('stars must be between 1 and 5');
        }
    }
    
    private isValidURI(uri: string): boolean {
        try {
            new URL(uri);
            return true;
        } catch {
            // Also accept URNs and DIDs
            return /^(urn:|did:)/.test(uri);
        }
    }
}
