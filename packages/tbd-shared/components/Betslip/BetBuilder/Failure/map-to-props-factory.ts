import { getBetslipGroup } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import {
  createGetFailureLegIdsByCombinationGroupIdSelector,
  createGetRunnerByCombinationGroupSelector,
  getBettingResolvers,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { i18n } from "../../../../helpers/i18n";
import { DispatchProps, StateProps } from "../props";
import { createNotificationsViewModelBuilder } from "./bet-builder-failure-mapper";
import { FailureContainerProps } from "./props";

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, FailureContainerProps, ApplicationState> = () => {
  const getRunnersByCombinationGroup = createGetRunnerByCombinationGroupSelector();
  const buildNotifications = createNotificationsViewModelBuilder();
  const getTotalBetBuilderFailure = createGetFailureLegIdsByCombinationGroupIdSelector();

  const labels = {
    odds: i18n({ key: "I18N.BETSLIP.ODDS" }),
    stake: i18n({ key: "I18N.BETSLIP.STAKE" }),
    popular: i18n({ key: "I18N.BETSLIP.POPULAR" }),
    createdBets: i18n({ key: "I18N.BETSLIP.RAB" }),
  };
  const baseState = {
    odds: i18n({ key: "I18N.BETSLIP.NOT_AVAILABLE" }),
    legIds: [],
    failedLegIds: [],
    isPopular: false,
    isPackagedCreatedBets: false,
    notifications: [],
    subtitle: "",
    i18n: labels,
  };

  return (appState: ApplicationState, { combinationGroup }: FailureContainerProps): StateProps => {
    const group = getBetslipGroup(appState);
    const resolvers = getBettingResolvers(group);
    const metadata = resolvers.getMetadata(appState);
    const runnerIds = getRunnersByCombinationGroup(appState, combinationGroup);
    const firstValidRunnerId = runnerIds.find((runnerId) => !!metadata[runnerId]);
    const validMetadata = firstValidRunnerId ? metadata[firstValidRunnerId] : null;

    if (!validMetadata) {
      return baseState;
    }

    const failures = getTotalBetBuilderFailure(appState, combinationGroup);

    return {
      ...baseState,
      failedLegIds: failures,
      notifications: buildNotifications(appState, runnerIds),
      subtitle: validMetadata.type === "GENERIC" ? validMetadata.eventName : validMetadata.racing.venue,
      i18n: labels,
    };
  };
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, FailureContainerProps> = () => ({});
