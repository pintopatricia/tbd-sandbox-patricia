import { Dispatch } from "redux";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

import { BetslipSportsbookRemoveLegClick, UI__BETSLIP_SBK_REMOVE_LEG_CLICK } from "@ppb/tbd-store/actions/betslip";
import { BettingSportsbookRemoveLegAction, BETTING__SBK_REMOVE_LEG_ACTION } from "@ppb/tbd-store/actions/betting";
import {
  createSportsbookBettingRunnerSelector,
  getBettingResolvers,
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createIsBrandSettingEnabledSelector } from "@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  getBetslipGroup,
  getBetslipCard,
  getSportsbookConfirmationLegs,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { HintType } from "@ppb/the-wall-common/types";

import { createGetThrottleSelector } from "@ppb/tbd-store";
import { createIsConfirmStep } from "../../sportsbook-betslip-confirm-mapper";
import { getSelectionTypeIcon } from "../../../../helpers/selection-type";
import { i18n } from "../../../../helpers/i18n";
import {
  buildSelection,
  hasAnyInvalidSGMCombinationFailure,
  hasAnySameMarketCombinationFailure,
  hasNotEligibleSGMSelectionCombinationFailure,
} from "../../connected-sportsbook-betslip-mapper";
import { ContainerProps, DispatchProps, StateProps } from "../props";

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getIsConfirmStep = createIsConfirmStep();
  const getSportsbookBettingRunner = createSportsbookBettingRunnerSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();
  const getThrottle = createGetThrottleSelector();

  return (appState: ApplicationState, { id }) => {
    const isConfirmStep = getIsConfirmStep(appState);
    const leg = isConfirmStep ? getSportsbookConfirmationLegs(appState)[id] : getSportsbookBettingLegs(appState)[id];
    const userDetails = <UserDetails>getUserDetailsSelector(appState);

    if (!leg) {
      return { id, title: "", subtitle: "", action: "", odd: "" };
    }

    const group = getBetslipGroup(appState);
    const resolvers = getBettingResolvers(group);
    const bettingRunnersMetadata = resolvers.getMetadata(appState);
    const failedRunners = getSportsbookBettingImplyRunnerFailures(appState);
    const { runners } = leg;
    const [legRunnerId] = runners;
    const metadata = bettingRunnersMetadata[legRunnerId];
    const bettingRunner = getSportsbookBettingRunner(appState.betting.sportsbookBetting.runners, legRunnerId);
    const trapIconThrottle = getThrottle(appState.entities.throttles, "SHOW_TRAP_ICON");

    const { title, subtitle, icon, silkFallbackType, meetingCountry, trap } = buildSelection(
      metadata,
      userDetails,
      bettingRunner,
    );
    const runnerFailures = failedRunners[legRunnerId] ?? [];
    const card = getBetslipCard(appState);
    const { placeStatus } = card || {};
    const isPlacing = placeStatus === "INPROGRESS";
    let hintMessage;
    let hintType;

    if (hasAnySameMarketCombinationFailure(runnerFailures) || hasAnyInvalidSGMCombinationFailure(runnerFailures)) {
      hintMessage = i18n({ key: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS" });
      hintType = HintType.Warning;
    } else if (hasNotEligibleSGMSelectionCombinationFailure(runnerFailures)) {
      hintMessage = i18n({ key: "I18N.BETSLIP.NOT_AVAILABLE_BET_BUILDER" });
      hintType = HintType.Warning;
    }

    return {
      urn: metadata.runnerUrn,
      id: leg.id,
      title,
      subtitle,
      isPlacing,
      odd: "",
      hintMessage,
      hintType,
      is90Min: metadata.is90Min,
      selectionTypeIcon: isBrandSettingEnabled(appState, "SHOW_SELECTION_TYPE_ICON")
        ? getSelectionTypeIcon(metadata.marketType, metadata.isSuperSub)
        : undefined,
      icon,
      silkFallbackType,
      meetingCountry,
      trap,
      isTrapIconThrottleActive: trapIconThrottle?.isActive,
    };
  };
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchSelectionRemove: (id: string, urn: string) => {
    dispatch<BetslipSportsbookRemoveLegClick>({
      type: UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
      payload: { legId: id, runnerUrn: urn },
    });
    dispatch<BettingSportsbookRemoveLegAction>({
      type: BETTING__SBK_REMOVE_LEG_ACTION,
      payload: { legId: id },
    });
  },
});
