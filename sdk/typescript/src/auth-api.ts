import { BaseAPIClient } from './base-api-client';
import { AuthResponse, GitHubVerificationParams, VerificationResult } from './types';
import { TokenManager } from './token-manager';

export class AuthAPI extends BaseAPIClient {
    /**
     * Login with email and password
     * Compatible with existing clients
     */
    async login(email: string, password: string): Promise<AuthResponse> {
        const response = await this.post<AuthResponse>('/auth/login', {
            email,
            password
        });
        
        this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        return response;
    }
    
    /**
     * GitHub OAuth authentication
     * Compatible with githubAuth from trust-claim-client
     */
    async githubAuth(code: string): Promise<AuthResponse> {
        const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || 
                        process.env.REACT_APP_GITHUB_CLIENT_ID;
        
        const response = await this.post<AuthResponse>('/auth/github', {
            code,
            client_id: clientId
        });
        
        this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        return response;
    }
    
    /**
     * Google OAuth authentication
     * Compatible with googleAuth from trust-claim-client
     */
    async googleAuth(googleAuthCode: string): Promise<AuthResponse> {
        const response = await this.post<AuthResponse>('/auth/google', {
            googleAuthCode
        });
        
        this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        return response;
    }
    
    /**
     * LinkedIn OAuth authentication
     * Compatible with linkedinAuth from trust-claim-client
     */
    async linkedinAuth(code: string): Promise<AuthResponse> {
        const clientId = process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || 
                        process.env.REACT_APP_LINKEDIN_CLIENT_ID;
        
        const response = await this.post<AuthResponse>('/auth/linkedin', {
            code,
            client_id: clientId
        });
        
        this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        return response;
    }
    
    /**
     * Generic OAuth handler
     */
    async oauth(provider: 'github' | 'google' | 'linkedin', code: string): Promise<AuthResponse> {
        switch (provider) {
            case 'github':
                return this.githubAuth(code);
            case 'google':
                return this.googleAuth(code);
            case 'linkedin':
                return this.linkedinAuth(code);
            default:
                throw new Error(`Unsupported OAuth provider: ${provider}`);
        }
    }
    
    /**
     * Logout - clear tokens
     */
    logout(): void {
        this.tokenManager.clearTokens();
    }
    
    /**
     * Refresh access token
     */
    async refresh(): Promise<AuthResponse> {
        const refreshToken = this.tokenManager.getRefreshToken();
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        
        const response = await this.post<AuthResponse>('/auth/refresh', {
            refreshToken
        });
        
        this.tokenManager.setTokens(response.accessToken, response.refreshToken);
        return response;
    }
    
    /**
     * Check if authenticated
     */
    isAuthenticated(): boolean {
        return this.tokenManager.isAuthenticated();
    }
    
    /**
     * Get current auth token
     */
    getAuthToken(): string | null {
        return this.tokenManager.getAccessToken();
    }
}

/**
 * Profile verification API
 * Separate class as it's under /api not /auth
 */
export class ProfileAPI extends BaseAPIClient {
    /**
     * Verify GitHub profile
     * Compatible with verifyGitHubProfile from trust-claim-client
     */
    async verifyGitHubProfile(params: GitHubVerificationParams): Promise<VerificationResult> {
        return this.post<VerificationResult>('/api/github/verify-profile', params);
    }
}
