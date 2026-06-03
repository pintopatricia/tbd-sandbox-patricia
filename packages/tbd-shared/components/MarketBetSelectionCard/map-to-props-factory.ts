import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { MarketBetSelectionCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createSelector } from "reselect";
import { LabelTheme, StatusLabelType, ViewLink } from "@ppb/the-wall-common/types";
import { Dispatch } from "redux";
import {
  MY_BETS_EXC_BOTTOM_SHEET_OPEN,
  MyBetsExchangeBetEditPressAction,
  MyBetsExchangeOpenBottomSheetAction,
  MyBetsOnCancelUnmatchedBetPressAction,
  UI__MY_BETS_CANCEL_UNMATCHED_BET_PRESS,
  UI__MY_BETS_EXC_EDIT_BET_PRESS,
  UI__MY_BETS_COPY_BET_ID,
  UI__MY_BETS_COPY_DEVICE_ID,
  MyBetsCopyBetId,
  MyBetsCopyDeviceId,
} from "@ppb/tbd-store/actions/my-bets";
import { createExchangeMarketBetSelector } from "@ppb/tbd-store/state/betting/exchange-market-bets/exchange-market-bets-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import {
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  RemoveAllPotentialBetsAction,
} from "@ppb/tbd-store/actions/betting";
import { ExchangeSide, Jurisdiction } from "@ppb/tbd-store/state/constants";
import { ExchangeSide as ExchangeSideType } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import type { calc as betEngineCalc } from "@ppb/bet-engine";
import { formatFullDateAndTime } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";

let calcLiability: typeof betEngineCalc.liability | undefined;
import(/* webpackChunkName: "BetEngine", webpackPreload: true */ "@ppb/bet-engine").then(({ calc }) => {
  calcLiability = calc.liability;
});

enum Result {
  WON = "WON",
  PLACED = "PLACED",
  LOST = "LOST",
}

export type ContainerProps = {
  urn: URN;
};

type Labels = {
  cashoutLabel?: string;
  informationSignpostLabel?: string;
  oddsLabel: string;
  profitLabel: string;
  liabilityLabel?: string;
  sideLabel?: string;
  stakeLabel: string;
  betIdLabel: string;
  placedDateLabel: string;
  matchedDateLabel: string;
  settledDateLabel: string;
  deviceIdLabel: string;
};

export type CardProps = {
  hasUnmatchedActions: boolean;
  oddsValue: string;
  profitValue: string;
  liabilityValue?: string;
  runnerDesc: string;
  side: ExchangeSideType;
  sideTheme?: LabelTheme;
  stakeValue: string;
  statusLabelText?: string;
  statusLabelType?: StatusLabelType;
  betId: string;
  marketId: string;
  runnerURN: URN;
  exchangeLightMarketViewLink?: ViewLink;
  viewLink?: ViewLink;
  marketURN: URN;
  marketBetCardGroupURN: URN;
  placedDateFormatted?: string;
  matchedDateFormatted?: string;
  settledDateFormatted?: string;
  deviceId?: string;
} & Labels;

export type StateProps = CardProps | Record<string, never>;

export type CancelBetPressProps = (
  marketId: string,
  betId: string,
  selectionName: string,
  side: ExchangeSideType,
  marketBetCardGroupURN: URN,
) => void;

export type UnmatchedBetEditPress = (payload: {
  betId: string;
  marketUrn: URN;
  runner: URN;
  side: ExchangeSideType;
  exchangeLightMarketViewLink: ViewLink;
}) => void;

export type MyBetsPushAction = (viewLink: ViewLink) => void;

export type DispatchProps = {
  dispatchCancelBetPress: CancelBetPressProps;
  dispatchUnmatchedBetEditPress: UnmatchedBetEditPress;
  dispatchCopyBetIdAction: () => void;
  dispatchCopyDeviceIdAction: () => void;
};

