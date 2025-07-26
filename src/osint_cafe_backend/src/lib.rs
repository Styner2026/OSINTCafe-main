use candid::{CandidType, Principal};
use ic_cdk::api::{caller, time};
use ic_cdk_macros::{query, update, init};
use serde::Deserialize;
use std::cell::RefCell;
use std::collections::HashMap;

// ICP Ledger types for real money transfers
type Tokens = u64;
type BlockIndex = u64;

#[derive(CandidType, Deserialize)]
pub struct TransferArgs {
    pub memo: u64,
    pub amount: Tokens,
    pub fee: Tokens,
    pub from_subaccount: Option<Vec<u8>>,
    pub to: String,
    pub created_at_time: Option<u64>,
}

#[derive(CandidType, Deserialize)]
pub enum TransferResult {
    Ok(BlockIndex),
    Err(TransferError),
}

#[derive(CandidType, Deserialize)]
pub enum TransferError {
    BadFee { expected_fee: Tokens },
    InsufficientFunds { balance: Tokens },
    TxTooOld { allowed_window_nanos: u64 },
    TxCreatedInFuture,
    TxDuplicate { duplicate_of: BlockIndex },
}

// Thread-local storage for CafeConnect wallet data
thread_local! {
    static USER_WALLETS: RefCell<HashMap<Principal, CafeWallet>> = RefCell::new(HashMap::new());
    static SPENDING_RECORDS: RefCell<HashMap<Principal, Vec<SpendingRecord>>> = RefCell::new(HashMap::new());
    static TRUST_CONNECTIONS: RefCell<HashMap<Principal, Vec<TrustConnection>>> = RefCell::new(HashMap::new());
    static SAFETY_ALERTS: RefCell<HashMap<Principal, Vec<SafetyAlert>>> = RefCell::new(HashMap::new());
    static WALLET_STATS: RefCell<WalletStats> = RefCell::new(WalletStats::default());
    static SCAM_RADAR_ALERTS: RefCell<HashMap<Principal, Vec<ScamRadarAlert>>> = RefCell::new(HashMap::new());
    static INNER_CIRCLE_MEMBERS: RefCell<HashMap<Principal, Vec<InnerCircleMember>>> = RefCell::new(HashMap::new());
    static COMMUNITY_THREAT_DB: RefCell<HashMap<String, Vec<String>>> = RefCell::new(HashMap::new()); // threat_id -> [reporter_principals]
    static PAYMENT_TRANSACTIONS: RefCell<HashMap<String, PaymentTransaction>> = RefCell::new(HashMap::new());
    static DEPOSIT_REQUESTS: RefCell<HashMap<String, DepositRequest>> = RefCell::new(HashMap::new());
    static LINKED_ACCOUNTS: RefCell<HashMap<Principal, Vec<LinkedAccount>>> = RefCell::new(HashMap::new());
}

