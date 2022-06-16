import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type ManualReply_1 = { 'Ok' : Array<bigint> } |
  { 'Err' : NftError };
export type NftError = { 'UnauthorizedOperator' : null } |
  { 'SelfTransfer' : null } |
  { 'TokenNotFound' : null } |
  { 'UnauthorizedOwner' : null } |
  { 'SelfApprove' : null } |
  { 'OperatorNotFound' : null } |
  { 'ExistedNFT' : null } |
  { 'OwnerNotFound' : null };
export interface _SERVICE {
  'ownerTokenIdentifiers' : ActorMethod<[Principal], ManualReply_1>,
}
