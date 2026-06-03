import { hasAnyMarketClosedFailure, hasAnyMarketSuspendedFailure } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { HintType } from "@ppb/the-wall-common/types";
import { i18n } from "../../../helpers/i18n";
import { buildSingleLegExtraDetails } from "./bet-controls-mapper";

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting");
jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn().mockReturnValue("Translated Message") }));

describe("Bet Controls Mapper", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("buildSingleLegExtraDetails", () => {
    describe("when there are previous odds", () => {
      it("should return the most recent odd before current one", () => {
        hasAnyMarketSuspendedFailure.mockReturnValue(true);
        hasAnyMarketClosedFailure.mockReturnValue(false);

        const result = buildSingleLegExtraDetails(
          { legs: ["LEG:1"] },
          { "LEG:1": { runners: ["RUNNER:1"] } },
          { runners: { "RUNNER:1": ["FAILURE"] } },
          { "RUNNER:1": { previousOdds: [{ odds: 1.22 }, { odds: 3.55 }] } },
        );

        expect(result.previousOdds).toEqual({ odds: 1.22 });
      });
    });

    describe("failure", () => {
      describe("when there is a suspended failure", () => {
        it("should return hasFailure as true", () => {
          hasAnyMarketSuspendedFailure.mockReturnValue(true);
          hasAnyMarketClosedFailure.mockReturnValue(false);

          const result = buildSingleLegExtraDetails(
            { legs: ["LEG:1"] },
            { "LEG:1": { runners: ["RUNNER:1"] } },
            { runners: { "RUNNER:1": ["FAILURE"] } },
            { "RUNNER:1": {} },
          );

          expect(result.hasFailure).toEqual(true);
        });

        it("should return a hintType", () => {
          hasAnyMarketSuspendedFailure.mockReturnValue(true);
          hasAnyMarketClosedFailure.mockReturnValue(false);

          const result = buildSingleLegExtraDetails(
            { legs: ["LEG:1"] },
            { "LEG:1": { runners: ["RUNNER:1"] } },
            { runners: { "RUNNER:1": ["FAILURE"] } },
            { "RUNNER:1": {} },
          );

          expect(result.hintType).toEqual(HintType.Warning);
        });

        it("should return a hintMessage", () => {
          hasAnyMarketSuspendedFailure.mockReturnValue(true);
          hasAnyMarketClosedFailure.mockReturnValue(false);

          const result = buildSingleLegExtraDetails(
            { legs: ["LEG:1"] },
            { "LEG:1": { runners: ["RUNNER:1"] } },
            { runners: { "RUNNER:1": ["FAILURE"] } },
            { "RUNNER:1": {} },
          );

          expect(i18n).toHaveBeenCalledWith({ key: "I18N.MARKET.SUSPENDED" });
          expect(result.hintMessage).toEqual("Translated Message");
        });
      });

      describe("when there is a closed failure", () => {
        it("should return hasFailure as true", () => {
          hasAnyMarketSuspendedFailure.mockReturnValue(false);
          hasAnyMarketClosedFailure.mockReturnValue(true);

          const result = buildSingleLegExtraDetails(
            { legs: ["LEG:1"] },
            { "LEG:1": { runners: ["RUNNER:1"] } },
            { runners: { "RUNNER:1": ["FAILURE"] } },
            { "RUNNER:1": {} },
          );

          expect(result.hasFailure).toEqual(true);
        });

        it("should return a hintType", () => {
          hasAnyMarketSuspendedFailure.mockReturnValue(false);
          hasAnyMarketClosedFailure.mockReturnValue(true);

          const result = buildSingleLegExtraDetails(
            { legs: ["LEG:1"] },
            { "LEG:1": { runners: ["RUNNER:1"] } },
            { runners: { "RUNNER:1": ["FAILURE"] } },
            { "RUNNER:1": {} },
          );

          expect(result.hintType).toEqual(HintType.Warning);
        });

        it("should return a hintMessage", () => {
          hasAnyMarketSuspendedFailure.mockReturnValue(false);
          hasAnyMarketClosedFailure.mockReturnValue(true);

          const result = buildSingleLegExtraDetails(
            { legs: ["LEG:1"] },
            { "LEG:1": { runners: ["RUNNER:1"] } },
            { runners: { "RUNNER:1": ["FAILURE"] } },
            { "RUNNER:1": {} },
          );

          expect(i18n).toHaveBeenCalledWith({ key: "I18N.MARKET.CLOSED" });
          expect(result.hintMessage).toEqual("Translated Message");
        });
      });

      describe("when there is no failure", () => {
        it("should return hasFailure as false", () => {
          hasAnyMarketSuspendedFailure.mockReturnValue(false);
          hasAnyMarketClosedFailure.mockReturnValue(false);

          const result = buildSingleLegExtraDetails(
            { legs: ["LEG:1"] },
            { "LEG:1": { runners: ["RUNNER:1"] } },
            { runners: { "RUNNER:1": ["FAILURE"] } },
            { "RUNNER:1": {} },
          );

          expect(result.hasFailure).toEqual(false);
        });

        it("should return no hintType", () => {
          hasAnyMarketSuspendedFailure.mockReturnValue(false);
          hasAnyMarketClosedFailure.mockReturnValue(false);

          const result = buildSingleLegExtraDetails(
            { legs: ["LEG:1"] },
            { "LEG:1": { runners: ["RUNNER:1"] } },
            { runners: { "RUNNER:1": ["FAILURE"] } },
            { "RUNNER:1": {} },
          );

          expect(result.hintType).toEqual(undefined);
        });

        it("should return no hintMessage", () => {
          hasAnyMarketSuspendedFailure.mockReturnValue(false);
          hasAnyMarketClosedFailure.mockReturnValue(false);

          const result = buildSingleLegExtraDetails(
            { legs: ["LEG:1"] },
            { "LEG:1": { runners: ["RUNNER:1"] } },
            { runners: { "RUNNER:1": ["FAILURE"] } },
            { "RUNNER:1": {} },
          );

          expect(i18n).not.toHaveBeenCalled();
          expect(result.hintMessage).toEqual(undefined);
        });
      });
    });

    describe("each way", () => {
      describe("when each way is available", () => {
        it("should return a built eachWaySubtitle", () => {
          hasAnyMarketSuspendedFailure.mockReturnValue(false);
          hasAnyMarketClosedFailure.mockReturnValue(false);

          const result = buildSingleLegExtraDetails(
            {
              legs: ["LEG:1"],
              isEachWayAvailable: true,
              eachWayPlacesFraction: { numerator: 1, denominator: 3 },
              eachWayPlaces: 5,
            },
            { "LEG:1": { runners: ["RUNNER:1"] } },
            { runners: { "RUNNER:1": ["FAILURE"] } },
            { "RUNNER:1": {} },
          );

          expect(i18n).toHaveBeenCalledWith({
            key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES",
            interpolationValues: { denominator: 3, numerator: 1, places: 5 },
          });
          expect(result.eachWaySubtitle).toEqual("Translated Message");
        });
      });

      describe("when each way is not available", () => {
        it("should return no eachWaySubtitle", () => {
          hasAnyMarketSuspendedFailure.mockReturnValue(false);
          hasAnyMarketClosedFailure.mockReturnValue(false);

          const result = buildSingleLegExtraDetails(
            {
              legs: ["LEG:1"],
              isEachWayAvailable: false,
              eachWayPlacesFraction: { numerator: 1, denominator: 3 },
              eachWayPlaces: 5,
            },
            { "LEG:1": { runners: ["RUNNER:1"] } },
            { runners: { "RUNNER:1": ["FAILURE"] } },
            { "RUNNER:1": {} },
          );

          expect(i18n).not.toHaveBeenCalledWith(
            expect.objectContaining({
              key: "I18N.BETSLIP.EACHWAY_ODDS_PLACES",
            }),
          );
          expect(result.eachWaySubtitle).toEqual(undefined);
        });
      });
    });
  });
});
