import { HorsePerformance, RaceRunner } from "../../../../../state/entities";
import {
  RaceRunnerHorsePastPerformanceFragment,
  RaceRunnerFragment,
  RaceRunnerLiteFragment,
  RaceRunnerHorsePerformanceFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { RaceType, HorseColor, HorseSex, Going, RaceRunnerStatus } from "../../../../../state/constants";

// TODO: to add typename after engine is implemented
// type RaceRunnerWithTypename = RaceRunner & { typename: "RaceRunner" };

function isRaceRunnerHorsePastPerformance(
  raceRunner: RaceRunnerFragment | RaceRunnerLiteFragment | RaceRunnerHorsePastPerformanceFragment,
): raceRunner is RaceRunnerHorsePastPerformanceFragment {
  return (raceRunner as RaceRunnerHorsePastPerformanceFragment).horse.pastPerformances !== undefined;
}

function isRaceRunnerHorsePerformance(
  raceRunner: RaceRunnerFragment | RaceRunnerLiteFragment | RaceRunnerHorsePerformanceFragment,
): raceRunner is RaceRunnerHorsePerformanceFragment {
  return (raceRunner as RaceRunnerHorsePerformanceFragment).horse.performance !== undefined;
}

const normalizeRaceRunnerFragmentIntoRaceRunner = (
  raceRunner:
    | RaceRunnerFragment
    | RaceRunnerLiteFragment
    | RaceRunnerHorsePastPerformanceFragment
    | RaceRunnerHorsePerformanceFragment,
): TransformedFragment<RaceRunner> => {
  const {
    urn,
    selectionId,
    raceURN,
    form,
    apprenticeClaim,
    crsDisWinFavText,
    rating,
    rating123,
    ratingStars,
    comments,
    horse,
    details,
    __typename,
    status,
  } = raceRunner as RaceRunnerFragment;
  const HORSE_PERFORMANCES: HorsePerformance[] = [];

  return {
    data: {
      urn,
      typename: __typename,
      selectionId,
      raceURN,
      form: form || undefined,
      apprenticeClaim: apprenticeClaim || undefined,
      crsDisWinFavText: crsDisWinFavText || undefined,
      rating: rating ?? undefined,
      rating123: rating123 || undefined,
      ratingStars: ratingStars || undefined,
      comments: comments || undefined,
      status: status ? RaceRunnerStatus[status] : undefined,
      horse: {
        name: horse.name,
        sireName: horse.sireName || undefined,
        damName: horse.damName || undefined,
        damSireName: horse.damSireName || undefined,
        age: horse.age,
        bred: horse.bred || undefined,
        color: HorseColor[horse.color],
        sex: HorseSex[horse.sex],
        ...(isRaceRunnerHorsePerformance(raceRunner) &&
          raceRunner.horse.performance && {
            performance: {
              positionOfficial: raceRunner.horse.performance.positionOfficial ?? undefined,
              positionStatusCode: raceRunner.horse.performance.positionStatusCode ?? undefined,
              isp: raceRunner.horse.performance.isp
                ? {
                    decimal: raceRunner.horse.performance.isp.decimal ?? undefined,
                    fractional: raceRunner.horse.performance.isp.fractional
                      ? {
                          numerator: raceRunner.horse.performance.isp.fractional.numerator,
                          denominator: raceRunner.horse.performance.isp.fractional.denominator,
                        }
                      : undefined,
                    americanOdd: raceRunner.horse.performance.isp.americanOdd ?? undefined,
                    favourite: raceRunner.horse.performance.isp.favourite ?? undefined,
                  }
                : undefined,
              distanceBeatenStatus: raceRunner.horse.performance.distanceBeatenStatus ?? undefined,
              bspAdvantage: raceRunner.horse.performance.bspAdvantage ?? undefined,
            },
          }),
        ...(isRaceRunnerHorsePastPerformance(raceRunner) &&
          raceRunner.horse.pastPerformances && {
            pastPerformances: raceRunner.horse.pastPerformances.reduce<HorsePerformance[]>((acc, pastPerformance) => {
              if (pastPerformance?.race?.details) {
                acc.push({
                  positionOfficial: pastPerformance.positionOfficial ?? undefined,
                  performanceComment: pastPerformance.performanceComment ?? undefined,
                  race: {
                    raceUrl: pastPerformance.race.raceUrl ?? undefined,
                    details: {
                      scheduledTime: pastPerformance.race.details?.scheduledTime,
                      distance: pastPerformance.race.details?.distance,
                      numberOfRunners: pastPerformance.race.details?.numberOfRunners ?? undefined,
                      going: pastPerformance.race.details?.going
                        ? Going[pastPerformance.race.details?.going]
                        : undefined,
                      raceType: pastPerformance.race.details?.type
                        ? RaceType[pastPerformance.race.details.type]
                        : undefined,
                    },
                    venue: pastPerformance.race.venue || undefined,
                  },
                });
              }
              return acc;
            }, HORSE_PERFORMANCES),
          }),
      },
      details: {
        jockeyName: details.jockeyName || undefined,
        trainerName: details.trainerName || undefined,
        saddleCloth: details.saddleCloth,
        silk: details.silk || undefined,
        draw: details.draw ?? undefined,
        weight: details?.weight || undefined,
        equipmentDescription: details.equipmentDescription || undefined,
      },
    },
  };
};

export default normalizeRaceRunnerFragmentIntoRaceRunner;