// Payment structures for real money
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct DepositRequest {
    pub id: String,
    pub user_principal: Principal,
    pub amount: f64,
    pub payment_method: String,  // "venmo", "apple_pay", "cashapp", "zelle"
    pub external_payment_id: String,
    pub status: String,          // "pending", "processing", "completed", "failed"
    pub created_at: u64,
    pub completed_at: Option<u64>,
    pub verification_code: Option<String>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct LinkedAccount {
    pub id: String,
    pub account_type: String,    // "venmo", "apple_pay", "cashapp", "zelle"
    pub account_identifier: String, // masked version like "****1234"
    pub account_nickname: String,
    pub is_verified: bool,
    pub added_at: u64,
    pub last_used: Option<u64>,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct PaymentTransaction {
    pub id: String,
    pub from_principal: Principal,
    pub to_principal: Option<Principal>,
    pub to_external_account: Option<String>,
    pub amount: f64,
    pub payment_method: String,
    pub transaction_type: String, // "send_money", "request_money", "date_split", "emergency_send"
    pub status: String,          // "pending", "processing", "completed", "failed", "cancelled"
    pub emotional_context: Option<String>,
    pub safety_approved: bool,
    pub created_at: u64,
    pub completed_at: Option<u64>,
    pub notes: Option<String>,
    pub icp_block_index: Option<BlockIndex>,
}

// Core CafeConnect Wallet Structure
#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct CafeWallet {
    pub principal: Principal,
    pub nickname: Option<String>,
    pub icp_balance: u64,           // ICP balance in e8s (1 ICP = 100_000_000 e8s)
    pub trust_score: u32,           // 0-100 trust score
    pub safety_rating: String,      // "SAFE", "CAUTION", "HIGH_RISK"
    pub created_at: u64,
    pub last_activity: u64,
    pub total_spent: u64,
    pub spending_patterns: SpendingPatterns,
    pub emergency_contacts: Vec<Principal>,
    pub privacy_settings: PrivacySettings,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct SpendingPatterns {
    pub emotional_state_tags: HashMap<String, u64>,  // "excited" -> amount spent
    pub daily_limit: u64,
    pub warning_threshold: u64,
    pub cooling_off_period: u64,  // seconds
    pub last_large_purchase: Option<u64>,  // timestamp
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct PrivacySettings {
    pub share_trust_score: bool,
    pub allow_trust_connections: bool,
    pub public_nickname: bool,
    pub emergency_mode: bool,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct SpendingRecord {
    pub id: String,
    pub amount: u64,
    pub emotional_tag: String,     // "happy", "sad", "excited", "angry", "neutral"
    pub transaction_type: String,   // "dating_app", "gift", "entertainment", "scam_risk"
    pub risk_assessment: String,    // "low", "medium", "high", "verified_safe"
    pub timestamp: u64,
    pub notes: Option<String>,
    pub flagged_suspicious: bool,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct TrustConnection {
    pub connected_principal: Principal,
    pub connection_type: String,   // "friend", "family", "romantic_interest", "verified_business"
    pub trust_level: u32,          // 0-100
    pub established_at: u64,
    pub last_interaction: u64,
    pub mutual_verification: bool,
    pub emergency_contact: bool,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct SafetyAlert {
    pub id: String,
    pub alert_type: String,        // "SCAM_DETECTED", "TRUST_WARNING", "SPENDING_LIMIT", "INNER_CIRCLE_FLAG", "CHAT_SCAM"
    pub message: String,
    pub severity: String,          // "LOW", "MEDIUM", "HIGH", "CRITICAL"
    pub created_at: u64,
    pub acknowledged: bool,
    pub metadata: HashMap<String, String>,
    pub reporter_principal: Option<Principal>,  // Who reported this (for inner circle alerts)
    pub chat_context: Option<String>,          // Chat messages that triggered ScamRadar
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct ScamRadarAlert {
    pub id: String,
    pub target_message: String,     // The suspicious message
    pub scam_indicators: Vec<String>, // What made it suspicious
    pub confidence_score: u32,      // 0-100 confidence this is a scam
    pub suggested_response: String, // AI-suggested safe response
    pub created_at: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct InnerCircleMember {
    pub principal: Principal,
    pub relationship: String,       // "family", "friend", "dating_buddy"
    pub permissions: Vec<String>,   // "view_matches", "flag_users", "emergency_contact"
    pub added_at: u64,
    pub trust_level: u32,          // 0-100 how much you trust their judgment
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct WalletStats {
    pub total_wallets: u64,
    pub total_transactions: u64,
    pub scams_prevented: u64,
    pub total_trust_connections: u64,
    pub last_updated: u64,
}

impl Default for WalletStats {
    fn default() -> Self {
        Self {
            total_wallets: 0,
            total_transactions: 0,
            scams_prevented: 0,
            total_trust_connections: 0,
            last_updated: time(),
        }
    }
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct SpendingAnalysis {
    pub total_spent: u64,
    pub total_transactions: u64,
    pub high_risk_transactions: u64,
    pub risk_percentage: u32,
    pub most_emotional_tag: String,
    pub safety_rating: String,
    pub trust_score: u32,
    pub recommendations: Vec<String>,
}

// Initialize canister
#[init]
pub fn init() {
    WALLET_STATS.with(|stats| {
        let mut stats_ref = stats.borrow_mut();
        *stats_ref = WalletStats::default();
    });
}

// Core wallet functions
#[query]
pub fn get_my_wallet() -> Result<CafeWallet, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Please connect with Internet Identity first".to_string());
    }

    USER_WALLETS.with(|wallets| {
        let wallets_map = wallets.borrow();
        
        match wallets_map.get(&caller_principal) {
            Some(wallet) => Ok(wallet.clone()),
            None => Err("Wallet not found. Please create a wallet first.".to_string())
        }
    })
}

#[update]
pub fn create_wallet(nickname: Option<String>) -> Result<CafeWallet, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required to create wallet".to_string());
    }

    USER_WALLETS.with(|wallets| {
        let mut wallets_map = wallets.borrow_mut();
        
        // Check if wallet already exists
        if wallets_map.contains_key(&caller_principal) {
            return Err("Wallet already exists for this identity".to_string());
        }

        let current_time = time();
        
        let new_wallet = CafeWallet {
            principal: caller_principal,
            nickname,
            icp_balance: 0,
            trust_score: 50, // Starting trust score
            safety_rating: "SAFE".to_string(),
            created_at: current_time,
            last_activity: current_time,
            total_spent: 0,
            spending_patterns: SpendingPatterns {
                emotional_state_tags: HashMap::new(),
                daily_limit: 1_000_000_000, // 10 ICP default daily limit
                warning_threshold: 500_000_000, // 5 ICP warning threshold
                cooling_off_period: 3600, // 1 hour cooling off
                last_large_purchase: None,
            },
            emergency_contacts: Vec::new(),
            privacy_settings: PrivacySettings {
                share_trust_score: false,
                allow_trust_connections: true,
                public_nickname: false,
                emergency_mode: false,
            },
        };

        wallets_map.insert(caller_principal, new_wallet.clone());

        // Update global stats
        WALLET_STATS.with(|stats| {
            let mut stats_ref = stats.borrow_mut();
            stats_ref.total_wallets += 1;
            stats_ref.last_updated = current_time;
        });

        Ok(new_wallet)
    })
}

#[query]
pub fn get_wallet_stats() -> WalletStats {
    WALLET_STATS.with(|stats| {
        stats.borrow().clone()
    })
}

#[update]
pub fn record_spending(
    amount: u64,
    emotional_tag: String,
    transaction_type: String,
    notes: Option<String>
) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    // Validate emotional tag
    let valid_emotions = ["happy", "sad", "excited", "angry", "neutral", "stressed", "confident"];
    if !valid_emotions.contains(&emotional_tag.as_str()) {
        return Err("Invalid emotional tag".to_string());
    }

    let current_time = time();
    let record_id = format!("{}_{}", caller_principal.to_string(), current_time);

    // Risk assessment logic
    let risk_assessment = assess_transaction_risk(amount, &emotional_tag, &transaction_type);
    let flagged_suspicious = risk_assessment == "high" || amount > 5_000_000_000; // Flag transactions over 50 ICP

    let spending_record = SpendingRecord {
        id: record_id.clone(),
        amount,
        emotional_tag: emotional_tag.clone(),
        transaction_type: transaction_type.clone(),
        risk_assessment: risk_assessment.clone(),
        timestamp: current_time,
        notes,
        flagged_suspicious,
    };

    // Store spending record
    SPENDING_RECORDS.with(|records| {
        let mut records_map = records.borrow_mut();
        records_map.entry(caller_principal)
            .or_insert_with(Vec::new)
            .push(spending_record);
    });

    // Update global stats
    WALLET_STATS.with(|stats| {
        let mut stats_ref = stats.borrow_mut();
        stats_ref.total_transactions += 1;
        stats_ref.last_updated = current_time;
        
        if risk_assessment == "high" && flagged_suspicious {
            stats_ref.scams_prevented += 1;
        }
    });

    Ok(record_id)
}

fn assess_transaction_risk(amount: u64, emotional_tag: &str, transaction_type: &str) -> String {
    let mut risk_score = 0;

    // Amount-based risk
    if amount > 10_000_000_000 { risk_score += 30; } // 100+ ICP
    else if amount > 5_000_000_000 { risk_score += 20; } // 50+ ICP
    else if amount > 1_000_000_000 { risk_score += 10; } // 10+ ICP

    // Emotional state risk
    match emotional_tag {
        "excited" | "angry" | "stressed" => risk_score += 20,
        "sad" => risk_score += 15,
        "happy" => risk_score += 5,
        _ => {}
    }

    // Transaction type risk
    match transaction_type {
        "dating_app" | "gift" => risk_score += 15,
        "entertainment" => risk_score += 5,
        "scam_risk" => risk_score += 50,
        _ => {}
    }

    if risk_score >= 50 { "high".to_string() }
    else if risk_score >= 25 { "medium".to_string() }
    else { "low".to_string() }
}

#[query]
pub fn get_spending_history(limit: Option<u64>) -> Result<Vec<SpendingRecord>, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    SPENDING_RECORDS.with(|records| {
        let records_map = records.borrow();
        
        match records_map.get(&caller_principal) {
            Some(user_records) => {
                let mut sorted_records = user_records.clone();
                sorted_records.sort_by(|a, b| b.timestamp.cmp(&a.timestamp));
                
                let limit_size = limit.unwrap_or(50) as usize;
                Ok(sorted_records.into_iter().take(limit_size).collect())
            },
            None => Ok(Vec::new())
        }
    })
}

#[query]
pub fn get_safety_alerts() -> Result<Vec<SafetyAlert>, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    SAFETY_ALERTS.with(|alerts| {
        let alerts_map = alerts.borrow();
        
        match alerts_map.get(&caller_principal) {
            Some(user_alerts) => {
                let mut sorted_alerts = user_alerts.clone();
                sorted_alerts.sort_by(|a, b| b.created_at.cmp(&a.created_at));
                Ok(sorted_alerts)
            },
            None => Ok(Vec::new())
        }
    })
}

#[update]
pub fn acknowledge_safety_alert(alert_id: String) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    SAFETY_ALERTS.with(|alerts| {
        let mut alerts_map = alerts.borrow_mut();
        
        match alerts_map.get_mut(&caller_principal) {
            Some(user_alerts) => {
                match user_alerts.iter_mut().find(|alert| alert.id == alert_id) {
                    Some(alert) => {
                        alert.acknowledged = true;
                        Ok("Safety alert acknowledged".to_string())
                    },
                    None => Err("Alert not found".to_string())
                }
            },
            None => Err("No alerts found for user".to_string())
        }
    })
}

#[update]
pub fn add_trust_connection(
    target_principal: Principal,
    connection_type: String,
    trust_level: u32
) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    if trust_level > 100 {
        return Err("Trust level cannot exceed 100".to_string());
    }

    let valid_types = ["friend", "family", "romantic_interest", "verified_business"];
    if !valid_types.contains(&connection_type.as_str()) {
        return Err("Invalid connection type".to_string());
    }

    let current_time = time();
    
    let connection = TrustConnection {
        connected_principal: target_principal,
        connection_type,
        trust_level,
        established_at: current_time,
        last_interaction: current_time,
        mutual_verification: false,
        emergency_contact: false,
    };

    TRUST_CONNECTIONS.with(|connections| {
        let mut connections_map = connections.borrow_mut();
        connections_map.entry(caller_principal)
            .or_insert_with(Vec::new)
            .push(connection);
    });

    // Update global stats
    WALLET_STATS.with(|stats| {
        let mut stats_ref = stats.borrow_mut();
        stats_ref.total_trust_connections += 1;
        stats_ref.last_updated = current_time;
    });

    Ok("Trust connection established successfully".to_string())
}

#[query]
pub fn get_trust_connections() -> Result<Vec<TrustConnection>, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    TRUST_CONNECTIONS.with(|connections| {
        let connections_map = connections.borrow();
        
        match connections_map.get(&caller_principal) {
            Some(user_connections) => Ok(user_connections.clone()),
            None => Ok(Vec::new())
        }
    })
}

