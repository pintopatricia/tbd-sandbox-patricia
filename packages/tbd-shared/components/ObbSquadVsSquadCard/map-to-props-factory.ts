import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store";
import {
  createObbCardByURNSelector,
  createObbCardPositionSelector,
} from "@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors";
import { createGetExperimentSelector } from "@ppb/tbd-store/state/entities/experiments/experiments-selectors";
import { ObbPositionType } from "@ppb/tbd-store/state/layout/cards/obb-card/ObbCard.types";
import {
  OBB_CARD__ON_SQUADVSSQUAD_MODAL_OPEN,
  UI__SQUAD_VS_SQUAD_PLAYER_PICKER_OPEN,
  ObbSquadVsSquadOnModalOpenAction,
  ObbSquadVsSquadPlayerPickerOpenAction,
  ObbEventSelectionAction,
  OBB_CARD__EVENT_SELECTION,
  ObbSquadVsSquadTogglePlayersTooltipAction,
  UI__SQUAD_VS_SQUAD_TOGGLE_PLAYERS_TOOLTIP,
} from "@ppb/tbd-store/actions/obb";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";

import { i18n } from "../../helpers/i18n";

import {
  buildPlayer,
  buildMicroPlayerVm,
  getContextualStatsText,
  getSquadAverageStatByIncidentType,
  isToRemoveObbStatsLabel,
  Jersey,
  PlayerNames,
  getIncidentDataMapping,
} from "../../helpers/obb";

export type ContainerProps = {
  urn: URN;
  layoutUrn?: string;
  cardGroupUrn?: string;
  itemIndex?: number;
};

export type ObbSquadVsSquadCardProps = {
  urn: URN;
  title: string;
  eventName: string;
  outcomeLabel: string;
  showModalEntryPoint: boolean;
  defaultLegs: string[];
  position: ObbPositionType | undefined;
  firstSquadStatValue: string;
  secondSquadStatValue: string;
  contextualStatsText: string;
  firstSquadJerseys: Jersey[];
  secondSquadJerseys: Jersey[];
  firstSquadParticipantsNames: PlayerNames[];
  secondSquadParticipantsNames: PlayerNames[];
  removeObbStatsLabel: boolean;
};

export type StateProps = ObbSquadVsSquadCardProps | Record<string, never>;

