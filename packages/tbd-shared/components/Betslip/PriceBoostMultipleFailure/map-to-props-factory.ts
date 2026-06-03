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
import { createGetLegIdsByCombinationGroupIdSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { i18n } from "../../../helpers/i18n";

type CardProps = {
  legIds: string[];
  odds: string;
  labels: {
    odds: string;
    stake: string;
  };
};

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  id: string;
  shouldFocusStakeField?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const labels = {
    odds: i18n({ key: "I18N.BETSLIP.ODDS" }),
    stake: i18n({ key: "I18N.BETSLIP.STAKE" }),
  };
  const getLegIdsByCombinationGroupId = createGetLegIdsByCombinationGroupIdSelector();

  return (appState: ApplicationState, { id }): StateProps => ({
    legIds: getLegIdsByCombinationGroupId(appState, id),
    odds: i18n({ key: "I18N.BETSLIP.NOT_AVAILABLE" }),
    labels,
  });
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
