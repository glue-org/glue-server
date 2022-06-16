import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AccountIdentifier__1 = string;
export type CommonError = { 'InvalidToken' : TokenIdentifier } |
  { 'Other' : string };
export type Result_1 = { 'ok' : Array<TokenIndex> } |
  { 'err' : CommonError };
export type TokenIdentifier = string;
export type TokenIndex = number;
export interface _SERVICE {
  'tokens' : ActorMethod<[AccountIdentifier__1], Result_1>,
}
