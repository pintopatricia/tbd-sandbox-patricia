const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getMarketPositionViews } = require("@flutter-global/uki-channels-http-clients/mock-index").LBR;
const { getEventLayout, getMainMarkets } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { EventHeaderPO, BottomBarPO } = require("../../../../../page-objects");
const MockService = require("../../../../../mock-essentials/mocking-service");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const fixtureCardEventHeader = new EventHeaderPO();
const bottomBarPO = new BottomBarPO();

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
const VIEW_URN = `ppb:tbd:view:event:${EVENT_ID}`;

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

  hasProductSwitcher: true,
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

const LBR_MOCK = {
  marketPositions: [{ marketId: "1.1" }, { marketId: "1.2" }, { marketId: "1.3" }],
};

describe("In play extra time transition for event market cards", () => {
  describe("When the user is at a given page and an eventMarketCard is retrieved with BaseFixture", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(VIEW_URN));
      await mockService.mockHttpRequest(getMarketPositionViews(LBR_MOCK));
    });

    describe("And with a pre-play EXC market available", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getEventLayout(getBFFMock(true, false, 1)));
        await mockService.mockHttpRequest(getMarkets(getEROMock(1, "OPEN")));
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilEquals(fixtureCardEventHeader.subtitle, "Jun 15, 12:00");
      });

      it("[PRPI-6764] - The event start date and time should be visible", async () => {
        expect(await fixtureCardEventHeader.subtitle.getText()).toBe("Jun 15, 12:00");
      });

      describe("And the EXC market turns inplay", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarkets(getEROMock(1, "IN-PLAY")));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(fixtureCardEventHeader.inplay, "In-play");
        });

        it("[PRPI-6765] - The 'In-play' status should be visible", async () => {
          expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
        });

        it("[PRPI-6766] - The event start date and time should not be visible", async () => {
          expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
        });

        describe("And then the EXC market closes And a new primary market is retrieved with inplay=true", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMainMarkets(getMainMarketsMock(true, false, 2)));
            await mockService.mockHttpRequest(getMarkets(getEROMock(1, "CLOSED")));
            await browser.tickFakeClock();

            // wait for close before inplay again
            await browser.waitUntilNotDisplayed(fixtureCardEventHeader.inplay);

            // trigger polling on new market to make sure what the `waitUntil` checks belongs to it
            await mockService.mockHttpRequest(getMarkets(getEROMock(2, "IN-PLAY")));
            await browser.tickFakeClock();

            await browser.waitUntilEquals(fixtureCardEventHeader.inplay, "In-play");
          });

          it("[PRPI-6767] - The 'In-play' status should be visible", async () => {
            expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
          });

          it("[PRPI-6767] - The event start date and time should not be visible", async () => {
            expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
          });

          describe("And the new EXC market closes And a new primary market is retrieved with inplay=true", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getMainMarkets(getMainMarketsMock(true, false, 3)));
              await mockService.mockHttpRequest(getMarkets(getEROMock(2, "CLOSED")));
              await browser.tickFakeClock();

              // wait for close before inplay again
              await browser.waitUntilNotDisplayed(fixtureCardEventHeader.inplay);

              // trigger polling on new market to make sure what the `waitUntil` checks belongs to it
              await mockService.mockHttpRequest(getMarkets(getEROMock(3, "IN-PLAY")));
              await browser.tickFakeClock();

              await browser.waitUntilDisplayed(fixtureCardEventHeader.inplay);
            });

            it("[PRPI-6767] - The 'In-play' status should be visible", async () => {
              expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
            });

            it("[PRPI-6767] - The event start date and time should not be visible", async () => {
              expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
            });
          });
        });

        describe("And the new EXC market closes And no more primary markets are retrieved", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarkets(getEROMock(3, "CLOSED")));
            await mockService.mockHttpRequest(getMainMarkets(BFF_EMPTY_CARDS_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilNotDisplayed(fixtureCardEventHeader.inplay);
          });

          it("[PRPI-6768] - The 'In-play' status should not be visible", async () => {
            expect(await fixtureCardEventHeader.inplay.isDisplayed()).toBe(false);
          });

          it("[PRPI-6768] - The event start date and time should be visible", async () => {
            expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(true);
          });
        });
      });
    });

    describe("When an eventMarketCard is retrieved with BaseFixture And with a pre-play SBK market available", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getEventLayout(getBFFMock(false, true, 1)));
        await mockService.mockHttpRequest(getMarketPrices(getSMPMock(1, "OPEN")));
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilEquals(fixtureCardEventHeader.subtitle, "Jun 15, 12:00");
      });

      it("[PRPI-6769] - The event start date and time should be visible", async () => {
        expect(await fixtureCardEventHeader.subtitle.getText()).toBe("Jun 15, 12:00");
      });

      describe("And the SBK market turns inplay", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getMarketPrices(getSMPMock(1, "IN-PLAY")));
          await browser.tickFakeClock();
          await browser.waitUntilEquals(fixtureCardEventHeader.inplay, "In-play");
        });

        it("[PRPI-6769] - The 'In-play' status should be visible", async () => {
          expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
        });

        it("[PRPI-6769] - The event start date and time should not be visible", async () => {
          expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
        });

        describe("And then the SBK market closes And a new primary market is retrieved with inplay=true", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMainMarkets(getMainMarketsMock(false, true, 2)));
            await mockService.mockHttpRequest(getMarketPrices(getSMPMock(1, "CLOSED")));

            await browser.tickFakeClock();
            // wait for close before inplay again
            await browser.waitUntilNotDisplayed(fixtureCardEventHeader.inplay);

            // trigger polling on new market to make sure what the `waitUntil` checks belongs to it
            await mockService.mockHttpRequest(getMarketPrices(getSMPMock(2, "IN-PLAY")));
            await browser.tickFakeClock();

            await browser.waitUntilDisplayed(fixtureCardEventHeader.inplay);
          });

          it("[PRPI-6769] - The 'In-play' status should be visible", async () => {
            expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
          });

          it("[PRPI-6769] - The event start date and time should not be visible", async () => {
            expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
          });
        });

        describe("And then the SBK market closes And no more primary markets are retrieved", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarketPrices(getSMPMock(2, "CLOSED")));
            await mockService.mockHttpRequest(getMainMarkets(BFF_EMPTY_CARDS_MOCK));
            await browser.tickFakeClock();
            await browser.waitUntilNotDisplayed(fixtureCardEventHeader.inplay);
          });

          it("[PRPI-6769] - The 'In-play' status should not be visible", async () => {
            expect(await fixtureCardEventHeader.inplay.isDisplayed()).toBe(false);
          });

          it("[PRPI-6769] - The event start date and time should be visible", async () => {
            expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(true);
          });
        });
      });
    });

    describe("When an eventMarketCard is retrieved with BaseFixture", () => {
      describe("And with an inplay EXC and a closed SBK markets", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getEventLayout(getBFFMock(true, true, 1)));
          await mockService.mockHttpRequest(getMarkets(getEROMock(1, "IN-PLAY")));
          await mockService.mockHttpRequest(getMarketPrices(getSMPMock(1, "CLOSED")));
          await browser.url(routes.getEventViewUrl(EVENT_ID));
          await browser.waitUntilDisplayed(fixtureCardEventHeader.inplay);
        });

        it("[PRPI-6770] - The 'In-play' status should be visible", async () => {
          expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
        });

        it("[PRPI-6770] - The event start date and time should not be visible", async () => {
          expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
        });

        describe("And  then EXC market closes and a new primary market is retrieved with inplay=true (SBK and EXC)", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMainMarkets(getMainMarketsMock(true, true, 2)));
            await mockService.mockHttpRequest(getMarkets(getEROMock(1, "CLOSED")));
            await mockService.mockHttpRequest(getMarketPrices(getSMPMock(2, "IN-PLAY")));
            await mockService.mockHttpRequest(getMarkets(getEROMock(2, "IN-PLAY")));

            // trigger polling on new market to make sure what the `waitUntil` checks belongs to it
            await browser.tickFakeClock();

            await browser.waitUntilDisplayed(fixtureCardEventHeader.inplay);
          });
          it("[PRPI-6770] - The 'In-play' status should be visible", async () => {
            expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
          });

          it("[PRPI-6770] - The event start date and time should not be visible", async () => {
            expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(false);
          });

          describe("And no more primary markets are retrieved", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(getMainMarkets(BFF_EMPTY_CARDS_MOCK));
              await mockService.mockHttpRequest(getMarketPrices(getSMPMock(2, "CLOSED")));
              await mockService.mockHttpRequest(getMarkets(getEROMock(2, "CLOSED")));
              await browser.tickFakeClock();

              await browser.waitUntilNotDisplayed(fixtureCardEventHeader.inplay);
            });

            it("[PRPI-6770] - The 'In-play' status should not be visible", async () => {
              expect(await fixtureCardEventHeader.inplay.isDisplayed()).toBe(false);
            });

            it("[PRPI-6770] - The event start date and time should be visible", async () => {
              expect(await fixtureCardEventHeader.subtitle.isDisplayed()).toBe(true);
            });
          });
        });
      });
    });

    xdescribe("And a Sportsbook only user is presented an in-play SBK market", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          await getIndexHTML(VIEW_URN, {
            products: ["sportsbook", "games"],
            exchangeEnabled: true,
            PRODUCT_SWITCHER: { isActive: true },
          }),
        );
        await mockService.mockHttpRequest(getEventLayout(getBFFMock(false, true, 1)));
        await mockService.mockHttpRequest(getMarketPrices(getSMPMock(1, "IN-PLAY")));
        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilEquals(bottomBarPO.tiles[4], "Exchange");
        await browser.waitUntilEquals(fixtureCardEventHeader.inplay, "In-play");
      });

      it("[PRPI-6771] - The fixture card event header title should display 'Sportsbook Only'", async () => {
        expect(await fixtureCardEventHeader.title.getText()).toBe("Sportsbook Only");
      });

      // Disabling until we have this journey for dual usage users (SBK usage user is being redirected to /exchange/)

      describe("And the user clicks on the product switcher", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getEventLayout(getBFFMock(true, false, 1)));
          // await mockService.mockHttpRequest(getMarkets(getEROMock(1, "CLOSED")));
          await bottomBarPO.productSwitcherTile.click();
          await browser.waitUntilEquals(bottomBarPO.tiles[4], "Sportsbook");
          await browser.waitUntilEquals(fixtureCardEventHeader.inplay, "In-play");
        });

        it("[PRPI-6772] - The fixture card event header should display the exchange market as 'In-play'", async () => {
          expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
        });

        it("[PRPI-6773] - The fixture card event header title should display 'Exchange Only'", async () => {
          expect(await fixtureCardEventHeader.title.getText()).toBe("Exchange Only");
        });

        describe("And then the EXC market closes and a new primary market is retrieved with inplay=true", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarketPrices(getSMPMock(1, "CLOSED")));
            await mockService.mockHttpRequest(getMarkets(getEROMock(1, "CLOSED")));
            await mockService.mockHttpRequest(
              getMainMarkets(getMainMarketsMock(true, false, 1), {
                extraFilters: { userProducts: '\\["EXCHANGE".*]' },
              }),
            );
            await browser.tickFakeClock();

            // trigger polling on new market to make sure what the `waitUntil` checks belongs to it
            // await mockService.mockHttpRequest(getMarkets(ERO_MOCK_NEW_MAIN_MARKET_INPLAY));
            await browser.tickFakeClock();

            await browser.waitUntilEquals(fixtureCardEventHeader.inplay, "In-play");
          });

          it("[PRPI-6774] - The fixture card event header should display the new exchange market as 'In-play'", async () => {
            expect(await fixtureCardEventHeader.inplay.getText()).toBe("In-play");
          });

          it("[PRPI-6774] - The fixture card event header title should display 'Exchange Only'", async () => {
            expect(await fixtureCardEventHeader.title.getText()).toBe("Exchange Only");
          });

          it("[PRPI-6774] - The product switcher should display the label Sportsbook", async () => {
            expect(await bottomBarPO.productSwitcherTitle.getText()).toBe("Sportsbook");
          });
        });
      });
    });
  });
});
