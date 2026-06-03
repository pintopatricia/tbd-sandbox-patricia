const {
  MinimizedPO,
  SportPagePO,
  SportsbookPlacePanelPO,
  CardPO,
  InlineSportsbookMarketPO,
  SportsbookBetButtonPO,
  BetslipDrawerPO,
  SnackbarPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const EventMarketCardPO = require("@ppb/tbd-shared/components/EventMarketCard/EventMarketCard.po");
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const firstEventMarketCardPO = new EventMarketCardPO(sportPagePO.primaryEventCards[0]);
const firstMatchOddsCardPO = new CardPO(firstEventMarketCardPO.market);
const firstSbkMarketPO = new InlineSportsbookMarketPO(firstMatchOddsCardPO.inlineSportsbookMarket);
const firstSbkRunnerPO = new SportsbookBetButtonPO(firstSbkMarketPO.betButtons[0]);
const placePanelPO = new SportsbookPlacePanelPO();
const minimizedPO = new MinimizedPO();
const betslipDrawerPO = new BetslipDrawerPO();
const snackbarPO = new SnackbarPO();

const mockService = new MockService();

const arrayFrom = (builder, length) =>
  Array(length)
    .fill()
    .map((_, index) => builder(index));

const buildMarketID = (number) => `924.924${number}`;

const buildBFFPartialMock = (index) => ({
  node: {
    __typename: "EventMarketCard",
    urn: `ppb:tbd:card:eventPrimaryMarket:290000${index}`,
  },
});

const buildBFFMarketMock = (index) => ({
  node: {
    __typename: "EventMarketCard",
    urn: `ppb:tbd:card:eventPrimaryMarket:290000${index}`,
    title: `Market #${index}`,
    fixture: {
      urn: `ppb:fixture:290000${index}`,
      home: {
        name: "Team A",
      },
      away: {
        name: "Team B",
      },
    },
    sportevent: {
      name: "Home Team vs Away Team",
      urn: "ppb:event:12345",
      __typename: "SportsEvent",
      competition: {
        urn: "ppb:competition:12191691",
        name: "Competition Name",
      },
    },
    displayRunners: {
      sportsbook: {
        market: {
          __typename: "SportsbookMarket",
          urn: `ppb:sbkMarket:${buildMarketID(index)}`,
          noLiveData: true,
          name: "Match Odds",
          hierarchy: {
            __typename: "EventHierarchy",
            sportevent: {
              name: `Market #${index}`,
              urn: `ppb:event:290000${index}`,
            },
          },
          runners: [
            {
              runnerURN: `ppb:sbkRunner:${buildMarketID(index)}/1`,
              selectionId: 1,
              name: "Team A",
            },
            {
              runnerURN: `ppb:sbkRunner:${buildMarketID(index)}/2`,
              selectionId: 2,
              name: "Draw",
            },
            {
              runnerURN: `ppb:sbkRunner:${buildMarketID(index)}/3`,
              selectionId: 3,
              name: "Team B",
            },
          ],
        },
        runners: [
          { runnerURN: `ppb:sbkRunner:${buildMarketID(index)}/1` },
          { runnerURN: `ppb:sbkRunner:${buildMarketID(index)}/2` },
          { runnerURN: `ppb:sbkRunner:${buildMarketID(index)}/3` },
        ],
      },
    },
  },
});

const BFF_MOCK = {
  urn: "ppb:tbd:view:sport:1",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        cardGroupTitle: "League",
        partials: {
          edges: arrayFrom(buildBFFPartialMock, 26),
        },
        full: {
          edges: arrayFrom(buildBFFMarketMock, 26),
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
  ],
};

const buildMarketPriceMock = (index) => ({
  marketId: `${buildMarketID(index)}`,
  runnerDetails: [
    {
      selectionId: "1",
      runnerOdds: {
        decimalDisplayOdds: { decimalOdds: 1.1 },
        fractionalDisplayOdds: { numerator: 1, denominator: 2 },
      },
    },
    {
      selectionId: "2",
      noOdds: true,
    },
  ],
});

const SMP_MOCK = { markets: arrayFrom(buildMarketPriceMock, 26) };

const buildSingleCombinationMock = (index) => ({
  legCombinations: [{ runners: [{ marketId: `${buildMarketID(index)}`, selectionId: 1 }] }],
  winAvgOdds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
});

const buildSingleOddsMock = (index) => ({
  runner: { marketId: `${buildMarketID(index)}`, selectionId: 1 },
  odds: {
    trueOdds: { decimalOdds: { decimalOdds: 1.1 } },
    fractionalDisplayOdds: { numerator: 1, denominator: 2 },
  },
});

const buildImplyMock = (nrOfSelections) => ({
  betCombinations: arrayFrom(buildSingleCombinationMock, nrOfSelections),
  runnerOdds: arrayFrom(buildSingleOddsMock, nrOfSelections),
});

const addSelection = async (index) => {
  const eventMarketCard = new EventMarketCardPO(sportPagePO.primaryEventCards[index]);
  const matchOddsCard = new CardPO(eventMarketCard.market);
  const sbkMarket = new InlineSportsbookMarketPO(matchOddsCard.inlineSportsbookMarket);
  const firstSbkRunner = new SportsbookBetButtonPO(sbkMarket.betButtons[0]);

  await mockService.mockHttpRequest(getImplyBetsResponse(buildImplyMock(index + 1)));
  await firstSbkRunner.sportsbookBetButton.waitForClickable();
  await firstSbkRunner.sportsbookBetButton.click();
};

describe("Snackbar", () => {
  // adding all these selections split into three `beforaAll` so that we avoid timeouts (this sucks)
  describe("with initial 8 selections", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
      await browser.url(routes.getSportViewUrl(1));
      await browser.waitUntilEquals(firstSbkRunnerPO.odd, "1.1");

      await addSelection(0);
      await browser.waitUntilDisplayed(placePanelPO.element, "Place panel wasn't displayed");

      await betslipDrawerPO.header.click();
      await browser.waitUntilEquals(minimizedPO.counter, "1");

      for (let i = 1; i < 8; i += 1) {
        await addSelection(i);
        await browser.waitUntilEquals(minimizedPO.counter, (i + 1).toString());
      }
    });

    describe("adding 8 more selections", () => {
      beforeAll(async () => {
        for (let i = 8; i < 17; i += 1) {
          await addSelection(i);
          await browser.waitUntilEquals(minimizedPO.counter, (i + 1).toString());
        }
      });

      describe("with a total of 25 selections", () => {
        beforeAll(async () => {
          for (let i = 17; i < 25; i += 1) {
            await addSelection(i);
            await browser.waitUntilEquals(minimizedPO.counter, (i + 1).toString());
          }
        });

        describe("when the user tries to add the 26th selection", () => {
          beforeAll(async () => {
            await addSelection(25);
            await browser.waitUntilDisplayed(snackbarPO.element, "Snackbar wasn't displayed");
          });

          it("[PRPI-6085] should display snackbar with title", async () => {
            expect(await snackbarPO.title.getText()).toBe("Betslip Full");
          });

          it("[PRPI-6086] should display snackbar with subtitle", async () => {
            expect(await snackbarPO.description.getText()).toBe("The maximum number of selections is 25.");
          });

          describe("when the user opens the betslip", () => {
            beforeAll(async () => {
              await minimizedPO.element.click();
              await browser.tickFakeClock();
              await browser.waitUntilNotDisplayed(snackbarPO.element, "Snackbar is displayed");
            });

            it("[PRPI-6087] should NOT display the snackbar", async () => {
              expect(await snackbarPO.element.isDisplayed()).toBe(false);
            });

            describe("when the user tries to add the 26th selection", () => {
              beforeAll(async () => {
                await betslipDrawerPO.header.click();
                await browser.waitUntilEquals(minimizedPO.counter, "25");
                await addSelection(25);
                await browser.waitUntilDisplayed(snackbarPO.element, "Snackbar wasn't displayed");
              });

              it("[PRPI-6088] should display the snackbar", async () => {
                expect(await snackbarPO.element.isDisplayed()).toBe(true);
              });

              describe("when the user clicks on close button", () => {
                beforeAll(async () => {
                  await snackbarPO.closeButton.click();
                  await browser.waitUntilNotDisplayed(snackbarPO.element, "Snackbar is displayed");
                });

                it("[PRPI-6089] should NOT display the snackbar", async () => {
                  expect(await snackbarPO.element.isDisplayed()).toBe(false);
                });

                describe("when the user tries to add the 26th selection", () => {
                  beforeAll(async () => {
                    await addSelection(25);
                    await browser.waitUntilDisplayed(snackbarPO.element, "Snackbar wasn't displayed");
                  });

                  it("[PRPI-6089] should display the snackbar", async () => {
                    expect(await snackbarPO.element.isDisplayed()).toBe(true);
                  });

                  describe("after 4 seconds", () => {
                    beforeAll(async () => {
                      await browser.tickFakeClock();
                      await browser.waitUntilNotDisplayed(snackbarPO.element, "Snackbar is displayed");
                    });

                    it("[PRPI-6089] should NOT display the snackbar", async () => {
                      expect(await snackbarPO.element.isDisplayed()).toBe(false);
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
