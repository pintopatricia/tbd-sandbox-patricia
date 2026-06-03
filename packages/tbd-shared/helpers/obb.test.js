import { mapQuantifierEnumToSymbol } from "@ppb/tbd-store/helpers/obb-betting";
import {
  buildPlayer,
  getStatsByIncidentType,
  formatQuote,
  isObbQuoteError,
  isCardDisabled,
  errorCodes,
  groupMoreInfoDetails,
  buildUnquotedLegsForPvP,
  formatName,
  splitName,
  getMicroPlayerBorderRadius,
  getSquadBetParticipantName,
  getSquadAverageStatByIncidentType,
  formatPlayerStat,
  buildMicroPlayerVm,
  getContextualStatsText,
  isToRemoveObbStatsLabel,
  isCombinedPotentialBet,
  hasSameBaseBets,
  buildObbLegDescription,
  buildObbAvgStatsDescription,
  getIncidentDataMapping,
  getStatsLabels,
  buildObbBetButtonSecondaryLabel,
} from "./obb";
import { i18n } from "./i18n";

jest.mock("./obb", () => ({
  ...jest.requireActual("./obb"),
  getStatsByOutcome: jest.fn(),
}));

jest.mock("./i18n", () => ({
  i18n: jest.fn(({ key, interpolationValues }) => {
    if (
      key === "I18N.OBB.SQUADVSSQUAD.BET.DESCRIPTION" ||
      key === "I18N.OBB.SQUADBET.BET.DESCRIPTION" ||
      key === "I18N.OBB.PVP.BET.DESCRIPTION"
    ) {
      return `Called with ${Object.values(interpolationValues).join(", ")}`;
    }

    if (key === "I18N.OBB.SQUADBET.STATS.LABEL_ABBREV" || key === "I18N.OBB.PVP.STATS.LABEL_ABBREV") {
      return `Stats: ${Object.values(interpolationValues).join(", ")}`;
    }

    return key;
  }),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  IconsList: {
    GOALS: "goals-icon",
    PENALTY_SCORED: "penalty-scored-icon",
    FOULS: "fouls-icon",
    ASSISTS: "assists-icon",
    CARDS: "cards-icon",
  },
}));

jest.mock("@ppb/tbd-store/helpers/obb-betting", () => ({
  mapQuantifierEnumToSymbol: jest.fn(),
}));

describe("getIncidentDataMapping", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct mapping for GOALS incident", () => {
    const result = getIncidentDataMapping("GOALS");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.GOALS",
      icon: "goals-icon",
    });
  });

  it("should return correct mapping for GOALS_TIME_ADJUSTED incident", () => {
    const result = getIncidentDataMapping("GOALS_TIME_ADJUSTED");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.GOALS",
      icon: "goals-icon",
    });
  });

  it("should return correct mapping for SHOTS incident", () => {
    const result = getIncidentDataMapping("SHOTS");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.SHOTS",
      icon: "penalty-scored-icon",
    });
  });

  it("should return correct mapping for SHOTS_TIME_ADJUSTED incident", () => {
    const result = getIncidentDataMapping("SHOTS_TIME_ADJUSTED");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.SHOTS",
      icon: "penalty-scored-icon",
    });
  });

  it("should return correct mapping for SHOTS_ON_TARGET incident", () => {
    const result = getIncidentDataMapping("SHOTS_ON_TARGET");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.SHOTS_ON_TARGET",
      icon: "penalty-scored-icon",
    });
  });

  it("should return correct mapping for SHOTS_ON_TARGET_TIME_ADJUSTED incident", () => {
    const result = getIncidentDataMapping("SHOTS_ON_TARGET_TIME_ADJUSTED");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.SHOTS_ON_TARGET",
      icon: "penalty-scored-icon",
    });
  });

  it("should return correct mapping for FOULS_COMMITTED incident", () => {
    const result = getIncidentDataMapping("FOULS_COMMITTED");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.FOULS_COMMITTED",
      icon: "fouls-icon",
    });
  });

  it("should return correct mapping for FOULS_COMMITTED_TIME_ADJUSTED incident", () => {
    const result = getIncidentDataMapping("FOULS_COMMITTED_TIME_ADJUSTED");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.FOULS_COMMITTED",
      icon: "fouls-icon",
    });
  });

  it("should return correct mapping for FOULS_WON incident", () => {
    const result = getIncidentDataMapping("FOULS_WON");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.FOULS_WON",
      icon: "fouls-icon",
    });
  });

  it("should return correct mapping for FOULS_WON_TIME_ADJUSTED incident", () => {
    const result = getIncidentDataMapping("FOULS_WON_TIME_ADJUSTED");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.FOULS_WON",
      icon: "fouls-icon",
    });
  });

  it("should return correct mapping for PASSES incident", () => {
    const result = getIncidentDataMapping("PASSES");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.PASSES",
      icon: "assists-icon",
    });
  });

  it("should return correct mapping for PASSES_TIME_ADJUSTED incident", () => {
    const result = getIncidentDataMapping("PASSES_TIME_ADJUSTED");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.PASSES",
      icon: "assists-icon",
    });
  });

  it("should return correct mapping for ASSISTS incident", () => {
    const result = getIncidentDataMapping("ASSISTS");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.ASSISTS",
      icon: "assists-icon",
    });
  });

  it("should return correct mapping for ASSISTS_TIME_ADJUSTED incident", () => {
    const result = getIncidentDataMapping("ASSISTS_TIME_ADJUSTED");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.ASSISTS",
      icon: "assists-icon",
    });
  });

  it("should return correct mapping for BOOKED incident", () => {
    const result = getIncidentDataMapping("BOOKED");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.BOOKED",
      icon: "cards-icon",
    });
  });

  it("should return the correct mapping for the FOUL_INVOLVEMENTS incident", () => {
    const result = getIncidentDataMapping("FOUL_INVOLVEMENTS");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.FOUL_INVOLVEMENTS",
      icon: "fouls-icon",
    });
  });

  it("should return the correct mapping for the FOUL_INVOLVEMENTS_TIME_ADJUSTED incident", () => {
    const result = getIncidentDataMapping("FOUL_INVOLVEMENTS_TIME_ADJUSTED");

    expect(result).toEqual({
      text: "I18N.OBB.OUTCOME.INCIDENT.FOUL_INVOLVEMENTS",
      icon: "fouls-icon",
    });
  });

  it("should return null for unknown incident type", () => {
    const result = getIncidentDataMapping("UNKNOWN_INCIDENT");

    expect(result).toBeNull();
  });

  it("should return null for empty string", () => {
    const result = getIncidentDataMapping("");

    expect(result).toBeNull();
  });

  it("should return null for invalid incident type", () => {
    const result = getIncidentDataMapping("INVALID");

    expect(result).toBeNull();
  });
});

