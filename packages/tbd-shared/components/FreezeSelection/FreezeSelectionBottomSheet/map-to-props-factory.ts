import { createSelector, OutputParametricSelector } from "reselect";
import { ApplicationState, BetLeg, FootballFixtures, OddsDisplayPreference, SportsbookBet } from "@ppb/tbd-store";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createSportsbookBetSelector } from "@ppb/tbd-store/state/betting/sportsbook-bets/sportsbook-bets-selectors";
import { createSportsbookBetLegsSelector } from "@ppb/tbd-store/state/entities/sportsbook-bet-legs/sportsbook-bet-legs-selectors";
import { codecs } from "@ppb/tbd-urn-codecs";
import { MapStateToPropsFactory, MapDispatchToProps } from "react-redux";
import { createUserPreferencesWithProductSwitcherSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { BetLegMutationType } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import {
  FreezeLegAction,
  NETWORK__FREEZE_BET,
  UI__BET_MUTATION_ACCA_FREEZE_SELECTED,
  BetMutationAccaFreezeSelectedAction,
  UI__BET_MUTATION_ACCA_FREEZE_DESELECTED,
  BetMutationAccaFreezeDeselectedAction,
} from "@ppb/tbd-store/actions/bet-mutation";
import { FixtureStatus } from "@ppb/tbd-store/state/constants";
import { Dispatch } from "redux";
import { FreezeCardStates, FreezeCardStatuses } from "../../Card/snowflakes/FreezeCard/shared";
import { i18n } from "../../../helpers/i18n";

export type BetLegFreezeInfo = {
  betLeg: BetLeg;
  eventUrn: string;
  eventHeaderUrn: string;
  fixtureUrn: string;
  freezeEligibility: FreezeCardStates;
  formattedOdds: string;
  hasFixture: boolean;
  freezeStatus: FreezeCardStatuses;
  freezeCardText: string;
};

export type StateProps = {
  betId: string;
  betLegFreezeInfos: BetLegFreezeInfo[];
};

export type ContainerProps = {
  urn: string;
  // onDismiss will have behaviour in the future
  onDismiss: () => void;
};

function filterOutNulls<T extends NonNullable<unknown>>(ts: Array<T | null>): Array<T> {
  return ts.filter((t) => t !== null) as Array<T>;
}

const freezeStatusFromFixtureStatus: Record<FixtureStatus, FreezeCardStatuses> = {
  [FixtureStatus.IN_PLAY]: FreezeCardStatuses.INPLAY,
  [FixtureStatus.END]: FreezeCardStatuses.FINISHED,
  [FixtureStatus.PRE_MATCH]: FreezeCardStatuses.PREPLAY,
  [FixtureStatus.UNKNOWN]: FreezeCardStatuses.PREPLAY,
} as const;

const freezeCardStatesFromFixtureStates: Record<string, FreezeCardStates> = {
  Available: FreezeCardStates.ACTIVE,
  Unavailable: FreezeCardStates.INELIGIBLE,
  Suspended: FreezeCardStates.SUSPENDED,
};

export const createBetLegInfosSelector = (): OutputParametricSelector<
  ApplicationState,
  URN[],
  BetLegFreezeInfo[],
  (
    fixtures: FootballFixtures,
    oddsFormat: OddsDisplayPreference,
    betLegs: BetLeg[],
    bet: SportsbookBet,
  ) => BetLegFreezeInfo[]
> => {
  const getSportsbookBetLegsByURN = createSportsbookBetLegsSelector();
  const getUserPreferencesWithProductSwitcher = createUserPreferencesWithProductSwitcherSelector();

  return createSelector(
    [
      (state: ApplicationState) => state.entities.footballfixtures,
      (state: ApplicationState) =>
        getUserPreferencesWithProductSwitcher(state.entities.preferences).sportsbookOddsDisplay,
      (state: ApplicationState, betLegURNs: URN[]) =>
        getSportsbookBetLegsByURN(state.entities.sportsbookbetlegs, betLegURNs),
      (_: ApplicationState, __: URN[], bet: SportsbookBet) => bet,
    ],
    (fixtures, oddsFormat, betLegs, bet): BetLegFreezeInfo[] => {
      const infos = betLegs.map((leg) => {
        const { eventUrn } = leg.parts[0];
        if (!eventUrn) return null;
        const eventId = codecs.event.decode(eventUrn);
        if (!eventId) return null;
        const legIndex = codecs.cardGroup.sportsbookBetLeg.decode(leg.urn)?.split("/")[1];
        if (legIndex === undefined) {
          throw Error(`Missing index for urn: ${leg.urn}`);
        }
        const eventHeaderUrn = codecs.card.eventHeader.encode(bet.betId, Number.parseInt(legIndex, 10)).uid;

        const fixtureUrn = codecs.fixture.encode(eventId).uid;

        const fixture = fixtures[fixtureUrn];

        const status = fixture
          ? freezeStatusFromFixtureStatus[fixture.fixtureStatus ?? FixtureStatus.PRE_MATCH]
          : FreezeCardStatuses.PREPLAY;

        // price could be undefined for dividend bets but Acca Freeze should only be available on win markets
        const formattedOdds = leg.parts[0].price ? formatOdds(leg.parts[0].price, oddsFormat) : "TBC";

        const freezeMutation = leg.mutations?.eligibility?.find((e) => e?.mutation === BetLegMutationType.AccaFreeze);
        const freezeEligibilityStatus = freezeMutation?.mutationAvailability ?? "Unavailable";
        const freezeEligibility = freezeCardStatesFromFixtureStates[freezeEligibilityStatus];
        const freezeCardText =
          freezeEligibility === FreezeCardStates.ACTIVE
            ? i18n({
                key: "I18N.FREEZE_SELECTION.BOTTOM_SHEET.FREEZE_LABEL",
                interpolationValues: { selection: leg.parts[0].selectionName },
              })
            : leg.parts[0].selectionName;

        return {
          eventUrn,
          betLeg: leg,
          fixtureUrn,
          eventHeaderUrn,
          freezeEligibility,
          formattedOdds,
          hasFixture: fixture !== undefined,
          freezeStatus: status,
          freezeCardText,
        } satisfies BetLegFreezeInfo;
      });

      return filterOutNulls(infos);
    },
  );
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookBetByURN = createSportsbookBetSelector();
  const getBetLegInfo = createBetLegInfosSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const bet = getSportsbookBetByURN(state.betting.sportsbookbets, urn);

    if (!bet) {
      return {
        betId: "",
        betLegFreezeInfos: [],
      };
    }

    const betLegFreezeInfos = getBetLegInfo(state, bet.legs, bet);

    return {
      betLegFreezeInfos,
      betId: bet.betId,
    };
  };
};

