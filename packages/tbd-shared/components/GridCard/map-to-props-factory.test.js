import { UI__TOGGLE_SHOW_MORE_RUNNERS } from "@ppb/tbd-store/actions/interface";

import { MARKET_BLURB_SUPER_SUB } from "../../config/market-blurb";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getThrottle = jest.fn();

jest.mock("@ppb/tbd-store", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
  FixtureTeamSide: { HOME: "HOME", AWAY: "AWAY" },
}));

const getGridCardSportsbookMarkets = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cards/grid/grid-cards-selectors", () => ({
  createGetGridCardSportsbookMarketsSelector: jest.fn(() => getGridCardSportsbookMarkets),
}));

const getGridCardByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getGridCardByURN),
}));

const getFootballFixtureByURN = jest.fn();
const getFootballPlayerFixtureContextByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createFootballFixtureByURNSelector: jest.fn(() => getFootballFixtureByURN),
  createFootballPlayerFixtureContextByURNSelector: jest.fn(() => getFootballPlayerFixtureContextByURN),
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  parseURN: jest.fn(() => ({ referenceId: "fixture|12345|player1" })),
  playerCodec: {
    extract: jest.fn(() => ({ eventURN: { referenceId: "12345" } })),
  },
  fixtureCodec: {
    encode: jest.fn(() => ({ uid: "ppb:tbd:fixture:11111" })),
  },
}));

const URN_MOCK = "ppb:tbd:card:grid:11111";
const MARKET_URN = "ppb:tbd:sbkMarket:11111";
const MARKET_URN_2 = "ppb:tbd:sbkMarket:22222";
const MARKET_NAME = "Market 1";
const MARKET_NAME_2 = "Market 2";
const RUNNER_NAME = "Runner 1";
const RUNNER_NAME_2 = "Runner 2";
const SELECTION_ID = 12345;
const SELECTION_ID_2 = 67890;
const VERTICAL_MARKET_LAYOUT = "VERTICAL_MARKETS";
const HORIZONTAL_MARKET_LAYOUT = "HORIZONTAL_MARKETS";
const PLAYER_URN_1 = "ppb:tbd:player:fixture|12345|player1";
const PLAYER_URN_2 = "ppb:tbd:player:fixture|12345|player2";
const HOME_JERSEY_URL = "https://example.com/home-jersey.png";
const AWAY_JERSEY_URL = "https://example.com/away-jersey.png";

const STATE_MOCK = {
  layouts: {
    cards: {
      grids: {},
    },
  },
  entities: {
    sportsbookmarkets: {
      [MARKET_URN]: {},
    },
    footballfixtures: {},
    footballplayerfixturecontexts: {},
    throttles: {},
  },
};