describe("getStatsLabels", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return correct label for GOALS stat", () => {
    const result = getStatsLabels("GOALS");

    expect(result).toBe("I18N.OBB.STATS.GOALS");
  });

  it("should return correct label for GOALS_TIME_ADJUSTED stat", () => {
    const result = getStatsLabels("GOALS_TIME_ADJUSTED");

    expect(result).toBe("I18N.OBB.STATS.GOALS");
  });

  it("should return correct label for SHOTS stat", () => {
    const result = getStatsLabels("SHOTS");

    expect(result).toBe("I18N.OBB.STATS.SHOTS");
  });

  it("should return correct label for SHOTS_TIME_ADJUSTED stat", () => {
    const result = getStatsLabels("SHOTS_TIME_ADJUSTED");

    expect(result).toBe("I18N.OBB.STATS.SHOTS");
  });

  it("should return correct label for SHOTS_ON_TARGET stat", () => {
    const result = getStatsLabels("SHOTS_ON_TARGET");

    expect(result).toBe("I18N.OBB.STATS.SHOTS_ON_TARGET");
  });

  it("should return correct label for SHOTS_ON_TARGET_TIME_ADJUSTED stat", () => {
    const result = getStatsLabels("SHOTS_ON_TARGET_TIME_ADJUSTED");

    expect(result).toBe("I18N.OBB.STATS.SHOTS_ON_TARGET");
  });

  it("should return correct label for FOULS_COMMITTED stat", () => {
    const result = getStatsLabels("FOULS_COMMITTED");

    expect(result).toBe("I18N.OBB.STATS.FOULS_COMMITTED");
  });

  it("should return correct label for FOULS_COMMITTED_TIME_ADJUSTED stat", () => {
    const result = getStatsLabels("FOULS_COMMITTED_TIME_ADJUSTED");

    expect(result).toBe("I18N.OBB.STATS.FOULS_COMMITTED");
  });

  it("should return correct label for FOULS_WON stat", () => {
    const result = getStatsLabels("FOULS_WON");

    expect(result).toBe("I18N.OBB.STATS.FOULS_WON");
  });

  it("should return correct label for FOULS_WON_TIME_ADJUSTED stat", () => {
    const result = getStatsLabels("FOULS_WON_TIME_ADJUSTED");

    expect(result).toBe("I18N.OBB.STATS.FOULS_WON");
  });

  it("should return correct label for PASSES stat", () => {
    const result = getStatsLabels("PASSES");

    expect(result).toBe("I18N.OBB.STATS.PASSES");
  });

  it("should return correct label for PASSES_TIME_ADJUSTED stat", () => {
    const result = getStatsLabels("PASSES_TIME_ADJUSTED");

    expect(result).toBe("I18N.OBB.STATS.PASSES");
  });

  it("should return correct label for ASSISTS stat", () => {
    const result = getStatsLabels("ASSISTS");

    expect(result).toBe("I18N.OBB.STATS.ASSISTS");
  });

  it("should return correct label for ASSISTS_TIME_ADJUSTED stat", () => {
    const result = getStatsLabels("ASSISTS_TIME_ADJUSTED");

    expect(result).toBe("I18N.OBB.STATS.ASSISTS");
  });

  it("should return the correct label for the FOUL_INVOLVEMENTS stat", () => {
    const result = getStatsLabels("FOUL_INVOLVEMENTS");

    expect(result).toBe("I18N.OBB.STATS.FOUL_INVOLVEMENTS");
  });

  it("should return the correct label for the FOUL_INVOLVEMENTS_TIME_ADJUSTED stat", () => {
    const result = getStatsLabels("FOUL_INVOLVEMENTS_TIME_ADJUSTED");

    expect(result).toBe("I18N.OBB.STATS.FOUL_INVOLVEMENTS");
  });

  it("should return null for unknown stat type", () => {
    const result = getStatsLabels("UNKNOWN_STAT");

    expect(result).toBeNull();
  });

  it("should return null for empty string", () => {
    const result = getStatsLabels("");

    expect(result).toBeNull();
  });

  it("should return null for invalid stat type", () => {
    const result = getStatsLabels("INVALID");

    expect(result).toBeNull();
  });
});

describe("buildPlayer", () => {
  it('should return "loading" status when participant is undefined', () => {
    const result = buildPlayer(undefined);
    expect(result).toEqual({ status: "loading" });
  });

  it('should return player with "loaded" status and name when participant is defined with a name', () => {
    const participant = { player: { name: "Marko Arnautovic" } };
    const result = buildPlayer(participant);
    expect(result).toEqual({ firstName: "Marko", lastName: "Arnautovic", status: "loaded" });
  });

  it("should return player with empty name when participant is defined but name is undefined", () => {
    const participant = { player: {} };
    const result = buildPlayer(participant);
    expect(result).toEqual({ firstName: "", lastName: "", status: "loaded" });
  });
});

