import { Product } from "../../../entities/user-preferences/UserPreferences.types";
import { createHasEventMarketCardByCompetitionURNSelector } from "./event-market-cards-selectors";

const mockState = {
  eventMarketCards: {
    "event:a": { competition: "competition:1", displayRunners: { exchange: ["runner 1", "runner 2"] } },
    "event:b": { competition: "competition:2", displayRunners: { sportsbook: ["runner 1", "runner 2"] } },
  },
};

describe('"event market card" selectors', () => {
  describe("createHasEventMarketCardByCompetitionURNSelector", () => {
    it("should be a function factory", () => {
      const hasEventMarketCardByCompetitionURN = createHasEventMarketCardByCompetitionURNSelector();
      expect(hasEventMarketCardByCompetitionURN).toEqual(expect.any(Function));
      expect(hasEventMarketCardByCompetitionURN).not.toBe(createHasEventMarketCardByCompetitionURNSelector());
    });

    describe("when state does not change", () => {
      it("should not recompute the selector", () => {
        const hasEventMarketCardByCompetitionURN = createHasEventMarketCardByCompetitionURNSelector();
        hasEventMarketCardByCompetitionURN(mockState.eventMarketCards, "competition:urn:3", Product.Exchange);
        hasEventMarketCardByCompetitionURN(mockState.eventMarketCards, "competition:urn:3", Product.Exchange);

        expect(hasEventMarketCardByCompetitionURN.recomputations()).toEqual(1);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const hasEventMarketCardByCompetitionURN = createHasEventMarketCardByCompetitionURNSelector();
        hasEventMarketCardByCompetitionURN(mockState.eventMarketCards, "competition:urn:3", Product.Exchange);
        hasEventMarketCardByCompetitionURN({ ...mockState.eventMarketCards }, "competition:urn:3", Product.Exchange);

        expect(hasEventMarketCardByCompetitionURN.recomputations()).toEqual(2);
      });
    });

    describe("when no event market cards are available on store", () => {
      it("should return false", () => {
        expect(createHasEventMarketCardByCompetitionURNSelector()([], "competition:urn", Product.Exchange)).toEqual(
          false,
        );
      });
    });

    describe("when no event market card with desired competition urn is available on store", () => {
      it("should return false", () => {
        expect(
          createHasEventMarketCardByCompetitionURNSelector()(
            mockState.eventMarketCards,
            "competition:urn:3",
            Product.Exchange,
          ),
        ).toEqual(false);
      });
    });

    describe("when event market card is available on store", () => {
      describe("when product is exchange", () => {
        describe("when event market card does not have exchange display runners", () => {
          it("should return false", () => {
            expect(
              createHasEventMarketCardByCompetitionURNSelector()(
                mockState.eventMarketCards,
                "competition:2",
                Product.Exchange,
              ),
            ).toEqual(false);
          });
        });

        describe("when event market card have exchange display runners", () => {
          it("should return true", () => {
            expect(
              createHasEventMarketCardByCompetitionURNSelector()(
                mockState.eventMarketCards,
                "competition:1",
                Product.Exchange,
              ),
            ).toEqual(true);
          });
        });
      });

      describe("when product is sportsbook", () => {
        describe("when event market card does not have sportsbook display runners", () => {
          it("should return false", () => {
            expect(
              createHasEventMarketCardByCompetitionURNSelector()(
                mockState.eventMarketCards,
                "competition:1",
                Product.Sportsbook,
              ),
            ).toEqual(false);
          });
        });

        describe("when event market card have sportsbook display runners", () => {
          it("should return true", () => {
            expect(
              createHasEventMarketCardByCompetitionURNSelector()(
                mockState.eventMarketCards,
                "competition:2",
                Product.Sportsbook,
              ),
            ).toEqual(true);
          });
        });
      });
    });
  });
});
