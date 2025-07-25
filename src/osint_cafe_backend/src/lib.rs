use candid::{CandidType, Principal};
use ic_cdk::api::{caller, time};
use ic_cdk_macros::{query, update};
use serde::{Deserialize, Serialize};
use std::cell::RefCell;
use std::collections::HashMap;

// Thread-local storage for user profiles, encrypted notes, and file vault
thread_local! {
    static USER_PROFILES: RefCell<HashMap<Principal, UserProfile>> = RefCell::new(HashMap::new());
    static ENCRYPTED_NOTES: RefCell<HashMap<Principal, Vec<EncryptedNote>>> = RefCell::new(HashMap::new());
    static FILE_VAULT: RefCell<HashMap<Principal, Vec<SecureFile>>> = RefCell::new(HashMap::new());
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct UserProfile {
    pub user_principal: Principal,
    pub nickname: Option<String>,
    pub trust_score: u32,
    pub verification_level: String,
    pub created_at: u64,
    pub last_seen: u64,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct EncryptedNote {
    pub id: String,
    pub title: String,
    pub encrypted_content: String,
    pub created_at: u64,
    pub updated_at: u64,
    pub note_type: String, // "threat_report", "personal", "evidence"
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct SecureFile {
    pub id: String,
    pub filename: String,
    pub file_type: String,
    pub encrypted_data: Vec<u8>,
    pub file_size: u64,
    pub uploaded_at: u64,
    pub access_level: String, // "private", "shared", "evidence"
    pub description: String,
}

#[derive(Clone, Debug, CandidType, Deserialize)]
pub struct IdentityReport {
    pub user_principal: Principal,
    pub identity_age: String,
    pub trust_score: u32,
    pub risk_level: String,
    pub recommendations: Vec<String>,
    pub verified_by: String,
}

// Main "Who am I?" function - core ICP Ninja functionality
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
                    user_principal: caller_principal,
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

// Verify identity and generate security report
#[update]
pub fn verify_identity() -> Result<IdentityReport, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    USER_PROFILES.with(|profiles| {
        let mut profiles_map = profiles.borrow_mut();
        let current_time = time();
        
        let profile = profiles_map.entry(caller_principal).or_insert_with(|| {
            UserProfile {
                user_principal: caller_principal,
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
            user_principal: caller_principal,
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
                user_principal: caller_principal,
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
                user_principal: caller_principal,
                nickname: None,
                trust_score: 50,
                verification_level: "Basic".to_string(),
                created_at: ic_cdk::api::time(),
                last_seen: ic_cdk::api::time(),
            }
        });

        profile.nickname = Some(nickname.clone());
        profile.last_seen = ic_cdk::api::time();

        Ok(format!("Nickname set to {} for principal {}", nickname, caller_principal))
    })
}

// Get platform statistics
#[query]
pub fn get_stats() -> Vec<(String, u64)> {
    USER_PROFILES.with(|profiles| {
        let profiles_map = profiles.borrow();
        let mut stats = Vec::new();
        
        stats.push(("total_users".to_string(), profiles_map.len() as u64));
        stats.push(("high_trust_users".to_string(), 
            profiles_map.values()
                .filter(|p| p.trust_score >= 80)
                .count() as u64
        ));
        
        stats
    })
}

// ============ ENCRYPTED NOTES FUNCTIONS ============

// Store encrypted note
#[update]
pub fn store_encrypted_note(title: String, encrypted_content: String, note_type: String) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    if title.len() > 100 {
        return Err("Title too long (max 100 characters)".to_string());
    }

    if encrypted_content.len() > 10000 {
        return Err("Note content too long (max 10000 characters)".to_string());
    }

    let note_id = format!("note_{}_{}", time(), caller_principal);
    let current_time = time();

    let note = EncryptedNote {
        id: note_id.clone(),
        title,
        encrypted_content,
        created_at: current_time,
        updated_at: current_time,
        note_type,
    };

    ENCRYPTED_NOTES.with(|notes| {
        let mut notes_map = notes.borrow_mut();
        let user_notes = notes_map.entry(caller_principal).or_insert_with(Vec::new);
        user_notes.push(note);
        Ok(format!("Note stored with ID: {}", note_id))
    })
}

// Get user's encrypted notes
#[query]
pub fn get_encrypted_notes() -> Result<Vec<EncryptedNote>, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    ENCRYPTED_NOTES.with(|notes| {
        let notes_map = notes.borrow();
        match notes_map.get(&caller_principal) {
            Some(user_notes) => Ok(user_notes.clone()),
            None => Ok(Vec::new()),
        }
    })
}

