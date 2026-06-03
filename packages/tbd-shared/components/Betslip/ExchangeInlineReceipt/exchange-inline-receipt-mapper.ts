import { ExchangeSide as ExchangeSideType } from "@ppb/tbd-store/state/betting/exchange-bets/ExchangeBet.types";
import { BetslipExchangeReport, PlacedBetValues } from "@ppb/tbd-store/state/betslip/Betslip.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { roundDown, roundUp } from "@ppb/tbd-store/helpers/formatters";
import { AlertType } from "@ppb/the-wall-common/types";

import { ExchangeSide } from "@ppb/tbd-store/state/constants";
import { currencyFormatWithDecimalPlaces } from "../../../formatters/currency-formatters";
import { i18n } from "../../../helpers/i18n";
import { buildFreeBetsLabel } from "../betslip-formatters";
import { PlacedBetCardProps } from "./snowflakes/PlacedBetCard/PlacedBetCard.types";
import { ExchangeUnmatchedCardProps } from "./snowflakes/ExchangeUnmatchedCard/ExchangeUnmatchedCard.types";
import type { ExchangeInlineReceiptPanelProps } from "./snowflakes/ExchangeInlineReceiptPanel/ExchangeInlineReceiptPanel.types";
import { ApplicationState } from "@ppb/tbd-store";
import { getIsFreeBetsSelected } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { getInlineBetslipTitle } from "../../../helpers/exchange-betslip-title-helper";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

type ReceiptSegmentValues = {
  matched?: ExchangeInlineReceiptPanelProps["matched"];
  unmatched?: ExchangeInlineReceiptPanelProps["unmatched"];
};

/**
 * Round down for a back bet or round up for lay bet so
 * we won't show a better price to the user than the
 * actual price he got.
 */
const getRoundValue = ({ price, side }: { price: number; side: ExchangeSideType }): string =>
  side === ExchangeSide.BACK ? roundDown(price).toString() : roundUp(price).toString();

const buildMatchedValues = (
  side: ExchangeSideType,
  placedBetValues: PlacedBetValues,
  userDetails: UserDetails,
  hasFreeBets: boolean,
  isCancelled: boolean,
): PlacedBetCardProps => {
  const { profit, liability, size, price, totalBonusUsed } = placedBetValues;

  const formattedLiability = liability != undefined && liability < 0 ? 0 : liability;

  const layBetLiability =
    side === ExchangeSide.LAY && formattedLiability != undefined
      ? currencyFormatWithDecimalPlaces({ ...userDetails, value: formattedLiability, decimalPlaces: 2 })
      : undefined;

  const formattedSize = currencyFormatWithDecimalPlaces({ ...userDetails, value: size, decimalPlaces: 2 });

  const bonus =
    hasFreeBets && totalBonusUsed
      ? buildFreeBetsLabel(
          isCancelled ? "I18N.BETSLIP.CANCELLED_BONUS" : "I18N.BETSLIP.USED_BONUS",
          userDetails,
          totalBonusUsed,
        )
      : "";

  return {
    titlePrefix:
      side === ExchangeSide.BACK
        ? i18n({ key: "I18N.BETSLIP.BACK_BET_FOR" })
        : i18n({ key: "I18N.BETSLIP.LAY_BET_AGAINST" }),
    type: "MATCHED",
    price: getRoundValue({ price, side }),
    stake: formattedSize,
    profit: currencyFormatWithDecimalPlaces({ ...userDetails, value: profit ?? 0, decimalPlaces: 2 }),
    liability: layBetLiability,
    bonus,
    hasFreeBets,
    labels: {
      liability: i18n({ key: "I18N.BETSLIP.LIABILITY" }),
      name: i18n({ key: "I18N.BETSLIP.BET_MATCHED" }),
      price: i18n({ key: "I18N.BETSLIP.ODDS" }),
      stake: i18n({ key: "I18N.BETSLIP.STAKE" }),
      profit: i18n({ key: "I18N.BETSLIP.PROFIT" }),
    },
  };
};

