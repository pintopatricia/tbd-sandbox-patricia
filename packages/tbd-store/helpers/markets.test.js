import {
  doesMarketHierarchyHaveRace,
  getRaceRunnerDetails,
  isExchangeMarket,
  isRaceHierarchy,
  isCompetitionEventHierarchy,
  isEventHierarchy,
  isSportsbookMarket,
  isRaceMarket,
  getMarketRunnersByDisplayRunners,
} from "./markets";

describe("markets helpers", () => {
  describe("isSportsbookMarket", () => {
    it("should return true when the market provided is sportsbook", () => {
      expect(isSportsbookMarket("ppb:sbkMarket:12345")).toBe(true);
    });

    it("should return false when the market provided is not sportsbook", () => {
      expect(isSportsbookMarket("ppb:excMarket:12345")).toBe(false);
    });
  });

  describe("isExchangeMarket", () => {
    it("should return true when the market provided is exchange", () => {
      expect(isExchangeMarket("ppb:excMarket:12345")).toBe(true);
    });

    it("should return false when the market provided is not exchange", () => {
      expect(isExchangeMarket("ppb:sbkMarket:12345")).toBe(false);
    });
  });

  describe("doesMarketHierarchyHaveRace", () => {
    const eventCompetitionHierarchy = { competition: "URN", sportevent: "URN" };
    const raceHierarchy = { meeting: "URN", race: "URN" };

    it("should return true when the market hierarchy has race property", () => {
      expect(doesMarketHierarchyHaveRace(raceHierarchy)).toBe(true);
    });

    it("should return false when the market hierarchy hasn't race property", () => {
      expect(doesMarketHierarchyHaveRace(eventCompetitionHierarchy)).toBe(false);
    });
  });

  describe("isRaceHierachy", () => {
    it("should return false when the market hierarchy has only a race", () => {
      expect(isRaceHierarchy({ race: "URN" })).toBe(false);
    });

    it("should return false when the market hierarchy has only a meeting", () => {
      expect(isRaceHierarchy({ meeting: "URN" })).toBe(false);
    });

    it("should return true when the market hierarchy has meeting & race", () => {
      expect(isRaceHierarchy({ meeting: "URN", race: "URN" })).toBe(true);
    });
  });

  describe("isCompetitionEventHierarchy", () => {
    it("should return false when there is no competition/event hierarchy", () => {
      expect(isCompetitionEventHierarchy({})).toBe(false);
    });

    it("should return false when there is only event hierarchy", () => {
      expect(isCompetitionEventHierarchy({ sportevent: "URN" })).toBe(false);
    });

    it("should return false when there is only competition hierarchy", () => {
      expect(isCompetitionEventHierarchy({ competition: "URN" })).toBe(false);
    });

    it("should return true when there is competition and event hierarchy", () => {
      expect(isCompetitionEventHierarchy({ sportevent: "URN", competition: "URN" })).toBe(true);
    });
  });

  describe("isEventHierarchy", () => {
    it("should return false when there is no competition/event hierarchy", () => {
      expect(isEventHierarchy({})).toBe(false);
    });

    it("should return true when there is only event hierarchy", () => {
      expect(isEventHierarchy({ sportevent: "URN" })).toBe(true);
    });

    it("should return false when there is only competition hierarchy", () => {
      expect(isEventHierarchy({ competition: "URN" })).toBe(false);
    });

    it("should return false when there is competition and event hierarchy", () => {
      expect(isEventHierarchy({ sportevent: "URN", competition: "URN" })).toBe(false);
    });
  });

  describe("isRaceMarket", () => {
    it("should return true when the market hierarchy has a race and a meeting", () => {
      const market = {
        urn: "marketUrn",
        hierarchy: { race: "raceUrn", meeting: "meetingUrn" },
      };
      expect(isRaceMarket(market)).toBe(true);
    });

    it("should return false when the market hasn't the hierarchy", () => {
      const market = {
        urn: "marketUrn",
      };
      expect(isRaceMarket(market)).toBe(false);
    });

    it("should return false when the market hierarchy hasn't a meeting or a race", () => {
      const market = {
        urn: "marketUrn",
        hierarchy: { race: "raceUrn" },
      };
      expect(isRaceMarket(market)).toBe(false);
    });
  });

  describe("getRaceRunnerDetails", () => {
    const raceUrn = "ppb:race:1.14.1200228.1";
    const runnerUrn = "ppb:sbkRunner:924.230553342/24550116";
    const market = {
      status: "OPEN",
      inplay: false,
      marketType: "WIN",

      marketId: "111111.111",
      urn: "dummyMarketUrn",
      sport: "dummySportUrn",
      name: "dummy name",
      runners: [runnerUrn],
    };

    const raceRunners = {
      "ppb:tbd:raceRunner:1.14.1200228.1/123": {
        urn: "ppb:tbd:raceRunner:1.14.1200228.1/123",
        selectionId: 123,
        details: {
          trainerName: "",
          jockeyName: "Brian Hughes",
          saddleCloth: 8,
          silk: "http://tbdui.qa.internal/images/silk.png",
          draw: 0,
        },
        horse: {
          name: "VOLT FACE (FR)",
          sirName: "",
          damName: "",
          damSirName: "",
          age: 4,
          color: "",
          sex: "",
        },
        form: 2257,
      },
    };

    describe("when it is a race market", () => {
      const raceMarket = { ...market, hierarchy: { meeting: "URN", race: raceUrn } };

      it("should return race runner details", () => {
        expect(getRaceRunnerDetails(raceMarket, raceRunners, 123)).toStrictEqual({
          saddleCloth: 8,
          draw: 0,
          horseName: "VOLT FACE (FR)",
          jockeyName: "Brian Hughes",
          silk: "http://tbdui.qa.internal/images/silk.png",
          trainerName: "",
          form: 2257,
        });
      });
    });

    describe("when it isn't a race market", () => {
      const notRaceMarket = { ...market, hierarchy: { competition: "URN", sportevent: "URN" } };

      it("should return an empty object", () => {
        expect(getRaceRunnerDetails(notRaceMarket, raceRunners, 123)).toStrictEqual({});
      });
    });
  });

  describe("getMarketRunnersByDisplayRunners", () => {
    const marketRunners = [{ urn: "runner2Urn" }, { urn: "runner1Urn" }];
    const displayRunners = ["runner1Urn", "runner2Urn"];

    describe("when displayRunners is not empty", () => {
      it("should return marketRunners with displayRunners order", () => {
        expect(getMarketRunnersByDisplayRunners(marketRunners, displayRunners)).toStrictEqual([
          { urn: "runner1Urn" },
          { urn: "runner2Urn" },
        ]);
      });
    });

    describe("when displayRunners is empty", () => {
      it("should return an empty array", () => {
        expect(getMarketRunnersByDisplayRunners(marketRunners, [])).toStrictEqual([]);
      });
    });

    describe("when marketRunners is empty", () => {
      it("should return an empty array", () => {
        expect(getMarketRunnersByDisplayRunners([], displayRunners)).toStrictEqual([]);
      });
    });
  });
});
