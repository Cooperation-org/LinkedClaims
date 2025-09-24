import {
    HowKnown,
    EntityType,
    SimplifiedHowKnownOption,
    FieldGuidance,
    ValidationRule
} from './types';

export class SemanticHelpers {
    /**
     * Get simplified howKnown options for UI
     * Reduces 11 backend options to 3-4 user-friendly choices
     */
    getSimplifiedHowKnown(): SimplifiedHowKnownOption[] {
        return [
            {
                value: HowKnown.FIRST_HAND,
                label: 'I witnessed this directly'
            },
            {
                value: HowKnown.WEB_DOCUMENT,
                label: 'I found this online',
                requiresSource: true
            },
            {
                value: HowKnown.SECOND_HAND,
                label: 'Someone told me about this'
            },
            {
                value: HowKnown.VERIFIED_LOGIN,
                label: 'Verified through login'
            }
        ];
    }
    
    /**
     * Map user-friendly values to HowKnown enum
     */
    mapHowKnown(userValue: string, context?: { claimType?: string }): HowKnown {
        const normalizedValue = userValue.toLowerCase();
        
        // Direct mappings
        const mappings: Record<string, HowKnown> = {
            'witnessed': HowKnown.FIRST_HAND,
            'saw it': HowKnown.FIRST_HAND,
            'direct': HowKnown.FIRST_HAND,
            'online': HowKnown.WEB_DOCUMENT,
            'website': HowKnown.WEB_DOCUMENT,
            'article': HowKnown.WEB_DOCUMENT,
            'told': HowKnown.SECOND_HAND,
            'heard': HowKnown.SECOND_HAND,
            'verified': HowKnown.VERIFIED_LOGIN,
            'logged in': HowKnown.VERIFIED_LOGIN
        };
        
        for (const [key, value] of Object.entries(mappings)) {
            if (normalizedValue.includes(key)) {
                return value;
            }
        }
        
        return HowKnown.OTHER;
    }
    
    /**
     * Get generic field guidance - apps should customize for their use case
     */
    getFieldGuidance(field: string): FieldGuidance {
        const guides: Record<string, FieldGuidance> = {
            subject: {
                label: 'What is this claim about?',
                placeholder: 'https://example.org/entity/123',
                help: 'Enter the URL of the entity (person, project, organization) this claim is about',
                examples: [
                    'https://github.com/username',
                    'https://example.org/project/clean-water',
                    'did:example:123',
                    'https://linkedin.com/in/username'
                ],
                validation: [
                    { type: 'required', message: 'Subject is required' },
                    { type: 'uri', message: 'Subject must be a valid URI' }
                ]
            },
            
            claim: {
                label: 'Type of claim',
                placeholder: 'impact',
                help: 'The type or verb of your claim',
                examples: ['impact', 'endorsement', 'same_as', 'certification'],
                validation: [
                    { type: 'required', message: 'Claim type is required' }
                ]
            },
            
            statement: {
                label: 'Claim statement',
                placeholder: 'Describe the claim in detail',
                help: 'A clear, natural language description of what you\'re claiming',
                validation: [
                    { type: 'required', message: 'Statement is required' }
                ]
            },
            
            object: {
                label: 'Related entity (optional)',
                placeholder: 'https://example.org/entity/456',
                help: 'If this claim relates two entities, enter the URL of the second entity',
                examples: [
                    'For same_as: URL of equivalent entity',
                    'For impact: URL of what was impacted'
                ],
                validation: [
                    { type: 'uri', message: 'Object must be a valid URI' }
                ]
            },
            
            effectiveDate: {
                label: 'When did this happen?',
                placeholder: '2024-01-15',
                help: 'The date when the claimed event or situation occurred (not today\'s date)',
                validation: [
                    { type: 'date', message: 'Must be a valid date' }
                ]
            },
            
            sourceURI: {
                label: 'Source document',
                placeholder: 'https://example.com/article',
                help: 'URL of the document or source where you found this information',
                validation: [
                    { type: 'uri', message: 'Source must be a valid URL' }
                ]
            },
            
            howKnown: {
                label: 'How do you know this?',
                help: 'Select how you learned about this information'
            },
            
            confidence: {
                label: 'Confidence level',
                placeholder: '0.95',
                help: 'Your confidence in this claim (0 to 1, where 1 is complete certainty)',
                validation: [
                    { type: 'range', message: 'Must be between 0 and 1', options: { min: 0, max: 1 } }
                ]
            },
            
            score: {
                label: 'Rating score',
                placeholder: '0.8',
                help: 'Normalized score from -1 (worst) to 1 (best)',
                validation: [
                    { type: 'range', message: 'Must be between -1 and 1', options: { min: -1, max: 1 } }
                ]
            },
            
            stars: {
                label: 'Star rating',
                placeholder: '5',
                help: 'Traditional star rating from 1 to 5',
                validation: [
                    { type: 'range', message: 'Must be between 1 and 5', options: { min: 1, max: 5 } }
                ]
            }
        };
        
        return guides[field] || {
            label: field,
            help: `Enter ${field}`,
            validation: []
        };
    }
    
