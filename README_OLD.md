# OSINT Café - AI-Powered Cybersecurity & Verification Platform

> 🛡️ Your comprehensive digital safety ecosystem powered by AI and blockchain technology

![OSINT Café](https://img.shields.io/badge/OSINT-Café-00f5ff?style=for-the-badge&logo=shield&logoColor=white)
![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38bdf8?style=for-the-badge&logo=tailwindcss&logoColor=white)

## 🌟 Overview

OSINT Café is a cutting-edge cybersecurity investigation and digital verification platform that combines AI-powered analysis with blockchain technology to help users stay safe online. From romance scam detection to real-time threat intelligence, we provide comprehensive tools for digital protection.

## ✨ Core Features

### 🛡️ Dating & Relationship Safety
- **Romance Scam Detection**: AI-powered analysis of dating profiles and conversations
- **Background Verification**: Comprehensive profile verification using multiple data sources
- **Safety Scoring System**: Real-time risk assessment with actionable recommendations
- **Photo Analysis**: Reverse image search and deepfake detection

### 🤖 AI Investigation Assistant
- **Interactive Chat Interface**: Natural language processing for threat analysis
- **Voice Commands**: Speech-to-text and text-to-speech capabilities
- **Real-time Analysis**: Instant evaluation of suspicious content
- **Threat Intelligence**: Access to live cybersecurity databases

### ⛓️ Blockchain Verification System
- **Live Dashboard**: Real-time blockchain data visualization
- **Multi-Chain Support**: Ethereum, Bitcoin, Polygon integration
- **Cryptographic Proof**: Immutable identity verification records
- **Transaction Monitoring**: Real-time blockchain transaction tracking

### 📊 Real-time Threat Intelligence
- **Live Threat Feeds**: Continuous monitoring of emerging cybersecurity threats
- **Scam Detection**: Community-driven scam reporting and verification
- **Global Threat Map**: Geographic visualization of threat patterns
- **Automated Alerts**: Real-time notifications for new threats

### 🎓 Interactive Safety Education
- **Multimedia Learning**: Video tutorials, interactive guides, and audio content
- **Gamified Experience**: Achievement system and progress tracking
- **Skill Certification**: Cybersecurity competency certificates
- **Community Learning**: Peer-to-peer knowledge sharing

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Modern web browser

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/osint-cafe.git
   cd osint-cafe
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
npm run preview
```

## 🛠️ Technology Stack

### Frontend
- **React 18**: Modern React with hooks and concurrent features
- **TypeScript**: Type-safe development with full IntelliSense
- **Tailwind CSS**: Utility-first CSS with custom cybersecurity theme
- **Framer Motion**: Smooth animations and transitions
- **React Router**: Client-side routing and navigation

### UI/UX
- **Radix UI**: Accessible, unstyled UI primitives
- **Lucide React**: Beautiful, customizable icons
- **React Hot Toast**: Elegant notification system
- **React Dropzone**: Drag-and-drop file uploads
- **Recharts**: Responsive chart library

### State Management
- **TanStack Query**: Powerful data synchronization
- **React Hooks**: Local state management
- **Context API**: Global state sharing

### Development Tools
- **Vite**: Fast build tool and dev server
- **ESLint**: Code linting and quality
- **PostCSS**: CSS processing and optimization

## 🎨 Design System

### Color Palette
- **Cyber Blue**: `#00f5ff` - Primary interactive elements
- **Cyber Green**: `#39ff14` - Success states and highlights  
- **Accent Orange**: `#ff6b35` - Warning states and CTAs
- **Dark Background**: `#0a0a0a` - Primary background
- **Dark Panel**: `#1a1a1a` - Component backgrounds

### Typography
- **Headings**: Orbitron (Cyberpunk aesthetic)
- **Body Text**: Inter (Modern readability)
- **Code/Data**: JetBrains Mono (Technical content)

### Components
- Consistent cyber-themed borders with glow effects
- Smooth animations and micro-interactions
- Mobile-first responsive design
- Accessibility-focused implementation

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.tsx      # Main navigation
│   └── ...
├── pages/              # Route components
│   ├── Home.tsx        # Landing page
│   ├── DatingSafety.tsx # Romance scam detection
│   ├── AIAssistant.tsx  # AI chat interface
│   ├── BlockchainVerification.tsx
│   ├── ThreatIntelligence.tsx
│   └── Education.tsx
├── types/              # TypeScript interfaces
│   └── index.ts
├── services/           # API and business logic
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
└── App.tsx            # Main application component
```

## 🔒 Security Features

- **Input Validation**: Comprehensive sanitization of user inputs
- **XSS Protection**: Content Security Policy implementation
- **Privacy First**: No unnecessary data collection
- **Secure Communications**: HTTPS enforcement
- **Rate Limiting**: API abuse prevention

## 🎯 Target Use Cases

### Personal Safety
- Dating app verification and background checks
- Social media profile authentication
- Personal information protection
- Online relationship safety

### Business Protection
- Employee background verification
- Vendor and partner due diligence
- Brand protection and monitoring
- Fraud prevention systems

### Investment Security
- Cryptocurrency scam detection
- ICO and DeFi project verification
- Financial fraud prevention
- Due diligence automation

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenAI** for AI integration possibilities
- **Google Gemini** for advanced language models
- **Blockchain communities** for verification protocols
- **Cybersecurity researchers** for threat intelligence
- **Open source community** for the amazing tools and libraries

## 📞 Support

- **Documentation**: [docs.osintcafe.com](https://docs.osintcafe.com)
- **Community**: [Discord Server](https://discord.gg/osintcafe)
- **Issues**: [GitHub Issues](https://github.com/yourusername/osint-cafe/issues)
- **Email**: support@osintcafe.com

---

<div align="center">

**Built with ❤️ for digital safety and cybersecurity**

[Website](https://osintcafe.com) • [Documentation](https://docs.osintcafe.com) • [Community](https://discord.gg/osintcafe)

</div>

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
