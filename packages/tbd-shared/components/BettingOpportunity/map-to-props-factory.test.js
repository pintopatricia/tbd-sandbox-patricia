import { createEntityByURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createEntityByURNSelector: jest.fn(),
}));

const SELECTION_DETAILS_MOCK = {
  marketUrn: "ppb:sbkMarket:12345",
  runnerUrn: "ppb:sbkMarket:12345/1111",
  silkUrl: "http://silk-url.com",
  trainerName: "Some Trainer",
  jockeyName: "Some Jockey",
};

const POPULAR_BETTING_OPPORTUNITY_MOCK = {
  typename: "PopularBettingOpportunity",
  urn: "ppb:tbd:popular:12345",
  count: 69420,
  selections: [SELECTION_DETAILS_MOCK],
};

const STATE_MOCK = {
  entities: {
    popularbettingopportunities: {
      "ppb:tbd:popular:12345": POPULAR_BETTING_OPPORTUNITY_MOCK,
    },
  },
};

const BETTING_OPPORTUNITY = {
  urn: "pbb:1",
  count: 81,
  selections: [
    { runnerUrn: 1, marketId: "9.1" },
    { runnerUrn: 2, marketId: "9.1" },
  ],
  odds: { decimal: 1.1 },
  name: "packaged-created-bets",
};

const BETTING_OPPORTUNITY_EMPTY_SELECTIONS = {
  urn: "pbb:1",
  count: 81,
  selections: [],
  odds: { decimal: 1.1 },
  name: "packaged-created-bets",
};

describe("map-to-props-factory - BettingOpportunity", () => {
  describe("makeMapStateToProps", () => {
    beforeEach(jest.clearAllMocks);

    describe("when bettingOpportunity is not found in state", () => {
      it("should return empty object", () => {
        createEntityByURNSelector.mockReturnValue(() => null);

        expect(
          makeMapStateToProps()(STATE_MOCK, {
            bettingOppportunityUrn: "123",
            selections: BETTING_OPPORTUNITY.selections,
          }),
        ).toEqual({});
      });
    });

    describe("when bettingOpportunity is found in state", () => {
      describe("and selections are an empty array", () => {
        beforeEach(() => {
          createEntityByURNSelector.mockReturnValue(() => BETTING_OPPORTUNITY_EMPTY_SELECTIONS);
        });
        it("should return empty object", () => {
          expect(makeMapStateToProps()(STATE_MOCK, { bettingOppportunityUrn: "123", selections: [] })).toEqual({});
        });
      });

      describe("and selections are not an empty array", () => {
        beforeEach(() => {
          createEntityByURNSelector.mockReturnValue(() => BETTING_OPPORTUNITY);
        });
        it("should return the correct betting opportunity name", () => {
          const result = makeMapStateToProps()(STATE_MOCK, {
            bettingOppportunityUrn: "123",
            selections: BETTING_OPPORTUNITY.selections,
          });

          expect(result).toEqual({ name: "packaged-created-bets" });
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    beforeEach(jest.clearAllMocks);

    it("should have no dispatchers", () => {
      expect(mapDispatchToProps).toEqual({});
    });
  });
});