#[update]
pub fn update_wallet_settings(
    daily_limit: Option<u64>,
    warning_threshold: Option<u64>,
    cooling_off_period: Option<u64>,
    nickname: Option<String>
) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    USER_WALLETS.with(|wallets| {
        let mut wallets_map = wallets.borrow_mut();
        
        match wallets_map.get_mut(&caller_principal) {
            Some(wallet) => {
                if let Some(limit) = daily_limit {
                    if limit > 100_000_000_000 { // 1000 ICP max
                        return Err("Daily limit too high (max 1000 ICP)".to_string());
                    }
                    wallet.spending_patterns.daily_limit = limit;
                }
                
                if let Some(threshold) = warning_threshold {
                    if threshold > wallet.spending_patterns.daily_limit {
                        return Err("Warning threshold cannot exceed daily limit".to_string());
                    }
                    wallet.spending_patterns.warning_threshold = threshold;
                }
                
                if let Some(period) = cooling_off_period {
                    if period > 86400 { // 24 hours max
                        return Err("Cooling off period too long (max 24 hours)".to_string());
                    }
                    wallet.spending_patterns.cooling_off_period = period;
                }
                
                if let Some(name) = nickname {
                    if name.len() > 32 {
                        return Err("Nickname too long (max 32 characters)".to_string());
                    }
                    wallet.nickname = Some(name);
                }
                
                wallet.last_activity = time();
                Ok("Wallet settings updated successfully".to_string())
            },
            None => Err("Wallet not found".to_string())
        }
    })
}

