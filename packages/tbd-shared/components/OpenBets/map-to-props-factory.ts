import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { URN, ViewLink } from "@ppb/the-wall-common/types";
import { createFindCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { createFindCardbyURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { Card } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { MyBetsResetFilters, MY_BETS_RESET_FILTERS } from "@ppb/tbd-store/actions/my-bets";
import { Dispatch } from "redux";
import { AllCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";

export type StateProps = {
  viewLink?: ViewLink;
};

function getOpenBetsLink(card: Card | AllCardGroups | null): ViewLink | undefined {
  return card && "viewOpenBets" in card ? card.viewOpenBets : undefined;
}

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCardGroupByURN = createFindCardGroupByURNSelector();
  const getCardByURN = createFindCardbyURNSelector();

  return (state: ApplicationState, { cardURN }: ContainerProps): StateProps => {
    const card = getCardByURN(state.layouts.cards, cardURN);
    const cardGroup = getCardGroupByURN(state.layouts.cardgroups, cardURN);
    const viewLink = getOpenBetsLink(cardGroup || card);

    return {
      viewLink,
    };
  };
};

export type DispatchOpenBetsNavigation = (viewLink: ViewLink) => void;
export type DispatchResetFilters = () => void;

export type DispatchProps = {
  dispatchOpenBetsNavigation: DispatchOpenBetsNavigation;
  dispatchResetFilters: DispatchResetFilters;
};

export type ContainerProps = { cardURN: URN };

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<PushAction | MyBetsResetFilters>,
) => ({
  dispatchOpenBetsNavigation: (viewLink) => {
    dispatch<PushAction>({
      type: PUSH,
      payload: viewLink,
    });
    dispatch<MyBetsResetFilters>({
      type: MY_BETS_RESET_FILTERS,
    });
  },
  dispatchResetFilters: () => {
    dispatch<MyBetsResetFilters>({
      type: MY_BETS_RESET_FILTERS,
    });
  },
});
