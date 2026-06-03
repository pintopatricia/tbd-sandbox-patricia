import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory } from "react-redux";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { SportsbookBetLegCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { createSportsbookBetSelector } from "@ppb/tbd-store/state/betting/sportsbook-bets/sportsbook-bets-selectors";
import { codecs } from "@ppb/tbd-urn-codecs";
import {
  SubscribeBetResultAction,
  SUBSCRIBE_BET_RESULT,
  UnsubscribeBetResultAction,
  UNSUBSCRIBE_BET_RESULT,
  SUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  SubscribeBetMutationEligibilityAction,
  UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  UnsubscribeBetMutationEligibilityAction,
} from "@ppb/tbd-store/actions/my-bets";
import { PPB_SEPARATOR } from "@ppb/tbd-urn-codecs/src/constants";

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type CardProps = {
  cards: PartialItem[];
  betURN: URN | undefined;
  isSettled: boolean | undefined;
  isMutationEligible: boolean;
  statsSupportingContentButtonsUrn?: URN;
  marketName?: string;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookBetLegCardGroupByURN = createCardGroupByURNSelector<SportsbookBetLegCardGroups, URN>();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const legGroup = getSportsbookBetLegCardGroupByURN(state.layouts.cardgroups.sportsbookbetlegcardgroups, urn);

    const getSportsbookBetByURN = createSportsbookBetSelector();
    const betId = codecs.cardGroup.sportsbookBetLeg.decode(urn)?.split(PPB_SEPARATOR)[0];
    const betURN = betId ? codecs.sportsbookBet.encode(betId).uid : undefined;
    const bet = betURN ? getSportsbookBetByURN(state.betting.sportsbookbets, betURN) : undefined;
    const statsSupportingContentButtonsCard = legGroup?.items.find(
      (item) => item.typename === "StatsSupportingContentButtonsCardGroup",
    );

    return {
      cards: legGroup ? legGroup.items : [],
      betURN,
      isSettled: bet?.isSettled,
      isMutationEligible: !!bet?.mutations?.eligibility?.length,
      statsSupportingContentButtonsUrn: statsSupportingContentButtonsCard?.urn,
    };
  };
};

const dispatchSubscribeBlhResult = (urn: URN): SubscribeBetResultAction => ({
  type: SUBSCRIBE_BET_RESULT,
  payload: { urn },
});

const dispatchUnsubscribeBlhResult = (urn: URN): UnsubscribeBetResultAction => ({
  type: UNSUBSCRIBE_BET_RESULT,
  payload: { urn },
});

const dispatchSubscribeBmeResult = (urn: URN): SubscribeBetMutationEligibilityAction => ({
  type: SUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  payload: { urn },
});

const dispatchUnsubscribeBmeResult = (urn: URN): UnsubscribeBetMutationEligibilityAction => ({
  type: UNSUBSCRIBE_BET_MUTATION_ELIGIBILITY,
  payload: { urn },
});

export type DispatchProps = {
  dispatchSubscribeBlhResult: typeof dispatchSubscribeBlhResult;
  dispatchUnsubscribeBlhResult: typeof dispatchUnsubscribeBlhResult;
  dispatchSubscribeBmeResult: typeof dispatchSubscribeBmeResult;
  dispatchUnsubscribeBmeResult: typeof dispatchUnsubscribeBmeResult;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSubscribeBlhResult,
  dispatchUnsubscribeBlhResult,
  dispatchSubscribeBmeResult,
  dispatchUnsubscribeBmeResult,
};
