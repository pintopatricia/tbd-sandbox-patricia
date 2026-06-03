import { WalletNames, WalletStatus } from "../../constants";

export type WalletDetails = {
  walletName: WalletNames;
  status: WalletStatus;
} & { [key: string]: number };

type WalletError = {
  error?: string;
};

/**
 * A key-value structure where the key is a unique identifier (wallet name in this case) stored on the value too
 *
 * @example
 * {
 *    "MAINWALLET": { walletName: "MAINWALLET", amount: 123, ... }
 * }
 */
export type UserWallets = ({ [walletName in WalletNames]?: WalletDetails } & WalletError) | null;
