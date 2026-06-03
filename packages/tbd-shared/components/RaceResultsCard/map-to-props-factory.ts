import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { RaceResultsCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { OddsDisplayPreference } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createRaceWithRunnersByURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { createSportsbookDisplayOddsPreferencesSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import {
  SUBSCRIBE_RACE_UPDATES,
  SubscribeRaceUpdatesAction,
  UNSUBSCRIBE_RACE_UPDATES,
  UnsubscribeRaceUpdatesAction,
} from "@ppb/tbd-store/actions/race";
import { AlertProps, AlertType } from "@ppb/the-wall-common/types";
import { RaceDetails } from "@ppb/tbd-store";
import { createRaceResultsViewModel } from "../../view-model-factories/race-results-card";
import { i18n } from "../../helpers/i18n";
import { RacingResultsProps } from "./snowflakes/RacingResults/RacingResults.types";

export type ContainerProps = { urn: string };

export type CardProps = {
  resultType?: RaceDetails["resultType"];
  raceUrn: URN;
  winningTime?: string;
  bspAdvantage?: string;
  resultLabels: {
    fullResultsToFollowLabel: string;
    winningAndBspAdvantageLabel: string;
    winningTimeLabel: string;
    bspAdvantageLabel: string;
  };
} & RacingResultsProps;

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getRaceResultsCardByURN = createCardByURNSelector<RaceResultsCards, URN>();
  const getRaceWithRunnersByURN = createRaceWithRunnersByURNSelector();
  const getSportsbookDisplayOddsPreferences = createSportsbookDisplayOddsPreferencesSelector();
  const getRaceResultsViewModel = createRaceResultsViewModel();
  const labels = {
    positionLabel: i18n({ key: "I18N.RACING.POSITION_REDUCED" }),
    distanceLabel: i18n({ key: "I18N.RACING.DISTANCE_REDUCED" }),
    horseLabel: i18n({ key: "I18N.RACING.HORSE" }),
    startingPriceLabel: i18n({ key: "I18N.HORSE_RACING.SP" }),
    ranLabel: i18n({ key: "I18N.RACING.RAN_LABEL" }),
  };
  const resultLabels = {
    fullResultsToFollowLabel: i18n({ key: "I18N.RACING.REFRESH_FOR_RESULTS" }),
    winningAndBspAdvantageLabel: i18n({ key: "I18N.RACING.WINNING_AND_BSP_ADVANTAGE" }),
    winningTimeLabel: i18n({ key: "I18N.RACING.WINNING_TIME" }),
    bspAdvantageLabel: i18n({ key: "I18N.RACING.BSP_ADVANTAGE" }),
  };

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const raceResultsCard = getRaceResultsCardByURN(state.layouts.cards.raceresults, urn);

    if (!raceResultsCard) {
      return {};
    }

    const { race, raceRunners } = getRaceWithRunnersByURN(state.entities, raceResultsCard.race);
    const sportsbookOddsDisplay =
      getSportsbookDisplayOddsPreferences(state.entities.preferences) || OddsDisplayPreference.Decimal;
    const raceResultsVM = raceRunners && getRaceResultsViewModel({ raceRunners, race, sportsbookOddsDisplay });

    const minsSinceStart = (new Date().getTime() - new Date(race.details?.scheduledTime ?? 0).getTime()) / (1000 * 60);

    let statusAlert: AlertProps | undefined =
      minsSinceStart > 30
        ? {
            type: AlertType.Info,
            id: i18n({ key: "I18N.HORSE_RACING_STATUS_MESSAGING" }),
            message: i18n({ key: "I18N.HORSE_RACING_STATUS_MESSAGING" }),
            detail: i18n({ key: "I18N.HORSE_RACING_STATUS_MESSAGING_PT2" }),
            extraDetailInfo: i18n({ key: "I18N.MY_BETS.TITLE" }),
            url: "mybets/myBets-settled",
          }
        : {
            type: AlertType.Info,
            message: i18n({ key: "I18N.HORSE_RACING_STATUS_RESULTS_DUE" }),
          };

    statusAlert = !race.details?.resultType ? statusAlert : undefined;
    return {
      raceUrn: race.urn,
      title: raceResultsVM?.title,
      resultType: race.details?.resultType,
      labels,
      resultLabels,
      runners: raceResultsVM?.resultRunners || [],
      ranNumber: raceResultsVM?.ranNumber,
      dnfCodes: raceResultsVM?.dnfCodes,
      winningTime: raceResultsVM?.winningTime,
      bspAdvantage: raceResultsVM?.bspAdvantage,
      statusAlert,
    };
  };
};

const dispatchSubscribeRaceUpdates = (raceUrn: URN): SubscribeRaceUpdatesAction => ({
  type: SUBSCRIBE_RACE_UPDATES,
  payload: { urn: raceUrn },
});

const dispatchUnsubscribeRaceUpdates = (raceUrn: URN): UnsubscribeRaceUpdatesAction => ({
  type: UNSUBSCRIBE_RACE_UPDATES,
  payload: { urn: raceUrn },
});

export type DispatchProps = {
  dispatchSubscribeRaceUpdates: typeof dispatchSubscribeRaceUpdates;
  dispatchUnsubscribeRaceUpdates: typeof dispatchUnsubscribeRaceUpdates;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSubscribeRaceUpdates,
  dispatchUnsubscribeRaceUpdates,
};
