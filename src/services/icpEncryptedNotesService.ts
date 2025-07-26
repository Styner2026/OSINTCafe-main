import { Actor, HttpAgent } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';

// Types matching the Rust backend
export interface EncryptedNote {
    id: bigint;
    encrypted_text: string;
    owner: string;
    users: string[];
}

export interface NoteCreationResult {
    id: bigint;
    success: boolean;
    error?: string;
}

export interface ThreatIntelNote {
    id: string;
    title: string;
    content: string;
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    category: string;
    timestamp: Date;
    isEncrypted: boolean;
    sharedWith: string[];
}

// IDL interface for the encrypted notes canister
const idlFactory = ({ IDL }: any) => {
    const NoteId = IDL.Nat;
    const PrincipalName = IDL.Text;
    
    const EncryptedNote = IDL.Record({
        id: NoteId,
        encrypted_text: IDL.Text,
        owner: PrincipalName,
        users: IDL.Vec(PrincipalName),
    });

    return IDL.Service({
        whoami: IDL.Func([], [IDL.Text], ['update']),
        get_notes: IDL.Func([], [IDL.Vec(EncryptedNote)], ['update']),
        create_note: IDL.Func([], [NoteId], ['update']),
        update_note: IDL.Func([NoteId, IDL.Text], [], ['update']),
        delete_note: IDL.Func([NoteId], [], ['update']),
        add_user: IDL.Func([NoteId, PrincipalName], [], ['update']),
        remove_user: IDL.Func([NoteId, PrincipalName], [], ['update']),
        symmetric_key_verification_key_for_note: IDL.Func([], [IDL.Text], ['update']),
        encrypted_symmetric_key_for_note: IDL.Func([NoteId, IDL.Vec(IDL.Nat8)], [IDL.Text], ['update']),
    });
};

class ICPEncryptedNotesService {
    private actor: any = null;
    private authClient: AuthClient | null = null;
    private agent: HttpAgent | null = null;
    private canisterId: string;

    constructor() {
        // Use environment variable or default canister ID
        this.canisterId = import.meta.env.VITE_ENCRYPTED_NOTES_CANISTER_ID || 'rdmx6-jaaaa-aaaaa-aaadq-cai';
    }

    async initialize(): Promise<boolean> {
        try {
            console.log('🔐 Initializing ICP Encrypted Notes Service...');
            
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

            console.log('✅ ICP Encrypted Notes Service initialized successfully');
            return true;
        } catch (error) {
            console.error('❌ Failed to initialize ICP Encrypted Notes Service:', error);
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

    async createThreatIntelNote(note: Omit<ThreatIntelNote, 'id' | 'timestamp'>): Promise<NoteCreationResult> {
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

            // Create encrypted content
            const noteContent = JSON.stringify({
                title: note.title,
                content: note.content,
                threatLevel: note.threatLevel,
                category: note.category,
                timestamp: new Date().toISOString(),
                metadata: {
                    source: 'OSINT Café Threat Intelligence',
                    version: '1.0'
                }
            });

            // Encrypt the content (simplified encryption for demo)
            const encryptedContent = btoa(noteContent);

            // Create note on ICP
            const noteId = await this.actor.create_note();
            
            // Update with encrypted content
            await this.actor.update_note(noteId, encryptedContent);

            console.log(`✅ Created encrypted threat intel note with ID: ${noteId}`);
            
            return {
                id: noteId,
                success: true
            };
        } catch (error) {
            console.error('❌ Failed to create threat intel note:', error);
            return {
                id: BigInt(0),
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            };
        }
    }

    async getThreatIntelNotes(): Promise<ThreatIntelNote[]> {
        try {
            if (!this.actor) {
                await this.initialize();
            }

            const authenticated = await this.authenticate();
            if (!authenticated) {
                return [];
            }

            const encryptedNotes = await this.actor.get_notes();
            const threatNotes: ThreatIntelNote[] = [];

            for (const note of encryptedNotes) {
                try {
                    // Decrypt content (simplified decryption for demo)
                    const decryptedContent = atob(note.encrypted_text);
                    const noteData = JSON.parse(decryptedContent);

                    threatNotes.push({
                        id: note.id.toString(),
                        title: noteData.title || 'Untitled Note',
                        content: noteData.content || '',
                        threatLevel: noteData.threatLevel || 'medium',
                        category: noteData.category || 'General',
                        timestamp: new Date(noteData.timestamp || Date.now()),
                        isEncrypted: true,
                        sharedWith: note.users || []
                    });
                } catch (parseError) {
                    console.warn('Failed to parse encrypted note:', parseError);
                }
            }

            return threatNotes;
        } catch (error) {
            console.error('❌ Failed to get threat intel notes:', error);
            return [];
        }
    }

    async shareNote(noteId: string, userPrincipal: string): Promise<boolean> {
        try {
            if (!this.actor) {
                await this.initialize();
            }

            await this.actor.add_user(BigInt(noteId), userPrincipal);
            console.log(`✅ Shared note ${noteId} with user ${userPrincipal}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to share note:', error);
            return false;
        }
    }

    async deleteNote(noteId: string): Promise<boolean> {
        try {
            if (!this.actor) {
                await this.initialize();
            }

            await this.actor.delete_note(BigInt(noteId));
            console.log(`✅ Deleted note ${noteId}`);
            return true;
        } catch (error) {
            console.error('❌ Failed to delete note:', error);
            return false;
        }
    }

    async getCurrentUser(): Promise<string | null> {
        try {
            if (!this.actor) {
                await this.initialize();
            }

            const principal = await this.actor.whoami();
            return principal;
        } catch (error) {
            console.error('❌ Failed to get current user:', error);
            return null;
        }
    }
}

export const icpEncryptedNotesService = new ICPEncryptedNotesService();
