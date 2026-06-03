import {
  createObbCardByURNSelector,
  createObbCardPositionSelector,
} from "@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors";
import { createObbLegByIdSelector } from "@ppb/tbd-store/state/entities/obb-legs/obb-legs-selector";
import { createSportsbookDisplayOddsPreferencesSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { createGetExperimentSelector } from "@ppb/tbd-store/state/entities/experiments/experiments-selectors";
import {
  OBB_CARD__CLEAN_CARD_LEGS_STATE,
  OBB_CARD__UPDATE_SELECTED_LEGS_STATE,
  OBB_LEG_QUOTES_UPDATE_STATE,
  OBB_CARD__EVENT_SELECTION,
} from "@ppb/tbd-store/actions/obb";
import { SystemIconName } from "@ppb/the-wall-icons";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

import {
  buildOutcomeDescription,
  getStatsByIncidentType,
  formatQuote,
  isObbQuoteError,
  isCardDisabled,
  isToRemoveObbStatsLabel,
  getIncidentDataMapping,
} from "../../helpers/obb";

const getExperiment = jest.fn(() => ({ variant: "" }));

jest.mock("@ppb/tbd-store", () => ({
  OddsDisplayPreference: {
    Fractional: "FRACTIONAL",
    Decimal: "DECIMAL",
  },
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/entities/experiments/experiments-selectors", () => ({
  createGetExperimentSelector: jest.fn(() => getExperiment),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/obb-card/obb-card-selectors", () => ({
  createObbCardByURNSelector: jest.fn(),
  createObbCardPositionSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/obb-legs/obb-legs-selector", () => ({
  createObbLegByIdSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createSportsbookDisplayOddsPreferencesSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-shared/helpers/obb", () => ({
  buildOutcomeDescription: jest.fn(),
  buildSelectedParticipantStats: jest.fn(),
  getStatsByIncidentType: jest.fn(),
  formatQuote: jest.fn(),
  isObbQuoteError: jest.fn(),
  isCardDisabled: jest.fn(),
  isToRemoveObbStatsLabel: jest.fn(() => false),
  buildUnquotedLegsForParticipantsCombinedPlayers: jest.fn(() => []),
  getIncidentDataMapping: jest.fn(),

  incidentDataMapping: {
    SHOTS: { text: "Shots", icon: "shots-icon" },
    GOALS: { text: "Goals", icon: "goals-icon" },
    BOOKED: { text: "Booked", icon: "booked-icon" },
  },
}));

const OBB_LEG = {
  id: "legId1",
  templateId: "playerVsPlayer",
  event: {
    urn: "ppb:event:34122289",
    name: "Mansfield v Cambridge Utd",
    eventId: 34122289,
  },
  quote: {
    typename: "ObbQuoteSuccess",
    price: {
      decimal: 4,
    },
  },
  templateParams: {
    participantIdA: {
      urn: "ppb:obb:footballPlayer:152843/e/34122289",
      player: {
        __typename: "ObbFootballPlayer",
        id: "152843",
        name: "Player 152843",
        seasonStats: { matchesPlayed: 2 },
      },
      team: {
        name: "Manchester City",
      },
      stats: {
        stats: [],
        status: "loaded",
      },
    },
    participantIdB: {
      urn: "ppb:obb:footballPlayer:152844/e/34122289",
      player: {
        __typename: "ObbFootballPlayer",
        id: "152844",
        name: "Player 152844",
        seasonStats: { matchesPlayed: 0 },
      },
      team: {
        name: "Manchester City",
      },
      stats: {
        stats: [],
        status: "loaded",
      },
    },
    outcomeId: "SHOTS_TIME_ADJUSTED",
    timePeriodId: "MATCH",
  },
};

const OBB_LEG_2 = {
  id: "legId2",
  typename: "ObbPvpLeg",
  event: {
    urn: "ppb:event:34122289",
    name: "Mansfield v Cambridge Utd",
  },
  quote: {
    typename: "ObbQuoteSuccess",
    price: {
      decimal: 4,
    },
  },
  templateParams: {
    participantIdA: {
      urn: "ppb:obb:footballPlayer:152844/e/34122289",
      player: {
        __typename: "ObbFootballPlayer",
        id: "152844",
        name: "Player 152844",
        seasonStats: { matchesPlayed: 0 },
      },
      team: {
        name: "Manchester City",
      },
      stats: {
        stats: [],
        status: "loaded",
      },
    },
    participantIdB: {
      urn: "ppb:obb:footballPlayer:152843/e/34122289",
      player: {
        __typename: "ObbFootballPlayer",
        id: "152843",
        name: "Player 152843",
        seasonStats: { matchesPlayed: 2 },
      },
      team: {
        name: "Manchester City",
      },
      stats: {
        stats: [],
        status: "loaded",
      },
    },
    outcomeId: "SHOTS_TIME_ADJUSTED",
    timePeriodId: "MATCH",
  },
};

const OBB_LEG_3 = {
  id: "legId3",
  typename: "ObbPvpLeg",
  event: {
    urn: "ppb:event:34122289",
    name: "Mansfield v Cambridge Utd",
  },
  quote: {
    typename: "ObbQuoteSuccess",
    price: {
      decimal: 5,
    },
  },
  templateParams: {
    participantIdA: {
      urn: "ppb:obb:footballPlayer:54321/e/34122289",
      player: {
        __typename: "ObbFootballPlayer",
        id: "54321",
        name: "Player 54321",
      },
      team: {
        name: "Manchester City",
      },
      stats: {
        stats: [],
        status: "loaded",
      },
    },
    participantIdB: {
      urn: "ppb:obb:footballPlayer:152843/e/34122289",
      player: {
        __typename: "ObbFootballPlayer",
        id: "152843",
        name: "Player 152843",
      },
      team: {
        name: "Manchester City",
      },
      stats: {
        stats: [],
        status: "loaded",
      },
    },
    outcomeId: "SHOTS_TIME_ADJUSTED",
    timePeriodId: "MATCH",
  },
};

const DEFAULT_STATE = {
  layouts: {
    cards: {
      obbpvpcards: {},
    },
    cardgroups: {
      obbcardgroups: {
        "cardgroup-1": {},
      },
    },
  },
  entities: {
    obbLegs: {},
    preferences: {},
    brandSettings: { SPORTSBOOK_BET_BUTTON_ANIMATION: false },
    experiments: {},
  },
};

const getObbPvPCardByURN = jest.fn();
const getObbLegById = jest.fn();
const getSportsbookDisplayOddsPreferences = jest.fn();
const getObbCardPositionByLayout = jest.fn();

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when card is not defined", () => {
    it("should return an empty object if no card is found", () => {
      createObbCardByURNSelector.mockReturnValue(getObbPvPCardByURN);
      getObbPvPCardByURN.mockReturnValueOnce(undefined);

      createSportsbookDisplayOddsPreferencesSelector.mockReturnValue(getSportsbookDisplayOddsPreferences);
      getSportsbookDisplayOddsPreferences.mockReturnValue("decimal");

      const mapStateToProps = makeMapStateToProps();
      const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "urn", layoutUrn: "layoutUrn", itemIndex: 1 });
      expect(stateToProps).toEqual({});
    });
  });

  describe("when card is defined", () => {
    beforeEach(() => {
      createObbCardByURNSelector.mockReturnValue(getObbPvPCardByURN);
      getObbPvPCardByURN.mockReturnValue({
        urn: "urn",
        typename: "ObbPvpCard",
        sportevent: {
          name: "Mansfield v Cambridge Utd",
        },
        participants: [
          { player: { id: 1, name: "Participant 1" }, team: { id: "homeTeam", name: "Home Team" } },
          { player: { id: 2, name: "Participant 2" }, team: { id: "awayTeam", name: "Away Team" } },
        ],
        incidentType: "SHOTS",
        participantInfo: { name: "participantInfo" },
        teams: { home: { id: "homeTeam", name: "Home Team" }, away: { id: "awayTeam", name: "Away Team" } },
        selectedLegs: ["legId1", "legId2"],
        legs: ["legId1", "legId2", "legId3"],
      });

      createObbCardPositionSelector.mockReturnValue(getObbCardPositionByLayout);
      getObbCardPositionByLayout.mockReturnValueOnce(undefined);

      createObbLegByIdSelector.mockReturnValue(getObbLegById);
      getObbLegById.mockImplementation((state, id) => {
        if (id === "legId1") {
          return {
            ...OBB_LEG,
            id: "legId1",
          };
        }
        if (id === "legId2") {
          return {
            ...OBB_LEG_2,
            id: "legId2",
          };
        }
        if (id === "legId3") {
          return {
            ...OBB_LEG_3,
            id: "legId3",
          };
        }
        return OBB_LEG;
      });

      createSportsbookDisplayOddsPreferencesSelector.mockReturnValue(getSportsbookDisplayOddsPreferences);
      getSportsbookDisplayOddsPreferences.mockReturnValue("decimal");

      getIncidentDataMapping.mockReturnValue({ text: "Shots", icon: SystemIconName.ShotsIcon });
    });

    describe("when the entity is defined", () => {
      it("should return empty object if selected legs are missing participantIdA", () => {
        getObbPvPCardByURN.mockReturnValueOnce({
          urn: "urn",
          typename: "ObbPvpCard",
          sportevent: { name: "Mansfield v Cambridge Utd" },
          participants: [],
          incidentType: "SHOTS",
          teams: { home: {}, away: {} },
          selectedLegs: ["missing-leg", "second-leg"],
          legs: ["missing-leg", "second-leg"],
        });
        getObbLegById.mockImplementation((_, id) =>
          id === "missing-leg" ? { templateParams: {} } : { templateParams: { participantIdA: {} } },
        );

        const mapStateToProps = makeMapStateToProps();
        const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "urn" });

        expect(stateToProps).toEqual({});
      });

      it("should include position when provided by selector", () => {
        getObbCardPositionByLayout.mockReset();
        getObbCardPositionByLayout.mockReturnValue("left");

        formatQuote.mockReturnValue({ odds: "4.00" });
        getStatsByIncidentType.mockReturnValue([{ id: "1", label: "SHOTS", value: 1 }]);
        isObbQuoteError.mockReturnValue(false);
        isCardDisabled.mockReturnValue(false);

        const mapStateToProps = makeMapStateToProps();
        const newState = {
          ...DEFAULT_STATE,
          entities: {
            ...DEFAULT_STATE.entities,
            obbLegs: {
              [OBB_LEG.id]: OBB_LEG,
              [OBB_LEG_2.id]: OBB_LEG_2,
            },
          },
        };
        const stateToProps = mapStateToProps(newState, { urn: "urn", layoutUrn: "layout", itemIndex: 1 });

        expect(stateToProps.position).toBe("left");
      });

      it("should return the correct object", () => {
        formatQuote.mockReturnValue({ odds: "4.00" });
        getStatsByIncidentType.mockReturnValue([
          { id: "1", label: "SHOTS", value: 1 },
          { id: "2", label: "GOALS", value: 0 },
        ]);
        isObbQuoteError.mockReturnValue(false);
        isCardDisabled.mockReturnValue(false);

        const mapStateToProps = makeMapStateToProps();
        const newState = {
          ...DEFAULT_STATE,
          entities: {
            ...DEFAULT_STATE.entities,
            obbLegs: {
              [OBB_LEG.id]: OBB_LEG,
              [OBB_LEG_2.id]: OBB_LEG_2,
            },
          },
        };
        const stateToProps = mapStateToProps(newState, { urn: "urn", layoutUrn: "layoutUrn", itemIndex: 1 });

        expect(stateToProps).toEqual({
          urn: "urn",
          title: undefined,
          playerSelectionIconVariant: undefined,
          quoteError: undefined,
          firstLeg: {
            id: "legId1",
            templateId: "playerVsPlayer",
            event: {
              urn: "ppb:event:34122289",
              name: "Mansfield v Cambridge Utd",
              eventId: 34122289,
            },
            quote: {
              typename: "ObbQuoteSuccess",
              price: {
                decimal: 4,
              },
            },
            templateParams: {
              participantIdA: {
                urn: "ppb:obb:footballPlayer:152843/e/34122289",
                player: {
                  __typename: "ObbFootballPlayer",
                  id: "152843",
                  name: "Player 152843",
                  seasonStats: {
                    matchesPlayed: 2,
                  },
                },
                team: {
                  name: "Manchester City",
                },
                stats: {
                  stats: [],
                  status: "loaded",
                },
              },
              participantIdB: {
                urn: "ppb:obb:footballPlayer:152844/e/34122289",
                player: {
                  __typename: "ObbFootballPlayer",
                  id: "152844",
                  name: "Player 152844",
                  seasonStats: {
                    matchesPlayed: 0,
                  },
                },
                team: {
                  name: "Manchester City",
                },
                stats: {
                  stats: [],
                  status: "loaded",
                },
              },
              outcomeId: "SHOTS_TIME_ADJUSTED",
              timePeriodId: "MATCH",
            },
          },
          secondLeg: {
            id: "legId2",
            typename: "ObbPvpLeg",
            event: {
              urn: "ppb:event:34122289",
              name: "Mansfield v Cambridge Utd",
            },
            quote: {
              typename: "ObbQuoteSuccess",
              price: {
                decimal: 4,
              },
            },
            templateParams: {
              participantIdA: {
                urn: "ppb:obb:footballPlayer:152844/e/34122289",
                player: {
                  __typename: "ObbFootballPlayer",
                  id: "152844",
                  name: "Player 152844",
                  seasonStats: {
                    matchesPlayed: 0,
                  },
                },
                team: {
                  name: "Manchester City",
                },
                stats: {
                  stats: [],
                  status: "loaded",
                },
              },
              participantIdB: {
                urn: "ppb:obb:footballPlayer:152843/e/34122289",
                player: {
                  __typename: "ObbFootballPlayer",
                  id: "152843",
                  name: "Player 152843",
                  seasonStats: {
                    matchesPlayed: 2,
                  },
                },
                team: {
                  name: "Manchester City",
                },
                stats: {
                  stats: [],
                  status: "loaded",
                },
              },
              outcomeId: "SHOTS_TIME_ADJUSTED",
              timePeriodId: "MATCH",
            },
          },
          participants: [
            {
              player: {
                id: 1,
                name: "Participant 1",
              },
              team: {
                id: "homeTeam",
                name: "Home Team",
              },
              stats: [
                {
                  id: "1",
                  label: "SHOTS",
                  value: 1,
                },
                {
                  id: "2",
                  label: "GOALS",
                  value: 0,
                },
              ],
            },
            {
              player: {
                id: 2,
                name: "Participant 2",
              },
              team: {
                id: "awayTeam",
                name: "Away Team",
              },
              stats: [
                {
                  id: "1",
                  label: "SHOTS",
                  value: 1,
                },
                {
                  id: "2",
                  label: "GOALS",
                  value: 0,
                },
              ],
            },
          ],
          firstParticipant: {
            urn: "ppb:obb:footballPlayer:152843/e/34122289",
            player: {
              __typename: "ObbFootballPlayer",
              id: "152843",
              name: "Player 152843",
              seasonStats: {
                matchesPlayed: 2,
              },
            },
            team: {
              name: "Manchester City",
            },
            stats: [
              {
                id: "1",
                label: "SHOTS",
                value: 1,
              },
              {
                id: "2",
                label: "GOALS",
                value: 0,
              },
            ],
          },
          secondParticipant: {
            urn: "ppb:obb:footballPlayer:152844/e/34122289",
            player: {
              __typename: "ObbFootballPlayer",
              id: "152844",
              name: "Player 152844",
              seasonStats: {
                matchesPlayed: 0,
              },
            },
            team: {
              name: "Manchester City",
            },
            stats: [
              {
                id: "1",
                label: "SHOTS",
                value: 1,
              },
              {
                id: "2",
                label: "GOALS",
                value: 0,
              },
            ],
          },
          betButtons: ["legId1", "legId2"],
          teams: {
            home: {
              id: "homeTeam",
              name: "Home Team",
            },
            away: {
              id: "awayTeam",
              name: "Away Team",
            },
          },
          statsGroupProps: {
            label: "Shots",
            secondaryLabel: "I18N.OBB.STATS.PER_GAME",
            left: {
              color: null,
              value: 1,
            },
            right: {
              color: null,
              value: null,
            },
            maxValue: 1,
            disabled: false,
          },
          getParticipantQuotes: expect.any(Function),
          updateSelectedLegs: expect.any(Function),
          participantInfo: "participantInfo",
          eventName: "Mansfield v Cambridge Utd",
          disabledState: false,
          position: undefined,
          removeObbStatsLabel: false,
        });
      });

      it("should return correct jersey colors in statsGroupProps when participants have URNs and colors", () => {
        formatQuote.mockReturnValue({ odds: "4.00" });
        getStatsByIncidentType.mockReturnValue([
          { id: "1", label: "SHOTS", value: 1 },
          { id: "2", label: "GOALS", value: 0 },
        ]);
        isObbQuoteError.mockReturnValue(false);
        isCardDisabled.mockReturnValue(false);

        const mapStateToProps = makeMapStateToProps();
        const newState = {
          ...DEFAULT_STATE,
          entities: {
            ...DEFAULT_STATE.entities,
            obbLegs: {
              [OBB_LEG.id]: OBB_LEG,
              [OBB_LEG_2.id]: OBB_LEG_2,
            },
          },
        };

        getObbPvPCardByURN.mockReturnValue({
          urn: "urn",
          typename: "ObbPvpCard",
          sportevent: {
            name: "Mansfield v Cambridge Utd",
          },
          participants: [
            {
              urn: "ppb:obb:footballPlayer:152843/e/34122289",
              player: { id: "152843", name: "Player 152843" },
              team: { id: "homeTeam", name: "Home Team", color: "#1f77b4" },
            },
            {
              urn: "ppb:obb:footballPlayer:152844/e/34122289",
              player: { id: "152844", name: "Player 152844" },
              team: { id: "awayTeam", name: "Away Team", color: "#ff7f0e" },
            },
          ],
          incidentType: "SHOTS",
          participantInfo: { name: "participantInfo" },
          teams: { home: { id: "homeTeam", name: "Home Team" }, away: { id: "awayTeam", name: "Away Team" } },
          selectedLegs: ["legId1", "legId2"],
          legs: ["legId1", "legId2", "legId3"],
        });

        const stateToProps = mapStateToProps(newState, { urn: "urn" });

        expect(stateToProps.statsGroupProps).toEqual({
          label: "Shots",
          secondaryLabel: "I18N.OBB.STATS.PER_GAME",
          left: {
            color: "#1f77b4",
            value: 1,
          },
          right: {
            color: "#ff7f0e",
            value: null,
          },
          maxValue: 1,
          disabled: false,
        });
      });

      it("should set removeObbStatsLabel to true when experiment requests removal", () => {
        isToRemoveObbStatsLabel.mockReturnValueOnce(true);

        const mapStateToProps = makeMapStateToProps();
        const stateToProps = mapStateToProps(DEFAULT_STATE, { urn: "urn" });

        expect(stateToProps.removeObbStatsLabel).toBe(true);
      });
    });

    describe("when we don't have quote", () => {
      it("should return the correct object", () => {
        const OBB_QUOTE_LEG_ERROR = {
          ...OBB_LEG,
          quote: {
            typename: "ObbQuoteError",
            errorCode: "EVENT_SUSPENDED",
          },
        };
        getObbLegById.mockImplementation((state, id) => {
          if (id === "legId1") {
            return {
              ...OBB_QUOTE_LEG_ERROR,
              id: "legId1",
            };
          }
          if (id === "legId2") {
            return {
              ...OBB_LEG,
              id: "legId2",
            };
          }
          return OBB_LEG;
        });

        formatQuote.mockReturnValue({ odds: null, quoteError: "EVENT_SUSPENDED" });
        getStatsByIncidentType.mockReturnValue([
          { id: "1", label: "SHOTS", value: 1 },
          { id: "2", label: "GOALS", value: 1 },
        ]);
        isObbQuoteError.mockReturnValue({
          typename: "ObbQuoteError",
          errorCode: "EVENT_SUSPENDED",
          errorDetails: null,
        });
        isCardDisabled.mockReturnValue(true);
        buildOutcomeDescription.mockReturnValue({ header: "header", subtitle: "subtitle", summary: "summary" });

        const mapStateToProps = makeMapStateToProps();
        const newState = {
          ...DEFAULT_STATE,
          entities: {
            ...DEFAULT_STATE.entities,
            obbLegs: {
              [OBB_LEG.id]: OBB_QUOTE_LEG_ERROR,
            },
          },
        };
        const stateToProps = mapStateToProps(newState, { urn: "urn" });

        expect(stateToProps).toEqual({
          urn: "urn",
          playerSelectionIconVariant: undefined,
          position: undefined,
          title: undefined,
          firstLeg: {
            id: "legId1",
            templateId: "playerVsPlayer",
            event: {
              urn: "ppb:event:34122289",
              name: "Mansfield v Cambridge Utd",
              eventId: 34122289,
            },
            quote: {
              typename: "ObbQuoteError",
              errorCode: "EVENT_SUSPENDED",
            },
            templateParams: {
              participantIdA: {
                urn: "ppb:obb:footballPlayer:152843/e/34122289",
                player: {
                  __typename: "ObbFootballPlayer",
                  id: "152843",
                  name: "Player 152843",
                  seasonStats: {
                    matchesPlayed: 2,
                  },
                },
                team: {
                  name: "Manchester City",
                },
                stats: {
                  stats: [],
                  status: "loaded",
                },
              },
              participantIdB: {
                urn: "ppb:obb:footballPlayer:152844/e/34122289",
                player: {
                  __typename: "ObbFootballPlayer",
                  id: "152844",
                  name: "Player 152844",
                  seasonStats: {
                    matchesPlayed: 0,
                  },
                },
                team: {
                  name: "Manchester City",
                },
                stats: {
                  stats: [],
                  status: "loaded",
                },
              },
              outcomeId: "SHOTS_TIME_ADJUSTED",
              timePeriodId: "MATCH",
            },
          },
          secondLeg: {
            id: "legId2",
            templateId: "playerVsPlayer",
            event: {
              urn: "ppb:event:34122289",
              name: "Mansfield v Cambridge Utd",
              eventId: 34122289,
            },
            quote: {
              typename: "ObbQuoteSuccess",
              price: {
                decimal: 4,
              },
            },
            templateParams: {
              participantIdA: {
                urn: "ppb:obb:footballPlayer:152843/e/34122289",
                player: {
                  __typename: "ObbFootballPlayer",
                  id: "152843",
                  name: "Player 152843",
                  seasonStats: {
                    matchesPlayed: 2,
                  },
                },
                team: {
                  name: "Manchester City",
                },
                stats: {
                  stats: [],
                  status: "loaded",
                },
              },
              participantIdB: {
                urn: "ppb:obb:footballPlayer:152844/e/34122289",
                player: {
                  __typename: "ObbFootballPlayer",
                  id: "152844",
                  name: "Player 152844",
                  seasonStats: {
                    matchesPlayed: 0,
                  },
                },
                team: {
                  name: "Manchester City",
                },
                stats: {
                  stats: [],
                  status: "loaded",
                },
              },
              outcomeId: "SHOTS_TIME_ADJUSTED",
              timePeriodId: "MATCH",
            },
          },
          participants: [
            {
              player: {
                id: 1,
                name: "Participant 1",
              },
              team: {
                id: "homeTeam",
                name: "Home Team",
              },
              stats: [
                {
                  id: "1",
                  label: "SHOTS",
                  value: 1,
                },
                {
                  id: "2",
                  label: "GOALS",
                  value: 1,
                },
              ],
            },
            {
              player: {
                id: 2,
                name: "Participant 2",
              },
              team: {
                id: "awayTeam",
                name: "Away Team",
              },
              stats: [
                {
                  id: "1",
                  label: "SHOTS",
                  value: 1,
                },
                {
                  id: "2",
                  label: "GOALS",
                  value: 1,
                },
              ],
            },
          ],
          firstParticipant: {
            urn: "ppb:obb:footballPlayer:152843/e/34122289",
            player: {
              __typename: "ObbFootballPlayer",
              id: "152843",
              name: "Player 152843",
              seasonStats: {
                matchesPlayed: 2,
              },
            },
            team: {
              name: "Manchester City",
            },
            stats: [
              {
                id: "1",
                label: "SHOTS",
                value: 1,
              },
              {
                id: "2",
                label: "GOALS",
                value: 1,
              },
            ],
          },
          secondParticipant: {
            urn: "ppb:obb:footballPlayer:152843/e/34122289",
            player: {
              __typename: "ObbFootballPlayer",
              id: "152843",
              name: "Player 152843",
              seasonStats: {
                matchesPlayed: 2,
              },
            },
            team: {
              name: "Manchester City",
            },
            stats: [
              {
                id: "1",
                label: "SHOTS",
                value: 1,
              },
              {
                id: "2",
                label: "GOALS",
                value: 1,
              },
            ],
          },
          quoteError: "EVENT_SUSPENDED",
          betButtons: ["legId1", "legId2"],
          teams: {
            home: {
              id: "homeTeam",
              name: "Home Team",
            },
            away: {
              id: "awayTeam",
              name: "Away Team",
            },
          },
          statsGroupProps: {
            label: "Shots",
            secondaryLabel: "I18N.OBB.STATS.PER_GAME",
            left: {
              color: null,
              value: 1,
            },
            right: {
              color: null,
              value: 1,
            },
            maxValue: 1,
            disabled: true,
          },
          getParticipantQuotes: expect.any(Function),
          updateSelectedLegs: expect.any(Function),
          participantInfo: "participantInfo",
          eventName: "Mansfield v Cambridge Utd",
          disabledState: true,
          removeObbStatsLabel: false,
        });
      });
    });

    describe("when we updateSelectedLegs", () => {
      describe("when we don't have obbLeg", () => {
        it("should not update the selected legs", () => {
          const mapStateToProps = makeMapStateToProps();
          const newState = {
            ...DEFAULT_STATE,
            entities: {
              ...DEFAULT_STATE.entities,
              obbLegs: undefined,
            },
          };

          const stateToProps = mapStateToProps(newState, { urn: "urn" });

          const { updateSelectedLegs } = stateToProps;

          getObbLegById.mockReturnValueOnce(undefined);

          const result = updateSelectedLegs("11111", "22222");

          expect(typeof updateSelectedLegs).toBe("function");
          expect(result).toEqual([]);
        });
      });

      describe("when the legsIds are different", () => {
        it("should update the selected legs correctly", () => {
          getStatsByIncidentType.mockReturnValue([
            { id: "1", label: "SHOTS", value: 1 },
            { id: "2", label: "GOALS", value: 1 },
          ]);

          formatQuote.mockReturnValue({ odds: "4.00" }).mockReturnValueOnce({ odds: "3.50" });

          const mapStateToProps = makeMapStateToProps();

          const newState = {
            ...DEFAULT_STATE,
            entities: {
              ...DEFAULT_STATE.entities,
              obbLegs: {
                [OBB_LEG.id]: OBB_LEG,
                [OBB_LEG_2.id]: OBB_LEG_2,
                [OBB_LEG_3.id]: OBB_LEG_3,
              },
            },
          };
          const stateToProps = mapStateToProps(newState, { urn: "urn" });

          const { updateSelectedLegs } = stateToProps;
          getObbLegById.mockReturnValueOnce(OBB_LEG_3);

          const result = updateSelectedLegs("54321", "152843");

          expect(result).toEqual(["legId3", "legId3"]);
        });

        it("should keep selection empty when same participant ids provided", () => {
          const mapStateToProps = makeMapStateToProps();
          const newState = {
            ...DEFAULT_STATE,
            entities: {
              ...DEFAULT_STATE.entities,
              obbLegs: {
                [OBB_LEG.id]: OBB_LEG,
              },
            },
          };
          const stateToProps = mapStateToProps(newState, { urn: "urn" });
          const { updateSelectedLegs } = stateToProps;

          getObbLegById.mockReturnValueOnce(OBB_LEG);

          expect(updateSelectedLegs("152843", "152843")).toEqual([]);
        });
      });
    });

    describe("getParticipantQuotes", () => {
      it("should return quotes for participants when valid legs are provided", () => {
        getStatsByIncidentType.mockReturnValue([
          { id: "1", label: "SHOTS", value: 1 },
          { id: "2", label: "GOALS", value: 1 },
        ]);

        formatQuote.mockReturnValue({ odds: "4.00" });

        const mapStateToProps = makeMapStateToProps();
        const newState = {
          ...DEFAULT_STATE,
          entities: {
            ...DEFAULT_STATE.entities,
            obbLegs: OBB_LEG_2,
          },
        };
        const stateToProps = mapStateToProps(newState, { urn: "urn" });

        const { getParticipantQuotes } = stateToProps;

        getObbLegById.mockReturnValueOnce(OBB_LEG_2);
        const quotes = getParticipantQuotes(0, "152844", "152843");

        expect(quotes).toEqual({
          152844: "4.00",
          54321: "4.00",
        });
      });

      it("should return an empty array when no legs are provided", () => {
        const mapStateToProps = makeMapStateToProps();
        const newState = {
          ...DEFAULT_STATE,
          entities: {
            ...DEFAULT_STATE.entities,
            obbLegs: undefined,
          },
        };
        const stateToProps = mapStateToProps(newState, { urn: "urn" });

        const { getParticipantQuotes } = stateToProps;

        const quotes = getParticipantQuotes(0, "", "");

        expect(quotes).toEqual({});
      });

      it("should ignore legs without odds or missing participant ids", () => {
        formatQuote.mockReturnValue({ odds: null });
        const mapStateToProps = makeMapStateToProps();
        const newState = {
          ...DEFAULT_STATE,
          entities: {
            ...DEFAULT_STATE.entities,
            obbLegs: {
              badLeg: { ...OBB_LEG, templateParams: { participantIdA: {}, participantIdB: {} } },
            },
          },
        };
        const stateToProps = mapStateToProps(newState, { urn: "urn" });

        const quotes = stateToProps.getParticipantQuotes(0, "a", "b");

        expect(quotes).toEqual({});
      });
    });

    describe("with exp-bf-sport-obb-playerselector-icon experiment", () => {
      beforeEach(() => {
        getObbLegById.mockReturnValueOnce(OBB_LEG_2).mockReturnValueOnce(OBB_LEG_3);
      });
      describe("when experiment isn't active", () => {
        it("should return icon as undefined", () => {
          createGetExperimentSelector.mockReturnValueOnce(jest.fn().mockReturnValue(undefined));

          const mapStateToProps = makeMapStateToProps();
          const newState = {
            ...DEFAULT_STATE,
            entities: {
              ...DEFAULT_STATE.entities,
              obbLegs: {
                [OBB_LEG.id]: OBB_LEG,
                [OBB_LEG_2.id]: OBB_LEG_2,
              },
            },
          };
          const stateToProps = mapStateToProps(newState, { urn: "urn", layoutUrn: "layoutUrn", itemIndex: 1 });

          expect(stateToProps.playerSelectionIconVariant).toEqual(undefined);
        });
      });
      describe("when experiment is active", () => {
        it("should return icon as undefined when any valid variant", () => {
          createGetExperimentSelector.mockReturnValueOnce(jest.fn().mockReturnValue({ variant: "control" }));

          const mapStateToProps = makeMapStateToProps();
          const newState = {
            ...DEFAULT_STATE,
            entities: {
              ...DEFAULT_STATE.entities,
              obbLegs: {
                [OBB_LEG.id]: OBB_LEG,
                [OBB_LEG_2.id]: OBB_LEG_2,
              },
            },
          };
          const stateToProps = mapStateToProps(newState, { urn: "urn", layoutUrn: "layoutUrn", itemIndex: 1 });

          expect(stateToProps.playerSelectionIconVariant).toEqual(undefined);
        });

        it("should return icon correctly with edit variant", () => {
          createGetExperimentSelector.mockReturnValueOnce(jest.fn().mockReturnValue({ variant: "exp-variant-edit" }));

          const mapStateToProps = makeMapStateToProps();
          const newState = {
            ...DEFAULT_STATE,
            entities: {
              ...DEFAULT_STATE.entities,
              obbLegs: {
                [OBB_LEG.id]: OBB_LEG,
                [OBB_LEG_2.id]: OBB_LEG_2,
              },
            },
          };
          const stateToProps = mapStateToProps(newState, { urn: "urn", layoutUrn: "layoutUrn", itemIndex: 1 });

          expect(stateToProps.playerSelectionIconVariant).toEqual(SystemIconName.EDIT);
        });

        it("should return icon correctly with chevron down variant", () => {
          createGetExperimentSelector.mockReturnValueOnce(
            jest.fn().mockReturnValue({ variant: "exp-variant-chevron-down" }),
          );

          const mapStateToProps = makeMapStateToProps();
          const newState = {
            ...DEFAULT_STATE,
            entities: {
              ...DEFAULT_STATE.entities,
              obbLegs: {
                [OBB_LEG.id]: OBB_LEG,
                [OBB_LEG_2.id]: OBB_LEG_2,
              },
            },
          };
          const stateToProps = mapStateToProps(newState, { urn: "urn", layoutUrn: "layoutUrn", itemIndex: 1 });

          expect(stateToProps.playerSelectionIconVariant).toEqual(SystemIconName.CHEVRON_DOWN);
        });
      });
    });

    describe("when participantInfo is not defined", () => {
      it("should return the correct object", () => {
        formatQuote.mockReturnValue({ odds: "4.00" });
        getStatsByIncidentType.mockReturnValue([
          { id: "1", label: "SHOTS", value: 1 },
          { id: "2", label: "GOALS", value: 0 },
        ]);
        isObbQuoteError.mockReturnValue(false);
        isCardDisabled.mockReturnValue(false);
        getObbPvPCardByURN.mockReturnValue({
          urn: "urn",
          typename: "ObbPvpCard",
          sportevent: {
            name: "Mansfield v Cambridge Utd",
          },
          participants: [
            { player: { id: 1, name: "Participant 1" }, team: { id: "homeTeam", name: "Home Team" } },
            { player: { id: 2, name: "Participant 2" }, team: { id: "awayTeam", name: "Away Team" } },
          ],
          incidentType: "SHOTS",
          teams: { home: { id: "homeTeam", name: "Home Team" }, away: { id: "awayTeam", name: "Away Team" } },
          selectedLegs: ["legId1", "legId2"],
          legs: ["legId1", "legId2", "legId3"],
        });

        const mapStateToProps = makeMapStateToProps();
        const newState = {
          ...DEFAULT_STATE,
          entities: {
            ...DEFAULT_STATE.entities,
            obbLegs: {
              [OBB_LEG.id]: OBB_LEG,
              [OBB_LEG_2.id]: OBB_LEG_2,
            },
          },
        };
        const stateToProps = mapStateToProps(newState, { urn: "urn", layoutUrn: "layoutUrn", itemIndex: 1 });

        expect(stateToProps.participantInfo).toEqual("I18N.OBB.MODAL_PARTICIPANT_INFO");
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch ObbLegQuotesUpdateStateAction when dispatchUpdateLegs is called", () => {
    const { dispatchUpdateLegs } = mapDispatchToProps(dispatch);

    const unquotedLegs = [
      {
        aggregator: "PARTICIPANT_1_TO_WIN",
        templateId: "playerVsPlayer",
        event: {
          urn: "eventUrn",
          name: "eventName",
          eventId: 34122289,
        },
        firstParticipant: "36115",
        secondParticipant: "8301",
        outcome: {
          incidentType: "GOALS_TIME_ADJUSTED",
          operator: "EXACTLY",
          period: "MATCH",
          value: 1,
        },
        quote: undefined,
      },
      {
        aggregator: "PARTICIPANT_2_TO_WIN",
        templateId: "playerVsPlayer",
        event: {
          urn: "eventUrn",
          name: "eventName",
          eventId: 34122289,
        },
        firstParticipant: "36115",
        secondParticipant: "8301",
        outcome: {
          incidentType: "GOALS_TIME_ADJUSTED",
          operator: "EXACTLY",
          period: "MATCH",
          value: 1,
        },
        quote: undefined,
      },
      {
        aggregator: "PARTICIPANT_1_TO_WIN",
        templateId: "playerVsPlayer",
        event: {
          urn: "eventUrn",
          name: "eventName",
          eventId: 34122289,
        },
        firstParticipant: "8301",
        secondParticipant: "8301",
        outcome: {
          incidentType: "GOALS_TIME_ADJUSTED",
          operator: "EXACTLY",
          period: "MATCH",
          value: 1,
        },
        quote: undefined,
      },
      {
        aggregator: "PARTICIPANT_2_TO_WIN",
        templateId: "playerVsPlayer",
        event: {
          urn: "eventUrn",
          name: "eventName",
          eventId: 34122289,
        },
        firstParticipant: "8301",
        secondParticipant: "8301",
        outcome: {
          incidentType: "GOALS_TIME_ADJUSTED",
          operator: "EXACTLY",
          period: "MATCH",
          value: 1,
        },
        quote: undefined,
      },
    ];
    dispatchUpdateLegs("urn", unquotedLegs);

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_LEG_QUOTES_UPDATE_STATE,
      payload: { urn: "urn", unquotedLegs },
    });
  });

  it("should dispatch ObbSelectedLegsUpdateStateAction when dispatchSetSelectedLegs is called", () => {
    const { dispatchSetSelectedLegs } = mapDispatchToProps(dispatch);

    dispatchSetSelectedLegs("urn", ["legId1", "legId2"]);

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__UPDATE_SELECTED_LEGS_STATE,
      payload: { urn: "urn", selectedLegsId: ["legId1", "legId2"] },
    });
  });

  it("should dispatch ObbCleanCardLegsAction when dispatchCleanCardLegs is called", () => {
    const { dispatchCleanCardLegs } = mapDispatchToProps(dispatch);

    dispatchCleanCardLegs("urn");

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__CLEAN_CARD_LEGS_STATE,
      payload: { urn: "urn" },
    });
  });

  it("should dispatch ObbEventSelectionAction when dispatchObbEventSelection is called", () => {
    const { dispatchObbEventSelection } = mapDispatchToProps(dispatch);

    dispatchObbEventSelection({ module: "string", elementText: "string" });

    expect(dispatch).toHaveBeenCalledWith({
      type: OBB_CARD__EVENT_SELECTION,
      payload: {
        event: {
          elementText: "string",
          module: {
            card: "string",
          },
        },
      },
    });
  });
});
