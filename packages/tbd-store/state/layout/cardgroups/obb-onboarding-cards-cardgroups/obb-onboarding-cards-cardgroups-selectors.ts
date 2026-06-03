import { createSelector, ParametricSelector } from "reselect";
import { fixtureCodec } from "@ppb/tbd-urn-codecs";
import { ApplicationState } from "../../../ApplicationState.types";
import { FootballFixture } from "../../../entities";
import URN from "../../URN";
import { createCardGroupByURNSelector } from "../cardgroups-selectors";
import { ObbOnboardingCardsCardGroup, ObbOnboardingCardsCardGroups } from "../CardGroup.types";

export type SelectorObbOnboardingCardsCardGroup = ObbOnboardingCardsCardGroup & {
  fixture: FootballFixture | undefined;
};

/**
 * For a given ObbOnboardingCardsCardGroup URN, returns the corresponding card group
 * augmented with the related football fixture entity (when available).
 */
export const createObbOnboardingCardsCardGroupByURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  SelectorObbOnboardingCardsCardGroup | undefined
> => {
  const getCardGroupByURN = createCardGroupByURNSelector<ObbOnboardingCardsCardGroups, URN>();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getCardGroupByURN(state.layouts.cardgroups.obbonboardingcardsgroups, urn),
      (state: ApplicationState) => state.entities.footballfixtures,
    ],
    (cardGroup, footballfixtures) => {
      if (!cardGroup) return undefined;

      const { eventId } = cardGroup.event;
      if (eventId == null) return { ...cardGroup, fixture: undefined };

      const fixtureUrn = fixtureCodec.encode(String(eventId)).uid;
      const fixture: FootballFixture | undefined = fixtureUrn ? footballfixtures[fixtureUrn] : undefined;

      return { ...cardGroup, fixture };
    },
  );
};
