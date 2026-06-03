import { createCardByURNSelector } from "../cards-selectors";

jest.mock("../cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

async function setup() {
  const { createMarketViewLinksByURNsSelector } = await import("./market-viewlink-selectors");
  return createMarketViewLinksByURNsSelector;
}

describe("MarketViewLinks Selectors", () => {
  it("should be a factory function", async () => {
    const createGetMarketViewLinks = await setup();
    const getMarketViewLinks = createGetMarketViewLinks();
    expect(getMarketViewLinks).toEqual(expect.any(Function));
    expect(getMarketViewLinks).not.toBe(createGetMarketViewLinks());

    jest.clearAllMocks();
  });

  it("should create a marketViewLinkCardByURN Selector", async () => {
    const createGetMarketViewLinks = await setup();
    createGetMarketViewLinks();
    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
    expect(createCardByURNSelector).toHaveBeenCalledWith();
    jest.clearAllMocks();
  });

  it("should return the market view links structure", async () => {
    const getMarketViewLinkCardByURN = jest.fn();
    createCardByURNSelector.mockReturnValue(getMarketViewLinkCardByURN);
    const createGetMarketViewLinks = await setup();
    const getMarketViewLinks = createGetMarketViewLinks();

    const marketViewLinkCardsMockState = {};
    const marketViewMockState = {};
    const exchangeMarketsMockState = {};
    const sportsbookMarketsMockState = {};

    const stateMock = {
      layouts: {
        cards: {
          marketviewlinks: marketViewLinkCardsMockState,
        },
        views: {
          market: marketViewMockState,
        },
      },
      entities: {
        exchangemarkets: exchangeMarketsMockState,
        sportsbookmarkets: sportsbookMarketsMockState,
      },
    };

    const marketViewLinkCardMockExc = {
      marketName: "exchange market name",
      urn: "ppb:tbd:card:marketViewLink:1",
      viewLink: {
        viewUrn: "ppb:tbd:view:market:1",
        viewUrl: "-/r-1",
      },
    };
    const marketViewLinkCardMockSbk = {
      marketName: "sportsbook market name",
      urn: "ppb:tbd:card:marketViewLink:2",
      viewLink: {
        viewUrn: "ppb:tbd:view:market:2",
        viewUrl: "-/r-2",
      },
      badge: "BADGE",
    };

    getMarketViewLinkCardByURN
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(marketViewLinkCardMockExc)
      .mockReturnValueOnce(marketViewLinkCardMockSbk);

    const result = getMarketViewLinks(stateMock, [
      "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
      "ppb:tbd:card:marketViewLink:1",
      "ppb:tbd:card:marketViewLink:2",
    ]);

    expect(getMarketViewLinkCardByURN).toHaveBeenCalledTimes(3);
    expect(getMarketViewLinkCardByURN).toHaveBeenNthCalledWith(
      1,
      {},
      "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
    );
    expect(getMarketViewLinkCardByURN).toHaveBeenNthCalledWith(2, {}, "ppb:tbd:card:marketViewLink:1");
    expect(getMarketViewLinkCardByURN).toHaveBeenNthCalledWith(3, {}, "ppb:tbd:card:marketViewLink:2");
    expect(getMarketViewLinkCardByURN.mock.calls[0][0]).toBe(marketViewLinkCardsMockState);

    expect(result).toEqual([
      {
        marketName: "exchange market name",
        viewLink: { viewUrl: "-/r-1", viewUrn: "ppb:tbd:view:market:1" },
        urn: "ppb:tbd:card:marketViewLink:1",
        badge: undefined,
      },
      {
        marketName: "sportsbook market name",
        viewLink: { viewUrl: "-/r-2", viewUrn: "ppb:tbd:view:market:2" },
        urn: "ppb:tbd:card:marketViewLink:2",
        badge: "BADGE",
      },
    ]);

    jest.clearAllMocks();
  });

  it("should return an empty market view links array when URNs list is undefined", async () => {
    const getMarketViewLinkCardByURN = jest.fn();
    createCardByURNSelector.mockReturnValue(getMarketViewLinkCardByURN);
    const createGetMarketViewLinks = await setup();
    const getMarketViewLinks = createGetMarketViewLinks();

    const marketViewLinkCardsMockState = {
      viewUrn: "ppb:tbd:view:market:1.12345",
      viewUrl: "-/rc-1.12345",
    };
    const marketViewMockState = {};
    const exchangeMarketsMockState = {};
    const sportsbookMarketsMockState = {};

    const stateMock = {
      layouts: {
        cards: {
          marketviewlinks: marketViewLinkCardsMockState,
        },
        views: {
          market: marketViewMockState,
        },
      },
      entities: {
        exchangemarkets: exchangeMarketsMockState,
        sportsbookmarkets: sportsbookMarketsMockState,
      },
    };

    const result = getMarketViewLinks(stateMock, undefined);

    expect(result).toEqual([]);

    jest.clearAllMocks();
  });

  describe("when market view links don't change", () => {
    it("should return the same instance", async () => {
      const getMarketViewLinkCardByURN = jest.fn();
      createCardByURNSelector.mockReturnValue(getMarketViewLinkCardByURN);
      const createGetMarketViewLinks = await setup();
      const getMarketViewLinks = createGetMarketViewLinks();

      const marketViewLinkCardsMockState = {
        viewUrn: "ppb:tbd:view:market:1.12345",
        viewUrl: "-/rc-1.12345",
      };
      const marketViewMockState = {};
      const exchangeMarketsMockState = {};
      const sportsbookMarketsMockState = {};

      const stateMock = {
        layouts: {
          cards: {
            marketviewlinks: marketViewLinkCardsMockState,
          },
          views: {
            market: marketViewMockState,
          },
        },
        entities: {
          exchangemarkets: exchangeMarketsMockState,
          sportsbookmarkets: sportsbookMarketsMockState,
        },
      };

      const marketViewLinkCardMockExc = {
        marketName: "exchange market name",
        urn: "ppb:tbd:card:marketViewLink:1",
        viewLink: {
          viewUrn: "ppb:tbd:view:market:1",
          viewUrl: "-/r-1",
        },
      };
      const marketViewLinkCardMockSbk = {
        marketName: "sportsbook market name",
        urn: "ppb:tbd:card:marketViewLink:2",
        viewLink: {
          viewUrn: "ppb:tbd:view:market:2",
          viewUrl: "-/r-2",
        },
      };
      getMarketViewLinkCardByURN
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(marketViewLinkCardMockExc)
        .mockReturnValueOnce(marketViewLinkCardMockSbk);

      const result = getMarketViewLinks(stateMock, [
        "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
        "urn:marketviewlink:exc:1",
        "urn:marketviewlink:sbk:2",
      ]);

      getMarketViewLinkCardByURN
        .mockReturnValueOnce(null)
        .mockReturnValueOnce(marketViewLinkCardMockExc)
        .mockReturnValueOnce(marketViewLinkCardMockSbk);

      const result2 = getMarketViewLinks(stateMock, [
        "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
        "urn:marketviewlink:exc:1",
        "urn:marketviewlink:sbk:2",
      ]);

      expect(result).toBe(result2);

      expect(getMarketViewLinks.recomputations()).toBe(1);

      jest.clearAllMocks();
    });
  });

  describe("when there are changes in market view links", () => {
    // Helper: find by -> cause the change to find the lines that make the selector return new instance
    describe("when the market view links size changes", () => {
      it("should return a new instance", async () => {
        // a new element was added in the return value
        const getMarketViewLinkCardByURN = jest.fn();
        createCardByURNSelector.mockReturnValue(getMarketViewLinkCardByURN);
        const createGetMarketViewLinks = await setup();
        const getMarketViewLinks = createGetMarketViewLinks();

        const marketViewLinkCardsMockState = {
          viewUrn: "ppb:tbd:view:market:1.12345",
          viewUrl: "-/rc-1.12345",
        };
        const marketViewMockState = {};
        const exchangeMarketsMockState = {};
        const sportsbookMarketsMockState = {};

        const stateMock = {
          layouts: {
            cards: {
              marketviewlinks: marketViewLinkCardsMockState,
            },
            views: {
              market: marketViewMockState,
            },
          },
          entities: {
            exchangemarkets: exchangeMarketsMockState,
            sportsbookmarkets: sportsbookMarketsMockState,
          },
        };

        const marketViewLinkCardMockExc = {
          marketName: "exchange market name",
          urn: "ppb:tbd:card:marketViewLink:1",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:1",
            viewUrl: "-/r-1",
          },
        };
        const marketViewLinkCardMockSbk = {
          marketName: "sportsbook market name",
          urn: "ppb:tbd:card:marketViewLink:2",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:2",
            viewUrl: "-/r-2",
          },
        };

        getMarketViewLinkCardByURN
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(marketViewLinkCardMockExc)
          .mockReturnValueOnce(marketViewLinkCardMockSbk);

        const result = getMarketViewLinks(stateMock, [
          "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
          "urn:marketviewlink:exc:1",
          "urn:marketviewlink:sbk:2",
        ]);

        getMarketViewLinkCardByURN
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(marketViewLinkCardMockExc)
          .mockReturnValueOnce(marketViewLinkCardMockSbk)
          // this will cause the change!
          .mockReturnValueOnce(marketViewLinkCardMockSbk);

        const result2 = getMarketViewLinks(stateMock, [
          "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
          "urn:marketviewlink:exc:1",
          "urn:marketviewlink:sbk:2",
          // this will cause the change!
          "urn:marketviewlink:this_will_cause_the_change",
        ]);

        expect(result).not.toBe(result2);

        expect(getMarketViewLinks.recomputations()).toBe(2);

        jest.clearAllMocks();
      });
    });

    describe("when a market view link URN changes", () => {
      it("should return a new instance", async () => {
        const getMarketViewLinkCardByURN = jest.fn();
        createCardByURNSelector.mockReturnValue(getMarketViewLinkCardByURN);
        const createGetMarketViewLinks = await setup();
        const getMarketViewLinks = createGetMarketViewLinks();

        const marketViewLinkCardsMockState = {
          viewUrn: "ppb:tbd:view:market:1.12345",
          viewUrl: "-/rc-1.12345",
        };
        const marketViewMockState = {};
        const exchangeMarketsMockState = {};
        const sportsbookMarketsMockState = {};

        const stateMock = {
          layouts: {
            cards: {
              marketviewlinks: marketViewLinkCardsMockState,
            },
            views: {
              market: marketViewMockState,
            },
          },
          entities: {
            exchangemarkets: exchangeMarketsMockState,
            sportsbookmarkets: sportsbookMarketsMockState,
          },
        };

        const marketViewLinkCardMockExc = {
          marketName: "exchange market name",
          urn: "ppb:tbd:card:marketViewLink:1",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:1",
            viewUrl: "-/r-1",
          },
        };
        // this will cause the change!
        const marketViewLinkCardMockSbk = {
          marketName: "sportsbook market name",
          urn: "ppb:tbd:card:marketViewLink:2",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:2",
            viewUrl: "-/r-2",
          },
        };
        const marketViewLinkCardMockExc2 = {
          marketName: "exchange market name",
          urn: "ppb:tbd:card:marketViewLinkCHANGED:1",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:2",
            viewUrl: "-/r-2",
          },
        };

        getMarketViewLinkCardByURN
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(marketViewLinkCardMockExc)
          .mockReturnValueOnce(marketViewLinkCardMockSbk);

        const result = getMarketViewLinks(stateMock, [
          "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
          "urn:marketviewlink:exc:1",
          "urn:marketviewlink:sbk:2",
        ]);

        getMarketViewLinkCardByURN
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(marketViewLinkCardMockExc2)
          .mockReturnValueOnce(marketViewLinkCardMockSbk);

        const result2 = getMarketViewLinks(stateMock, [
          "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
          "urn:marketviewlink:exc:1",
          "urn:marketviewlink:sbk:2",
        ]);

        expect(result).not.toBe(result2);

        expect(getMarketViewLinks.recomputations()).toBe(2);

        jest.clearAllMocks();
      });
    });

    describe("when a market view link name changes", () => {
      it("should return a new instance", async () => {
        const getMarketViewLinkCardByURN = jest.fn();
        createCardByURNSelector.mockReturnValue(getMarketViewLinkCardByURN);
        const createGetMarketViewLinks = await setup();
        const getMarketViewLinks = createGetMarketViewLinks();

        const marketViewLinkCardsMockState = {};
        const marketViewMockState = {};
        const exchangeMarketsMockState = {};
        const sportsbookMarketsMockState = {};

        const stateMock = {
          layouts: {
            cards: {
              marketviewlinks: marketViewLinkCardsMockState,
            },
            views: {
              market: marketViewMockState,
            },
          },
          entities: {
            exchangemarkets: exchangeMarketsMockState,
            sportsbookmarkets: sportsbookMarketsMockState,
          },
        };

        const marketViewLinkCardMockExc = {
          marketName: "exchange market name",
          urn: "ppb:tbd:card:marketViewLink:1",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:1",
            viewUrl: "-/r-1",
          },
        };
        // this will cause the change!
        const marketViewLinkCardMockSbk = {
          marketName: "sportsbook market name",
          urn: "ppb:tbd:card:marketViewLink:2",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:2",
            viewUrl: "-/r-2",
          },
        };
        const marketViewLinkCardMockExc2 = {
          marketName: "exchange market name",
          urn: "ppb:tbd:card:marketViewLinkCHANGED:1",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:2",
            viewUrl: "-/r-2",
          },
        };

        getMarketViewLinkCardByURN
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(marketViewLinkCardMockExc)
          .mockReturnValueOnce(marketViewLinkCardMockSbk);

        const result = getMarketViewLinks(stateMock, [
          "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
          "urn:marketviewlink:exc:1",
          "urn:marketviewlink:sbk:2",
        ]);

        getMarketViewLinkCardByURN
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(marketViewLinkCardMockExc2)
          .mockReturnValueOnce(marketViewLinkCardMockSbk);

        const result2 = getMarketViewLinks(stateMock, [
          "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
          "urn:marketviewlink:exc:1",
          "urn:marketviewlink:sbk:2",
        ]);

        expect(result).not.toBe(result2);

        expect(getMarketViewLinks.recomputations()).toBe(2);

        jest.clearAllMocks();
      });
    });

    describe("when a market view link Url changes", () => {
      it("should return a new instance", async () => {
        const getMarketViewLinkCardByURN = jest.fn();
        createCardByURNSelector.mockReturnValue(getMarketViewLinkCardByURN);
        const createGetMarketViewLinks = await setup();
        const getMarketViewLinks = createGetMarketViewLinks();

        const marketViewLinkCardsMockState = {
          viewUrn: "ppb:tbd:view:market:1.12345",
          viewUrl: "-/rc-1.12345",
        };
        const marketViewMockState = {};
        const exchangeMarketsMockState = {};
        const sportsbookMarketsMockState = {};

        const stateMock = {
          layouts: {
            cards: {
              marketviewlinks: marketViewLinkCardsMockState,
            },
            views: {
              market: marketViewMockState,
            },
          },
          entities: {
            exchangemarkets: exchangeMarketsMockState,
            sportsbookmarkets: sportsbookMarketsMockState,
          },
        };

        const marketViewLinkCardMockExc = {
          marketName: "exchange market name",
          urn: "ppb:tbd:card:marketViewLink:1",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:1",
            viewUrl: "-/r-1",
          },
        };
        // this will cause the change!
        const marketViewLinkCardMockSbk = {
          marketName: "sportsbook market name",
          urn: "ppb:tbd:card:marketViewLink:2",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:2",
            viewUrl: "-/r-2",
          },
        };
        const marketViewLinkCardMockExc2 = {
          marketName: "exchange market name",
          urn: "ppb:tbd:card:marketViewLinkCHANGED:1",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:2",
            viewUrl: "-/r-2",
          },
        };

        getMarketViewLinkCardByURN
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(marketViewLinkCardMockExc)
          .mockReturnValueOnce(marketViewLinkCardMockSbk);

        const result = getMarketViewLinks(stateMock, [
          "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
          "urn:marketviewlink:exc:1",
          "urn:marketviewlink:sbk:2",
        ]);

        getMarketViewLinkCardByURN
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(marketViewLinkCardMockExc2)
          .mockReturnValueOnce(marketViewLinkCardMockSbk);

        const result2 = getMarketViewLinks(stateMock, [
          "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
          "urn:marketviewlink:exc:1",
          "urn:marketviewlink:sbk:2",
        ]);

        expect(result).not.toBe(result2);

        expect(getMarketViewLinks.recomputations()).toBe(2);

        jest.clearAllMocks();
      });
    });

    describe("when a market view link badge changes", () => {
      it("should return a new instance", async () => {
        const getMarketViewLinkCardByURN = jest.fn();
        createCardByURNSelector.mockReturnValue(getMarketViewLinkCardByURN);
        const createGetMarketViewLinks = await setup();
        const getMarketViewLinks = createGetMarketViewLinks();

        const marketViewLinkCardsMockState = {
          viewUrn: "ppb:tbd:view:market:1.12345",
          viewUrl: "-/rc-1.12345",
        };
        const marketViewMockState = {};
        const exchangeMarketsMockState = {};
        const sportsbookMarketsMockState = {};

        const stateMock = {
          layouts: {
            cards: {
              marketviewlinks: marketViewLinkCardsMockState,
            },
            views: {
              market: marketViewMockState,
            },
          },
          entities: {
            exchangemarkets: exchangeMarketsMockState,
            sportsbookmarkets: sportsbookMarketsMockState,
          },
        };

        const marketViewLinkCardMockExc = {
          marketName: "exchange market name",
          urn: "ppb:tbd:card:marketViewLink:1",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:1",
            viewUrl: "-/r-1",
          },
        };

        const marketViewLinkCardMockSbk = {
          marketName: "sportsbook market name",
          urn: "ppb:tbd:card:marketViewLink:2",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:2",
            viewUrl: "-/r-2",
          },
          badge: "BADGE",
        };

        const marketViewLinkCardMockSbk2 = {
          marketName: "sportsbook market name",
          urn: "ppb:tbd:card:marketViewLink:2",
          viewLink: {
            viewUrn: "ppb:tbd:view:market:2",
            viewUrl: "-/r-2",
          },
          badge: "CHANGED",
        };

        getMarketViewLinkCardByURN
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(marketViewLinkCardMockExc)
          .mockReturnValueOnce(marketViewLinkCardMockSbk);

        const result = getMarketViewLinks(stateMock, [
          "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
          "urn:marketviewlink:exc:1",
          "urn:marketviewlink:sbk:2",
        ]);

        getMarketViewLinkCardByURN
          .mockReturnValueOnce(null)
          .mockReturnValueOnce(marketViewLinkCardMockExc)
          .mockReturnValueOnce(marketViewLinkCardMockSbk2);

        const result2 = getMarketViewLinks(stateMock, [
          "urn:marketviewlink:MARKET_VIEW_LINK_CARD_BY_URN_NULL",
          "urn:marketviewlink:exc:1",
          "urn:marketviewlink:sbk:2",
        ]);

        expect(result).not.toBe(result2);

        expect(getMarketViewLinks.recomputations()).toBe(2);

        jest.clearAllMocks();
      });
    });
  });
});
