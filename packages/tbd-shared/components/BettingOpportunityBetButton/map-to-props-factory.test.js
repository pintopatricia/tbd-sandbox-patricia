import { createEntityByURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { convertEntityTupleToLegId, isLegInState } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import {
  SUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES,
  UNSUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES,
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { BETTING__SBK_ADD_SELECTIONS } from "@ppb/tbd-store/actions/betting";
import { i18n } from "../../helpers/i18n";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/helpers/sportsbook-betting", () => ({
  convertEntityTupleToLegId: jest.fn(),
  isLegInState: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createEntityByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn((odds, display) => `${odds.decimal}--${display}`),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(),
}));

jest.mock("@ppb/tbd-store/helpers/betting", () => ({
  getUniqueId: jest.fn(() => "uniqueId"),
}));

const STATE_MOCK = {
  entities: {
    preferences: {
      sportsbookOddsDisplay: "decimal",
    },
    sportsbookMarkets: {},
    brandSettings: { SPORTSBOOK_BET_BUTTON_ANIMATION: false },
  },
  betting: {
    sportsbookBetting: {
      legs: {},
    },
  },
};

const BETTING_OPPORTUNITY = {
  urn: "pbb:1",
  type: "BOOSTED_BETS",
  count: 81,
  selections: [
    { runnerUrn: 1, marketId: "9.1" },
    { runnerUrn: 2, marketId: "9.1" },
  ],
  odds: { decimal: 2.2 },
  originalOdds: { decimal: 1.1 },
  id: "bo-1234",
};

const BETTING_OPPORTUNITY_EMPTY_SELECTIONS = {
  urn: "pbb:1",
  count: 81,
  selections: [],
  odds: { decimal: 2.2 },
  originalOdds: { decimal: 1.1 },
};

