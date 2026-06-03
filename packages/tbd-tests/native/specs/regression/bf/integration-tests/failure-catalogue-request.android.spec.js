const MockService = require("../../../../mock-essentials/mocking-service");
const { SnackbarSO, CardSO } = require("../../../../screen-objects");
const { startApp } = require("../../../../helpers/urls");
const { getAppContext, getGenericLayout, getHTTPRateLimitError } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const BFF_MOCK = {
  __typename: "GenericView",
  urn: `ppb:tbd:view:generic:home`,
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
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.178518448/29547685/0",
                          name: "Solar Park",
                          selectionId: 29547685,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:excRunner:1.178518448/18121762/0",
                          name: "Thegreyvtrain",
                          selectionId: 18121762,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:excRunner:1.178518448/16257108/0",
                      },
                      {
                        runnerURN: "ppb:excRunner:1.178518448/29547685/0",
                      },
                      {
                        runnerURN: "ppb:excRunner:1.178518448/18121762/0",
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
                    {
                      selectionId: 29547685,
                      horse: {},
                      details: {
                        jockeyName: "Harrison Shaw",
                        saddleCloth: "6",
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 3,
                      },
                    },
                    {
                      selectionId: 18121762,
                      horse: {},
                      details: {
                        jockeyName: "Elisha Whittington",
                        saddleCloth: "9",
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 5,
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

const snackbarSO = new SnackbarSO();
const cardSO = new CardSO();
const mockService = new MockService();

describe("When BFF returns error 429 after an initial successful page load", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await startApp("home", { pullToRefresh: true, shouldTerminateAppBeforeStart: true });
    await browser.waitUntilDisplayed(cardSO.element);
  });

  describe("and user is logged in", () => {
    beforeAll(async () => {
      await mockService.clear(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getAppContext({ loggedIn: "true" }));
      await mockService.mockHttpRequest(getHTTPRateLimitError());
      await swipeDownElementFullscreen(cardSO.title);
      await browser.waitUntilDisplayed(snackbarSO.element);
    });

    it("[PRPI-3741] should display the appropriate error message", async () => {
      expect(await snackbarSO.element.isDisplayed()).toBe(true);
      expect(await snackbarSO.title.getText()).toBe("Too many requests in a short time period");
      expect(await snackbarSO.description.getText()).toBe("Please contact support");
    });
  });

  describe("and user is logged out", () => {
    beforeAll(async () => {
      await mockService.clear(getGenericLayout(BFF_MOCK));
      await mockService.clear(getAppContext({ loggedIn: "true" }));
      await mockService.clear(getHTTPRateLimitError());
      await mockService.mockHttpRequest(getAppContext({ loggedIn: "false" }));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await startApp("home", { pullToRefresh: true, shouldTerminateAppBeforeStart: true });
      await browser.waitUntilDisplayed(cardSO.element, "Card was not displayed", { timeout: 8000 });
      await mockService.clear(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getHTTPRateLimitError());
      await swipeDownElementFullscreen(cardSO.title);
      await browser.waitUntilDisplayed(snackbarSO.element);
    });

    it("[PRPI-3742] should display the appropriate error message", async () => {
      expect(await snackbarSO.element.isDisplayed()).toBe(true);
      expect(await snackbarSO.title.getText()).toBe("Too many requests in a short time period");
      expect(await snackbarSO.description.getText()).toBe("Please login to continue");
    });
  });
});
