import { createSelector, ParametricSelector } from "reselect";
import { RugbyLeagueFixture, RugbyLeagueFixtures } from "./RugbyLeagueFixture";
import { getOpponentsNames } from "../../../helpers/fixture";
import URN from "../../layout/URN";

export const createRugbyLeagueFixtureByURNSelector = (): ParametricSelector<
  RugbyLeagueFixtures,
  URN,
  RugbyLeagueFixture | undefined
> =>
  createSelector(
    [(fixtures: RugbyLeagueFixtures, urn: URN) => fixtures[urn]],
    (fixture): RugbyLeagueFixture | undefined => {
      if (!fixture) return undefined;

      const opponentsNames = getOpponentsNames(fixture);

      return {
        ...fixture,
        opponentsNames,
      };
    },
  );
