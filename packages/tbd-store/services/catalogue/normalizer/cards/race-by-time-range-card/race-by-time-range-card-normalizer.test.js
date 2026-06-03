import normalizeByTimeRangeCardFragmentIntoByTimeRangeCard from "./race-by-time-range-card-normalizer";

jest.mock("../../entities/race/race-normalizer", () =>
  jest.fn(() => ({
    data: {
      urn: "mocked-race-urn",
    },
  })),
);

const BFF_RESPONSE = {
  __typename: "ByTimeRangeCard",
  urn: "ppb:tbd:card:byTimeRange:7|30266486.1930",
  race: {
    urn: "ppb:race:30266486.1930",
    startTime: "2020-11-12T17:00:00.000Z",
  },
  viewLink: {
    viewUrl: "horse-racing/tpara-(us)-3rd-feb/r-7%7C30266486.1930",
    viewUrn: "ppb:tbd:view:race:7|30266486.1930",
  },
  marketPromo: {
    signposting: "EXTRA_PLACES",
  },
  winner: "Shakalakaboomboom",
  winnerIsp: {
    favourite: true,
    decimal: 2.5,
    fractional: {
      numerator: 3,
      denominator: 2,
    },
  },
};

describe("By time range card normalizer", () => {
  describe("normalizeByTimeRangeCardFragmentIntoByTimeRangeCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeByTimeRangeCardFragmentIntoByTimeRangeCard(BFF_RESPONSE);

      expect(data).toStrictEqual({
        typename: "ByTimeRangeCard",
        urn: "ppb:tbd:card:byTimeRange:7|30266486.1930",
        race: "ppb:race:30266486.1930",
        startTime: "2020-11-12T17:00:00.000Z",
        viewLink: {
          viewUrl: "horse-racing/tpara-(us)-3rd-feb/r-7%7C30266486.1930",
          viewUrn: "ppb:tbd:view:race:7|30266486.1930",
        },
        marketPromo: "EXTRA_PLACES",
        winner: "Shakalakaboomboom",
        winnerIsp: {
          favourite: true,
          decimal: 2.5,
          fractional: {
            numerator: 3,
            denominator: 2,
          },
        },
      });
    });
  });
});
