import { FallbackIconType } from "@ppb/the-wall-common/types";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { formatDate, formatTime } from "../../helpers/dates";
import { getSilkFallbackType } from "../../helpers/race";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getExchangeMarketByURN = jest.fn();
const getSportByURN = jest.fn();
const getRichContentByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createRichContentExcRunnerWithPNLByMarketAndRunnerURNSelector: jest
    .fn()
    .mockImplementationOnce(() => getRichContentByURN),
  createEntityByURNSelector: jest
    .fn()
    .mockImplementationOnce(() => getExchangeMarketByURN)
    .mockImplementationOnce(() => getSportByURN),
}));
jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(() => "fakeLabel"),
}));
jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(() => "€1111"),
}));
jest.mock("../../helpers/dates", () => ({
  formatDate: jest.fn(() => "fakeFormatedDate"),
  formatTime: jest.fn(() => "fakeFormatedTime"),
}));
jest.mock("../../helpers/race", () => ({
  getSilkFallbackType: jest.fn(),
}));

const state = {
  entities: {
    exchangemarkets: {
      "ppb:excmarket:123": {
        urn: "ppb:excmarket:123",
        name: "fakeMarketName",
        status: "OPEN",
        hierarchy: {
          race: "ppb:race:123",
          meeting: "ppb:meeting:123",
        },
        runners: [
          {
            urn: "ppb:excrunner:123",
            name: "fakeRunnerName",
            selectionId: 123,
          },
        ],
      },
    },
    exchangerunners: {
      "ppb:excrunner:123": {
        urn: "ppb:excrunner:123",
        market: "ppb:excmarket:123",
        reduction: 3.7,
        date: "fakeDate",
        status: "ACTIVE",
      },
    },
    userdetails: {
      localeCodeBcp47: "locale",
      timezone: "timezone",
    },
  },
};

const horseRacingRunneri18nLabels = {
  age: "fakeLabel",
  bred: "fakeLabel",
  comment: "fakeLabel",
  course: "fakeLabel",
  date: "fakeLabel",
  distance: "fakeLabel",
  equipment: "fakeLabel",
  going: "fakeLabel",
  graph: "fakeLabel",
  officialRating: "fakeLabel",
  pedigree: "fakeLabel",
  position: "fakeLabel",
  type: "fakeLabel",
  weight: "fakeLabel",
  jockey: "fakeLabel",
  trainer: "fakeLabel",
  form: "f",
};

const mapStateToProps = makeMapStateToProps();

