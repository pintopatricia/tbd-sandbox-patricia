import URN from "../../../../../state/layout/URN";
import { Race } from "../../../../../state/entities";
import {
  RaceWithRaceRunnersFragment,
  RaceWithRaceDetailsFragment,
  RaceFragment,
  RaceRunnerFragment,
  RaceWithRaceRunnersPerformanceFragment,
  RaceRunnerHorsePerformanceFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { RaceStatus, Going, RaceType } from "../../../../../state/constants";

type RaceFragments =
  | RaceWithRaceRunnersFragment
  | RaceWithRaceDetailsFragment
  | RaceFragment
  | RaceWithRaceRunnersPerformanceFragment;
type FragmentWithDetails =
  | RaceWithRaceRunnersFragment
  | RaceWithRaceRunnersPerformanceFragment
  | RaceWithRaceDetailsFragment;

function isRaceWithDetails(race: RaceFragments): race is FragmentWithDetails {
  return !!(race as FragmentWithDetails).details;
}

const normalizeRaceFragmentIntoRace = (
  race: RaceFragment | RaceWithRaceRunnersFragment | RaceWithRaceRunnersPerformanceFragment,
): TransformedFragment<Race> => {
  const { urn, meeting, startTime, name, raceId, __typename } = race;
  const STATE: URN[] = [];

  const raceRunners: (RaceRunnerFragment | RaceRunnerHorsePerformanceFragment | null)[] = [
    ...("runners" in race && !!race.runners ? race.runners : []),
  ];

  const racingRunners = [...("raceKind" in race && !!race.raceKind ? race.raceKind.runners : [])];

  return {
    data: {
      urn,
      typename: __typename,
      name,
      raceId,
      meeting: meeting.urn,
      startTime,
      ...(isRaceWithDetails(race) &&
        race.details && {
          details: {
            distance: race.details.distance,
            going: race.details.going ? Going[race.details.going] : undefined,
            status: race.details.status ? RaceStatus[race.details.status] : undefined,
            raceType: race.details.type ? RaceType[race.details.type] : undefined,
            scheduledTime: race.details.scheduledTime,
            numberOfRunners: race.details.numberOfRunners ?? undefined,
            numberOfNonRunners: race.details.numberOfNonRunners ?? undefined,
            numberOfParticipants: race.details.numberOfParticipants ?? undefined,
            raceClass: race.details.raceClass ?? undefined,
            raceDetailsTitle: race.details.raceDetailsTitle ?? undefined,
            ...(race.details.resultType && { resultType: race.details.resultType }),
          },
          ...(race.verdict && { verdict: race.verdict }),
        }),
      ...(isRaceWithDetails(race) &&
        race.winningTime && {
          winningTime: race.winningTime,
        }),
      ...(raceRunners.length && {
        runners:
          raceRunners.reduce<URN[]>((acc, runner) => {
            if (runner) {
              return [...acc, runner.urn];
            }
            return acc;
          }, STATE) ?? undefined,
      }),
      ...(racingRunners.length && {
        racingRunners:
          racingRunners.reduce<URN[]>((acc, runner) => {
            if (runner) {
              return [...acc, runner.urn];
            }
            return acc;
          }, []) ?? undefined,
      }),
    },
  };
};

export default normalizeRaceFragmentIntoRace;
