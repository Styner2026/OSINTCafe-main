// Bitcoin Wallet Service - Integration with ICP Rust Canister
// This service connects your React frontend to your Rust Bitcoin wallet canister

import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';

export interface BitcoinNetwork {
    regtest: null;
    testnet: null;
    mainnet: null;
}

export interface AddressResult {
    Ok?: string;
    Err?: string;
}

export interface BalanceResult {
    Ok?: bigint;
    Err?: string;
}

export interface SendResult {
    Ok?: string;
    Err?: string;
}

export interface BitcoinActor {
    get_address: (principal?: [] | [Principal]) => Promise<AddressResult>;
    get_balance: (principal?: [] | [Principal]) => Promise<BalanceResult>;
    send_btc: (destination_address: string, amount_in_satoshi: bigint) => Promise<SendResult>;
}

// Candid interface for the Bitcoin canister
const idlFactory = ({ IDL }: any) => {
    const AddressResult = IDL.Variant({ 'Ok': IDL.Text, 'Err': IDL.Text });
    const BalanceResult = IDL.Variant({ 'Ok': IDL.Nat64, 'Err': IDL.Text });
    const SendResult = IDL.Variant({ 'Ok': IDL.Text, 'Err': IDL.Text });
    
    return IDL.Service({
        'get_address': IDL.Func([IDL.Opt(IDL.Principal)], [AddressResult], []),
        'get_balance': IDL.Func([IDL.Opt(IDL.Principal)], [BalanceResult], []),
        'send_btc': IDL.Func([IDL.Text, IDL.Nat64], [SendResult], []),
    });
};

class BitcoinWalletService {
    private actor: BitcoinActor | null = null;
    private agent: HttpAgent | null = null;
    
    // Bitcoin canister ID (deployed on IC)
    private readonly CANISTER_ID = 'uyd43-cqaaa-aaaac-a3e5q-cai';
    
    async initActor() {
        if (this.actor) return this.actor;
        
        try {
            // Create HTTP agent for IC communication
            this.agent = new HttpAgent({
                host: 'https://ic0.app'
            });
            
            // Create actor for the Bitcoin canister
            this.actor = Actor.createActor(idlFactory, {
                agent: this.agent,
                canisterId: this.CANISTER_ID
            });
            
            console.log('✅ Connected to live Bitcoin canister:', this.CANISTER_ID);
            return this.actor;
        } catch (error) {
            console.error('❌ Failed to initialize Bitcoin actor:', error);
            throw new Error('Bitcoin wallet service unavailable. Please try again later.');
        }
    }
    
    async getAddress(owner?: string): Promise<string> {
        const actor = await this.initActor();
        
        // Convert string owner to Principal if provided
        let principal: [] | [Principal] | undefined = undefined;
        if (owner) {
            try {
                principal = [Principal.fromText(owner)];
            } catch {
                // If conversion fails, use undefined (caller's principal will be used)
                principal = undefined;
            }
        }
        
        const result = await actor.get_address(principal);
        
        if (result.Err) {
            throw new Error(`Failed to get address: ${result.Err}`);
        }
        
        return result.Ok!;
    }
    
    async getBalance(owner?: string): Promise<number> {
        const actor = await this.initActor();
        
        // Convert string owner to Principal if provided
        let principal: [] | [Principal] | undefined = undefined;
        if (owner) {
            try {
                principal = [Principal.fromText(owner)];
            } catch {
                // If conversion fails, use undefined (caller's principal will be used)
                principal = undefined;
            }
        }
        
        const result = await actor.get_balance(principal);
        
        if (result.Err) {
            throw new Error(`Failed to get balance: ${result.Err}`);
        }
        
        return Number(result.Ok!);
    }
    
    async sendBitcoin(destinationAddress: string, amountInSatoshi: number): Promise<string> {
        const actor = await this.initActor();
        const result = await actor.send_btc(destinationAddress, BigInt(amountInSatoshi));
        
        if (result.Err) {
            throw new Error(`Failed to send Bitcoin: ${result.Err}`);
        }
        
        return result.Ok!;
    }
    
    // Utility functions
    satoshisToBtc(satoshis: number): number {
        return satoshis / 100000000;
    }
    
    btcToSatoshis(btc: number): number {
        return Math.floor(btc * 100000000);
    }
    
    validateBitcoinAddress(address: string): boolean {
        // Basic Bitcoin address validation
        // You might want to use a more robust validation library
        const patterns = [
            /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/, // Legacy P2PKH/P2SH
            /^bc1[a-z0-9]{39,59}$/, // Bech32 (including Taproot)
            /^tb1[a-z0-9]{39,59}$/, // Testnet Bech32
        ];
        
        return patterns.some(pattern => pattern.test(address));
    }
}

// Export singleton instance
export const bitcoinWalletService = new BitcoinWalletService();

// Types for React components
export interface BitcoinWalletData {
    address: string;
    balance: number; // satoshis
    balance_btc: number; // BTC
    network: 'mainnet' | 'testnet' | 'regtest';
    loading: boolean;
}

export interface SendBtcFormData {
    destination: string;
    amount: string;
    loading: boolean;
}
