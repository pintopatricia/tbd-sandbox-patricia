import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  FETCH_CATALOGUE,
  FetchCatalogueAction,
  UPDATE_CURRENT_BANNER,
  UpdateCurrentBannerAction,
  BannerActionRequest,
  BANNER_ACTION_REQUEST,
} from "@ppb/tbd-store/actions/catalogue";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { getUserWallets } from "@ppb/tbd-store/state/entities/user-wallets/user-wallets-selectors";
import { PushAction, PUSH, ExternalPushAction, EXTERNAL_PUSH } from "@ppb/tbd-store/actions/router";
import {
  createAccountBannersCardBySelector,
  createLinksSelector,
  createMyAccountInterfaceStateSelector,
  createMyAccountViewItemsSelector,
  createQuickLinksSelector,
  createRewardsCardBySelector,
  createWalletNamesSelector,
  createWalletSectionsSelector,
} from "@ppb/tbd-store/state/layout/cards/my-account/my-account-selectors";
import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { createNextBreachableLimitSelector } from "@ppb/tbd-store/state/layout/cards/budget-limits/budget-limits-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { CountryCode, UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import {
  UI__USER_PROFILE_EYE_ICON_CLICK,
  UI__USER_PROFILE_MENU_LINK_CLICK,
  UI__USER_PROFILE_QUICK_LINK_CLICK,
  UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK,
  UI__USER_PROFILE_BUDGET_LINK_CLICK,
  UserProfileMenuEyeIconClickAction,
  UserProfileMenuLinkClickAction,
  UserProfileQuickLinkClickAction,
  UserProfileToggleCashBalancesViewClickAction,
  UserProfileBudgetLinkClickAction,
} from "@ppb/tbd-store/actions/user-profile";
import { UI__USER_LOGOUT_CLICK, UserLogoutClickAction } from "@ppb/tbd-store/actions/interface";
import { FetchUserWalletsAction, FETCH_USER_WALLETS } from "@ppb/tbd-store/actions/user-wallets";
import { ActiveProduct, BetslipStep } from "@ppb/tbd-store/state/betslip/Betslip.types";
import {
  Amount,
  BenefitAccess,
  BenefitsPackages,
  BenefitsPackageSection,
  MenuSection,
  WalletSection,
  BannerDetails,
  AccountBannerOnError,
  BannerCTA,
  BalanceCards,
  QuickLinksCards,
  BudgetLimit as BudgetLimitCard,
} from "@ppb/tbd-store/state/layout/cards/Card.types";
import { LinkItem } from "@ppb/the-wall-common/types";
import { EntityType } from "@ppb/tbd-urn-codecs";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  BettingExchangePlaceBetsAction,
  BettingExchangeUnmatchedUpdate,
  BettingSportsbookClearAction,
  BettingSportsbookPlaceBetsAction,
  BETTING__EXC_PLACE_BETS,
  BETTING__EXC_UNMATCHED_UPDATE,
  BETTING__SBK_CLEAR_ACTION,
  BETTING__SBK_PLACE_BETS,
  BettingObbClearAction,
  BETTING__OBB_CLEAR_ACTION,
} from "@ppb/tbd-store/actions/betting";
import {
  DepositSuccessAction,
  DEPOSIT_SUCCESS,
  DEPOSIT_FLOW,
  DepositFlowAction,
  FIRST_DEPOSIT_SUCCESS,
  FirstDepositSuccessAction,
} from "@ppb/tbd-store/actions/deposit";
import { createGetThrottleSelector, PYWDepositSuccessEvent } from "@ppb/tbd-store/state/entities";
import { WalletNames } from "@ppb/tbd-store/state/constants";
import { RewardsStatus } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import {
  currencyFormatWithDecimalPlaces,
  currencyFormatWithoutDecimalPlaces,
} from "../../formatters/currency-formatters";
import { i18n } from "../../helpers/i18n";
import { createPropsForCashBalances } from "../../view-model-factories/cash-balances";
import { getEndpoint, getProdIdConfig } from "../../config/endpoints";
import { UserProfileMenus, UserProfileNoPlanSelected } from "./snowflakes/UserProfile/UserProfile.web";
import { CashBalancesSimpleViewWallets } from "./snowflakes/CashBalancesSimpleView/CashBalancesSimpleView.web";
import { BudgetLimit } from "./snowflakes/Budget/Budget.web";
import { DetailedSummaryGroups } from "../MarketGraph/MarketGraphContent/snowflakes/DetailedSummary/DetailedSummary.types";
import { UserQuickMenuItem } from "./snowflakes/UserQuickMenu/UserQuickMenu.web";
import { getUnreadNotificationsCount } from "@ppb/tbd-store/state/notifications-center/notifications-center-selectors";