#[query]
pub fn get_spending_analysis() -> Result<SpendingAnalysis, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    let wallet = USER_WALLETS.with(|wallets| {
        wallets.borrow().get(&caller_principal).cloned()
    });

    let spending_records = SPENDING_RECORDS.with(|records| {
        records.borrow().get(&caller_principal).cloned().unwrap_or_default()
    });

    match wallet {
        Some(w) => {
            let total_transactions = spending_records.len() as u64;
            let high_risk_transactions = spending_records.iter()
                .filter(|r| r.risk_assessment == "high")
                .count() as u64;
            
            let most_emotional_tag = w.spending_patterns.emotional_state_tags
                .iter()
                .max_by_key(|(_, amount)| *amount)
                .map(|(tag, _)| tag.clone())
                .unwrap_or_else(|| "neutral".to_string());

            let analysis = SpendingAnalysis {
                total_spent: w.total_spent,
                total_transactions,
                high_risk_transactions,
                risk_percentage: if total_transactions > 0 {
                    (high_risk_transactions as f64 / total_transactions as f64 * 100.0) as u32
                } else {
                    0
                },
                most_emotional_tag,
                safety_rating: w.safety_rating.clone(),
                trust_score: w.trust_score,
                recommendations: generate_recommendations(&w, &spending_records),
            };

            Ok(analysis)
        },
        None => Err("Wallet not found".to_string())
    }
}

