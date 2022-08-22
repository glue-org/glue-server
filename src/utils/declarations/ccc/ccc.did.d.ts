import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export type AirDropResponse = { 'ok' : CanvasIdentity } |
  {
    'err' : { 'AlreadyCliam' : null } |
      { 'NotInAirDropListOrAlreadyCliam' : null } |
      { 'NotEnoughToMint' : null }
  };
export interface AirDropStruct { 'user' : Principal, 'remainTimes' : bigint }
export interface BuyRequest {
  'tokenIndex' : TokenIndex,
  'price' : bigint,
  'marketFeeRatio' : bigint,
  'feeTo' : Principal,
}
export type BuyResponse = { 'ok' : TokenIndex } |
  {
    'err' : { 'NotAllowBuySelf' : null } |
      { 'InsufficientBalance' : null } |
      { 'AlreadyTransferToOther' : null } |
      { 'NotFoundIndex' : null } |
      { 'Unauthorized' : null } |
      { 'Other' : null } |
      { 'LessThanFee' : null } |
      { 'AllowedInsufficientBalance' : null }
  };
export interface CanvasIdentity {
  'photoLink' : [] | [string],
  'videoLink' : [] | [string],
  'index' : TokenIndex,
}
export interface ComponentAttribute { 'name' : string, 'traitType' : string }
export interface GetListingsRes {
  'listings' : Listings__1,
  'rarityScore' : number,
}
export interface GetSoldListingsRes {
  'listings' : SoldListings,
  'rarityScore' : number,
}
export type GetTokenResponse = { 'ok' : TokenDetails } |
  { 'err' : { 'NotFoundIndex' : null } };
export interface ListRequest { 'tokenIndex' : TokenIndex, 'price' : bigint }
export type ListResponse = { 'ok' : TokenIndex } |
  {
    'err' : { 'NotApprove' : null } |
      { 'NotNFT' : null } |
      { 'NotFoundIndex' : null } |
      { 'SamePrice' : null } |
      { 'NotOwner' : null } |
      { 'Other' : null } |
      { 'MarketNotOpen' : null } |
      { 'AlreadyList' : null }
  };
export interface Listings {
  'tokenIndex' : TokenIndex,
  'time' : Time,
  'seller' : Principal,
  'price' : bigint,
}
export interface Listings__1 {
  'tokenIndex' : TokenIndex,
  'time' : Time,
  'seller' : Principal,
  'price' : bigint,
}
export type MintResponse = { 'ok' : Array<CanvasIdentity> } |
  {
    'err' : { 'NotOpen' : null } |
      { 'NotWhiteListOrMaximum' : null } |
      { 'SoldOut' : null } |
      { 'InsufficientBalance' : null } |
      { 'Unauthorized' : null } |
      { 'Other' : null } |
      { 'NotEnoughToMint' : null } |
      { 'LessThanFee' : null } |
      { 'AllowedInsufficientBalance' : null }
  };
export interface NFTLinkInfo {
  'id' : TokenIndex,
  'photoLink' : string,
  'videoLink' : string,
}
export interface NFTStoreInfo {
  'photoLink' : [] | [string],
  'videoLink' : [] | [string],
  'index' : TokenIndex,
}
export type OpenBoxResponse = { 'ok' : CanvasIdentity } |
  {
    'err' : { 'NotOpen' : null } |
      { 'NotOwner' : null } |
      { 'AlreadyOpen' : null }
  };
export interface PreMint { 'user' : Principal, 'index' : bigint }
export interface SoldListings {
  'lastPrice' : bigint,
  'time' : Time,
  'account' : bigint,
}
export type Time = bigint;
export interface TokenDetails {
  'id' : bigint,
  'attrArr' : Array<ComponentAttribute>,
  'rarityScore' : number,
}
export type TokenIndex = bigint;
export type TokenIndex__1 = bigint;
export type TransferResponse = { 'ok' : TokenIndex } |
  {
    'err' : { 'ListOnMarketPlace' : null } |
      { 'NotAllowTransferToSelf' : null } |
      { 'NotOwnerOrNotApprove' : null } |
      { 'Other' : null }
  };
