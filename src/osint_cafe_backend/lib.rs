// OSINT Café - ICP Ninja "Who am I?" Backend
// Real Rust canister implementation for identity verification

use ic_cdk::api::caller;
use ic_cdk::{query, update};
use candid::{CandidType, Principal};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct UserProfile {
    pub principal: Principal,
    pub nickname: Option<String>,
    pub trust_score: u32,
    pub verification_level: String,
    pub created_at: u64,
    pub last_seen: u64,
}

#[derive(Clone, Debug, CandidType, Serialize, Deserialize)]
pub struct IdentityReport {
    pub principal: Principal,
    pub identity_age: String,
    pub trust_score: u32,
    pub risk_level: String,
    pub recommendations: Vec<String>,
    pub verified_by: String,
}

thread_local! {
    static USER_PROFILES: std::cell::RefCell<HashMap<Principal, UserProfile>> = std::cell::RefCell::new(HashMap::new());
}

// ICP Ninja: "Who am I?" - Core function
#[query]
pub fn who_am_i() -> Result<UserProfile, String> {
    let caller_principal = caller();
    
    // Anonymous principal check
    if caller_principal == Principal::anonymous() {
        return Err("Please authenticate with Internet Identity first".to_string());
    }

    USER_PROFILES.with(|profiles| {
        let profiles_map = profiles.borrow();
        
        match profiles_map.get(&caller_principal) {
            Some(profile) => Ok(profile.clone()),
            None => {
                // Create new profile for first-time user
                let new_profile = UserProfile {
                    principal: caller_principal,
                    nickname: None,
                    trust_score: 50, // Starting trust score
                    verification_level: "Basic".to_string(),
                    created_at: ic_cdk::api::time(),
                    last_seen: ic_cdk::api::time(),
                };
                Ok(new_profile)
            }
        }
    })
}

// Enhanced identity verification for OSINT Café
#[update]
pub fn verify_identity() -> Result<IdentityReport, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    let current_time = ic_cdk::api::time();
    
    USER_PROFILES.with(|profiles| {
        let mut profiles_map = profiles.borrow_mut();
        
        let profile = profiles_map.entry(caller_principal).or_insert_with(|| {
            UserProfile {
                principal: caller_principal,
                nickname: None,
                trust_score: 50,
                verification_level: "Basic".to_string(),
                created_at: current_time,
                last_seen: current_time,
            }
        });

        // Update last seen
        profile.last_seen = current_time;

        // Calculate identity age
        let identity_age_seconds = current_time.saturating_sub(profile.created_at) / 1_000_000_000;
        let identity_age = if identity_age_seconds < 3600 {
            format!("{} minutes", identity_age_seconds / 60)
        } else if identity_age_seconds < 86400 {
            format!("{} hours", identity_age_seconds / 3600)
        } else {
            format!("{} days", identity_age_seconds / 86400)
        };

        // Calculate risk level based on trust score and age
        let risk_level = if profile.trust_score >= 80 && identity_age_seconds > 86400 {
            "low".to_string()
        } else if profile.trust_score >= 60 || identity_age_seconds > 3600 {
            "medium".to_string()
        } else {
            "high".to_string()
        };

        // Generate recommendations
        let mut recommendations = vec![
            "🔐 Identity verified through Internet Computer Protocol".to_string(),
            format!("🎯 Trust score: {}/100", profile.trust_score),
            format!("📅 Identity age: {}", identity_age),
            "💎 Analysis enhanced with ICP blockchain verification".to_string(),
        ];

        if profile.trust_score < 70 {
            recommendations.push("⚠️ Low trust score - continue building reputation".to_string());
        }

        if identity_age_seconds < 3600 {
            recommendations.push("🆕 New identity - proceed with caution".to_string());
        }

        let report = IdentityReport {
            principal: caller_principal,
            identity_age,
            trust_score: profile.trust_score,
            risk_level,
            recommendations,
            verified_by: "ICP Ninja Canister v1.0".to_string(),
        };

        Ok(report)
    })
}

// Update user trust score (for OSINT Café reputation system)
#[update]
pub fn update_trust_score(new_score: u32) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    if new_score > 100 {
        return Err("Trust score cannot exceed 100".to_string());
    }

    USER_PROFILES.with(|profiles| {
        let mut profiles_map = profiles.borrow_mut();
        
        let profile = profiles_map.entry(caller_principal).or_insert_with(|| {
            UserProfile {
                principal: caller_principal,
                nickname: None,
                trust_score: 50,
                verification_level: "Basic".to_string(),
                created_at: ic_cdk::api::time(),
                last_seen: ic_cdk::api::time(),
            }
        });

        profile.trust_score = new_score;
        profile.last_seen = ic_cdk::api::time();

        Ok(format!("Trust score updated to {} for principal {}", new_score, caller_principal))
    })
}

// Set user nickname
#[update]
pub fn set_nickname(nickname: String) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    if nickname.len() > 32 {
        return Err("Nickname too long (max 32 characters)".to_string());
    }

    USER_PROFILES.with(|profiles| {
        let mut profiles_map = profiles.borrow_mut();
        
        let profile = profiles_map.entry(caller_principal).or_insert_with(|| {
            UserProfile {
                principal: caller_principal,
                nickname: None,
                trust_score: 50,
                verification_level: "Basic".to_string(),
                created_at: ic_cdk::api::time(),
                last_seen: ic_cdk::api::time(),
            }
        });

        profile.nickname = Some(nickname.clone());
        profile.last_seen = ic_cdk::api::time();

        Ok(format!("Nickname set to '{}' for principal {}", nickname, caller_principal))
    })
}

// Get platform statistics
#[query]
pub fn get_stats() -> HashMap<String, u64> {
    USER_PROFILES.with(|profiles| {
        let profiles_map = profiles.borrow();
        let mut stats = HashMap::new();
        
        stats.insert("total_users".to_string(), profiles_map.len() as u64);
        stats.insert("high_trust_users".to_string(), 
            profiles_map.values()
                .filter(|p| p.trust_score >= 80)
                .count() as u64
        );
        
        stats
    })
}