export type ComponentProps = StateProps & ContainerProps & DispatchProps;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getObbSquadVsSquadCardByURN = createObbCardByURNSelector();
  const getObbCardPositionByLayout = createObbCardPositionSelector();
  const getExperiment = createGetExperimentSelector();

  return (state: ApplicationState, { urn, layoutUrn, cardGroupUrn, itemIndex }: ContainerProps): StateProps => {
    const obbSquadVsSquadCard = getObbSquadVsSquadCardByURN(state, urn);
    if (!obbSquadVsSquadCard || obbSquadVsSquadCard.typename !== "ObbSquadVsSquadCard") return {};

    const firstSquadParticipants = obbSquadVsSquadCard.firstSquadParticipants.map((participant) =>
      buildPlayer(participant),
    );
    const secondSquadParticipants = obbSquadVsSquadCard.secondSquadParticipants.map((participant) =>
      buildPlayer(participant),
    );

    const firstSquadMicroPlayerVm = buildMicroPlayerVm(firstSquadParticipants);
    const secondSquadMicroPlayerVm = buildMicroPlayerVm(secondSquadParticipants);

    const firstSquadAverageStat = getSquadAverageStatByIncidentType(
      obbSquadVsSquadCard.firstSquadParticipants,
      obbSquadVsSquadCard.incidentType,
    );
    const secondSquadAverageStat = getSquadAverageStatByIncidentType(
      obbSquadVsSquadCard.secondSquadParticipants,
      obbSquadVsSquadCard.incidentType,
    );

    const outcomeLabel =
      obbSquadVsSquadCard.outcomesLabel ||
      i18n({
        key: "I18N.OBB.SQUAD_VS_SQUAD.DEFAULT_OUTCOMES.LABEL",
        interpolationValues: {
          outcome: getIncidentDataMapping(obbSquadVsSquadCard.incidentType)?.text.toLowerCase() || "",
        },
      });

    const bfObpRemoveStatsLabelExperiment = getExperiment(
      state.entities.experiments,
      "exp-bf-sport-obp-remove-stats-label",
    );
    const sbgObpRemoveStatsLabelExperiment = getExperiment(
      state.entities.experiments,
      "exp-sbg-sport-obp-remove-stats-label",
    );
    return {
      urn,
      title: obbSquadVsSquadCard.title,
      eventName: obbSquadVsSquadCard.sportevent.name,
      showModalEntryPoint: obbSquadVsSquadCard.showModalEntryPoint,
      position: getObbCardPositionByLayout(state, cardGroupUrn || "", layoutUrn, itemIndex),
      outcomeLabel,
      firstSquadStatValue: firstSquadAverageStat ?? "-",
      secondSquadStatValue: secondSquadAverageStat ?? "-",
      contextualStatsText: getContextualStatsText(obbSquadVsSquadCard.statsLabel, obbSquadVsSquadCard.incidentType),
      firstSquadJerseys: firstSquadMicroPlayerVm.jerseys,
      secondSquadJerseys: secondSquadMicroPlayerVm.jerseys,
      firstSquadParticipantsNames: firstSquadMicroPlayerVm.players,
      secondSquadParticipantsNames: secondSquadMicroPlayerVm.players,
      defaultLegs: obbSquadVsSquadCard.defaultLegs as string[],
      removeObbStatsLabel: isToRemoveObbStatsLabel(bfObpRemoveStatsLabelExperiment || sbgObpRemoveStatsLabelExperiment),
    };
  };
};

export type DispatchActions =
  | ObbSquadVsSquadOnModalOpenAction
  | ObbSquadVsSquadPlayerPickerOpenAction
  | ObbEventSelectionAction
  | ObbSquadVsSquadTogglePlayersTooltipAction;

export type DispatchProps = {
  dispatchTaggingInteractionClick: (element: "1" | "2", urn?: string, eventName?: string) => void;
  dispatchOnSquadVsSquadModalOpen: (cardUrn: URN) => void;
  dispatchPlayerPickerModalOpen: (cardUrn: URN) => void;
  dispatchTogglePlayersTooltip: (cardUrn: string, actionType: TaggingAction.OPENED | TaggingAction.CLOSED) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchTaggingInteractionClick: (element: "1" | "2", urn?: string, eventName?: string) => {
    dispatch<ObbEventSelectionAction>({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event: {
          elementText: `edit squad ${element}`,
          module: { card: "mash ups" },
        },
        urn,
        eventName,
      },
    });
  },
  dispatchOnSquadVsSquadModalOpen: (cardUrn: URN) => {
    dispatch<ObbSquadVsSquadOnModalOpenAction>({
      type: OBB_CARD__ON_SQUADVSSQUAD_MODAL_OPEN,
      payload: {
        cardUrn,
      },
    });
  },
  dispatchPlayerPickerModalOpen: (cardUrn: string) => {
    dispatch<ObbSquadVsSquadPlayerPickerOpenAction>({
      type: UI__SQUAD_VS_SQUAD_PLAYER_PICKER_OPEN,
      payload: {
        cardUrn,
      },
    });
  },
  dispatchTogglePlayersTooltip: (cardUrn: string, actionType: TaggingAction.OPENED | TaggingAction.CLOSED) => {
    dispatch<ObbSquadVsSquadTogglePlayersTooltipAction>({
      type: UI__SQUAD_VS_SQUAD_TOGGLE_PLAYERS_TOOLTIP,
      payload: {
        cardUrn,
        actionType,
      },
    });
  },
});
