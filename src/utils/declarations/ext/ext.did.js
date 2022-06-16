export const idlFactory = ({ IDL }) => {
  const AccountIdentifier__1 = IDL.Text;
  const TokenIndex = IDL.Nat32;
  const TokenIdentifier = IDL.Text;
  const CommonError = IDL.Variant({
    'InvalidToken' : TokenIdentifier,
    'Other' : IDL.Text,
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Vec(TokenIndex),
    'err' : CommonError,
  });
  return IDL.Service({
    'tokens' : IDL.Func([AccountIdentifier__1], [Result_1], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