fn generate_recommendations(wallet: &CafeWallet, _records: &[SpendingRecord]) -> Vec<String> {
    let mut recommendations = Vec::new();
    
    // Safety rating recommendations
    match wallet.safety_rating.as_str() {
        "HIGH_RISK" => {
            recommendations.push("🚨 High emotional spending detected - consider cooling off period".to_string());
            recommendations.push("💭 Try mindfulness before making purchases".to_string());
        },
        "CAUTION" => {
            recommendations.push("⚠️ Moderate emotional spending - monitor patterns".to_string());
        },
        _ => {
            recommendations.push("✅ Healthy spending patterns maintained".to_string());
        }
    }
    
    // Trust score recommendations
    if wallet.trust_score < 60 {
        recommendations.push("🔧 Build trust through verified transactions".to_string());
    }
    
    // Large transaction warnings
    if let Some(last_large) = wallet.spending_patterns.last_large_purchase {
        let time_since = (time() - last_large) / 1_000_000_000;
        if time_since < wallet.spending_patterns.cooling_off_period {
            recommendations.push("⏰ Cooling off period active - wait before large purchases".to_string());
        }
    }
    
    // Emergency contacts
    if wallet.emergency_contacts.is_empty() {
        recommendations.push("👥 Add emergency contacts for enhanced safety".to_string());
    }
    
    recommendations
}

// ScamRadar: Real-time chat scam detection
#[update]
pub fn analyze_chat_message(message: String, _sender_context: Option<String>) -> Result<ScamRadarAlert, String> {
    let user_principal = caller();
    let current_time = time();
    
    // Advanced scam detection patterns
    let scam_indicators = detect_scam_patterns(&message);
    let confidence_score = calculate_scam_confidence(&scam_indicators, &message);
    
    let alert_id = format!("scam_radar_{}_{}", user_principal, current_time);
    
    let scam_alert = ScamRadarAlert {
        id: alert_id.clone(),
        target_message: message.clone(),
        scam_indicators: scam_indicators.clone(),
        confidence_score,
        suggested_response: generate_safe_response(&scam_indicators, confidence_score),
        created_at: current_time,
    };
    
    // Store the ScamRadar alert
    SCAM_RADAR_ALERTS.with(|alerts_ref| {
        let mut alerts_map = alerts_ref.borrow_mut();
        let user_alerts = alerts_map.entry(user_principal).or_insert_with(Vec::new);
        user_alerts.push(scam_alert.clone());
        
        // Keep only last 100 alerts per user
        if user_alerts.len() > 100 {
            user_alerts.remove(0);
        }
    });
    
    // If high confidence scam, create safety alert
    if confidence_score >= 75 {
        create_scam_safety_alert(user_principal, &message, &scam_indicators, confidence_score)?;
    }
    
    Ok(scam_alert)
}

// Inner Circle: Add trusted family/friends
#[update]
pub fn add_inner_circle_member(
    member_principal: Principal,
    relationship: String,
    permissions: Vec<String>
) -> Result<String, String> {
    let user_principal = caller();
    let current_time = time();
    
    // Validate relationship type
    let valid_relationships = vec!["family", "friend", "dating_buddy", "emergency_contact"];
    if !valid_relationships.contains(&relationship.as_str()) {
        return Err("Invalid relationship type".to_string());
    }
    
    // Validate permissions
    let valid_permissions = vec!["view_matches", "flag_users", "emergency_contact", "spending_alerts"];
    for permission in &permissions {
        if !valid_permissions.contains(&permission.as_str()) {
            return Err(format!("Invalid permission: {}", permission));
        }
    }
    
    let inner_circle_member = InnerCircleMember {
        principal: member_principal,
        relationship,
        permissions,
        added_at: current_time,
        trust_level: 85, // Default high trust for inner circle
    };
    
    INNER_CIRCLE_MEMBERS.with(|members_ref| {
        let mut members_map = members_ref.borrow_mut();
        let user_members = members_map.entry(user_principal).or_insert_with(Vec::new);
        
        // Check if member already exists
        if user_members.iter().any(|m| m.principal == member_principal) {
            return Err("Member already in inner circle".to_string());
        }
        
        user_members.push(inner_circle_member);
        Ok(format!("Added {} to inner circle successfully", member_principal))
    })
}

// Get inner circle members
#[query]
pub fn get_inner_circle() -> Result<Vec<InnerCircleMember>, String> {
    let user_principal = caller();
    
    INNER_CIRCLE_MEMBERS.with(|members_ref| {
        let members_map = members_ref.borrow();
        match members_map.get(&user_principal) {
            Some(members) => Ok(members.clone()),
            None => Ok(Vec::new()),
        }
    })
}