enum PackageLevelKey {
  BETTER = "BETTER",
  BEST = "BEST",
  GOOD = "GOOD",
}

enum AccessLevelKey {
  NONE = "NONE",
  STANDARD = "STANDARD",
  EXTENDED = "EXTENDED",
}

type CountryLocalCurrencyCode = {
  countryCode: CountryCode;
  currencyCode: string;
  localeCodeBcp47: string;
};

type Bets = {
  totalBets: number;
  currentBets: number;
};

type BetslipDepositRedirect = {
  isDepositRedirect: boolean;
  activeProduct: ActiveProduct;
  step: BetslipStep;
  betId: string;
  exchangeMarket?: string;
  exchangeRunner?: string;
};

export type UserProfileLinks = {
  rewardsLink: string;
  chooseRewardsLink: string;
  promosLink: string;
  applePay: string;
};

export type DepositSuccessfulLabels = {
  depositSuccessful: string;
  placingBet: string;
};

export type RewardMonthType = {
  month?: string;
  monthMessage: string;
  bets?: Bets;
  url?: string;
  target?: string;
};

export type CardProps = {
  rewards: RewardMonthType[] | null;
  rewardsTitle: string | null;
  basicPlan: LinkItem | null;
  noPlanSelected: UserProfileNoPlanSelected[] | null;
  packageLevelValue: string;
  lastLoginDate?: string;
  groupsMenu: UserProfileMenus[];
  quickMenuItems: UserQuickMenuItem[];
  firstName: string;
  simpleView: CashBalancesSimpleViewWallets[];
  detailedView: DetailedSummaryGroups[];
  showBalances: boolean;
  walletsToCallWasService: WalletNames[];
  currentViewURN: string;
  jurisdiction: string;
  currentBanner: BannerDetails | AccountBannerOnError | null;
  accountBannersCardURN: string | undefined;
  budgetLimit: BudgetLimit | null;
  depositSuccessfulLabels: DepositSuccessfulLabels;
  betslipDepositRedirect: BetslipDepositRedirect;
  isLoggedIn: boolean;
  wizardUrl?: string | null;
  userProfileLinks: UserProfileLinks;
  hasUnreadNotifications: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const buildUserProfileMenu = (menuSection: MenuSection): UserProfileMenus => {
  const title = menuSection.title ?? "";
  const sectionLabel = menuSection.sectionLabel ?? "";

  // ToDo - inline if for section type breaks jest tests, maybe it's worth checking why, different typescript version or loader ?
  return menuSection.sectionType === "ACCORDION"
    ? {
        groupsMenuItem: {
          ...menuSection,
          title,
          sectionLabel,
          sectionType: "ACCORDION",
          collapsed: false,
          items: menuSection.items.map((item) => ({
            ...item,
            type: "LINK",
            alignment: item.alignment,
          })),
        },
      }
    : {
        groupsMenuItem: {
          ...menuSection,
          title,
          sectionLabel,
          sectionType: "GENERIC",
          items: menuSection.items.map((item) => ({
            ...item,
            type: "LINK",
            alignment: item.alignment,
          })),
        },
      };
};

export const createMyRewardsAndRewardsPlus = (
  rewardsMenu: BenefitsPackages,
  userProfileLinks: UserProfileLinks,
): RewardMonthType[] => {
  const {
    chosenBenefitsPackage,
    qualifiedBenefitsPackage,
    currentMonthTradedMarkets,
    nextMonth,
    currentMonth,
    lastMonthTradedMarkets,
  } = rewardsMenu;
  const totalBets = chosenBenefitsPackage?.requiredMarketBets;
  const chosenCriteriaType = chosenBenefitsPackage?.criteriaType;
  const currentBets = currentMonthTradedMarkets;
  const bets = typeof totalBets === "number" && typeof currentBets === "number" ? { totalBets, currentBets } : null;
  const remainingBets = totalBets && currentBets ? totalBets - currentBets : totalBets;
  const months = [];

  let chosenMonthMessage: string;
  const isQualified = totalBets && currentBets && currentBets >= totalBets;

  if (!isQualified) {
    chosenMonthMessage =
      chosenCriteriaType === "SUM_EXCH_SBK"
        ? i18n({
            key: "I18N.NEXT_MONTH_MESSAGE.SUM_EXCH_SBK",
            interpolationValues: { numberOfMarketsPrefix: `<span> ${remainingBets}`, numberOfMarketsSuffix: `</span>` },
          })
        : i18n({
            key: "I18N.NEXT_MONTH_MESSAGE.EXCH_MARKETS",
            interpolationValues: { numberOfMarketsPrefix: `<span> ${remainingBets}`, numberOfMarketsSuffix: `</span>` },
          });
  } else {
    chosenMonthMessage = i18n({
      key: "I18N.NEXT_MONTH_QUALIFIED_MESSAGE",
    });
  }

  if (nextMonth && bets) {
    months.push({
      month: nextMonth,
      monthMessage: chosenMonthMessage,
      bets,
      url: userProfileLinks.rewardsLink,
    });
  }

  const failedMessage = (benefitsPackage: BenefitsPackageSection | null, tradedMarkets: number): void => {
    const currentMonthMessage =
      benefitsPackage?.criteriaType === "SUM_EXCH_SBK"
        ? i18n({
            key: "I18N.CURRENT_MONTH_FAILED_MESSAGE.SUM_EXCH_SBK",
            interpolationValues: { numberOfMarkets: `${tradedMarkets}` },
          })
        : i18n({
            key: "I18N.CURRENT_MONTH_FAILED_MESSAGE.EXCH_MARKETS",
            interpolationValues: { numberOfMarkets: `${tradedMarkets}` },
          });
    months.push({
      month: currentMonth,
      monthMessage: currentMonthMessage,
    });
  };

  const congratsMessage = (benefitsPackage: BenefitsPackageSection | null): void => {
    const rewardsType = benefitsPackage?.packageLevel === PackageLevelKey.BETTER ? "Rewards" : "Rewards+";
    const currentMonthMessage = i18n({
      key: "I18N.CURRENT_MONTH_CONGRATS_MESSAGE",
      interpolationValues: {
        clickLink: `<a href=${userProfileLinks.promosLink} style="color: #4995ed" target="_blank"> Click link </a>`,
        packageType: `${rewardsType}`,
      },
    });
    months.push({
      month: currentMonth,
      monthMessage: currentMonthMessage,
    });
  };

  const qualifiedBenefitsRequiredBets = qualifiedBenefitsPackage && qualifiedBenefitsPackage.requiredMarketBets;
  const chosenBenefitsRequiredBets = qualifiedBenefitsPackage && qualifiedBenefitsPackage.requiredMarketBets;

  if (lastMonthTradedMarkets !== undefined && lastMonthTradedMarkets !== null && qualifiedBenefitsRequiredBets) {
    if (lastMonthTradedMarkets < qualifiedBenefitsRequiredBets) {
      failedMessage(qualifiedBenefitsPackage, lastMonthTradedMarkets);
    } else {
      congratsMessage(qualifiedBenefitsPackage);
    }
  } else if (
    currentMonthTradedMarkets !== undefined &&
    currentMonthTradedMarkets !== null &&
    chosenBenefitsRequiredBets
  ) {
    if (currentMonthTradedMarkets < chosenBenefitsRequiredBets) {
      failedMessage(chosenBenefitsPackage, currentMonthTradedMarkets);
    } else {
      congratsMessage(chosenBenefitsPackage);
    }
  }

  return months;
};

export const createBasicPlan = (userProfileLinks: UserProfileLinks): LinkItem => ({
  target: "_self",
  text: i18n({
    key: "I18N.BASIC_PLAN",
  }),
  viewLink: {
    viewUrl: userProfileLinks.rewardsLink,
    viewUrn: "",
  },
});

const typeMapping = (
  key: string | null,
  value: string | null,
  countryLocalCurrencyCode: CountryLocalCurrencyCode,
): string | null => {
  const CURRENCY = value
    ? currencyFormatWithoutDecimalPlaces({ ...countryLocalCurrencyCode, value: parseFloat(value) })
    : "";
  const mapping: { [key: string]: string } = {
    INTEGER: `${value}`,
    PERCENT: `${value}%`,
    CURRENCY,
  };
  return key ? mapping[key] : null;
};

const mapBenefitNames = (
  key: string,
  quantity: Amount | null,
  accessLevel: string | null,
  countryLocalCurrencyCode: CountryLocalCurrencyCode,
): string => {
  const mappings: { [key: string]: string } =
    accessLevel === AccessLevelKey.NONE
      ? {
          LOSS_REFUND: i18n({ key: "I18N.NO_LOSS_REFUND" }),
          BEAT_THE_DROP: i18n({ key: "I18N.NO_BEAT_THE_DROP" }),
          FREE_ACCA: i18n({ key: "I18N.NO_FREE_ACCA" }),
          FREE_SPINS: i18n({ key: "I18N.NO_FREE_SPINS" }),
          CASH_RACE: i18n({ key: "I18N.NO_CASH_RACE" }),
          PROMO_ACCESS: i18n({ key: "I18N.NO_PROMO_ACCESS" }),
          BEST_ODDS_SBK: i18n({ key: "I18N.NO_BEST_ODDS_SBK" }),
          BETFAIR_SELECT: i18n({ key: "I18N.REWARDS.NO_BETFAIR_SELECT" }),
        }
      : {
          LOSS_REFUND: i18n({ key: "I18N.LOSS_REFUND" }),
          BEAT_THE_DROP: i18n({ key: "I18N.BEAT_THE_DROP" }),
          FREE_ACCA: i18n({ key: "I18N.FREE_ACCA" }),
          FREE_SPINS: i18n({ key: "I18N.FREE_SPINS" }),
          CASH_RACE: i18n({ key: "I18N.CASH_RACE" }),
          PROMO_ACCESS: i18n({ key: "I18N.PROMO_ACCESS" }),
          BEST_ODDS_SBK: i18n({ key: "I18N.BEST_ODDS_SBK" }),
          BETFAIR_BOOST: i18n({ key: "I18N.REWARDS.BETFAIR_BOOST" }), // cannot have AccessLevelKey.NONE
          CASH_BONUS: i18n({ key: "I18N.REWARDS.CASH_BONUS" }), // cannot have AccessLevelKey.NONE
          EXC_FREE_BET: i18n({ key: "I18N.REWARDS.EXC_FREE_BET" }), // cannot have AccessLevelKey.NONE
          CASINO_BONUS: i18n({ key: "I18N.REWARDS.CASINO_BONUS" }), // cannot have AccessLevelKey.NONE
        };

  return quantity
    ? `${typeMapping(quantity.type, quantity.value, countryLocalCurrencyCode)} ${mappings[key] || key}`
    : mappings[key] || key;
};

export const createNoPlanSelected = (
  rewardsMenu: BenefitsPackages,
  countryLocalCurrencyCode: CountryLocalCurrencyCode,
): UserProfileNoPlanSelected[] | null => {
  if (!rewardsMenu.availablePackages) {
    return null;
  }
  return rewardsMenu.availablePackages.map((availablePackage) => {
    const excludedBenefitsList = availablePackage?.excludedBenefits?.map((item: BenefitAccess) => item.type);
    const result = {
      packageLevel: availablePackage.packageLevel,
      packages: availablePackage.benefits
        ? availablePackage.benefits
            .filter((benefit) => !benefit.hidden && excludedBenefitsList?.indexOf(benefit.type) === -1)
            .map((benefit) => {
              const quantity = benefit.valueLookup ? benefit.valueLookup.quantity : null;
              return benefit.type
                ? mapBenefitNames(benefit.type, quantity, benefit.accessLevel, countryLocalCurrencyCode)
                : [];
            }) ?? []
        : [],
    };
    result.packages.push(`${availablePackage.commissionRate}% Commission`);
    return result;
  });
};

export const createBudgetCard = (limit: BudgetLimitCard | null, countryLocalCurrencyCode: CountryLocalCurrencyCode) =>
  limit
    ? {
        ...limit,
        reset: `${i18n({ key: "I18N.BUDGET_RESETS" })} ${limit?.reset?.split("/").join(".")}`,
        linkText: i18n({ key: "I18N.BUDGET_LINK" }),
        remainText: i18n({ key: "I18N.BUDGET_REMAIN" }),
        currencyValue: currencyFormatWithDecimalPlaces({ ...countryLocalCurrencyCode, value: limit?.remain || 0 }),
        nextBreachable: limit.nextBreachable,
        itemLink: {
          viewLink: {
            viewUrl: `${getEndpoint("SPEND_BUDGET")}`,
            viewUrn: "",
          },
          target: "_self",
          isTextLink: true,
        },
        statusLabel: i18n({ key: "I18N.ACCOUNT_BADGE" }),
        title: i18n({ key: "I18N.BUDGET_TITLE" }),
      }
    : null;

/**
 * Map global state to component local state
 *
 * @param state The application state
 * @returns Component local state
 */

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, {}, ApplicationState> = () => {
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getPropsForCashBalances = createPropsForCashBalances();
  const getMyAccountInterfaceState = createMyAccountInterfaceStateSelector();
  const getRewardsCardByURN = createRewardsCardBySelector();
  const getAccountBannersByURN = createAccountBannersCardBySelector();
  const getBalanceCardByURN = createCardByURNSelector<BalanceCards, URN>();
  const getQuickLinksCardByURN = createCardByURNSelector<QuickLinksCards, URN>();
  const getNextBreachableLimitByURN = createNextBreachableLimitSelector();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getViewByURN = createFindViewByURNSelector();

  const depositSuccessfulLabels = {
    depositSuccessful: i18n({ key: "I18N.DEPOSIT.DEPOSIT_SUCCESSFUL" }),
    placingBet: i18n({ key: "I18N.BETSLIP.PLACING_BET" }),
  };

  return function mapStateToProps(state: ApplicationState): StateProps {
    try {
      const { betslip, entities, layouts, router } = state;

      const prodIdConfig = getProdIdConfig();
      const myAccountEndpoint = getEndpoint("MY_ACCOUNT");
      const promosEndpoint = getEndpoint("PROMOS");
      const applePay = getEndpoint("APPLE_PAY_PROXY");

      const userProfileLinks = {
        rewardsLink: `${myAccountEndpoint}/rewards/my-rewards?prod=${prodIdConfig}&showHeader=0`,
        chooseRewardsLink: `${myAccountEndpoint}/rewards/my-rewards/choose?prod=${prodIdConfig}&showHeader=0`,
        promosLink: `${promosEndpoint}/sport?prod=${prodIdConfig}`,
        applePay,
      };

      const currentViewURN = router.currentUrn ?? "";
      const myAccountViewItems = createMyAccountViewItemsSelector(currentViewURN)(state);
      const wizardUrl = getViewByURN(layouts.views, currentViewURN)?.wizardUrl;
      const {
        balanceCardURN,
        quickLinksCardURN,
        linksCardURN,
        rewardsCardURN,
        accountBannersCardURN,
        budgetLimitsCardURN,
      } = myAccountViewItems.reduce(
        (
          acc: {
            balanceCardURN: string | undefined;
            quickLinksCardURN: string | undefined;
            linksCardURN: string | undefined;
            rewardsCardURN: string | undefined;
            accountBannersCardURN: string | undefined;
            budgetLimitsCardURN: string | undefined;
          },
          item,
        ) => {
          if (getBalanceCardByURN(layouts.cards.balance, item.urn)) {
            return { ...acc, balanceCardURN: item.urn };
          }
          if (getQuickLinksCardByURN(layouts.cards.quicklinks, item.urn)) {
            return { ...acc, quickLinksCardURN: item.urn };
          }
          if (item.urn.includes(EntityType.LinksCard)) {
            return { ...acc, linksCardURN: item.urn };
          }
          if (item.urn.includes(EntityType.RewardsCard)) {
            return { ...acc, rewardsCardURN: item.urn };
          }
          if (item.urn.includes(EntityType.AccountBannersCard)) {
            return { ...acc, accountBannersCardURN: item.urn };
          }
          if (item.urn.includes(EntityType.BudgetLimitsCard)) {
            return { ...acc, budgetLimitsCardURN: item.urn };
          }

          return acc;
        },
        {
          balanceCardURN: undefined,
          quickLinksCardURN: undefined,
          linksCardURN: undefined,
          rewardsCardURN: undefined,
          accountBannersCardURN: undefined,
          budgetLimitsCardURN: undefined,
        },
      );

      const walletsToCallWasService: WalletNames[] = balanceCardURN
        ? createWalletNamesSelector(balanceCardURN)(state)
        : [];
      const walletSections: WalletSection[] = balanceCardURN ? createWalletSectionsSelector(balanceCardURN)(state) : [];

      const { firstName, jurisdiction } = getMyAccountInterfaceState(state);
      const userDetails = <UserDetails>getUserDetailsSelector(state);

      const { countryCode, currencyCode, localeCodeBcp47, loggedIn } = userDetails;
      const countryLocalCurrencyCode: CountryLocalCurrencyCode = { countryCode, currencyCode, localeCodeBcp47 };
      const wallets = getUserWallets(state);
      const { showBalances } = getUserPreferencesWithProductSwitcher(entities.preferences);
      const cashBalancesProps = getPropsForCashBalances(
        currencyCode,
        localeCodeBcp47,
        wallets,
        walletSections,
        jurisdiction,
      );
      const quickMenuItems = quickLinksCardURN ? createQuickLinksSelector(quickLinksCardURN)(state) : [];
      const groupsMenu = linksCardURN
        ? createLinksSelector(linksCardURN)(state).map((menuSection) => buildUserProfileMenu(menuSection))
        : [];

      const accountBanners = accountBannersCardURN
        ? getAccountBannersByURN(layouts.cards, accountBannersCardURN)
        : null;

      const currentBanner = accountBanners && accountBanners.currentBanner ? accountBanners.currentBanner : null;

      const rewardsCard = rewardsCardURN ? getRewardsCardByURN(layouts.cards, rewardsCardURN) : null;
      const rewardsMenu = rewardsCard?.benefitsPackages;
      let rewards = null;
      let basicPlan = null;
      let noPlanSelected = null;
      const { chosenBenefitsPackage, rewardsStatus, availablePackages } = rewardsMenu ?? {};
      let packageLevelValue = "";
      if (chosenBenefitsPackage && chosenBenefitsPackage.packageLevel) {
        packageLevelValue = chosenBenefitsPackage.packageLevel;
      }

      if (rewardsMenu) {
        if (chosenBenefitsPackage) {
          if (packageLevelValue === "GOOD") {
            basicPlan = createBasicPlan(userProfileLinks);
          } else {
            rewards = createMyRewardsAndRewardsPlus(rewardsMenu, userProfileLinks);
          }
        }
        if (availablePackages && availablePackages.length !== 0) {
          noPlanSelected = createNoPlanSelected(rewardsMenu, countryLocalCurrencyCode);
        }
      }

      const rewardsTitle =
        rewardsMenu && rewardsStatus !== RewardsStatus.Ineligible && rewardsStatus !== RewardsStatus.Bespoke
          ? i18n({ key: "I18N.REWARDS_TITLE" })
          : null;

      const ndlLimits = budgetLimitsCardURN ? getNextBreachableLimitByURN(layouts.cards, budgetLimitsCardURN) : null;
      const budgetLimit = createBudgetCard(ndlLimits, countryLocalCurrencyCode);

      if (!betslip) {
        return {};
      }

      const { isDepositRedirect, activeProduct, step, exchangeEdit, exchangeContext } = betslip;

      const betslipDepositRedirect = {
        isDepositRedirect,
        activeProduct,
        step,
        betId: exchangeEdit?.betId || "",
        exchangeMarket: exchangeContext?.market,
        exchangeRunner: exchangeContext?.runner,
      };
      const getThrottle = createGetThrottleSelector();
      const isNotificationsCenterEnabled = !!getThrottle(state.entities.throttles, "ENABLE_NOTIFICATION_CENTER")
        ?.isActive;
      const hasUnreadNotifications =
        isNotificationsCenterEnabled && getUnreadNotificationsCount(state.notificationsCenter) > 0;

      return {
        rewards,
        rewardsTitle,
        basicPlan,
        noPlanSelected,
        packageLevelValue,
        groupsMenu,
        quickMenuItems,
        firstName,
        showBalances,
        simpleView: cashBalancesProps.simpleViewBalances,
        detailedView: cashBalancesProps.detailedViewBalance,
        walletsToCallWasService,
        currentViewURN,
        jurisdiction,
        currentBanner,
        lastLoginDate: userDetails.lastLoginDate,
        accountBannersCardURN,
        budgetLimit,
        depositSuccessfulLabels,
        betslipDepositRedirect,
        isLoggedIn: loggedIn,
        wizardUrl,
        userProfileLinks,
        hasUnreadNotifications,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

export type DispatchProps = {
  dispatchFetchCatalogueAction: (urn: string) => void;
  dispatchUpdateCurrentBannerAction: (urn: string, index: number) => void;
  dispatchPushAction: (viewUrn: string, viewUrl: string) => void;
  dispatchBannerActionRequest: (urn: string, index: number, bannerAction: BannerCTA) => void;
  dispatchOnLogoutClick: () => void;
  dispatchUserProfileMenuEyeIconClickAction: (showBalances: boolean, jurisdiction: string) => void;
  dispatchOnClickMenuLink: (jurisdiction: string, menuText: string, href: string) => void;
  dispatchOnClickQuickMenu: (title: string, jurisdiction: string, href: string) => void;
  dispatchOnToggleSimpleDetailedViewClick: (showLessToggle: boolean, moduleName: string) => void;
  dispatchFetchUserWalletsAction: (walletName: WalletNames[]) => void;
  dispatchOnClickBudget: (url: string, jurisdiction: string) => void;
  dispatchBetPlacement: (betslipDepositRedirect: BetslipDepositRedirect) => void;
  dispatchLogin: (url: string) => void;
  dispatchDepositSuccessfulAction: (data: PYWDepositSuccessEvent, referrerLocation: string) => void;
};

export type ContainerProps = {};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchFetchCatalogueAction: (urn: string) => {
    dispatch<FetchCatalogueAction>({
      type: FETCH_CATALOGUE,
      payload: { urn },
    });
  },
  dispatchUpdateCurrentBannerAction: (urn: string, index: number) => {
    dispatch<UpdateCurrentBannerAction>({
      type: UPDATE_CURRENT_BANNER,
      payload: { urn, index },
    });
  },
  dispatchPushAction: (viewUrn: string, viewUrl: string) => {
    dispatch<PushAction>({
      type: PUSH,
      payload: {
        viewUrn,
        viewUrl,
      },
    });
  },
  dispatchBannerActionRequest: (urn: string, index: number, bannerAction: BannerCTA) => {
    dispatch<BannerActionRequest>({
      type: BANNER_ACTION_REQUEST,
      payload: { urn, index, bannerAction },
    });
  },
  dispatchOnLogoutClick: () => {
    dispatch<UserLogoutClickAction>({
      type: UI__USER_LOGOUT_CLICK,
    });
    dispatch<BettingSportsbookClearAction>({
      type: BETTING__SBK_CLEAR_ACTION,
    });
    dispatch<BettingObbClearAction>({
      type: BETTING__OBB_CLEAR_ACTION,
    });
  },
  dispatchUserProfileMenuEyeIconClickAction: (showBalances: boolean, jurisdiction: string) => {
    dispatch<UserProfileMenuEyeIconClickAction>({
      type: UI__USER_PROFILE_EYE_ICON_CLICK,
      payload: {
        showBalances,
        jurisdiction,
      },
    });
  },
  dispatchOnClickMenuLink: (jurisdiction: string, menuText: string, href: string) => {
    dispatch<UserProfileMenuLinkClickAction>({
      type: UI__USER_PROFILE_MENU_LINK_CLICK,
      payload: {
        menuText,
        jurisdiction,
        href,
      },
    });
  },
  dispatchOnClickQuickMenu: (title: string, jurisdiction: string, href: string) => {
    dispatch<UserProfileQuickLinkClickAction>({
      type: UI__USER_PROFILE_QUICK_LINK_CLICK,
      payload: {
        title,
        jurisdiction,
        href,
      },
    });
  },
  dispatchOnToggleSimpleDetailedViewClick: (showLessToggle: boolean, jurisdiction: string) => {
    dispatch<UserProfileToggleCashBalancesViewClickAction>({
      type: UI__USER_PROFILE_TOGGLE_CASH_BALANCES_VIEW_CLICK,
      payload: {
        showLessToggle,
        jurisdiction,
      },
    });
  },
  dispatchFetchUserWalletsAction: (walletNames: WalletNames[]) => {
    dispatch<FetchUserWalletsAction>({
      type: FETCH_USER_WALLETS,
      payload: walletNames,
    });
  },
  dispatchOnClickBudget: (url: string, jurisdiction: string) => {
    dispatch<UserProfileBudgetLinkClickAction>({
      type: UI__USER_PROFILE_BUDGET_LINK_CLICK,
      payload: {
        module: "my account",
        text: "my budget",
        url,
        jurisdiction,
      },
    });
  },
  dispatchLogin: (url: string) => {
    dispatch<ExternalPushAction>({
      type: EXTERNAL_PUSH,
      payload: {
        viewUrn: "",
        viewUrl: url,
      },
    });
  },
  dispatchBetPlacement: ({ activeProduct, step, betId, exchangeMarket, exchangeRunner }: BetslipDepositRedirect) => {
    if (!activeProduct || activeProduct === "NONE") {
      return;
    }

    if (activeProduct === "EXCHANGE" && exchangeMarket && exchangeRunner) {
      const placeAction: BettingExchangePlaceBetsAction = {
        type: BETTING__EXC_PLACE_BETS,
        payload: { runner: exchangeRunner, confirmFirst: false },
      };
      const editAction: BettingExchangeUnmatchedUpdate = {
        type: BETTING__EXC_UNMATCHED_UPDATE,
        payload: { betId, market: exchangeMarket, runner: exchangeRunner, betOriginURL: null },
      };

      dispatch(["PLACE_POTENTIAL", "CONFIRM_POTENTIAL"].includes(step) ? placeAction : editAction);

      return;
    }

    dispatch<BettingSportsbookPlaceBetsAction>({ type: BETTING__SBK_PLACE_BETS });
  },
  dispatchDepositSuccessfulAction: (data: PYWDepositSuccessEvent, referrerLocation: string) => {
    if (data.payload.firstDeposit) {
      dispatch<FirstDepositSuccessAction>({
        type: FIRST_DEPOSIT_SUCCESS,
        payload: {
          data,
        },
      });
    } else {
      dispatch<DepositSuccessAction>({
        type: DEPOSIT_SUCCESS,
        payload: {
          data,
        },
      });
    }

    dispatch<DepositFlowAction>({
      type: DEPOSIT_FLOW,
      payload: {
        data,
        referrerLocation,
        message: data.payload.firstDeposit ? "made first deposit" : "made deposit",
      },
    });
  },
});
