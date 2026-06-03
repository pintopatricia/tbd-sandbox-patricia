import { WalletNameAndRule, WalletSection } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createSelector } from "reselect";
import { Jurisdiction as JurisdictionMap, WalletNames, WalletStatus } from "@ppb/tbd-store/state/constants";
import { UserWallets, WalletDetails } from "@ppb/tbd-store/state";
import { Jurisdiction } from "@ppb/tbd-store/config/Jurisdiction";
import { CashBalancesSimpleViewWallets } from "../components/UserProfile/snowflakes/CashBalancesSimpleView/CashBalancesSimpleView.web";
import { DetailedSummaryGroups } from "../components/MarketGraph/MarketGraphContent/snowflakes/DetailedSummary/DetailedSummary.types";
import { currencyFormatWithDecimalPlaces } from "../formatters/currency-formatters";
import { i18n } from "../helpers/i18n";

type WalletResponse = {
  walletName: string;
  formattedAmount: string;
  withCurrency: boolean;
  amount: number;
  walletKey: string;
};

enum CashBalancesSection {
  CASH = "CASH",
  SPORTSBOOK_BONUS = "SPORTSBOOK_BONUSES",
  EXCHANGE_BONUS = "EXCHANGE_BONUSES",
}

export function getWalletBasedOnRules(
  walletRule: WalletNameAndRule,
  wallets: UserWallets,
  currencyCode: string,
  localeCodeBcp47: string,
): WalletResponse {
  let formattedAmount = "NA";
  let walletsInfo;

  if (wallets) {
    walletsInfo = walletRule.aggregationRules?.reduce(
      (acc, walletAggregationRule) => {
        const { wallet, field, sign } = walletAggregationRule;
        if (!wallet) {
          return acc;
        }
        const walletInfo = wallets[wallet];
        const walletAmount = Number((walletInfo && field && walletInfo[field]) || 0);

        acc.amount += sign && sign === "-" ? -walletAmount : walletAmount;
        acc.walletFailed = walletInfo?.status !== WalletStatus.SUCCESS;
        acc.walletKey = walletAggregationRule.wallet ?? "";

        return acc;
      },
      {
        amount: 0,
        walletFailed: false,
        walletKey: "",
      },
    );

    if (walletsInfo && !walletsInfo.walletFailed) {
      formattedAmount = walletRule.withCurrency
        ? currencyFormatWithDecimalPlaces({ localeCodeBcp47, currencyCode, value: walletsInfo.amount })
        : String(walletsInfo.amount);
    }
  }

  return {
    walletName: walletRule.walletName ?? "",
    formattedAmount,
    withCurrency: walletRule.withCurrency,
    amount: walletsInfo?.amount ?? 0,
    walletKey: walletsInfo?.walletKey ?? "",
  };
}

export function generateCashBalances(
  wallets: UserWallets,
  walletsNamesAndRules: WalletNameAndRule[],
  currencyCode: string,
  localeCodeBcp47: string,
): DetailedSummaryGroups {
  const result: DetailedSummaryGroups = {
    title: i18n({ key: "I18N.CASH.BALANCE" }),
    groups: [],
  };

  walletsNamesAndRules.forEach((walletRule: WalletNameAndRule) => {
    const walletInfo = getWalletBasedOnRules(walletRule, wallets, currencyCode, localeCodeBcp47);

    result.groups.push({
      title: walletRule.walletName ?? "",
      amount: walletInfo.formattedAmount,
    });
  });

  return result;
}

export function generateBonusBalances(
  wallets: UserWallets,
  bonusBalances: WalletSection[],
  currencyCode: string,
  localeCodeBcp47: string,
): DetailedSummaryGroups {
  const result: DetailedSummaryGroups = {
    title: i18n({ key: "I18N.BONUS.BALANCES.NON.WITHDRAWABLE" }),
    groups: [],
  };

  bonusBalances.forEach((bonusSection: WalletSection) => {
    bonusSection.walletsNamesAndRules.forEach((walletRule: WalletNameAndRule) => {
      const walletInfo = getWalletBasedOnRules(walletRule, wallets, currencyCode, localeCodeBcp47);

      if (walletRule.hideIfZero !== true || walletInfo.amount != 0) {
        result.groups.push({
          title: walletRule.walletName ?? "",
          amount: walletInfo.formattedAmount,
        });
      }
    });
  });

  return result;
}

export function generateDetailedView(
  currencyCode: string,
  localeCodeBcp47: string,
  wallets: UserWallets,
  walletSection: WalletSection[],
): DetailedSummaryGroups[] {
  const [cashBalanceSection] = walletSection.filter((item) => item.sectionKey === CashBalancesSection.CASH);
  const bonusBalancesSections = walletSection.filter((item) => item.sectionKey !== CashBalancesSection.CASH);

  const cashBalances = generateCashBalances(
    wallets,
    cashBalanceSection.walletsNamesAndRules,
    currencyCode,
    localeCodeBcp47,
  );
  const bonusBalances = generateBonusBalances(wallets, bonusBalancesSections, currencyCode, localeCodeBcp47);

  return [cashBalances, bonusBalances];
}

