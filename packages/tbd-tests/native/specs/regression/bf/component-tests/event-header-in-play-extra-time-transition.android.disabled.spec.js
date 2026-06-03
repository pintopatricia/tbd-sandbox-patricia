const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;

const {
  getAppContext,
  getMainMarkets,
  getEventLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const { EventHeaderSO } = require("../../../../screen-objects");

const mockService = new MockService();
const fixtureCardEventHeader = new EventHeaderSO();

const EVENT_ID = 1;
const COMPETITION_ID = 1;
const COMPETITION = {
  urn: `ppb:competition:${COMPETITION_ID}`,
  name: "English Premier League",
};

const SPORT_EVENT = {
  __typename: "SportsEvent",
  urn: `ppb:event:${EVENT_ID}`,
  eventId: EVENT_ID,
  name: "Team A v Team B",
  openDate: "2021-06-15T11:00:00Z",
  competition: COMPETITION,
};

const getEventMarketCard = (hasExchange, hasSportsbook, marketIdSuffix) => ({
  __typename: "EventMarketCard",
  urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
  title: "Team A vs Team B",
  sportevent: SPORT_EVENT,
  fixture: {
    __typename: "BaseFixture",
    sportevent: {
      ...SPORT_EVENT,

      name: hasExchange ? (hasSportsbook ? `Both` : `Exchange Only`) : `Sportsbook Only`,
    },
    mainMarket: {
      ...(!hasExchange
        ? {}
        : {
            exchange: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:1.${marketIdSuffix}`,
            },
          }),
      ...(!hasSportsbook
        ? {}
        : {
            sportsbook: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:924.${marketIdSuffix}`,
            },
          }),
    },
  },
  displayRunners: {},
});

const getBFFMock = (hasExchange, hasSportsbook, marketIdSuffix) => ({
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: SPORT_EVENT,
  edges: [
    {
      node: getEventMarketCard(hasExchange, hasSportsbook, marketIdSuffix),
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "EventMarketCard",
        urn: `ppb:tbd:card:eventPrimaryMarket:${EVENT_ID}`,
      },
    },
  ],
});

const getMainMarketsMock = (hasExchange, hasSportsbook, marketIdSuffix) => ({
  cards: [{ ...getEventMarketCard(hasExchange, hasSportsbook, marketIdSuffix) }],
});

const BFF_EMPTY_CARDS_MOCK = { cards: [] };

const getSMPMock = (marketIdSuffix, status) => {
  const MARKET = {
    marketId: `924.${marketIdSuffix}`,
    runnerDetails: [],
  };

  if (status === "CLOSED") {
    return {
      markets: [{ ...MARKET, noMarketInfo: true }],
    };
  }

  return {
    markets: [
      {
        ...MARKET,
        marketStatus: status === "IN-PLAY" ? "OPEN" : status,
        inplay: status === "IN-PLAY" ? true : "false",
      },
    ],
  };
};

const getEROMock = (marketIdSuffix, status) => [
  {
    marketId: `1.${marketIdSuffix}`,
    runners: [],
    state: {
      status: status === "IN-PLAY" ? "OPEN" : status,
      inplay: status === "IN-PLAY" ? true : "false",
    },
  },
];

const LBR_MOCK = { marketPositions: [{ marketId: "1.1" }, { marketId: "1.2" }] };

const iosDate = "June 15 at 12:00";
const androidDate = "June 15, 12:00";

