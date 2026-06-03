import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import {
  getCashoutClickEvent,
  getCashoutSuccessEvent,
  getCashoutFailureEvent,
  getAutoConfirmCashoutClickEvent,
} from "./cashout";

import { createSportsbookCashoutQuoteSelector } from "../../state/betting/sportsbook-cashouts/sportsbook-cashout-selectors";
import { createExchangeCashoutQuoteSelector } from "../../state/betting/exchange-cashouts/exchange-cashout-selectors";
import { createExchangeMarketBetSelector } from "../../state/betting/exchange-market-bets/exchange-market-bets-selectors";
import { createCardGroupByURNSelector } from "../../state/layout/cardgroups/cardgroups-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { isRaceHierarchy } from "../../helpers/markets";

jest.mock("../../state/entities/exchange-markets/exchange-market-selectors", () => {
  const getExchangeMarketByURN = jest.fn(() => ({
    marketId: "marketId",
    name: "market name",
    hierarchy: {
      sportevent: "eventUrn",
      competition: "competitionUrn",
    },
    sport: "sportUrn",
  }));
  return {
    createExchangeMarketSelector: () => getExchangeMarketByURN,
  };
});

jest.mock("../../state/layout/views/event-view/event-view-selectors");
jest.mock("../../state/layout/layout-selectors");
jest.mock("../../state/betting/sportsbook-cashouts/sportsbook-cashout-selectors", () => {
  const mock = jest.fn();
  return {
    createSportsbookCashoutQuoteSelector: () => mock,
  };
});
jest.mock("../../state/betting/exchange-cashouts/exchange-cashout-selectors", () => {
  const mock = jest.fn();
  return {
    createExchangeCashoutQuoteSelector: () => mock,
  };
});

const getExchangeCashoutQuoteByURNMock = createExchangeCashoutQuoteSelector();
const getSportsbookCashoutQuoteByURNMock = createSportsbookCashoutQuoteSelector();

jest.mock("../../state/betting/exchange-market-bets/exchange-market-bets-selectors", () => {
  const exchangeMarketBet = jest.fn(() => ({
    marketId: "marketId",
    description: "market name",
    betCardGroupURN: "betCardGroupURN",
  }));
  return {
    createExchangeMarketBetSelector: () => exchangeMarketBet,
  };
});

jest.mock("../../state/betting/sportsbook-bets/sportsbook-bets-selectors", () => ({
  createSportsbookBetSelector: jest.fn(() => jest.fn().mockImplementation((bet) => bet)),
}));

jest.mock("../../state/layout/cardgroups/cardgroups-selectors", () => {
  const betCardGroup = jest.fn(() => ({
    urn: "betCardGroupURN",
    aggregatorId: "fakeEventId",
    aggregatorDesc: "fakeEventName",
  }));
  return {
    createCardGroupByURNSelector: () => betCardGroup,
  };
});

jest.mock("../../helpers/markets", () => ({
  isRaceHierarchy: jest.fn(),
}));

beforeEach(jest.clearAllMocks);

