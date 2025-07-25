// AI Assistant Service with real API integration
import { API_ENDPOINTS, API_KEYS, handleApiError, rateLimiter, MOCK_MODE } from './api';
import type { AIMessage } from '../types';

export interface AIResponse {
  message: string;
  suggestions?: string[];
  analysis?: {
    threatLevel: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    indicators: string[];
  };
}

class AIAssistantService {
  private conversationHistory: AIMessage[] = [];
  
  async sendMessage(message: string): Promise<AIResponse> {
    try {
      // Add user message to history
      const userMessage: AIMessage = {
        id: Date.now().toString(),
        content: message,
        role: 'user',
        timestamp: new Date(),
      };
      this.conversationHistory.push(userMessage);

      // If in mock mode, return simulated response
      if (MOCK_MODE.AI_ASSISTANT) {
        return this.getMockResponse(message);
      }

      // Try OpenAI first, then Gemini as fallback
      let response: AIResponse;
      
      if (API_KEYS.OPENAI && rateLimiter.canMakeRequest('openai', 60, 60000)) {
        response = await this.callOpenAI(message);
      } else if (API_KEYS.GEMINI && rateLimiter.canMakeRequest('gemini', 60, 60000)) {
        response = await this.callGemini(message);
      } else {
        response = this.getMockResponse(message);
      }

      // Add AI response to history
      const aiMessage: AIMessage = {
        id: (Date.now() + 1).toString(),
        content: response.message,
        role: 'assistant',
        timestamp: new Date(),
      };
      this.conversationHistory.push(aiMessage);

      return response;
    } catch (error) {
      console.error('AI Assistant Error:', error);
      return {
        message: `I apologize, but I'm experiencing technical difficulties. ${handleApiError(error)} Please try again or contact support if the issue persists.`,
        suggestions: ['Try rephrasing your question', 'Check our FAQ section', 'Contact support']
      };
    }
  }

