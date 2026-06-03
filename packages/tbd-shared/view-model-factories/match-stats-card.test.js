import { CardStatIcon } from "@ppb/the-wall-common/types";
import { i18n } from "../helpers/i18n";
import { createGetMatchStatsVM } from "./match-stats-card";

const HOME_COLOR = "HOME_COLOR";
const AWAY_COLOR = "AWAY_COLOR";
const HOME_POSSESSION = "HOME_POSSESSION";
const AWAY_POSSESSION = "AWAY_POSSESSION";
const HOME_SHOTS_ON_TARGET = "HOME_SHOTS_ON_TARGET";
const AWAY_SHOTS_ON_TARGET = "AWAY_SHOTS_ON_TARGET";
const HOME_SHOTS_OFF_TARGET = "HOME_SHOTS_OFF_TARGET";
const AWAY_SHOTS_OFF_TARGET = "AWAY_SHOTS_OFF_TARGET";
const HOME_DANGEROUS_ATTACKS = "HOME_DANGEROUS_ATTACKS";
const AWAY_DANGEROUS_ATTACKS = "AWAY_DANGEROUS_ATTACKS";
const HOME_RED_CARDS = "HOME_RED_CARDS";
const AWAY_RED_CARDS = "AWAY_RED_CARDS";
const HOME_YELLOW_CARDS = "HOME_YELLOW_CARDS";
const AWAY_YELLOW_CARDS = "AWAY_YELLOW_CARDS";
const HOME_CORNERS = "HOME_CORNERS";
const AWAY_CORNERS = "AWAY_CORNERS";
const HOME_GOAL_KICKS = "HOME_GOAL_KICKS";
const AWAY_GOAL_KICKS = "AWAY_GOAL_KICKS";
const HOME_OFFSIDES = "HOME_OFFSIDES";
const AWAY_OFFSIDES = "AWAY_OFFSIDES";
const HOME_FREE_KICKS = "HOME_FREE_KICKS";
const AWAY_FREE_KICKS = "AWAY_FREE_KICKS";
const HOME_THROW_INS = "HOME_THROW_INS";
const AWAY_THROW_INS = "AWAY_THROW_INS";
const HOME_FOULS = "HOME_FOULS";
const AWAY_FOULS = "AWAY_FOULS";
const HOME_BLOCKED_SHOTS = "HOME_BLOCKED_SHOTS";
const AWAY_BLOCKED_SHOTS = "AWAY_BLOCKED_SHOTS";
const HOME_STATS = {
  possession: HOME_POSSESSION,
  shotsOnTarget: HOME_SHOTS_ON_TARGET,
  shotsOffTarget: HOME_SHOTS_OFF_TARGET,
  dangerousAttacks: HOME_DANGEROUS_ATTACKS,
  redCards: HOME_RED_CARDS,
  yellowCards: HOME_YELLOW_CARDS,
  corners: HOME_CORNERS,
  goalKicks: HOME_GOAL_KICKS,
  offsides: HOME_OFFSIDES,
  freeKicks: HOME_FREE_KICKS,
  throwIns: HOME_THROW_INS,
  fouls: HOME_FOULS,
  blockedShots: HOME_BLOCKED_SHOTS,
};
const AWAY_STATS = {
  possession: AWAY_POSSESSION,
  shotsOnTarget: AWAY_SHOTS_ON_TARGET,
  shotsOffTarget: AWAY_SHOTS_OFF_TARGET,
  dangerousAttacks: AWAY_DANGEROUS_ATTACKS,
  redCards: AWAY_RED_CARDS,
  yellowCards: AWAY_YELLOW_CARDS,
  corners: AWAY_CORNERS,
  goalKicks: AWAY_GOAL_KICKS,
  offsides: AWAY_OFFSIDES,
  freeKicks: AWAY_FREE_KICKS,
  throwIns: AWAY_THROW_INS,
  fouls: AWAY_FOULS,
  blockedShots: AWAY_BLOCKED_SHOTS,
};
const HYDRATED_CARD_URN = "HYDRATED_CARD_URN";
const HYDRATED_CARD_ALL_HOME_STATS = {
  urn: HYDRATED_CARD_URN,
  title: "Title",
  home: {
    details: {
      color: HOME_COLOR,
    },
    stats: HOME_STATS,
  },
  away: {
    details: {
      color: AWAY_COLOR,
    },
    stats: AWAY_STATS,
  },
};

