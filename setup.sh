#!/bin/bash

# OSINT Café Setup Script
# This script helps you configure API keys and dependencies for full functionality

echo "🕵️  Welcome to OSINT Café Setup!"
echo "======================================"
echo ""
echo "This script will help you configure the platform for full functionality."
echo "You can run the platform without API keys (it will use mock data),"
echo "or configure real APIs for production use."
echo ""

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js and npm
echo "🔍 Checking dependencies..."
if ! command_exists node; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ from https://nodejs.org"
    exit 1
fi

if ! command_exists npm; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Node.js $(node --version) found"
echo "✅ npm $(npm --version) found"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "🔧 Configuration Options:"
echo "1. Run with mock data (no API keys needed)"
echo "2. Configure API keys for full functionality"
echo "3. Show API key setup guide"
echo ""

read -p "Choose an option (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Starting OSINT Café in mock mode..."
        echo "All features will work with simulated data."
        echo ""
        npm run dev
        ;;
    2)
        echo ""
        echo "🔐 API Key Configuration"
        echo "========================"
        echo ""
        
        # Check if .env.local exists
        if [ -f ".env.local" ]; then
            echo "⚠️  .env.local already exists. Do you want to:"
            echo "1. Edit existing file"
            echo "2. Create backup and start fresh"
            echo "3. Cancel"
            read -p "Choose (1-3): " env_choice
            
            case $env_choice in
                1)
                    if command_exists code; then
                        code .env.local
                    elif command_exists nano; then
                        nano .env.local
                    elif command_exists vim; then
                        vim .env.local
                    else
                        echo "Please edit .env.local manually"
                    fi
                    ;;
                2)
                    cp .env.local .env.local.backup
                    cp .env.example .env.local
                    echo "✅ Created new .env.local (backup saved as .env.local.backup)"
                    ;;
                3)
                    echo "Configuration cancelled."
                    exit 0
                    ;;
            esac
        else
            cp .env.example .env.local
            echo "✅ Created .env.local from template"
        fi
        
        echo ""
        echo "📝 Edit .env.local and add your API keys, then run:"
        echo "   npm run dev"
        echo ""
        echo "💡 Tip: You can start with just a few API keys and add more later."
        echo "   The platform will use mock data for any missing APIs."
        ;;
    3)
        echo ""
        echo "🔗 API Key Setup Guide"
        echo "======================"
        echo ""
        echo "🤖 AI Services (for chat assistant):"
        echo "  • OpenAI: https://platform.openai.com/api-keys"
        echo "    - Sign up and get $5 free credit"
        echo "    - Add: VITE_OPENAI_API_KEY=your_key_here"
        echo ""
        echo "  • Google Gemini: https://aistudio.google.com/app/apikey"
        echo "    - Free tier available with rate limits"
        echo "    - Add: VITE_GEMINI_API_KEY=your_key_here"
        echo ""
        echo "🛡️  Threat Intelligence:"
        echo "  • VirusTotal: https://www.virustotal.com/gui/join-us"
        echo "    - 1000 requests/day free"
        echo "    - Add: VITE_VIRUSTOTAL_API_KEY=your_key_here"
        echo ""
        echo "  • AbuseIPDB: https://www.abuseipdb.com/register"
        echo "    - 1000 requests/day free"
        echo "    - Add: VITE_ABUSEIPDB_API_KEY=your_key_here"
        echo ""
        echo "⛓️  Blockchain Data:"
        echo "  • Etherscan: https://etherscan.io/register"
        echo "    - Free tier: 5 calls/second"
        echo "    - Add: VITE_ETHERSCAN_API_KEY=your_key_here"
        echo ""
        echo "  • CoinGecko: https://www.coingecko.com/en/api/pricing"
        echo "    - Free tier: 10-50 calls/minute"
        echo "    - Add: VITE_COINGECKO_API_KEY=your_key_here"
        echo ""
        echo "🖼️  Image Analysis:"
        echo "  • Google Vision: https://cloud.google.com/vision/docs/setup"
        echo "    - 1000 requests/month free"
        echo "    - Add: VITE_GOOGLE_VISION_API_KEY=your_key_here"
        echo ""
        echo "✅ Verification Services:"
        echo "  • Hunter.io: https://hunter.io/api_keys"
        echo "    - 25 requests/month free"
        echo "    - Add: VITE_HUNTER_IO_API_KEY=your_key_here"
        echo ""
        echo "💡 Getting Started Tips:"
        echo "  1. Start with OpenAI or Gemini for AI chat functionality"
        echo "  2. Add VirusTotal for threat analysis"
        echo "  3. Add Etherscan for blockchain verification"
        echo "  4. Other APIs are optional and can be added later"
        echo ""
        echo "📁 After getting API keys:"
        echo "  1. Copy .env.example to .env.local"
        echo "  2. Add your API keys to .env.local"
        echo "  3. Run: npm run dev"
        echo ""
        echo "🚀 Ready to start? Run this script again and choose option 2."
        ;;
    *)
        echo "Invalid option. Please run the script again."
        exit 1
        ;;
esac