describe("In play extra time transition for event market cards", () => {
  describe("When the user is at a given screen and an eventMarketCard is retrieved with BaseFixture", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}));
      await mockService.mockHttpRequest(getMarketPositionViews(LBR_MOCK));
    });

    describe("And with a pre-play EXC market available", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getEventLayout(getBFFMock(true, false, 1)));
        await mockService.mockHttpRequest(getMarkets(getEROMock(1, "OPEN")));
        const url = `sport/competition/event/e-${EVENT_ID}`;
        const HOME_VIEW_LINK = getStartViewLink(url);
        await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

        await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });
        await browser.waitUntilEquals(fixtureCardEventHeader.title, "Exchange Only");
      });

      it("[PRPI-1917] - The event start date and time should be visible", async () => {
        expect([iosDate, androidDate]).toContain(await fixtureCardEventHeader.subtitle.getText());
      });

      describe("And the EXC market turns inplay", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarkets(getEROMock(1, "IN-PLAY")));
          await browser.waitUntilEquals(fixtureCardEventHeader.inplay, "In-play");
        });

        it("[PRPI-1918] - The 'In-play' status should be visible", async () => {
          expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
        });

        it("[PRPI-1919] - The event start date and time should not be visible", async () => {
          expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
        });

        describe("And then the EXC market closes And a new primary market is retrieved with inplay=true", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarkets(getEROMock(1, "CLOSED")));
            await mockService.mockHttpRequest(getMainMarkets(getMainMarketsMock(true, false, 2)));
            await browser.waitUntilNotDisplayed(fixtureCardEventHeader.inplay);
            await mockService.mockHttpRequest(getMarkets(getEROMock(2, "IN-PLAY")));
            await browser.waitUntilDisplayed(fixtureCardEventHeader.inplay);
          });

          it("[PRPI-1920] - The 'In-play' status should be visible", async () => {
            expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
          });

          it("[PRPI-1920] - The event start date and time should not be visible", async () => {
            expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
          });

          describe("And the new EXC market closes And no more primary markets are retrieved", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getMarkets(getEROMock(2, "CLOSED")));
              await mockService.mockHttpRequest(getMainMarkets(BFF_EMPTY_CARDS_MOCK));
              await browser.waitUntilNotDisplayed(fixtureCardEventHeader.inplay);
            });

            it("[PRPI-1920] - The 'In-play' status should not be visible", async () => {
              expect(await fixtureCardEventHeader.inplay.isDisplayed()).toBe(false);
            });

            it("[PRPI-1920] - The event start date and time should be visible", async () => {
              expect([iosDate, androidDate]).toContain(await fixtureCardEventHeader.subtitle.getText());
            });
          });
        });
      });
    });

    describe("And with a pre-play SBK market available", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getEventLayout(getBFFMock(false, true, 1)));
        await mockService.mockHttpRequest(getMarketPrices(getSMPMock(1, "OPEN")));
        await swipeDownElementFullscreen(fixtureCardEventHeader.element);
        await browser.waitUntilDisplayed(fixtureCardEventHeader.subtitle);
        await browser.waitUntilEquals(fixtureCardEventHeader.title, "Sportsbook Only");
      });

      it("[PRPI-1921] - The event start date and time should be visible", async () => {
        expect([iosDate, androidDate]).toContain(await fixtureCardEventHeader.subtitle.getText());
      });

      describe("And the SBK market turns inplay", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarketPrices(getSMPMock(1, "IN-PLAY")));
          await browser.waitUntilEquals(fixtureCardEventHeader.inplay, "In-play");
        });

        it("[PRPI-1922] - The 'In-play' status should be visible", async () => {
          expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
        });

        it("[PRPI-1923] - The event start date and time should not be visible", async () => {
          expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
        });

        describe("And then the SBK market closes And a new primary market is retrieved with inplay=true", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarketPrices(getSMPMock(1, "CLOSED")));
            await mockService.mockHttpRequest(getMainMarkets(getMainMarketsMock(false, true, 2)));
            await mockService.mockHttpRequest(getMarketPrices(getSMPMock(2, "IN-PLAY")));
            await browser.waitUntilDisplayed(fixtureCardEventHeader.inplay);
          });

          it("[PRPI-1924] - The 'In-play' status should be visible", async () => {
            expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
          });

          it("[PRPI-1924] - The event start date and time should not be visible", async () => {
            expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
          });

          describe("And then the SBK market closes And no more primary markets are retrieved", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getMarketPrices(getSMPMock(2, "CLOSED")));
              await mockService.mockHttpRequest(getMainMarkets(BFF_EMPTY_CARDS_MOCK));
              await browser.waitUntilNotDisplayed(fixtureCardEventHeader.inplay);
            });

            it("[PRPI-1924] - The 'In-play' status should not be visible", async () => {
              expect(await fixtureCardEventHeader.inplay.isDisplayed()).toBe(false);
            });

            it("[PRPI-1924] - The event start date and time should be visible", async () => {
              expect([iosDate, androidDate]).toContain(await fixtureCardEventHeader.subtitle.getText());
            });
          });
        });
      });
    });

    describe("And with an inplay EXC and a closed SBK markets", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getEventLayout(getBFFMock(true, true, 1)));
        await mockService.mockHttpRequest(getMarkets(getEROMock(1, "IN-PLAY")));
        await mockService.mockHttpRequest(getMarketPrices(getSMPMock(1, "CLOSED")));
        await swipeDownElementFullscreen(fixtureCardEventHeader.element);
        await browser.waitUntilEquals(fixtureCardEventHeader.title, "Both");
        await browser.waitUntilDisplayed(fixtureCardEventHeader.inplay);
      });

      it("[PRPI-1925] - The 'In-play' status should be visible", async () => {
        expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
      });

      it("[PRPI-1926] - The event start date and time should not be visible", async () => {
        expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
      });

      describe("And EXC market closes", () => {
        describe("And a new primary market is retrieved with inplay=true (SBK and EXC)", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarkets(getEROMock(1, "CLOSED")));
            await mockService.mockHttpRequest(getMainMarkets(getMainMarketsMock(true, true, 2)));
            await mockService.mockHttpRequest(getMarkets(getEROMock(2, "IN-PLAY")));
            await mockService.mockHttpRequest(getMarketPrices(getSMPMock(2, "IN-PLAY")));
            await browser.waitUntilDisplayed(fixtureCardEventHeader.inplay);
          });

          it("[PRPI-1927] - The 'In-play' status should be visible", async () => {
            expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
          });

          it("[PRPI-1927] - The event start date and time should not be visible", async () => {
            expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
          });

          describe("And the EXC and SBK markets close And no more primary markets are retrieved", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getMarketPrices(getSMPMock(2, "CLOSED")));
              await mockService.mockHttpRequest(getMarkets(getEROMock(2, "CLOSED")));
              await mockService.mockHttpRequest(getMainMarkets(BFF_EMPTY_CARDS_MOCK));
              await browser.waitUntilNotDisplayed(fixtureCardEventHeader.inplay);
            });

            it("[PRPI-1927] - The 'In-play' status should not be visible", async () => {
              expect(await fixtureCardEventHeader.inplay.isDisplayed()).toBe(false);
            });

            it("[PRPI-1927] - The event start date and time should be visible", async () => {
              expect([iosDate, androidDate]).toContain(await fixtureCardEventHeader.subtitle.getText());
            });
          });
        });
      });
    });
  });
});
