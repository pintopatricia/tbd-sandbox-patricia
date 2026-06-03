import { createSelector, createSelectorCreator, defaultMemoize } from "reselect";
import { Race, Races } from "../../../entities";
import { RaceViewLinkCards, RaceViewLinksCards } from "../Card.types";
import { ApplicationState } from "../../../ApplicationState.types";

import { createCardByURNSelector } from "../cards-selectors";
import { createRaceByURNSelector } from "../../../entities/races/race-selectors";
import { RaceViewLinkHydrated } from "../../../application-state-selectors";
import { createMeetingByURNSelector } from "../../../entities/meetings/meeting-selectors";
import { getSportByURN } from "../../../entities/sports/sport-selectors";
import URN from "../../URN";

function hasSameRaces(previous: Races, current: Races): boolean {
  const currentRaceKeys = Object.keys(current);
  return Object.keys(previous).every((raceKey) => currentRaceKeys.includes(raceKey));
}

const createAllRacesForRaceViewlinksSelector = createSelectorCreator(defaultMemoize, hasSameRaces);

const createAllRacesForRaceViewLinks = () =>
  createAllRacesForRaceViewlinksSelector([(races: Races) => races], (races): Races => races);

/**
 * createRaceViewLinksCardHydratedByURNSelector
 * For a given race viewLinks card URN, returns
 *  - undefined if no card is found
 *  - or the corresponding card hydrated with all the information it needs to present to the user:
 *    - the card itself
 *    - race viewlinks hydrated with the race information
 */
export const createRaceViewLinksCardHydratedByURNSelector = () => {
  const getRaceViewLinksCardByURN = createCardByURNSelector<RaceViewLinksCards, URN>();
  const getRaceByURN = createRaceByURNSelector();
  const getAllRaces = createAllRacesForRaceViewLinks();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getRaceViewLinksCardByURN(state.layouts.cards.raceviewlinks, urn),
      (state: ApplicationState) => getAllRaces(state.entities.races),
    ],
    (raceViewLinksCard, races: Races) => {
      if (!raceViewLinksCard) {
        return undefined;
      }

      const selectedRace: Race = getRaceByURN(races, raceViewLinksCard.race);
      const raceViewLinks: RaceViewLinkHydrated[] = raceViewLinksCard?.raceViewLinks?.map((raceViewLink) => {
        const race = getRaceByURN(races, raceViewLink.race);
        return {
          race,
          viewLink: raceViewLink.viewLink,
          marketPromo: raceViewLink.marketPromo,
        };
      });

      return {
        ...raceViewLinksCard,
        raceViewLinks,
        race: selectedRace,
      };
    },
  );
};

/**
 * createRaceViewLinkCardHydratedByURNSelector
 * For a given race viewLink card URN, returns
 *  - undefined if no card is found (or if the corresponding race, meeting or sport are not found)
 *  - or the corresponding card hydrated with all the information it needs to present to the user:
 *    - the card itself
 *    - the corresponding race, meeting and sport
 */
export const createRaceViewLinkCardHydratedByURNSelector = () => {
  const getRaceViewLinkCardbyURN = createCardByURNSelector<RaceViewLinkCards, URN>();
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getRaceViewLinkCardbyURN(state.layouts.cards.raceviewlink, urn),
      (state: ApplicationState) => state.entities.races,
      (state: ApplicationState) => state.entities.meetings,
      (state: ApplicationState) => state.entities.sports,
    ],
    (raceViewLinkCard, races, meetings, sports) => {
      if (!raceViewLinkCard) {
        return undefined;
      }

      const race = getRaceByURN(races, raceViewLinkCard.race);

      if (!race) return undefined;

      const meeting = getMeetingByURN(meetings, race.meeting);

      if (!meeting) return undefined;

      const sport = getSportByURN(sports, meeting.sportUrn ?? "");

      if (!sport) return undefined;

      return {
        race,
        meeting,
        sport,
        card: raceViewLinkCard,
      };
    },
  );
};
