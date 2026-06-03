import { formatTime } from "../../../helpers/dates";
import { getExternalLink } from "../../../helpers/external-links";
import { i18n } from "../../../helpers/i18n";
import {
  useStatsPlayersInPlayCardQuery,
  useStatsPlayersInPlayUserDetailsQuery,
} from "../model/StatsPlayersInPlayCard.graphql";

import useStatsPlayersInPlayCardVM from "./StatsPlayersInPlayCard.viewmodel";

jest.mock("../../../helpers/dates", () => ({
  formatTime: jest.fn(),
}));

const TERMS_AND_CONDITIONS_URL = "https://support.skybet.com/app/answers/detail/opta-football-statistics-definitions/";

jest.mock("../../../helpers/external-links", () => ({
  getExternalLink: jest.fn(() => TERMS_AND_CONDITIONS_URL),
}));

jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../model/StatsPlayersInPlayCard.graphql", () => ({
  useStatsPlayersInPlayCardQuery: jest.fn(() => ({ data: {} })),
  useStatsPlayersInPlayUserDetailsQuery: jest.fn(() => ({ data: {} })),
  getStatsPlayerInPlayThrottle: jest.fn(() => ({ data: {} })),
}));

const CARD_MOCK = {
  urn: "CARD:URN",
  fixture: {
    urn: "ppb:fixture:1",
    players: [
      {
        id: "1",
        name: "Goncalo Faria",
        stats: [
          {
            stats: {
              totalShots: 0,
              shotsOnTarget: 0,
              foulsWon: 0,
              assists: 0,
              fouls: 10,
              tacklesWon: 0,
              blockedShots: 0,
              offsides: 10,
              interceptions: 0,
              goalkeeperSaves: 0,
            },
          },
        ],
      },
      {
        id: "2",
        name: "Callum Smith",
        stats: [
          {
            stats: {
              totalShots: 100,
              shotsOnTarget: 0,
              foulsWon: 0,
              assists: 0,
              fouls: 100,
              tacklesWon: 0,
              blockedShots: 0,
              offsides: 100,
              interceptions: 0,
              goalkeeperSaves: 0,
            },
          },
        ],
      },
      {
        id: "3",
        name: "Igor Oliveira",
        stats: [
          {
            stats: {
              totalShots: 100,
              shotsOnTarget: 50,
              foulsWon: 50,
              assists: 0,
              fouls: 0,
              tacklesWon: 0,
              blockedShots: 0,
              offsides: 0,
              interceptions: 0,
              goalkeeperSaves: 0,
            },
          },
        ],
      },
      {
        id: "4",
        name: "Joao Monteiro",
        stats: [
          {
            stats: {
              totalShots: 100,
              shotsOnTarget: 50,
              foulsWon: 50,
              assists: 0,
              fouls: 0,
              tacklesWon: 0,
              blockedShots: 0,
              offsides: 0,
              interceptions: 0,
              goalkeeperSaves: 0,
            },
          },
        ],
      },
    ],
    home: {
      name: "Gerencia",
      squad: {
        players: [
          {
            id: "1",
          },
        ],
      },
    },
    away: {
      name: "Clientes",
      squad: {
        players: [
          {
            id: "3",
          },
          {
            id: "4",
          },
        ],
      },
    },
  },
};

const APP_CONTEXT_MOCK = {
  userdetails: {
    localeCodeBcp47: "LOCALE",
    jurisdiction: {
      jurisdiction: "JURISDICTION",
    },
    timezone: "TIMEZONE",
  },
};

const TRANSLATIONS = {
  emptyStateMessageGeneral: "I18N.STATS.NO_STATS_AVAILABLE",
  emptyStateMessageSingleStat: "I18N.STATS.IP_PLAYER_NO_PLAYER_WITH_STATS",
  emptyStateTitle: "I18N.STATS.STATS_UNAVAILABLE",
  player: "I18N.STATS.PLAYER",
  showLess: "I18N.SHOW_LESS",
  showMore: "I18N.SHOW_MORE",
  termsConditions: "I18N.STATS.IP_PLAYER_HELP_SUPPORT",
  total: "I18N.STATS.TOTAL",
};

