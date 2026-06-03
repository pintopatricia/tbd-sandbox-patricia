import normalizeObbQuoteFragmentIntoObbQuote from "./obb-quotes-normalizer";

describe("OBB quotes normalizer", () => {
  describe("normalizeObbQuoteFragmentIntoObbQuote", () => {
    describe("when receive a successful quote", () => {
      it("should return the quote with the price", () => {
        const obbQuote = {
          __typename: "ObbQuoteSuccess",
          price: {
            decimal: 1.5,
            fractional: {
              numerator: 1,
              denominator: 5,
            },
          },
        };

        const normalizedQuote = normalizeObbQuoteFragmentIntoObbQuote(obbQuote);

        expect(normalizedQuote).toEqual({
          typename: "ObbQuoteSuccess",
          price: {
            decimal: 1.5,
            fractional: {
              numerator: 1,
              denominator: 5,
            },
          },
        });
      });
    });

    describe("when receive a error quote", () => {
      describe("when value is numeric", () => {
        it("should return the quote with the price", () => {
          const obbQuote = {
            __typename: "ObbQuoteError",
            errorCode: "ERROR_CODE",
            errorDetails: "ERROR_DETAILS",
            errorLegDetails: {
              aggregator: "aggregator",
              participants: ["participant1"],
              outcomes: [
                {
                  incidentType: "incidentType",
                  operator: "operator",
                  period: "period",
                  value: {
                    __typename: "ObbNumericOutcomeValue",
                    numericValue: 1,
                  },
                },
              ],
            },
          };

          const normalizedQuote = normalizeObbQuoteFragmentIntoObbQuote(obbQuote);

          expect(normalizedQuote).toEqual({
            typename: "ObbQuoteError",
            errorCode: "ERROR_CODE",
            errorDetails: "ERROR_DETAILS",
          });
        });
      });

      describe("when value is boolean", () => {
        it("should return the quote with the price", () => {
          const obbQuote = {
            __typename: "ObbQuoteError",
            errorCode: "ERROR_CODE",
            errorDetails: "ERROR_DETAILS",
            errorLegDetails: {
              aggregator: "aggregator",
              participants: ["participant1"],
              outcomes: [
                {
                  incidentType: "incidentType",
                  operator: "operator",
                  period: "period",
                  value: {
                    __typename: "ObbBooleanOutcomeValue",
                    booleanValue: true,
                  },
                },
              ],
            },
          };

          const normalizedQuote = normalizeObbQuoteFragmentIntoObbQuote(obbQuote);

          expect(normalizedQuote).toEqual({
            typename: "ObbQuoteError",
            errorCode: "ERROR_CODE",
            errorDetails: "ERROR_DETAILS",
          });
        });
      });
    });
  });
});
