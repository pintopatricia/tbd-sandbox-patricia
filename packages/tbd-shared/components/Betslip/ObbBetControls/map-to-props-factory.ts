import {
  BETTING__OBB_CHANGE_STAKE_ACTION,
  BETTING__OBB_UPDATE_QUOTES,
  BettingObbChangeStakeAction,
  BettingObbUpdateQuotesAction,
  BETTING__OBB_VALIDATE_STAKE,
  BettingObbValidateStake,
  BETTING__OBB_TRANSFER_POTENTIAL_BET_STAKE,
} from "@ppb/tbd-store/actions/betting";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { BetControlsProps } from "@ppb/the-wall-common/types";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import {
  createGetObbLegsUrnsByPotentialBetIdSelector,
  createGetObbPotentialBetsByIdSelector,
  getObbBettingState,
} from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createGetThrottleSelector, UserDetails } from "@ppb/tbd-store";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { isStakeValid } from "@ppb/tbd-store/helpers/obb-betting";
import { i18n } from "../../../helpers/i18n";
import { buildObbPotentialBetOdds } from "../betslip-formatters";
import { currencyFormatWithDecimalPlaces, getCurrencySymbol } from "../../../formatters/currency-formatters";
import { getSeparatorByLocale } from "../../../helpers/numeric-i18n";
import { buildObbFailureDetails } from "./obb-bet-controls-mapper";

type ObbFullBetI18n = {
  odds: string;
  stake: string;
  returns: string;
  oddsMovementUp: string;
  oddsMovementDown: string;
};

export type ContainerProps = {
  potentialBetId: string;
  shouldFocusStakeField?: boolean;
  hasAvailabilityHints?: boolean;
  hasReturnsLabel?: boolean;
};

type CardProps = {
  i18n: ObbFullBetI18n;
  isSingleObbBetBetslip: boolean;
  hasStakeCaret: boolean;
} & Pick<
  BetControlsProps,
  | "separator"
  | "currencySymbol"
  | "odds"
  | "oddsMovement"
  | "formattedPotentialReturns"
  | "stake"
  | "isPanelDisabled"
  | "isStakeValid"
  | "hintType"
  | "hintMessage"
  | "displayReturns"
>;

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const i18nLabels: ObbFullBetI18n = {
    odds: i18n({ key: "I18N.BETSLIP.ODDS" }),
    stake: i18n({ key: "I18N.BETSLIP.STAKE" }),
    returns: "",
    oddsMovementUp: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_INCREASE" }),
    oddsMovementDown: i18n({ key: "I18N.BETSLIP.ODDS_MOVEMENT_DECREASE" }),
  };

  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getObbPotentialBet = createGetObbPotentialBetsByIdSelector();
  const getOddsMovement = createOddsMovementSelector();
  const getThrottle = createGetThrottleSelector();

  return (state: ApplicationState, { potentialBetId, hasAvailabilityHints, hasReturnsLabel }): StateProps => {
    let userDetails: UserDetails;

    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);

      return {};
    }

    const obbLegsByPotentialBet = createGetObbLegsUrnsByPotentialBetIdSelector();
    const obbLegs = obbLegsByPotentialBet(state, potentialBetId);
    const { quote, stake, potentialReturns } = getObbPotentialBet(state, potentialBetId);
    const { validations, failures } = getObbBettingState(state);
    const preferences = getUserPreferencesWithProductSwitcher(state.entities.preferences);
    const card = getBetslipCard(state);

    if (!card) {
      return {};
    }

    const isSingleObbBetBetslip = card?.obbOddsMovement && Object.keys(card.obbOddsMovement).length === 1;

    const { obbOddsMovement } = card;
    const oddsMovementMap = getOddsMovement(obbOddsMovement);
    const odds = buildObbPotentialBetOdds(quote, preferences.sportsbookOddsDisplay);

    const isPlacing = card?.placeStatus === "INPROGRESS";
    const obbFailureDetails = buildObbFailureDetails(failures.legs, obbLegs);
    const isPanelDisabled = isPlacing || obbFailureDetails.hasFailure;
    const hasHints = hasAvailabilityHints && obbFailureDetails.hint;

    let formattedPotentialReturns: string | undefined;

    if (hasReturnsLabel) {
      const showReturnsWithValue = potentialReturns != null || !!quote;

      i18nLabels.returns = showReturnsWithValue
        ? i18n({ key: "I18N.BETSLIP.RETURNS" })
        : i18n({ key: "I18N.BETSLIP.BET_RETURNS_TBD" });

      formattedPotentialReturns = showReturnsWithValue
        ? currencyFormatWithDecimalPlaces({
            ...userDetails,
            value: potentialReturns ?? 0,
            decimalPlaces: 2,
          })
        : undefined;
    }

    const potentialBetValidations = validations.potentialBets[potentialBetId];
    const isStakeCaretActive = getThrottle(state.entities.throttles, "INPUT_MARKER")?.isActive;

    return {
      separator: getSeparatorByLocale(userDetails.localeCode),
      currencySymbol: `${getCurrencySymbol(userDetails)}`,
      isPanelDisabled,
      i18n: i18nLabels,
      odds,
      stake: stake ?? undefined,
      oddsMovement: oddsMovementMap[potentialBetId]?.movement,
      formattedPotentialReturns,
      isStakeValid: isStakeValid(userDetails, potentialBetValidations),
      hintType: hasHints ? obbFailureDetails.hint?.hintType : undefined,
      hintMessage: hasHints ? obbFailureDetails.hint?.hintMessage : undefined,
      displayReturns: !!hasReturnsLabel,
      isSingleObbBetBetslip,
      hasStakeCaret: !!isStakeCaretActive,
    };
  };
};

export type DispatchProps = {
  dispatchStakeChange: ({ potentialBetId, newValue }: { potentialBetId: string; newValue?: number }) => void;
  dispatchStakeValidate: ({ potentialBetId }: { potentialBetId: string }) => void;
  dispatchQuotesUpdate: () => void;
  dispatchTransferStake: ({
    oldPotentialBetId,
    newPotentialBetId,
  }: {
    oldPotentialBetId: string;
    newPotentialBetId: string;
  }) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchStakeValidate: ({ potentialBetId }: { potentialBetId: string }) => {
    dispatch<BettingObbValidateStake>({
      type: BETTING__OBB_VALIDATE_STAKE,
      payload: { potentialBetId },
    });
  },
  dispatchStakeChange: ({ potentialBetId, newValue }: { potentialBetId: string; newValue?: number }) => {
    dispatch<BettingObbChangeStakeAction>({
      type: BETTING__OBB_CHANGE_STAKE_ACTION,
      payload: { potentialBetId, newValue: newValue || null },
    });
  },
  dispatchQuotesUpdate: () => {
    dispatch<BettingObbUpdateQuotesAction>({
      type: BETTING__OBB_UPDATE_QUOTES,
    });
  },
  dispatchTransferStake: ({
    oldPotentialBetId,
    newPotentialBetId,
  }: {
    oldPotentialBetId: string;
    newPotentialBetId: string;
  }) => {
    dispatch({
      type: BETTING__OBB_TRANSFER_POTENTIAL_BET_STAKE,
      payload: { oldPotentialBetId, newPotentialBetId },
    });
  },
});