const createGetStaticLabels = () => {
  const selectLocaleCode = (localeCode: string) => localeCode;
  const selectSide = (_localeCode: string, side: ExchangeSideType) => side;

  return createSelector([selectLocaleCode, selectSide], (localeCode: string, side: ExchangeSideType) => ({
    cashoutLabel: i18n({ key: "I18N.MY_BETS.BET_CASHED_OUT" }),
    oddsLabel: i18n({ key: "I18N.BETSLIP.ODDS" }),
    stakeLabel:
      side === ExchangeSide.LAY ? i18n({ key: "I18N.LABELS.BACKER_STAKE" }) : i18n({ key: "I18N.BETSLIP.STAKE" }),
    profitLabel: i18n({ key: "I18N.BETSLIP.PROFIT" }),
    liabilityLabel: i18n({ key: "I18N.BETSLIP.LIABILITY" }),
    backLabel: i18n({ key: "I18N.LABEL.BACK" }),
    layLabel: i18n({ key: "I18N.LABEL.LAY" }),
    resultLabel: {
      [Result.WON]: i18n({ key: "I18N.MY_BETS.RESULT.WON" }),
      [Result.LOST]: i18n({ key: "I18N.MY_BETS.RESULT.LOST" }),
      [Result.PLACED]: i18n({ key: "I18N.MY_BETS.RESULT.PLACED" }),
    },
    bspOdds: i18n({ key: "I18N.BETSLIP.STARTING_PRICE" }),
    bspReturns: i18n({ key: "I18N.BETSLIP.TBD" }),
    betIdLabel: i18n({ key: "I18N.MYBETS.BETID" }),
    placedDateLabel: i18n({ key: "I18N.MYBETS.PLACED_DATE_TIME" }),
    matchedDateLabel: i18n({ key: "I18N.MYBETS.MATCHED_DATE_TIME" }),
    settledDateLabel: i18n({ key: "I18N.MYBETS.SETTLED_DATE_TIME" }),
    deviceIdLabel: i18n({ key: "I18N.MYBETS.DEVICE_ID" }),
  }));
};

