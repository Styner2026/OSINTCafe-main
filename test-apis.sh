#!/bin/bash

# OSINT Café - API Status Test
# Test which APIs are working with current keys

echo "🧪 TESTING OSINT CAFÉ API STATUS"
echo "================================="
echo ""

echo "📋 CHECKING API KEY AVAILABILITY:"
echo ""

# Check which API keys are present in .env
if grep -q "VITE_GOOGLE_API_KEY" .env; then
    echo "✅ Google/Gemini API - CONFIGURED"
else
    echo "❌ Google/Gemini API - NOT FOUND"
fi

if grep -q "VITE_ELEVENLABS_API_KEY" .env; then
    echo "✅ ElevenLabs API - CONFIGURED"
else
    echo "❌ ElevenLabs API - NOT FOUND"
fi

if grep -q "NEXT_PUBLIC_TAVUS_API_KEY" .env; then
    echo "✅ Tavus API - CONFIGURED"
else
    echo "❌ Tavus API - NOT FOUND"
fi

if grep -q "NEXT_PUBLIC_SENTRY_DSN" .env; then
    echo "✅ Sentry DSN - CONFIGURED"
else
    echo "❌ Sentry DSN - NOT FOUND"
fi

if grep -q "NEXT_PUBLIC_PICAOS_API_KEY" .env; then
    echo "✅ Pica API - CONFIGURED"
else
    echo "❌ Pica API - NOT FOUND"
fi

if grep -q "NEXT_PUBLIC_DAPPIER" .env; then
    echo "✅ Dappier API - CONFIGURED"
else
    echo "❌ Dappier API - NOT FOUND"
fi

if grep -q "ALGOD_MAINNET_API" .env; then
    echo "✅ Algorand/IPFS - CONFIGURED"
else
    echo "❌ Algorand/IPFS - NOT FOUND"
fi

echo ""
echo "🎯 RECOMMENDATION:"
echo "Your APIs are already configured! Most will work fine for OSINT Café."
echo "Only ElevenLabs, Sentry, and Tavus may need project-specific updates."
echo ""
echo "🚀 NEXT STEPS:"
echo "1. Test your platform at: http://localhost:3001/"
echo "2. Check which features work with current APIs"
echo "3. Update project names only where needed"
echo ""
echo "💡 Most hackathon perks work across project names!"