describe("getStatsByIncidentType", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return null value when no stat is provided", () => {
    const result = getStatsByIncidentType(["SHOTS"], undefined);
    expect(result).toEqual([{ id: "SHOTS", label: "I18N.OBB.STATS.SHOTS", value: null }]);
  });

  it("should return null value when player has no matchesPlayed", () => {
    const stats = { matchesPlayed: 0, averages: { goals: 5, totalShots: 3 } };

    const result = getStatsByIncidentType(["SHOTS"], stats);
    expect(result).toEqual([{ id: "SHOTS", label: "I18N.OBB.STATS.SHOTS", value: null }]);
  });

  it("should return the correct value when stat is provided", () => {
    const stats = { matchesPlayed: 2, averages: { goals: 5, totalShots: 3 } };

    const result = getStatsByIncidentType(["GOALS"], stats);

    expect(result).toEqual([{ id: "GOALS", label: "I18N.OBB.STATS.GOALS", value: 5 }]);
  });
});

describe("getLegQuote", () => {
  describe("when is a ObbQuoteError", () => {
    const obbLeg = {
      quote: {
        typename: "ObbQuoteError",
        errorCode: "ERROR_CODE",
      },
    };
    it("should return an object of incident type indexed by the incident id", () => {
      const result = formatQuote(obbLeg.quote);
      expect(result).toEqual({ odds: null, quoteError: "ERROR_CODE" });
    });
  });
  describe("when is a ObbQuoteSuccess", () => {
    const obbLeg = {
      quote: {
        typename: "ObbQuoteSuccess",
        price: {
          decimal: "1.25",
        },
      },
    };
    it("should return an object of incident type indexed by the incident id", () => {
      const result = formatQuote(obbLeg.quote);
      expect(result).toEqual({ odds: "1.25" });
    });
  });
});

describe("buildUnquotedLegsForPvP", () => {
  const selectedParticipants = [
    {
      typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:36115/e/33731351",
      player: {
        id: "36115",
        name: "Player 36115",
        position: "FORWARD",
        seasonStats: {
          averages: {
            goals: 0.5,
            totalShots: 2,
            shotsOnTarget: 1,
            yellowRedCards: 2,
            redCards: 0,
            yellowCards: 0,
          },
        },
      },
      team: {
        name: "Manchester City",
      },
      stats: {
        status: "loaded",
        stats: ["Goals 0.5"],
      },
    },
    {
      typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:8301/e/33731351",
      player: {
        id: "8301",
        name: "Player 8301",
        position: "FORWARD",
        seasonStats: {
          averages: {
            goals: 0.5,
            totalShots: 2,
            shotsOnTarget: 1,
            yellowRedCards: 2,
            redCards: 0,
            yellowCards: 0,
          },
        },
      },
      team: {
        name: "Manchester City",
      },
      stats: {
        status: "loaded",
        stats: ["Goals 0.5"],
      },
    },
  ];

  const selectedLeg = {
    id: "selectedLegId",
    templateId: "playerVsPlayer",
    event: {
      urn: "eventUrn",
      name: "eventName",
      eventId: 123456,
    },
    templateParams: {
      outcomeId: "GOALS_TIME_ADJUSTED",
      timePeriodId: "MATCH",
    },
  };

  const participants = [
    {
      typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:36115/e/33731351",
      player: {
        id: "36115",
        name: "Player 36115",
        position: "FORWARD",
        seasonStats: {
          averages: {
            goals: 0.5,
            totalShots: 2,
            shotsOnTarget: 1,
            yellowRedCards: 2,
            redCards: 0,
            yellowCards: 0,
          },
        },
      },
      team: {
        name: "Manchester City",
      },
      stats: [
        {
          id: "GOALS",
          value: 0.5,
        },
      ],
    },
    {
      typename: "ObbFootballPlayer",
      urn: "ppb:obb:footballPlayer:8301/e/33731351",
      player: {
        id: "8301",
        name: "Player 8301",
        position: "FORWARD",
        seasonStats: {
          averages: {
            goals: 0.5,
            totalShots: 2,
            shotsOnTarget: 1,
            yellowRedCards: 2,
            redCards: 0,
            yellowCards: 0,
          },
        },
      },
      team: {
        name: "Manchester City",
      },
      stats: [
        {
          id: "GOALS",
          value: 0.5,
        },
      ],
    },
  ];

  const index = 0;

  it("should return the unquotedLegsForPvPPlayers", () => {
    const result = buildUnquotedLegsForPvP(selectedParticipants, selectedLeg, participants, index);

    expect(result).toEqual([
      {
        id: "d524b73865fc6370",
        templateId: "playerVsPlayer",
        event: {
          urn: "eventUrn",
          name: "eventName",
          eventId: 123456,
        },
        templateParams: {
          outcomeId: "GOALS_TIME_ADJUSTED",
          timePeriodId: "MATCH",
          participantIdA: "ppb:obb:footballPlayer:36115/e/33731351",
          participantIdB: "ppb:obb:footballPlayer:8301/e/33731351",
        },
      },
      {
        id: "1278997c2f43e550",
        templateId: "playerVsPlayer",
        event: {
          urn: "eventUrn",
          name: "eventName",
          eventId: 123456,
        },
        templateParams: {
          outcomeId: "GOALS_TIME_ADJUSTED",
          timePeriodId: "MATCH",
          participantIdA: "ppb:obb:footballPlayer:8301/e/33731351",
          participantIdB: "ppb:obb:footballPlayer:36115/e/33731351",
        },
      },
      {
        id: "a10ae448b4b92558",
        templateId: "playerVsPlayer",
        event: {
          urn: "eventUrn",
          name: "eventName",
          eventId: 123456,
        },
        templateParams: {
          outcomeId: "GOALS_TIME_ADJUSTED",
          timePeriodId: "MATCH",
          participantIdA: "ppb:obb:footballPlayer:8301/e/33731351",
          participantIdB: "ppb:obb:footballPlayer:8301/e/33731351",
        },
      },
      {
        id: "a10ae448b4b92558",
        templateId: "playerVsPlayer",
        event: {
          urn: "eventUrn",
          name: "eventName",
          eventId: 123456,
        },
        templateParams: {
          outcomeId: "GOALS_TIME_ADJUSTED",
          timePeriodId: "MATCH",
          participantIdA: "ppb:obb:footballPlayer:8301/e/33731351",
          participantIdB: "ppb:obb:footballPlayer:8301/e/33731351",
        },
      },
    ]);
  });
});