    /**
     * Build a valid URI from components
     */
    buildURI(type: EntityType | string, identifier: string, domain?: string): string {
        // If already a valid URI, return as-is
        if (this.isValidURI(identifier)) {
            return identifier;
        }
        
        // Build based on type
        const baseUrl = domain || 'https://example.org';
        
        const typeMap: Record<string, string> = {
            [EntityType.PERSON]: 'person',
            [EntityType.ORGANIZATION]: 'org',
            [EntityType.DOCUMENT]: 'doc',
            [EntityType.PROJECT]: 'project',
            [EntityType.IMPACT]: 'impact',
            [EntityType.EVENT]: 'event',
            [EntityType.PRODUCT]: 'product'
        };
        
        const path = typeMap[type] || type.toLowerCase();
        return `${baseUrl}/${path}/${identifier}`;
    }
    
    /**
     * Parse a URI into components
     */
    parseURI(uri: string): {
        scheme?: string;
        domain?: string;
        path?: string;
        type?: string;
        identifier?: string;
    } {
        try {
            if (uri.startsWith('did:')) {
                const parts = uri.split(':');
                return {
                    scheme: 'did',
                    domain: parts[1],
                    identifier: parts.slice(2).join(':')
                };
            }
            
            const url = new URL(uri);
            const pathParts = url.pathname.split('/').filter(p => p);
            
            return {
                scheme: url.protocol.replace(':', ''),
                domain: url.hostname,
                path: url.pathname,
                type: pathParts[0],
                identifier: pathParts[1]
            };
        } catch {
            return { identifier: uri };
        }
    }
    
    /**
     * Validate if a string is a valid URI
     */
    isValidURI(uri: string): boolean {
        try {
            new URL(uri);
            return true;
        } catch {
            // Also accept URNs and DIDs
            return /^(urn:|did:)/.test(uri);
        }
    }
    
    /**
     * Get source requirements based on howKnown
     */
    getSourceRequirements(howKnown: HowKnown): {
        required: boolean;
        fieldName: string;
        help: string;
    } {
        switch (howKnown) {
            case HowKnown.WEB_DOCUMENT:
                return {
                    required: true,
                    fieldName: 'sourceURI',
                    help: 'Please provide the URL of the web page where you found this information'
                };
            
            case HowKnown.SECOND_HAND:
                return {
                    required: false,
                    fieldName: 'author',
                    help: 'You can optionally provide the URI of the person who told you'
                };
            
            case HowKnown.SIGNED_DOCUMENT:
            case HowKnown.PHYSICAL_DOCUMENT:
                return {
                    required: false,
                    fieldName: 'sourceURI',
                    help: 'If available online, provide the document URL'
                };
            
            default:
                return {
                    required: false,
                    fieldName: 'sourceURI',
                    help: 'You can optionally provide a source URL'
                };
        }
    }
    
    /**
     * Convert between stars and score
     */
    starsToScore(stars: number): number {
        // Convert 1-5 stars to -1 to 1 score
        return (stars - 3) / 2;
    }
    
    scoreToStars(score: number): number {
        // Convert -1 to 1 score to 1-5 stars
        return Math.round((score + 1) * 2 + 1);
    }
}
