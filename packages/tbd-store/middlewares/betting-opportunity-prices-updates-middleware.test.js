import BettingOpportunityPricesObservable from "./betting-opportunity-prices-observable";
import { bettingOpportunityPricesMiddleware } from "./betting-opportunity-prices-updates-middleware";

const dispatchSpy = jest.fn();
const getStateSpy = jest.fn(() => ({
  entities: {
    popularbettingopportunities: {
      "ppb:tbd:popular:12345": {
        urn: "ppb:tbd:popular:12345",
        selections: [],
      },
    },
  },
}));
const nextSpy = jest.fn();

const subscribeSpy = jest.fn(() => "");
const addBettingOpportunitySpy = jest.fn(() => {});
const removeBettingOpportunitySpy = jest.fn(() => {});
const resetBettingOpportunitiesSpy = jest.fn(() => {});

jest.mock("./betting-opportunity-prices-observable", () => ({
  getInstance: jest.fn(() => ({
    subscribe: jest.fn(() => ""),
  })),
}));

jest.mock("../state/entities/entities-selectors", () => ({
  createEntityByURNSelector: jest.fn(() =>
    jest.fn(() => ({
      urn: "ppb:tbd:popular:12345",
      type: "bettingOpportunityType1",
      id: "bettingOpportunityId1",
      selections: [
        {
          marketUrn: "ppb:tbd:sportsbook:market:9.1111",
          runnerUrn: "ppb:tbd:sportsbook:runner:9.1111/12345",
        },
      ],
    })),
  ),
}));

async function setup() {
  BettingOpportunityPricesObservable.getInstance.mockReturnValue({
    subscribe: subscribeSpy,
    addBettingOpportunity: addBettingOpportunitySpy,
    removeBettingOpportunity: removeBettingOpportunitySpy,
    resetBettingOpportunities: resetBettingOpportunitiesSpy,
  });
}

describe("Betting Opportunity Prices Updates middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should dispatch a FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS action when the bettingOpportunityPricesObservable is notified", async () => {
    setup();

    await bettingOpportunityPricesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)({
      type: "",
      payload: {},
    });

    const callback = subscribeSpy.mock.calls[0][0];

    callback({
      updates: {
        results: ["implyBetsResult1"],
        combinationGroups: [1],
      },
    });

    expect(subscribeSpy).toHaveBeenCalled();
    expect(dispatchSpy).toHaveBeenCalledWith({
      type: "FETCH_BETTING_OPPORTUNITY_PRICE_UPDATES_SUCCESS",
      payload: {
        result: "implyBetsResult1",
        combinationGroups: [1],
      },
    });
  });

  describe("and action type is 'SUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES'", () => {
    it("should add the new subscription to the bettingOpportunityPricesObservable", async () => {
      setup();

      await bettingOpportunityPricesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)({
        type: "SUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES",
        payload: {},
      });

      expect(addBettingOpportunitySpy).toHaveBeenCalledWith({
        bettingOpportunityUrn: "ppb:tbd:popular:12345",
        bettingOpportunityType: "bettingOpportunityType1",
        bettingOpportunityId: "bettingOpportunityId1",
        selections: [
          {
            marketId: "9.1111",
            selectionId: 12345,
          },
        ],
        subscriberId: "betting-opportunity-prices-updates-middleware",
      });
    });
  });

  describe("and action type is 'UNSUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES'", () => {
    it("should remove the subscription to the bettingOpportunityPricesObservable", async () => {
      setup();

      await bettingOpportunityPricesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)({
        type: "UNSUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES",
        payload: {
          bettingOppportunityUrn: "ppb:tbd:popular:12345",
        },
      });
      expect(removeBettingOpportunitySpy).toHaveBeenCalledWith(
        "ppb:tbd:popular:12345",
        "betting-opportunity-prices-updates-middleware",
      );
    });
  });

  describe("and action type is 'PUSH'", () => {
    it("should remove all subscriptions", async () => {
      setup();

      await bettingOpportunityPricesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)({
        type: "Router/push",
      });
      expect(resetBettingOpportunitiesSpy).toHaveBeenCalledWith();
    });
  });

  describe("and action type is 'UI__SWITCH_PRODUCT_PREFERENCE'", () => {
    it("should remove all subscriptions", async () => {
      setup();

      await bettingOpportunityPricesMiddleware({ dispatch: dispatchSpy, getState: getStateSpy })(nextSpy)({
        type: "UI/SWITCH_PRODUCT_PREFERENCE",
      });
      expect(resetBettingOpportunitiesSpy).toHaveBeenCalledWith();
    });
  });
});