describe("isObbQuoteError", () => {
  it("should return true when quote is ObbQuoteError", () => {
    const errorQuote = {
      typename: "ErrorType",
      errorCode: "EVENT_NOT_FOUND",
      errorDetails: "Some details",
    };
    expect(isObbQuoteError(errorQuote)).toBe(true);
  });

  it("should return false when quote is ObbQuoteSuccess", () => {
    const successQuote = {
      typename: "SuccessType",
      price: {
        fractional: { numerator: 1, denominator: 2 },
        decimal: 1.5,
      },
    };
    expect(isObbQuoteError(successQuote)).toBe(false);
  });

  it("should return false when errorCode is not a string", () => {
    const invalidErrorQuote = {
      typename: "ErrorType",
      errorCode: 123,
      errorDetails: "Some details",
    };
    expect(isObbQuoteError(invalidErrorQuote)).toBe(false);
  });
});

describe("isCardDisabled", () => {
  it("should return true when errorCode is EVENT_NOT_FOUND", () => {
    expect(isCardDisabled(errorCodes.EVENT_NOT_FOUND)).toBe(true);
  });

  it("should return true when errorCode is BETTING_IN_PLAY_NOT_ALLOWED", () => {
    expect(isCardDisabled(errorCodes.BETTING_IN_PLAY_NOT_ALLOWED)).toBe(true);
  });

  it("should return false when errorCode is neither EVENT_NOT_FOUND nor BETTING_IN_PLAY_NOT_ALLOWED", () => {
    expect(isCardDisabled("SOME_OTHER_ERROR")).toBe(false);
  });

  it("should return false when errorCode is undefined", () => {
    expect(isCardDisabled(undefined)).toBe(false);
  });

  describe("splitName", () => {
    it("should return first name and last name when name is provided", () => {
      const name = "Erling Haaland";
      const result = splitName(name);
      expect(result).toEqual({ firstName: "Erling", lastName: "Haaland" });
    });

    it("should return empty first name and last name when name is undefined", () => {
      const name = undefined;
      const result = splitName(name);
      expect(result).toEqual({ firstName: "", lastName: "" });
    });

    it("should return the first name only when the name is only one word", () => {
      const name = "Savinho";
      const result = splitName(name);
      expect(result).toEqual({ firstName: "Savinho", lastName: "" });
    });
  });
});

describe("groupMoreInfoDetails", () => {
  it("should return an empty array when input is an empty array", () => {
    const result = groupMoreInfoDetails([]);
    expect(result).toEqual([]);
  });

  it("should skip null values in the input array", () => {
    const input = [null, null];
    const result = groupMoreInfoDetails(input);
    expect(result).toEqual([]);
  });

  it("should group RichText objects correctly", () => {
    const input = [
      { type: "heading1", text: "Heading 1" },
      { type: "paragraph", text: "Paragraph 1" },
      { type: "url_link", text: "Link 1" },
      { type: "paragraph", text: "Paragraph 2" },
    ];
    const result = groupMoreInfoDetails(input);
    expect(result).toEqual([
      [
        { type: "heading1", text: "Heading 1" },
        { type: "paragraph", text: "Paragraph 1" },
      ],
      [
        { type: "url_link", text: "Link 1" },
        { type: "paragraph", text: "Paragraph 2" },
      ],
    ]);
  });

  it("should handle mixed null and RichText values", () => {
    const input = [
      null,
      { type: "heading1", text: "Heading 1" },
      null,
      { type: "paragraph", text: "Paragraph 1" },
      null,
    ];
    const result = groupMoreInfoDetails(input);
    expect(result).toEqual([
      [
        { type: "heading1", text: "Heading 1" },
        { type: "paragraph", text: "Paragraph 1" },
      ],
    ]);
  });

  it("should group consecutive RichText objects correctly", () => {
    const input = [
      { type: "paragraph", text: "Paragraph 1" },
      { type: "paragraph", text: "Paragraph 2" },
      { type: "paragraph", text: "Paragraph 3" },
    ];
    const result = groupMoreInfoDetails(input);
    expect(result).toEqual([
      [
        { type: "paragraph", text: "Paragraph 1" },
        { type: "paragraph", text: "Paragraph 2" },
        { type: "paragraph", text: "Paragraph 3" },
      ],
    ]);
  });
});

describe("formatName", () => {
  it("should return empty string when fullName is undefined or null", () => {
    expect(formatName(undefined)).toBe("");
    expect(formatName(null)).toBe("");
  });

  it("should return the full name when it consists of only one part", () => {
    expect(formatName("Ronaldo")).toBe("Ronaldo");
  });

  it("should format the name with first initial followed by period and rest of the name", () => {
    expect(formatName("Cristiano Ronaldo")).toBe("C. Ronaldo");
    expect(formatName("Kevin De Bruyne")).toBe("K. De Bruyne");
  });

  it("should handle names with extra whitespace", () => {
    expect(formatName("   Lionel    Messi   ")).toBe("L. Messi");
  });
});

describe("getMicroPlayerBorderRadius", () => {
  it("should return 'middle' when there is only one participant", () => {
    const result = getMicroPlayerBorderRadius(0, 1);
    expect(result).toBe("middle");
  });

  it("should return 'first' when the index is 0 and there are multiple participants", () => {
    const result = getMicroPlayerBorderRadius(0, 3);
    expect(result).toBe("first");
  });

  it("should return 'last' when the index is the last participant", () => {
    const result = getMicroPlayerBorderRadius(2, 3);
    expect(result).toBe("last");
  });

  it("should return undefined for participants in the middle of the list", () => {
    const result = getMicroPlayerBorderRadius(1, 3);
    expect(result).toBeUndefined();
  });

  it("should return undefined when there are no participants", () => {
    const result = getMicroPlayerBorderRadius(3, 2);
    expect(result).toBeUndefined();
  });
});