jest.mock("../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("Match Stats Card View Model Selector", () => {
  describe("createGetMatchStatsVM", () => {
    let result;

    describe("when has data", () => {
      beforeEach(() => {
        const getMatchStatsVM = createGetMatchStatsVM();
        result = getMatchStatsVM(HYDRATED_CARD_ALL_HOME_STATS, "jp");
      });

      it("should return the correct matchStats.barStats", () => {
        expect(result.matchStats.barStats).toEqual([
          {
            away: AWAY_POSSESSION,
            awayColor: AWAY_COLOR,
            home: HOME_POSSESSION,
            homeColor: HOME_COLOR,
            label: "I18N.MATCH_STATS.POSSESSION",
          },
          {
            away: AWAY_SHOTS_ON_TARGET,
            awayColor: AWAY_COLOR,
            home: HOME_SHOTS_ON_TARGET,
            homeColor: HOME_COLOR,
            label: "I18N.MATCH_STATS.SHOTS_ON_TARGET",
          },
          {
            away: AWAY_SHOTS_OFF_TARGET,
            awayColor: AWAY_COLOR,
            home: HOME_SHOTS_OFF_TARGET,
            homeColor: HOME_COLOR,
            label: "I18N.MATCH_STATS.SHOTS_OFF_TARGET",
          },
          {
            away: AWAY_DANGEROUS_ATTACKS,
            awayColor: AWAY_COLOR,
            home: HOME_DANGEROUS_ATTACKS,
            homeColor: HOME_COLOR,
            label: "I18N.MATCH_STATS.DANGEROUS_ATTACKS",
          },
        ]);
      });

      it("should return the correct matchStats.cardStats", () => {
        expect(result.matchStats.cardStats).toEqual([
          {
            away: AWAY_RED_CARDS,
            home: HOME_RED_CARDS,
            label: "I18N.MATCH_STATS.RED",
            icon: CardStatIcon.RED,
          },
          {
            away: AWAY_YELLOW_CARDS,
            home: HOME_YELLOW_CARDS,
            label: "I18N.MATCH_STATS.YELLOW",
            icon: CardStatIcon.YELLOW,
          },
          {
            away: AWAY_CORNERS,
            home: HOME_CORNERS,
            label: "I18N.MATCH_STATS.CORNERS",
            icon: CardStatIcon.CORNER,
          },
        ]);
      });

      it("should return the correct matchStats.stats", () => {
        expect(result.matchStats.stats).toEqual([
          {
            away: AWAY_GOAL_KICKS,
            awayColor: AWAY_COLOR,
            home: HOME_GOAL_KICKS,
            homeColor: HOME_COLOR,
            label: "I18N.MATCH_STATS.GOAL_KICKS",
          },
          {
            away: AWAY_OFFSIDES,
            awayColor: AWAY_COLOR,
            home: HOME_OFFSIDES,
            homeColor: HOME_COLOR,
            label: "I18N.MATCH_STATS.OFFSIDES",
          },
          {
            away: AWAY_FREE_KICKS,
            awayColor: AWAY_COLOR,
            home: HOME_FREE_KICKS,
            homeColor: HOME_COLOR,
            label: "I18N.MATCH_STATS.FREE_KICKS",
          },
          {
            away: AWAY_THROW_INS,
            awayColor: AWAY_COLOR,
            home: HOME_THROW_INS,
            homeColor: HOME_COLOR,
            label: "I18N.MATCH_STATS.THROW_INS",
          },
          {
            away: AWAY_FOULS,
            awayColor: AWAY_COLOR,
            home: HOME_FOULS,
            homeColor: HOME_COLOR,
            label: "I18N.MATCH_STATS.FOULS",
          },
          {
            away: AWAY_BLOCKED_SHOTS,
            awayColor: AWAY_COLOR,
            home: HOME_BLOCKED_SHOTS,
            homeColor: HOME_COLOR,
            label: "I18N.MATCH_STATS.BLOCKED_SHOTS",
          },
        ]);
      });
    });

    describe("when get translations", () => {
      it("should call i18n for all required translations", () => {
        jest.clearAllMocks();

        const getMatchStatsVM = createGetMatchStatsVM();
        result = getMatchStatsVM(HYDRATED_CARD_ALL_HOME_STATS, "jp");

        expect(i18n.mock.calls).toEqual([
          [{ key: "I18N.MATCH_STATS.POSSESSION" }],
          [{ key: "I18N.MATCH_STATS.SHOTS_ON_TARGET" }],
          [{ key: "I18N.MATCH_STATS.SHOTS_OFF_TARGET" }],
          [{ key: "I18N.MATCH_STATS.DANGEROUS_ATTACKS" }],
          [{ key: "I18N.MATCH_STATS.RED" }],
          [{ key: "I18N.MATCH_STATS.YELLOW" }],
          [{ key: "I18N.MATCH_STATS.CORNERS" }],
          [{ key: "I18N.MATCH_STATS.GOAL_KICKS" }],
          [{ key: "I18N.MATCH_STATS.OFFSIDES" }],
          [{ key: "I18N.MATCH_STATS.FREE_KICKS" }],
          [{ key: "I18N.MATCH_STATS.THROW_INS" }],
          [{ key: "I18N.MATCH_STATS.FOULS" }],
          [{ key: "I18N.MATCH_STATS.BLOCKED_SHOTS" }],
        ]);
      });

      describe("when locale code is the same", () => {
        it("should call i18n only once for each key", () => {
          jest.clearAllMocks();
          const getMatchStatsVM = createGetMatchStatsVM();
          getMatchStatsVM(HYDRATED_CARD_ALL_HOME_STATS, "jp");
          getMatchStatsVM(HYDRATED_CARD_ALL_HOME_STATS, "jp");

          expect(i18n).toHaveBeenCalledTimes(13);
        });
      });

      describe("when locale code is not the same", () => {
        it("should call i18n twice for each key", () => {
          jest.clearAllMocks();
          const getMatchStatsVM = createGetMatchStatsVM();

          getMatchStatsVM(HYDRATED_CARD_ALL_HOME_STATS, "jp");
          getMatchStatsVM(HYDRATED_CARD_ALL_HOME_STATS, "de");

          expect(i18n).toHaveBeenCalledTimes(26);
        });
      });
    });
  });
});