describe("Cashout GTM resolvers", () => {
  describe("getCashoutClickEvent", () => {
    beforeEach(() => {
      getViewbyURN.mockReturnValue({ typename: "MyBetsView" });
      getSportsbookCashoutQuoteByURNMock.mockReturnValue("fakeQuote");
      createViewTypeSelector.mockReturnValue(() => "MYBETS");
    });

    describe("when cashoutUrn is not defined", () => {
      it("should return null", () => {
        const applicationState = {};
        const event = getCashoutClickEvent(applicationState, null);

        expect(event).toEqual(null);
      });
    });

    describe("when the sportsbook quote is not valid", () => {
      it("should return null", () => {
        const applicationState = {
          router: {
            currentView: "ppb:tbd:view:myBets",
          },
          betting: {
            sportsbookcashouts: {},
          },
        };

        const event = getCashoutClickEvent(applicationState, "fakeUrn");

        expect(event).toEqual(null);
      });
    });

    describe("when there is no bet", () => {
      it("should return null", () => {
        const applicationState = {
          router: {
            currentView: "ppb:tbd:view:myBets",
          },
          betting: {
            sportsbookcashouts: {},
          },
        };

        const event = getCashoutClickEvent(applicationState, "fakeUrn");

        expect(event).toEqual(null);
      });
    });

    describe("when the quote is on CONFIRM STEP", () => {
      it("should return all dimensions with the correct label", () => {
        getSportsbookCashoutQuoteByURNMock.mockReturnValue({
          quote: 1.81,
          stake: 2,
          step: "CONFIRM",
        });

        const applicationState = {
          router: {
            currentView: "ppb:tbd:view:myBets",
          },
          betting: {
            sportsbookcashouts: {},
            sportsbookbets: {
              urn: "ppb:sbkBet:1098374316",
              betId: "1098374316",
              betReceiptId: "O/11037374/0000804",
              betType: "SINGLE",
              currentSize: 2,
              numLines: 1,
              legs: [{}],
            },
          },
        };

        const event = getCashoutClickEvent(applicationState, "fakeUrn");

        expect(event).toEqual({
          action: "confirmed cashout",
          category: "cashout",
          cd10: "SINGLE",
          cd28: "single",
          cd29: "1098374316",
          cd3: "my bets",
          cd70: "full",
          cd89: "yes",
          cd9: "O/11037374/0000804",
          cm1: 2,
          cm4: 1,
          cm5: 1,
          cm50: 1.81,
          event: "ga_event",
          label: "confirmed cashout",
        });
      });
    });

    describe("when the bet type is single bet", () => {
      it("should return all dimensions", () => {
        getSportsbookCashoutQuoteByURNMock.mockReturnValue({
          quote: 1.81,
          stake: 2,
          step: "DISPLAY",
        });

        const applicationState = {
          router: {
            currentView: "ppb:tbd:view:myBets",
          },
          layouts: {
            views: {},
          },
          betting: {
            sportsbookcashouts: {},
            sportsbookbets: {
              urn: "ppb:sbkBet:1098374316",
              betId: "1098374316",
              betReceiptId: "O/11037374/0000804",
              betType: "SINGLE",
              currentSize: 2,
              numLines: 1,
              legs: [{}],
            },
          },
        };

        const event = getCashoutClickEvent(applicationState, "fakeUrn");

        expect(event).toEqual({
          action: "attempted cashout",
          category: "cashout",
          cd10: "SINGLE",
          cd28: "single",
          cd29: "1098374316",
          cd3: "my bets",
          cd70: "full",
          cd89: "yes",
          cd9: "O/11037374/0000804",
          cm1: 2,
          cm4: 1,
          cm5: 1,
          cm50: 1.81,
          event: "ga_event",
          label: "attempted cashout",
        });
      });
    });

    describe("when the bet type is multiple", () => {
      it("should return all dimensions", () => {
        getSportsbookCashoutQuoteByURNMock.mockReturnValue({
          quote: 1.81,
          stake: 2,
          step: "DISPLAY",
        });

        const applicationState = {
          router: {
            currentView: "ppb:tbd:view:myBets",
          },
          layouts: {
            views: {},
          },
          betting: {
            sportsbookcashouts: {},
            sportsbookbets: {
              urn: "ppb:sbkBet:1098374317",
              betId: "1098374317",
              betReceiptId: "O/11037374/0000805",
              betType: "DOUBLE",
              currentSize: 0.62,
              numLines: 1,
              legs: [{}],
            },
          },
        };

        const event = getCashoutClickEvent(applicationState, "fakeUrn");

        expect(event).toEqual({
          action: "attempted cashout",
          category: "cashout",
          cd10: "DOUBLE",
          cd28: "multiple",
          cd29: "1098374317",
          cd3: "my bets",
          cd70: "full",
          cd89: "yes",
          cd9: "O/11037374/0000805",
          cm1: 2,
          cm4: 1,
          cm5: 1,
          cm50: 1.81,
          event: "ga_event",
          label: "attempted cashout",
        });
      });
    });

    describe("when the viewUrn is not defined", () => {
      beforeEach(() => {
        getSportsbookCashoutQuoteByURNMock.mockReturnValue(null);
      });

      const applicationState = {
        router: {
          currentUrn: null,
        },
        layouts: {
          views: {},
        },
        betting: {},
      };

      it("should return null", () => {
        const event = getCashoutClickEvent(applicationState, "fakeUrn");

        expect(event).toEqual(null);
      });
    });

    describe("when the view is not defined", () => {
      beforeEach(() => {
        getViewbyURN.mockReturnValue(null);
        getSportsbookCashoutQuoteByURNMock.mockReturnValue(null);
      });

      const applicationState = {
        router: {
          currentUrn: "fakeUrn",
        },
        layouts: {
          views: {},
        },
        betting: {},
      };

      it("should return null", () => {
        const event = getCashoutClickEvent(applicationState, "fakeUrn");

        expect(event).toEqual(null);
      });
    });

    describe("when the exchange quote is not valid", () => {
      beforeEach(() => {
        getViewbyURN.mockReturnValue({ typename: "MarketView" });
        getExchangeCashoutQuoteByURNMock.mockReturnValue(null);
        getSportsbookCashoutQuoteByURNMock.mockReturnValue(null);
      });
      it("should return null", () => {
        const applicationState = {
          router: {
            currentUrn: "fakeUrn",
          },
          layouts: {
            views: {},
          },
          betting: {
            sportsbookcashouts: {},
          },
        };

        const event = getCashoutClickEvent(applicationState, "fakeUrn");

        expect(event).toBeNull();
      });
    });
  });

  describe("getAutoConfirmCashoutClickEvent", () => {
    beforeEach(() => {
      getSportsbookCashoutQuoteByURNMock.mockReturnValue({
        quote: 1.81,
        stake: 2,
        step: "DISPLAY",
      });
      createViewTypeSelector.mockReturnValue(() => "MYBETS");
    });

    it("should return all dimensions with the correct label", () => {
      const applicationState = {
        router: {
          currentUrn: "fakeUrn",
        },
        layouts: {
          views: {},
        },
        betting: {
          sportsbookcashouts: {},
          sportsbookbets: {
            urn: "ppb:sbkBet:1098374316",
            betId: "1098374316",
            betReceiptId: "O/11037374/0000804",
            betType: "SINGLE",
            currentSize: 2,
            numLines: 1,
            legs: [{}],
          },
        },
      };

      const event = getAutoConfirmCashoutClickEvent(applicationState, "fakeUrn");

      expect(event).toEqual({
        action: "auto confirmed cashout",
        category: "cashout",
        cd10: "SINGLE",
        cd28: "single",
        cd29: "1098374316",
        cd3: "my bets",
        cd70: "full",
        cd89: "yes",
        cd9: "O/11037374/0000804",
        cm1: 2,
        cm4: 1,
        cm5: 1,
        cm50: 1.81,
        event: "ga_event",
        label: "auto confirmed cashout",
      });
    });

    describe("when user make a exchange cashout on market page", () => {
      beforeEach(() => {
        getViewbyURN.mockReturnValue({ typename: "MarketView" });
        getSportsbookCashoutQuoteByURNMock.mockReturnValue(null);
        createViewTypeSelector.mockReturnValue(() => "MARKET");
        getExchangeCashoutQuoteByURNMock.mockReturnValue({
          profit: -0.15,
          step: "DISPLAY",
          value: 1.94,
        });
      });

      describe("on non racing event", () => {
        const applicationState = {
          router: {
            currentUrn: "fakeUrn",
            currentView: "ppb:tbd:view:market",
          },
          layouts: {
            cardgroups: {
              betcardgroups: {},
            },
            views: {
              event: {
                fakeEventViewURN: {
                  urn: "fakeEventViewURN",
                },
              },
            },
          },
          betting: {},
          entities: {
            sportevents: {
              eventUrn: {
                urn: "fakeSporteventsEventURN",
                name: "eventName",
                eventId: "fakeEventId",
              },
            },
            exchangemarkets: {
              fakeExchangeMarketURN: {
                urn: "fakeExchangeMarketURN",
                marketId: "fakeMarketId",
                hierarchy: {
                  sportevent: "eventUrn",
                },
                runners: [],
              },
            },
          },
        };

        describe("when there is valid data", () => {
          it("should return all dimensions", () => {
            const event = getCashoutClickEvent(applicationState, "fakeUrn");

            expect(event).toEqual({
              action: "attempted cashout",
              category: "cashout",
              cd7: "eventName",
              cd101: "marketId",
              cd3: "market view - cashout",
              cd70: "full",
              cd8: "market name",
              cd84: "fakeEventId",
              cd89: "yes",
              cm50: 1.94,
              cm51: -0.15,
              event: "ga_event",
              label: "attempted cashout",
            });
          });
        });

        describe("when exchange market is null", () => {
          it("should return null", () => {
            createExchangeMarketSelector().mockReturnValueOnce(null);

            const event = getCashoutClickEvent(applicationState, "fakeUrn");
            expect(event).toBeNull();
          });
        });
      });

      describe("on racing page", () => {
        beforeEach(() => {
          isRaceHierarchy.mockReturnValue(true);
          createExchangeMarketSelector().mockReturnValueOnce({
            marketId: "marketId",
            name: "market name",
            hierarchy: {
              race: "fakeRaceURN",
              meeting: "fakeMeetingURN",
            },
          });

          getExchangeCashoutQuoteByURNMock.mockReturnValue({
            profit: -0.15,
            step: "DISPLAY",
            value: 1.94,
          });
        });

        const applicationState = {
          router: {
            currentView: "ppb:tbd:view:market",
            currentUrn: "fakeEventViewURN",
          },
          layouts: {
            views: {
              event: {
                fakeEventViewURN: {
                  urn: "fakeEventViewURN",
                },
              },
            },
          },
          betting: {},
          entities: {
            races: {
              fakeRaceURN: {
                raceId: "fakeRaceId",
                name: "fakeRaceName",
              },
            },
          },
        };

        describe("when there is valid data", () => {
          it("should return all dimensions", () => {
            const event = getCashoutClickEvent(applicationState, "fakeUrn");

            expect(event).toEqual({
              action: "attempted cashout",
              category: "cashout",
              cd7: "fakeRaceName",
              cd101: "marketId",
              cd3: "market view - cashout",
              cd70: "full",
              cd8: "market name",
              cd84: "fakeRaceId",
              cd89: "yes",
              cm50: 1.94,
              cm51: -0.15,
              event: "ga_event",
              label: "attempted cashout",
            });
          });
        });
      });
    });

    describe("when user make a exchange cashout on my bets page", () => {
      beforeEach(() => {
        getViewbyURN.mockReturnValue({ typename: "MyBetsView" });
        getSportsbookCashoutQuoteByURNMock.mockReturnValue(null);
        createViewTypeSelector.mockReturnValue(() => "MYBETS");
        getExchangeCashoutQuoteByURNMock.mockReturnValue({
          profit: -0.15,
          step: "DISPLAY",
          value: 1.94,
        });
      });

      describe("on racing event", () => {
        const applicationState = {
          router: {
            currentUrn: "ppb:tbd:view:myBets",
          },
          layouts: {
            views: {
              event: {
                fakeEventViewURN: {
                  urn: "fakeEventViewURN",
                },
              },
            },
            cardgroups: {},
          },
          betting: {},
          entities: {
            sportevents: {
              eventUrn: {
                urn: "fakeSporteventsEventURN",
                name: "eventName",
                eventId: "fakeEventId",
              },
            },
            exchangemarketbets: {
              marketId: "marketId",
              description: "market name",
            },
            exchangemarkets: {
              fakeExchangeMarketURN: {
                urn: "fakeExchangeMarketURN",
                marketId: "fakeMarketId",
                sportevent: "eventUrn",
                runners: [],
              },
            },
          },
        };
        describe("when there is valid data", () => {
          it("should return all dimensions", () => {
            const event = getCashoutClickEvent(applicationState, "fakeUrn");

            expect(event).toEqual({
              action: "attempted cashout",
              category: "cashout",
              cd7: "fakeEventName",
              cd101: "marketId",
              cd3: "my bets",
              cd70: "full",
              cd8: "market name",
              cd84: "fakeEventId",
              cd89: "yes",
              cm50: 1.94,
              cm51: -0.15,
              event: "ga_event",
              label: "attempted cashout",
            });
          });
        });

        describe("when exchange market bet is null", () => {
          it("should return null", () => {
            createExchangeMarketBetSelector().mockReturnValueOnce(null);

            const event = getCashoutClickEvent(applicationState, "fakeUrn");
            expect(event).toBeNull();
          });
        });

        describe("when bet card group is null", () => {
          it("should return null", () => {
            createCardGroupByURNSelector().mockReturnValueOnce(null);

            const event = getCashoutClickEvent(applicationState, "fakeUrn");
            expect(event).toBeNull();
          });
        });
      });
    });
  });

  describe("Cashout Success And Failure Event", () => {
    beforeEach(() => {
      getViewbyURN.mockReturnValue({ typename: "MyBetsView" });
      createViewTypeSelector.mockReturnValue(() => "MYBETS");

      getSportsbookCashoutQuoteByURNMock.mockReturnValue({
        quote: 1.81,
        stake: 2,
        step: "DISPLAY",
      });
    });

    const applicationState = {
      router: {
        currentUrn: "ppb:tbd:view:myBets",
      },
      layouts: {
        views: {
          event: {
            fakeEventViewURN: {
              urn: "fakeEventViewURN",
            },
          },
        },
      },
      betting: {
        sportsbookcashouts: {},
        sportsbookbets: {
          urn: "ppb:sbkBet:1098374316",
          betId: "1098374316",
          betReceiptId: "O/11037374/0000804",
          betType: "SINGLE",
          numLines: 1,
          legs: [{}],
        },
      },
    };

    describe("getCashoutSuccessEvent", () => {
      describe("when there is valid data", () => {
        it("should return all dimensions", () => {
          const event = getCashoutSuccessEvent(applicationState, "fakeUrn");

          expect(event).toEqual({
            action: "succeeded cashout",
            category: "cashout",
            cd10: "SINGLE",
            cd28: "single",
            cd29: "1098374316",
            cd3: "my bets",
            cd70: "full",
            cd89: "yes",
            cd9: "O/11037374/0000804",
            cm1: 2,
            cm4: 1,
            cm5: 1,
            cm50: 1.81,
            event: "ga_event",
            label: "succeeded cashout",
          });
        });
      });
    });
    describe("getCashoutFailureEvent", () => {
      describe("when there is valid data", () => {
        it("should return all dimensions", () => {
          const event = getCashoutFailureEvent(applicationState, "fakeUrn");

          expect(event).toEqual({
            event: "ga_event",
            action: "failed cashout",
            category: "cashout",
            cd10: "SINGLE",
            cd28: "single",
            cd29: "1098374316",
            cd3: "my bets",
            cd70: "full",
            cd89: "yes",
            cd9: "O/11037374/0000804",
            cm1: 2,
            cm4: 1,
            cm5: 1,
            cm50: 1.81,
            label: "failed cashout",
          });
        });
      });
    });
  });
});
