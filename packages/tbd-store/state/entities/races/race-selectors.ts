import { createSelector, ParametricSelector } from "reselect";
import { Race, RaceDetails, Races } from "./Race.types";
import { createShallowEqualSelector } from "../../../helpers/selectors";
import URN from "../../layout/URN";

const createRaceWithoutDetailsByURNSelector = (): ParametricSelector<Races, URN, Omit<Race, "details">> =>
  createShallowEqualSelector(
    [
      (races: Races, urn: URN) => {
        // race details are being removed in order to avoid having a nested data structure that would keep invalidating reselect's cache on shallow equal compare.
        // Instead, this selector focus on properties other than details.

        // TODO: `|| {}` is related with createRaceByURNSelector TODO note
        // because Cannot destructure property from undefined.
        const { details, ...rest } = races[urn] || {};
        return rest;
      },
    ],
    (race: Omit<Race, "details">) => race,
  );

const createRaceDetailsByURNSelector = (): ParametricSelector<Races, URN, RaceDetails | undefined> =>
  createShallowEqualSelector(
    [
      (races: Races, urn: URN) =>
        // This selector focuses uniquely on the race details.
        races[urn]?.details,
    ],
    (raceDetails?: RaceDetails) => raceDetails,
  );

// TODO:
// this selector should have `Race | undefined` as return type
// but this selector was previously created as returning type Race, and it is used in many places in the source code,
// and most of them treat the return of this selector as being Race type.
// to change that, the required refactor is quite extensive and outside the scope of this US 921763 which is memoization fixing and not type correction.
// race.typename validation serves to avoid TS warnings without having to change the selector return type
export const createRaceByURNSelector = (): ParametricSelector<Races, URN, Race> => {
  const getRaceDetailsByURN = createRaceDetailsByURNSelector();
  const getRaceWithoutDetailsByURN = createRaceWithoutDetailsByURNSelector();

  return createSelector(
    [getRaceWithoutDetailsByURN, getRaceDetailsByURN],
    (race, details): Race => race.typename && { ...race, ...(details && { details }) },
  );
};
