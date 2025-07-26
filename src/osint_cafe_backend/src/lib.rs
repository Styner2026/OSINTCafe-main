use candid::{CandidType, Principal};
use ic_cdk::api::{caller, time};
use ic_cdk_macros::{query, update, init};
use serde::Deserialize;
use std::cell::RefCell;
use std::collections::HashMap;

// Thread-local storage for CafeConnect wallet data
thread_local! {
    static USER_WALLETS: RefCell<HashMap<Principal, CafeWallet>> = RefCell::new(HashMap::new());
    static SPENDING_RECORDS: RefCell<HashMap<Principal, Vec<SpendingRecord>>> = RefCell::new(HashMap::new());
    static TRUST_CONNECTIONS: RefCell<HashMap<Principal, Vec<TrustConnection>>> = RefCell::new(HashMap::new());
    static SAFETY_ALERTS: RefCell<HashMap<Principal, Vec<SafetyAlert>>> = RefCell::new(HashMap::new());
    static WALLET_STATS: RefCell<WalletStats> = RefCell::new(WalletStats::default());
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
    pub alert_type: String,        // "large_spending", "emotional_spending", "scam_risk", "new_connection"
    pub severity: String,          // "info", "warning", "critical"
    pub message: String,
    pub triggered_at: u64,
    pub acknowledged: bool,
    pub related_transaction: Option<String>,
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
                sorted_alerts.sort_by(|a, b| b.triggered_at.cmp(&a.triggered_at));
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
