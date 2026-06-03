import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import { BetslipSportsbookRemoveLegClick, UI__BETSLIP_SBK_REMOVE_LEG_CLICK } from "@ppb/tbd-store/actions/betslip";
import { BettingSportsbookRemoveLegAction, BETTING__SBK_REMOVE_LEG_ACTION } from "@ppb/tbd-store/actions/betting";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import {
  createSportsbookBettingRunnerSelector,
  getBettingResolvers,
  getSportsbookBettingImplyRunnerFailures,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createIsBrandSettingEnabledSelector } from "@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { HintType } from "@ppb/the-wall-common/types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { getBetslipGroup, getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  hasAnyInvalidCombinationFailure,
  hasAnyMarketClosedFailure,
  hasAnyMarketSuspendedFailure,
} from "@ppb/tbd-store/helpers/sportsbook-betting";

import { createGetThrottleSelector } from "@ppb/tbd-store";
import { getSelectionTypeIcon } from "../../../../helpers/selection-type";
import { i18n } from "../../../../helpers/i18n";
import { buildSelection } from "../../connected-sportsbook-betslip-mapper";
import { ContainerProps, DispatchProps, StateProps } from "../props";

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getOddsMovement = createOddsMovementSelector();
  const getSportsbookBettingRunner = createSportsbookBettingRunnerSelector();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();
  const getThrottle = createGetThrottleSelector();

  return (appState, { id }): StateProps => {
    if (!appState.betslip) {
      return {};
    }
    const userDetails = <UserDetails>getUserDetailsSelector(appState);

    const group = getBetslipGroup(appState);
    const resolvers = getBettingResolvers(group);
    const leg = getSportsbookBettingLegs(appState)[id];
    const failedRunners = getSportsbookBettingImplyRunnerFailures(appState);
    const bettingRunnersMetadata = resolvers.getMetadata(appState);
    const oddsMovement = getOddsMovement(appState.betslip.sportsbookOddsMovement);
    const preferences = getUserPreferencesWithProductSwitcher(appState.entities.preferences);
    const trapIconThrottle = getThrottle(appState.entities.throttles, "SHOW_TRAP_ICON");
    const { runners } = leg;
    const [legRunnerId] = runners;
    const metadata = bettingRunnersMetadata[legRunnerId];
    if (!metadata) {
      return {};
    }

    const runnerFailures = failedRunners[legRunnerId] ?? [];
    const bettingRunner = getSportsbookBettingRunner(appState.betting.sportsbookBetting.runners, legRunnerId);
    const { title, subtitle, icon, silkFallbackType, meetingCountry, racingSport, trap } = buildSelection(
      metadata,
      userDetails,
      bettingRunner,
    );
    const card = getBetslipCard(appState);
    const { placeStatus } = card || {};
    const isPlacing = placeStatus === "INPROGRESS";
    let hintMessage;
    let hintType;

    if (hasAnyMarketClosedFailure(runnerFailures)) {
      hintMessage = i18n({ key: "I18N.MARKET.CLOSED" });
      hintType = HintType.Warning;
    } else if (hasAnyMarketSuspendedFailure(runnerFailures)) {
      hintMessage = i18n({ key: "I18N.MARKET.SUSPENDED" });
      hintType = HintType.Warning;
    } else if (hasAnyInvalidCombinationFailure(runnerFailures)) {
      hintMessage = i18n({ key: "I18N.BETSLIP.NOT_COMBINABLE_SELECTIONS" });
      hintType = HintType.Warning;
    }

    let odd;
    if (!leg.isBoosted) {
      odd =
        leg.odds && leg.displayOdds
          ? formatOdds(leg.displayOdds, preferences.sportsbookOddsDisplay)
          : i18n({ key: "I18N.BETSLIP.STARTING_PRICE" });
    }

    return {
      id: leg.id,
      urn: metadata.runnerUrn,
      title,
      subtitle,
      icon,
      silkFallbackType,
      racingSport,
      trap,
      meetingCountry,
      isPlacing,
      oddsMovement: !leg.isBoosted && leg.odds ? oddsMovement[leg.id]?.movement : undefined,
      odd,
      hintMessage,
      hintType,
      is90Min: metadata.is90Min,
      selectionTypeIcon: isBrandSettingEnabled(appState, "SHOW_SELECTION_TYPE_ICON")
        ? getSelectionTypeIcon(metadata.marketType, metadata.isSuperSub)
        : undefined,
      isTrapIconThrottleActive: trapIconThrottle?.isActive,
    };
  };
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchSelectionRemove: (id: string, urn: string) => {
    dispatch<BetslipSportsbookRemoveLegClick>({
      type: UI__BETSLIP_SBK_REMOVE_LEG_CLICK,
      payload: {
        legId: id,
        runnerUrn: urn,
      },
    });
    dispatch<BettingSportsbookRemoveLegAction>({
      type: BETTING__SBK_REMOVE_LEG_ACTION,
      payload: { legId: id },
    });
  },
});
