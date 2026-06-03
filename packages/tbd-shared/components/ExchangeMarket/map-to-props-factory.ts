import { MapStateToPropsFactory } from "react-redux";
import { RunnerPosition } from "@ppb/bet-engine";

import { type SportsbookMarketProps, type ViewLink } from "@ppb/the-wall-common/types";
import { type ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { CashoutStep } from "@ppb/tbd-store/state/constants";
import { type MarketCard, type RunnerViewLinks } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { type UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";

import {
  SUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES,
  SubscribeExchangeCashoutAction,
  UNSUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES,
  UnsubscribeExchangeCashoutAction,
} from "@ppb/tbd-store/actions/cashout";
import { UPDATE_MARKET_DEPTH, UpdateMarketDepth } from "@ppb/tbd-store/actions/preferences";
import {
  SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  SubscribeExchangeMarketUpdatesAction,
  UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  UnsubscribeExchangeMarketUpdatesAction,
} from "@ppb/tbd-store/actions/exchange-markets";
import { doesMarketHierarchyHaveRace } from "@ppb/tbd-store/helpers/markets";
import {
  createExchangeMarketSelector,
  createRunnersForBookPercentageSelector,
  createExchangeMarketRunnersSelector,
} from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createMarketDepthSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createGetRunnerViewTitlesFromRunnerViewLinksSelector } from "@ppb/tbd-store/state/application-state-selectors";
import { createExchangeCashoutQuoteSelector } from "@ppb/tbd-store/state/betting/exchange-cashouts/exchange-cashout-selectors";
import { createBettingMarketRunnersPositionSelector } from "@ppb/tbd-store/state/betting/exchange-betting/exchange-betting-selectors";
import { DeleteViewAction, DELETE_VIEW, FetchCatalogueAction, FETCH_CATALOGUE } from "@ppb/tbd-store/actions/catalogue";
import {
  MarketRulesModalToggleAction,
  ToggleGraphAction,
  UI__GRAPH_TOGGLE,
  UI__MARKET_RULES_MODAL_TOGGLE,
} from "@ppb/tbd-store/actions/interface";

import {
  createBookPercentageForExchangeMarketVm,
  createRunnersForExchangeMarketVm,
} from "./exchange-market-view-model";
import type { ExchangeMarketProps } from "./snowflakes/ExchangeMarket/ExchangeMarket.types";
import {
  currencyFormatWithDecimalPlaces,
  currencyFormatWithoutDecimalPlaces,
} from "../../formatters/currency-formatters";
import { i18n } from "../../helpers/i18n";

export type CardProps = {
  marketId: string;
  marketType: string;
  marketName: string;
  exchangeCashoutURN?: string;
  hasQuote?: boolean;
  liabilityValue?: string;
  runnerViewsTitles?: { [runnerViewUrn: string]: string };
  cardUrn: URN;
  isMarketDepthActive: boolean;
  marketRulesViewURN?: URN;
  turnInPlayEnabled?: boolean;
  inplay?: boolean;
} & ExchangeMarketProps;

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  urn: URN;
  cardUrn: URN;
  runnerViewLinks?: RunnerViewLinks;
  displayRunnersUrns: URN[];
  inline?: boolean;
  isMarketDepthActive?: boolean;
  isRunnerExpandable?: boolean;
  eventViewLink?: ViewLink;
  visible?: boolean;
} & Pick<SportsbookMarketProps, "onMarketPromoClick" | "onLinkClick"> &
  Pick<MarketCard, "infoBlurbs" | "marketPromo">;

const DEFAULT_EMPTY_VALUE = "--";

const getFilteredRunnersPnl = (runnersPosition: RunnerPosition[]): number[] =>
  runnersPosition.map(({ pnl: { win } }) => win).filter((win): win is number => typeof win === "number");

const getLiabilityFormattedValue = (liability: number | undefined, userDetails: UserDetails): string | undefined =>
  liability === undefined
    ? DEFAULT_EMPTY_VALUE
    : currencyFormatWithDecimalPlaces({
        ...userDetails,
        // Liability should always be shown as a positive value
        value: Math.abs(liability),
        decimalPlaces: 2,
      });

/** ********************************************
 *                                              *
 *         *  makeMapStateToProps *             *
 *                                              *
 ********************************************** */
