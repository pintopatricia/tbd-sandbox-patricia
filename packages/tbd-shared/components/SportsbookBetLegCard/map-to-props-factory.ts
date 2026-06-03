import { MapStateToPropsFactory } from "react-redux";

import { ApplicationState, BetLeg, PUSH, PushAction, RacingSport } from "@ppb/tbd-store";
import { LegType, Result } from "@ppb/tbd-store/state/constants";
import {
  SUBSCRIBE_FIXTURE_UPDATES,
  SubscribeFixtureUpdatesAction,
  UNSUBSCRIBE_FIXTURE_UPDATES,
  UnsubscribeFixtureUpdatesAction,
} from "@ppb/tbd-store/actions/fixture";
import {
  NavigateToViewLinkFromMyBets,
  UI__NAVIGATE_TO_UPPER_LEVEL_FROM_MY_BETS,
} from "@ppb/tbd-store/actions/navigation";
import { createSportsbookBetLegSelector } from "@ppb/tbd-store/state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors";
import { createSportsbookBetSelector } from "@ppb/tbd-store/state/betting/sportsbook-bets/sportsbook-bets-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { BetLegCards, SportsbookBetCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { codecs } from "@ppb/tbd-urn-codecs";
import { StatusLabelSizeType, StatusLabelType } from "@ppb/the-wall-common/types";
import { ValueIconName } from "@ppb/the-wall-icons";

import { ResultType } from "@ppb/tbd-store/clients/blh/bet-live-hypotheticals-response-types";
import { BetLegPart, createBuildBetLegPartsVM } from "../../view-model-factories/my-bets-sbk-leg";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

type Runner = {
  runnerURN: string;
  selectionId: number;
  name: string;
  resultType: string | null;
};

type LegPart = BetLegPart & {
  result: BetLeg["result"];
  showSilk: boolean;
  showSportsIcon: boolean;
  runners?: Runner[];
};

export type CardProps = {
  legParts: (LegPart & { betId: string })[];
  cardUrn: string;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookBetLegCardByURN = createCardByURNSelector<BetLegCards, URN>();
  const getSportsbookBetLegByURN = createSportsbookBetLegSelector();
  const getSportsbookBetByURN = createSportsbookBetSelector();
  const getSportsbookBetCardByURN = createCardByURNSelector<SportsbookBetCards, URN>();
  const getThrottle = createGetThrottleSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const isWinLoseVoidActive = getThrottle(state.entities.throttles, "MY_BETS_WIN_LOSE_VOID")?.isActive;

    const legCard = getSportsbookBetLegCardByURN(state.layouts.cards.betlegs, urn);

    if (!legCard) {
      return {};
    }

    const leg = getSportsbookBetLegByURN(state.entities.sportsbookbetlegs, legCard.legURN);

    if (!leg) {
      return {};
    }

    const bet = getSportsbookBetByURN(state.betting.sportsbookbets, legCard.betURN);

    if (!bet) {
      return {};
    }

    // TODO: This will be later deleted, the viewLink will come directly from the leg on next refactor
    const sbkBetCard = getSportsbookBetCardByURN(
      state.layouts.cards.sportsbookbets,
      codecs.card.sportsbookBet.encode(bet.betId).uid,
    );
    const navigationLinks = sbkBetCard?.navigationLinks || {};
    const buildBetLegPartsByBetLegs = createBuildBetLegPartsVM(
      navigationLinks,
      bet.isSGM,
      bet.isSGMMulti,
      bet.isOddsBoosted,
      bet.isLotteries,
      bet.result,
    );

    const betLegParts = buildBetLegPartsByBetLegs(state, [leg]);

    if (!betLegParts || betLegParts.length === 0) {
      return {};
    }

    const legParts = betLegParts
      .filter((betLegPart) => !betLegPart.isLotteries)
      .map((betLegPart) => {
        let { statusLabel } = betLegPart;

        const accaFreezeMutationDetails = leg.mutations?.details?.find((gameDetails) => gameDetails?.freezeDetails);

        const freezePillDetails = accaFreezeMutationDetails?.freezeDetails
          ? `${accaFreezeMutationDetails.freezeDetails.homeTeamScore}-${accaFreezeMutationDetails.freezeDetails.awayTeamScore}`
          : "";
        const freezePillAdditionalDetails = accaFreezeMutationDetails?.freezeDetails
          ? `(${accaFreezeMutationDetails.freezeDetails.minute}')`
          : "";

        let { result } = betLegPart;
        if (accaFreezeMutationDetails) {
          statusLabel = {
            iconName: ValueIconName.ACCA_FREEZE,
            statusLabelSize: StatusLabelSizeType.SMALL,
            statusLabelType: StatusLabelType.BRANDED,
            text: `${i18n({ key: "I18N.MY_BETS.BET_LEG.FROZEN_LABEL" })} ${freezePillDetails}`,
            additionalText: freezePillAdditionalDetails,
          };

          if (result === Result.LOSING || result === Result.LOST || result === Result.VOID) result = Result.WON;
        }

        const shouldDisplayPreviousOdd = !bet.isPBM ? betLegPart.previousOdd : undefined;
        const odd = !bet.isPBM ? betLegPart.odd : undefined;

        return {
          ...betLegPart,
          betId: bet.betId,
          statusLabel,
          odd,
          previousOdd: shouldDisplayPreviousOdd,
          result,
          showSilk:
            leg.resultType !== ResultType.CONFIRMED &&
            !bet.isSettled &&
            leg.parts.length === 1 &&
            leg.type === LegType.SS &&
            [RacingSport.HORSE_RACING, RacingSport.GREYHOUND_RACING].includes(Number(betLegPart?.sportId)),
          showSportsIcon: !!isWinLoseVoidActive,
        };
      });

    return {
      legParts,
      cardUrn: urn,
    };
  };
};

const dispatchNavigateToViewLinkAction = (url: string, text: string): NavigateToViewLinkFromMyBets => ({
  type: UI__NAVIGATE_TO_UPPER_LEVEL_FROM_MY_BETS,
  payload: {
    url,
    text,
  },
});

const dispatchPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

const dispatchSubscribeFixtureUpdates = (
  urn: URN,
  typename: string,
  participantId: string,
  includeSubstitutions: boolean,
): SubscribeFixtureUpdatesAction => {
  const footballPlayerIds = [participantId];

  return {
    type: SUBSCRIBE_FIXTURE_UPDATES,
    payload: {
      urn,
      typename,
      isLite: true,
      includePlayers: footballPlayerIds.length > 0,
      footballPlayerIds,
      includeSubstitutions,
    },
  };
};

const dispatchUnsubscribeFixtureUpdates = (urn: URN, typename: string): UnsubscribeFixtureUpdatesAction => ({
  type: UNSUBSCRIBE_FIXTURE_UPDATES,
  payload: {
    urn,
    typename,
  },
});

export type DispatchProps = {
  dispatchNavigateToViewLinkAction: typeof dispatchNavigateToViewLinkAction;
  dispatchPushAction: typeof dispatchPushAction;
  dispatchSubscribeFixtureUpdates: typeof dispatchSubscribeFixtureUpdates;
  dispatchUnsubscribeFixtureUpdates: typeof dispatchUnsubscribeFixtureUpdates;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchNavigateToViewLinkAction,
  dispatchPushAction,
  dispatchSubscribeFixtureUpdates,
  dispatchUnsubscribeFixtureUpdates,
};
