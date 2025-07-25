// Core API configuration and utilities
import axios from 'axios';

// Base API configuration
export const api = axios.create({
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API endpoints configuration
export const API_ENDPOINTS = {
  // AI Services
  OPENAI: 'https://api.openai.com/v1',
  GEMINI: 'https://generativelanguage.googleapis.com/v1beta',
  
  // Threat Intelligence
  VIRUSTOTAL: 'https://www.virustotal.com/api/v3',
  ABUSEIPDB: 'https://api.abuseipdb.com/api/v2',
  URLVOID: 'https://api.urlvoid.com/v1',
  
  // Blockchain Data
  ETHERSCAN: 'https://api.etherscan.io/api',
  COINGECKO: 'https://api.coingecko.com/api/v3',
  BLOCKCHAIN_INFO: 'https://blockchain.info/api',
  
  // Image Analysis
  GOOGLE_VISION: 'https://vision.googleapis.com/v1',
  REVERSE_IMAGE: 'https://api.tineye.com/rest',
  
  // Social Media Analysis
  SOCIAL_ANALYZER: 'https://api.social-analyzer.com/v1',
  SHERLOCK: 'https://api.sherlock-project.com/v1',
  
  // Verification Services
  HUNTER_IO: 'https://api.hunter.io/v2',
  CLEARBIT: 'https://person.clearbit.com/v2',
  PIPL: 'https://api.pipl.com/search/v5',
};

// Environment variables for API keys (to be set in .env)
export const API_KEYS = {
  OPENAI: import.meta.env.VITE_OPENAI_API_KEY,
  GEMINI: import.meta.env.VITE_GOOGLE_API_KEY || import.meta.env.VITE_GEMINI_API_KEY, // Support both naming conventions
  VIRUSTOTAL: import.meta.env.VITE_VIRUSTOTAL_API_KEY,
  ABUSEIPDB: import.meta.env.VITE_ABUSEIPDB_API_KEY,
  ETHERSCAN: import.meta.env.VITE_ETHERSCAN_API_KEY,
  COINGECKO: import.meta.env.VITE_COINGECKO_API_KEY,
  GOOGLE_VISION: import.meta.env.VITE_GOOGLE_VISION_API_KEY,
  HUNTER_IO: import.meta.env.VITE_HUNTER_IO_API_KEY,
  CLEARBIT: import.meta.env.VITE_CLEARBIT_API_KEY,
};

// Generic API error handler
export const handleApiError = (error: unknown) => {
  console.error('API Error:', error);
  
  // Type guard for axios errors
  if (typeof error === 'object' && error !== null && 'response' in error) {
    const axiosError = error as { response: { status: number; data?: { message?: string } }; message?: string };
    // Server responded with error status
    const status = axiosError.response.status;
    const message = axiosError.response.data?.message || axiosError.message;
    
    switch (status) {
      case 401:
        return 'Authentication failed. Please check your API keys.';
      case 403:
        return 'Access forbidden. You may have exceeded rate limits.';
      case 404:
        return 'Resource not found.';
      case 429:
        return 'Rate limit exceeded. Please try again later.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return message || 'An unexpected error occurred.';
    }
  } else if (typeof error === 'object' && error !== null && 'request' in error) {
    // Request was made but no response received
    return 'Network error. Please check your connection.';
  } else {
    // Something else happened
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
    return errorMessage;
  }
};

// Rate limiting utility
class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  
  canMakeRequest(endpoint: string, maxRequests: number, timeWindow: number): boolean {
    const now = Date.now();
    const requests = this.requests.get(endpoint) || [];
    
    // Remove old requests outside the time window
    const validRequests = requests.filter(time => now - time < timeWindow);
    
    if (validRequests.length >= maxRequests) {
      return false;
    }
    
    validRequests.push(now);
    this.requests.set(endpoint, validRequests);
    return true;
  }
}

export const rateLimiter = new RateLimiter();

// Utility function to check if API key exists
export const hasApiKey = (service: keyof typeof API_KEYS): boolean => {
  return Boolean(API_KEYS[service]);
};

// Mock data fallback when APIs are not available
export const MOCK_MODE = {
  AI_ASSISTANT: !hasApiKey('OPENAI') && !hasApiKey('GEMINI'),
  THREAT_INTEL: !hasApiKey('VIRUSTOTAL') && !hasApiKey('ABUSEIPDB'),
  BLOCKCHAIN: !hasApiKey('ETHERSCAN') && !hasApiKey('COINGECKO'),
  IMAGE_ANALYSIS: !hasApiKey('GOOGLE_VISION'),
  VERIFICATION: !hasApiKey('HUNTER_IO') && !hasApiKey('CLEARBIT'),
};