// Delete encrypted note
#[update]
pub fn delete_encrypted_note(note_id: String) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    ENCRYPTED_NOTES.with(|notes| {
        let mut notes_map = notes.borrow_mut();
        match notes_map.get_mut(&caller_principal) {
            Some(user_notes) => {
                let initial_len = user_notes.len();
                user_notes.retain(|note| note.id != note_id);
                
                if user_notes.len() < initial_len {
                    Ok(format!("Note {} deleted successfully", note_id))
                } else {
                    Err("Note not found".to_string())
                }
            }
            None => Err("No notes found for user".to_string()),
        }
    })
}

// ============ FILE VAULT FUNCTIONS ============

// Upload encrypted file
#[update]
pub fn upload_secure_file(filename: String, file_type: String, encrypted_data: Vec<u8>, access_level: String, description: String) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    if filename.len() > 255 {
        return Err("Filename too long (max 255 characters)".to_string());
    }

    if encrypted_data.len() > 10_000_000 { // 10MB limit
        return Err("File too large (max 10MB)".to_string());
    }

    let file_id = format!("file_{}_{}", time(), caller_principal);
    let current_time = time();

    let secure_file = SecureFile {
        id: file_id.clone(),
        filename,
        file_type,
        encrypted_data,
        file_size: encrypted_data.len() as u64,
        uploaded_at: current_time,
        access_level,
        description,
    };

    FILE_VAULT.with(|vault| {
        let mut vault_map = vault.borrow_mut();
        let user_files = vault_map.entry(caller_principal).or_insert_with(Vec::new);
        user_files.push(secure_file);
        Ok(format!("File uploaded with ID: {}", file_id))
    })
}

// Get user's secure files (metadata only)
#[query]
pub fn get_secure_files() -> Result<Vec<(String, String, String, u64, u64, String)>, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    FILE_VAULT.with(|vault| {
        let vault_map = vault.borrow();
        match vault_map.get(&caller_principal) {
            Some(user_files) => {
                let file_metadata: Vec<(String, String, String, u64, u64, String)> = user_files
                    .iter()
                    .map(|file| (
                        file.id.clone(),
                        file.filename.clone(),
                        file.file_type.clone(),
                        file.file_size,
                        file.uploaded_at,
                        file.access_level.clone()
                    ))
                    .collect();
                Ok(file_metadata)
            }
            None => Ok(Vec::new()),
        }
    })
}

// Download secure file
#[query]
pub fn download_secure_file(file_id: String) -> Result<Vec<u8>, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    FILE_VAULT.with(|vault| {
        let vault_map = vault.borrow();
        match vault_map.get(&caller_principal) {
            Some(user_files) => {
                match user_files.iter().find(|file| file.id == file_id) {
                    Some(file) => Ok(file.encrypted_data.clone()),
                    None => Err("File not found".to_string()),
                }
            }
            None => Err("No files found for user".to_string()),
        }
    })
}

// Delete secure file
#[update]
pub fn delete_secure_file(file_id: String) -> Result<String, String> {
    let caller_principal = caller();
    
    if caller_principal == Principal::anonymous() {
        return Err("Authentication required".to_string());
    }

    FILE_VAULT.with(|vault| {
        let mut vault_map = vault.borrow_mut();
        match vault_map.get_mut(&caller_principal) {
            Some(user_files) => {
                let initial_len = user_files.len();
                user_files.retain(|file| file.id != file_id);
                
                if user_files.len() < initial_len {
                    Ok(format!("File {} deleted successfully", file_id))
                } else {
                    Err("File not found".to_string())
                }
            }
            None => Err("No files found for user".to_string()),
        }
    })
}
