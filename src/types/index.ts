export interface AnalysisResult {
  score: number;
  flags: string[];
  recommendations: string[];
}

export type AnalysisType = 'profile' | 'image' | 'conversation';

export interface ThreatData {
  id: string;
  type: 'scam' | 'phishing' | 'malware' | 'fraud';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  source: string;
  indicators: string[];
}

export interface BlockchainTransaction {
  hash: string;
  block: number;
  from: string;
  to: string;
  value: string;
  timestamp: Date;
  status: 'confirmed' | 'pending' | 'failed';
}

export interface AIMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface EducationContent {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'interactive' | 'audio';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number; // in minutes
  tags: string[];
  thumbnail?: string;
}
