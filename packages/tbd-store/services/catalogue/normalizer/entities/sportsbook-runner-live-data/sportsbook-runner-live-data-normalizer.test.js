import normalizer from "./sportsbook-runner-live-data-normalizer";

describe("normalizeSportsbookRunnerLiveDataFragmentIntoSportsbookRunnerLiveData", () => {
  it("should return transformed data when all required fields are present", () => {
    const input = {
      runnerURN: "urn:test",
      marketURN: "urn:market",
      selectionId: 123,
      runnerStatus: "ACTIVE",
      displayOdds: {
        decimal: 2.5,
        fractional: {
          denominator: "2",
          numerator: "3",
        },
      },
      odds: {
        decimal: 3.5,
        fractional: {
          denominator: "3",
          numerator: "4",
        },
      },
    };

    const expected = {
      data: {
        urn: "urn:test",
        market: "urn:market",
        selectionId: 123,
        status: "ACTIVE",
        odds: {
          decimal: 2.5,
          fractional: {
            denominator: "2",
            numerator: "3",
          },
        },
        trueOdds: {
          decimal: 3.5,
          fractional: {
            denominator: "3",
            numerator: "4",
          },
        },
      },
    };

    const result = normalizer(input);

    expect(result).toEqual(expected);
  });

  it("should handle missing displayOdds gracefully", () => {
    const input = {
      runnerURN: "urn:test",
      marketURN: "urn:market",
      selectionId: 123,
      runnerStatus: "ACTIVE",
      // displayOdds is missing
    };

    const expected = {
      data: {
        urn: "urn:test",
        market: "urn:market",
        selectionId: 123,
        status: "ACTIVE",
        odds: undefined,
      },
    };

    const result = normalizer(input);

    expect(result).toEqual(expected);
  });

  it("should handle partial displayOdds correctly", () => {
    const input = {
      runnerURN: "urn:test",
      marketURN: "urn:market",
      selectionId: 123,
      runnerStatus: "ACTIVE",
      displayOdds: {
        decimal: 2.5, // fractional is missing
      },
    };

    const expected = {
      data: {
        urn: "urn:test",
        market: "urn:market",
        selectionId: 123,
        status: "ACTIVE",
        odds: undefined, // Odds should not be partially included
      },
    };

    const result = normalizer(input);

    expect(result).toEqual(expected);
  });

  it("should handle missing odds gracefully", () => {
    const input = {
      runnerURN: "urn:test",
      marketURN: "urn:market",
      selectionId: 123,
      runnerStatus: "ACTIVE",
      // odds is missing
    };

    const expected = {
      data: {
        urn: "urn:test",
        market: "urn:market",
        selectionId: 123,
        status: "ACTIVE",
        trueOdds: undefined,
      },
    };

    const result = normalizer(input);

    expect(result).toEqual(expected);
  });

  it("should handle partial odds correctly", () => {
    const input = {
      runnerURN: "urn:test",
      marketURN: "urn:market",
      selectionId: 123,
      runnerStatus: "ACTIVE",
      odds: {
        decimal: 2.5, // fractional is missing
      },
    };

    const expected = {
      data: {
        urn: "urn:test",
        market: "urn:market",
        selectionId: 123,
        status: "ACTIVE",
        trueOdds: undefined, // Odds should not be partially included
      },
    };

    const result = normalizer(input);

    expect(result).toEqual(expected);
  });
});