describe("useStatsPlayersInPlayCardVM", () => {
  beforeEach(jest.clearAllMocks);

  describe("when `useStatsPlayersInPlayCardQuery` doesn't return a card", () => {
    beforeEach(() => {
      useStatsPlayersInPlayCardQuery.mockReturnValueOnce({
        data: {},
        loading: false,
      });
      useStatsPlayersInPlayUserDetailsQuery.mockReturnValueOnce({
        data: {},
        loading: false,
      });
    });

    it("should call `useStatsPlayersInPlayCardQuery` with the correct parameters", () => {
      useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true);

      expect(useStatsPlayersInPlayCardQuery).toHaveBeenCalledWith({ cardURN: CARD_MOCK.urn }, { visible: true });
    });

    it("should return the loading state from `useStatsPlayersInPlayCardQuery`", () => {
      expect(useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true).loading).toBe(false);
    });

    it("should return no swimlaneItems", () => {
      expect(useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true).vm.data.swimlaneItems).toBeNull();
    });

    it("should return base translations", () => {
      expect(useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true).vm.data.translations).toEqual(TRANSLATIONS);
    });

    it("should call i18n for each translation whenever VM is called", () => {
      useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true);
      expect(i18n).toHaveBeenCalledTimes(8);

      useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true);
      expect(i18n).toHaveBeenCalledTimes(16);
    });

    it("should not return termsAndConditionsUrl", () => {
      expect(useStatsPlayersInPlayCardVM(CARD_MOCK.urn).vm.data.termsAndConditionsURL).toBeUndefined();

      expect(getExternalLink).not.toHaveBeenCalled();
    });

    it("should not return timestamp", () => {
      expect(useStatsPlayersInPlayCardVM(CARD_MOCK.urn).vm.data.timestamp).toBeUndefined();
    });
  });

  describe("when `useStatsPlayersInPlayCardQuery` returns a card", () => {
    beforeEach(() => {
      useStatsPlayersInPlayCardQuery.mockReturnValueOnce({
        data: {
          card: CARD_MOCK,
        },
        loading: false,
      });

      useStatsPlayersInPlayUserDetailsQuery.mockReturnValueOnce({
        data: {
          appContext: APP_CONTEXT_MOCK,
        },
        loading: false,
      });

      formatTime.mockReturnValueOnce("TIME");
    });

    it("should call `useStatsPlayersInPlayCardQuery` with the correct parameters", () => {
      useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true);

      expect(useStatsPlayersInPlayCardQuery).toHaveBeenCalledWith({ cardURN: CARD_MOCK.urn }, { visible: true });
    });

    it("should return the request object from `useStatsPlayersInPlayCardQuery`", () => {
      expect(useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true).loading).toBe(false);
    });

    it("should return swimlaneItems", () => {
      expect(useStatsPlayersInPlayCardVM(CARD_MOCK.urn).vm.data.swimlaneItems).toEqual([
        {
          description: "I18N.STATS.IP_PLAYER_SHOTS_TARGET_DESC",
          hasTermsAndConditions: true,
          stat: "shotsOnTarget",
          tableEntries: [
            {
              id: "3",
              playerName: "Igor Oliveira",
              quantity: 50,
              teamName: "Clientes",
            },
            {
              id: "4",
              playerName: "Joao Monteiro",
              quantity: 50,
              teamName: "Clientes",
            },
          ],
          title: "I18N.STATS.IP_PLAYER_SHOTS_TARGET",
        },
        {
          description: "I18N.STATS.IP_PLAYER_FOULS_COMMITED_DESC",
          hasTermsAndConditions: true,
          stat: "fouls",
          tableEntries: [
            {
              id: "1",
              playerName: "Goncalo Faria",
              quantity: 10,
              teamName: "Gerencia",
            },
          ],
          title: "I18N.STATS.IP_PLAYER_FOULS_COMMITED",
        },
        {
          description: null,
          hasTermsAndConditions: false,
          stat: "foulsWon",
          tableEntries: [
            {
              id: "3",
              playerName: "Igor Oliveira",
              quantity: 50,
              teamName: "Clientes",
            },
            {
              id: "4",
              playerName: "Joao Monteiro",
              quantity: 50,
              teamName: "Clientes",
            },
          ],
          title: "I18N.STATS.IP_PLAYER_FOULS_WON",
        },
        {
          description: "I18N.STATS.IP_PLAYER_ASSISTS_DESC",
          hasTermsAndConditions: true,
          stat: "assists",
          tableEntries: [],
          title: "I18N.STATS.IP_PLAYER_ASSISTS",
        },
        {
          description: "I18N.STATS_SHOTS_CREATED_DESC",
          hasTermsAndConditions: true,
          stat: "shotsCreated",
          tableEntries: [],
          title: "I18N.STATS_SHOTS_CREATED",
        },
        {
          description: "I18N.STATS.IP_PLAYER_SAVES_DESC",
          hasTermsAndConditions: true,
          stat: "goalkeeperSaves",
          tableEntries: [],
          title: "I18N.STATS.IP_PLAYER_SAVES",
        },
        {
          description: null,
          hasTermsAndConditions: false,
          stat: "totalShots",
          tableEntries: [
            {
              id: "3",
              playerName: "Igor Oliveira",
              quantity: 100,
              teamName: "Clientes",
            },
            {
              id: "4",
              playerName: "Joao Monteiro",
              quantity: 100,
              teamName: "Clientes",
            },
          ],
          title: "I18N.STATS.IP_PLAYER_TOTAL_SHOTS",
        },
        {
          description: "I18N.STATS.IP_PLAYER_TACKLES_WON_DESC",
          hasTermsAndConditions: true,
          stat: "tacklesWon",
          tableEntries: [],
          title: "I18N.STATS.IP_PLAYER_TACKLES_WON",
        },
        {
          description: "I18N.STATS.IP_PLAYER_BLOCKED_SHOTS_DESC",
          hasTermsAndConditions: true,
          stat: "blockedShots",
          tableEntries: [],
          title: "I18N.STATS.IP_PLAYER_BLOCKED_SHOTS",
        },
        {
          description: null,
          hasTermsAndConditions: false,
          stat: "offsides",
          tableEntries: [
            {
              id: "1",
              playerName: "Goncalo Faria",
              quantity: 10,
              teamName: "Gerencia",
            },
          ],
          title: "I18N.STATS.IP_PLAYER_OFFSIDES",
        },
        {
          description: "I18N.STATS.IP_PLAYER_INTERCEPTIONS_DESC",
          hasTermsAndConditions: true,
          stat: "interceptions",
          tableEntries: [],
          title: "I18N.STATS.IP_PLAYER_INTERCEPTIONS",
        },
      ]);
    });

    it("should return termsAndConditionsUrl", () => {
      expect(useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true).vm.data.termsAndConditionsURL).toBe(
        TERMS_AND_CONDITIONS_URL,
      );

      expect(getExternalLink).toHaveBeenCalledTimes(1);
      expect(getExternalLink).toHaveBeenCalledWith(
        "OPTA_FOOTBALL_STATISTICS",
        APP_CONTEXT_MOCK.userdetails.jurisdiction.jurisdiction,
        APP_CONTEXT_MOCK.userdetails.localeCodeBcp47,
      );
    });

    it("should call formatTime with the correct parameters", () => {
      useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true);

      expect(formatTime).toHaveBeenCalledWith(
        expect.any(Date),
        APP_CONTEXT_MOCK.userdetails.localeCodeBcp47,
        APP_CONTEXT_MOCK.userdetails.timezone,
      );
    });

    it("should return timestamp", () => {
      expect(useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true).vm.data.timestamp).toBe(
        "I18N.STATS.IP_PLAYER_LABEL_UPDATED TIME",
      );
    });

    it("should set the events callbacks properly", () => {
      const result = useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true);

      expect(result.vm.events).toEqual({
        onTermsTap: expect.any(Function),
        onExpandableClickButton: expect.any(Function),
      });
    });
  });

  describe("when `useStatsPlayersInPlayUserDetailsQuery` does not return an appContext", () => {
    beforeEach(() => {
      useStatsPlayersInPlayUserDetailsQuery.mockReturnValueOnce({
        data: {},
        loading: false,
      });
    });

    it("should return view model without termsAndConditionsURL and timestamp", () => {
      const result = useStatsPlayersInPlayCardVM(CARD_MOCK.urn, true);

      expect(result.vm.data.termsAndConditionsURL).toBeUndefined();
      expect(result.vm.data.timestamp).toBeUndefined();
    });
  });
});
