import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createFindCardbyURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";

export type ContainerProps = {
  urn: string;
  typename: string;
  layoutUrn?: string;
  cardGroupUrn?: string;
  itemIndex?: number;
};

export type CardProps = {
  typename: string;
  isCardLoaded: boolean;
  layoutUrn?: string;
  cardGroupUrn?: string;
  itemIndex?: number;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getFindObbCardbyURNSelector = createFindCardbyURNSelector();

  return (
    state: ApplicationState,
    { urn, typename, layoutUrn, cardGroupUrn, itemIndex }: ContainerProps,
  ): StateProps => {
    const card = getFindObbCardbyURNSelector(state.layouts.cards, urn);

    return {
      typename,
      isCardLoaded: !!card,
      layoutUrn,
      cardGroupUrn,
      itemIndex,
    };
  };
};

export type DispatchProps = Record<string, never>;

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = () => ({});
