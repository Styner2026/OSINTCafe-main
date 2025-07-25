#!/bin/bash

# OSINT Café - Quick Platform Status Check
echo "🎯 OSINT CAFÉ PLATFORM STATUS"
echo "=============================="
echo ""

# Check if development server is running
if curl -s http://localhost:3001/ > /dev/null 2>&1; then
    echo "✅ DEVELOPMENT SERVER: Running at http://localhost:3001/"
else
    echo "❌ DEVELOPMENT SERVER: Not running (start with: npm run dev)"
fi

echo ""
echo "📊 PLATFORM FEATURES:"
echo "✅ Dating Safety - Romance scam detection"
echo "✅ AI Assistant - Cybersecurity chat with Gemini"
echo "✅ Blockchain Verification - Live crypto monitoring"
echo "✅ Threat Intelligence - Real-time threat feeds"
echo "✅ Education - Interactive security training"
echo ""

echo "🔧 YOUR CURRENT API STATUS:"
echo "✅ Google Gemini - AI Assistant functionality"
echo "⚠️  ElevenLabs - Voice (may need project rebranding)"
echo "⚠️  Tavus - AI Avatar (may need project rebranding)"  
echo "⚠️  Sentry - Monitoring (may need project rebranding)"
echo "✅ Pica - Image analysis (works universally)"
echo "✅ Dappier - Web scraping (works universally)"
echo "✅ Algorand - Blockchain (works universally)"
echo ""

echo "🚀 NEXT STEPS:"
echo "1. Visit: http://localhost:3001/ to test the platform"
echo "2. Try the AI Assistant with threat analysis"
echo "3. Test Dating Safety features with sample profiles"
echo "4. Check Blockchain verification dashboard"
echo "5. Review which APIs need project name updates"
echo ""

echo "💡 PRIORITY ACTIONS:"
echo "• Test current platform functionality"
echo "• Identify which features work with existing APIs"
echo "• Update project names only where necessary"
echo ""