export interface _SERVICE {
  'approve' : ActorMethod<[Principal, TokenIndex__1], boolean>,
  'bBlindBoxOpen' : ActorMethod<[TokenIndex__1], boolean>,
  'balanceOf' : ActorMethod<[Principal], bigint>,
  'batchTransferFrom' : ActorMethod<
    [Principal, Array<Principal>, Array<TokenIndex__1>],
    TransferResponse,
  >,
  'buyNow' : ActorMethod<[BuyRequest], BuyResponse>,
  'cancelFavorite' : ActorMethod<[TokenIndex__1], boolean>,
  'cancelList' : ActorMethod<[TokenIndex__1], ListResponse>,
  'checkIfWhiteList' : ActorMethod<[Principal], bigint>,
  'clearAirDrop' : ActorMethod<[], boolean>,
  'clearWhiteList' : ActorMethod<[], boolean>,
  'cliamAirdrop' : ActorMethod<[], AirDropResponse>,
  'deleteAirDrop' : ActorMethod<[Principal], boolean>,
  'getAirDropLeft' : ActorMethod<[], Array<[Principal, bigint]>>,
  'getAirDropRemain' : ActorMethod<[Principal], bigint>,
  'getAirDropStartTime' : ActorMethod<[], Time>,
  'getAll' : ActorMethod<[], Array<[TokenIndex__1, Principal]>>,
  'getAllHistoryStorageCanisterId' : ActorMethod<[], Array<Principal>>,
  'getAllNFT' : ActorMethod<[Principal], Array<[TokenIndex__1, Principal]>>,
  'getAllNftCanister' : ActorMethod<[], Array<Principal>>,
  'getAllNftLinkInfo' : ActorMethod<[], Array<[TokenIndex__1, NFTLinkInfo]>>,
  'getAllUserNFT' : ActorMethod<[Principal], Array<NFTStoreInfo>>,
  'getApproved' : ActorMethod<[TokenIndex__1], [] | [Principal]>,
  'getAvailableMint' : ActorMethod<[], Array<[TokenIndex__1, boolean]>>,
  'getBlindBoxLink' : ActorMethod<[], [string, string]>,
  'getBlindTime' : ActorMethod<[], [Time, Time]>,
  'getCirculation' : ActorMethod<[], bigint>,
  'getCycles' : ActorMethod<[], bigint>,
  'getLinkInfoByIndex' : ActorMethod<
    [TokenIndex__1],
    [[] | [string], [] | [string]],
  >,
  'getLinkInfoByIndexArr' : ActorMethod<
    [Array<TokenIndex__1>],
    Array<[[] | [string], [] | [string]]>,
  >,
  'getListings' : ActorMethod<[], Array<[NFTStoreInfo, GetListingsRes]>>,
  'getMaxMarketFeeRatio' : ActorMethod<[], bigint>,
  'getMintAccount' : ActorMethod<[], bigint>,
  'getMintPrice' : ActorMethod<[], Array<[bigint, bigint]>>,
  'getNftHoldInfo' : ActorMethod<[], Array<[Principal, bigint]>>,
  'getNftLinkInfo' : ActorMethod<[TokenIndex__1], [] | [NFTLinkInfo]>,
  'getNftStoreCIDByIndex' : ActorMethod<[TokenIndex__1], Principal>,
  'getOpenTime' : ActorMethod<[], [Time, Time]>,
  'getOwnerSize' : ActorMethod<[], bigint>,
  'getRegistry' : ActorMethod<[], Array<[Principal, Array<NFTStoreInfo>]>>,
  'getRoyaltyFeeRatio' : ActorMethod<[], bigint>,
  'getRoyaltyFeeTo' : ActorMethod<[], Principal>,
  'getSaleInfo' : ActorMethod<[], [bigint, bigint]>,
  'getSoldListings' : ActorMethod<
    [],
    Array<[NFTStoreInfo, GetSoldListingsRes]>,
  >,
  'getStorageCanisterId' : ActorMethod<[], [] | [Principal]>,
  'getSuppy' : ActorMethod<[], bigint>,
  'getTokenById' : ActorMethod<[bigint], GetTokenResponse>,
  'getWICPCanisterId' : ActorMethod<[], Principal>,
  'getWhiteList' : ActorMethod<[], Array<[Principal, bigint]>>,
  'getWhiteListPrice' : ActorMethod<[], Array<[bigint, bigint]>>,
  'getbOpenMarket' : ActorMethod<[], boolean>,
  'isApprovedForAll' : ActorMethod<[Principal, Principal], boolean>,
  'isList' : ActorMethod<[TokenIndex__1], [] | [Listings]>,
  'list' : ActorMethod<[ListRequest], ListResponse>,
  'mint' : ActorMethod<[bigint], MintResponse>,
  'newStorageCanister' : ActorMethod<[Principal], boolean>,
  'openBlindBox' : ActorMethod<[TokenIndex__1], OpenBoxResponse>,
  'ownerOf' : ActorMethod<[TokenIndex__1], [] | [Principal]>,
  'preMint' : ActorMethod<[Array<PreMint>], bigint>,
  'proAvailableMint' : ActorMethod<[], boolean>,
  'setAirDropStartTime' : ActorMethod<[Time], boolean>,
  'setApprovalForAll' : ActorMethod<[Principal, boolean], boolean>,
  'setBlindBoxLink' : ActorMethod<[NFTLinkInfo], boolean>,
  'setCapacity' : ActorMethod<[bigint], boolean>,
  'setFavorite' : ActorMethod<[TokenIndex__1], boolean>,
  'setMaxMarketFeeRatio' : ActorMethod<[bigint], boolean>,
  'setMintAccount' : ActorMethod<[bigint], boolean>,
  'setMintFeeRatio' : ActorMethod<[bigint], boolean>,
  'setMintPrice' : ActorMethod<[Array<[bigint, bigint]>], boolean>,
  'setNftCanister' : ActorMethod<[Array<Principal>], boolean>,
  'setNftLinkInfo' : ActorMethod<[Array<NFTLinkInfo>], boolean>,
  'setOwner' : ActorMethod<[Principal], boolean>,
  'setRoyaltyFeeTo' : ActorMethod<[Principal], boolean>,
  'setRoyaltyfeeRatio' : ActorMethod<[bigint], boolean>,
  'setStorageCanisterId' : ActorMethod<[[] | [Principal]], boolean>,
  'setSuppy' : ActorMethod<[bigint], boolean>,
  'setTime' : ActorMethod<[Array<Time>], boolean>,
  'setWICPCanisterId' : ActorMethod<[Principal], boolean>,
  'setWhiteListPrice' : ActorMethod<[Array<[bigint, bigint]>], boolean>,
  'setbOpenMarket' : ActorMethod<[boolean], boolean>,
  'transferFrom' : ActorMethod<
    [Principal, Principal, TokenIndex__1],
    TransferResponse,
  >,
  'updateList' : ActorMethod<[ListRequest], ListResponse>,
  'uploadAirDropList' : ActorMethod<[Array<AirDropStruct>], boolean>,
  'uploadWhiteList' : ActorMethod<[Array<Principal>], boolean>,
  'wallet_receive' : ActorMethod<[], bigint>,
  'whiteListMint' : ActorMethod<[bigint], MintResponse>,
}
