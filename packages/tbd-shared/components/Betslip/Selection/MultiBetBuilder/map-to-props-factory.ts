import { Dispatch } from "redux";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

import { BetslipSportsbookRemoveLegClick, UI__BETSLIP_SBK_REMOVE_LEG_CLICK } from "@ppb/tbd-store/actions/betslip";
import { BettingSportsbookRemoveLegAction, BETTING__SBK_REMOVE_LEG_ACTION } from "@ppb/tbd-store/actions/betting";
import {
  createSportsbookBettingRunnerSelector,
  getBettingResolvers,
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

import { createGetThrottleSelector } from "@ppb/tbd-store";
import { getSelectionTypeIcon } from "../../../../helpers/selection-type";
import { createIsConfirmStep } from "../../sportsbook-betslip-confirm-mapper";
import { buildSelection } from "../../connected-sportsbook-betslip-mapper";
import { ContainerProps, DispatchProps, StateProps } from "../props";

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookBettingRunner = createSportsbookBettingRunnerSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getIsConfirmStep = createIsConfirmStep();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();
  const getThrottle = createGetThrottleSelector();

  return (appState: ApplicationState, { id }): StateProps => {
    const isConfirmStep = getIsConfirmStep(appState);
    const leg = isConfirmStep ? getSportsbookConfirmationLegs(appState)[id] : getSportsbookBettingLegs(appState)[id];
    const userDetails = <UserDetails>getUserDetailsSelector(appState);
    const trapIconThrottle = getThrottle(appState.entities.throttles, "SHOW_TRAP_ICON");

    if (!leg) {
      return { id, title: "", subtitle: "", odd: "" };
    }

    const group = getBetslipGroup(appState);
    const resolvers = getBettingResolvers(group);
    const bettingRunnersMetadata = resolvers.getMetadata(appState);
    const { runners } = leg;
    const [legRunnerId] = runners;

    const metadata = bettingRunnersMetadata[legRunnerId];
    if (!metadata) {
      return {};
    }

    const bettingRunner = getSportsbookBettingRunner(appState.betting.sportsbookBetting.runners, legRunnerId);
    const { title, subtitle, icon, racingSport, silkFallbackType, meetingCountry, trap } = buildSelection(
      metadata,
      userDetails,
      bettingRunner,
    );
    const card = getBetslipCard(appState);
    const { placeStatus } = card || {};
    const isPlacing = placeStatus === "INPROGRESS";

    return {
      urn: metadata.runnerUrn,
      id: leg.id,
      title,
      isPlacing,
      subtitle,
      icon,
      trap,
      meetingCountry,
      racingSport,
      silkFallbackType,
      odd: "",
      is90Min: metadata.is90Min,
      selectionTypeIcon: isBrandSettingEnabled(appState, "SHOW_SELECTION_TYPE_ICON")
        ? getSelectionTypeIcon(metadata.marketType, metadata.isSuperSub)
        : undefined,
      isTrapIconThrottleActive: trapIconThrottle?.isActive,
    };
  };
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchSelectionRemove: (legId: string, runnerUrn: string) => {
    dispatch<BetslipSportsbookRemoveLegClick>({
      type: UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
      payload: { legId, runnerUrn },
    });
    dispatch<BettingSportsbookRemoveLegAction>({
      type: BETTING__SBK_REMOVE_LEG_ACTION,
      payload: { legId },
    });
  },
});
