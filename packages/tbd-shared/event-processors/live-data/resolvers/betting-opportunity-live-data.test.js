import BettingOpportunityPricesObservable from "@ppb/tbd-store/middlewares/betting-opportunity-prices-observable";
import {
  bettingOpportunityLiveDataResolver,
  subscribeBettingOpportunityLiveData,
} from "./betting-opportunity-live-data";
import { getApolloClient } from "../../../apollo-client/client";

jest.mock("../../../apollo-client/client", () => {
  const writeFragmentMock = jest.fn();

  return {
    getApolloClient: jest.fn().mockReturnValue({
      cache: {
        writeFragment: writeFragmentMock,
        identify: jest.fn().mockReturnValue("PopularBettingOpportunity:1"),
      },
    }),
  };
});

jest.mock(
  "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/model/PriceBoostMultiplePromoCard.graphql",
  () => ({
    PriceBoostMultiplePromoCardCombinedOddsFragment: "PriceBoostMultiplePromoCardCombinedOddsFragmentMock",
  }),
);

jest.mock("@ppb/tbd-store/middlewares/betting-opportunity-prices-observable", () => ({
  bettingOpportunityPricesObservable: jest.fn(),
}));

jest.mock("../../../event-broker/event-subscriber", () => ({
  subscribeEvent: jest.fn(),
}));

jest.mock("@ppb/tbd-store/middlewares/betting-opportunity-prices-observable", () => ({
  getInstance: jest.fn().mockReturnValue({
    subscribe: jest.fn(),
    addBettingOpportunity: jest.fn(),
    removeBettingOpportunity: jest.fn(),
  }),
}));

describe("betting-opportunity-live-data", () => {
  let bettingOpportunityPricesObservable;

  beforeEach(() => {
    bettingOpportunityPricesObservable = BettingOpportunityPricesObservable.getInstance();
    jest.clearAllMocks();
  });

  describe("subscribeBettingOpportunityLiveData", () => {
    it("should subscribe to bettingOpportunityPricesObservable", () => {
      subscribeBettingOpportunityLiveData();

      const callback = bettingOpportunityPricesObservable.subscribe.mock.calls[0][0];

      callback({
        updates: {
          results: [
            {
              betCombinations: [
                {
                  combinationGroupId: "1",
                  winAvgOdds: {
                    decimalDisplayOdds: {
                      decimalOdds: 1.0,
                    },
                  },
                  originalWinAvgOdds: { decimalDisplayOdds: { decimalOdds: 1.0 } },
                },
              ],
            },
          ],
          combinationGroups: {
            1: "ppb:betting-opportunity:1",
          },
        },
      });

      expect(bettingOpportunityPricesObservable.subscribe).toHaveBeenCalled();
      expect(getApolloClient().cache.identify).toHaveBeenCalledWith({
        __typename: "PopularBettingOpportunity",
        urn: "ppb:betting-opportunity:1",
        id: "1",
      });
      expect(getApolloClient().cache.writeFragment).toHaveBeenCalledWith({
        fragment: "PriceBoostMultiplePromoCardCombinedOddsFragmentMock",
        id: "PopularBettingOpportunity:1",
        data: {
          __typename: "PopularBettingOpportunity",
          urn: "ppb:betting-opportunity:1",
          odds: {
            decimal: 1.0,
            fractional: null,
            american: null,
          },
          originalOdds: {
            decimal: 1.0,
            fractional: null,
            american: null,
          },
        },
      });
    });
  });

  describe("bettingOpportunityLiveDataResolver", () => {
    it("should call bettingOpportunityPricesObservable.addBettingOpportunity when visible", () => {
      bettingOpportunityLiveDataResolver(
        true,
        "ppb:tbd:betting-opportunity:1",
        "BOOSTED_BETS",
        "1",
        [{ marketUrn: "ppb:market:1", runnerUrn: "ppb:sbkRunner:1/1" }],
        ":ref1:",
      );

      expect(bettingOpportunityPricesObservable.addBettingOpportunity).toHaveBeenCalledWith({
        bettingOpportunityId: "1",
        bettingOpportunityType: "BOOSTED_BETS",
        bettingOpportunityUrn: "ppb:tbd:betting-opportunity:1",
        selections: [
          {
            marketId: "1",
            selectionId: 1,
          },
        ],
        subscriberId: ":ref1:",
      });
    });

    it("should call bettingOpportunityPricesObservable.removeBettingOpportunity when not visible", () => {
      bettingOpportunityLiveDataResolver(
        false,
        "ppb:tbd:betting-opportunity:1",
        "BOOSTED_BETS",
        "1",
        [{ marketUrn: "ppb:market:1", runnerUrn: "ppb:runner:1" }],
        ":ref1:",
      );
      expect(bettingOpportunityPricesObservable.removeBettingOpportunity).toHaveBeenCalledWith(
        "ppb:tbd:betting-opportunity:1",
        ":ref1:",
      );
    });
  });
});
