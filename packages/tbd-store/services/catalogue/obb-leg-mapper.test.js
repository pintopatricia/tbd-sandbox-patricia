import { buildObbSquadBetLegResult } from "./obb-leg-mapper";
import normalizeObbLegFragmentIntoObbLeg from "./normalizer/entities/obb-leg/obb-leg-normalizer";

jest.mock("./normalizer/entities/obb-leg/obb-leg-normalizer", () => jest.fn());

describe("ObbLegMapper", () => {
  describe("buildObbSquadBetLegResult", () => {
    describe("when there is no obb", () => {
      it("should return the default leg result", () => {
        const result = buildObbSquadBetLegResult({});

        expect(result).toEqual({
          legs: [],
          defaultOutcomeIndex: 0,
        });
      });
    });

    describe("when there is no squadBetQuotes", () => {
      it("should return the default leg result", () => {
        const result = buildObbSquadBetLegResult({ obb: {} });

        expect(result).toEqual({
          legs: [],
          defaultOutcomeIndex: 0,
        });
      });
    });

    describe("when there are squadBetQuotes", () => {
      it("should return the result mapped", () => {
        normalizeObbLegFragmentIntoObbLeg.mockReturnValue({
          data: {
            event: { typename: "SportsEvent", urn: "event:urn", name: "event name", eventId: "1" },
            quote: {
              typename: "ObbQuoteSuccess",
              price: { decimal: "1.1", fractional: { numerator: 1, denominator: 1 } },
            },
          },
        });

        const result = buildObbSquadBetLegResult({
          obb: { squadBetQuotes: { legs: [{ id: "1" }, { id: "2" }], defaultOutcomeIndex: 2 } },
        });

        expect(result).toEqual({
          defaultOutcomeIndex: 2,
          legs: [
            {
              event: {
                eventId: "1",
                name: "event name",
                typename: "SportsEvent",
                urn: "event:urn",
              },
              quote: {
                price: {
                  decimal: "1.1",
                  fractional: {
                    denominator: 1,
                    numerator: 1,
                  },
                },
                typename: "ObbQuoteSuccess",
              },
            },
            {
              event: {
                eventId: "1",
                name: "event name",
                typename: "SportsEvent",
                urn: "event:urn",
              },
              quote: {
                price: {
                  decimal: "1.1",
                  fractional: {
                    denominator: 1,
                    numerator: 1,
                  },
                },
                typename: "ObbQuoteSuccess",
              },
            },
          ],
        });
      });
    });
  });
});
