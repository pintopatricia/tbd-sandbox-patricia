import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { BetCardGroups, MarketBetSelectionCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type CardProps = {
  items: PartialItem[];
};

export type StateProps = CardProps | Record<string, never>;

export type MyBetsCancelAllPress = (
  marketId: string,
  marketName: string,
  numberOfBets: number,
  marketBetCardGroupURN: URN,
  event?: string,
) => void;

export type DispatchProps = {};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCardGroupByURN = createCardGroupByURNSelector<MarketBetSelectionCardGroups | BetCardGroups, URN>();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const selectionsCardGroup = getCardGroupByURN(state.layouts.cardgroups.marketbetselectioncardgroups, urn);

    if (!selectionsCardGroup || selectionsCardGroup.typename !== "MarketBetSelectionCardGroup") {
      return {};
    }

    const { items } = selectionsCardGroup;

    return {
      items,
    };
  };
};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = () => ({});
