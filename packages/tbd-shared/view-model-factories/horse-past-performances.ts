import { HorsePerformance } from "@ppb/tbd-store/state/entities/races/Race.types";
import { PastPerformance } from "@ppb/the-wall-common/types/RecentRaces.types";
import { createSelector, OutputParametricSelector } from "reselect";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { formatFullDateWithShortYear } from "../helpers/dates";
import { i18n } from "../helpers/i18n";
import { raceDistance } from "../formatters/distance-formatters";
import { TranslationKey } from "../translations/keys";

export enum i18nLabels {
  DATE = "I18N.RECENT_RACES.DATE",
  COURSE = "I18N.RECENT_RACES.COURSE",
  DISTANCE = "I18N.RECENT_RACES.DISTANCE",
  GOING = "I18N.RECENT_RACES.GOING",
  POS = "I18N.RECENT_RACES.POS",
  TYPE = "I18N.RECENT_RACES.TYPE",
  DEFAULT_VALUE = "I18N.RECENT_RACES.DEFAULT_VALUE",
  COMMENT_DEFAULT_VALUE = "I18N.RECENT_RACES.COMMENT_DEFAULT_VALUE",
}

function getHorsePastPerformances(pastPerformances: HorsePerformance[], userDetails: UserDetails): PastPerformance[] {
  const { localeCodeBcp47, timezone } = userDetails;
  const raceInfos = pastPerformances.reduce((acc: PastPerformance[], pastPerformance): PastPerformance[] => {
    const { details } = pastPerformance.race || {};
    const date = details?.scheduledTime
      ? formatFullDateWithShortYear(new Date(details?.scheduledTime), localeCodeBcp47, timezone)
      : i18n({ key: i18nLabels.DEFAULT_VALUE });
    const course = pastPerformance.race?.venue
      ? pastPerformance.race.venue.toLowerCase()
      : i18n({ key: i18nLabels.DEFAULT_VALUE });
    const distance = details?.distance ? raceDistance(details?.distance) : i18n({ key: i18nLabels.DEFAULT_VALUE });
    const going = details?.going
      ? i18n({ key: `I18N.RACE_GOING.${details.going}` as keyof TranslationKey })
      : i18n({ key: i18nLabels.DEFAULT_VALUE });
    const pos =
      details?.numberOfRunners && pastPerformance.positionOfficial
        ? `${pastPerformance.positionOfficial}/${details?.numberOfRunners}`
        : i18n({ key: i18nLabels.DEFAULT_VALUE });
    const type = details?.raceType
      ? i18n({ key: `I18N.RACE_TYPE.${details.raceType}` as keyof TranslationKey })
      : i18n({ key: i18nLabels.DEFAULT_VALUE });
    const runnerComment = pastPerformance.performanceComment
      ? pastPerformance.performanceComment
      : i18n({ key: i18nLabels.COMMENT_DEFAULT_VALUE });
    acc.push({
      date,
      course,
      distance,
      going,
      pos,
      type,
      runnerComment,
      raceReplayUrl: pastPerformance.race?.raceUrl,
    });

    return acc;
  }, []);

  return raceInfos;
}

export const createHorsePastPerformancesViewModel = (): OutputParametricSelector<
  HorsePerformance[] | undefined,
  UserDetails,
  PastPerformance[],
  (pastPerformances: HorsePerformance[] | undefined, userDetails: UserDetails) => PastPerformance[]
> =>
  createSelector(
    [
      (pastPerformances: HorsePerformance[] | undefined) => pastPerformances,
      (_: HorsePerformance[] | undefined, userDetails: UserDetails) => userDetails,
    ],
    (pastPerformances, userDetails) =>
      pastPerformances ? getHorsePastPerformances(pastPerformances, userDetails) : [],
  );