describe("exchange market runner - map-to-props", () => {
  describe("for a non-existing runner URN or market URN", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      getRichContentByURN.mockReturnValue(undefined);
      getExchangeMarketByURN.mockReturnValue(undefined);
    });

    it("shoult return an empty object", () => {
      const vm1 = mapStateToProps(state, {
        runnerURN: "ppb:excrunner:123",
        marketURN: "non-existing-market-urn",
      });
      const vm2 = mapStateToProps(state, {
        runnerURN: "non-existing-runner-urn",
        marketURN: "ppb:excmarket:123",
      });

      expect(vm1).toEqual({});
      expect(vm2).toEqual({});
    });
  });

  describe("for an existing runner URN and market URN", () => {
    describe("with no rich content and no market position (PNL)", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        getExchangeMarketByURN.mockReturnValue({
          ...state.entities.exchangemarkets["ppb:excmarket:123"],
          hierarchy: { sportevent: {} },
        });
        getRichContentByURN.mockReturnValue(state.entities.exchangemarkets["ppb:excmarket:123"].runners[0]);
      });

      it("should return the minimal runner & market information", () => {
        const vm = mapStateToProps(state, {
          runnerURN: "ppb:excrunner:123",
          marketURN: "ppb:excmarket:123",
        });

        expect(vm).toEqual({
          isRaceMarket: false,
          hasDefaultSilk: false,
          marketName: "fakeMarketName",
          marketStatus: "OPEN",
          runner: {
            urn: "ppb:excrunner:123",
            name: "fakeRunnerName",
            comments: undefined,
            date: undefined,
            draw: undefined,
            equipment: undefined,
            form: undefined,
            apprenticeClaim: undefined,
            crsDisWinFavText: undefined,
            horseAge: undefined,
            horseBred: undefined,
            horseDamName: undefined,
            horsePastPerformances: [],
            horseSireName: undefined,
            jockeyName: undefined,
            raceRunnerUrn: undefined,
            rating: undefined,
            reduction: undefined,
            saddleCloth: undefined,
            silk: undefined,
            status: undefined,
            trainerName: undefined,
            weight: undefined,
          },
          horseRacingRunneri18nLabels,
          i18nLabels: {
            nonRunnerReduction: "fakeLabel",
            nonRunnerTitle: "fakeLabel",
          },
        });
      });
    });

    describe("with rich content and no market position (PNL)", () => {
      const stateWithHRRichContent = {
        ...state,
        entities: {
          ...state.entities,
          races: {
            "ppb:race:123": {
              urn: "ppb:race:123",
              runners: ["ppb:racerunner:123"],
            },
          },
          racerunners: {
            "ppb:racerunner:123": {
              urn: "ppb:racerunner:123",
              selectionId: 123,
              horse: {
                name: "MR MAC",
                sireName: "MAKFI",
                damName: "VERONICA FRANCO",
                damSireName: "DARSHAAN",
                age: 8,
                color: "BAY",
                sex: "GELDING",
              },
              details: {
                jockeyName: "William Carver",
                trainerName: "Simon Hodgson",
                saddleCloth: "6",
              },
            },
          },
        },
      };

      beforeEach(() => {
        jest.clearAllMocks();
        const runnerWithRC = {
          ...stateWithHRRichContent.entities.exchangemarkets["ppb:excmarket:123"].runners[0],
          raceRunner: { ...stateWithHRRichContent.entities.racerunners["ppb:racerunner:123"] },
        };

        getRichContentByURN.mockReturnValue(runnerWithRC);
        getExchangeMarketByURN.mockReturnValue(stateWithHRRichContent.entities.exchangemarkets["ppb:excmarket:123"]);
      });

      it("should return the runner with rich content", () => {
        const vm = mapStateToProps(state, {
          runnerURN: "ppb:excrunner:123",
          marketURN: "ppb:excmarket:123",
        });

        expect(vm).toEqual({
          i18nLabels: {
            nonRunnerReduction: "fakeLabel",
            nonRunnerTitle: "fakeLabel",
          },
          horseRacingRunneri18nLabels,
          isRaceMarket: true,
          hasDefaultSilk: false,
          marketName: "fakeMarketName",
          marketStatus: "OPEN",
          runner: {
            jockeyName: "William Carver",
            name: "fakeRunnerName",
            saddleCloth: "6",
            trainerName: "Simon Hodgson",
            urn: "ppb:excrunner:123",
            comments: undefined,
            date: undefined,
            draw: undefined,
            equipment: undefined,
            form: undefined,
            apprenticeClaim: undefined,
            crsDisWinFavText: undefined,
            horseAge: 8,
            horseBred: undefined,
            horseDamName: "VERONICA FRANCO",
            horsePastPerformances: [],
            horseSireName: "MAKFI",
            raceRunnerUrn: "ppb:racerunner:123",
            rating: undefined,
            reduction: undefined,
            silk: undefined,
            status: undefined,
            weight: undefined,
          },
        });
      });
    });

    describe("with market position (PNL) and no rich content", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        const stateWithPNL = {
          ...state,
          entities: {
            ...state.entities,
            exchangeBetting: {
              "ppb:excmarket:123": {
                runnersPosition: [
                  {
                    selectionId: 123,
                    handicap: 1,
                    potentialPnl: {
                      win: -3,
                    },
                    pnl: {
                      win: -3,
                    },
                    whatIf: {
                      win: -3,
                    },
                  },
                ],
              },
            },
          },
        };
        const excRunnerWithPNL = {
          ...stateWithPNL.entities.exchangemarkets["ppb:excmarket:123"].runners[0],
          ...stateWithPNL.entities.exchangerunners["ppb:excrunner:123"],
          runnerPosition: { ...stateWithPNL.entities.exchangeBetting["ppb:excmarket:123"].runnersPosition[0] },
        };
        getExchangeMarketByURN.mockReturnValue({
          ...stateWithPNL.entities.exchangemarkets["ppb:excmarket:123"],
          hierarchy: { sportevent: {} },
        });

        getRichContentByURN.mockReturnValue(excRunnerWithPNL);
      });

      it("should return the minimal runner & market information plus the PNL details", () => {
        const vm = mapStateToProps(state, {
          runnerURN: "ppb:excrunner:123",
          marketURN: "ppb:excmarket:123",
        });

        expect(vm).toEqual({
          i18nLabels: { nonRunnerReduction: "fakeLabel", nonRunnerTitle: "fakeLabel" },
          isRaceMarket: false,
          hasDefaultSilk: false,
          horseRacingRunneri18nLabels,
          marketName: "fakeMarketName",
          marketStatus: "OPEN",
          runner: {
            comments: undefined,
            draw: undefined,
            equipment: undefined,
            form: undefined,
            apprenticeClaim: undefined,
            crsDisWinFavText: undefined,
            horseAge: undefined,
            horseBred: undefined,
            horseDamName: undefined,
            horsePastPerformances: [],
            horseSireName: undefined,
            jockeyName: undefined,
            raceRunnerUrn: undefined,
            rating: undefined,
            saddleCloth: undefined,
            silk: undefined,
            status: "ACTIVE",
            trainerName: undefined,
            weight: undefined,
            urn: "ppb:excrunner:123",
            name: "fakeRunnerName",
            date: "fakeFormatedTime fakeFormatedDate",
            reduction: "3.7% fakeLabel",
            pnl: "€1111",
            whatIf: "€1111",
            rawPnl: -3,
            rawWhatIf: -3,
          },
        });

        expect(formatDate).toHaveBeenCalledWith(expect.any(Date), "locale", "timezone");
        expect(formatTime).toHaveBeenCalledWith(expect.any(Date), "locale", "timezone");
      });
    });

    describe("when it is a sport with fallback silk", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        getExchangeMarketByURN.mockReturnValue({
          ...state.entities.exchangemarkets["ppb:excmarket:123"],
          hierarchy: { sportevent: {} },
        });
        getRichContentByURN.mockReturnValue(state.entities.exchangemarkets["ppb:excmarket:123"].runners[0]);
        getSportByURN.mockReturnValue({ sportId: 7 });
        getSilkFallbackType.mockReturnValue(FallbackIconType.HorseRacing);
      });

      it("should return hasDefaultSilk as true", () => {
        const vm = mapStateToProps(state, {
          runnerURN: "ppb:excrunner:123",
          marketURN: "ppb:excmarket:123",
        });

        expect(vm).toEqual(expect.objectContaining({ hasDefaultSilk: true }));
      });
    });
  });
});