const sortByCurrencyAndAmount = (
  walletA: WalletResponse | undefined,
  walletB: WalletResponse | undefined,
): 1 | -1 | 0 => {
  if (walletA && walletB) {
    if (walletA.withCurrency && !walletB.withCurrency) return -1;
    if (!walletA.withCurrency && walletB.withCurrency) return 1;
    if (walletA.amount < walletB.amount) return 1;
    if (walletA.amount > walletB.amount) return -1;
  }
  return 0;
};

const getFirstThreeWallets = (walletsBasedOnRules: WalletResponse[], jurisdiction: Jurisdiction) => {
  const mainWallet = jurisdiction === JurisdictionMap.ITALY ? WalletNames.ITA : WalletNames.MAIN;
  const orderedWalletsWithoutMain = walletsBasedOnRules
    .filter((wallet) => wallet.walletKey !== mainWallet)
    .sort(sortByCurrencyAndAmount);

  // First wallet is allways the main wallet regardless of wallet amount
  const simpleViewFirstWallet = walletsBasedOnRules.find((wallet) => wallet.walletKey === mainWallet);

  // Second and Third wallet ordered by the amount
  // If amount is the same, sports book wallet becomes the second wallet
  const [simpleViewSecondWallet, simpleViewThirdWallet] = orderedWalletsWithoutMain;
  if (simpleViewSecondWallet) {
    if (simpleViewThirdWallet) {
      const orderdWalletsWithSportsBookFirst =
        simpleViewThirdWallet.walletKey === WalletNames.SPORTSBOOK_BONUS_CASH &&
        simpleViewSecondWallet.amount === simpleViewThirdWallet.amount
          ? [simpleViewThirdWallet, simpleViewSecondWallet]
          : [simpleViewSecondWallet, simpleViewThirdWallet];

      return [simpleViewFirstWallet, ...orderdWalletsWithSportsBookFirst];
    }
    return [simpleViewFirstWallet, simpleViewSecondWallet];
  }

  return [simpleViewFirstWallet];
};

export const generateSimpleView = (
  currencyCode: string,
  localeCodeBcp47: string,
  wallets: UserWallets,
  walletSections: WalletSection[],
  jurisdiction: Jurisdiction,
): CashBalancesSimpleViewWallets[] => {
  const walletNamesAndRules = walletSections.reduce(
    (acc: WalletNameAndRule[], walletSection) => [...acc, ...walletSection.walletsNamesAndRules],
    [],
  );
  const getWalletNameAndRule = (walletName: string) =>
    walletNamesAndRules.find((wnr) => {
      if (jurisdiction === JurisdictionMap.ITALY) {
        return wnr.aggregationRules?.some((ar) => ar.wallet === walletName);
      }
      return wnr.aggregationRules?.every((ar) => ar.wallet === walletName);
    });

  if (wallets) {
    const wasWalletsWithAggregationRulles = (Object.values(wallets) as WalletDetails[]).filter(
      (wallet) =>
        wallet.status === "SUCCESS" &&
        walletNamesAndRules.some((wnr) => wnr.aggregationRules?.every((ar) => ar.wallet === wallet.walletName)),
    );

    const walletsBasedOnRules = wasWalletsWithAggregationRulles
      .map((walletWithAggregationRule) => {
        const walletNameAndRule = getWalletNameAndRule(walletWithAggregationRule.walletName);
        if (walletNameAndRule) {
          return getWalletBasedOnRules(walletNameAndRule, wallets, currencyCode, localeCodeBcp47);
        }
        return undefined;
      })
      .filter((walletsResponse) => walletsResponse !== undefined) as WalletResponse[];

    const walletsResponse = getFirstThreeWallets(walletsBasedOnRules, jurisdiction).filter(
      (wallet) => wallet !== undefined,
    ) as WalletResponse[];

    return walletsResponse.map((wallet) => ({
      title: wallet.walletName,
      subTitle: "",
      amount: wallet.formattedAmount,
    }));
  }

  return [];
};

export const createPropsForCashBalances = () =>
  createSelector(
    [
      (
        currencyCode: string,
        localeCodeBcp47: string,
        wallets: UserWallets,
        walletSection: WalletSection[],
        jurisdiction: Jurisdiction,
      ) => ({
        currencyCode,
        localeCodeBcp47,
        wallets,
        walletSection,
        jurisdiction,
      }),
    ],
    (res) => {
      const { currencyCode, localeCodeBcp47, wallets, walletSection, jurisdiction } = res;
      let simpleView: CashBalancesSimpleViewWallets[] = [];
      let detailedView: DetailedSummaryGroups[] = [];

      if (walletSection.length) {
        simpleView = generateSimpleView(currencyCode, localeCodeBcp47, wallets, walletSection, jurisdiction);
        detailedView = generateDetailedView(currencyCode, localeCodeBcp47, wallets, walletSection);
      }

      return {
        simpleViewBalances: simpleView,
        detailedViewBalance: detailedView,
      };
    },
  );