const buildUnmatchedValues = (
  side: ExchangeSideType,
  placedBetValues: PlacedBetValues,
  userDetails: UserDetails,
  hasFreeBets: boolean,
  isCancelled: boolean,
): ExchangeUnmatchedCardProps => {
  const commonValues = buildMatchedValues(side, placedBetValues, userDetails, hasFreeBets, isCancelled);
  const name = !isCancelled ? i18n({ key: "I18N.BETSLIP.BET_UNMATCHED" }) : undefined;
  const notifications = hasFreeBets
    ? [
        {
          message: i18n({ key: "I18N.BETSLIP.EXC.ERROR.UNABLE_TO_EDIT_BONUS_BET" }),
          detail: i18n({ key: "I18N.BETSLIP.EXC.ERROR.SUBTITLE.UNABLE_TO_EDIT_BONUS_BET" }),
          type: AlertType.Warning,
        },
      ]
    : [];

  return {
    ...commonValues,
    type: "UNMATCHED",
    titlePrefix:
      side === ExchangeSide.BACK
        ? i18n({ key: "I18N.BETSLIP.BACK_BET_FOR" })
        : i18n({ key: "I18N.BETSLIP.LAY_BET_AGAINST" }),
    notifications,
    labels: {
      ...commonValues.labels,
      name,
      cancel: i18n({ key: "I18N.BETSLIP.CANCEL_BET" }),
      confirm: i18n({ key: "I18N.BETSLIP.EDIT_BET" }),
    },
  };
};

const buildCancelledValues = (
  side: ExchangeSideType,
  placedBetValues: PlacedBetValues,
  userDetails: UserDetails,
  hasFreeBets: boolean,
): ExchangeUnmatchedCardProps => {
  const commonValues = buildUnmatchedValues(side, placedBetValues, userDetails, hasFreeBets, true);

  return {
    ...commonValues,
    titlePrefix: i18n({ key: "I18N.BETSLIP.BET_CANCELLED" }),
  };
};

const buildPlacedSegments = (
  report: BetslipExchangeReport,
  hasFreeBets: boolean,
  userDetails: UserDetails,
): ReceiptSegmentValues | undefined => {
  const { side, matched, unmatched } = report;

  const matchedValues = matched
    ? { matched: buildMatchedValues(side, matched, userDetails, hasFreeBets, false) }
    : undefined;
  const unmatchedValues = unmatched
    ? { unmatched: buildUnmatchedValues(side, unmatched, userDetails, hasFreeBets, false) }
    : undefined;

  return {
    ...matchedValues,
    ...unmatchedValues,
  };
};

const buildCancelledSegments = (
  report: BetslipExchangeReport,
  hasFreeBets: boolean,
  userDetails: UserDetails,
): ReceiptSegmentValues | undefined => {
  const { side, cancelled } = report;

  return cancelled ? { unmatched: buildCancelledValues(side, cancelled, userDetails, hasFreeBets) } : undefined;
};

const buildReceiptSegmentValues = (
  report: BetslipExchangeReport,
  hasFreeBets: boolean,
  userDetails: UserDetails,
): ReceiptSegmentValues | undefined => {
  const { cancelled } = report;

  return cancelled
    ? buildCancelledSegments(report, hasFreeBets, userDetails)
    : buildPlacedSegments(report, hasFreeBets, userDetails);
};

/**
 * Builds the props for the exchange inline receipt panel from application state.
 *
 * Returns `undefined` when user details cannot be resolved or no exchange report exists.
 *
 * @param appState - The full application state.
 * @returns The receipt panel props, or `undefined` if required data is missing.
 */
export const buildExchangeInlineReceipt = (appState: ApplicationState): ExchangeInlineReceiptPanelProps | undefined => {
  const report = appState?.betslip?.exchangeReport;

  if (!report) {
    return undefined;
  }

  let userDetails: UserDetails;

  try {
    userDetails = getUserDetails(appState) as UserDetails;
  } catch (e) {
    console.error(e);

    return undefined;
  }

  const { side } = report;
  const hasFreeBets = getIsFreeBetsSelected(appState);
  const title = getInlineBetslipTitle(appState);
  const segmentValues = buildReceiptSegmentValues(report, hasFreeBets, userDetails);

  return {
    title,
    side,
    ...segmentValues,
  };
};
