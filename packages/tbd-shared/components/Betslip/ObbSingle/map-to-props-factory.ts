import { BETTING__OBB_REMOVE_LEG_ACTION, BettingObbRemoveLegAction } from "@ppb/tbd-store/actions/betting";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createGetObbLegsMetadataByPotentialBetIdSelector } from "@ppb/tbd-store/state/betting/obb-betting/obb-betting-selectors";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

export type ContainerProps = {
  potentialBetId: string;
  shouldFocusStakeField?: boolean;
  hasAvailabilityHints?: boolean;
  hasReturnsLabel?: boolean;
};

type CardProps = {
  legId: string;
  outcomeDescription: string;
  participant: string;
  isPlacing: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getBetLegsMetadataByPotentialBetId = createGetObbLegsMetadataByPotentialBetIdSelector();

  return (appState: ApplicationState, { potentialBetId }: ContainerProps): StateProps => {
    try {
      const obbLegsMetadata = getBetLegsMetadataByPotentialBetId(appState, potentialBetId);
      const card = getBetslipCard(appState);
      const { placeStatus } = card || {};

      if (!Object.entries(obbLegsMetadata).length) {
        return {};
      }

      const [legId, { participantsDescription, outcomeDescription, eventName }] = Object.entries(obbLegsMetadata)[0];

      const isPlacing = placeStatus === "INPROGRESS";
      const outcomeDescriptionWithEvent = `${outcomeDescription ? `${outcomeDescription} - ` : ""}${eventName || ""}`;

      return {
        legId,
        outcomeDescription: outcomeDescriptionWithEvent,
        participant: participantsDescription || "",
        isPlacing,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

export type DispatchActions = BettingObbRemoveLegAction;

export type DispatchProps = {
  dispatchRemoveSelectionAction: (legId: string) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchRemoveSelectionAction: (legId: string) =>
    dispatch<BettingObbRemoveLegAction>({
      type: BETTING__OBB_REMOVE_LEG_ACTION,
      payload: { legId },
    }),
});
