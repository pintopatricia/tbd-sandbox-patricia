import scaService from "../services/sports-content-api-service";
import { getInterval } from "../config";
import RichContentUpdatesObservable from "./rich-content-updates-observable";

jest.mock("../services/sports-content-api-service", () => ({
  getScaUpdates: jest.fn(),
}));

jest.mock("../config", () => ({
  getInterval: jest.fn(() => 5000),
}));

describe("RichContentUpdatesObservable", () => {
  let observable;
  beforeAll(() => {
    jest.clearAllMocks();

    observable = RichContentUpdatesObservable.getInstance();
  });

  describe("addEvent", () => {
    describe("when adding an Event that didn't exist in the pool before", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        observable.addEvent({
          urn: "mockURN",
          typename: "FootballFixture",
        });
      });

      it("should not need any action to be provided", () => {
        expect(observable.POOL.get("mockURN")).toEqual({
          typename: "FootballFixture",
          count: 1,
          isLite: false,
          includeStats: false,
          includePlayers: false,
          footballPlayerIds: [],
          includePlayerStats: false,
          includeSubstitutions: false,
        });
      });
    });

    describe("when adding the same Event to the pool multiple times", () => {
      beforeEach(() => {
        const event = {
          urn: "mockURN1",
          typename: "FootballFixture",
          includeStats: true,
          footballPlayerIds: [1, 2],
        };
        observable.addEvent(event);
        observable.addEvent({
          ...event,
          footballPlayerIds: [3, 4, 5],
        });
      });

      it("should not need any action to be provided", () => {
        expect(observable.POOL.get("mockURN1")).toEqual({
          typename: "FootballFixture",
          count: 2,
          isLite: false,
          includeStats: true,
          includePlayers: false,
          footballPlayerIds: [1, 2, 3, 4, 5],
          includePlayerStats: false,
          includeSubstitutions: false,
        });
      });
    });
  });

  describe("tick", () => {
    beforeAll(() => {
      jest.clearAllMocks();

      observable.restart = jest.fn();
    });

    describe("when triggering a tick", () => {
      beforeEach(() => {
        jest.clearAllMocks();

        observable.notify = jest.fn();
        observable.tick();
      });

      it("should call getScaUpdates", () => {
        expect(scaService.getScaUpdates).toHaveBeenCalled();
      });
      it("should call 'notify'", () => {
        expect(observable.notify).toHaveBeenCalled();
      });
    });

    describe("when there's a fixture which is inplay", () => {
      beforeAll(() => {
        jest.clearAllMocks();
        scaService.getScaUpdates.mockReturnValueOnce({
          fixtures: {
            football: [{ duration: { status: "INPLAY_FIRST_HALF" } }],
          },
        });

        observable.tick();
      });

      it("should call 'getInterval' with inplay as true", () => {
        expect(getInterval).toHaveBeenCalledWith("SCA", { inPlay: true });
      });

      it("should restart the poller", () => {
        expect(observable.restart).toHaveBeenCalled();
      });
    });

    describe("when there are no fixtures inplay", () => {
      beforeAll(() => {
        jest.clearAllMocks();

        observable.inPlay = true; // initialize "inPlay" flag as true so it can be toggled and the poller restarted
        scaService.getScaUpdates.mockReturnValueOnce({ fixtures: { football: [{ duration: { status: "FULL" } }] } });
        observable.tick();
      });

      it("should call 'getInterval' with inplay as true", () => {
        expect(getInterval).toHaveBeenCalledWith("SCA", { inPlay: false });
      });

      it("should restart the poller", () => {
        expect(observable.restart).toHaveBeenCalled();
      });
    });

    describe("when the request fails", () => {
      beforeAll(() => {
        jest.clearAllMocks();

        scaService.getScaUpdates.mockImplementation(() => {
          throw new Error("http request failed");
        });
        observable.notify = jest.fn();
        observable.tick();
      });

      it("should call 'getInterval' with inplay as true", () => {
        expect(observable.notify).toHaveBeenCalledWith({ error: "http request failed" });
      });
    });
  });

  describe("request", () => {
    beforeEach(() => {
      jest.resetAllMocks();
      observable.resetEvents(); // clear any previous entries to the pool
      scaService.getScaUpdates.mockReturnValue({
        fixtures: {
          baseball: {},
          basketball: {},
          cricket: {},
          darts: {},
          football: {},
          tabletennis: {},
          tennis: {},
          icehockey: {},
          rugbyunion: {},
          snooker: {},
          australianrules: {},
        },
        racesStatusAndResultType: {},
      });
    });

    describe("when there are events with the 'isLite' flag", () => {
      beforeEach(() => {
        observable.addEvent({
          urn: "mockURN",
          typename: "FootballFixture",
          isLite: true,
          includeSubstitutions: false,
        });

        observable.request();
      });

      it("should call 'getScaUpdates' with the 'isLite' flag set to true", () => {
        expect(scaService.getScaUpdates).toHaveBeenCalledWith({
          americanFootballUrns: [],
          baseballUrns: [],
          basketballUrns: [],
          cricketUrns: [],
          dartsUrns: [],
          footballPlayerIds: [],
          footballUrns: ["mockURN"],
          includePlayerStats: false,
          includePlayers: false,
          includeStats: false,
          includeSubstitutions: false,
          isLite: true,
          raceUrns: [],
          tableTennisUrns: [],
          tennisUrns: [],
          iceHockeyUrns: [],
          rugbyUnionUrns: [],
          rugbyLeagueUrns: [],
          snookerUrns: [],
          volleyballUrns: [],
          australianRulesUrns: [],
        });
      });
    });

    describe("when there are duplicated footballPlayerIds", () => {
      beforeEach(() => {
        observable.addEvent({
          urn: "mockURN",
          typename: "FootballFixture",
          footballPlayerIds: [1, 2, 3, 3],
          includePlayers: true,
          includeSubstitutions: false,
        });

        observable.addEvent({
          urn: "mockURN2",
          typename: "FootballFixture",
          footballPlayerIds: [1, 2, 3, 5],
          includePlayers: true,
          includeSubstitutions: false,
        });

        observable.request();
      });

      it("should call 'getScaUpdates' without duplicated footballPlayerIds", () => {
        expect(scaService.getScaUpdates).toHaveBeenCalledWith({
          americanFootballUrns: [],
          baseballUrns: [],
          basketballUrns: [],
          cricketUrns: [],
          dartsUrns: [],
          footballPlayerIds: [1, 2, 3, 5],
          footballUrns: ["mockURN", "mockURN2"],
          includePlayerStats: false,
          includePlayers: true,
          includeStats: false,
          includeSubstitutions: false,
          isLite: false,
          raceUrns: [],
          tableTennisUrns: [],
          tennisUrns: [],
          iceHockeyUrns: [],
          rugbyUnionUrns: [],
          rugbyLeagueUrns: [],
          snookerUrns: [],
          volleyballUrns: [],
          australianRulesUrns: [],
        });
      });
    });

    describe("when there are events with the 'includeSubstitutions' flag", () => {
      describe("and at least one of the events has 'includeSubstitutions' as true", () => {
        beforeEach(() => {
          observable.addEvent({
            urn: "mockURN",
            typename: "FootballFixture",
            includeSubstitutions: true,
          });

          observable.addEvent({
            urn: "mockURN2",
            typename: "FootballFixture",
            includeSubstitutions: false,
          });

          observable.request();
        });

        it("should call 'getScaUpdates' with the 'includeSubstitutions' flag as true", () => {
          expect(scaService.getScaUpdates).toHaveBeenCalledWith({
            americanFootballUrns: [],
            baseballUrns: [],
            basketballUrns: [],
            cricketUrns: [],
            dartsUrns: [],
            footballPlayerIds: [],
            footballUrns: ["mockURN", "mockURN2"],
            includePlayerStats: false,
            includePlayers: false,
            includeStats: false,
            includeSubstitutions: true,
            isLite: false,
            raceUrns: [],
            tableTennisUrns: [],
            tennisUrns: [],
            iceHockeyUrns: [],
            rugbyUnionUrns: [],
            rugbyLeagueUrns: [],
            snookerUrns: [],
            volleyballUrns: [],
            australianRulesUrns: [],
          });
        });
      });
    });

    describe("when there are events with the 'includePlayers' flag", () => {
      describe("and at least one of the events has 'includePlayers' as true", () => {
        beforeEach(() => {
          observable.addEvent({
            urn: "mockURN",
            typename: "FootballFixture",
            includePlayers: true,
          });

          observable.addEvent({
            urn: "mockURN2",
            typename: "FootballFixture",
            includePlayers: false,
          });

          observable.request();
        });

        it("should call 'getScaUpdates' with the 'includePlayers' flag as true", () => {
          expect(scaService.getScaUpdates).toHaveBeenCalledWith({
            americanFootballUrns: [],
            baseballUrns: [],
            basketballUrns: [],
            cricketUrns: [],
            dartsUrns: [],
            footballPlayerIds: [],
            footballUrns: ["mockURN", "mockURN2"],
            includePlayerStats: false,
            includePlayers: true,
            includeStats: false,
            includeSubstitutions: false,
            isLite: false,
            raceUrns: [],
            tableTennisUrns: [],
            tennisUrns: [],
            iceHockeyUrns: [],
            rugbyUnionUrns: [],
            rugbyLeagueUrns: [],
            snookerUrns: [],
            volleyballUrns: [],
            australianRulesUrns: [],
          });
        });
      });
    });

    describe("when there are events with the 'includePlayerStats' flag", () => {
      beforeEach(() => {
        observable.addEvent({
          urn: "mockURN",
          typename: "FootballFixture",
          includePlayers: true,
          footballPlayerIds: [1],
        });
        observable.addEvent({
          urn: "mockURN",
          typename: "FootballFixture",
          footballPlayerIds: [2, 3, 4],
          includePlayerStats: true,
        });

        observable.request();
      });

      it("should call 'getScaUpdates' with the 'includePlayerStats' flag set to true and all the football player IDs", () => {
        expect(scaService.getScaUpdates).toHaveBeenCalledWith({
          americanFootballUrns: [],
          baseballUrns: [],
          basketballUrns: [],
          cricketUrns: [],
          dartsUrns: [],
          footballPlayerIds: [1, 2, 3, 4],
          footballUrns: ["mockURN"],
          includePlayerStats: true,
          includePlayers: true,
          includeStats: false,
          includeSubstitutions: false,
          isLite: false,
          raceUrns: [],
          tableTennisUrns: [],
          tennisUrns: [],
          iceHockeyUrns: [],
          rugbyUnionUrns: [],
          rugbyLeagueUrns: [],
          snookerUrns: [],
          volleyballUrns: [],
          australianRulesUrns: [],
        });
      });
    });
  });

  describe("isInPlay", () => {
    describe("isBasketballFixtureInPlay", () => {
      it("should return true if in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            basketball: [{ clock: { period: "PERIOD_1" } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });

      it("should return false if not in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            basketball: [{ clock: { period: "FULL" } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(false);
      });
    });

    describe("isFootballFixtureInPlay", () => {
      it("should return true if in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            football: [{ duration: { status: "INPLAY_FIRST_HALF" } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });

      it("should return false if not in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            football: [{ duration: { status: "FULL" } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(false);
      });
    });

    describe("isTennisFixtureInPlay", () => {
      it("should return true if in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            tennis: [{ status: { status: "IN_RUNNING" } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });

      it("should return false if not in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            tennis: [{ status: { status: "FULL" } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(false);
      });
    });

    describe("isTableTennisFixtureInPlay", () => {
      it("should return true if in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            tabletennis: [{ currentSet: { score: {} } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });

      it("should return false if not in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            tabletennis: [{ currentSet: undefined }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(false);
      });
    });

    describe("isCricketFixtureInPlay", () => {
      it("should return true if in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            cricket: [{ currentTime: {} }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });

      it("should return false if not in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            cricket: [{ currentTime: undefined }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(false);
      });
    });

    describe("isBaseballFixtureInPlay", () => {
      it("should return true if in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            baseball: [{ clock: { period: "INNING_1" } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });

      it("should return false if not in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            baseball: [{ clock: { period: "PRE_MATCH" } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(false);
      });
    });

    describe("isRaceInPlay", () => {
      it("should return true if in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {},
          racesStatusAndResultType: {
            raceUrn: { status: "AT_THE_POST" },
          },
        });
        expect(result).toEqual(true);
      });

      it("should return false if not in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {},
          racesStatusAndResultType: {
            raceUrn: { status: "ABANDONED" },
          },
        });
        expect(result).toEqual(false);
      });
    });

    describe("isIceHockeyFixtureInPlay", () => {
      it("should return true if in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            icehockey: [{ clock: { period: "PERIOD_1" } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });

      it("should return false if not in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            icehockey: [{ clock: { period: "FULL" } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(false);
      });
    });

    describe("isRugbyUnionFixtureInPlay", () => {
      it("should return true if it has score", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            rugbyunion: [{ score: { home: 0, away: 0 } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });

      it("should return true if it has half time score", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            rugbyunion: [{ halfTimeScore: { home: 0, away: 0 } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });

      it("should return false if it does not have scores", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            rugbyunion: [{ score: null, halfTimeScore: null }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(false);
      });
    });

    describe("isDartsFixtureInPlay", () => {
      it("should return true if score data is present", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            darts: [{ score: { home: 3, away: 5 } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });
    });

    describe("isSnookerFixtureInPlay", () => {
      it("should return true if in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            snooker: [{ score: { home: 1, away: 0 } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });

      it("should return false if not in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            snooker: [{ score: null }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(false);
      });
    });

    describe("isAustralianRulesFixtureInPlay", () => {
      it("should return true if in 'inplay' period", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            australianrules: [{ score: { points: { away: 0, home: 0 } } }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(true);
      });

      it("should return false if not in 'inplay' period (no score)", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            australianrules: [{ score: null }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(false);
      });

      it("should return false if not in 'inplay' period (no score content)", () => {
        const result = RichContentUpdatesObservable.isInPlay({
          fixtures: {
            australianrules: [{ score: {} }],
          },
          racesStatusAndResultType: {},
        });
        expect(result).toEqual(false);
      });
    });
  });
});