  private async callOpenAI(message: string): Promise<AIResponse> {
    const systemPrompt = `You are OSINT Café's AI assistant, specializing in cybersecurity, digital investigation, and online safety. You help users with:

1. Threat analysis and risk assessment
2. Dating safety and romance scam detection
3. Blockchain verification and crypto security
4. Digital identity verification
5. OSINT (Open Source Intelligence) techniques
6. Cybersecurity best practices

Always provide:
- Clear, actionable advice
- Specific threat level assessments when relevant
- Confidence scores for your analysis
- Practical next steps for users

Keep responses concise but informative. Focus on helping users stay safe online.`;

    const response = await fetch(`${API_ENDPOINTS.OPENAI}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.OPENAI}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          ...this.conversationHistory.slice(-10).map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          { role: 'user', content: message }
        ],
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.choices[0]?.message?.content || 'I apologize, but I couldn\'t generate a proper response.';
    
    return {
      message: aiMessage,
      analysis: this.analyzeMessageForThreats(message),
      suggestions: this.generateSuggestions(message)
    };
  }

  private async callGemini(message: string): Promise<AIResponse> {
    const systemPrompt = `You are OSINT Café's cybersecurity AI assistant. Provide expert guidance on digital safety, threat analysis, and online investigation techniques. Keep responses focused and actionable.`;

    const response = await fetch(`${API_ENDPOINTS.GEMINI}/models/gemini-pro:generateContent?key=${API_KEYS.GEMINI}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `${systemPrompt}\n\nUser: ${message}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    const aiMessage = data.candidates?.[0]?.content?.parts?.[0]?.text || 'I apologize, but I couldn\'t generate a proper response.';

    return {
      message: aiMessage,
      analysis: this.analyzeMessageForThreats(message),
      suggestions: this.generateSuggestions(message)
    };
  }

  private getMockResponse(message: string): AIResponse {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('dating') || lowerMessage.includes('romance') || lowerMessage.includes('scam')) {
      return {
        message: `🚨 **Dating Safety Analysis**

Based on your inquiry about dating safety, here are key red flags to watch for:

• **Profile inconsistencies** - Multiple photos that don't match or look professional
• **Too good to be true** - Extremely attractive profiles with minimal information
• **Fast emotional connection** - Professing love very quickly
• **Avoiding video calls** - Always having excuses not to meet or video chat
• **Financial requests** - Any request for money, gifts, or financial information

**Recommended Actions:**
✅ Always verify identity through video calls
✅ Do reverse image searches on profile photos
✅ Check social media presence across platforms
✅ Meet in public places for first dates
✅ Trust your instincts - if something feels off, it probably is

Would you like me to analyze a specific profile or conversation for potential red flags?`,
        analysis: {
          threatLevel: 'medium',
          confidence: 85,
          indicators: ['Dating safety inquiry', 'Potential scam awareness needed']
        },
        suggestions: [
          'Upload a profile photo for reverse image analysis',
          'Share conversation screenshots for analysis',
          'Learn about our blockchain verification tools'
        ]
      };
    }

    if (lowerMessage.includes('blockchain') || lowerMessage.includes('crypto') || lowerMessage.includes('verification')) {
      return {
        message: `⛓️ **Blockchain Verification Insights**

Our blockchain verification system provides:

**Identity Verification:**
• Cryptographic proof of identity authenticity
• Immutable records on distributed ledger
• Real-time verification status updates
• Multi-network support (Ethereum, Bitcoin, Polygon)

**Trust Score Calculation:**
📊 **Factors considered:**
- Historical transaction patterns
- Wallet age and activity
- Cross-platform verification
- Community reputation scores

**Current Network Status:**
✅ Ethereum: Operational (avg. verification time: 2.3 minutes)
✅ Bitcoin: Operational (avg. verification time: 8.7 minutes)
✅ Polygon: Operational (avg. verification time: 0.8 minutes)

**Security Features:**
🔐 End-to-end encryption
🔐 Zero-knowledge proof protocols
🔐 Multi-signature authentication
🔐 Real-time fraud detection

Would you like to initiate a blockchain verification for a specific identity or wallet address?`,
        analysis: {
          threatLevel: 'low',
          confidence: 95,
          indicators: ['Blockchain verification inquiry', 'Educational request']
        },
        suggestions: [
          'Start a new blockchain verification',
          'Check live network status',
          'View recent verification history'
        ]
      };
    }

    if (lowerMessage.includes('threat') || lowerMessage.includes('malware') || lowerMessage.includes('phishing')) {
      return {
        message: `🛡️ **Threat Intelligence Analysis**

**Current Threat Landscape:**
🔴 **High Priority Threats:**
- Sophisticated phishing campaigns targeting crypto wallets
- AI-generated deepfake romance scams
- Supply chain attacks on open-source packages
- Social engineering via fake tech support

**Real-time Indicators:**
📈 Phishing attempts: +23% this week
📈 Romance scams: +18% this month  
📈 Crypto fraud: +31% this quarter
📉 Malware infections: -12% (improved detection)

**Protection Strategies:**
✅ Enable 2FA on all critical accounts
✅ Use hardware security keys when possible
✅ Verify sender identity before clicking links
✅ Keep software and systems updated
✅ Regular security awareness training

**Immediate Actions:**
🔍 Scan suspicious URLs before clicking
🔍 Verify email senders through secondary channels
🔍 Monitor financial accounts for unauthorized activity
🔍 Report suspicious activities to relevant authorities

Would you like me to analyze a specific URL, email, or file for potential threats?`,
        analysis: {
          threatLevel: 'high',
          confidence: 92,
          indicators: ['Threat intelligence inquiry', 'Active threat awareness needed']
        },
        suggestions: [
          'Submit a URL for threat analysis',
          'Upload a suspicious file for scanning',
          'Check the latest threat intelligence feeds'
        ]
      };
    }

    // Default response for general inquiries
    return {
      message: `👋 **Welcome to OSINT Café AI Assistant!**

I'm here to help you with cybersecurity and digital safety. I can assist with:

🔍 **Investigation & Analysis:**
- Dating profile verification
- Social media background checks
- Threat intelligence analysis
- Digital forensics guidance

⛓️ **Blockchain & Crypto:**
- Identity verification
- Wallet security analysis
- Transaction monitoring
- Smart contract auditing

🛡️ **Security & Safety:**
- Phishing detection
- Malware analysis
- Privacy protection
- OSINT techniques

📚 **Education & Training:**
- Cybersecurity best practices
- Digital literacy
- Threat awareness
- Safe online dating

What specific area would you like to explore? Feel free to ask about any suspicious activities, profiles, or security concerns you might have.`,
      analysis: {
        threatLevel: 'low',
        confidence: 100,
        indicators: ['General inquiry', 'Information seeking']
      },
      suggestions: [
        'Ask about dating safety verification',
        'Learn about blockchain verification',
        'Explore threat intelligence features',
        'Get cybersecurity education resources'
      ]
    };
  }

  private analyzeMessageForThreats(userMessage: string): AIResponse['analysis'] {
    const lowerMessage = userMessage.toLowerCase();
    const threatKeywords = ['scam', 'fraud', 'suspicious', 'help', 'emergency', 'hack', 'steal', 'money'];
    const matches = threatKeywords.filter(keyword => lowerMessage.includes(keyword));
    
    let threatLevel: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let confidence = 70;
    
    if (matches.length >= 3) {
      threatLevel = 'high';
      confidence = 90;
    } else if (matches.length >= 2) {
      threatLevel = 'medium';
      confidence = 80;
    }
    
    return {
      threatLevel,
      confidence,
      indicators: matches.map(match => `Keyword detected: ${match}`)
    };
  }

  private generateSuggestions(message: string): string[] {
    const lowerMessage = message.toLowerCase();
    const suggestions: string[] = [];
    
    if (lowerMessage.includes('dating') || lowerMessage.includes('profile')) {
      suggestions.push('Upload profile image for reverse search');
      suggestions.push('Run dating safety verification');
    }
    
    if (lowerMessage.includes('email') || lowerMessage.includes('phone')) {
      suggestions.push('Verify contact information');
      suggestions.push('Check social media presence');
    }
    
    if (lowerMessage.includes('url') || lowerMessage.includes('link')) {
      suggestions.push('Analyze URL for threats');
      suggestions.push('Check domain reputation');
    }
    
    if (suggestions.length === 0) {
      suggestions.push('Ask about specific security concerns');
      suggestions.push('Explore our verification tools');
      suggestions.push('Learn about threat prevention');
    }
    
    return suggestions.slice(0, 3);
  }

  getConversationHistory(): AIMessage[] {
    return this.conversationHistory;
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }
}

export const aiAssistantService = new AIAssistantService();
