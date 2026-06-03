import { hashObjectFnv1a } from "./hashing";
import {
  buildCardQuoteInputPvpLeg,
  buildCardQuoteInputSquadVsSquadLegs,
  buildObbQuote,
  buildValuesRange,
  buildUnquotedLegsForSquadVsSquad,
  getHighestPriorityError,
  mapUnquotedLegsByEvent,
  omitTypename,
  buildMessageTitle,
  joinPlayerNames,
  getParticipantsFromCard,
} from "./obb";

jest.mock("./hashing", () => ({
  hashObjectFnv1a: jest.fn(),
}));

describe("obb helpers", () => {
  afterEach(jest.clearAllMocks);

  describe("buildCardQuoteInputPvPLegs", () => {
    it("should build quote input legs for playerVsPlayer template", () => {
      const stateParticipants = {
        "urn:participant1": { player: { id: "player1" } },
        "urn:participant2": { player: { id: "player2" } },
        "urn:participant3": {},
      };

      const legsToQuote = [
        {
          id: "leg1",
          templateId: "playerVsPlayer",
          templateParams: {
            participantIdA: "urn:participant1",
            participantIdB: "urn:participant2",
            outcomeId: "goal",
            timePeriodId: "firstHalf",
          },
          event: {
            urn: "event:urn",
            name: "eventName",
            eventId: 12345,
          },
        },
        {
          id: "leg2",
          templateId: "playerVsPlayer",
          templateParams: {
            participantIdA: "urn:participant1",
            participantIdB: "urn:participant2",
            outcomeId: "goal",
            timePeriodId: "firstHalf",
          },
          event: {
            urn: "event:urn",
            name: "eventName",
            eventId: 12345,
          },
        },
        {
          id: "leg3",
          templateId: "playerVsPlayer",
          templateParams: {
            participantIdA: "urn:participant3",
            participantIdB: "urn:participant2",
            outcomeId: "goal",
            timePeriodId: "timePeriodId",
          },
          event: {
            urn: "event:urn",
            name: "eventName",
            eventId: 12345,
          },
        },
      ];

      const result = buildCardQuoteInputPvpLeg(legsToQuote, stateParticipants);

      expect(result).toEqual([
        {
          id: "leg1",
          expressionTemplateId: "playerVsPlayer",
          expressionParams: {
            outcomeId: "goal",
            timePeriodId: "firstHalf",
            participantIdA: "player1",
            participantIdB: "player2",
          },
        },
        {
          id: "leg2",
          expressionTemplateId: "playerVsPlayer",
          expressionParams: {
            outcomeId: "goal",
            timePeriodId: "firstHalf",
            participantIdA: "player1",
            participantIdB: "player2",
          },
        },
      ]);
    });

    it("should return an empty array if the legs have an unknown template", () => {
      const stateParticipants = {
        "urn:participant1": { player: { id: "player1" } },
      };

      const legsToQuote = [
        {
          id: "leg1",
          templateId: "templateId",
          templateParams: {
            participantIdA: "urn:participant1",
            participantIdB: "urn:participant2",
            outcomeId: "goal",
            timePeriodId: "timePeriodId",
          },
          firstParticipant: "urn:participant1",
          secondParticipant: "urn:participant2",
          outcome: { incidentType: "goal", period: "firstHalf" },
          aggregator: "PARTICIPANT_1_TO_WIN",
          event: {
            urn: "event:urn",
            name: "eventName",
            eventId: 12345,
          },
        },
      ];

      const result = buildCardQuoteInputPvpLeg(legsToQuote, stateParticipants);

      expect(result).toEqual([]);
    });
  });

  describe("buildCardQuoteInputSquadVsSquadLegs", () => {
    it("should build quote input legs for squadVsSquad template", () => {
      const stateParticipants = [
        {
          urn: "urn:participant1",
          player: {
            id: "player1",
          },
        },
        {
          urn: "urn:participant2",
          player: {
            id: "player2",
          },
        },
        {
          urn: "urn:participant3",
          player: {
            id: "player3",
          },
        },
      ];

      const legsToQuote = [
        {
          id: "leg1",
          templateId: "squadVsSquad",
          templateParams: {
            squadAParticipantIds: ["urn:participant1", "urn:participant2"],
            squadBParticipantIds: ["urn:participant3"],
          },
        },
      ];

      const result = buildCardQuoteInputSquadVsSquadLegs(legsToQuote, stateParticipants);

      expect(result).toEqual([
        {
          id: "leg1",
          expressionTemplateId: "squadVsSquad",
          expressionParams: {
            squadAParticipantIds: ["player1", "player2"],
            squadBParticipantIds: ["player3"],
            baseBets: null,
            outcomeId: null,
            participantIdA: null,
            participantIdB: null,
            participantIds: null,
            value: null,
            x: null,
          },
          baseExpressionTemplateDefinitions: null,
        },
      ]);
    });
  });

  describe("mapUnquotedLegsByEvent", () => {
    it("should group legs by their event", () => {
      const unquotedLegs = [
        { id: "1", event: { urn: "event1", eventId: 123 }, templateId: "template1" },
        { id: "2", event: { urn: "event2", eventId: 456 }, templateId: "template2" },
        { id: "3", event: { urn: "event1", eventId: 123 }, templateId: "template3" },
      ];

      const result = mapUnquotedLegsByEvent(unquotedLegs);

      expect(result).toEqual({
        123: [
          { id: "1", event: { urn: "event1", eventId: 123 }, templateId: "template1" },
          { id: "3", event: { urn: "event1", eventId: 123 }, templateId: "template3" },
        ],
        456: [{ id: "2", event: { urn: "event2", eventId: 456 }, templateId: "template2" }],
      });
    });
  });

  describe("buildValuesRange", () => {
    it("when the min is 0, should return the correct range", () => {
      const participants = [undefined, { incidentTypes: { GOALS: { resultType: { min: 0, max: 5 } } } }];

      const result = buildValuesRange(participants, "GOALS");

      expect(result).toEqual({
        min: 1,
        max: 5,
      });
    });

    it("when the min is not 0, should return the correct range", () => {
      const participants = [
        undefined,
        { incidentTypes: { GOALS: { resultType: { min: 0, max: 5 } } } },
        { incidentTypes: { GOALS: { resultType: { min: 3, max: 10 } } } },
      ];

      const result = buildValuesRange(participants, "GOALS");

      expect(result).toEqual({
        min: 3,
        max: 15,
      });
    });

    it("when the max greater than min, should return the correct range", () => {
      const participants = [
        undefined,
        { incidentTypes: { GOALS: { resultType: { min: 1, max: 2 } } } },
        { incidentTypes: { GOALS: { resultType: { min: 4, max: -5 } } } },
      ];

      const result = buildValuesRange(participants, "GOALS");

      expect(result).toEqual({
        min: 5,
        max: 5,
      });
    });
  });

  describe("buildUnquotedLegsForSquadVsSquad", () => {
    it("should build the unquoted legs", () => {
      hashObjectFnv1a.mockReturnValue("hashedLegId");

      const firstSquadParticipants = [{ urn: "player1" }];
      const secondSquadParticipants = [{ urn: "player2" }];

      const result = buildUnquotedLegsForSquadVsSquad(
        firstSquadParticipants,
        secondSquadParticipants,
        "GOALS",
        "GREATER_THAN",
        "MATCH",
        "squadVsSquad",
        { urn: "event:urn" },
      );

      expect(result).toStrictEqual({
        event: { urn: "event:urn" },
        id: "hashedLegId",
        templateId: "squadVsSquad",
        templateParams: {
          squadAParticipantIds: ["player1"],
          squadBParticipantIds: ["player2"],
          outcomeIds: ["GOALS"],
          quantifier: "GREATER_THAN",
          timePeriodId: "MATCH",
        },
      });
    });
  });

  describe("buildObbQuote", () => {
    it("should return ObbQuoteSuccess when resultCode is SUCCESS and price is present", () => {
      const quote = {
        result: {
          resultCode: "SUCCESS",
          errorDetails: null,
        },
        price: {
          decimal: 2.5,
          fractional: "6/4",
        },
      };

      const result = buildObbQuote(quote);

      expect(result).toEqual({
        typename: "ObbQuoteSuccess",
        price: {
          decimal: 2.5,
          fractional: "6/4",
        },
      });
    });

    it("should return ObbQuoteError when resultCode is not SUCCESS", () => {
      const quote = {
        result: {
          resultCode: "EVENT_SUSPENDED",
          errorDetails: "The event is currently suspended.",
        },
        price: null,
      };

      const result = buildObbQuote(quote);

      expect(result).toEqual({
        typename: "ObbQuoteError",
        errorCode: "EVENT_SUSPENDED",
        errorDetails: "The event is currently suspended.",
      });
    });
  });

  describe("getHighestPriorityError", () => {
    describe("when the errors are included in the ERROR_CODES list", () => {
      it("should return the error with the highest priority", () => {
        const errors = ["EVENT_SUSPENDED", "OUTCOME_DEFINITION_NOT_FOUND"];

        const result = getHighestPriorityError(errors, "ANOTHER_ERROR");

        expect(result).toEqual("EVENT_SUSPENDED");
      });
    });

    describe("when there are errors that are not included in the ERROR_CODES list", () => {
      describe("when all the errors are not included in the ERROR_CODES list", () => {
        it("should return an empty string", () => {
          const errors = ["UNKNOWN_ERROR", "ANOTHER_ERROR"];

          const result = getHighestPriorityError(errors);

          expect(result).toEqual("");
        });
      });

      describe("when some errors are not included in the ERROR_CODES list", () => {
        it("should return an the highest priority error from the ones that are included in the ERROR_CODES list", () => {
          const errors = ["UNKNOWN_ERROR", "GENERAL_FAILURE", "EVENT_SUSPENDED"];

          const result = getHighestPriorityError(errors);

          expect(result).toEqual("EVENT_SUSPENDED");
        });
      });
    });
  });

  describe("omitTypename", () => {
    it("should remove __typename property from an object", () => {
      const obj = {
        __typename: "SomeType",
        id: "123",
        name: "test",
        value: 42,
      };

      const result = omitTypename(obj);

      expect(result).toEqual({
        id: "123",
        name: "test",
        value: 42,
      });
      expect(result).not.toHaveProperty("__typename");
    });

    it("should return the same object when __typename is not present", () => {
      const obj = {
        id: "123",
        name: "test",
        value: 42,
      };

      const result = omitTypename(obj);

      expect(result).toEqual(obj);
      expect(result).not.toHaveProperty("__typename");
    });

    it("should handle objects with nested properties", () => {
      const obj = {
        __typename: "ComplexType",
        id: "123",
        nested: {
          __typename: "NestedType",
          data: "nested value",
        },
        array: [1, 2, 3],
      };

      const result = omitTypename(obj);

      expect(result).toEqual({
        id: "123",
        nested: {
          __typename: "NestedType",
          data: "nested value",
        },
        array: [1, 2, 3],
      });
      expect(result).not.toHaveProperty("__typename");
    });

    it("should handle empty objects", () => {
      const obj = {};

      const result = omitTypename(obj);

      expect(result).toEqual({});
      expect(result).not.toHaveProperty("__typename");
    });

    it("should handle objects with only __typename", () => {
      const obj = {
        __typename: "OnlyType",
      };

      const result = omitTypename(obj);

      expect(result).toEqual({});
      expect(result).not.toHaveProperty("__typename");
    });
  });

  describe("buildMessageTitle", () => {
    it("should return PVP disabled title for playerVsPlayer template", () => {
      const result = buildMessageTitle("playerVsPlayer");

      expect(result).toEqual({
        key: "I18N.OBB.PVP.DISABLED.TITLE",
      });
    });

    it("should return squad vs squad disabled title for squadVsSquad template", () => {
      const result = buildMessageTitle("squadVsSquad");

      expect(result).toEqual({
        key: "I18N.OBB.SQUADVSSQUAD.DISABLED.TITLE",
      });
    });

    it("should return squad bet disabled title for participantsCombined template", () => {
      const result = buildMessageTitle("participantsCombined");

      expect(result).toEqual({
        key: "I18N.OBB.SQUADBET.DISABLED.TITLE",
      });
    });

    it("should return generic disabled title for undefined template", () => {
      const result = buildMessageTitle(undefined);

      expect(result).toEqual({
        key: "I18N.OBB.GENERIC.DISABLED.TITLE",
      });
    });

    it("should return generic disabled title for unknown template", () => {
      const result = buildMessageTitle("unknownTemplate");

      expect(result).toEqual({
        key: "I18N.OBB.GENERIC.DISABLED.TITLE",
      });
    });

    it("should return generic disabled title when no argument is provided", () => {
      const result = buildMessageTitle();

      expect(result).toEqual({
        key: "I18N.OBB.GENERIC.DISABLED.TITLE",
      });
    });
  });

  describe("joinPlayerNames", () => {
    it('joins two names with " & "', () => {
      expect(joinPlayerNames(["Alice", "Bob"])).toBe("Alice & Bob");
    });

    it('joins three names with commas and " & "', () => {
      expect(joinPlayerNames(["Alice", "Bob", "Charlie"])).toBe("Alice, Bob & Charlie");
    });

    it("filters out null and undefined values", () => {
      expect(joinPlayerNames(["Alice", null, undefined, "Bob"])).toBe("Alice & Bob");
    });

    it("returns empty string for empty array", () => {
      expect(joinPlayerNames([])).toBe("");
    });

    it("returns single name unchanged", () => {
      expect(joinPlayerNames(["Alice"])).toBe("Alice");
    });

    it("returns empty string for array of null/undefined", () => {
      expect(joinPlayerNames([null, undefined])).toBe("");
    });
  });

  describe("getParticipantsFromCard", () => {
    const mockPlayer = {
      urn: "ppb:participant:1",
      typename: "ObbFootballPlayer",
      incidentTypes: {},
      player: {
        id: "1",
        name: "Test Player",
        position: "Forward",
        shirtNumber: 10,
        seasonStats: {
          matchesPlayed: 5,
          averages: {
            goals: 0.5,
            redCards: 0,
            yellowCards: 0,
            yellowRedCards: 0,
            shotsOnTarget: 1,
            totalShots: 2,
            fouls: null,
            foulsWon: null,
            assists: 0.2,
            passes: 10,
          },
        },
      },
      team: { name: "Team A", color: "FF0000", id: "1", jerseys: [] },
    };

    const mockPlayer2 = {
      urn: "ppb:participant:2",
      typename: "ObbFootballPlayer",
      incidentTypes: {},
      player: {
        id: "2",
        name: "Test Player 2",
        position: "Defender",
        shirtNumber: 5,
        seasonStats: {
          matchesPlayed: 5,
          averages: {
            goals: 0,
            redCards: 0,
            yellowCards: 1,
            yellowRedCards: 0,
            shotsOnTarget: 0,
            totalShots: 1,
            fouls: null,
            foulsWon: null,
            assists: 0,
            passes: 20,
          },
        },
      },
      team: { name: "Team B", color: "0000FF", id: "2", jerseys: [] },
    };
    describe("ObbPvpCard", () => {
      it("should return participants array from ObbPvpCard", () => {
        const card = {
          typename: "ObbPvpCard",
          urn: "ppb:card:pvp:1",
          title: "PvP Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          participants: [mockPlayer, mockPlayer2],
          incidentType: "GOALS",
          participantInfo: undefined,
          filterTags: [],
          defaultLegs: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([mockPlayer, mockPlayer2]);
      });

      it("should return empty array when ObbPvpCard has no participants", () => {
        const card = {
          typename: "ObbPvpCard",
          urn: "ppb:card:pvp:1",
          title: "PvP Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          participants: [],
          incidentType: "GOALS",
          participantInfo: undefined,
          filterTags: [],
          defaultLegs: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([]);
      });
    });

    describe("ObbSquadBetCard", () => {
      it("should return eventParticipants from ObbSquadBetCard", () => {
        const card = {
          typename: "ObbSquadBetCard",
          urn: "ppb:card:squad-bet:1",
          title: "Squad Bet Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          eventParticipants: [mockPlayer, mockPlayer2],
          bettingOpportunities: [],
          filterTags: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([mockPlayer, mockPlayer2]);
      });

      it("should return empty array when eventParticipants is null", () => {
        const card = {
          typename: "ObbSquadBetCard",
          urn: "ppb:card:squad-bet:1",
          title: "Squad Bet Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          eventParticipants: null,
          bettingOpportunities: [],
          filterTags: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([]);
      });

      it("should return empty array when eventParticipants is undefined", () => {
        const card = {
          typename: "ObbSquadBetCard",
          urn: "ppb:card:squad-bet:1",
          title: "Squad Bet Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          eventParticipants: undefined,
          bettingOpportunities: [],
          filterTags: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([]);
      });
    });

    describe("ObbSquadVsSquadCard", () => {
      it("should return eventParticipants from ObbSquadVsSquadCard", () => {
        const card = {
          typename: "ObbSquadVsSquadCard",
          urn: "ppb:card:squad-vs-squad:1",
          title: "Squad vs Squad Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          eventParticipants: [mockPlayer, mockPlayer2],
          filterTags: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([mockPlayer, mockPlayer2]);
      });

      it("should return empty array when eventParticipants is null in ObbSquadVsSquadCard", () => {
        const card = {
          typename: "ObbSquadVsSquadCard",
          urn: "ppb:card:squad-vs-squad:1",
          title: "Squad vs Squad Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          eventParticipants: null,
          filterTags: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([]);
      });
    });

    describe("ObbCreatedBetsCard", () => {
      it("should flatten and return participants from all betting opportunities", () => {
        const card = {
          typename: "ObbCreatedBetsCard",
          urn: "ppb:card:created-bets:1",
          title: "Created Bets Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          bettingOpportunities: [
            { participants: [mockPlayer] },
            { participants: [mockPlayer2] },
            { participants: [mockPlayer, mockPlayer2] },
          ],
          filterTags: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([mockPlayer, mockPlayer2, mockPlayer, mockPlayer2]);
      });

      it("should handle empty betting opportunities array", () => {
        const card = {
          typename: "ObbCreatedBetsCard",
          urn: "ppb:card:created-bets:1",
          title: "Created Bets Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          bettingOpportunities: [],
          filterTags: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([]);
      });

      it("should handle betting opportunities with empty participants arrays", () => {
        const card = {
          typename: "ObbCreatedBetsCard",
          urn: "ppb:card:created-bets:1",
          title: "Created Bets Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          bettingOpportunities: [{ participants: [] }, { participants: [] }],
          filterTags: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([]);
      });
    });

    describe("ObbEventPopularsCard", () => {
      it("should flatten and return participants from all popular betting opportunities", () => {
        const card = {
          typename: "ObbEventPopularsCard",
          urn: "ppb:card:event-populars:1",
          title: "Event Populars Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          popularBettingOpportunities: [
            { participants: [mockPlayer] },
            { participants: [mockPlayer2] },
            { participants: [mockPlayer, mockPlayer2] },
          ],
          filterTags: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([mockPlayer, mockPlayer2, mockPlayer, mockPlayer2]);
      });

      it("should handle empty popular betting opportunities array", () => {
        const card = {
          typename: "ObbEventPopularsCard",
          urn: "ppb:card:event-populars:1",
          title: "Event Populars Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          popularBettingOpportunities: [],
          filterTags: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([]);
      });

      it("should handle popular opportunities with empty participants arrays", () => {
        const card = {
          typename: "ObbEventPopularsCard",
          urn: "ppb:card:event-populars:1",
          title: "Event Populars Card",
          sportevent: {
            typename: "SportsEvent",
            name: "Event",
            urn: "ppb:event:1",
            eventId: 1,
          },
          teams: {
            home: { id: "1", name: "Team A", color: "FF0000" },
            away: { id: "2", name: "Team B", color: "0000FF" },
          },
          popularBettingOpportunities: [{ participants: [] }, { participants: [] }],
          filterTags: [],
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([]);
      });
    });

    describe("Invalid card typename", () => {
      it("should return empty array for unknown card typename", () => {
        const card = {
          typename: "UnknownCard",
        };

        const result = getParticipantsFromCard(card);

        expect(result).toEqual([]);
      });
    });
  });
});
