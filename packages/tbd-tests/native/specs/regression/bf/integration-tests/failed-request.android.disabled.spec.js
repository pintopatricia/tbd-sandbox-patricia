const ErrorViewSO = require("@ppb/tbd-shared/components/ErrorView/ErrorView.so");
const { getEventLayout, getHTTPError } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const { BottomBarSO, GenericScreenSO, EmptyStateSO, CardSO, HeaderSO } = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const errorViewSO = new ErrorViewSO();
const cardSO = new CardSO();
const emptyStateSO = new EmptyStateSO();
const headerSO = new HeaderSO();

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

describe("Error Screen - Failed Request", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await startApp("home", { pullToRefresh: true });
    await browser.waitUntilEquals(cardSO.title, "Win");
  });

  describe("When the user enters a view and the BFF request keeps failing after 3 tries", () => {
    beforeAll(async () => {
      await mockService.clear(getEventLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getHTTPError());
      await swipeDownElementFullscreen(cardSO.title);
      await browser.waitUntilDisplayed(errorViewSO.element);
      await browser.waitUntilDisplayed(emptyStateSO.defaultImage);
    });

    it("[PRPI-2893] The failed request screen should be displayed", async () => {
      expect(await errorViewSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2894] The failed request screen should display a back arrow", async () => {
      expect(await headerSO.backButton.isDisplayed()).toBe(true);
    });

    it("[PRPI-2895] The failed request screen should display an image", async () => {
      expect(await emptyStateSO.defaultImage.isDisplayed()).toBe(true);
    });

    it("[PRPI-2896] The failed request screen should display a title", async () => {
      expect(await emptyStateSO.title.getText()).toEqual("Oops, something went wrong.");
    });

    it("[PRPI-2897] The failed request screen should display a text", async () => {
      expect(await emptyStateSO.message.getText()).toEqual(
        "We're working to resolve the problem. Please, come back later. If the problem persists, get in touch with our help center.",
      );
    });

    it("[PRPI-2898] The failed request should display a button that opens the help center", async () => {
      expect(await errorViewSO.helpCenterContainer.isDisplayed()).toBe(true);
    });

    it("[PRPI-2899] The bottom bar should be displayed", async () => {
      expect(await BottomBarSO.home.isDisplayed()).toBe(true);
    });
  });

  describe("When the refreshes the page and the BFF request returns 200 OK", () => {
    beforeAll(async () => {
      await mockService.clear(getHTTPError());
      await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
      await headerSO.backButton.click();
      await browser.waitUntilEquals(cardSO.title, "Win");
    });

    it("[PRPI-2900] The generic view should be displayed", async () => {
      expect(await genericScreenSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2901] The generic screen should display an event card", async () => {
      expect(await cardSO.element.isDisplayed()).toBe(true);
    });
  });
});
