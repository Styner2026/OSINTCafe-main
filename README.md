# 🕵️ OSINT Café - Advanced Cybersecurity Investigation Platform

Welcome to OSINT Café, your comprehensive toolkit for digital investigation, threat analysis, and online safety. This platform combines cutting-edge AI technology with real-world cybersecurity APIs to provide professional-grade investigation capabilities.

## 🚀 Quick Start

### Option 1: Run with Mock Data (No Setup Required)
```bash
npm install
npm run dev
```
The platform will work immediately with simulated data for all features.

### Option 2: Full Setup with Real APIs
```bash
./setup.sh
```
Follow the interactive setup guide to configure API keys for production use.

## ✨ Features

### 🤖 AI Assistant Hub
- **Real AI Integration**: Powered by OpenAI GPT-4 or Google Gemini
- **Threat Analysis**: Automatic risk assessment and confidence scoring
- **Expert Guidance**: Cybersecurity best practices and investigation techniques
- **Interactive Chat**: Natural language queries with contextual responses

### 🛡️ Dating Safety Verification
- **Profile Analysis**: Reverse image search and authenticity verification
- **Conversation Analysis**: Scam detection and manipulation tactic identification
- **Image Verification**: Stock photo detection and face analysis
- **Contact Verification**: Email and phone number validation
- **Social Media Cross-Reference**: Multi-platform presence verification

### 🔍 Threat Intelligence Center
- **URL Analysis**: Malware and phishing detection via VirusTotal
- **IP Reputation**: Threat scoring and geolocation via AbuseIPDB
- **Email Security**: Disposable email detection and domain analysis
- **File Scanning**: Malware detection with detailed threat reports
- **Live Threat Feeds**: Real-time cybersecurity intelligence

### ⛓️ Blockchain Verification Hub
- **Multi-Network Support**: Ethereum, Bitcoin, Polygon verification
- **Identity Verification**: Cryptographic proof of identity
- **Wallet Analysis**: Transaction history and risk assessment
- **Live Market Data**: Real-time cryptocurrency prices and network stats
- **Trust Scoring**: Blockchain-based reputation system

### 📊 Security Dashboard
- **Real-Time Monitoring**: Live threat statistics and trends
- **Interactive Analytics**: Threat categorization and geographic data
- **Performance Metrics**: Platform usage and security coverage
- **Custom Filters**: Time-based and category-specific analysis

## 🔧 API Integrations

### AI Services
- **OpenAI GPT-4**: Advanced natural language processing
- **Google Gemini**: Alternative AI backend with free tier

### Threat Intelligence
- **VirusTotal**: URL/file malware scanning (1000 requests/day free)
- **AbuseIPDB**: IP reputation and threat analysis (1000 requests/day free)

### Blockchain APIs
- **Etherscan**: Ethereum network data (5 calls/second free)
- **CoinGecko**: Cryptocurrency market data (50 calls/minute free)

### Image Analysis
- **Google Vision API**: Face detection and image analysis (1000 requests/month free)

### Verification Services
- **Hunter.io**: Email verification (25 requests/month free)
- **Clearbit**: Contact information enrichment

## 📋 Requirements

- **Node.js**: Version 18 or higher
- **npm**: Package manager
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd OSINTCafe-main
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API keys (optional)**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your API keys
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:5173
   ```

## 🔐 API Key Setup

### Free Tier API Keys (Recommended for Getting Started)

1. **OpenAI** (AI Chat)
   - Visit: https://platform.openai.com/api-keys
   - Get $5 free credit for new accounts
   - Add to `.env.local`: `VITE_OPENAI_API_KEY=your_key_here`

2. **VirusTotal** (Threat Analysis)
   - Visit: https://www.virustotal.com/gui/join-us
   - 1000 requests/day free
   - Add to `.env.local`: `VITE_VIRUSTOTAL_API_KEY=your_key_here`

3. **Etherscan** (Blockchain Data)
   - Visit: https://etherscan.io/register
   - 5 calls/second free tier
   - Add to `.env.local`: `VITE_ETHERSCAN_API_KEY=your_key_here`

### Complete API Configuration

See `.env.example` for all available API integrations and setup instructions.

## 🎯 Usage Examples

### Investigating a Suspicious Profile
1. Go to **Dating Safety** page
2. Upload profile images for reverse search
3. Enter profile text for linguistic analysis
4. Review trust score and red flags
5. Get actionable safety recommendations

### Analyzing a Suspicious URL
1. Navigate to **Threat Intelligence**
2. Enter the URL in the analysis field
3. View malware detection results
4. Check domain reputation and safety score
5. Get detailed threat classification

### Verifying Digital Identity
1. Visit **Blockchain Verification**
2. Enter wallet address or contact information
3. Review blockchain verification status
4. Check trust score and transaction history
5. Generate cryptographic proof of identity

### Getting AI Security Guidance
1. Open **AI Assistant**
2. Describe your security concern
3. Receive expert analysis and recommendations
4. Get threat level assessment
5. Follow suggested next steps

## 🏗️ Architecture

### Frontend Stack
- **React 19**: Modern component architecture
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Vite**: Fast development and building

### Service Layer
- **API Abstraction**: Unified interface for external services
- **Rate Limiting**: Built-in request throttling
- **Error Handling**: Graceful fallbacks and user feedback
- **Mock Mode**: Full functionality without API keys

### Security Features
- **API Key Protection**: Environment variable isolation
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Sanitized user inputs
- **Secure Headers**: HTTPS enforcement and security policies

## 🔄 Development Workflow

### Running in Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Mock vs Production Mode
- **Mock Mode**: No API keys required, uses simulated data
- **Production Mode**: Real API integration with live data
- **Hybrid Mode**: Mix of real and mock APIs based on available keys

### Adding New APIs
1. Add API configuration to `src/services/api.ts`
2. Create service class in `src/services/`
3. Implement mock fallbacks for development
4. Add API key to `.env.example`
5. Update setup documentation

## 🛡️ Security Considerations

### API Key Security
- Never commit API keys to version control
- Use environment variables for all sensitive data
- Implement rate limiting to prevent abuse
- Monitor API usage and costs

### Data Privacy
- No user data is stored permanently
- API calls are made directly from browser
- No server-side data persistence
- User inputs are not logged or tracked

### Production Deployment
- Use HTTPS for all external API calls
- Implement proper CORS policies
- Set up monitoring and alerting
- Regular security audits and updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Implement comprehensive error handling
- Add mock data for all new APIs
- Update documentation for new features
- Ensure mobile responsiveness

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

**Q: Platform shows "API Error" messages**
A: Check your API key configuration in `.env.local` or run in mock mode

**Q: Some features don't work**
A: Ensure you have the required API keys, or the feature will use mock data

**Q: Rate limit exceeded errors**
A: API free tiers have request limits; wait or upgrade to paid plans

### Getting Help
- Check the setup guide: `./setup.sh` option 3
- Review API documentation in `.env.example`
- Check browser console for detailed error messages
- Ensure API keys are correctly formatted

### Feature Requests
Open an issue with:
- Clear description of the requested feature
- Use case and benefits
- Suggested implementation approach

---

**Built with ❤️ for the cybersecurity community**

*Stay safe, investigate wisely, and protect others online.*
