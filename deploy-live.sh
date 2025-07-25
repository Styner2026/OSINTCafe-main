#!/bin/bash

echo "🚀 OSINT Café - Live ICP Deployment for Hackathon"
echo "================================================"

# Check if we're ready to deploy
echo "📋 Pre-deployment checklist:"
echo "1. Do you have cycles in your wallet? (y/n)"
read -r has_cycles

if [ "$has_cycles" != "y" ]; then
    echo "❌ You need cycles first. Options:"
    echo "   • Buy ICP on Coinbase and convert to cycles"
    echo "   • Get hackathon sponsor codes from organizers"
    echo "   • Check https://dfinity.org/grants for developer grants"
    exit 1
fi

echo ""
echo "🔍 Checking your principal ID..."
PRINCIPAL=$(dfx identity get-principal)
echo "📍 Your Principal: $PRINCIPAL"

echo ""
echo "💰 Checking wallet balance..."
dfx wallet balance --network ic || echo "⚠️ Wallet not found - you may need to create one"

echo ""
echo "🏗️ Building canister for production..."
cargo update
dfx build --network ic

echo ""
echo "🌐 Deploying to live ICP network..."
dfx deploy --network ic osint_cafe_backend

if [ $? -eq 0 ]; then
    CANISTER_ID=$(dfx canister id osint_cafe_backend --network ic)
    echo ""
    echo "✅ SUCCESS! Your ICP 'Who Am I?' canister is LIVE!"
    echo "=================================================="
    echo ""
    echo "🔗 HACKATHON SUBMISSION LINKS:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎯 Canister ID: $CANISTER_ID"
    echo ""
    echo "🌐 Live Demo URL:"
    echo "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=$CANISTER_ID"
    echo ""
    echo "🔧 Candid UI (for testing):"
    echo "https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=$CANISTER_ID"
    echo ""
    echo "📋 GitHub Repository:"
    echo "https://github.com/[YOUR-USERNAME]/OSINTCafe-main"
    echo ""
    echo "🎥 Demo Video Instructions:"
    echo "1. Record screen showing the live demo"
    echo "2. Show Internet Identity login working"
    echo "3. Demonstrate 'Who Am I?' function"
    echo "4. Upload to YouTube and get link"
    echo ""
    echo "💡 Copy these links for your hackathon submission!"
    echo "=================================================="
else
    echo ""
    echo "❌ Deployment failed. Common issues:"
    echo "• Not enough cycles in wallet"
    echo "• Network connection problems"
    echo "• Wallet not properly configured"
    echo ""
    echo "💡 Need help? Check: https://internetcomputer.org/docs"
fi
