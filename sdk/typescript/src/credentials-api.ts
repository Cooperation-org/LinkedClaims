/**
 * Credentials API for LinkedClaims SDK
 * Handles W3C Verifiable Credentials and complex credential formats
 */

import { BaseAPIClient } from './base-api-client';
import { ENDPOINTS } from './constants';

export interface CredentialResponse {
    credential: any; // Stored credential from backend
    uri: string;
    schema?: string;
    metadata?: any;
    claimUrl?: string; // URL to create a claim for this credential
    relatedClaims?: any[]; // Claims related to this credential
    instructions?: {
        message: string;
        claimEndpoint: string;
        exampleClaim: any;
    };
    message?: string;
}

export interface CreateCredentialInput {
    credential: any; // W3C VC structure
    schema?: string; // e.g., 'OpenBadgesV3', 'Blockcerts'
    metadata?: {
        displayHints?: Record<string, any>;
        tags?: string[];
        visibility?: 'public' | 'private';
    };
}

export class CredentialsAPI extends BaseAPIClient {
    /**
     * Create a new credential
     * The backend will store it and auto-extract a LinkedClaim
     */
    async create(input: CreateCredentialInput): Promise<CredentialResponse> {
        return this.post<CredentialResponse>('/api/credentials', input);
    }
    
    /**
     * Get a credential by URI or ID
     */
    async getCredential(uriOrId: string): Promise<{ credential: any; relatedClaims?: any[] }> {
        // Extract ID from URI if needed
        const id = uriOrId.includes('/') ? uriOrId.split('/').pop() : uriOrId;
        return this.request<{ credential: any; relatedClaims?: any[] }>(`/api/credentials/${id}`, {
            method: 'GET'
        });
    }

    /**
     * Get credentials by subject DID/URI
     */
    async getBySubject(subjectUri: string, page = 1, limit = 20): Promise<any[]> {
        return this.request<any[]>('/api/credentials', {
            method: 'GET',
            params: {
                subject: subjectUri,
                page,
                limit
            }
        });
    }

    /**
     * Verify a credential
     */
    async verify(uri: string): Promise<{
        isValid: boolean;
        status: string;
        message: string;
        technicalDetails?: any;
    }> {
        const id = uri.includes('/') ? uri.split('/').pop() : uri;
        return this.request(`/api/credentials/${id}/verify`, {
            method: 'GET'
        });
    }

    /**
     * Alias for getCredential - backward compatibility
     * Named differently to avoid conflict with BaseAPIClient.get()
     */
    async getByUri(uri: string): Promise<{ credential: any; relatedClaims?: any[] }> {
        return this.getCredential(uri);
    }
    
    /**
     * Submit a credential for storage (alias for create)
     * Compatibility with existing code
     */
    async submitCredential(credential: any, metadata?: any): Promise<CredentialResponse> {
        return this.create({
            credential,
            metadata
        });
    }
}