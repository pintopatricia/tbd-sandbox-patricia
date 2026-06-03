import useStatsContentCardGroupVM from "./StatsContentCardGroup.viewmodel";
import { useStatsContentCardGroupQuery } from "../model/StatsContentCardGroup.graphql";

jest.mock("../model/StatsContentCardGroup.graphql");

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: () => ({
    getState: () => ({
      entities: {
        throttles: [],
      },
    }),
  }),
}));

jest.mock("@ppb/the-wall-icons", () => ({
  SupportingContentIconName: {
    MATCH_STATS: "match_stats_icon",
    PITCH: "pitch_viz_icon",
    LIVE_VIDEO: "live_video_icon",
    TEAM_LINEUP: "team_lineup_icon",
    USERS: "users_icon",
    LEAGUE_TABLE: "league_table_icon",
  },
  NavigationIconName: {
    ACCOUNT: "account_icon",
  },
}));

const requestCallMockFn = jest.fn();
const requestMock = {
  call: requestCallMockFn,
  called: true,
  loading: false,
};

describe("useStatsContentCardGroupVM", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStatsContentCardGroupQuery.mockReturnValue({
      request: requestMock,
      data: {
        card: undefined,
      },
    });
  });

  describe("when 'card' is undefined", () => {
    it("should resolve the VM as null", () => {
      const result = useStatsContentCardGroupVM("urn");

      expect(result.vm.data).toBeNull();
      expect(result.vm.events).toEqual({
        onTabPress: expect.any(Function),
      });
    });
  });

  describe("when 'card' is defined", () => {
    describe("when 'partials' returns an empty array", () => {
      it("should handle an empty array of edges", () => {
        const cardURN = "test-card-urn";
        const mockData = {
          partials: {
            edges: [],
          },
        };

        useStatsContentCardGroupQuery.mockReturnValue({
          request: requestMock,
          data: {
            card: mockData,
          },
        });

        const result = useStatsContentCardGroupVM(cardURN);

        expect(result.vm.data).toEqual({
          items: [],
          local: {
            selectedTab: null,
          },
        });
      });
    });

    describe("when 'node' is not in the array", () => {
      it("should handle an empty array of edges", () => {
        const cardURN = "test-card-urn";
        const mockData = {
          partials: {
            edges: [{ urn: "urn1" }],
          },
        };

        useStatsContentCardGroupQuery.mockReturnValue({
          request: requestMock,
          data: {
            card: mockData,
          },
        });

        const result = useStatsContentCardGroupVM(cardURN);

        expect(result.vm.data).toEqual({
          items: [],
          local: {
            selectedTab: null,
          },
        });
      });
    });

    describe("when 'node' doesn't have an urn", () => {
      it("should handle an empty array of edges", () => {
        const cardURN = "test-card-urn";
        const mockData = {
          partials: {
            edges: [{ node: { displayName: "test" } }],
          },
        };

        useStatsContentCardGroupQuery.mockReturnValue({
          request: requestMock,
          data: {
            card: mockData,
          },
        });

        const result = useStatsContentCardGroupVM(cardURN);

        expect(result.vm.data).toEqual({
          items: [],
          local: {
            selectedTab: null,
          },
        });
      });
    });

    it("should resolve vm properly", () => {
      const cardURN = "test-card-urn";
      const mockRequest = {};
      const mockData = {
        card: {
          selectedTab: {
            urn: "urn:1",
            typename: "StatsPebbleCardGroup",
          },
          partials: {
            edges: [
              {
                node: {
                  urn: "urn:1",
                  __typename: "StatsPebbleCardGroup",
                },
                type: "FORM",
                displayName: {
                  translationKey: "Form",
                },
              },
              {
                node: {
                  urn: "urn:2",
                  __typename: "StatsFormCard",
                },
                type: "FORM",
                displayName: {
                  translationKey: "Form button",
                },
              },
              {
                node: {
                  urn: "urn:3",
                  __typename: "StatsBroadcastsCard",
                },
                type: "PITCH",
                displayName: {
                  translationKey: "Pitch",
                },
              },
              {
                node: {
                  urn: "urn:4",
                  __typename: "StatsBroadcastsCard",
                },
                type: "LIVE_VIDEO",
                displayName: {
                  translationKey: "Live Video",
                },
              },
              {
                node: {
                  urn: "urn:5",
                  __typename: "StatsPlayersInPlayCard",
                },
                type: "INPLAY_PLAYER",
                displayName: {
                  translationKey: "Player",
                },
              },
              {
                node: {
                  urn: "urn:6",
                  __typename: "StatsPlayersCard",
                },
                type: "PLAYER",
                displayName: {
                  translationKey: "Player",
                },
              },
              {
                node: {
                  urn: "urn:7",
                  __typename: "StatsLineupsCard",
                },
                type: "LINEUPS",
                displayName: {
                  translationKey: "Team Lineups",
                },
              },
              {
                node: {
                  urn: "urn:8",
                  __typename: "StatsTableCard",
                },
                type: "TABLE",
                displayName: {
                  translationKey: "League Table",
                },
              },
              {
                node: {
                  urn: "urn:9",
                  __typename: "StatsTeamCard",
                },
                type: "TEAM",
                displayName: {
                  translationKey: "Team Form",
                },
              },
              {
                node: {
                  urn: "urn:10",
                  __typename: "StatsFormCard",
                },
                type: "UNDEFINED",
                displayName: {
                  translationKey: "Form",
                },
              },
            ],
          },
        },
      };
      const expectedItems = [
        {
          icon: "match_stats_icon",
          urn: "urn:1",
          label: "Form",
          typename: "StatsPebbleCardGroup",
        },
        {
          icon: "match_stats_icon",
          urn: "urn:2",
          label: "Form button",
          typename: "StatsFormCard",
        },
        {
          icon: "pitch_viz_icon",
          urn: "urn:3",
          label: "Pitch",
          typename: "StatsBroadcastsCard",
        },
        {
          icon: "live_video_icon",
          urn: "urn:4",
          label: "Live Video",
          typename: "StatsBroadcastsCard",
        },
        {
          icon: "account_icon",
          urn: "urn:5",
          label: "Player",
          typename: "StatsPlayersInPlayCard",
        },
        {
          icon: "account_icon",
          urn: "urn:6",
          label: "Player",
          typename: "StatsPlayersCard",
        },
        {
          icon: "team_lineup_icon",
          urn: "urn:7",
          label: "Team Lineups",
          typename: "StatsLineupsCard",
        },
        {
          icon: "league_table_icon",
          urn: "urn:8",
          label: "League Table",
          typename: "StatsTableCard",
        },
        {
          icon: "users_icon",
          urn: "urn:9",
          label: "Team Form",
          typename: "StatsTeamCard",
        },
        {
          icon: "match_stats_icon",
          urn: "urn:10",
          label: "Form",
          typename: "StatsFormCard",
        },
      ];

      useStatsContentCardGroupQuery.mockReturnValue({
        request: mockRequest,
        data: mockData,
      });

      const result = useStatsContentCardGroupVM(cardURN);

      expect(result.vm.data).toEqual({
        items: expectedItems,
        local: {
          selectedTab: {
            urn: "urn:1",
            typename: "StatsPebbleCardGroup",
          },
        },
      });
      expect(result.vm.events).toEqual({
        onTabPress: expect.any(Function),
      });
    });
  });
});