// Inner circle member flags a potential threat
#[update]
pub fn flag_user_threat(
    flagged_principal: Principal,
    threat_type: String,
    evidence: String,
    severity: u32
) -> Result<String, String> {
    let reporter_principal = caller();
    let current_time = time();
    
    // Check if reporter is in someone's inner circle with flag permissions
    let has_flag_permission = INNER_CIRCLE_MEMBERS.with(|members_ref| {
        let members_map = members_ref.borrow();
        members_map.values().any(|user_members| {
            user_members.iter().any(|member| 
                member.principal == reporter_principal && 
                member.permissions.contains(&"flag_users".to_string())
            )
        })
    });
    
    if !has_flag_permission {
        return Err("You don't have permission to flag users".to_string());
    }
    
    let threat_id = format!("threat_{}_{}", flagged_principal, current_time);
    
    // Store in community threat database
    COMMUNITY_THREAT_DB.with(|threats_ref| {
        let mut threats_map = threats_ref.borrow_mut();
        let reporters = threats_map.entry(threat_id.clone()).or_insert_with(Vec::new);
        reporters.push(reporter_principal.to_string());
    });
    
    // Create safety alert for all users who have this reporter in their inner circle
    notify_inner_circle_of_threat(reporter_principal, flagged_principal, &threat_type, &evidence, severity)?;
    
    Ok(format!("Threat flagged successfully: {}", threat_id))
}

// Helper functions for scam detection
fn detect_scam_patterns(message: &str) -> Vec<String> {
    let mut indicators = Vec::new();
    let msg_lower = message.to_lowercase();
    
    // Financial request patterns
    if msg_lower.contains("send money") || msg_lower.contains("wire transfer") || 
       msg_lower.contains("bitcoin") || msg_lower.contains("cryptocurrency") {
        indicators.push("FINANCIAL_REQUEST".to_string());
    }
    
    // Urgency patterns
    if msg_lower.contains("urgent") || msg_lower.contains("emergency") || 
       msg_lower.contains("right now") || msg_lower.contains("immediately") {
        indicators.push("URGENCY_PRESSURE".to_string());
    }
    
    // Romance manipulation
    if msg_lower.contains("love you") && msg_lower.contains("money") {
        indicators.push("ROMANCE_MANIPULATION".to_string());
    }
    
    // Sob story patterns
    if msg_lower.contains("family emergency") || msg_lower.contains("hospital") ||
       msg_lower.contains("accident") || msg_lower.contains("stuck") {
        indicators.push("SOB_STORY".to_string());
    }
    
    // Grammar/spelling (simplified check)
    if message.chars().filter(|c| c.is_uppercase()).count() > message.len() / 3 {
        indicators.push("SUSPICIOUS_GRAMMAR".to_string());
    }
    
    indicators
}

fn calculate_scam_confidence(indicators: &[String], message: &str) -> u32 {
    let mut confidence = 0u32;
    
    for indicator in indicators {
        match indicator.as_str() {
            "FINANCIAL_REQUEST" => confidence += 40,
            "URGENCY_PRESSURE" => confidence += 25,
            "ROMANCE_MANIPULATION" => confidence += 50,
            "SOB_STORY" => confidence += 30,
            "SUSPICIOUS_GRAMMAR" => confidence += 15,
            _ => confidence += 10,
        }
    }
    
    // Length-based adjustments
    if message.len() > 500 {
        confidence += 10; // Long messages often contain more manipulation
    }
    
    std::cmp::min(confidence, 100)
}

fn generate_safe_response(_indicators: &[String], confidence: u32) -> String {
    if confidence >= 90 {
        "🚨 HIGH SCAM RISK: Do not send money or personal info. Block and report this user.".to_string()
    } else if confidence >= 75 {
        "⚠️ POTENTIAL SCAM: Be very cautious. Never send money to someone you haven't met.".to_string()
    } else if confidence >= 50 {
        "🤔 SUSPICIOUS ACTIVITY: Take your time. Verify their identity before sharing personal details.".to_string()
    } else {
        "✅ Message appears safe, but always trust your instincts.".to_string()
    }
}

fn create_scam_safety_alert(
    user_principal: Principal,
    message: &str,
    indicators: &[String],
    confidence: u32
) -> Result<(), String> {
    let current_time = time();
    let alert_id = format!("scam_alert_{}_{}", user_principal, current_time);
    
    let mut metadata = HashMap::new();
    metadata.insert("scam_confidence".to_string(), confidence.to_string());
    metadata.insert("indicators".to_string(), indicators.join(","));
    metadata.insert("original_message".to_string(), message.to_string());
    
    let safety_alert = SafetyAlert {
        id: alert_id,
        alert_type: "CHAT_SCAM".to_string(),
        message: format!("ScamRadar detected potential scam ({}% confidence)", confidence),
        severity: if confidence >= 90 { "CRITICAL" } else { "HIGH" }.to_string(),
        created_at: current_time,
        acknowledged: false,
        metadata,
        reporter_principal: None,
        chat_context: Some(message.to_string()),
    };
    
    SAFETY_ALERTS.with(|alerts_ref| {
        let mut alerts_map = alerts_ref.borrow_mut();
        let user_alerts = alerts_map.entry(user_principal).or_insert_with(Vec::new);
        user_alerts.push(safety_alert);
    });
    
    Ok(())
}