export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getRunnersForExchangeMarket = createRunnersForExchangeMarketVm();
  const getBookPercentage = createBookPercentageForExchangeMarketVm();
  const getExchangeMarketByURN = createExchangeMarketSelector();
  const getMarketDepth = createMarketDepthSelector();
  const getRunnersForBookPercentageSelector = createRunnersForBookPercentageSelector();
  const getRunnerViewTitlesFromRunnerViewLinks = createGetRunnerViewTitlesFromRunnerViewLinksSelector();
  const getExchangeMarketRunners = createExchangeMarketRunnersSelector();
  const getExchangeCashoutQuoteSelector = createExchangeCashoutQuoteSelector();
  const getBettingMarketRunnersPositionByMarketURN = createBettingMarketRunnersPositionSelector();

  const i18nLabels = {
    back: i18n({ key: "I18N.MARKET.BACK" }),
    lay: i18n({ key: "I18N.MARKET.LAY" }),
    marketClosed: i18n({ key: "I18N.MARKET.CLOSED" }),
    marketDepth: i18n({ key: "I18N.LABELS.MARKET_DEPTH" }),
    marketSuspended: i18n({ key: "I18N.MARKET.SUSPENDED" }),
    matched: i18n({ key: "I18N.MARKET.MATCHED" }),
    nonRunnerTitle: i18n({ key: "I18N.NON_RUNNER.TITLE" }),
    nonRunnerReduction: i18n({ key: "I18N.NON_RUNNER.REDUCTION" }),
    marketRules: i18n({ key: "I18N.MARKET_RULES" }),
    liability: i18n({ key: "I18N.BETSLIP.LIABILITY" }),
  };

  /**
   * Map global state to component local state
   *
   * @param state The application state
   * @param urn The connected component input URN
   * @param cardUrn The urn for the card
   * @returns Component local state
   */
  return (
    state: ApplicationState,
    { urn, cardUrn, runnerViewLinks, displayRunnersUrns, inline }: ContainerProps,
  ): StateProps => {
    try {
      const market = getExchangeMarketByURN(state.entities.exchangemarkets, urn);
      if (!market) {
        return {};
      }

      const isMarketDepthActive = getMarketDepth(state.entities.preferences);
      const marketRunners = getExchangeMarketRunners(state.entities.exchangemarkets, urn);
      const userDetails = <UserDetails>getUserDetails(state);

      // make book percentage available only if the user is looking at the entire market depth (it is shown only with market depth active)
      let bookPercentage;
      if (isMarketDepthActive) {
        const runnersForBookPercentage = getRunnersForBookPercentageSelector(state.entities.exchangerunners, urn);
        bookPercentage = getBookPercentage(runnersForBookPercentage);
      }

      // view model
      const runners = getRunnersForExchangeMarket({
        marketRunners,
        displayRunnersUrns,
      });

      let liquidity;
      if (!inline) {
        const { localeCodeBcp47, currencyCode } = userDetails;
        liquidity = currencyFormatWithoutDecimalPlaces({
          localeCodeBcp47,
          currencyCode,
          value: market.totalMatched,
        });
      }

      const [exchangeCashoutURN] = market.cashoutQuotesURNs ?? [];
      const cashoutQuote = exchangeCashoutURN
        ? getExchangeCashoutQuoteSelector(state.betting.exchangecashouts, exchangeCashoutURN)
        : undefined;

      let liability: number | undefined;
      if (cashoutQuote) {
        const { step, cashedOutProfit, currentLiability } = cashoutQuote;

        liability = currentLiability;
        if (step === CashoutStep.RECEIPT && typeof cashedOutProfit === "number") {
          // COS does not return currentLiability after successful cashout.
          // Use calculated liability value based on cashed out profit.
          liability = Math.min(cashedOutProfit, 0);
        }

        // Apply liability fallback logic
        if (liability === undefined) {
          // Frontend does not use FBR, use PnL from runners positions as fallback
          const runnersPosition = getBettingMarketRunnersPositionByMarketURN(state.betting.exchangeBetting, urn) ?? [];
          const filteredPnL = getFilteredRunnersPnl(runnersPosition);
          liability = filteredPnL.length ? Math.min(...filteredPnL, 0) : undefined;
        }
      }

      return {
        marketURN: urn,
        marketId: market.marketId,
        marketName: market.name,
        liquidity,
        runners,
        isRaceMarket: doesMarketHierarchyHaveRace(market.hierarchy),
        status: market.status,
        marketType: market.marketType,
        i18nLabels,
        cardUrn,
        bookPercentage,
        isMarketDepthActive,
        exchangeCashoutURN,
        hasQuote: !!cashoutQuote && cashoutQuote.step !== CashoutStep.HIDE,
        liabilityValue: getLiabilityFormattedValue(liability, userDetails),
        runnerViewsTitles: runnerViewLinks
          ? getRunnerViewTitlesFromRunnerViewLinks(state.layouts.views.runner, runnerViewLinks)
          : undefined,
        marketRulesViewURN: market.marketRulesViewLink?.viewUrn,
        turnInPlayEnabled: market.turnInPlayEnabled,
        inplay: market.inplay,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

const dispatchMarketUpdatesSubscribe = (
  marketId: string,
  isInline: boolean | undefined,
): SubscribeExchangeMarketUpdatesAction => ({
  type: SUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  payload: {
    marketId,
    isInline,
  },
});

const dispatchMarketUpdatesUnsubscribe = (
  marketId: string,
  isInline: boolean | undefined,
): UnsubscribeExchangeMarketUpdatesAction => ({
  type: UNSUBSCRIBE_EXCHANGE_MARKET_UPDATES,
  payload: {
    marketId,
    isInline,
  },
});

const dispatchUpdateMarketDepth = (marketURN: string, isMarketDepthActive: boolean): UpdateMarketDepth => ({
  type: UPDATE_MARKET_DEPTH,
  payload: {
    isActive: !isMarketDepthActive,
    urn: marketURN,
  },
});

const dispatchSubscribeExchangeCashout = (marketId: string): SubscribeExchangeCashoutAction => ({
  type: SUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES,
  payload: {
    marketId,
    handicap: 0, // FIXME: Should be reviewed when the handicap markets are integrated
  },
});

const dispatchUnsubscribeExchangeCashout = (marketId: string): UnsubscribeExchangeCashoutAction => ({
  type: UNSUBSCRIBE_EXCHANGE_CASHOUTS_UPDATES,
  payload: {
    marketId,
    handicap: 0, // FIXME: Should be reviewed when the handicap markets are integrated
  },
});

const dispatchFetchCatalogue = (urn: string): FetchCatalogueAction => ({
  type: FETCH_CATALOGUE,
  payload: {
    urn,
  },
});

const dispatchDeleteView = (urn: string): DeleteViewAction => ({
  type: DELETE_VIEW,
  payload: urn,
});

const dispatchModalToggleAction = (isOpen: boolean): MarketRulesModalToggleAction => ({
  type: UI__MARKET_RULES_MODAL_TOGGLE,
  payload: { open: isOpen },
});

const dispatchToggleMarketGraph = (runnerName: string, marketName: string, isClosed: boolean): ToggleGraphAction => ({
  type: UI__GRAPH_TOGGLE,
  payload: {
    runnerName,
    marketName,
    isClosed,
  },
});

export type DispatchProps = {
  dispatchMarketUpdatesSubscribe: typeof dispatchMarketUpdatesSubscribe;
  dispatchMarketUpdatesUnsubscribe: typeof dispatchMarketUpdatesUnsubscribe;
  dispatchToggleMarketGraph: typeof dispatchToggleMarketGraph;
  dispatchUpdateMarketDepth: typeof dispatchUpdateMarketDepth;
  dispatchSubscribeExchangeCashout: typeof dispatchSubscribeExchangeCashout;
  dispatchUnsubscribeExchangeCashout: typeof dispatchUnsubscribeExchangeCashout;
  dispatchFetchCatalogue: typeof dispatchFetchCatalogue;
  dispatchDeleteView: typeof dispatchDeleteView;
  dispatchModalToggleAction: typeof dispatchModalToggleAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchMarketUpdatesSubscribe,
  dispatchMarketUpdatesUnsubscribe,
  dispatchUpdateMarketDepth,
  dispatchSubscribeExchangeCashout,
  dispatchUnsubscribeExchangeCashout,
  dispatchFetchCatalogue,
  dispatchDeleteView,
  dispatchModalToggleAction,
  dispatchToggleMarketGraph,
};
