import { buildMyBetsEvent } from "tagging-library";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import {
  getCashoutClickEvent,
  getCashoutSuccessEvent,
  getCashoutFailureEvent,
  getAutoConfirmCashoutClickEvent,
  getCashoutFailureSbkEvent,
} from "./my-bets";
import { createSportsbookCashoutQuoteSelector } from "../../state/betting/sportsbook-cashouts/sportsbook-cashout-selectors";
import { createExchangeCashoutQuoteSelector } from "../../state/betting/exchange-cashouts/exchange-cashout-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { isRaceHierarchy } from "../../helpers/markets";

jest.mock("tagging-library", () => ({
  buildMyBetsEvent: jest.fn().mockReturnValue("my-bets event"),
}));
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

describe("MyBets GA4 resolvers", () => {
  describe("getCashoutClickEvent", () => {
    let action;
    let state;

    beforeEach(() => {
      getViewbyURN.mockReturnValue({ typename: "MyBetsView" });
      getSportsbookCashoutQuoteByURNMock.mockReturnValue("fakeQuote");
      createViewTypeSelector.mockReturnValue(() => "MYBETS");

      action = {
        payload: {
          cashoutUrn: "fakeUrn",
        },
      };
      state = {
        router: {
          currentView: "ppb:tbd:view:myBets",
        },
        betting: {
          sportsbookcashouts: {},
        },
      };
    });

    describe("when cashoutUrn is not defined", () => {
      it("should not call buildMyBetsEvent", () => {
        action = {
          payload: {
            cashoutUrn: undefined,
          },
        };

        const result = getCashoutClickEvent(action, state);
        expect(buildMyBetsEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when the sportsbook quote is not valid", () => {
      it("should not call buildMyBetsEvent", () => {
        const result = getCashoutClickEvent(action, state);

        expect(buildMyBetsEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when there is no bet", () => {
      it("should not call buildMyBetsEvent", () => {
        const result = getCashoutClickEvent(action, state);

        expect(buildMyBetsEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when the quote is on CONFIRM STEP", () => {
      it("should call buildMyBetsEvent with the correct payload", () => {
        getSportsbookCashoutQuoteByURNMock.mockReturnValue({
          quote: 1.81,
          stake: 2,
          step: "CONFIRM",
        });

        state = {
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

        const result = getCashoutClickEvent(action, state);

        expect(buildMyBetsEvent).toHaveBeenCalledWith({
          betId: "1098374316",
          cashoutAmount: "1.81",
          cashoutPosition: "confirmed cashout",
          cashoutType: "full",
          module: "my bets",
          progressBar: "null",
        });
        expect(result).toBe("my-bets event");
      });
    });

    describe("when the bet type is single bet", () => {
      it("should call buildMyBetsEvent with the correct payload", () => {
        getSportsbookCashoutQuoteByURNMock.mockReturnValue({
          quote: 1.81,
          stake: 2,
          step: "DISPLAY",
        });

        state = {
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

        const result = getCashoutClickEvent(action, state);

        expect(buildMyBetsEvent).toHaveBeenCalledWith({
          betId: "1098374316",
          cashoutAmount: "1.81",
          cashoutPosition: "attempted cashout",
          cashoutType: "full",
          module: "my bets",
          progressBar: "null",
        });
        expect(result).toBe("my-bets event");
      });
    });

    describe("when the bet type is multiple", () => {
      it("should call buildMyBetsEvent with the correct payload", () => {
        getSportsbookCashoutQuoteByURNMock.mockReturnValue({
          quote: 1.81,
          stake: 2,
          step: "DISPLAY",
        });

        state = {
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

        const result = getCashoutClickEvent(action, state);

        expect(buildMyBetsEvent).toHaveBeenCalledWith({
          betId: "1098374317",
          cashoutAmount: "1.81",
          cashoutPosition: "attempted cashout",
          cashoutType: "full",
          module: "my bets",
          progressBar: "null",
        });
        expect(result).toBe("my-bets event");
      });
    });

    describe("when the viewUrn is not defined", () => {
      it("should not call buildMyBetsEvent", () => {
        getSportsbookCashoutQuoteByURNMock.mockReturnValue(null);

        state = {
          router: {
            currentUrn: null,
          },
          layouts: {
            views: {},
          },
          betting: {},
        };

        const result = getCashoutClickEvent(action, state);

        expect(buildMyBetsEvent).not.toHaveBeenCalled();
        expect(result).toEqual(null);
      });
    });

    describe("when the view is not defined", () => {
      it("should not call buildMyBetsEvent", () => {
        getViewbyURN.mockReturnValue(null);
        getSportsbookCashoutQuoteByURNMock.mockReturnValue(null);

        state = {
          router: {
            currentUrn: "fakeUrn",
          },
          layouts: {
            views: {},
          },
          betting: {},
        };

        const event = getCashoutClickEvent(action, state);

        expect(buildMyBetsEvent).not.toHaveBeenCalled();
        expect(event).toEqual(null);
      });
    });

    describe("when the exchange quote is not valid", () => {
      it("should not call buildMyBetsEvent", () => {
        getViewbyURN.mockReturnValue({ typename: "MarketView" });
        getExchangeCashoutQuoteByURNMock.mockReturnValue(null);
        getSportsbookCashoutQuoteByURNMock.mockReturnValue(null);

        state = {
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

        const event = getCashoutClickEvent(action, state);

        expect(buildMyBetsEvent).not.toHaveBeenCalled();
        expect(event).toBeNull();
      });
    });
  });

  describe("getAutoConfirmCashoutClickEvent", () => {
    const action = {
      payload: {
        cashoutUrn: "fakeUrn",
      },
    };

    beforeEach(() => {
      getSportsbookCashoutQuoteByURNMock.mockReturnValue({
        quote: 1.81,
        stake: 2,
        step: "DISPLAY",
      });
      createViewTypeSelector.mockReturnValue(() => "MYBETS");
    });

    it("should call buildMyBetsEvent with the correct payload", () => {
      const state = {
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

      const result = getAutoConfirmCashoutClickEvent(action, state);

      expect(buildMyBetsEvent).toHaveBeenCalledWith({
        betId: "1098374316",
        cashoutAmount: "1.81",
        cashoutPosition: "auto confirmed cashout",
        cashoutType: "full",
        module: "my bets",
        progressBar: "null",
      });
      expect(result).toBe("my-bets event");
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
        const state = {
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

        it("should call buildMyBetsEvent with the correct payload", () => {
          const result = getAutoConfirmCashoutClickEvent(action, state);

          expect(buildMyBetsEvent).toHaveBeenCalledWith({
            betId: "null",
            cashoutAmount: "1.94",
            cashoutPosition: "auto confirmed cashout",
            cashoutType: "full",
            module: "market view - cashout",
            progressBar: "null",
          });
          expect(result).toBe("my-bets event");
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

        const state = {
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

        it("should call buildMyBetsEvent with the correct payload", () => {
          const result = getAutoConfirmCashoutClickEvent(action, state);

          expect(buildMyBetsEvent).toHaveBeenCalledWith({
            betId: "null",
            cashoutAmount: "1.94",
            cashoutPosition: "auto confirmed cashout",
            cashoutType: "full",
            module: "market view - cashout",
            progressBar: "null",
          });
          expect(result).toBe("my-bets event");
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
        const state = {
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

        it("should call buildMyBetsEvent with the correct payload", () => {
          const result = getAutoConfirmCashoutClickEvent(action, state);

          expect(buildMyBetsEvent).toHaveBeenCalledWith({
            betId: "null",
            cashoutAmount: "1.94",
            cashoutPosition: "auto confirmed cashout",
            cashoutType: "full",
            module: "my bets",
            progressBar: "null",
          });
          expect(result).toBe("my-bets event");
        });
      });
    });
  });

  describe("Cashout Success And Failure Event", () => {
    const action = {
      payload: {
        receipt: { entityURN: "fakeUrn" },
      },
    };

    beforeEach(() => {
      getViewbyURN.mockReturnValue({ typename: "MyBetsView" });
      createViewTypeSelector.mockReturnValue(() => "MYBETS");

      getSportsbookCashoutQuoteByURNMock.mockReturnValue({
        quote: 1.81,
        stake: 2,
        step: "DISPLAY",
      });
    });

    const state = {
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
      it("should call buildMyBetsEvent with the correct payload", () => {
        const result = getCashoutSuccessEvent(action, state);

        expect(buildMyBetsEvent).toHaveBeenCalledWith({
          betId: "1098374316",
          cashoutAmount: "1.81",
          cashoutPosition: "succeeded cashout",
          cashoutType: "full",
          module: "my bets",
          progressBar: "null",
        });
        expect(result).toBe("my-bets event");
      });
    });

    describe("getCashoutFailureEvent", () => {
      it("should call buildMyBetsEvent with the correct payload", () => {
        const result = getCashoutFailureEvent(action, state);

        expect(buildMyBetsEvent).toHaveBeenCalledWith({
          betId: "1098374316",
          cashoutAmount: "1.81",
          cashoutPosition: "failed cashout",
          cashoutType: "full",
          module: "my bets",
          progressBar: "null",
        });
        expect(result).toBe("my-bets event");
      });
    });

    describe("getCashoutFailureSbkEvent", () => {
      it("should call buildMyBetsEvent with the correct payload", () => {
        const result = getCashoutFailureSbkEvent(
          {
            payload: { entityURN: "fakeUrn" },
          },
          state,
        );

        expect(buildMyBetsEvent).toHaveBeenCalledWith({
          betId: "1098374316",
          cashoutAmount: "1.81",
          cashoutPosition: "failed cashout",
          cashoutType: "full",
          module: "my bets",
          progressBar: "null",
        });
        expect(result).toBe("my-bets event");
      });
    });
  });
});