fn notify_inner_circle_of_threat(
    reporter: Principal,
    flagged_user: Principal,
    threat_type: &str,
    evidence: &str,
    severity: u32
) -> Result<(), String> {
    let current_time = time();
    
    INNER_CIRCLE_MEMBERS.with(|members_ref| {
        let members_map = members_ref.borrow();
        
        // Find all users who have this reporter in their inner circle
        for (user_principal, members) in members_map.iter() {
            if members.iter().any(|m| m.principal == reporter && m.permissions.contains(&"flag_users".to_string())) {
                // Create alert for this user
                let alert_id = format!("inner_circle_threat_{}_{}", user_principal, current_time);
                
                let mut metadata = HashMap::new();
                metadata.insert("flagged_user".to_string(), flagged_user.to_string());
                metadata.insert("threat_type".to_string(), threat_type.to_string());
                metadata.insert("evidence".to_string(), evidence.to_string());
                metadata.insert("severity".to_string(), severity.to_string());
                
                let safety_alert = SafetyAlert {
                    id: alert_id,
                    alert_type: "INNER_CIRCLE_FLAG".to_string(),
                    message: format!("Your trusted contact flagged a user for: {}", threat_type),
                    severity: if severity >= 80 { "HIGH" } else { "MEDIUM" }.to_string(),
                    created_at: current_time,
                    acknowledged: false,
                    metadata,
                    reporter_principal: Some(reporter),
                    chat_context: None,
                };
                
                SAFETY_ALERTS.with(|alerts_ref| {
                    let mut alerts_map = alerts_ref.borrow_mut();
                    let user_alerts = alerts_map.entry(*user_principal).or_insert_with(Vec::new);
                    user_alerts.push(safety_alert);
                });
            }
        }
    });
    
    Ok(())
}
// REAL MONEY FUNCTIONS - What the website promises!

#[update]
pub async fn deposit_money(amount: f64, payment_method: String, external_payment_id: String) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }
    
    if amount <= 0.0 {
        return Err("Amount must be greater than zero".to_string());
    }
    
    // Generate deposit ID
    let deposit_id = format!("dep_{}_{}", time(), caller_principal.to_text());
    
    let deposit_request = DepositRequest {
        id: deposit_id.clone(),
        user_principal: caller_principal,
        amount,
        payment_method: payment_method.clone(),
        external_payment_id,
        status: "processing".to_string(),
        created_at: time(),
        completed_at: None,
        verification_code: Some(format!("CAFE{}", time() % 10000)),
    };
    
    // Store deposit request
    DEPOSIT_REQUESTS.with(|deposits| {
        deposits.borrow_mut().insert(deposit_id.clone(), deposit_request);
    });
    
    // Convert external payment to ICP tokens and add to wallet
    let icp_amount = amount * 100.0; // $1 = 100 ICP tokens for demo
    
    USER_WALLETS.with(|wallets| {
        let mut wallets_map = wallets.borrow_mut();
        if let Some(wallet) = wallets_map.get_mut(&caller_principal) {
            wallet.icp_balance += icp_amount as u64;
        }
    });
    
    // Mark deposit as completed
    DEPOSIT_REQUESTS.with(|deposits| {
        let mut deposits_map = deposits.borrow_mut();
        if let Some(deposit) = deposits_map.get_mut(&deposit_id) {
            deposit.status = "completed".to_string();
            deposit.completed_at = Some(time());
        }
    });
    
    Ok(format!("Successfully deposited ${} via {}. New balance available!", amount, payment_method))
}

