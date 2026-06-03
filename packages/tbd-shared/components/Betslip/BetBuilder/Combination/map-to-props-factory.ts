import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

import { BettingState } from "@ppb/betslip-core";
import {
  getBetslipGroup,
  getSportsbookConfirmationCombinations,
  getSportsbookConfirmationLegs,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  createGetIsCombinationOpportunityType,
  createGetPopularCombination,
} from "@ppb/tbd-store/state/betslip/betslip-popular-bets-selectors";
import {
  createGetFailureLegIdsByCombinationGroupIdSelector,
  getBettingResolvers,
  getSportsbookBettingCombinations,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { AlertViewModel } from "@ppb/the-wall-common/types";

import { createIsConfirmStep } from "../../sportsbook-betslip-confirm-mapper";
import { i18n } from "../../../../helpers/i18n";
import { combinationToBetBuilder } from "../../connected-sportsbook-betslip-mapper";
import { DispatchProps, StateProps } from "../props";

import { CombinationContainerProps } from "./props";

const EMPTY_NOTIFICATIONS: AlertViewModel[] = [];

export const makeMapStateToProps: MapStateToPropsFactory<
  StateProps,
  CombinationContainerProps,
  ApplicationState
> = () => {
  const labels = {
    odds: i18n({ key: "I18N.BETSLIP.ODDS" }),
    stake: i18n({ key: "I18N.BETSLIP.STAKE" }),
    popular: i18n({ key: "I18N.BETSLIP.POPULAR" }),
    createdBets: i18n({ key: "I18N.BETSLIP.RAB" }),
  };
  const getFailedLegIdsByCombinationGroup = createGetFailureLegIdsByCombinationGroupIdSelector();
  const getPopularCombination = createGetPopularCombination();
  const getIsPackagedCreatedBets = createGetIsCombinationOpportunityType("CREATED_BETS");
  const getIsConfirmStep = createIsConfirmStep();

  return (appState: ApplicationState, { id }: CombinationContainerProps) => {
    if (!appState.betslip) {
      return {};
    }

    try {
      const isConfirmStep = getIsConfirmStep(appState);
      let legsMap: BettingState.LegsMap;
      let combination: BettingState.Combination;
      let failures: string[];

      if (isConfirmStep) {
        legsMap = getSportsbookConfirmationLegs(appState);
        combination = getSportsbookConfirmationCombinations(appState)[id];
        failures = [];
      } else {
        legsMap = getSportsbookBettingLegs(appState);
        combination = getSportsbookBettingCombinations(appState)[id];
        failures = getFailedLegIdsByCombinationGroup(appState, combination?.combinationGroup);
      }

      if (!Object.keys(legsMap).length || !Object.keys(combination).length) {
        return {};
      }

      const group = getBetslipGroup(appState);
      const resolvers = getBettingResolvers(group);
      const runnersMetadata = resolvers.getMetadata(appState);
      const userDetails = <UserDetails>getUserDetails(appState);
      const runnersMapBettingState = appState.betting.sportsbookBetting.runners;

      const { selections, ...betBuilder } = combinationToBetBuilder(
        legsMap,
        runnersMetadata,
        userDetails,
        runnersMapBettingState,
      )(combination);

      const popularCombination = getPopularCombination(appState, selections);

      const isPopular = popularCombination?.bettingOpportunityType === "POPULAR";
      const isPackagedCreatedBets = getIsPackagedCreatedBets(appState, selections);

      return {
        ...betBuilder,
        legIds: combination.legs,
        failedLegIds: failures,
        i18n: labels,
        isPopular,
        isPackagedCreatedBets,
        notifications: EMPTY_NOTIFICATIONS,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, CombinationContainerProps> = () => ({});
