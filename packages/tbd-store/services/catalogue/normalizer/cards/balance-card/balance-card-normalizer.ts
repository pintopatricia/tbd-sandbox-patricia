/* eslint-disable no-underscore-dangle */
import {
  BalanceCard,
  WalletSection,
  WalletAggregationRule,
  WalletDetailsKeys,
  WalletNameAndRule,
  WalletSign,
} from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";
import {
  BalanceCardFragment,
  WalletSectios,
  WalletAggregationRule as WalletAggregationRuleGQL,
  WalletRule as WalletRuleGQL,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { WalletNames } from "../../../../../state/constants";

function isNotNull<T>(it: T): it is NonNullable<T> {
  return it !== null;
}

export const getWalletSign = (sign: string): WalletSign | undefined => {
  if (sign === "+") {
    return "+";
  }
  if (sign === "-") {
    return "-";
  }
  return undefined;
};

const getWalletAggregationRule = (aggregationRule: WalletAggregationRuleGQL): WalletAggregationRule => ({
  field: aggregationRule.field ? (aggregationRule.field as WalletDetailsKeys) : undefined,
  sign: aggregationRule.sign ? getWalletSign(aggregationRule.sign) : undefined,
  wallet: aggregationRule.wallet ? (aggregationRule.wallet as WalletNames) : undefined,
});

const getWalletRule = (walletRule: WalletRuleGQL): WalletNameAndRule => ({
  walletName: walletRule.name ?? undefined,
  hideIfZero: walletRule.hideIfZero ?? undefined,
  aggregationRules: walletRule.aggregationRules
    ? walletRule.aggregationRules
        .filter((element): element is WalletAggregationRuleGQL => isNotNull(element))
        .map((element) => getWalletAggregationRule(element))
    : undefined,

  withCurrency: walletRule.withCurrency,
});

const getWalletSection = (walletSection: WalletSectios): WalletSection => ({
  walletsNamesAndRules: walletSection.walletRules.map((element) => getWalletRule(element)),
  sectionKey: walletSection.key ?? undefined,
  sectionName: walletSection.name ?? undefined,
  sectionNameLabel: walletSection.label ?? undefined,
});

const normalizeBalanceCardFragmentIntoBalanceCard = (
  balanceCard: BalanceCardFragment,
): TransformedFragment<BalanceCard> => ({
  data: {
    typename: balanceCard.__typename,
    urn: balanceCard.urn,
    wasWallets: balanceCard.wallets
      .map((wallet) => (wallet.name ? wallet.name : undefined))
      .filter((walletName) => walletName !== undefined) as WalletNames[],
    walletSections: balanceCard.walletSections.map((walletSection) => getWalletSection(walletSection)),
  },
});

export default normalizeBalanceCardFragmentIntoBalanceCard;