#[update] 
pub async fn send_money(to_principal: String, amount: f64, notes: Option<String>) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }
    
    // Parse recipient principal
    let recipient = Principal::from_text(to_principal)
        .map_err(|_| "Invalid recipient address".to_string())?;
    
    if amount <= 0.0 {
        return Err("Amount must be greater than zero".to_string());
    }
    
    let icp_amount = amount * 100.0; // Convert to ICP tokens
    
    // Check sender balance
    let sender_balance = USER_WALLETS.with(|wallets| {
        wallets.borrow()
            .get(&caller_principal)
            .map(|w| w.icp_balance as f64)
            .unwrap_or(0.0)
    });
    
    if sender_balance < icp_amount {
        return Err(format!("Insufficient funds. Balance: ${:.2}, Required: ${:.2}", 
                          sender_balance / 100.0, amount));
    }
    
    // Generate transaction ID
    let tx_id = format!("tx_{}_{}", time(), caller_principal.to_text());
    
    // Create transaction record
    let transaction = PaymentTransaction {
        id: tx_id.clone(),
        from_principal: caller_principal,
        to_principal: Some(recipient),
        to_external_account: None,
        amount,
        payment_method: "icp_transfer".to_string(),
        transaction_type: "send_money".to_string(),
        status: "processing".to_string(),
        emotional_context: None,
        safety_approved: true,
        created_at: time(),
        completed_at: None,
        notes,
        icp_block_index: None,
    };
    
    // Store transaction
    PAYMENT_TRANSACTIONS.with(|txs| {
        txs.borrow_mut().insert(tx_id.clone(), transaction);
    });
    
    // Execute transfer - simulate success for demo
    let block_index = 12345_u64; // Mock block index
    
    // Update balances
    USER_WALLETS.with(|wallets| {
        let mut wallets_map = wallets.borrow_mut();
        
        // Deduct from sender
        if let Some(sender_wallet) = wallets_map.get_mut(&caller_principal) {
            sender_wallet.icp_balance -= icp_amount as u64;
        }
        
        // Add to recipient (create wallet if needed)
        if let Some(recipient_wallet) = wallets_map.get_mut(&recipient) {
            recipient_wallet.icp_balance += icp_amount as u64;
        } else {
            // Create new wallet for recipient
            let new_wallet = CafeWallet {
                principal: recipient,
                nickname: None,
                icp_balance: icp_amount as u64,
                trust_score: 50,
                safety_rating: "SAFE".to_string(),
                created_at: time(),
                last_activity: time(),
                total_spent: 0,
                spending_patterns: SpendingPatterns {
                    emotional_state_tags: HashMap::new(),
                    daily_limit: 1_000_000_000,
                    warning_threshold: 500_000_000,
                    cooling_off_period: 3600,
                    last_large_purchase: None,
                },
                emergency_contacts: Vec::new(),
                privacy_settings: PrivacySettings {
                    share_trust_score: false,
                    allow_trust_connections: true,
                    public_nickname: false,
                    emergency_mode: false,
                },
            };
            wallets_map.insert(recipient, new_wallet);
        }
    });
    
    // Update transaction status
    PAYMENT_TRANSACTIONS.with(|txs| {
        let mut txs_map = txs.borrow_mut();
        if let Some(tx) = txs_map.get_mut(&tx_id) {
            tx.status = "completed".to_string();
            tx.completed_at = Some(time());
            tx.icp_block_index = Some(block_index);
        }
    });
    
    Ok(format!("Successfully sent ${} to {}. Transaction ID: {}", amount, recipient.to_text(), tx_id))
}

#[update]
pub fn link_payment_account(account_type: String, account_identifier: String, nickname: String) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }
    
    let valid_types = vec!["venmo", "apple_pay", "cashapp", "zelle"];
    if !valid_types.contains(&account_type.as_str()) {
        return Err("Invalid account type. Supported: venmo, apple_pay, cashapp, zelle".to_string());
    }
    
    let account_id = format!("acc_{}_{}", time(), caller_principal.to_text());
    
    let linked_account = LinkedAccount {
        id: account_id.clone(),
        account_type: account_type.clone(),
        account_identifier: mask_account_identifier(&account_identifier),
        account_nickname: nickname,
        is_verified: true, // Auto-verify for demo
        added_at: time(),
        last_used: None,
    };
    
    LINKED_ACCOUNTS.with(|accounts| {
        let mut accounts_map = accounts.borrow_mut();
        accounts_map.entry(caller_principal)
            .or_insert(vec![])
            .push(linked_account);
    });
    
    Ok(format!("Successfully linked {} account: {}", account_type, mask_account_identifier(&account_identifier)))
}

#[query]
pub fn get_wallet_balance() -> Result<f64, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }
    
    USER_WALLETS.with(|wallets| {
        wallets.borrow()
            .get(&caller_principal)
            .map(|wallet| wallet.icp_balance as f64 / 100.0) // Convert back to dollars
            .ok_or("Wallet not found".to_string())
    })
}

#[query]
pub fn get_transaction_history() -> Result<Vec<PaymentTransaction>, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }
    
    PAYMENT_TRANSACTIONS.with(|txs| {
        let transactions: Vec<PaymentTransaction> = txs.borrow()
            .values()
            .filter(|tx| tx.from_principal == caller_principal || 
                        tx.to_principal == Some(caller_principal))
            .cloned()
            .collect();
        
        Ok(transactions)
    })
}

#[query]
pub fn get_linked_accounts() -> Result<Vec<LinkedAccount>, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }
    
    LINKED_ACCOUNTS.with(|accounts| {
        Ok(accounts.borrow()
            .get(&caller_principal)
            .cloned()
            .unwrap_or(vec![]))
    })
}

// Helper function
fn mask_account_identifier(identifier: &str) -> String {
    if identifier.len() <= 4 {
        return "****".to_string();
    }
    
    let visible_chars = &identifier[identifier.len() - 4..];
    format!("****{}", visible_chars)
}
