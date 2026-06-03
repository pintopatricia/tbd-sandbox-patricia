const ErrorViewSO = require("@ppb/tbd-shared/components/ErrorView/ErrorView.so");
const { getAppContext, getGenericLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const { BottomBarSO, GenericScreenSO, EmptyStateSO, CardSO } = require("../../../../screen-objects");

const mockService = new MockService();

const genericScreenSO = new GenericScreenSO();
const errorViewSO = new ErrorViewSO();
const emptyStateSO = new EmptyStateSO();
const cardSO = new CardSO();

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

describe("Error Screen - Fatal Error", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getAppContext({}, { statusCode: 500 }));
    await startApp("home");
    await browser.waitUntilDisplayed(errorViewSO.element);
    await browser.waitUntilDisplayed(emptyStateSO.defaultImage);
    await browser.waitUntilEquals(errorViewSO.retryButtonLabel, "Retry");
  });

  describe("When the user faces an app context failure (error 500) at first load", () => {
    it("[PRPI-2902] The fatal error screen should be displayed", async () => {
      expect(await errorViewSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2903] The fatal error screen should display an image", async () => {
      expect(await emptyStateSO.defaultImage.isDisplayed()).toBe(true);
    });

    it("[PRPI-2904] The fatal error should display a title", async () => {
      expect(await emptyStateSO.title.getText()).toEqual("Oops, something went wrong.");
    });

    it("[PRPI-2905] The fatal error should display a text", async () => {
      expect(await emptyStateSO.message.getText()).toEqual(
        "Unfortunately, the app crashed. Restart it if you can, and if the problem persists please contact support.",
      );
    });

    it("[PRPI-2906] The fatal error should display a button with Retry", async () => {
      expect(await errorViewSO.retryButtonLabel.getText()).toEqual("Retry");
    });

    it("[PRPI-2907] The bottom bar should not be displayed", async () => {
      expect(await BottomBarSO.home.isDisplayed()).toBe(false);
    });
  });

  describe("When the user clicks on the Retry Button and the status code is still 500", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(errorViewSO.element);
      await browser.waitUntilClickableNative(errorViewSO.retryButtonContainer);
      await errorViewSO.retryButtonContainer.click();
      await browser.waitUntilDisplayed(emptyStateSO.defaultImage);
      await browser.waitUntilDisplayed(errorViewSO.retryButtonLabel);
      await browser.waitUntilEquals(errorViewSO.retryButtonLabel, "Retry");
    });

    it("[PRPI-2908] The fatal error screen should still be displayed", async () => {
      expect(await errorViewSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2909] The fatal error should display a button with Retry", async () => {
      expect(await errorViewSO.retryButtonLabel.getText()).toBe("Retry");
    });
  });

  describe("When the user clicks on the Retry Button and the status code is 200 OK", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getAppContext({}));

      await browser.waitUntilClickableNative(errorViewSO.retryButtonContainer);
      await errorViewSO.retryButtonContainer.click();
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await browser.waitUntilEquals(cardSO.title, "Win");
      await browser.waitUntilDisplayed(genericScreenSO.element);
    });

    it("[PRPI-2910] The generic screen should be displayed", async () => {
      expect(await genericScreenSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2911] The horse racing event should be displayed", async () => {
      expect(await cardSO.title.getText()).toBe("Win");
    });

    it("[PRPI-2912] The bottom bar should be displayed", async () => {
      expect(await BottomBarSO.home.isDisplayed()).toBe(true);
    });
  });
});