describe("getSquadBetParticipantName", () => {
  it("should return firstName and lastName when participant status is 'loaded' and both names are present", () => {
    const participant = {
      status: "loaded",
      firstName: "John",
      lastName: "Doe",
    };

    const result = getSquadBetParticipantName(participant);
    expect(result).toEqual({ firstName: "John", lastName: "Doe" });
  });

  it("should return undefined for firstName and lastName as firstName when lastName is missing", () => {
    const participant = {
      status: "loaded",
      firstName: "John",
      lastName: undefined,
    };

    const result = getSquadBetParticipantName(participant);
    expect(result).toEqual({ firstName: undefined, lastName: "John" });
  });

  it("should return undefined for both firstName and lastName when participant status is not 'loaded'", () => {
    const participant = {
      status: "loading",
      firstName: "John",
      lastName: "Doe",
    };

    const result = getSquadBetParticipantName(participant);
    expect(result).toEqual({ firstName: undefined, lastName: undefined });
  });

  it("should handle empty participant object gracefully", () => {
    const participant = {
      status: "loaded",
      firstName: undefined,
      lastName: undefined,
    };

    const result = getSquadBetParticipantName(participant);
    expect(result).toEqual({ firstName: undefined, lastName: undefined });
  });
});

describe("getSquadAverageStatByIncidentType", () => {
  describe("if squad is empty", () => {
    it("should return null", () => {
      expect(getSquadAverageStatByIncidentType([], "GOALS")).toBeNull();
    });
  });

  describe("if participant has valid seasonStats", () => {
    it("should return null", () => {
      const squad = [{ player: { seasonStats: null } }, { player: { seasonStats: null } }];
      expect(getSquadAverageStatByIncidentType(squad, "GOALS")).toBeNull();
    });
  });

  describe("if participants do not have any matchesPlayed", () => {
    it("should return null", () => {
      const squad = [
        { player: { seasonStats: { matchesPlayed: 0, averages: { goals: 2 } } } },
        { player: { seasonStats: { matchesPlayed: 0, averages: { goals: 3 } } } },
      ];
      expect(getSquadAverageStatByIncidentType(squad, "GOALS")).toBeNull();
    });
  });

  describe("if a player has valid seasonStats but other does not", () => {
    it("should return the average stat", () => {
      const squad = [
        { player: { seasonStats: { matchesPlayed: 2, averages: { goals: 2 } } } },
        { player: { seasonStats: null } },
      ];
      expect(getSquadAverageStatByIncidentType(squad, "GOALS")).toBe("2.0");
    });
  });
});

describe("formatPlayerStat", () => {
  it("formats a regular number", () => {
    expect(formatPlayerStat(5)).toBe("5.0");
  });

  it("formats a decimal number", () => {
    expect(formatPlayerStat(3.456)).toBe("3.5");
  });

  it("formats zero", () => {
    expect(formatPlayerStat(0)).toBe("0.0");
  });

  it("formats null as 0.00", () => {
    expect(formatPlayerStat(null)).toBe("0.0");
  });

  it("formats negative numbers correctly", () => {
    expect(formatPlayerStat(-2.1)).toBe("-2.1");
  });
});

describe("buildMicroPlayerVm", () => {
  it("should build micro player view model with loaded players", () => {
    const participants = [
      {
        status: "loaded",
        firstName: "John",
        lastName: "Doe",
        jersey: "jersey1.jpg",
      },
      {
        status: "loaded",
        firstName: "Jane",
        lastName: "Smith",
        jersey: "jersey2.jpg",
      },
    ];

    const result = buildMicroPlayerVm(participants);

    expect(result).toEqual({
      jerseys: ["jersey1.jpg", "jersey2.jpg"],
      players: [
        { firstName: "John", lastName: "Doe" },
        { firstName: "Jane", lastName: "Smith" },
      ],
    });
  });

  it("should filter out loading players", () => {
    const participants = [
      {
        status: "loading",
        firstName: "John",
        lastName: "Doe",
        jersey: "jersey1.jpg",
      },
      {
        status: "loaded",
        firstName: "Jane",
        lastName: "Smith",
        jersey: "jersey2.jpg",
      },
    ];

    const result = buildMicroPlayerVm(participants);

    expect(result).toEqual({
      jerseys: ["jersey2.jpg"],
      players: [{ firstName: "Jane", lastName: "Smith" }],
    });
  });

  it("should handle players with undefined lastName", () => {
    const participants = [
      {
        status: "loaded",
        firstName: "John",
        lastName: undefined,
        jersey: "jersey1.jpg",
      },
    ];

    const result = buildMicroPlayerVm(participants);

    expect(result).toEqual({
      jerseys: ["jersey1.jpg"],
      players: [{ firstName: "John", lastName: "" }],
    });
  });

  it("should return empty arrays when no loaded players", () => {
    const participants = [
      {
        status: "loading",
        firstName: "John",
        lastName: "Doe",
        jersey: "jersey1.jpg",
      },
    ];

    const result = buildMicroPlayerVm(participants);

    expect(result).toEqual({
      jerseys: [],
      players: [],
    });
  });

  it("should handle empty participants array", () => {
    const participants = [];

    const result = buildMicroPlayerVm(participants);

    expect(result).toEqual({
      jerseys: [],
      players: [],
    });
  });
});

describe("getContextualStatsText", () => {
  it("should return cardStatsLabel when provided", () => {
    const result = getContextualStatsText("Custom Stats Label", "GOALS");
    expect(result).toBe("Custom Stats Label");
  });

  it("should return default stats text when cardStatsLabel is undefined", () => {
    const result = getContextualStatsText(undefined, "GOALS");
    expect(result).toBe("I18N.OBB.SQUAD_VS_SQUAD.DEFAULT_STATS.LABEL");
  });

  it("should return default stats text when cardStatsLabel is empty string", () => {
    const result = getContextualStatsText("", "SHOTS");
    expect(result).toBe("I18N.OBB.SQUAD_VS_SQUAD.DEFAULT_STATS.LABEL");
  });

  it("should handle different incident types", () => {
    const result = getContextualStatsText(undefined, "ASSISTS");
    expect(result).toBe("I18N.OBB.SQUAD_VS_SQUAD.DEFAULT_STATS.LABEL");
  });
});