export type DispatchProps = {
  dispatchOnFreezeLeg: (betId: string, betLeg: BetLeg) => void;
  dispatchOnSelectLeg: (eventUrn: URN) => void;
  dispatchOnDeselectLeg: () => void;
};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchOnFreezeLeg: (betId: string, betLeg: BetLeg) => {
    const part = betLeg.parts[0];
    const freezeMutationDetails = betLeg.mutations?.eligibility?.find(
      (e) => e?.mutation === BetLegMutationType.AccaFreeze,
    )?.details?.gameDetails;
    dispatch<FreezeLegAction>({
      type: NETWORK__FREEZE_BET,
      payload: {
        betId,
        legRef: betLeg.legNumber,
        eventName: part.eventDescription,
        matchScore: `${freezeMutationDetails?.homeTeamScore} - ${freezeMutationDetails?.awayTeamScore}`,
        timeFrozen: freezeMutationDetails?.minute.toString() ?? "",
      },
    });
  },

  dispatchOnSelectLeg: (eventUrn: URN) => {
    dispatch<BetMutationAccaFreezeSelectedAction>({
      type: UI__BET_MUTATION_ACCA_FREEZE_SELECTED,
      payload: {
        eventUrn,
      },
    });
  },

  dispatchOnDeselectLeg: () => {
    dispatch<BetMutationAccaFreezeDeselectedAction>({
      type: UI__BET_MUTATION_ACCA_FREEZE_DESELECTED,
    });
  },
});
