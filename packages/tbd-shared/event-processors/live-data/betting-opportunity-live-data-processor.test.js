import subscribeEvent from "../../event-broker/event-subscriber";
import register from "./betting-opportunity-live-data-processor";
import {
  bettingOpportunityLiveDataResolver,
  subscribeBettingOpportunityLiveData,
} from "./resolvers/betting-opportunity-live-data";

jest.mock("../../event-broker/event-subscriber", () => jest.fn());

jest.mock("./resolvers/betting-opportunity-live-data", () => ({
  bettingOpportunityLiveDataResolver: jest.fn(),
  subscribeBettingOpportunityLiveData: jest.fn(),
}));

describe("betting-opportunity-live-data-processor", () => {
  describe("register", () => {
    beforeEach(() => {
      jest.clearAllMocks();

      register();
    });

    it("should subscribe to betting opportunity live data", () => {
      expect(subscribeBettingOpportunityLiveData).toHaveBeenCalled();
    });

    describe("when event is @@UI/PRICE_BOOST_MULTIPLE_PROMO_CARD_VISIBILITY_CHANGED", () => {
      it("should call bettingOpportunityLiveDataResolver", () => {
        const callback = subscribeEvent.mock.calls[0][1];

        callback({
          visible: true,
          bettingOpportunityUrn: "ppb:market:1",
          bettingOpportunityType: "BOOSTED_BETS",
          bettingOpportunityId: "1",
          selections: [
            {
              marketUrn: "ppb:market:1",
              runnerUrn: "ppb:runner:1",
            },
          ],
          refId: ":ref1:",
        });

        expect(subscribeEvent).toHaveBeenCalledWith(
          "@@UI/PRICE_BOOST_MULTIPLE_PROMO_CARD_VISIBILITY_CHANGED",
          expect.any(Function),
        );
        expect(bettingOpportunityLiveDataResolver).toHaveBeenCalledWith(
          true,
          "ppb:market:1",
          "BOOSTED_BETS",
          "1",
          [{ marketUrn: "ppb:market:1", runnerUrn: "ppb:runner:1" }],
          ":ref1:",
        );
      });
    });
  });
});