describe("isToRemoveObbStatsLabel", () => {
  it("should return true when experiment variant is 'exp-variant-without-stats-label'", () => {
    const experiment = {
      variant: "exp-variant-without-stats-label",
    };

    const result = isToRemoveObbStatsLabel(experiment);
    expect(result).toBe(true);
  });

  it("should return false when experiment variant is different", () => {
    const experiment = {
      variant: "exp-variant-with-stats-label",
    };

    const result = isToRemoveObbStatsLabel(experiment);
    expect(result).toBe(false);
  });

  it("should return false when experiment is undefined", () => {
    const result = isToRemoveObbStatsLabel(undefined);
    expect(result).toBe(false);
  });

  it("should return false when experiment variant is undefined", () => {
    const experiment = {};

    const result = isToRemoveObbStatsLabel(experiment);
    expect(result).toBe(false);
  });

  it("should return false when experiment is null", () => {
    const result = isToRemoveObbStatsLabel(null);
    expect(result).toBe(false);
  });
});

describe("isCombinedPotentialBet", () => {
  it("should return true when a leg has baseBets in params", () => {
    const potentialBetLegs = [
      {
        params: {
          baseBets: ["bet1", "bet2"],
        },
      },
      {
        params: {
          someOtherParam: "value",
        },
      },
    ];

    const result = isCombinedPotentialBet(potentialBetLegs);
    expect(result).toBe(true);
  });

  it("should return false when no legs have baseBets in params", () => {
    const potentialBetLegs = [
      {
        params: {
          someParam: "value1",
        },
      },
      {
        params: {
          someOtherParam: "value2",
        },
      },
    ];

    const result = isCombinedPotentialBet(potentialBetLegs);
    expect(result).toBe(false);
  });

  it("should return false when legs array is empty", () => {
    const potentialBetLegs = [];

    const result = isCombinedPotentialBet(potentialBetLegs);
    expect(result).toBe(false);
  });

  it("should return true when all legs have baseBets", () => {
    const potentialBetLegs = [
      {
        params: {
          baseBets: ["bet1", "bet2"],
        },
      },
      {
        params: {
          baseBets: ["bet3", "bet4"],
        },
      },
    ];

    const result = isCombinedPotentialBet(potentialBetLegs);
    expect(result).toBe(true);
  });

  it("should handle single leg with baseBets", () => {
    const potentialBetLegs = [
      {
        params: {
          baseBets: ["bet1"],
        },
      },
    ];

    const result = isCombinedPotentialBet(potentialBetLegs);
    expect(result).toBe(true);
  });
});

describe("hasSameBaseBets", () => {
  it("should return true when both bets have legs with identical baseBets", () => {
    const potentialBetLegs = [
      {
        params: {
          baseBets: ["bet1", "bet2", "bet3"],
        },
      },
    ];

    const multipleLegs = [
      {
        params: {
          baseBets: ["bet1", "bet2", "bet3"],
        },
      },
    ];

    const result = hasSameBaseBets(potentialBetLegs, multipleLegs);
    expect(result).toBe(true);
  });

  it("should return false when baseBets are different", () => {
    const potentialBetLegs = [
      {
        params: {
          baseBets: ["bet1", "bet2"],
        },
      },
    ];

    const multipleLegs = [
      {
        params: {
          baseBets: ["bet3", "bet4"],
        },
      },
    ];

    const result = hasSameBaseBets(potentialBetLegs, multipleLegs);
    expect(result).toBe(false);
  });

  it("should return false when one array is empty", () => {
    const potentialBetLegs = [];
    const multipleLegs = [
      {
        params: {
          baseBets: ["bet1"],
        },
      },
    ];

    const result = hasSameBaseBets(potentialBetLegs, multipleLegs);
    expect(result).toBe(false);
  });

  it("should return false when both arrays are empty", () => {
    const potentialBetLegs = [];
    const multipleLegs = [];

    const result = hasSameBaseBets(potentialBetLegs, multipleLegs);
    expect(result).toBe(false);
  });

  it("should return true when baseBets match with different order", () => {
    const potentialBetLegs = [
      {
        params: {
          baseBets: ["bet1", "bet2", "bet3"],
        },
      },
    ];

    const multipleLegs = [
      {
        params: {
          baseBets: ["bet3", "bet2", "bet1"],
        },
      },
    ];

    const result = hasSameBaseBets(potentialBetLegs, multipleLegs);
    expect(result).toBe(true);
  });

  it("should handle multiple legs in each bet", () => {
    const potentialBetLegs = [
      {
        params: {
          baseBets: ["bet1", "bet2"],
        },
      },
      {
        params: {
          baseBets: ["bet5", "bet6"],
        },
      },
    ];

    const multipleLegs = [
      {
        params: {
          baseBets: ["bet1", "bet2"],
        },
      },
      {
        params: {
          baseBets: ["bet7", "bet8"],
        },
      },
    ];

    const result = hasSameBaseBets(potentialBetLegs, multipleLegs);
    expect(result).toBe(true);
  });

  it("should return false when params do not have baseBets property", () => {
    const potentialBetLegs = [
      {
        params: {
          someOtherProperty: "value",
        },
      },
    ];

    const multipleLegs = [
      {
        params: {
          baseBets: ["bet1"],
        },
      },
    ];

    const result = hasSameBaseBets(potentialBetLegs, multipleLegs);
    expect(result).toBe(false);
  });

  it("should return true when at least one leg matches", () => {
    const potentialBetLegs = [
      {
        params: {
          baseBets: ["bet1", "bet2"],
        },
      },
      {
        params: {
          baseBets: ["bet3", "bet4"],
        },
      },
    ];

    const multipleLegs = [
      {
        params: {
          baseBets: ["bet5", "bet6"],
        },
      },
      {
        params: {
          baseBets: ["bet1", "bet2"],
        },
      },
    ];

    const result = hasSameBaseBets(potentialBetLegs, multipleLegs);
    expect(result).toBe(true);
  });
});

