import { FetchCardsAction, FETCH_CARDS } from "@ppb/tbd-store/actions/catalogue";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { MapStateToPropsFactory } from "react-redux";
import {
  createGetHydratedExpandableMarketCardByURNSelector,
  createPartialExpandableMarketCardByURNSelector,
} from "@ppb/tbd-store/state/layout/cards/expandable-market/expandable-market-selectors";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type HydratedCardProps = {
  isShell: false;
  title: string;
  urn: URN;
  marketCardURN: URN;
};

export type ShellCardProps = {
  isShell: true;
  title: string;
};

export type CardProps = HydratedCardProps | ShellCardProps;
export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getHydratedExpandableMarketCardByURN = createGetHydratedExpandableMarketCardByURNSelector();
  const getPartialExpandableMarketCard = createPartialExpandableMarketCardByURNSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const expandableMarketCard = getHydratedExpandableMarketCardByURN(state.layouts.cards.expandablemarkets, urn);
    const partialExpandableMarketCard = getPartialExpandableMarketCard(state.layouts.cards.expandablemarkets, urn);

    if (!expandableMarketCard && !partialExpandableMarketCard) {
      return {};
    }

    if (!expandableMarketCard && partialExpandableMarketCard) {
      const { title } = partialExpandableMarketCard;

      if (!title) return {};

      return {
        isShell: true,
        title,
      };
    }

    if (!expandableMarketCard) return {};

    const { title, marketCardURN } = expandableMarketCard;

    return {
      isShell: false,
      title,
      urn,
      marketCardURN,
    };
  };
};

const dispatchFetchFullCardAction = (urn: string): FetchCardsAction => ({
  type: FETCH_CARDS,
  payload: {
    urns: [urn],
  },
});

export type DispatchProps = {
  dispatchFetchFullCardAction: typeof dispatchFetchFullCardAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchFullCardAction,
};
