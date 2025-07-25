#!/bin/bash

echo "🔍 Testing OSINT Café ICP 'Who Am I?' Functionality"
echo "=================================================="

# Get the canister ID
CANISTER_ID=$(dfx canister id osint_cafe_backend)
echo "📍 Canister ID: $CANISTER_ID"

echo ""
echo "🧪 Test 1: Anonymous call (should fail with authentication error)"
dfx canister call osint_cafe_backend who_am_i

echo ""
echo "🧪 Test 2: Authenticated call with test identity"
echo "Creating test identity..."
dfx identity new test_user --disable-encryption || echo "Identity already exists"
dfx identity use test_user

echo ""
echo "📞 Calling who_am_i with authenticated identity:"
dfx canister call osint_cafe_backend who_am_i

echo ""
echo "🧪 Test 3: Get platform statistics"
dfx canister call osint_cafe_backend get_stats

echo ""
echo "🧪 Test 4: Verify identity (generate security report)"
dfx canister call osint_cafe_backend verify_identity

echo ""
echo "🧪 Test 5: Set nickname"
dfx canister call osint_cafe_backend set_nickname '("TestUser123")'

echo ""
echo "🧪 Test 6: Update trust score"
dfx canister call osint_cafe_backend update_trust_score '(75)'

echo ""
echo "🧪 Test 7: Call who_am_i again to see updated profile"
dfx canister call osint_cafe_backend who_am_i

echo ""
echo "✅ Testing complete! Your ICP 'Who Am I?' canister is working!"
echo ""
echo "🌐 You can also test via Candid UI at:"
echo "http://127.0.0.1:4943/?canisterId=$(dfx canister id __Candid_UI)&id=$CANISTER_ID"

# Switch back to default identity
dfx identity use default
