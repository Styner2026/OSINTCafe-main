import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

// Types matching the Rust backend
export interface ImageData {
    id: bigint;
    name: string;
    content_type: string;
    data: Uint8Array;
}

export interface ImageInfo {
    id: bigint;
    name: string;
    content_type: string;
}

export interface ThreatIntelImage {
    id: string;
    name: string;
    url: string;
    contentType: string;
    category: string;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    timestamp: Date;
    size: number;
}

// IDL interface for the photo gallery canister
const idlFactory = ({ IDL }: any) => {
    const ImageId = IDL.Nat64;
    
    const ImageInfo = IDL.Record({
        id: ImageId,
        name: IDL.Text,
        content_type: IDL.Text,
    });

    const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
    
    const HttpRequest = IDL.Record({
        method: IDL.Text,
        url: IDL.Text,
        headers: IDL.Vec(HeaderField),
        body: IDL.Vec(IDL.Nat8),
    });

    const HttpResponse = IDL.Record({
        status_code: IDL.Nat16,
        headers: IDL.Vec(HeaderField),
        body: IDL.Vec(IDL.Nat8),
    });

    return IDL.Service({
        upload_image: IDL.Func([IDL.Text, IDL.Text, IDL.Vec(IDL.Nat8)], [ImageId], ['update']),
        list_images: IDL.Func([], [IDL.Vec(ImageInfo)], ['query']),
        http_request: IDL.Func([HttpRequest], [HttpResponse], ['query']),
    });
};

class ICPPhotoGalleryService {
    private actor: any = null;
    private authClient: AuthClient | null = null;
    private agent: HttpAgent | null = null;
    private canisterId: string;

    constructor() {
        // Use environment variable or default canister ID
        this.canisterId = import.meta.env.VITE_PHOTO_GALLERY_CANISTER_ID || 'rrkah-fqaaa-aaaaa-aaaaq-cai';
    }

    async initialize(): Promise<boolean> {
        try {
            console.log('📸 Initializing ICP Photo Gallery Service...');
            
            this.authClient = await AuthClient.create();
            
            // Create agent
            this.agent = new HttpAgent({
                host: import.meta.env.VITE_IC_HOST || 'https://ic0.app',
            });

            // In development, fetch root key
            if (import.meta.env.NODE_ENV === 'development') {
                await this.agent.fetchRootKey();
            }

            // Create actor
            this.actor = Actor.createActor(idlFactory, {
                agent: this.agent,
                canisterId: this.canisterId,
            });

            console.log('✅ ICP Photo Gallery Service initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize ICP Photo Gallery Service:', error);
            return false;
        }
    }

    async authenticate(): Promise<boolean> {
        try {
            if (!this.authClient) {
                await this.initialize();
            }

            const isAuthenticated = await this.authClient!.isAuthenticated();
            if (isAuthenticated) {
                const identity = this.authClient!.getIdentity();
                this.agent!.replaceIdentity(identity);
                return true;
            }

            return new Promise((resolve) => {
                this.authClient!.login({
                    identityProvider: import.meta.env.VITE_II_URL || 'https://identity.ic0.app',
                    onSuccess: () => {
                        const identity = this.authClient!.getIdentity();
                        this.agent!.replaceIdentity(identity);
                        console.log('✅ Successfully authenticated with Internet Identity');
                        resolve(true);
                    },
                    onError: (error) => {
                        console.error('❌ Authentication failed:', error);
                        resolve(false);
                    },
                });
            });
        } catch (error) {
            console.error('❌ Authentication error:', error);
            return false;
        }
    }

    async uploadThreatIntelImage(
        file: File,
        metadata: {
            category: string;
            threatLevel: 'low' | 'medium' | 'high' | 'critical';
            description: string;
        }
    ): Promise<{ success: boolean; imageId?: string; url?: string; error?: string }> {
        try {
            if (!this.actor) {
                const initialized = await this.initialize();
                if (!initialized) {
                    throw new Error('Failed to initialize service');
                }
            }

            const authenticated = await this.authenticate();
            if (!authenticated) {
                throw new Error('Authentication required');
            }

            // Convert file to Uint8Array
            const arrayBuffer = await file.arrayBuffer();
            const uint8Array = new Uint8Array(arrayBuffer);

            // Create enhanced filename with metadata
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const enhancedName = `threat-intel-${metadata.category}-${metadata.threatLevel}-${timestamp}-${file.name}`;

            // Upload to ICP
            const imageId = await this.actor.upload_image(
                enhancedName,
                file.type,
                Array.from(uint8Array)
            );

            // Generate URL for accessing the image
            const imageUrl = `https://${this.canisterId}.ic0.app/image/${imageId}`;

            console.log(`✅ Uploaded threat intel image with ID: ${imageId}`);
            console.log(`🔗 Image URL: ${imageUrl}`);

            return {
                success: true,
                imageId: imageId.toString(),
                url: imageUrl
            };
        } catch (error) {
            console.error('❌ Failed to upload threat intel image:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async getThreatIntelImages(): Promise<ThreatIntelImage[]> {
        try {
            if (!this.actor) {
                await this.initialize();
            }

            const imageInfos = await this.actor.list_images();
            const threatImages: ThreatIntelImage[] = [];

            for (const info of imageInfos) {
                // Parse metadata from filename
                const nameParts = info.name.split('-');
                let category = 'General';
                let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'medium';
                let description = 'Threat intelligence image';

                if (nameParts.length >= 4 && nameParts[0] === 'threat' && nameParts[1] === 'intel') {
                    category = nameParts[2] || 'General';
                    threatLevel = (nameParts[3] as any) || 'medium';
                    description = `${category} threat intelligence - ${threatLevel} level`;
                }

                const imageUrl = `https://${this.canisterId}.ic0.app/image/${info.id}`;

                threatImages.push({
                    id: info.id.toString(),
                    name: info.name,
                    url: imageUrl,
                    contentType: info.content_type,
                    category: category,
                    threatLevel: threatLevel,
                    description: description,
                    timestamp: new Date(), // Would need to store this in metadata for real app
                    size: 0 // Would need to store this in metadata for real app
                });
            }

            return threatImages.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        } catch (error) {
            console.error('❌ Failed to get threat intel images:', error);
            return [];
        }
    }

    async getImageUrl(imageId: string): Promise<string> {
        return `https://${this.canisterId}.ic0.app/image/${imageId}`;
    }

    async deleteImage(_imageId: string): Promise<boolean> {
        try {
            // Note: The current Rust backend doesn't have a delete function
            // This would need to be implemented in the backend for production use
            console.warn('⚠️ Delete functionality not implemented in current backend');
            return false;
        } catch (error) {
            console.error('❌ Failed to delete image:', error);
            return false;
        }
    }

    // Utility function to validate image files
    validateImageFile(file: File): { valid: boolean; error?: string } {
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (file.size > maxSize) {
            return { valid: false, error: 'File size must be less than 10MB' };
        }

        if (!allowedTypes.includes(file.type)) {
            return { valid: false, error: 'Only JPEG, PNG, GIF, and WebP images are allowed' };
        }

        return { valid: true };
    }

    // Generate thumbnail URL (would need backend support for real implementation)
    getThumbnailUrl(imageId: string): string {
        return `https://${this.canisterId}.ic0.app/image/${imageId}`;
    }
}

export const icpPhotoGalleryService = new ICPPhotoGalleryService();