describe("buildObbLegDescription", () => {
  describe("participantsCombined template", () => {
    it("should return participants combined leg description", () => {
      const leg = {
        templateId: "participantsCombined",
        templateParams: {
          participantIds: [
            { player: { name: "Player A" } },
            { player: { name: "Player B" } },
            { player: { name: "Player C" } },
          ],
          outcomeIds: ["GOALS_TIME_ADJUSTED"],
          quantifier: "AT_LEAST",
          value: 3,
        },
      };

      const result = buildObbLegDescription(leg);

      expect(result).toMatchObject({
        legDescription: expect.stringContaining("Player A, Player B & Player C"),
        participantsDescription: "Player A, Player B & Player C",
        outcomeDescription: expect.any(String),
      });
    });

    it("should return null when templateParams is undefined", () => {
      const leg = {
        templateId: "participantsCombined",
        templateParams: undefined,
      };

      const result = buildObbLegDescription(leg);

      expect(result).toBeNull();
    });

    it("should return null when templateParams is null", () => {
      const leg = {
        templateId: "participantsCombined",
        templateParams: null,
      };

      const result = buildObbLegDescription(leg);

      expect(result).toBeNull();
    });
  });

  describe("squadVsSquad template", () => {
    it("should return squad vs squad leg description", () => {
      const leg = {
        templateId: "squadVsSquad",
        templateParams: {
          squadAParticipantIds: [{ player: { name: "Player A" } }, { player: { name: "Player B" } }],
          squadBParticipantIds: [{ player: { name: "Player C" } }, { player: { name: "Player D" } }],
          quantifier: "GREATER_THAN",
          outcomeIds: ["GOALS_TIME_ADJUSTED"],
        },
      };

      const result = buildObbLegDescription(leg);

      expect(result).toMatchObject({
        legDescription: expect.stringContaining("Player A & Player B"),
        participantsDescription: "Player A & Player B",
        outcomeDescription: expect.any(String),
      });
    });

    it("should return null when templateParams is undefined", () => {
      const leg = {
        templateId: "squadVsSquad",
        templateParams: undefined,
      };

      const result = buildObbLegDescription(leg);

      expect(result).toBeNull();
    });

    it("should return null when templateParams is null", () => {
      const leg = {
        templateId: "squadVsSquad",
        templateParams: null,
      };

      const result = buildObbLegDescription(leg);

      expect(result).toBeNull();
    });
  });

  describe("playerVsPlayer template", () => {
    it("should return player vs player leg description", () => {
      const leg = {
        templateId: "playerVsPlayer",
        templateParams: {
          outcomeId: "GOALS_TIME_ADJUSTED",
          participantIdA: { player: { name: "Player A" } },
          participantIdB: { player: { name: "Player B" } },
        },
      };

      const result = buildObbLegDescription(leg);

      expect(result).toMatchObject({
        legDescription: expect.stringContaining("Player A"),
        participantsDescription: "Player A",
        outcomeDescription: expect.any(String),
      });
    });

    it("should return null when templateParams is undefined", () => {
      const leg = {
        templateId: "playerVsPlayer",
        templateParams: undefined,
      };

      const result = buildObbLegDescription(leg);

      expect(result).toBeNull();
    });

    it("should return null when templateParams is null", () => {
      const leg = {
        templateId: "playerVsPlayer",
        templateParams: null,
      };

      const result = buildObbLegDescription(leg);

      expect(result).toBeNull();
    });
  });

  describe("unknown template", () => {
    it("should return null for unknown template", () => {
      const leg = {
        templateId: "unknownTemplate",
        templateParams: {},
      };

      const result = buildObbLegDescription(leg);

      expect(result).toBeNull();
    });
  });
});