describe("GridCard map-to-props-factory", () => {
  beforeEach(jest.clearAllMocks);

  describe("mapStateToProps", () => {
    const setup = ({ state = STATE_MOCK, containerProps = { urn: URN_MOCK } } = {}) =>
      makeMapStateToProps()(state, containerProps);

    describe("when card is not defined", () => {
      it("should return empty object", () => {
        getGridCardByURN.mockReturnValueOnce(undefined);

        const stateToProps = setup();

        expect(stateToProps).toEqual({});
      });
    });

    describe("when card doesn't have a market", () => {
      it("should return empty object", () => {
        getGridCardByURN.mockReturnValueOnce({
          layout: VERTICAL_MARKET_LAYOUT,
          runners: [
            {
              name: RUNNER_NAME,
              selectionId: SELECTION_ID,
              marketURN: MARKET_URN,
            },
          ],
          markets: [],
          numberOfItemsToDisplay: 5,
        });

        const stateToProps = setup();

        expect(stateToProps).toEqual({});
      });
    });

    describe("when card is defined", () => {
      it("should return a view model for vertical layout", () => {
        getGridCardByURN.mockReturnValueOnce({
          layout: VERTICAL_MARKET_LAYOUT,
          runners: [
            {
              name: RUNNER_NAME,
              selectionId: SELECTION_ID,
              marketURN: MARKET_URN,
            },
          ],
          markets: [
            {
              displayLabel: MARKET_NAME,
              urn: MARKET_URN,
            },
          ],
          numberOfItemsToDisplay: 5,
        });

        const stateToProps = setup();

        expect(stateToProps).toEqual({
          layout: VERTICAL_MARKET_LAYOUT,
          marketUrn: MARKET_URN,
          numberOfItemsToDisplay: 5,
          marketBlurb: undefined,
          lines: [
            {
              label: RUNNER_NAME,
              jersey: undefined,
              useFallbackJersey: false,
              items: [
                {
                  label: MARKET_NAME,
                  marketUrn: MARKET_URN,
                  selectionId: SELECTION_ID,
                },
              ],
            },
          ],
        });
      });

      it("should return a view model for horizontal layout", () => {
        getGridCardByURN.mockReturnValueOnce({
          layout: HORIZONTAL_MARKET_LAYOUT,
          runners: [
            {
              name: RUNNER_NAME,
              selectionId: SELECTION_ID,
              marketURN: MARKET_URN,
            },
          ],
          markets: [
            {
              displayLabel: MARKET_NAME,
              urn: MARKET_URN,
            },
          ],
          numberOfItemsToDisplay: 5,
        });

        const stateToProps = setup();

        expect(stateToProps).toEqual({
          numberOfItemsToDisplay: 5,
          lines: [
            {
              label: MARKET_NAME,
              items: [
                {
                  label: RUNNER_NAME,
                  marketUrn: MARKET_URN,
                  selectionId: SELECTION_ID,
                },
              ],
            },
          ],
          layout: HORIZONTAL_MARKET_LAYOUT,
          marketUrn: MARKET_URN,
        });
      });

      it("should default to show all lines when numberOfItemsToDisplay is not provided", () => {
        getGridCardByURN.mockReturnValueOnce({
          layout: VERTICAL_MARKET_LAYOUT,
          runners: [
            {
              name: RUNNER_NAME,
              selectionId: SELECTION_ID,
              marketURN: MARKET_URN,
            },
          ],
          markets: [
            {
              displayLabel: MARKET_NAME,
              urn: MARKET_URN,
            },
          ],
        });

        const stateToProps = setup();

        expect(stateToProps).toEqual({
          numberOfItemsToDisplay: 1,
          marketBlurb: undefined,
          lines: [
            {
              label: RUNNER_NAME,
              jersey: undefined,
              useFallbackJersey: false,
              items: [
                {
                  label: MARKET_NAME,
                  selectionId: SELECTION_ID,
                  marketUrn: MARKET_URN,
                },
              ],
            },
          ],
          layout: VERTICAL_MARKET_LAYOUT,
          marketUrn: MARKET_URN,
        });
      });

      it("should return an empty object when horizontal market displayLabel is not defined", () => {
        getGridCardByURN.mockReturnValueOnce({
          layout: HORIZONTAL_MARKET_LAYOUT,
          runners: [
            {
              name: RUNNER_NAME,
              selectionId: SELECTION_ID,
              marketURN: MARKET_URN,
            },
          ],
          markets: [
            {
              displayLabel: undefined,
              urn: MARKET_URN,
            },
          ],
          numberOfItemsToDisplay: 5,
        });

        const stateToProps = setup();

        expect(stateToProps).toEqual({});
      });

      it("should return a view model with marketBlurb when there's an eligible sportsbook market", () => {
        getThrottle.mockReturnValueOnce({ isActive: true });
        getGridCardByURN.mockReturnValueOnce({
          layout: VERTICAL_MARKET_LAYOUT,
          runners: [],
          markets: [{ urn: MARKET_URN }],
        });
        getGridCardSportsbookMarkets.mockReturnValueOnce([{ isSuperSub: false }, { isSuperSub: true }]);

        const { marketBlurb } = setup();

        expect(marketBlurb).toEqual(MARKET_BLURB_SUPER_SUB);
      });

      it("should not return marketBlurb when throttle is not active", () => {
        getThrottle.mockReturnValueOnce({ isActive: false });
        getGridCardByURN.mockReturnValueOnce({
          layout: VERTICAL_MARKET_LAYOUT,
          runners: [],
          markets: [{ urn: MARKET_URN }],
        });
        getGridCardSportsbookMarkets.mockReturnValueOnce([{ isSuperSub: true }]);

        const { marketBlurb } = setup();

        expect(marketBlurb).toBeUndefined();
      });

      it("should not return marketBlurb when no sportsbook market has isSuperSub", () => {
        getThrottle.mockReturnValueOnce({ isActive: true });
        getGridCardByURN.mockReturnValueOnce({
          layout: VERTICAL_MARKET_LAYOUT,
          runners: [],
          markets: [{ urn: MARKET_URN }],
        });
        getGridCardSportsbookMarkets.mockReturnValueOnce([{ isSuperSub: false }]);

        const { marketBlurb } = setup();

        expect(marketBlurb).toBeUndefined();
      });

      it("should return a view model with multiple runners for vertical layout", () => {
        getGridCardByURN.mockReturnValueOnce({
          layout: VERTICAL_MARKET_LAYOUT,
          runners: [
            {
              name: RUNNER_NAME,
              selectionId: SELECTION_ID,
              marketURN: MARKET_URN,
            },
            {
              name: RUNNER_NAME_2,
              selectionId: SELECTION_ID_2,
              marketURN: MARKET_URN,
            },
          ],
          markets: [
            {
              displayLabel: MARKET_NAME,
              urn: MARKET_URN,
            },
          ],
          numberOfItemsToDisplay: 2,
        });

        const stateToProps = setup();

        expect(stateToProps).toEqual({
          layout: VERTICAL_MARKET_LAYOUT,
          marketUrn: MARKET_URN,
          numberOfItemsToDisplay: 2,
          marketBlurb: undefined,
          lines: [
            {
              label: RUNNER_NAME,
              jersey: undefined,
              useFallbackJersey: false,
              items: [
                {
                  label: MARKET_NAME,
                  marketUrn: MARKET_URN,
                  selectionId: SELECTION_ID,
                },
              ],
            },
            {
              label: RUNNER_NAME_2,
              jersey: undefined,
              useFallbackJersey: false,
              items: [
                {
                  label: MARKET_NAME,
                  marketUrn: MARKET_URN,
                  selectionId: SELECTION_ID_2,
                },
              ],
            },
          ],
        });
      });

      it("should return a view model with multiple markets for horizontal layout", () => {
        getGridCardByURN.mockReturnValueOnce({
          layout: HORIZONTAL_MARKET_LAYOUT,
          runners: [
            {
              name: RUNNER_NAME,
              selectionId: SELECTION_ID,
              marketURN: MARKET_URN,
            },
            {
              name: RUNNER_NAME,
              selectionId: SELECTION_ID_2,
              marketURN: MARKET_URN_2,
            },
          ],
          markets: [
            {
              displayLabel: MARKET_NAME,
              urn: MARKET_URN,
            },
            {
              displayLabel: MARKET_NAME_2,
              urn: MARKET_URN_2,
            },
          ],
          numberOfItemsToDisplay: 2,
        });

        const stateToProps = setup();

        expect(stateToProps).toEqual({
          layout: HORIZONTAL_MARKET_LAYOUT,
          marketUrn: MARKET_URN,
          numberOfItemsToDisplay: 2,
          lines: [
            {
              label: MARKET_NAME,
              items: [
                {
                  label: RUNNER_NAME,
                  marketUrn: MARKET_URN,
                  selectionId: SELECTION_ID,
                },
              ],
            },
            {
              label: MARKET_NAME_2,
              items: [
                {
                  label: RUNNER_NAME,
                  marketUrn: MARKET_URN_2,
                  selectionId: SELECTION_ID_2,
                },
              ],
            },
          ],
        });
      });

      it("should return undefined selectionId for horizontal layout when runner does not match market", () => {
        getGridCardByURN.mockReturnValueOnce({
          layout: HORIZONTAL_MARKET_LAYOUT,
          runners: [
            {
              name: RUNNER_NAME,
              selectionId: SELECTION_ID,
              marketURN: MARKET_URN,
            },
          ],
          markets: [
            {
              displayLabel: MARKET_NAME_2,
              urn: MARKET_URN_2,
            },
          ],
          numberOfItemsToDisplay: 1,
        });

        const stateToProps = setup();

        expect(stateToProps).toEqual({
          layout: HORIZONTAL_MARKET_LAYOUT,
          marketUrn: MARKET_URN_2,
          numberOfItemsToDisplay: 1,
          lines: [
            {
              label: MARKET_NAME_2,
              items: [
                {
                  label: RUNNER_NAME,
                  marketUrn: MARKET_URN_2,
                  selectionId: undefined,
                },
              ],
            },
          ],
        });
      });

      it("should return marketUrn from the first market", () => {
        getGridCardByURN.mockReturnValueOnce({
          layout: VERTICAL_MARKET_LAYOUT,
          runners: [],
          markets: [
            { displayLabel: MARKET_NAME, urn: MARKET_URN },
            { displayLabel: MARKET_NAME_2, urn: MARKET_URN_2 },
          ],
          numberOfItemsToDisplay: 0,
        });

        const stateToProps = setup();

        expect(stateToProps.marketUrn).toEqual(MARKET_URN);
      });

      it("should not return marketBlurb when throttle returns undefined", () => {
        getThrottle.mockReturnValueOnce(undefined);
        getGridCardByURN.mockReturnValueOnce({
          layout: VERTICAL_MARKET_LAYOUT,
          runners: [],
          markets: [{ urn: MARKET_URN }],
        });
        getGridCardSportsbookMarkets.mockReturnValueOnce([{ isSuperSub: true }]);

        const { marketBlurb } = setup();

        expect(marketBlurb).toBeUndefined();
      });
    });

    describe("extractFootballPlayerRunnerContext", () => {
      beforeEach(() => {
        getThrottle.mockReturnValue({ isActive: true });
      });

      it("should return the HOME jersey URL for a player on the home team", () => {
        getFootballFixtureByURN.mockReturnValue({
          typename: "FootballFixture",
          home: {
            id: "100",
            jerseys: [{ type: "HOME", url: HOME_JERSEY_URL }],
          },
          away: {
            id: "200",
            jerseys: [{ type: "AWAY", url: AWAY_JERSEY_URL }],
          },
        });

        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: { urn: PLAYER_URN_1, id: "P1" },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: { urn: PLAYER_URN_1 },
          players: [{ urn: PLAYER_URN_1, typename: "Player" }],
          runners: [
            {
              name: "Player One",
              selectionId: 111,
              marketURN: MARKET_URN,
              participantId: "P1",
            },
          ],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 1,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toEqual(HOME_JERSEY_URL);
      });

      it("should return the AWAY jersey URL for a player on the away team", () => {
        getFootballFixtureByURN.mockReturnValue({
          typename: "FootballFixture",
          home: {
            id: "100",
            jerseys: [{ type: "HOME", url: HOME_JERSEY_URL }],
          },
          away: {
            id: "200",
            jerseys: [{ type: "AWAY", url: AWAY_JERSEY_URL }],
          },
        });

        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: { urn: PLAYER_URN_2, id: "P2" },
          team: { id: "200" },
        });

        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: { urn: PLAYER_URN_2 },
          players: [{ urn: PLAYER_URN_2, typename: "Player" }],
          runners: [
            {
              name: "Player Two",
              selectionId: 222,
              marketURN: MARKET_URN,
              participantId: "P2",
            },
          ],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 1,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toEqual(AWAY_JERSEY_URL);
      });

      it("should return correct home and away jerseys for multiple players", () => {
        getFootballFixtureByURN.mockReturnValue({
          typename: "FootballFixture",
          home: {
            id: "100",
            jerseys: [{ type: "HOME", url: HOME_JERSEY_URL }],
          },
          away: {
            id: "200",
            jerseys: [{ type: "AWAY", url: AWAY_JERSEY_URL }],
          },
        });

        getFootballPlayerFixtureContextByURN
          .mockReturnValueOnce({
            typename: "FootballPlayerFixtureContext",
            player: { urn: PLAYER_URN_1, id: "P1" },
            team: { id: "100" },
          })
          .mockReturnValueOnce({
            typename: "FootballPlayerFixtureContext",
            player: { urn: PLAYER_URN_2, id: "P2" },
            team: { id: "200" },
          });

        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: { urn: PLAYER_URN_1 },
          players: [
            { urn: PLAYER_URN_1, typename: "Player" },
            { urn: PLAYER_URN_2, typename: "Player" },
          ],
          runners: [
            {
              name: "Player One",
              selectionId: 111,
              marketURN: MARKET_URN,
              participantId: "P1",
            },
            {
              name: "Player Two",
              selectionId: 222,
              marketURN: MARKET_URN,
              participantId: "P2",
            },
          ],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 2,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toEqual(HOME_JERSEY_URL);
        expect(stateToProps.lines[1].jersey).toEqual(AWAY_JERSEY_URL);
      });

      it("should return undefined jersey when no football fixture is found and jerseys/playerHomeAwayMap are null", () => {
        getFootballFixtureByURN.mockReturnValue(undefined);

        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: { urn: PLAYER_URN_1 },
          players: [{ urn: PLAYER_URN_1, typename: "Player" }],
          runners: [
            {
              name: "Player One",
              selectionId: 111,
              marketURN: MARKET_URN,
              participantId: "P1",
            },
          ],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 1,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toBeUndefined();
      });

      it("should return undefined jersey when football fixture typename does not match", () => {
        getFootballFixtureByURN.mockReturnValue({
          typename: "SomeOtherType",
          home: { id: "100", jerseys: [{ type: "HOME", url: HOME_JERSEY_URL }] },
          away: { id: "200", jerseys: [{ type: "AWAY", url: AWAY_JERSEY_URL }] },
        });

        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: { urn: PLAYER_URN_1, id: "P1" },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: { urn: PLAYER_URN_1 },
          players: [{ urn: PLAYER_URN_1, typename: "Player" }],
          runners: [
            {
              name: "Player One",
              selectionId: 111,
              marketURN: MARKET_URN,
              participantId: "P1",
            },
          ],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 1,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toBeUndefined();
      });

      it("should set useFallbackJersey when player team does not match home or away team", () => {
        getFootballFixtureByURN.mockReturnValue({
          typename: "FootballFixture",
          home: {
            id: "100",
            jerseys: [{ type: "HOME", url: HOME_JERSEY_URL }],
          },
          away: {
            id: "200",
            jerseys: [{ type: "AWAY", url: AWAY_JERSEY_URL }],
          },
        });

        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: { urn: PLAYER_URN_1, id: "P1" },
          team: { id: "999" },
        });

        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: { urn: PLAYER_URN_1 },
          players: [{ urn: PLAYER_URN_1, typename: "Player" }],
          runners: [
            {
              name: "Player One",
              selectionId: 111,
              marketURN: MARKET_URN,
              participantId: "P1",
            },
          ],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 1,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toBeUndefined();
        expect(stateToProps.lines[0].useFallbackJersey).toEqual(true);
      });

      it("should set useFallbackJersey when player fixture context typename does not match", () => {
        getFootballFixtureByURN.mockReturnValue({
          typename: "FootballFixture",
          home: {
            id: "100",
            jerseys: [{ type: "HOME", url: HOME_JERSEY_URL }],
          },
          away: {
            id: "200",
            jerseys: [{ type: "AWAY", url: AWAY_JERSEY_URL }],
          },
        });

        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "SomeOtherContext",
          player: { urn: PLAYER_URN_1, id: "P1" },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: { urn: PLAYER_URN_1 },
          players: [{ urn: PLAYER_URN_1, typename: "Player" }],
          runners: [
            {
              name: "Player One",
              selectionId: 111,
              marketURN: MARKET_URN,
              participantId: "P1",
            },
          ],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 1,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toBeUndefined();
        expect(stateToProps.lines[0].useFallbackJersey).toEqual(true);
      });

      it("should return the fallback jersey URL when no matching jersey type is found", () => {
        getFootballFixtureByURN.mockReturnValue({
          typename: "FootballFixture",
          home: {
            id: "100",
            jerseys: [{ type: "GOALKEEPER", url: "https://example.com/gk.png" }],
          },
          away: {
            id: "200",
            jerseys: [{ type: "GOALKEEPER", url: "https://example.com/gk2.png" }],
          },
        });

        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: { urn: PLAYER_URN_1, id: "P1" },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: { urn: PLAYER_URN_1 },
          players: [{ urn: PLAYER_URN_1, typename: "Player" }],
          runners: [
            {
              name: "Player One",
              selectionId: 111,
              marketURN: MARKET_URN,
              participantId: "P1",
            },
          ],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 1,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toBeUndefined();
      });

      it("should return undefined jersey when card has no firstPlayer URN", () => {
        getFootballFixtureByURN.mockReturnValue(undefined);
        getFootballPlayerFixtureContextByURN.mockReturnValue(undefined);

        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: undefined,
          players: [],
          runners: [
            {
              name: "Player One",
              selectionId: 111,
              marketURN: MARKET_URN,
              participantId: "P1",
            },
          ],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 1,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toBeUndefined();
      });

      it("should return undefined jersey when runner has empty participantId", () => {
        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: undefined,
          players: [],
          runners: [
            {
              name: "Player One",
              selectionId: 111,
              marketURN: MARKET_URN,
              participantId: "",
            },
          ],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 1,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toBeUndefined();
      });

      it("should not show jerseys when both teams have the same jersey URL", () => {
        const FALLBACK_JERSEY_URL = "https://content-s3.betfair.com/jic/uki/bf/Fallback_Jersey.png";

        getFootballFixtureByURN.mockReturnValue({
          typename: "FootballFixture",
          home: {
            id: "100",
            jerseys: [{ type: "HOME", url: FALLBACK_JERSEY_URL }],
          },
          away: {
            id: "200",
            jerseys: [{ type: "AWAY", url: FALLBACK_JERSEY_URL }],
          },
        });

        getFootballPlayerFixtureContextByURN
          .mockReturnValueOnce({
            typename: "FootballPlayerFixtureContext",
            player: { urn: PLAYER_URN_1, id: "P1" },
            team: { id: "100" },
          })
          .mockReturnValueOnce({
            typename: "FootballPlayerFixtureContext",
            player: { urn: PLAYER_URN_2, id: "P2" },
            team: { id: "200" },
          });

        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: { urn: PLAYER_URN_1 },
          players: [
            { urn: PLAYER_URN_1, typename: "Player" },
            { urn: PLAYER_URN_2, typename: "Player" },
          ],
          runners: [
            { name: "Player One", selectionId: 111, marketURN: MARKET_URN, participantId: "P1" },
            { name: "Player Two", selectionId: 222, marketURN: MARKET_URN, participantId: "P2" },
          ],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 2,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toBeUndefined();
        expect(stateToProps.lines[0].useFallbackJersey).toEqual(false);
        expect(stateToProps.lines[1].jersey).toBeUndefined();
        expect(stateToProps.lines[1].useFallbackJersey).toEqual(false);
      });

      it("should not show jerseys when neither team has a matching jersey type", () => {
        getFootballFixtureByURN.mockReturnValue({
          typename: "FootballFixture",
          home: {
            id: "100",
            jerseys: [{ type: "GOALKEEPER", url: "https://example.com/gk-home.png" }],
          },
          away: {
            id: "200",
            jerseys: [{ type: "GOALKEEPER", url: "https://example.com/gk-away.png" }],
          },
        });

        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: { urn: PLAYER_URN_1, id: "P1" },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({
          layout: "VERTICAL_MARKETS",
          firstPlayer: { urn: PLAYER_URN_1 },
          players: [{ urn: PLAYER_URN_1, typename: "Player" }],
          runners: [{ name: "Player One", selectionId: 111, marketURN: MARKET_URN, participantId: "P1" }],
          markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
          numberOfItemsToDisplay: 1,
        });

        const stateToProps = setup();

        expect(stateToProps.lines[0].jersey).toBeUndefined();
        expect(stateToProps.lines[0].useFallbackJersey).toEqual(false);
      });
    });

    describe("player stats", () => {
      const FIXTURE_MOCK = {
        typename: "FootballFixture",
        home: {
          id: "100",
          jerseys: [{ type: "HOME", url: HOME_JERSEY_URL }],
          statsAllSeason: { matchesPlayed: 10 },
        },
        away: {
          id: "200",
          jerseys: [{ type: "AWAY", url: AWAY_JERSEY_URL }],
          statsAllSeason: { matchesPlayed: 10 },
        },
      };

      const CARD_MOCK = {
        layout: "VERTICAL_MARKETS",
        firstPlayer: { urn: PLAYER_URN_1 },
        players: [{ urn: PLAYER_URN_1, typename: "Player" }],
        runners: [{ name: "Player One", selectionId: 111, marketURN: MARKET_URN, participantId: "P1" }],
        markets: [{ displayLabel: MARKET_NAME, urn: MARKET_URN }],
        numberOfItemsToDisplay: 1,
      };

      beforeEach(() => {
        getThrottle.mockReturnValue({ isActive: true });
        getFootballFixtureByURN.mockReturnValue(FIXTURE_MOCK);
        getFootballPlayerFixtureContextByURN.mockReset();
      });

      it("should set statValue to i18n key and statValueInterpolation for TOTAL_YELLOW_RED_CARDS", () => {
        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: {
            urn: PLAYER_URN_1,
            id: "P1",
            seasonStats: { matchesPlayed: 20, totals: { yellowCards: 30, redCards: 4 } },
          },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({ ...CARD_MOCK, stat: "TOTAL_YELLOW_RED_CARDS" });

        const stateToProps = setup();

        expect(stateToProps.lines[0].statValue).toEqual("I18N.IN_LINE_STATS_X_CARDS_IN_Y_MATCHES");
        expect(stateToProps.lines[0].statValueInterpolation).toEqual({ cards: 34, matches: 20 });
      });

      it("should set statLabel to I18N.IN_LINE_STATS_TOTAL_CARDS for TOTAL_YELLOW_RED_CARDS", () => {
        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: {
            urn: PLAYER_URN_1,
            id: "P1",
            seasonStats: { matchesPlayed: 20, totals: { yellowCards: 30, redCards: 4 } },
          },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({ ...CARD_MOCK, stat: "TOTAL_YELLOW_RED_CARDS" });

        const stateToProps = setup();

        expect(stateToProps.lines[0].statLabel).toEqual("I18N.IN_LINE_STATS_TOTAL_CARDS");
      });

      it("should not set statValue when the stats throttle is off, regardless of statLabel", () => {
        getThrottle.mockReset();
        getThrottle.mockReturnValueOnce({ isActive: true }); // PLAYER_MARKETS_JERSEYS active
        getThrottle.mockReturnValueOnce({ isActive: false }); // PLAYER_MARKETS_JERSEYS_AND_STATS inactive

        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: {
            urn: PLAYER_URN_1,
            id: "P1",
            seasonStats: { matchesPlayed: 20, totals: { yellowCards: 30, redCards: 4 } },
          },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({ ...CARD_MOCK, stat: "TOTAL_YELLOW_RED_CARDS" });

        const stateToProps = setup();

        expect(stateToProps.lines[0].statValue).toBeUndefined();
        expect(stateToProps.lines[0].statLabel).toBeUndefined();
      });

      it("should not set statLabel for non TOTAL_YELLOW_RED_CARDS stats", () => {
        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: {
            urn: PLAYER_URN_1,
            id: "P1",
            seasonStats: { matchesPlayed: 20, averages: { goals: 0.5 } },
          },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({ ...CARD_MOCK, stat: "AVG_GOALS" });

        const stateToProps = setup();

        expect(stateToProps.lines[0].statLabel).toBeUndefined();
      });

      it("should return '-' as statValue with no interpolation for TOTAL_YELLOW_RED_CARDS when matchesPlayed is 0", () => {
        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: {
            urn: PLAYER_URN_1,
            id: "P1",
            seasonStats: { matchesPlayed: 0, totals: { yellowCards: 0, redCards: 0 } },
          },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({ ...CARD_MOCK, stat: "TOTAL_YELLOW_RED_CARDS" });

        const stateToProps = setup();

        expect(stateToProps.lines[0].statValue).toEqual("-");
        expect(stateToProps.lines[0].statValueInterpolation).toBeUndefined();
      });

      it("should return i18n key and interpolation for TOTAL_GOALS_ASSISTS", () => {
        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: {
            urn: PLAYER_URN_1,
            id: "P1",
            seasonStats: { matchesPlayed: 15, totals: { goals: 8, assists: 5 } },
          },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({ ...CARD_MOCK, stat: "TOTAL_GOALS_ASSISTS" });

        const stateToProps = setup();

        expect(stateToProps.lines[0].statValue).toEqual("I18N.IN_LINE_STATS_X_CARDS_IN_Y_MATCHES");
        expect(stateToProps.lines[0].statValueInterpolation).toEqual({ cards: 13, matches: 15 });
      });

      it("should format statValue as per-match avg for AVG_GOALS_ASSISTS", () => {
        getFootballPlayerFixtureContextByURN.mockReturnValue({
          typename: "FootballPlayerFixtureContext",
          player: {
            urn: PLAYER_URN_1,
            id: "P1",
            seasonStats: { matchesPlayed: 15, averages: { goals: 0.4, assists: 0.2 } },
          },
          team: { id: "100" },
        });

        getGridCardByURN.mockReturnValueOnce({ ...CARD_MOCK, stat: "AVG_GOALS_ASSISTS" });

        const stateToProps = setup();

        expect(stateToProps.lines[0].statValue).toEqual("0.6");
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchToggleShowMoreRunners", () => {
      it("should dispatch a UI__TOGGLE_SHOW_MORE_RUNNERS action with the correct payload", () => {
        const { dispatchToggleShowMoreRunners } = mapDispatchToProps;

        expect(dispatchToggleShowMoreRunners("cardURN", false)).toEqual({
          type: UI__TOGGLE_SHOW_MORE_RUNNERS,
          payload: { cardUrn: "cardURN", showMore: false },
        });
      });

      describe("when gaModuleSuffix is defined", () => {
        it("should dispatch a UI__TOGGLE_SHOW_MORE_RUNNERS action with the gaModuleSuffix in the payload", () => {
          const { dispatchToggleShowMoreRunners } = mapDispatchToProps;

          expect(dispatchToggleShowMoreRunners("cardURN", false, "MODULE SUFFIX")).toEqual({
            type: UI__TOGGLE_SHOW_MORE_RUNNERS,
            payload: { cardUrn: "cardURN", showMore: false, gaModuleSuffix: "MODULE SUFFIX" },
          });
        });
      });
    });

    describe("dispatchRefreshCard", () => {
      it("should return action creator to start refresh", () => {
        const { dispatchRefreshCard } = mapDispatchToProps;

        expect(dispatchRefreshCard("cardURN", true)).toEqual({
          payload: "cardURN",
          type: "START_REFRESH_CARD",
        });
      });

      it("should return action creator to stop refresh", () => {
        const { dispatchRefreshCard } = mapDispatchToProps;

        expect(dispatchRefreshCard("cardURN", false)).toEqual({
          payload: "cardURN",
          type: "STOP_REFRESH_CARD",
        });
      });
    });

    describe("dispatchAzSwitchClick", () => {
      it("should return action creator with the expected label and isToggleOn status at true", () => {
        const { dispatchAzSwitchClick } = mapDispatchToProps;

        expect(dispatchAzSwitchClick("some label", true)).toEqual({
          payload: { label: "some label", isToggleOn: true },
          type: "UI/AZ_SWITCH_CLICK",
        });
      });

      it("should return action creator with the expected label and isToggleOn status at false", () => {
        const { dispatchAzSwitchClick } = mapDispatchToProps;

        expect(dispatchAzSwitchClick("some label", false)).toEqual({
          payload: { label: "some label", isToggleOn: false },
          type: "UI/AZ_SWITCH_CLICK",
        });
      });
    });
  });
});
