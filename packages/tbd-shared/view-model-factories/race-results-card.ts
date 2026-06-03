import { createSelector } from "reselect";
import { Isp, Race, RaceRunner, RaceRunners } from "@ppb/tbd-store/state/entities/races/Race.types";
import { RaceRunnerStatus } from "@ppb/tbd-store/state/constants";
import { OddsDisplayPreference } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { formatOdds, roundUp } from "@ppb/tbd-store/helpers/formatters";
import { i18n } from "../helpers/i18n";
import { TranslationKey } from "../translations/keys";
import { DnfCodes, ResultRunner } from "../components/RaceResultsCard/snowflakes/RacingResults/RacingResults.types";

export const formatStartingPrice = (
  isp: Isp | undefined,
  oddsDisplay: OddsDisplayPreference,
  runnerStatus?: RaceRunnerStatus,
): string | undefined => {
  if (runnerStatus === RaceRunnerStatus.NON_RUNNER) {
    return i18n({ key: "I18N.NON_RUNNER.TITLE" });
  }

  return typeof isp?.decimal === "number"
    ? formatOdds(
        {
          // show a maximum of 2 decimal places
          decimal: roundUp(isp.decimal),
          fractional: isp.fractional,
          american: isp.americanOdd,
        },
        oddsDisplay,
      )
    : undefined;
};

const formatWinningTime = (winningTime: number): string => {
  const minutes = Math.floor(winningTime / 60);
  const secondsAndMilliSeconds = winningTime - minutes * 60;

  return `${minutes}m ${secondsAndMilliSeconds.toFixed(2)}s`;
};

const formatBspAdvantage = (bspAdvantage: number): string => `${Math.round(bspAdvantage)}%`;

export function getFavouriteLabel(favourite?: boolean): string | undefined {
  return (favourite && i18n({ key: "I18N.LABELS.FAV" })) || undefined;
}

export const createRaceResultsViewModel = () =>
  createSelector(
    [
      ({ raceRunners }: { raceRunners: RaceRunners }) => raceRunners,
      ({ race }: { race: Race }) => race,
      ({ sportsbookOddsDisplay }: { sportsbookOddsDisplay: OddsDisplayPreference }) => sportsbookOddsDisplay,
    ],
    (raceRunners, race, sportsbookOddsDisplay) => {
      // create runner object with the required props
      const runners = Object.values(raceRunners).reduce<ResultRunner[]>((acc, raceRunner: RaceRunner) => {
        if (raceRunner.horse?.performance) {
          const {
            horse: {
              name,
              performance: { positionOfficial, distanceBeatenStatus, positionStatusCode, isp, bspAdvantage },
            },
            details: { saddleCloth, draw, silk, jockeyName, trainerName },
            status,
          } = raceRunner;
          acc.push({
            position: positionOfficial,
            positionStatusCode,
            distance: distanceBeatenStatus,
            saddleCloth,
            // This field is provided in Uppercase, we will treat the title case with css
            horseName: name.toLowerCase(),
            silk,
            draw,
            jockeyName,
            favouriteLabel: getFavouriteLabel(isp?.favourite),
            trainerName,
            bspAdvantage,
            startingPrice: formatStartingPrice(isp, sportsbookOddsDisplay, status) || "",
            hasPerformance: true,
            isNonRunner: status === RaceRunnerStatus.NON_RUNNER,
          });
        } else {
          const { details, status, horse } = raceRunner;
          acc.push({
            saddleCloth: details.saddleCloth,
            // This field is provided in Uppercase, we will treat the title case with css
            horseName: horse.name.toLowerCase(),
            silk: details.silk,
            draw: details.draw,
            jockeyName: details.jockeyName,
            trainerName: details.trainerName,
            startingPrice: formatStartingPrice(undefined, sportsbookOddsDisplay, status) || "",
            hasPerformance: false,
            isNonRunner: status === RaceRunnerStatus.NON_RUNNER,
          });
        }
        return acc;
      }, []);

      // isolate nonRunners
      const nonRunners = runners.filter((runner) => runner.isNonRunner);

      // isolate DNFs
      const dnfs = runners.filter((runner) => runner.positionStatusCode && !runner.position);

      const dnfCodes = runners.reduce((acc, runner) => {
        const dnfCode: DnfCodes | undefined = !runner.position
          ? DnfCodes[runner.positionStatusCode?.toUpperCase() as keyof typeof DnfCodes]
          : undefined;

        return {
          ...acc,
          ...(dnfCode && { [dnfCode]: i18n({ key: `I18N.HORSE_PERFORMANCE.POSITION_STATUS.${dnfCode}` }) }),
        };
      }, {});

      const runnerWinner = runners.find((runner) => runner.position === 1);

      return {
        title:
          race.details?.resultType && i18n({ key: `I18N.RACING.${race.details.resultType}` as keyof TranslationKey }),
        resultRunners: runners
          // remove non runners
          .filter((runner) => runner.position)
          // sort actual runners
          .sort((a, b): number => (a.position && b.position && a.position - b.position) as number)
          // re-add previously saved non runners at the end of the sorted array
          .concat(dnfs)
          .concat(nonRunners),
        ranNumber:
          race.details?.numberOfParticipants !== undefined
            ? race.details.numberOfParticipants - (race.details.numberOfNonRunners ?? 0)
            : undefined,
        ...(Object.keys(dnfCodes).length && { dnfCodes }),
        winningTime: race.winningTime ? formatWinningTime(race.winningTime) : undefined,
        bspAdvantage: runnerWinner?.bspAdvantage ? formatBspAdvantage(runnerWinner.bspAdvantage) : undefined,
      };
    },
  );
