import SportsContentAPIClient from "../clients/sca/sports-content-api-client";
import SportsContentAPIService from "./sports-content-api-service";
import {
  mapAmericanFootballFixtureUpdates,
  mapBaseballFixtureUpdates,
  mapBasketballFixtureUpdates,
  mapFootballFixtureUpdates,
  mapTableTennisFixtureUpdates,
  mapTennisFixtureUpdates,
  mapRacesStatusAndResultTypeUpdates,
  mapCricketFixtureUpdates,
  mapIceHockeyFixtureUpdates,
  mapRugbyUnionFixtureUpdates,
  mapRugbyLeagueFixtureUpdates,
  mapSnookerFixtureUpdates,
  mapVolleyballFixtureUpdates,
  mapAustralianRulesFixtureUpdates,
  mapDartsFixtureUpdates,
} from "./sports-content-api-service-mapper";

const getScaUpdatesSpy = SportsContentAPIClient().getScaUpdates;

jest.mock("../clients/sca/sports-content-api-client", () => {
  const getScaUpdates = jest.fn(() => Promise.resolve("clientResponse"));

  return jest.fn().mockReturnValue({
    getScaUpdates,
  });
});

jest.mock("./client-factory", () => ({
  createClientFactory: jest.fn(() => SportsContentAPIClient),
}));

jest.mock("./sports-content-api-service-mapper", () => ({
  mapAmericanFootballFixtureUpdates: jest.fn(() => "americanFootballFixtureUpdates"),
  mapBaseballFixtureUpdates: jest.fn(() => "baseballFixtureUpdates"),
  mapBasketballFixtureUpdates: jest.fn(() => "basketballFixtureUpdates"),
  mapCricketFixtureUpdates: jest.fn(() => "cricketFixtureUpdates"),
  mapFootballFixtureUpdates: jest.fn(() => "footballFixtureUpdates"),
  mapRacesStatusAndResultTypeUpdates: jest.fn(() => "racesStatusAndResultTypeUpdates"),
  mapTableTennisFixtureUpdates: jest.fn(() => "tableTennisFixtureUpdates"),
  mapTennisFixtureUpdates: jest.fn(() => "tennisFixtureUpdates"),
  mapIceHockeyFixtureUpdates: jest.fn(() => "iceHockeyFixtureUpdates"),
  mapRugbyUnionFixtureUpdates: jest.fn(() => "rugbyUnionFixtureUpdates"),
  mapRugbyLeagueFixtureUpdates: jest.fn(() => "rugbyLeagueFixtureUpdates"),
  mapSnookerFixtureUpdates: jest.fn(() => "snookerFixtureUpdates"),
  mapVolleyballFixtureUpdates: jest.fn(() => "volleyballFixtureUpdates"),
  mapAustralianRulesFixtureUpdates: jest.fn(() => "australianRulesFixtureUpdates"),
  mapDartsFixtureUpdates: jest.fn(() => "dartsFixtureUpdates"),
}));

describe("SportsContentAPIService", () => {
  describe("API", () => {
    it("should expose a getScaUpdates method", () => {
      expect(SportsContentAPIService.getScaUpdates).toBeDefined();
    });
  });

  describe("Behaviour", () => {
    describe("getScaUpdates", () => {
      let result;
      beforeAll(async () => {
        result = await SportsContentAPIService.getScaUpdates({
          americanFootballUrns: ["ppb:fixture:838383"],
          baseballUrns: ["ppb:fixture:123456"],
          basketballUrns: [],
          cricketUrns: ["ppb:fixture:987654"],
          footballUrns: ["ppb:fixture:12345"],
          tableTennisUrns: ["ppb:fixture:919191"],
          tennisUrns: ["ppb:fixture:67890"],
          raceUrns: ["ppb:race:12345"],
          iceHockeyUrns: ["ppb:fixture:929292"],
          rugbyUnionUrns: ["ppb:fixture:33333"],
          rugbyLeagueUrns: ["ppb:fixture:44444"],
          snookerUrns: ["ppb:fixture:949494"],
          volleyballUrns: ["ppb:fixture:55555"],
          australianRulesUrns: ["ppb:fixture:345562"],
          dartsUrns: ["ppb:fixture:555551"],
          isLite: false,
          includeStats: true,
          includePlayers: true,
          footballPlayerIds: ["playerA"],
          includePlayerStats: true,
          includeSubstitutions: false,
        });
      });

      it("should call SportsContentAPIClient with the valid event/race ids", () => {
        expect(getScaUpdatesSpy).toHaveBeenCalledWith({
          americanFootballEventIds: ["838383"],
          baseballEventIds: ["123456"],
          basketballEventIds: [],
          cricketEventIds: ["987654"],
          footballEventIds: ["12345"],
          raceIds: ["12345"],
          tableTennisEventIds: ["919191"],
          tennisEventIds: ["67890"],
          iceHockeyEventIds: ["929292"],
          rugbyUnionEventIds: ["33333"],
          rugbyLeagueEventIds: ["44444"],
          snookerEventIds: ["949494"],
          volleyballEventIds: ["55555"],
          australianRulesEventIds: ["345562"],
          dartsEventIds: ["555551"],
          isLite: false,
          includeStats: true,
          includePlayers: true,
          footballPlayerIds: ["playerA"],
          includePlayerStats: true,
          includeSubstitutions: false,
        });
      });

      it("should map all fixture sports and race with the client response", () => {
        expect(mapAmericanFootballFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapBaseballFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapBasketballFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapCricketFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapFootballFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapTableTennisFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapTennisFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapRacesStatusAndResultTypeUpdates).toHaveBeenCalledWith("clientResponse");
        expect(mapIceHockeyFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapRugbyUnionFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapRugbyLeagueFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapSnookerFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapVolleyballFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapAustralianRulesFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
        expect(mapDartsFixtureUpdates).toHaveBeenLastCalledWith("clientResponse");
      });

      it("should return all fixtures and race status", () => {
        expect(result).toEqual({
          fixtures: {
            americanfootball: "americanFootballFixtureUpdates",
            baseball: "baseballFixtureUpdates",
            basketball: "basketballFixtureUpdates",
            cricket: "cricketFixtureUpdates",
            football: "footballFixtureUpdates",
            tabletennis: "tableTennisFixtureUpdates",
            tennis: "tennisFixtureUpdates",
            icehockey: "iceHockeyFixtureUpdates",
            rugbyunion: "rugbyUnionFixtureUpdates",
            rugbyleague: "rugbyLeagueFixtureUpdates",
            snooker: "snookerFixtureUpdates",
            volleyball: "volleyballFixtureUpdates",
            australianrules: "australianRulesFixtureUpdates",
            darts: "dartsFixtureUpdates",
          },
          racesStatusAndResultType: "racesStatusAndResultTypeUpdates",
        });
      });
    });
  });
});