describe("buildObbAvgStatsDescription", () => {
  describe("participantsCombined template", () => {
    it("should return stats description with valid participants and outcome", () => {
      const leg = {
        templateId: "participantsCombined",
        templateParams: {
          outcomeIds: ["GOALS_TIME_ADJUSTED"],
        },
      };

      const participants = [
        {
          player: {
            name: "Player A",
            seasonStats: {
              matchesPlayed: 10,
              averages: {
                goals: 0.5,
                totalShots: 2,
                shotsOnTarget: 1,
              },
            },
          },
        },
        {
          player: {
            name: "Player B",
            seasonStats: {
              matchesPlayed: 10,
              averages: {
                goals: 0.8,
                totalShots: 3,
                shotsOnTarget: 2,
              },
            },
          },
        },
      ];

      const result = buildObbAvgStatsDescription(leg, participants);

      expect(result).toContain("1.3");
      expect(result).toContain("Stats:");
    });

    it("should return null when participants have no valid stats", () => {
      const leg = {
        templateId: "participantsCombined",
        templateParams: {
          outcomeIds: ["GOALS_TIME_ADJUSTED"],
        },
      };

      const participants = [
        {
          player: {
            name: "Player A",
            seasonStats: {
              matchesPlayed: 0,
              averages: {},
            },
          },
        },
      ];

      const result = buildObbAvgStatsDescription(leg, participants);

      expect(result).toBeNull();
    });

    it("should return null when outcome has no incident mapping", () => {
      const leg = {
        templateId: "participantsCombined",
        templateParams: {
          outcomeIds: ["UNKNOWN_OUTCOME"],
        },
      };

      const participants = [
        {
          player: {
            name: "Player A",
            seasonStats: {
              matchesPlayed: 10,
              averages: {
                goals: 0.5,
              },
            },
          },
        },
      ];

      const result = buildObbAvgStatsDescription(leg, participants);

      expect(result).toBeNull();
    });
  });

  describe("squadVsSquad template", () => {
    it("should return null for squadVsSquad template", () => {
      const leg = {
        templateId: "squadVsSquad",
        templateParams: {},
      };

      const participants = [];

      const result = buildObbAvgStatsDescription(leg, participants);

      expect(result).toBeNull();
    });
  });

  describe("playerVsPlayer template", () => {
    it("should return stats description for both players", () => {
      const leg = {
        templateId: "playerVsPlayer",
        templateParams: {
          outcomeId: "GOALS_TIME_ADJUSTED",
          participantIdA: {
            player: {
              name: "John Player",
              seasonStats: {
                matchesPlayed: 10,
                averages: {
                  goals: 0.5,
                },
              },
            },
          },
          participantIdB: {
            player: {
              name: "Jane Athlete",
              seasonStats: {
                matchesPlayed: 10,
                averages: {
                  goals: 0.8,
                },
              },
            },
          },
        },
      };

      const result = buildObbAvgStatsDescription(leg, []);

      expect(result).toContain("Stats:");
      expect(result).toContain("J. Player: 0.5");
      expect(result).toContain("J. Athlete: 0.8");
    });

    it("should handle players without names", () => {
      const leg = {
        templateId: "playerVsPlayer",
        templateParams: {
          outcomeId: "GOALS_TIME_ADJUSTED",
          participantIdA: {
            player: {
              name: null,
              seasonStats: {
                matchesPlayed: 10,
                averages: {
                  goals: 0.5,
                },
              },
            },
          },
          participantIdB: {
            player: {
              name: "Jane Athlete",
              seasonStats: {
                matchesPlayed: 10,
                averages: {
                  goals: 0.8,
                },
              },
            },
          },
        },
      };

      const result = buildObbAvgStatsDescription(leg, []);

      expect(result).toContain("J. Athlete: 0.8");
      expect(result).not.toContain("null");
    });

    it("should handle players without season stats", () => {
      const leg = {
        templateId: "playerVsPlayer",
        templateParams: {
          outcomeId: "GOALS_TIME_ADJUSTED",
          participantIdA: {
            player: {
              name: "John Player",
              seasonStats: null,
            },
          },
          participantIdB: {
            player: {
              name: "Jane Athlete",
              seasonStats: {
                matchesPlayed: 10,
                averages: {
                  goals: 0.8,
                },
              },
            },
          },
        },
      };

      const result = buildObbAvgStatsDescription(leg, []);

      expect(result).toContain("J. Player: 0.0");
      expect(result).toContain("J. Athlete: 0.8");
    });

    it("should return null when outcome has no incident mapping", () => {
      const leg = {
        templateId: "playerVsPlayer",
        templateParams: {
          outcomeId: "UNKNOWN_OUTCOME",
          participantIdA: {
            player: {
              name: "John Player",
              seasonStats: {
                matchesPlayed: 10,
                averages: {
                  goals: 0.5,
                },
              },
            },
          },
          participantIdB: {
            player: {
              name: "Jane Athlete",
              seasonStats: {
                matchesPlayed: 10,
                averages: {
                  goals: 0.8,
                },
              },
            },
          },
        },
      };

      const result = buildObbAvgStatsDescription(leg, []);

      expect(result).toBeNull();
    });
  });

  describe("unknown template", () => {
    it("should return null for unknown template", () => {
      const leg = {
        templateId: "unknownTemplate",
        templateParams: {},
      };

      const participants = [];

      const result = buildObbAvgStatsDescription(leg, participants);

      expect(result).toBeNull();
    });
  });
});

describe("buildObbBetButtonSecondaryLabel", () => {
  describe("when is a participantsCombined leg", () => {
    it("should return the correct secondary label", () => {
      mapQuantifierEnumToSymbol.mockReturnValue("+");

      const leg = {
        templateId: "participantsCombined",
        templateParams: {
          participantIds: [{ player: { name: "Player A" } }, { player: { name: "Player B" } }],
          outcomeIds: ["GOALS_TIME_ADJUSTED"],
          quantifier: "AT_LEAST",
          value: 2,
        },
      };

      const result = buildObbBetButtonSecondaryLabel(leg.templateId, leg.templateParams);

      expect(result).toBe("2+");
    });

    describe("Bet buttons simplification experiment", () => {
      it("should return the expanded secondary label when showSquadBetExtendedLabelExperiment is true", () => {
        mapQuantifierEnumToSymbol.mockReturnValue("+");

        const leg = {
          templateId: "participantsCombined",
          templateParams: {
            participantIds: [{ player: { name: "Player A" } }, { player: { name: "Player B" } }],
            outcomeIds: ["GOALS_TIME_ADJUSTED"],
            quantifier: "AT_LEAST",
            value: 2,
          },
        };

        buildObbBetButtonSecondaryLabel(leg.templateId, leg.templateParams, true);

        expect(i18n).toHaveBeenCalledWith({
          interpolationValues: { value: 2 },
          key: "I18N.OBB.SQUADBET.BET_BUTTON.EXTENDED_LABEL",
        });
      });
    });
  });

  describe("when is a playerVsPlayer leg", () => {
    it("should return the correct secondary label", () => {
      const leg = {
        templateId: "playerVsPlayer",
        templateParams: {
          participantIdA: { player: { name: "Player A" } },
          participantIdB: { player: { name: "Player B" } },
          outcomeId: "GOALS_TIME_ADJUSTED",
          timePeriodId: "MATCH",
        },
      };

      const result = buildObbBetButtonSecondaryLabel(leg.templateId, leg.templateParams, false);

      expect(result).toBe("P. A");
    });
  });

  describe("when is a squadVsSquad leg", () => {
    it("should return the correct secondary label", () => {
      const leg = {
        templateId: "squadVsSquad",
        templateParams: {
          squadAParticipantIds: [{ player: { name: "Player A" } }, { player: { name: "Player B" } }],
          squadBParticipantIds: [{ player: { name: "Player C" } }, { player: { name: "Player D" } }],
          outcomeIds: ["GOALS_TIME_ADJUSTED"],
          timePeriodId: "MATCH",
          quantifier: "GREATER_THAN",
        },
      };

      const result = buildObbBetButtonSecondaryLabel(leg.templateId, leg.templateParams, false);

      expect(result).toBe("I18N.OBB.SQUAD_VS_SQUAD.BET_BUTTON.LABEL 1");
    });
  });
});
