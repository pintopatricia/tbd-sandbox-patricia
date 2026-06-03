import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createSportsbookRunnerWithBettingLegStateByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-runners/sportsbook-runner-selectors";
import {
  UI__MARKET_SBK_BET_BUTTON_CLICK,
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BETTING__SBK_TOGGLE_LEG_ACTION,
} from "@ppb/tbd-store/actions/betting";

import { UI__CLOSED_SBK_CLICK, UI__SUSPENDED_SBK_CLICK } from "@ppb/tbd-store/actions/sportsbook-markets";
import {
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
  UI__BETSLIP_OPEN,
  UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
} from "@ppb/tbd-store/actions/betslip";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";

const sportsbookMarket = {
  typename: "SportsbookMarket",
  urn: "ppb:sbkMarket:924.1",
  sport: {
    name: "Football",
    urn: "ppb:eventType:1",
  },
  name: "Friday Featured OddsBoosts",
  marketId: "924.1",
  marketType: "DAILY_POWER_PRICES",
  status: "OPEN",
  oddsboost: true,
  animated: false,
  bspMarket: false,
  runners: [{ urn: "ppb:sbkRunner:924.1/1", selectionId: 1, name: "runnerName", handicap: 0 }],
  bettingType: "ODDS",
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:12345`,
    },
  },
};

const getSportsbookMarketByURN = jest.fn(() => sportsbookMarket);

const runner = {
  urn: "ppb:sbkRunner:924.1/1",
  market: "ppb:sbkMarket:924.1",
  selectionId: 1,
  status: "ACTIVE",
  isPotentialBet: false,
  isStartingPrice: false,
  odds: { decimal: 1.1 },
  previousOdds: [{ decimal: 1.08 }],
};

const getSportsbookRunnerWithBettingLegStateByURN = jest.fn(() => runner);

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: jest.fn(() => getSportsbookMarketByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-runners/sportsbook-runner-selectors", () => ({
  createSportsbookRunnerWithBettingLegStateByURNSelector: jest.fn(() => getSportsbookRunnerWithBettingLegStateByURN),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("@ppb/tbd-store/helpers/formatters", () => ({
  formatOdds: jest.fn(() => "formatOdds mock"),
}));

jest.mock("@ppb/the-wall-common/types", () => ({
  BetButtonTheme: { DARK: "DARK", ODDS_BOOST: "ODDS_BOOST", REGULAR: "REGULAR" },
}));

jest.mock("@ppb/tbd-store/helpers/betting");

const state = {
  entities: {
    sportsbookmarkets: {},
    preferences: { sportsbookOddsDisplay: {} },
    brandSettings: { SPORTSBOOK_BET_BUTTON_ANIMATION: false },
  },
  betslip: { isCollapsed: false },
};

const setupMapStateToProps = (
  runnerUrn,
  marketUrn,
  displayPreviousOdd,
  cardUrn,
  handicapLabel,
  animated,
  oddsboost,
  struckThrough,
  status,
  isSecondaryLabelRunnerName = false,
  isSecondaryLabelUppercase = false,
) => {
  const containerProps = {
    animated,
    oddsboost,
    struckThrough,
    status,
    runnerUrn,
    marketUrn,
    displayPreviousOdd,
    cardUrn,
    handicapLabel,
    isSecondaryLabelRunnerName,
    isSecondaryLabelUppercase,
  };

  return makeMapStateToProps()(state, containerProps);
};

describe("SportsbookBetButton map-to-props-factory", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    it("should create the selectors", () => {
      makeMapStateToProps();
      expect(createSportsbookRunnerWithBettingLegStateByURNSelector).toHaveBeenCalledTimes(1);
      expect(createSportsbookMarketByURNSelector).toHaveBeenCalledTimes(1);
    });

    describe("mapStateToProps", () => {
      it("should get data from state and return the correct props", () => {
        const stateProps = setupMapStateToProps(
          "ppb:sbkRunner:924.1/1",
          "ppb:sbkMarket:924.1",
          false,
          "cardUrn",
          "handicap",
        );

        expect(getSportsbookMarketByURN).toHaveBeenCalledWith(state.entities.sportsbookmarkets, "ppb:sbkMarket:924.1");
        expect(getSportsbookRunnerWithBettingLegStateByURN).toHaveBeenCalledWith(state, {
          marketUrn: "ppb:sbkMarket:924.1",
          runnerUrn: "ppb:sbkRunner:924.1/1",
        });
        expect(stateProps).toEqual(
          expect.objectContaining({
            oddsboost: undefined,
            label: "formatOdds mock",
            odds: { decimal: 1.1 },
            secondaryLabel: undefined,
            isBetslipCollapsed: false,
            struckThrough: true,
            animated: false,
            status: "default",
            toastMessageStatus: undefined,
            handicapLabel: "handicap",
            accessibilityHints: {
              default: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT",
              selected: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT",
            },
            accessibilityLabel: "I18N.ACCESSIBILITY.TEAM_TO_WIN",
          }),
        );
      });

      it("should return closed toastMessageStatus if market status is CLOSED", () => {
        getSportsbookMarketByURN.mockReturnValueOnce({ ...sportsbookMarket, status: "CLOSED" });
        const stateProps = setupMapStateToProps(
          "ppb:sbkRunner:924.1/1",
          "ppb:sbkMarket:924.1",
          false,
          "cardUrn",
          "handicap",
        );

        expect(stateProps).toEqual(
          expect.objectContaining({
            toastMessageStatus: "CLOSED",
            label: "-",
            odds: { decimal: 1.1 },
          }),
        );
      });

      it("should return closed toastMessageStatus if runner status is REMOVED", () => {
        getSportsbookRunnerWithBettingLegStateByURN.mockReturnValueOnce({ ...runner, status: "REMOVED" });
        const stateProps = setupMapStateToProps(
          "ppb:sbkRunner:924.1/1",
          "ppb:sbkMarket:924.1",
          false,
          "cardUrn",
          "handicap",
        );

        expect(stateProps).toEqual(
          expect.objectContaining({
            toastMessageStatus: "CLOSED",
            label: "-",
            odds: { decimal: 1.1 },
          }),
        );
      });

      it("should return suspended toastMessageStatus if market status is SUSPENDED", () => {
        getSportsbookMarketByURN.mockReturnValueOnce({ ...sportsbookMarket, status: "SUSPENDED" });
        const stateProps = setupMapStateToProps(
          "ppb:sbkRunner:924.1/1",
          "ppb:sbkMarket:924.1",
          false,
          "cardUrn",
          "handicap",
        );

        expect(stateProps).toEqual(
          expect.objectContaining({
            toastMessageStatus: "SUSPENDED",
            label: "-",
            odds: { decimal: 1.1 },
          }),
        );
      });

      it("should return suspended toastMessageStatus if runner status is SUSPENDED", () => {
        getSportsbookRunnerWithBettingLegStateByURN.mockReturnValueOnce({ ...runner, status: "SUSPENDED" });
        const stateProps = setupMapStateToProps(
          "ppb:sbkRunner:924.1/1",
          "ppb:sbkMarket:924.1",
          false,
          "cardUrn",
          "handicap",
        );

        expect(stateProps).toEqual(
          expect.objectContaining({
            toastMessageStatus: "SUSPENDED",
            label: "-",
            odds: { decimal: 1.1 },
          }),
        );
      });

      it(`should return suspended toastMessageStatus if runner status is ACTIVE
       but has no odds, it is not a bsp market and it is not a starting price`, () => {
        getSportsbookMarketByURN.mockReturnValueOnce({ ...sportsbookMarket, bspMarket: false });
        getSportsbookRunnerWithBettingLegStateByURN.mockReturnValueOnce({
          ...runner,
          status: "ACTIVE",
          odds: undefined,
          isStartingPrice: false,
        });
        const stateProps = setupMapStateToProps(
          "ppb:sbkRunner:924.1/1",
          "ppb:sbkMarket:924.1",
          false,
          "cardUrn",
          "handicap",
        );

        expect(stateProps).toEqual(
          expect.objectContaining({
            toastMessageStatus: "SUSPENDED",
            label: "-",
            odds: undefined,
          }),
        );
      });

      describe("when isInlineMarketTemplate", () => {
        describe("when found a runner to get the name", () => {
          it("should get data from state and return the correct props", () => {
            const stateProps = setupMapStateToProps(
              "ppb:sbkRunner:924.1/1",
              "ppb:sbkMarket:924.1",
              false,
              "cardUrn",
              "handicap",
              true,
            );

            expect(getSportsbookMarketByURN).toHaveBeenCalledWith(
              state.entities.sportsbookmarkets,
              "ppb:sbkMarket:924.1",
            );
            expect(getSportsbookRunnerWithBettingLegStateByURN).toHaveBeenCalledWith(state, {
              marketUrn: "ppb:sbkMarket:924.1",
              runnerUrn: "ppb:sbkRunner:924.1/1",
            });
            expect(stateProps).toEqual(
              expect.objectContaining({
                oddsboost: undefined,
                label: "formatOdds mock",
                odds: { decimal: 1.1 },
                secondaryLabel: undefined,
                isBetslipCollapsed: false,
                struckThrough: true,
                animated: false,
                status: "default",
                toastMessageStatus: undefined,
                handicapLabel: "handicap",
                accessibilityHints: {
                  default: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT",
                  selected: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT",
                },
                accessibilityLabel: "I18N.ACCESSIBILITY.TEAM_TO_WIN",
              }),
            );
          });
        });

        describe("when not found a runner to get the name", () => {
          it("should get data from state and return the correct props", () => {
            const stateProps = setupMapStateToProps(
              "ppb:sbkRunner:924.1/123",
              "ppb:sbkMarket:924.1",
              false,
              "cardUrn",
              "handicap",
              true,
            );

            expect(getSportsbookMarketByURN).toHaveBeenCalledWith(
              state.entities.sportsbookmarkets,
              "ppb:sbkMarket:924.1",
            );
            expect(getSportsbookRunnerWithBettingLegStateByURN).toHaveBeenCalledWith(state, {
              marketUrn: "ppb:sbkMarket:924.1",
              runnerUrn: "ppb:sbkRunner:924.1/123",
            });
            expect(stateProps).toEqual(
              expect.objectContaining({
                oddsboost: undefined,
                label: "formatOdds mock",
                odds: { decimal: 1.1 },
                secondaryLabel: undefined,
                isBetslipCollapsed: false,
                struckThrough: true,
                animated: false,
                status: "default",
                toastMessageStatus: undefined,
                handicapLabel: "handicap",
                accessibilityHints: {
                  default: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT",
                  selected: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT",
                },
                accessibilityLabel: "I18N.ACCESSIBILITY.TEAM_TO_WIN",
              }),
            );
          });
        });
      });

      describe("when isSecondaryLabelUppercase", () => {
        it("should return secondaryLabel in AllCaps", () => {
          const stateProps = setupMapStateToProps(
            "ppb:sbkRunner:924.1/1",
            "ppb:sbkMarket:924.1",
            false,
            "cardUrn",
            "handicap",
            true,
            true,
          );

          expect(stateProps).toEqual(
            expect.objectContaining({
              oddsboost: undefined,
              label: "formatOdds mock",
              odds: { decimal: 1.1 },
              secondaryLabel: undefined,
              isBetslipCollapsed: false,
              struckThrough: true,
              animated: false,
              status: "default",
              toastMessageStatus: undefined,
              handicapLabel: "handicap",
              accessibilityHints: {
                default: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT",
                selected: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT",
              },
              accessibilityLabel: "I18N.ACCESSIBILITY.TEAM_TO_WIN",
            }),
          );
        });
      });

      describe("secondaryLabel", () => {
        describe("when displayPreviousOdd is false", () => {
          it("should return secondaryLabel as undefined", () => {
            const stateProps = setupMapStateToProps(
              "ppb:sbkRunner:924.1/1",
              "ppb:sbkMarket:924.1",
              false,
              "cardUrn",
              "handicap",
            );

            expect(stateProps).toEqual(
              expect.objectContaining({
                secondaryLabel: undefined,
              }),
            );
          });
        });

        describe("when displayPreviousOdd is true", () => {
          describe("when MarketType is not ODDSBOOST", () => {
            it("should return secondaryLabel as undefined", () => {
              getSportsbookMarketByURN.mockReturnValueOnce({ ...sportsbookMarket, oddsboost: false });
              const stateProps = setupMapStateToProps(
                "ppb:sbkRunner:924.1/1",
                "ppb:sbkMarket:924.1",
                true,
                "cardUrn",
                "handicap",
              );

              expect(stateProps).toEqual(
                expect.objectContaining({
                  secondaryLabel: undefined,
                }),
              );
            });
          });

          describe("when MarketType is ODDSBOOST", () => {
            it("should return secondaryLabel correctly", () => {
              const stateProps = setupMapStateToProps(
                "ppb:sbkRunner:924.1/1",
                "ppb:sbkMarket:924.1",
                true,
                "cardUrn",
                "handicap",
              );

              expect(stateProps).toEqual(
                expect.objectContaining({
                  animated: false,
                  handicapLabel: "handicap",
                  isBetslipCollapsed: false,
                  label: "formatOdds mock",
                  odds: { decimal: 1.1 },
                  oddsboost: undefined,
                  secondaryLabel: undefined,
                  status: "default",
                  struckThrough: true,
                  toastMessageStatus: undefined,
                }),
              );
            });
          });
        });

        describe("when displayPreviousOdd is undefined", () => {
          describe("when MarketType is not ODDSBOOST", () => {
            it("should return secondaryLabel as undefined", () => {
              getSportsbookMarketByURN.mockReturnValueOnce({ ...sportsbookMarket, oddsboost: false });
              const stateProps = setupMapStateToProps(
                "ppb:sbkRunner:924.1/1",
                "ppb:sbkMarket:924.1",
                undefined,
                "cardUrn",
                "handicap",
              );

              expect(stateProps).toEqual(
                expect.objectContaining({
                  secondaryLabel: undefined,
                }),
              );
            });
          });

          describe("when MarketType is ODDSBOOST", () => {
            it("should return secondaryLabel correctly", () => {
              const stateProps = setupMapStateToProps(
                "ppb:sbkRunner:924.1/1",
                "ppb:sbkMarket:924.1",
                undefined,
                "cardUrn",
                "handicap",
              );

              expect(stateProps).toEqual(
                expect.objectContaining({
                  animated: false,
                  handicapLabel: "handicap",
                  isBetslipCollapsed: false,
                  label: "formatOdds mock",
                  odds: { decimal: 1.1 },
                  oddsboost: undefined,
                  secondaryLabel: undefined,
                  status: "default",
                  struckThrough: true,
                  toastMessageStatus: undefined,
                }),
              );
            });
          });
        });
      });
    });
  });

  describe("buttonStatus", () => {
    it("should return 'selected'' if the runner is a potential bet", () => {
      getSportsbookRunnerWithBettingLegStateByURN.mockReturnValueOnce({ ...runner, isPotentialBet: true });

      const stateProps = setupMapStateToProps(
        "ppb:sbkRunner:924.1/1",
        "ppb:sbkMarket:924.1",
        false,
        "cardUrn",
        "handicap",
      );

      expect(stateProps).toEqual(
        expect.objectContaining({
          animated: false,
          handicapLabel: "handicap",
          isBetslipCollapsed: false,
          label: "formatOdds mock",
          odds: { decimal: 1.1 },
          oddsboost: undefined,
          secondaryLabel: undefined,
          status: "selected",
          struckThrough: true,
          toastMessageStatus: undefined,
        }),
      );
    });

    it("should return 'closed' if the market status is CLOSED", () => {
      getSportsbookMarketByURN.mockReturnValueOnce({
        ...sportsbookMarket,
        status: "CLOSED",
        oddsboost: false,
      });
      const stateProps = setupMapStateToProps(
        "ppb:sbkRunner:924.1/1",
        "ppb:sbkMarket:924.1",
        false,
        "cardUrn",
        "handicap",
      );

      expect(stateProps).toEqual(
        expect.objectContaining({
          animated: false,
          handicapLabel: "handicap",
          isBetslipCollapsed: false,
          label: "-",
          odds: { decimal: 1.1 },
          oddsboost: undefined,
          secondaryLabel: undefined,
          status: "closed",
          struckThrough: true,
          toastMessageStatus: "CLOSED",
        }),
      );
    });

    it("should return 'closed' if the runner status is REMOVED", () => {
      getSportsbookMarketByURN.mockReturnValueOnce({ ...sportsbookMarket, oddsboost: false });
      getSportsbookRunnerWithBettingLegStateByURN.mockReturnValueOnce({ ...runner, status: "REMOVED" });
      const stateProps = setupMapStateToProps(
        "ppb:sbkRunner:924.1/1",
        "ppb:sbkMarket:924.1",
        false,
        "cardUrn",
        "handicap",
      );

      expect(stateProps).toEqual(
        expect.objectContaining({
          animated: false,
          handicapLabel: "handicap",
          isBetslipCollapsed: false,
          label: "-",
          odds: { decimal: 1.1 },
          oddsboost: undefined,
          secondaryLabel: undefined,
          status: "closed",
          struckThrough: true,
          toastMessageStatus: "CLOSED",
        }),
      );
    });

    it("should return default", () => {
      getSportsbookMarketByURN.mockReturnValueOnce({ ...sportsbookMarket, oddsboost: false });
      const stateProps = setupMapStateToProps(
        "ppb:sbkRunner:924.1/1",
        "ppb:sbkMarket:924.1",
        false,
        "cardUrn",
        "handicap",
      );

      expect(stateProps).toEqual(
        expect.objectContaining({
          animated: false,
          handicapLabel: "handicap",
          isBetslipCollapsed: false,
          label: "formatOdds mock",
          odds: { decimal: 1.1 },
          oddsboost: undefined,
          secondaryLabel: undefined,
          status: "default",
          struckThrough: true,
          toastMessageStatus: undefined,
        }),
      );
    });
  });

  describe("makeMapDispatchToProps", () => {
    function setupMakeMapDispatchToProps({ dispatch = jest.fn() } = {}) {
      return makeMapDispatchToProps(dispatch);
    }

    describe("dispatchBetPlacement", () => {
      it("should trigger actions", () => {
        const dispatch = jest.fn();
        const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });

        const bet = {
          urn: "urn",
          odds: "odds",
        };

        dispatchBetPlacement(bet);

        expect(dispatch).toHaveBeenCalledTimes(6);
      });

      it("should dispatch UI__BETSLIP_OPEN", () => {
        const dispatch = jest.fn();
        const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });
        const bet = {
          urn: "urn",
          odds: "odds",
        };
        const metadata = {
          cardUrn: "cardURN",
          betOriginURL: "betOriginURL",
          parents: [],
        };

        dispatchBetPlacement(bet, metadata);

        expect(dispatch).toHaveBeenNthCalledWith(1, {
          type: UI__BETSLIP_OPEN,
          payload: {
            product: Product.Sportsbook,
          },
        });
      });

      it("should dispatch UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION", () => {
        const dispatch = jest.fn();
        const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });
        const bet = {
          urn: "urn",
          odds: "odds",
        };
        const metadata = {
          cardUrn: "cardURN",
          betOriginURL: "betOriginURL",
          parents: [],
        };

        dispatchBetPlacement(bet, metadata);

        expect(dispatch).toHaveBeenNthCalledWith(2, {
          type: UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
          payload: {
            urn: "urn",
          },
        });
      });

      it("should dispatch UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION", () => {
        const dispatch = jest.fn();
        const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });
        const bet = {
          urn: "urn",
          odds: "odds",
        };
        const metadata = {
          cardUrn: "cardURN",
          betOriginURL: "betOriginURL",
          parents: [],
        };

        dispatchBetPlacement(bet, metadata);

        expect(dispatch).toHaveBeenNthCalledWith(3, {
          type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
        });
      });

      it("should dispatch UI__MARKET_SBK_BET_BUTTON_CLICK", () => {
        const dispatch = jest.fn();
        const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });
        const bet = {
          urn: "urn",
          odds: "odds",
        };
        const metadata = {
          cardUrn: "cardURN",
          betOriginURL: "betOriginURL",
          parents: [],
        };

        dispatchBetPlacement(bet, metadata);

        expect(dispatch).toHaveBeenNthCalledWith(4, {
          type: UI__MARKET_SBK_BET_BUTTON_CLICK,
          payload: {
            urn: "urn",
            odds: "odds",
            cardUrn: "cardURN",
            betOriginURL: "betOriginURL",
            uniqueId: "",
            parents: [],
            group: "REAL",
          },
        });
      });

      it("should dispatch BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION", () => {
        const dispatch = jest.fn();
        const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });

        const bet = {
          urn: "urn",
          odds: "odds",
        };

        dispatchBetPlacement(bet);

        expect(dispatch).toHaveBeenNthCalledWith(5, { type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION });
      });

      it("should dispatch BETTING__SBK_TOGGLE_LEG_ACTION", () => {
        const dispatch = jest.fn();
        const { dispatchBetPlacement } = setupMakeMapDispatchToProps({ dispatch });
        const bet = {
          urn: "urn",
          odds: "odds",
        };
        const metadata = {
          betOriginURL: "betOriginalURL",
          cardUrn: "cardUrn",
        };

        dispatchBetPlacement(bet, metadata);

        expect(dispatch).toHaveBeenNthCalledWith(6, {
          type: BETTING__SBK_TOGGLE_LEG_ACTION,
          payload: { urn: "urn", odds: "odds", group: "REAL", metadata },
        });
        expect(dispatch).toHaveBeenCalledTimes(6);
      });
    });

    describe("dispatchInactiveBetButtonClickAction", () => {
      it("should dispatch UI__CLOSED_SBK_CLICK if status is CLOSED", () => {
        const dispatch = jest.fn();
        const { dispatchInactiveBetButtonClickAction } = setupMakeMapDispatchToProps({ dispatch });

        dispatchInactiveBetButtonClickAction("CLOSED");

        expect(dispatch).toHaveBeenCalledTimes(1);

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__CLOSED_SBK_CLICK,
        });
      });

      it("should dispatch UI__SUSPENDED_SBK_CLICK if status is SUSPENDED", () => {
        const dispatch = jest.fn();
        const { dispatchInactiveBetButtonClickAction } = setupMakeMapDispatchToProps({ dispatch });

        dispatchInactiveBetButtonClickAction("SUSPENDED");

        expect(dispatch).toHaveBeenCalledTimes(1);

        expect(dispatch).toHaveBeenCalledWith({
          type: UI__SUSPENDED_SBK_CLICK,
        });
      });
    });
  });
});
