import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createRaceRunnerByURNSelector } from "@ppb/tbd-store/state/entities/race-runners/race-runners-selectors";
import { RunnerInfoCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { i18n } from "../../helpers/i18n";
import { RunnerInfoProps } from "./snowflakes/RunnerInfo/RunnerInfo.types";

export type ContainerProps = { urn: string };

export type CardProps = RunnerInfoProps;

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getRunnerInfoCardByURN = createCardByURNSelector<RunnerInfoCards, URN>();
  const getRaceRunnerByURN = createRaceRunnerByURNSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const card = getRunnerInfoCardByURN(state.layouts.cards.runnerinfos, urn);

    if (!card) {
      return {};
    }

    const { raceRunner: raceRunnerURN } = card;
    const {
      details: { silk, saddleCloth, jockeyName, trainerName },
      horse: { name },
    } = getRaceRunnerByURN(state.entities.racerunners, raceRunnerURN);

    return {
      silkURL: silk,
      silkAlt: i18n({ key: "I18N.RACE_RUNNER.SILK_ALT" }),
      runnerNumber: saddleCloth,
      runnerName: name,
      jockeyLabel: i18n({ key: "I18N.RACE_RUNNER.JOCKEY" }),
      jockey: jockeyName,
      trainerLabel: i18n({ key: "I18N.RACE_RUNNER.TRAINER" }),
      trainer: trainerName,
    };
  };
};

export const mapDispatchToProps = {};