describe("map-to-props-factory - BettingOpportunityBetButton", () => {
  describe("makeMapStateToProps", () => {
    beforeEach(jest.clearAllMocks);

    beforeEach(() => {
      i18n.mockImplementation(({ key }) => key);
    });

    describe("when bettingOpportunity is not found in state", () => {
      it("should return empty object", () => {
        createEntityByURNSelector.mockReturnValue(() => null);

        expect(
          makeMapStateToProps()(STATE_MOCK, {
            bettingOppportunityUrn: "123",
          }),
        ).toEqual({});
      });
    });

    describe("when bettingOpportunity is found in state", () => {
      beforeEach(() => {
        createEntityByURNSelector.mockReturnValue(() => BETTING_OPPORTUNITY_EMPTY_SELECTIONS);
      });

      describe("and selections are an empty array", () => {
        it("should return empty object", () => {
          expect(makeMapStateToProps()(STATE_MOCK, { bettingOppportunityUrn: "123", selections: [] })).toEqual({});
        });
      });

      describe("and selections is not an empty array", () => {
        beforeEach(() => {
          createEntityByURNSelector.mockReturnValue(() => BETTING_OPPORTUNITY);
          createSportsbookMarketByURNSelector.mockReturnValue(() => {});
        });

        it("should call format odds with the correct value", () => {
          makeMapStateToProps()(STATE_MOCK, {
            bettingOppportunityUrn: "123",
          });

          expect(formatOdds).toHaveBeenCalledWith(BETTING_OPPORTUNITY.odds, "decimal");
          expect(formatOdds).toHaveBeenCalledWith(BETTING_OPPORTUNITY.originalOdds, "decimal");
          expect(formatOdds).toHaveBeenCalledTimes(2);
        });

        it("should call i18n for the required labels", () => {
          makeMapStateToProps()(STATE_MOCK, {
            bettingOppportunityUrn: "123",
          });

          expect(i18n).toHaveBeenCalledTimes(6);
          expect(i18n).toHaveBeenCalledWith({ key: "I18N.POPULAR.ADDED_TO_BETSLIP" });
          expect(i18n).toHaveBeenCalledWith({ key: "I18N.POPULAR.ADD_TO_BETSLIP" });
          expect(i18n).toHaveBeenCalledWith({
            key: "I18N.POPULAR.ADD_TO_BETSLIP_AT",
            interpolationValues: {
              odd: `${BETTING_OPPORTUNITY.odds.decimal}--${STATE_MOCK.entities.preferences.sportsbookOddsDisplay}`,
            },
          });
        });

        it("should return isMultipleOnBetslip as false if market is not found", () => {
          createSportsbookMarketByURNSelector.mockReturnValue(() => null);

          const returnValue = makeMapStateToProps()(STATE_MOCK, {
            bettingOppportunityUrn: "123",
          });

          expect(returnValue.isMultipleOnBetslip).toEqual(false);
        });

        it("should return isMultipleOnBetslip as false if runners aren't found in the market", () => {
          createSportsbookMarketByURNSelector.mockReturnValue(() => ({
            marketId: "9.1",
            runners: [],
          }));

          const returnValue = makeMapStateToProps()(STATE_MOCK, {
            bettingOppportunityUrn: "123",
          });

          expect(returnValue.isMultipleOnBetslip).toEqual(false);
        });

        describe("and market is found and has the bettingOpportunity runners", () => {
          beforeEach(() => {
            createSportsbookMarketByURNSelector.mockReturnValue(() => ({
              marketId: "9.1",
              runners: [
                {
                  urn: 1,
                  selectionId: 1,
                },
                {
                  urn: 2,
                  selectionId: 2,
                },
              ],
            }));
          });

          it("should return isMultipleOnBetslip as false if the legs are not in state", () => {
            isLegInState.mockReturnValue(false);

            const returnValue = makeMapStateToProps()(STATE_MOCK, {
              bettingOppportunityUrn: "123",
            });

            expect(returnValue.isMultipleOnBetslip).toEqual(false);
          });

          describe("and all legs are in state", () => {
            beforeEach(() => {
              convertEntityTupleToLegId.mockImplementation((mId, sId) => `${mId}--${sId}`);
              isLegInState.mockReturnValue(true);
            });

            it("should call convertEntityTupleToLegId with the correct parameters", () => {
              makeMapStateToProps()(STATE_MOCK, {
                bettingOppportunityUrn: "123",
              });

              expect(convertEntityTupleToLegId).toHaveBeenCalledTimes(2);
              expect(convertEntityTupleToLegId).toHaveBeenCalledWith("9.1", 1, "bo-1234");
              expect(convertEntityTupleToLegId).toHaveBeenCalledWith("9.1", 2, "bo-1234");
            });

            it("should call isLegInState with the correct props", () => {
              makeMapStateToProps()(STATE_MOCK, {
                bettingOppportunityUrn: "123",
              });

              expect(isLegInState).toHaveBeenCalledTimes(2);
              expect(isLegInState).toHaveBeenCalledWith("9.1--1", {});
              expect(isLegInState).toHaveBeenCalledWith("9.1--2", {});
            });

            it("should return the expected value", () => {
              createEntityByURNSelector.mockReturnValue(() => ({ ...BETTING_OPPORTUNITY, odds: null }));
              const returnValue = makeMapStateToProps()(STATE_MOCK, {
                bettingOppportunityUrn: "123",
              });

              expect(returnValue).toEqual({
                isMultipleOnBetslip: true,
                bettingOpportunityType: "BOOSTED_BETS",
                bettingOpportunityId: "bo-1234",
                label: "",
                odds: null,
                popularSelections: [
                  { marketId: "9.1", runnerUrn: 1, uniqueId: "uniqueId" },
                  { marketId: "9.1", runnerUrn: 2, uniqueId: "uniqueId" },
                ],
                marketsIds: new Set(["9.1"]),
                isOddsboost: false,
                isBoostedBet: true,
                animated: false,
                accessibilityHints: {
                  default: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT",
                  selected: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT",
                },
                accessibilityLabel: "I18N.ACCESSIBILITY.BET_BUTTON_DEFAULT",
              });
            });

            describe("and is BOOSTED_BETS", () => {
              it("should call convertEntityTupleToLegId with id as groupId", () => {
                createEntityByURNSelector.mockReturnValue(() => ({
                  ...BETTING_OPPORTUNITY,
                  type: "BOOSTED_BETS",
                  odds: null,
                }));
                makeMapStateToProps()(STATE_MOCK, {
                  bettingOppportunityUrn: "123",
                });

                expect(convertEntityTupleToLegId).toHaveBeenCalledTimes(2);
                expect(convertEntityTupleToLegId).toHaveBeenCalledWith("9.1", 1, "bo-1234");
                expect(convertEntityTupleToLegId).toHaveBeenCalledWith("9.1", 2, "bo-1234");
              });

              describe("and showWasPrice is false", () => {
                it("should not return secondary label", () => {
                  createEntityByURNSelector.mockReturnValue(() => ({
                    ...BETTING_OPPORTUNITY,
                    type: "BOOSTED_BETS",
                    odds: null,
                  }));
                  const { secondaryLabel } = makeMapStateToProps()(STATE_MOCK, {
                    bettingOppportunityUrn: "123",
                    showWasPrice: false,
                  });

                  expect(secondaryLabel).toBe(undefined);
                });

                it("should return correct isOddsBoost and correct isBoostedBet", () => {
                  createEntityByURNSelector.mockReturnValue(() => ({
                    ...BETTING_OPPORTUNITY,
                    type: "BOOSTED_BETS",
                    odds: null,
                  }));
                  const { isOddsboost, isBoostedBet } = makeMapStateToProps()(STATE_MOCK, {
                    bettingOppportunityUrn: "123",
                    showWasPrice: false,
                  });

                  expect(isOddsboost).toBe(false);
                  expect(isBoostedBet).toBe(true);
                });
              });

              describe("and showWasPrice is true", () => {
                it("should return correct secondary label", () => {
                  createEntityByURNSelector.mockReturnValue(() => ({
                    ...BETTING_OPPORTUNITY,
                    type: "BOOSTED_BETS",
                    odds: null,
                  }));
                  const { secondaryLabel } = makeMapStateToProps()(STATE_MOCK, {
                    bettingOppportunityUrn: "123",
                    showWasPrice: true,
                  });

                  expect(secondaryLabel).toBe("1.1--decimal");
                });

                it("should return correct isOddsboost", () => {
                  createEntityByURNSelector.mockReturnValue(() => ({
                    ...BETTING_OPPORTUNITY,
                    type: "BOOSTED_BETS",
                    odds: null,
                  }));
                  const { isOddsboost } = makeMapStateToProps()(STATE_MOCK, {
                    bettingOppportunityUrn: "123",
                    showWasPrice: true,
                  });

                  expect(isOddsboost).toBe(true);
                });
              });
            });
          });
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    beforeEach(jest.clearAllMocks);

    describe("dispatchSubscribeBettingOpportunityPrice", () => {
      it("should dispatch a price subscription", () => {
        const { dispatchSubscribeBettingOpportunityPrice } = mapDispatchToProps;
        const bettingOppportunityUrn = "ppb:tbd:popular:12345";

        expect(dispatchSubscribeBettingOpportunityPrice(bettingOppportunityUrn)).toEqual({
          type: SUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES,
          payload: {
            bettingOppportunityUrn,
          },
        });
      });
    });

    describe("dispatchUnsubscribeBettingOpportunityPrice", () => {
      it("should dispatch a price unsubscription", () => {
        const { dispatchUnsubscribeBettingOpportunityPrice } = mapDispatchToProps;
        const bettingOppportunityUrn = "ppb:tbd:popular:12345";

        expect(dispatchUnsubscribeBettingOpportunityPrice(bettingOppportunityUrn)).toEqual({
          type: UNSUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES,
          payload: {
            bettingOppportunityUrn,
          },
        });
      });
    });

    describe("dispatchAddRemoveSelections", () => {
      it("should dispatch an add selections", () => {
        const { dispatchAddRemoveSelections } = mapDispatchToProps;
        const selections = "RandomSelections";

        expect(dispatchAddRemoveSelections(selections)).toEqual({
          type: BETTING__SBK_ADD_SELECTIONS,
          payload: {
            selections,
            group: "REAL",
          },
        });
      });
    });
    describe("dispatchAddRemoveSelections with boosted identification", () => {
      it("should dispatch an add selections with correct params", () => {
        const { dispatchAddRemoveSelections } = mapDispatchToProps;
        const selections = "RandomSelections";

        expect(
          dispatchAddRemoveSelections(selections, "card:urn", { decimal: 1.1 }, "bo-1234", "BOOSTED_BETS"),
        ).toEqual({
          type: BETTING__SBK_ADD_SELECTIONS,
          payload: {
            selections,
            group: "REAL",
            bettingOpportunityId: "bo-1234",
            bettingOpportunityType: "BOOSTED_BETS",
            cardUrn: "card:urn",
            odds: { decimal: 1.1 },
          },
        });
      });
    });
  });

  describe("dispatchSubscribeMarketsUpdates", () => {
    it("should dispatch subscribe market updates", () => {
      const { dispatchSubscribeMarketsUpdates } = mapDispatchToProps;
      const marketId = "marketId";

      expect(dispatchSubscribeMarketsUpdates(marketId)).toEqual({
        type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: {
          marketId,
        },
      });
    });
  });

  describe("dispatchUnsubscribeMarketsUpdates", () => {
    it("should dispatch unsubscribe market updates", () => {
      const { dispatchUnsubscribeMarketsUpdates } = mapDispatchToProps;
      const marketId = "marketId";

      expect(dispatchUnsubscribeMarketsUpdates(marketId)).toEqual({
        type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
        payload: {
          marketId,
        },
      });
    });
  });
});
