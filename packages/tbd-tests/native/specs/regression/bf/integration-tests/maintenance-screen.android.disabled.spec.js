const { getMaintenanceLayout, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { MaintenanceScreenSO, CardSO } = require("../../../../screen-objects");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const mockService = new MockService();

const maintenanceScreenSO = new MaintenanceScreenSO();
const cardSO = new CardSO();

const BFF_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "Not Implemented",
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:X9D2vhIAACgAw1Kj/cv/home",
        cardGroupTitle: "Horse Racing",
        full: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:1.178518448;924.251533165|3",
                raceViewLink: {
                  viewUrn: "ppb:tbd:view:race:7|30255458.2015",
                  viewUrl: "horse-racing/wolv-29th-jan/r-7%7C30255458.2015",
                },
                title: "Win",
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.178518448",
                      sport: {
                        __typename: "Sport",
                        urn: "ppb:eventType:7",
                        name: "Horse Racing",
                        sportId: 7,
                      },
                      hierarchy: {
                        __typename: "RaceHierarchy",
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:30255458.2015",
                          startTime: "2021-01-29T20:15:00.000Z",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:30255458",
                            venue: "Wolverhampton",
                            sport: {
                              __typename: "Sport",
                              urn: "ppb:eventType:7",
                              name: "Horse Racing",
                              sportId: 7,
                            },
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:30255458",
                          venue: "Wolverhampton",
                          sport: {
                            __typename: "Sport",
                            urn: "ppb:eventType:7",
                            name: "Horse Racing",
                            sportId: 7,
                          },
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.178518448/16257108/0",
                          name: "Manumission",
                          selectionId: 16257108,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:excRunner:1.178518448/16257108/0",
                      },
                    ],
                  },
                },
                numberOfRunners: 3,
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30255458.2015",
                  startTime: "2021-01-29T20:15:00.000Z",
                  name: "Handicap (Class 6)",
                  details: {
                    distance: {
                      miles: 0,
                      furlongs: 5,
                      yards: 22,
                    },
                    status: "GOING_BEHIND",
                    type: "FLAT",
                  },
                  runners: [
                    {
                      selectionId: 16257108,
                      horse: {},
                      details: {
                        jockeyName: "Danny Brock",
                        saddleCloth: "10",
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 4,
                      },
                    },
                  ],

                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:30255458",
                    venue: "Wolverhampton",
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:7",
                      name: "Horse Racing",
                      sportId: 7,
                    },
                  },
                },
                runnerViewLinks: [
                  {
                    runnerUrn: "ppb:excRunner:1.178518448/16257108/0",
                    viewUrl: "Not Implemented",
                    viewUrn: "ppb:tbd:view:runner:1.178518448/16257108/0",
                  },
                ],

                numberOfRunnersToDisplay: 3,
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:1.178518448;924.251533165|3",
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:swimlane:X9D2vhIAACgAw1Kj/cv/home",
      },
    },
  ],
};

describe("Maintenance Screen", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await startApp("home", { pullToRefresh: true });
  });

  describe("When the user loads the Home screen and the app is unsplashed", () => {
    beforeAll(async () => {
      await browser.waitUntilEquals(cardSO.title, "Win");
    });

    it("[PRPI-2988] The card should be displayed", async () => {
      expect(await cardSO.title.getText()).toEqual("Win");
    });

    describe("And then the app gets splashed and the user refreshes the page", () => {
      beforeAll(async () => {
        await mockService.clear(getGenericLayout(BFF_MOCK));
        await mockService.mockHttpRequest(getMaintenanceLayout({ redirectUrl: "https://dummyurl/" }));
        await swipeDownElementFullscreen(cardSO.title);
      });

      it("[PRPI-2989] The maintenance screen should be displayed", async () => {
        expect(await maintenanceScreenSO.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-2990] The refresh button should be displayed", async () => {
        expect(await maintenanceScreenSO.refreshButton.isDisplayed()).toBe(true);
      });

      describe("And then the user clicks on the Maintenance Screen refresh button", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(maintenanceScreenSO.refreshButton);
          await maintenanceScreenSO.refreshButton.click();

          await browser.waitUntilDisplayed(maintenanceScreenSO.element);
        });

        it("[PRPI-2991] The maintenance screen should be displayed", async () => {
          expect(await maintenanceScreenSO.element.isDisplayed()).toBe(true);
        });

        it("[PRPI-2992] The refresh button should be displayed", async () => {
          expect(await maintenanceScreenSO.refreshButton.isDisplayed()).toBe(true);
        });

        describe("And then the app is unsplashed and the user clicks on the Maintenance Screen refresh button again", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(maintenanceScreenSO.refreshButton);
            await mockService.clear(getMaintenanceLayout({ redirectUrl: "https://dummyurl/" }));
            await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
            await maintenanceScreenSO.refreshButton.click();
            await browser.waitUntilEquals(cardSO.title, "Win");
          });

          it("[PRPI-2993] The card should be displayed", async () => {
            expect(await cardSO.title.getText()).toEqual("Win");
          });
        });
      });
    });
  });
});