describe("exchange market runner - map-dispatch-to-props", () => {
  describe("dispatchFetchCatalogue", () => {
    it("should return the correct action creator", () => {
      const { dispatchFetchCatalogue } = mapDispatchToProps;

      expect(dispatchFetchCatalogue("marketId", "localeCode", "currencyCode")).toEqual({
        payload: { urn: "marketId" },
        type: "FETCH_CATALOGUE",
      });
    });
  });

  describe("dispatchToggleRunnerInfo", () => {
    it("should return the correct action creator", () => {
      const { dispatchToggleRunnerInfo } = mapDispatchToProps;

      expect(dispatchToggleRunnerInfo("marketName", "runnerName", false)).toEqual({
        payload: {
          isOpening: false,
          marketName: "marketName",
          runnerName: "runnerName",
        },
        type: "UI__TOGGLE_RUNNER_INFO",
      });
    });
  });

  describe("dispatchDeleteView", () => {
    it("should return the correct action creator", () => {
      const { dispatchDeleteView } = mapDispatchToProps;

      expect(dispatchDeleteView("urn")).toEqual({
        payload: "urn",
        type: "DELETE_VIEW",
      });
    });
  });

  describe("dispatchPushAction", () => {
    it("should return the correct action creator", () => {
      const { dispatchPushAction } = mapDispatchToProps;

      expect(dispatchPushAction({ viewUrn: "viewUrn", viewUrl: "viewUrl" })).toEqual({
        payload: { viewUrn: "viewUrn", viewUrl: "viewUrl" },
        type: PUSH,
      });
    });
  });

  describe("dispatchToggleRecentRaces", () => {
    it("should return the correct action creator", () => {
      const { dispatchToggleRecentRaces } = mapDispatchToProps;

      expect(dispatchToggleRecentRaces("runnerName", "cardUrn", true)).toEqual({
        payload: {
          runnerName: "runnerName",
          cardUrn: "cardUrn",
          isClosed: true,
        },
        type: "UI__RECENT_RACE_TOGGLE",
      });
    });
  });

  describe("dispatchToggleRaceReplays", () => {
    it("should return the correct action creator", () => {
      const { dispatchToggleRaceReplays } = mapDispatchToProps;

      expect(dispatchToggleRaceReplays("runnerName", true, "cardUrn")).toEqual({
        payload: {
          selection: "runnerName",
          isClosed: true,
          cardUrn: "cardUrn",
        },
        type: "UI__RACE_REPLAYS_TOGGLE",
      });
    });
  });

  describe("dispatchRaceReplaysMediaPlayerLoaded", () => {
    it("should return the correct action creator", () => {
      const { dispatchRaceReplaysMediaPlayerLoaded } = mapDispatchToProps;

      expect(dispatchRaceReplaysMediaPlayerLoaded("marketUrn")).toEqual({
        payload: {
          marketUrn: "marketUrn",
        },
        type: "UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED",
      });
    });
  });
});
