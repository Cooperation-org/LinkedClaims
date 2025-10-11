import fetch from 'cross-fetch';
import { TokenManager } from './token-manager';
import { LinkedClaimsError } from './types';

export interface RequestOptions extends RequestInit {
    params?: Record<string, any>;
}

export class BaseAPIClient {
    protected baseUrl: string;
    protected tokenManager: TokenManager;
    protected onAuthError?: () => void;
    
    constructor(
        baseUrl: string,
        tokenManager: TokenManager,
        onAuthError?: () => void
    ) {
        this.baseUrl = baseUrl;
        this.tokenManager = tokenManager;
        this.onAuthError = onAuthError;
    }
    
    protected async request<T>(
        path: string,
        options: RequestOptions = {}
    ): Promise<T> {
        const { params, ...fetchOptions } = options;
        
        // Build URL with query params
        const url = new URL(`${this.baseUrl}${path}`);
        if (params) {
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined) {
                    url.searchParams.append(key, value);
                }
            });
        }
        
        // Set up headers
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
            ...this.tokenManager.getAuthHeader(),
            ...(fetchOptions.headers || {})
        };
        
        try {
            const response = await fetch(url.toString(), {
                ...fetchOptions,
                headers
            });
            
            if (!response.ok) {
                await this.handleErrorResponse(response);
            }
            
            // Handle empty responses
            const text = await response.text();
            if (!text) {
                return {} as T;
            }
            
            return JSON.parse(text);
        } catch (error) {
            if (error instanceof Error) {
                throw error;
            }
            throw new Error('Network error');
        }
    }
    
    private async handleErrorResponse(response: Response): Promise<never> {
        let errorData: any;
        try {
            errorData = await response.json();
        } catch {
            errorData = { error: 'Request failed' };
        }
        
        const error = new Error(
            errorData.error || errorData.message || `HTTP ${response.status}`
        ) as LinkedClaimsError;
        error.code = errorData.code || 'HTTP_ERROR';
        error.statusCode = response.status;
        error.details = errorData;
        
        // Handle auth errors
        if (response.status === 401) {
            this.tokenManager.clearTokens();
            if (this.onAuthError) {
                this.onAuthError();
            }
        }
        
        throw error;
    }
    
    // Helper methods for common HTTP verbs
    protected get<T>(path: string, params?: Record<string, any>): Promise<T> {
        return this.request<T>(path, { method: 'GET', params });
    }
    
    protected post<T>(path: string, data?: any, params?: Record<string, any>): Promise<T> {
        return this.request<T>(path, {
            method: 'POST',
            body: data ? JSON.stringify(data) : undefined,
            params
        });
    }
    
    protected put<T>(path: string, data?: any, params?: Record<string, any>): Promise<T> {
        return this.request<T>(path, {
            method: 'PUT',
            body: data ? JSON.stringify(data) : undefined,
            params
        });
    }
    
    protected delete<T>(path: string, params?: Record<string, any>): Promise<T> {
        return this.request<T>(path, { method: 'DELETE', params });
    }
}