const mapResultToStatusLabelType: { [key in Result]?: StatusLabelType } = {
  [Result.WON]: StatusLabelType.WON,
  [Result.LOST]: StatusLabelType.LOST,
  [Result.PLACED]: StatusLabelType.NEUTRAL,
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCardByURN = createCardByURNSelector<MarketBetSelectionCards, URN>();
  const getCountryLocalCurrencyCode = createGetCountryLocalCurrencyCodeSelector();
  const getStaticLabels = createGetStaticLabels();
  const getExchangeMarketBetByURN = createExchangeMarketBetSelector();
  const getExchangeMarketByURN = createExchangeMarketSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const marketBetSelectionCard = getCardByURN(state.layouts.cards.marketbetselectioncard, urn);

    if (!marketBetSelectionCard) {
      return {};
    }

    const {
      marketBetURN,
      marketBetCardGroupURN,
      marketURN,
      runnerURN,
      side,
      result,
      isCashout,
      runnerDesc,
      price,
      size = 0,
      profit = 0,
      isUnmatched,
      editViewLink,
      id,
      isBsp,
      bspLiability,
      liability,
      placedDate,
      settledDate,
      matchedDate,
      deviceId,
    } = marketBetSelectionCard;

    const { bettingType = "ODDS", marketType = " " } =
      getExchangeMarketByURN(state.entities.exchangemarkets, marketURN) ?? {};
    const marketBet = getExchangeMarketBetByURN(state, marketBetURN);

    if (!marketBet) {
      return {};
    }

    if (!side) {
      return {};
    }

    const userDetails = <UserDetails>getCountryLocalCurrencyCode(state);
    const { localeCode, localeCodeBcp47, jurisdiction, timezone } = userDetails;
    const labels = getStaticLabels(localeCode, side);

    const formattedValue = (value: number): string =>
      currencyFormatWithDecimalPlaces({
        ...userDetails,
        value: Number(value),
        decimalPlaces: 2,
      });

    let statusLabelText;
    let statusLabelType;

    if (result) {
      statusLabelText = labels.resultLabel[result];
      statusLabelType = mapResultToStatusLabelType[result];
    }

    const formatDate = (date?: string): string | undefined =>
      date ? formatFullDateAndTime(new Date(date), localeCodeBcp47, timezone) : undefined;

    let betLiability: string | undefined;

    if (side === ExchangeSide.LAY) {
      if (!isUnmatched) {
        betLiability = formattedValue(liability ?? 0);
      } else {
        const unmatchedLiability = calcLiability?.(side, size, price, bettingType, marketType);

        betLiability = unmatchedLiability === undefined ? undefined : formattedValue(unmatchedLiability);
      }
    }

    return {
      side,
      sideLabel: side === ExchangeSide.BACK ? labels.backLabel : labels.layLabel,
      sideTheme: side === ExchangeSide.BACK ? LabelTheme.EXCHANGE_BACK : LabelTheme.EXCHANGE_LAY,
      informationSignpostLabel: isCashout ? labels.cashoutLabel : "",
      runnerDesc,
      oddsLabel: labels.oddsLabel,
      oddsValue: isBsp && !price ? labels.bspOdds : Number(price.toFixed(2)).toString(),
      stakeLabel: labels.stakeLabel,
      stakeValue: formattedValue(isBsp && bspLiability !== undefined ? bspLiability : size),
      profitLabel: labels.profitLabel,
      profitValue: isBsp && !price ? labels.bspReturns : formattedValue(profit),
      liabilityLabel: labels.liabilityLabel,
      liabilityValue: betLiability,
      statusLabelText,
      statusLabelType,
      hasUnmatchedActions: isUnmatched && !!editViewLink,
      betIdLabel: labels.betIdLabel,
      betId: id,
      runnerURN,
      marketId: marketBet.marketId,
      exchangeLightMarketViewLink: marketBet.exchangeLightMarketViewLink,
      marketURN,
      marketBetCardGroupURN,
      placedDateLabel: labels.placedDateLabel,
      placedDateFormatted: formatDate(placedDate),
      matchedDateLabel: labels.matchedDateLabel,
      matchedDateFormatted: isUnmatched ? undefined : formatDate(matchedDate),
      settledDateLabel: labels.settledDateLabel,
      settledDateFormatted: formatDate(settledDate),
      deviceIdLabel: labels.deviceIdLabel,
      deviceId: jurisdiction.jurisdiction === Jurisdiction.BRAZIL ? deviceId : undefined,
    };
  };
};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchCancelBetPress: (
    marketId: string,
    betId: string,
    selectionName: string,
    side: ExchangeSideType,
    marketBetCardGroupURN: URN,
  ) => {
    dispatch<MyBetsOnCancelUnmatchedBetPressAction>({
      type: UI__MY_BETS_CANCEL_UNMATCHED_BET_PRESS,
      payload: {
        marketId,
        betId,
        selectionName,
        side,
        marketBetCardGroupURN,
      },
    });
  },
  dispatchUnmatchedBetEditPress: (payload) => {
    dispatch<MyBetsExchangeBetEditPressAction>({
      type: UI__MY_BETS_EXC_EDIT_BET_PRESS,
      payload,
    });
    dispatch<MyBetsExchangeOpenBottomSheetAction>({
      type: MY_BETS_EXC_BOTTOM_SHEET_OPEN,
      payload: {
        contentUrn: payload.exchangeLightMarketViewLink.viewUrn,
      },
    });
    dispatch<RemoveAllPotentialBetsAction>({
      type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
    });
  },
  dispatchCopyBetIdAction: (): void => {
    dispatch<MyBetsCopyBetId>({ type: UI__MY_BETS_COPY_BET_ID });
  },
  dispatchCopyDeviceIdAction: (): void => {
    dispatch<MyBetsCopyDeviceId>({ type: UI__MY_BETS_COPY_DEVICE_ID });
  },
});
