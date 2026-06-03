import { StatsRaceResultsCardFragment } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { useStatsRaceResultsCardQuery } from "../model/StatsRaceResultsCard.graphql";
import { TranslationKey } from "../../../translations/keys";
import { i18n } from "../../../helpers/i18n";
import { StatusLabelType } from "@ppb/the-wall-common/types";

type RaceRunnerResultsWithLabel = StatsRaceResultsCardFragment["raceResultsRunners"][number] & {
  horse: {
    name: string;
    performance: {
      positionOfficial: number | null;
      positionStatusCode: string | null;
      positionOfficialLabel?: string;
      resultStatusLabel?: string;
      resultStatusLabelType?: StatusLabelType;
    } | null;
  };
};

const positionLabelMapper = {
  [1]: "I18N.MYBETS.PLACED_FIRST",
  [2]: "I18N.MYBETS.PLACED_SECOND",
  [3]: "I18N.MYBETS.PLACED_THIRD",
};

export default function useStatsRaceResultsCardVM(cardURN: string, visible: boolean) {
  const {
    loading,
    data: { card },
  } = useStatsRaceResultsCardQuery({ cardURN }, { visible });

  const { raceResultsRunners } = card || {};

  if (!raceResultsRunners?.length) {
    return {
      loading,
      vm: {
        data: null,
        events: null,
      },
    };
  }

  function capitalizeHorseName(name: string): string {
    return name
      .toLowerCase()
      .replace(/(^|\s)(\p{L})|(')(\p{L})(?=\p{L}{2,})/gu, (_, p1, c1, p2, c2) => (p1 ?? p2) + (c1 ?? c2).toUpperCase());
  }

  const raceResultsRunnersWithLabels: RaceRunnerResultsWithLabel[] = raceResultsRunners.map((runner) => {
    const horseName = capitalizeHorseName(runner.horse.name);
    const positionStatusCode = runner.horse.performance?.positionStatusCode?.toUpperCase() ?? null;

    if (!runner.horse.performance?.positionOfficial)
      return {
        ...runner,
        horse: {
          ...runner.horse,
          name: horseName,
          performance: {
            ...runner.horse.performance,
            positionOfficial: null,
            positionStatusCode,
          },
        },
      };

    return {
      ...runner,
      horse: {
        ...runner.horse,
        name: horseName,
        performance: {
          ...runner.horse.performance,
          positionStatusCode,
          positionOfficialLabel: `${runner.horse.performance.positionOfficial}${i18n({
            key: (positionLabelMapper[runner.horse.performance.positionOfficial as keyof typeof positionLabelMapper] ||
              "I18N.MYBETS.PLACED_OTHER") as keyof TranslationKey,
          })}`,
          resultStatusLabel: runner.isBetSelection
            ? runner.horse.performance.positionOfficial === 1
              ? i18n({ key: "I18N.MY_BETS.RESULT.WON" })
              : i18n({ key: "I18N.MY_BETS.RESULT.LOST" })
            : undefined,
          resultStatusLabelType: runner.isBetSelection
            ? runner.horse.performance.positionOfficial === 1
              ? StatusLabelType.WON
              : StatusLabelType.LOST
            : undefined,
        },
      },
    };
  });

  return {
    loading,
    vm: {
      data: {
        runners: raceResultsRunnersWithLabels,
      },
      events: null,
    },
  };
}
