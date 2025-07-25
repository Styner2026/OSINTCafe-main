import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface IdentityReport {
  'user_principal' : Principal,
  'identity_age' : string,
  'recommendations' : Array<string>,
  'trust_score' : number,
  'verified_by' : string,
  'risk_level' : string,
}
export type Result_IdentityReport = { 'Ok' : IdentityReport } |
  { 'Err' : string };
export type Result_Text = { 'Ok' : string } |
  { 'Err' : string };
export type Result_UserProfile = { 'Ok' : UserProfile } |
  { 'Err' : string };
export interface UserProfile {
  'user_principal' : Principal,
  'nickname' : [] | [string],
  'verification_level' : string,
  'created_at' : bigint,
  'trust_score' : number,
  'last_seen' : bigint,
}
export interface _SERVICE {
  'get_stats' : ActorMethod<[], Array<[string, bigint]>>,
  'set_nickname' : ActorMethod<[string], Result_Text>,
  'update_trust_score' : ActorMethod<[number], Result_Text>,
  'verify_identity' : ActorMethod<[], Result_IdentityReport>,
  'who_am_i' : ActorMethod<[], Result_UserProfile>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
