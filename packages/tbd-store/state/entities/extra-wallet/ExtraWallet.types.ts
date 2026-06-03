import { WalletTypes } from "../../../clients/catalogue/catalogue-response-types";
import URN from "../../layout/URN";

export type ExtraWallet = {
  typename: "ExtraWallet";
  urn: URN;
  walletId: string;
  indexedId?: string;
  amount: number;
  expirationDate?: string;
  walletType?: WalletTypes;
  lostLegs?: number;
  maxReturn?: number;
  maxFinPos?: number;
  ghostLegs?: number;
  fixedOdds?: number;
};

export type ExtraWallets = {
  [urn: string]: ExtraWallet;
};
