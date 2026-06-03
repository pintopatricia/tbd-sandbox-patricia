import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  createObbCardByURNSelector,
  createObbCardPositionSelector,
} from "@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors";
import { ObbPositionType } from "@ppb/tbd-store/state/layout/cards/obb-card/ObbCard.types";
import { createGetExperimentSelector } from "@ppb/tbd-store/state/entities/experiments/experiments-selectors";
import {
  OBB_CARD__EVENT_SELECTION,
  OBB_CARD__ON_SQUADBET_MODAL_OPEN,
  OBB_CARD__RESET_SQUADBET_MODAL_STATE,
  ObbEventSelectionAction,
  ObbResetSquadBetModalStateAction,
  ObbSquadbetOnModalOpenAction,
  ObbSquadBetPlayerPickerOpenAction,
  UI__SQUAD_BET_PLAYER_PICKER_OPEN,
} from "@ppb/tbd-store/actions/obb";
import {
  buildPlayer,
  getSquadAverageStatByIncidentType,
  isToRemoveObbStatsLabel,
  PlayerWithJersey,
} from "../../helpers/obb";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
  layoutUrn?: string;
  cardGroupUrn?: string;
  itemIndex?: number;
};

export type ObbSquadBetCardProps = {
  urn?: URN;
  title?: string;
  outcomesLabel?: string;
  squadParticipants: PlayerWithJersey[];
  statsLabel: string;
  defaultOutcomeIndex?: number;
  eventName: string;
  showModalEntryPoint: boolean;
  entryPointLabel: string;
  incidentType: string;
  defaultLegs: string[];
  position: ObbPositionType | undefined;
  removeObbStatsLabel: boolean;
  isPlayerCarouselClickable: boolean;
  withPlusButtonInPlayerCarousel: boolean;
  showSimplifiedBetButtons: boolean;
};

export type StateProps = ObbSquadBetCardProps | Record<string, never>;

export type ComponentProps = StateProps & ContainerProps & DispatchProps;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getObbSquadBetCardByURN = createObbCardByURNSelector();
  const getObbCardPositionByLayout = createObbCardPositionSelector();
  const getExperiment = createGetExperimentSelector();

  return (state: ApplicationState, { urn, layoutUrn, cardGroupUrn, itemIndex }: ContainerProps): StateProps => {
    const obbSquadBetCard = getObbSquadBetCardByURN(state, urn);
    if (!obbSquadBetCard || obbSquadBetCard.typename !== "ObbSquadBetCard" || !obbSquadBetCard.defaultLegs) {
      return {};
    }

    const bfObpRemoveStatsLabelExperiment = getExperiment(
      state.entities.experiments,
      "exp-bf-sport-obp-remove-stats-label",
    );
    const sbgObpRemoveStatsLabelExperiment = getExperiment(
      state.entities.experiments,
      "exp-sbg-sport-obp-remove-stats-label",
    );
    const sbgNudgePlayerPickerExperiment = getExperiment(
      state.entities.experiments,
      "exp-sbg-sport-obp-nudge-player-picker-1",
    );

    const betButtonsSimplificationExperiment = getExperiment(
      state.entities.experiments,
      "exp-obp-squadbet-bet-buttons-simplification",
    );

    const squadParticipants = obbSquadBetCard.squadParticipants.map((participant) => buildPlayer(participant));

    const averageSquadStat = getSquadAverageStatByIncidentType(
      obbSquadBetCard.squadParticipants,
      obbSquadBetCard.incidentType,
    );
    const averageSquadStatByIncidentType = averageSquadStat === null ? "-" : averageSquadStat;

    return {
      urn,
      title: obbSquadBetCard.title,
      outcomesLabel: obbSquadBetCard.outcomesLabel,
      squadParticipants,
      statsLabel: `${averageSquadStatByIncidentType} ${obbSquadBetCard.statsLabel}`,
      defaultOutcomeIndex: obbSquadBetCard.defaultOutcomeIndex,
      eventName: obbSquadBetCard.sportevent.name,
      showModalEntryPoint: obbSquadBetCard.showModalEntryPoint,
      entryPointLabel: obbSquadBetCard.entryPointLabel || i18n({ key: "I18N.OBB.SQUADBET.MODAL_ENTRY_POINT" }),
      incidentType: obbSquadBetCard.incidentType,
      position: getObbCardPositionByLayout(state, cardGroupUrn ?? "", layoutUrn ?? "", itemIndex ?? 0),
      defaultLegs: obbSquadBetCard.defaultLegs as string[],
      removeObbStatsLabel: isToRemoveObbStatsLabel(bfObpRemoveStatsLabelExperiment || sbgObpRemoveStatsLabelExperiment),
      isPlayerCarouselClickable:
        obbSquadBetCard.showModalEntryPoint &&
        !!sbgNudgePlayerPickerExperiment &&
        sbgNudgePlayerPickerExperiment.variant !== "control",
      withPlusButtonInPlayerCarousel:
        obbSquadBetCard.showModalEntryPoint &&
        !!sbgNudgePlayerPickerExperiment &&
        sbgNudgePlayerPickerExperiment.variant === "exp-variant-with-plus-button",
      showSimplifiedBetButtons:
        !!betButtonsSimplificationExperiment && betButtonsSimplificationExperiment.variant !== "control",
    };
  };
};

export type DispatchActions =
  | ObbEventSelectionAction
  | ObbSquadbetOnModalOpenAction
  | ObbResetSquadBetModalStateAction
  | ObbSquadBetPlayerPickerOpenAction;

export type DispatchProps = {
  dispatchTaggingInteractionClick: (
    element: "player" | "bet button",
    direction: "previous" | "next",
    urn?: string,
    eventName?: string,
  ) => void;
  dispatchOnSquadbetModalOpen: (cardUrn: URN) => void;
  dispatchResetSquadbetModal: (cardUrn: URN) => void;
  dispatchPlayerPickerModalOpen: (cardUrn: URN, element?: string) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchTaggingInteractionClick: (
    element: "player" | "bet button",
    direction: "previous" | "next",
    urn?: string,
    eventName?: string,
  ) => {
    dispatch<ObbEventSelectionAction>({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event: {
          elementText: `${element} - ${direction}`,
        },
        urn,
        eventName,
      },
    });
  },
  dispatchOnSquadbetModalOpen: (cardUrn: URN) => {
    dispatch<ObbSquadbetOnModalOpenAction>({
      type: OBB_CARD__ON_SQUADBET_MODAL_OPEN,
      payload: {
        cardUrn,
      },
    });
  },
  dispatchResetSquadbetModal(cardUrn: URN) {
    dispatch<ObbResetSquadBetModalStateAction>({
      type: OBB_CARD__RESET_SQUADBET_MODAL_STATE,
      payload: {
        cardUrn,
      },
    });
  },
  dispatchPlayerPickerModalOpen: (cardUrn: string, element?: string) => {
    dispatch<ObbSquadBetPlayerPickerOpenAction>({
      type: UI__SQUAD_BET_PLAYER_PICKER_OPEN,
      payload: {
        cardUrn,
        element,
      },
    });
  },
});
