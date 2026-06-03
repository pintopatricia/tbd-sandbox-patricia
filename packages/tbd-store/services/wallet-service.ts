/**
 * @file Manages wallet.
 */
import { WalletService } from "@flutter-global/uki-channels-http-clients";
import { createClientFactory } from "./client-factory";
import { WalletNames } from "../state/constants";

type Wallet = {
  walletName: string;
  status: string;
  amount?: number;
  availabletobet?: number;
  bonus?: number;
  bonuses?: number;
  deposits?: number;
  real?: number;
  winnings?: number;
};

const walletClientFactory = createClientFactory(WalletService);

export default {
  /**
   * Retrieve wallets
   *
   * @returns Returns the user wallets
   */
  async getWallets(walletList: WalletNames[]): Promise<Wallet[]> {
    const walletClient = walletClientFactory("WAS");
    const wallets = await walletClient.wallets(walletList);

    if (!wallets.length) {
      throw new Error(`An error occured while fetching wallets`);
    }

    const userServiceWallets: Wallet[] = wallets.map((userWallet) => {
      const formattedWallet: Wallet = {
        walletName: userWallet.walletName,
        status: userWallet.status,
      };
      const { details } = userWallet;
      if (
        details &&
        (details.amount ||
          details.availabletobet ||
          details.bonus ||
          details.bonuses ||
          details.deposits ||
          details.real ||
          details.winnings)
      ) {
        formattedWallet.amount = Number(details.amount || 0);
        formattedWallet.availabletobet = Number(details.availabletobet || 0);
        formattedWallet.bonus = Number(details.bonus || 0);
        formattedWallet.bonuses = Number(details.bonuses || 0);
        formattedWallet.deposits = Number(details.deposits || 0);
        formattedWallet.real = Number(details.real || 0);
        formattedWallet.winnings = Number(details.winnings || 0);
      }
      return formattedWallet;
    });
    return userServiceWallets;
  },
};
