import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { MarketBetCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createExchangeMarketBetSelector } from "@ppb/tbd-store/state/betting/exchange-market-bets/exchange-market-bets-selectors";
import { createGetMyBetsFiltersStateSelector } from "@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors";
import { ViewLink } from "@ppb/the-wall-common/types";
import { MarketId } from "@ppb/tbd-store/state/entities/Common.types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createSelector } from "reselect";
import {
  MY_BETS_EXC_BOTTOM_SHEET_OPEN,
  MY_BETS_SUBSCRIBE_CARD_UPDATES,
  MY_BETS_UNSUBSCRIBE_CARD_UPDATES,
  MyBetsExchangeOpenBottomSheetAction,
  MyBetsOnCancelAllPressAction,
  MyBetsSubscribeCardUpdatesAction,
  MyBetsUnsubscribeCardUpdatesAction,
  UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS,
} from "@ppb/tbd-store/actions/my-bets";
import { BetCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { OrderTypeFilterItem } from "@ppb/tbd-store/state/layout/cards/MyBets.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { i18n } from "../../helpers/i18n";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  urn: URN;
  title: string;
  cashoutQuotesURNs: URN[];
  numOfBets: number;
  numOfUnmatched: number;
  marketId: MarketId;
  liability?: string;
  liabilityLabel: string;
  isUnmatched: boolean;
  isOpen: boolean;
  marketBetCardGroupURN: string[];
  aggregatorDescription?: string;
  cancelAllLabel: string;
  commission?: string;
  commissionLabel: string;
  profit?: string;
  profitLabel: string;
  netProfit?: string;
  netProfitRaw?: number;
  netProfitLabel: string;
  showCancelAll: boolean;
  exchangeLightMarketViewLink?: ViewLink;
};

export type StateProps = CardProps | Record<string, never>;

const DEFAULT_EMPTY_VALUE = "--";
enum MatchedStatusFilterItem {
  Matched = "matched",
  Unmatched = "unmatched",
}

const createGetStaticLabels = () =>
  createSelector([(localeCode: string) => localeCode], () => ({
    unmatched: i18n({ key: "I18N.MY_BETS.UNMATCHED" }),
    liability: i18n({ key: "I18N.BETSLIP.LIABILITY" }),
    cancelAll: i18n({ key: "I18N.CANCEL_ALL" }),
    commission: i18n({ key: "I18N.MY_BETS.COMMISSION" }),
    gross: i18n({ key: "I18N.MY_BETS.GROSS_PROFIT" }),
    netProfit: i18n({ key: "I18N.MY_BETS.NET_PROFIT" }),
  }));

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCardByURN = createCardByURNSelector<MarketBetCards, URN>();
  const getBetCardGroupByURN = createCardGroupByURNSelector<BetCardGroups, URN>();
  const getExchangeMarketBetByURN = createExchangeMarketBetSelector();
  const getStaticLabels = createGetStaticLabels();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getMyBetsFiltersState = createGetMyBetsFiltersStateSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const marketBetCard = getCardByURN(state.layouts.cards.marketbetcard, urn);

    if (!marketBetCard) {
      return {};
    }

    const betCardGroup = getBetCardGroupByURN(state.layouts.cardgroups.betcardgroups, marketBetCard.betCardGroupURN);
    const marketBet = getExchangeMarketBetByURN(state, marketBetCard.marketBetURN);
    const { orderTypeFilter } = getMyBetsFiltersState(state, state.layouts.views.mybets);

    if (!marketBet) {
      return {};
    }

    const userDetails = <UserDetails>getUserDetailsSelector(state);

    const labels = getStaticLabels(userDetails.localeCode);

    const isUnmatched = marketBetCard.matchedStatus === MatchedStatusFilterItem.Unmatched;

    const formatValueWithDecimalPlaces = (currentValue: number | undefined) =>
      currentValue !== undefined
        ? currencyFormatWithDecimalPlaces({ ...userDetails, value: currentValue, decimalPlaces: 2 })
        : DEFAULT_EMPTY_VALUE;

    const formatProfitAndComission = (currentValue = 0) =>
      currentValue > 0
        ? currencyFormatWithDecimalPlaces({ ...userDetails, value: currentValue, decimalPlaces: 2 })
        : DEFAULT_EMPTY_VALUE;

    return {
      urn,
      title: marketBet.description || "",
      exchangeLightMarketViewLink: marketBet.exchangeLightMarketViewLink,
      cashoutQuotesURNs: (!isUnmatched && marketBet.cashoutQuotesURNs) || [],
      numOfBets: marketBetCard.numberOfBets,
      numOfUnmatched: marketBetCard.numberOfUnmatched,
      isUnmatched,
      isOpen: orderTypeFilter === OrderTypeFilterItem.Open,
      marketId: marketBet.marketId,
      liability: formatValueWithDecimalPlaces(marketBetCard.liability),
      liabilityLabel: labels.liability,
      aggregatorDescription: betCardGroup?.aggregatorDesc,
      marketBetCardGroupURN: marketBet.marketBetCardGroupURN || [],
      cancelAllLabel: labels.cancelAll,
      commission: formatProfitAndComission(marketBetCard.commission),
      commissionLabel: labels.commission,
      profit: formatProfitAndComission(marketBetCard.profit),
      profitLabel: labels.gross,
      netProfit: formatValueWithDecimalPlaces(marketBetCard.netProfit),
      netProfitRaw: marketBetCard.netProfit,
      netProfitLabel: labels.netProfit,
      showCancelAll: marketBetCard.numberOfUnmatched > 1,
    };
  };
};

const dispatchSubscribeCardUpdates = (urn: URN): MyBetsSubscribeCardUpdatesAction => ({
  type: MY_BETS_SUBSCRIBE_CARD_UPDATES,
  payload: { urn },
});

const dispatchUnsubscribeCardUpdates = (urn: URN): MyBetsUnsubscribeCardUpdatesAction => ({
  type: MY_BETS_UNSUBSCRIBE_CARD_UPDATES,
  payload: { urn },
});

const dispatchMyBetsBottomSheetOpenPress = (
  contentUrn: string,
  title?: string,
): MyBetsExchangeOpenBottomSheetAction => ({
  type: MY_BETS_EXC_BOTTOM_SHEET_OPEN,
  payload: {
    contentUrn,
    title,
  },
});

const dispatchCancelAllPress = (
  marketId: string,
  marketName: string,
  numberOfBets: number,
  marketBetCardGroupURN: URN[],
  event?: string,
): MyBetsOnCancelAllPressAction => ({
  type: UI__MY_BETS_CANCEL_ALL_UNMATCHED_PRESS,
  payload: { marketId, marketName, numberOfBets, event, marketBetCardGroupURN },
});

export type DispatchProps = {
  dispatchSubscribeCardUpdates: typeof dispatchSubscribeCardUpdates;
  dispatchUnsubscribeCardUpdates: typeof dispatchUnsubscribeCardUpdates;
  dispatchCancelAllPress: typeof dispatchCancelAllPress;
  dispatchMyBetsBottomSheetOpenPress: typeof dispatchMyBetsBottomSheetOpenPress;
};

export const makeMapDispatchToProps: DispatchProps = {
  dispatchSubscribeCardUpdates,
  dispatchUnsubscribeCardUpdates,
  dispatchCancelAllPress,
  dispatchMyBetsBottomSheetOpenPress,
};
