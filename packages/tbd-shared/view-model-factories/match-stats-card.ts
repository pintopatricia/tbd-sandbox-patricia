import { HydratedMatchStatsCard } from "@ppb/tbd-store/state/application-state-selectors";
import {
  FootballParticipantStats,
  TeamDetails,
} from "@ppb/tbd-store/state/entities/football-fixture/FootballFixture.types";
import { BarStatProps, CardStatIcon, CardStatProps, MatchStatsProps } from "@ppb/the-wall-common/types";
import { createSelector, OutputParametricSelector } from "reselect";
import { i18n } from "../helpers/i18n";

export const createGetMatchStatsVM = (): OutputParametricSelector<
  HydratedMatchStatsCard,
  string | undefined,
  {
    matchStats: MatchStatsProps;
  },
  (
    homeDetails: TeamDetails | undefined,
    homeStats: FootballParticipantStats | undefined,
    awayDetails: TeamDetails | undefined,
    awayStats: FootballParticipantStats | undefined,
    localeCode: string | undefined,
  ) => {
    matchStats: MatchStatsProps;
  }
> =>
  createSelector(
    [
      (card: HydratedMatchStatsCard) => card?.home.details,
      (card: HydratedMatchStatsCard) => card?.home.stats,
      (card: HydratedMatchStatsCard) => card?.away.details,
      (card: HydratedMatchStatsCard) => card?.away.stats,
      (_: HydratedMatchStatsCard, localeCode: string | undefined) => localeCode,
    ],
    (homeDetails, homeStats, awayDetails, awayStats): { matchStats: MatchStatsProps } => {
      const barStats: BarStatProps[] = [];
      const cardStats: CardStatProps[] = [];
      const homeColor = homeDetails?.color;
      const awayColor = awayDetails?.color;

      const addBarStats = (label: string, home?: number | null, away?: number | null): void => {
        if (home !== null && home !== undefined && away !== null && away !== undefined) {
          barStats.push({ home, away, label, homeColor, awayColor });
        }
      };

      const addCardStats = (label: string, icon: CardStatIcon, home?: number | null, away?: number | null): void => {
        if (home !== null && home !== undefined && away !== null && away !== undefined) {
          cardStats.push({ home, away, label, icon });
        }
      };

      addBarStats(i18n({ key: "I18N.MATCH_STATS.POSSESSION" }), homeStats?.possession, awayStats?.possession);
      addBarStats(
        i18n({ key: "I18N.MATCH_STATS.SHOTS_ON_TARGET" }),
        homeStats?.shotsOnTarget,
        awayStats?.shotsOnTarget,
      );
      addBarStats(
        i18n({ key: "I18N.MATCH_STATS.SHOTS_OFF_TARGET" }),
        homeStats?.shotsOffTarget,
        awayStats?.shotsOffTarget,
      );
      addBarStats(
        i18n({ key: "I18N.MATCH_STATS.DANGEROUS_ATTACKS" }),
        homeStats?.dangerousAttacks,
        awayStats?.dangerousAttacks,
      );

      addCardStats(i18n({ key: "I18N.MATCH_STATS.RED" }), CardStatIcon.RED, homeStats?.redCards, awayStats?.redCards);
      addCardStats(
        i18n({ key: "I18N.MATCH_STATS.YELLOW" }),
        CardStatIcon.YELLOW,
        homeStats?.yellowCards,
        awayStats?.yellowCards,
      );
      addCardStats(
        i18n({ key: "I18N.MATCH_STATS.CORNERS" }),
        CardStatIcon.CORNER,
        homeStats?.corners,
        awayStats?.corners,
      );

      addBarStats(i18n({ key: "I18N.MATCH_STATS.GOAL_KICKS" }), homeStats?.goalKicks, awayStats?.goalKicks);
      addBarStats(i18n({ key: "I18N.MATCH_STATS.OFFSIDES" }), homeStats?.offsides, awayStats?.offsides);
      addBarStats(i18n({ key: "I18N.MATCH_STATS.FREE_KICKS" }), homeStats?.freeKicks, awayStats?.freeKicks);
      addBarStats(i18n({ key: "I18N.MATCH_STATS.THROW_INS" }), homeStats?.throwIns, awayStats?.throwIns);
      addBarStats(i18n({ key: "I18N.MATCH_STATS.FOULS" }), homeStats?.fouls, awayStats?.fouls);
      addBarStats(i18n({ key: "I18N.MATCH_STATS.BLOCKED_SHOTS" }), homeStats?.blockedShots, awayStats?.blockedShots);

      return {
        matchStats: {
          barStats: barStats.slice(0, 4),
          cardStats,
          stats: barStats.slice(4),
        },
      };
    },
  );
