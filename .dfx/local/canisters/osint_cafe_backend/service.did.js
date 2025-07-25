export const idlFactory = ({ IDL }) => {
  const Result_Text = IDL.Variant({ 'Ok' : IDL.Text, 'Err' : IDL.Text });
  const IdentityReport = IDL.Record({
    'user_principal' : IDL.Principal,
    'identity_age' : IDL.Text,
    'recommendations' : IDL.Vec(IDL.Text),
    'trust_score' : IDL.Nat32,
    'verified_by' : IDL.Text,
    'risk_level' : IDL.Text,
  });
  const Result_IdentityReport = IDL.Variant({
    'Ok' : IdentityReport,
    'Err' : IDL.Text,
  });
  const UserProfile = IDL.Record({
    'user_principal' : IDL.Principal,
    'nickname' : IDL.Opt(IDL.Text),
    'verification_level' : IDL.Text,
    'created_at' : IDL.Nat64,
    'trust_score' : IDL.Nat32,
    'last_seen' : IDL.Nat64,
  });
  const Result_UserProfile = IDL.Variant({
    'Ok' : UserProfile,
    'Err' : IDL.Text,
  });
  return IDL.Service({
    'get_stats' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat64))],
        ['query'],
      ),
    'set_nickname' : IDL.Func([IDL.Text], [Result_Text], []),
    'update_trust_score' : IDL.Func([IDL.Nat32], [Result_Text], []),
    'verify_identity' : IDL.Func([], [Result_IdentityReport], []),
    'who_am_i' : IDL.Func([], [Result_UserProfile], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
