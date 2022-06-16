export const idlFactory = ({ IDL }) => {
  const NftError = IDL.Variant({
    'UnauthorizedOperator' : IDL.Null,
    'SelfTransfer' : IDL.Null,
    'TokenNotFound' : IDL.Null,
    'UnauthorizedOwner' : IDL.Null,
    'SelfApprove' : IDL.Null,
    'OperatorNotFound' : IDL.Null,
    'ExistedNFT' : IDL.Null,
    'OwnerNotFound' : IDL.Null,
  });
  const ManualReply_1 = IDL.Variant({
    'Ok' : IDL.Vec(IDL.Nat),
    'Err' : NftError,
  });
  return IDL.Service({
    'ownerTokenIdentifiers' : IDL.Func(
        [IDL.Principal],
        [ManualReply_1],
        ['query'],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
