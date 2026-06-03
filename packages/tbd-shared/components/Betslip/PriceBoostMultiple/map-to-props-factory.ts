import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import {
  BetslipSportsbookRemoveBoostedCombinationClick,
  UI__BETSLIP_SBK_REMOVE_BOOSTED_COMBINATION_CLICK,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION,
  BettingSportsbookRemoveBoostedCombinationAction,
} from "@ppb/tbd-store/actions/betting";
import { getBoostedCombination } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { translateMultiple } from "../connected-sportsbook-betslip-mapper";

type CardProps = {
  title: string;
  legIds: string[];
};

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  id: string;
  shouldFocusStakeField?: boolean;
  betControlsExperimentVariant?: string;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> =
  () =>
  (appState: ApplicationState, { id }): StateProps => {
    const boostedCombination = getBoostedCombination(appState, id);

    if (!boostedCombination) {
      return {};
    }

    return {
      title: translateMultiple(boostedCombination.betType),
      legIds: boostedCombination.legs,
    };
  };

export type DispatchProps = {
  dispatchRemove: (legIds: string[]) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchRemove: (legIds) => {
    dispatch<BetslipSportsbookRemoveBoostedCombinationClick>({
      type: UI__BETSLIP_SBK_REMOVE_BOOSTED_COMBINATION_CLICK,
      payload: { legIds },
    });
    dispatch<BettingSportsbookRemoveBoostedCombinationAction>({
      type: BETTING__SBK_REMOVE_BOOSTED_COMBINATION_ACTION,
      payload: { legIds },
    });
  },
});
