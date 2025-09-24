// Type definitions matching trust_claim_backend Prisma schema
// These are designed to be drop-in compatible with existing client libraries

export enum HowKnown {
    FIRST_HAND = 'FIRST_HAND',
    SECOND_HAND = 'SECOND_HAND',
    WEB_DOCUMENT = 'WEB_DOCUMENT',
    VERIFIED_LOGIN = 'VERIFIED_LOGIN',
    BLOCKCHAIN = 'BLOCKCHAIN',
    SIGNED_DOCUMENT = 'SIGNED_DOCUMENT',
    PHYSICAL_DOCUMENT = 'PHYSICAL_DOCUMENT',
    INTEGRATION = 'INTEGRATION',
    RESEARCH = 'RESEARCH',
    OPINION = 'OPINION',
    OTHER = 'OTHER'
}

export enum EntityType {
    PERSON = 'PERSON',
    ORGANIZATION = 'ORGANIZATION',
    CLAIM = 'CLAIM',
    IMPACT = 'IMPACT',
    EVENT = 'EVENT',
    DOCUMENT = 'DOCUMENT',
    PRODUCT = 'PRODUCT',
    PLACE = 'PLACE',
    UNKNOWN = 'UNKNOWN',
    OTHER = 'OTHER',
    CREDENTIAL = 'CREDENTIAL'
}

export enum IssuerIdType {
    DID = 'DID',
    ETH = 'ETH',
    PUBKEY = 'PUBKEY',
    URL = 'URL'
}

export enum AuthType {
    PASSWORD = 'PASSWORD',
    OAUTH = 'OAUTH',
    GITHUB = 'GITHUB'
}

export interface User {
    id: number;
    email?: string;
    name?: string;
    authType?: AuthType;
    githubUsername?: string;
    profileImage?: string;
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
    githubData?: GitHubData;
    linkedinData?: LinkedInData;
}

export interface GitHubData {
    username: string;
    profileUrl: string;
    publicRepos: number;
    followers: number;
    following: number;
    createdAt: string;
    bio?: string;
    company?: string;
    location?: string;
    hireable?: boolean;
    accessToken: string;
}

export interface LinkedInData {
    linkedinId: string;
    firstName: string;
    lastName: string;
    profileUrl?: string;
    profilePicture?: string | null;
    accessToken?: string;
    verificationToken?: string;
    needsVanityName?: boolean;
}

// Main Claim interface - matches backend exactly
export interface Claim {
    id?: number;
    subject: string;
    claim: string;
    object?: string;
    statement?: string;
    effectiveDate?: string;
    
    // ClaimSource fields
    sourceURI?: string;
    howKnown?: HowKnown;
    dateObserved?: string;
    digestMultibase?: string;
    author?: string;
    curator?: string;
    
    // NormalizedRating fields
    aspect?: string;
    score?: number;
    stars?: number;
    
    // Measure fields
    amt?: number;
    unit?: string;
    howMeasured?: string;
    
    // Sharing fields
    intendedAudience?: string;
    respondAt?: string;
    
    confidence?: number;
    
    // Signer fields
    issuerId?: string;
    issuerIdType?: IssuerIdType;
    
    // External address
    claimAddress?: string;
    
    // Proof
    proof?: string;
    
    // Timestamps
    createdAt?: string;
    lastUpdatedAt?: string;
}

// Input type for creating claims (without generated fields)
export type CreateClaimInput = Omit<Claim, 'id' | 'createdAt' | 'lastUpdatedAt'>;

// Pagination and filtering
export interface PaginationOptions {
    page?: number;
    limit?: number;
}

export interface ClaimFilters {
    subject?: string;
    object?: string;
    claim?: string;
    issuer_id?: string;
}

export interface ClaimListResponse {
    claims: Claim[];
    total?: number;
    page?: number;
    limit?: number;
}

// Graph types
export interface GraphNode {
    id: number;
    nodeUri: string;
    name: string;
    entType: EntityType;
    descrip: string;
    image?: string;
    thumbnail?: string;
}

export interface GraphEdge {
    id: number;
    startNode: GraphNode;
    endNode?: GraphNode;
    label: string;
    claim: Claim;
}

export interface Graph {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

// Profile verification
export interface GitHubVerificationParams {
    username: string;
    userId: string;
    name?: string;
    email?: string;
    profileBaseUrl: string;
}

export interface VerificationResult {
    success: boolean;
    message: string;
    platformUri: string;
    profileUrl: string;
    profileSlug: string;
}

// Semantic helpers
export interface FieldGuidance {
    label: string;
    placeholder?: string;
    help: string;
    examples?: string[];
    validation?: ValidationRule[];
}

export interface ValidationRule {
    type: 'required' | 'uri' | 'date' | 'enum' | 'range';
    message: string;
    options?: any;
}

export interface SimplifiedHowKnownOption {
    value: HowKnown;
    label: string;
    requiresSource?: boolean;
}

// Error types
export interface LinkedClaimsError extends Error {
    code: string;
    statusCode?: number;
    details?: any;
}

// Validation
export interface ValidationResult {
    field: string;
    error: string;
    value?: any;
}

// Configuration
export interface LinkedClaimsConfig {
    baseUrl?: string;
    auth?: {
        storage?: 'localStorage' | 'memory' | 'none';
        autoRefresh?: boolean;
    };
    onAuthError?: () => void;
}

// Token management
export interface TokenPayload {
    sub: string;
    email?: string;
    iat: number;
    exp: number;
}
