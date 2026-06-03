import type { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";

import { ApplicationState, UserDetails } from "@ppb/tbd-store";
import {
  MyBetsCopyBetId,
  MyBetsCopyDeviceId,
  MyBetsCopyRegulatorBetId,
  MyBetsSportsbookAddPreviousSelectionsClickAction,
  UI__MY_BETS_COPY_BET_ID,
  UI__MY_BETS_COPY_DEVICE_ID,
  UI__MY_BETS_COPY_REGULATOR_BET_ID,
  UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK,
} from "@ppb/tbd-store/actions/my-bets";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { OrderTypeFilterItem } from "@ppb/tbd-store/state/layout/cards/MyBets.types";
import { SportsbookBetInfoCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { createGetMyBetsFiltersStateSelector } from "@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors";
import URN from "@ppb/tbd-store/state/layout/URN";
import { BetInfoItem, BetInfoItemMode } from "@ppb/the-wall-common/types";

import { createSportsbookBetByBetReceiptIdSelector } from "@ppb/tbd-store/state/betting/sportsbook-bets/sportsbook-bets-selectors";
import { formatFullDateAndTime } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

type SelectionsToReuse = { marketUrn: string; runnerUrn: string }[];

type Labels = {
  betId: string;
  regulatorBetId: string;
  placedDate: string;
  settledDate: string;
  deviceId: string;
  reUseSelections: string;
};

export type CardProps = {
  labels: Labels;
  betId: string;
  regulatorBetId?: string;
  placedDateItem: BetInfoItem;
  settledDateItem?: BetInfoItem;
  deviceId?: string;
  betSelections?: SelectionsToReuse;
  product?: string;
  animated: boolean;
  isSettledView: boolean;
  showReuseSelectionsButton?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

const createGetStaticLabels = () =>
  createSelector(
    [(localeCode: string): string => localeCode],
    (): Labels => ({
      betId: i18n({ key: "I18N.MYBETS.BETID" }),
      regulatorBetId: i18n({ key: "I18N.MYBETS.BETID_AUX" }),
      placedDate: i18n({ key: "I18N.MYBETS.PLACED_DATE_TIME" }),
      settledDate: i18n({ key: "I18N.MYBETS.SETTLED_DATE_TIME" }),
      deviceId: i18n({ key: "I18N.MYBETS.DEVICE_ID" }),
      reUseSelections: i18n({ key: "I18N.BETSLIP.RE_USE_SELECTIONS" }),
    }),
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookBetInfoCard = createCardByURNSelector<SportsbookBetInfoCards, URN>();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getStaticLabels = createGetStaticLabels();
  const getMyBetsFiltersState = createGetMyBetsFiltersStateSelector();
  const getSportsbookBetByBetId = createSportsbookBetByBetReceiptIdSelector();
  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const sportsbookBetInfo = getSportsbookBetInfoCard(state.layouts.cards.sportsbookbetinfos, urn);
    const animated = state.entities?.brandSettings?.SPORTSBOOK_BET_BUTTON_ANIMATION ?? true;
    const { orderTypeFilter } = getMyBetsFiltersState(state, state.layouts.views.mybets);
    const isSettledView = orderTypeFilter === OrderTypeFilterItem.Settled;
    if (!sportsbookBetInfo) {
      return {};
    }

    const userDetails = <UserDetails>getUserDetailsSelector(state);
    const { localeCode, localeCodeBcp47, jurisdiction, timezone } = userDetails;
    const labels = getStaticLabels(localeCode);

    const { betReceiptId, regulatorBetId, placedDate, settledDate, deviceId, betSelections, product } =
      sportsbookBetInfo;
    const bet = getSportsbookBetByBetId(state.betting.sportsbookbets, betReceiptId);

    if (!bet) {
      return {};
    }

    const showReuseSelectionsButton = !bet.isLotteries;
    const placedDateItem: BetInfoItem = {
      title: labels.placedDate,
      value: formatFullDateAndTime(new Date(placedDate), localeCodeBcp47, timezone),
      mode: BetInfoItemMode.WITHOUT_COPY,
    };

    let settledDateItem: BetInfoItem | undefined;

    if (settledDate) {
      settledDateItem = {
        title: labels.settledDate,
        value: formatFullDateAndTime(new Date(settledDate), localeCodeBcp47, timezone),
        mode: BetInfoItemMode.WITHOUT_COPY,
      };
    }

    return {
      labels,
      betId: betReceiptId,
      regulatorBetId,
      placedDateItem,
      settledDateItem,
      deviceId: jurisdiction.jurisdiction === Jurisdiction.BRAZIL ? deviceId : undefined,
      showReuseSelectionsButton,
      betSelections,
      product,
      animated,
      isSettledView,
    };
  };
};

const dispatchCopyBetIdAction = (): MyBetsCopyBetId => ({
  type: UI__MY_BETS_COPY_BET_ID,
});

const dispatchCopyRegulatorBetIdAction = (): MyBetsCopyRegulatorBetId => ({
  type: UI__MY_BETS_COPY_REGULATOR_BET_ID,
});

const dispatchCopyDeviceIdAction = (): MyBetsCopyDeviceId => ({
  type: UI__MY_BETS_COPY_DEVICE_ID,
});

const dispatchMyBetsSbkAddPreviousSelections = (
  selections: SelectionsToReuse,
  product: string,
  isSettledView: boolean,
): MyBetsSportsbookAddPreviousSelectionsClickAction => ({
  type: UI__MY_BETS_SBK_ADD_PREVIOUS_SELECTIONS_CLICK,
  payload: {
    selections,
    group: product === "VIRTUAL_SPORTS" ? "VIRTUAL" : "REAL",
    ensureSelectionsFromStore: false,
    source: isSettledView ? "settled" : "open",
  },
});

export type DispatchProps = {
  dispatchCopyBetIdAction: typeof dispatchCopyBetIdAction;
  dispatchCopyRegulatorBetIdAction: typeof dispatchCopyRegulatorBetIdAction;
  dispatchCopyDeviceIdAction: typeof dispatchCopyDeviceIdAction;
  dispatchMyBetsSbkAddPreviousSelections: typeof dispatchMyBetsSbkAddPreviousSelections;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchCopyBetIdAction,
  dispatchCopyRegulatorBetIdAction,
  dispatchCopyDeviceIdAction,
  dispatchMyBetsSbkAddPreviousSelections,
};
