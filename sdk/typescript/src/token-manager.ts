import { AuthResponse, TokenPayload } from './types';

export class TokenManager {
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private storage: 'localStorage' | 'memory' | 'none';
    
    constructor(storage: 'localStorage' | 'memory' | 'none' = 'localStorage') {
        this.storage = storage;
        
        // Load tokens from storage if available
        if (storage === 'localStorage' && typeof window !== 'undefined') {
            this.accessToken = localStorage.getItem('accessToken');
            this.refreshToken = localStorage.getItem('refreshToken');
        }
    }
    
    setTokens(accessToken: string, refreshToken?: string): void {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken || null;
        
        if (this.storage === 'localStorage' && typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
        }
    }
    
    getAccessToken(): string | null {
        return this.accessToken;
    }
    
    getRefreshToken(): string | null {
        return this.refreshToken;
    }
    
    clearTokens(): void {
        this.accessToken = null;
        this.refreshToken = null;
        
        if (this.storage === 'localStorage' && typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    }
    
    isAuthenticated(): boolean {
        return !!this.accessToken;
    }
    
    isExpired(token?: string): boolean {
        const checkToken = token || this.accessToken;
        if (!checkToken) return true;
        
        try {
            const payload = this.decodeToken(checkToken);
            const now = Date.now() / 1000;
            return payload.exp < now;
        } catch {
            return true;
        }
    }
    
    decodeToken(token: string): TokenPayload {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(
                atob(base64)
                    .split('')
                    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                    .join('')
            );
            return JSON.parse(jsonPayload);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
    
    getAuthHeader(): { Authorization: string } | {} {
        if (this.accessToken) {
            return { Authorization: `Bearer ${this.accessToken}` };
        }
        return {};
    }
}
