const {
  HorseRacingRunnerPO,
  SelectableItemsPO,
  SegmentedControlPO,
  RaceDetailsPO,
  CardPO,
  SportsbookMarketPO,
  RaceTimePO,
} = require("../../../../../page-objects");
const { getRaceLayout, getFilteredSelectableItemsCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const SelectableItemsCardGroupPO = require("@ppb/tbd-shared/components/SelectableItemsCardGroup/SelectableItemsCardGroup.web.po");
const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const selectableItemsPO = new SelectableItemsPO();
const segmentedControlPO = new SegmentedControlPO();
const firstRaceTimePO = new RaceTimePO(selectableItemsPO.races[0]);
const secondRaceTimePO = new RaceTimePO(selectableItemsPO.races[1]);
const raceMarketCardPO = new RaceMarketCardPO();
const raceDetailsPO = new RaceDetailsPO(raceMarketCardPO.raceDetails);

const firstRaceCardPO = new CardPO(raceMarketCardPO.market);
const firstMarketPO = new SportsbookMarketPO(firstRaceCardPO.sportsbookMarket);
const firstRunnerPO = new HorseRacingRunnerPO(firstMarketPO.element);

const RACE_ID = "30174778.1630";

const selectableitemsCardGroupMock = {
  __typename: "SelectableItemsCardGroup",
  urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/s/7",
  cardGroupTitle: "Next Races",
  filter: { countries: ["UK_AND_IRE", "ALL_COUNTRIES"], defaultSelected: "UK_AND_IRE" },
  full: {
    edges: [
      {
        startTime: "2022-08-11T12:10:00.000Z",
        venue: "Brighton",
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
          raceViewLink: {
            viewUrn: "ppb:tbd:view:race:29901908.1409",
            viewUrl: routes.getRaceViewUrl("7", "29901908.1409"),
          },
          title: "Win",
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.1",
                marketType: "WIN",
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7",
                  name: "HR",
                  sportId: 7,
                },
                hierarchy: {
                  __typename: "RaceHierarchy",
                  race: {
                    __typename: "Race",
                    urn: "ppb:race:29901908.1409",
                    startTime: "2020-07-13T12:30:00Z",
                    name: "13:30 Brighton",
                    details: {
                      distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                    },
                    meeting: {
                      __typename: "Meeting",
                      urn: "ppb:meeting:29901905",
                      name: "Wind 13th Jul",
                      country: "GB",
                      countryFlag: {
                        medium: "http://example.test.com/mockedImage/image.png",
                      },
                      venue: "Brighton",
                    },
                  },
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901905",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: {
                      medium: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Brighton",
                  },
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.1/1",
                    name: "Shakalakaboomboom",
                    selectionId: 1,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.1/2",
                    name: "John Snow Snowing Snowing Snowing",
                    selectionId: 2,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.1/3",
                    name: "Shakalala",
                    selectionId: 3,
                  },
                ],
              },
              runners: [
                { runnerURN: "ppb:sbkRunner:924.1/1" },
                { runnerURN: "ppb:sbkRunner:924.1/2" },
                { runnerURN: "ppb:sbkRunner:924.1/3" },
              ],
            },
          },
          race: {
            __typename: "Race",
            urn: "ppb:race:29901909.1411",
            startTime: "2020-07-13T12:30:00Z",
            name: "14:30 Brighton",
            details: {
              distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
            },
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:29901905",
              name: "Wind 13th Jul",
              country: "GB",
              countryFlag: {
                medium: "http://example.test.com/mockedImage/image.png",
              },
              venue: "Brighton",
            },
          },
          numberOfRunnersToDisplay: 3,
          numberOfRunners: 14,
        },
      },
      {
        startTime: "2022-08-11T14:50:00.000Z",
        venue: "Galway",
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:29901908.1411;WIN|3",
          raceViewLink: {
            viewUrn: "ppb:tbd:view:race:29901908.1411",
            viewUrl: routes.getRaceViewUrl("7", "29901908.1411"),
          },
          title: "Win",
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.2",
                marketType: "WIN",
                hierarchy: {
                  __typename: "RaceHierarchy",
                  race: {
                    __typename: "Race",
                    urn: "ppb:race:29901908.1411",
                    startTime: "2020-07-13T14:50:00Z",
                    name: "15:50 Galway",
                    details: {
                      distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                    },
                    meeting: {
                      __typename: "Meeting",
                      urn: "ppb:meeting:299019081",
                      name: "Wind 13th Jul",
                      country: "GB",
                      countryFlag: {
                        medium: "http://example.test.com/mockedImage/image.png",
                      },
                      venue: "Galway",
                    },
                  },
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:299019081",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: {
                      medium: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Galway",
                  },
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.1/1",
                    name: "Shakalakaboomboom",
                    selectionId: 1,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.1/2",
                    name: "John Snow Snowing Snowing Snowing",
                    selectionId: 2,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.1/3",
                    name: "Shakalala",
                    selectionId: 3,
                  },
                ],
              },
              runners: [
                { runnerURN: "ppb:sbkRunner:924.1/1" },
                { runnerURN: "ppb:sbkRunner:924.1/2" },
                { runnerURN: "ppb:sbkRunner:924.1/3" },
              ],
            },
          },
          race: {
            __typename: "Race",
            urn: "ppb:race:29901908.1411",
            startTime: "2020-07-13T14:50:00Z",
            name: "15:50 Galway",
            details: {
              distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
            },
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:299019081",
              name: "Wind 13th Jul",
              country: "GB",
              countryFlag: {
                vector: "http://example.test.com/mockedImage/image.png",
              },
              venue: "Galway",
            },
          },
          numberOfRunnersToDisplay: 3,
          numberOfRunners: 14,
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        startTime: "2022-08-11T12:30:00.000Z",
        venue: "Brighton",
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
        },
      },
      {
        startTime: "2022-08-11T14:50:00.000Z",
        venue: "Galway",
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:29901908.1411;WIN|3",
        },
      },
      {
        startTime: "2022-08-11T14:55:00.000Z",
        venue: "Newcastle",
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
        },
      },
      {
        startTime: "2022-08-11T15:30:00.000Z",
        venue: "Galway",
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
        },
      },
      {
        startTime: "2022-08-11T16:00:00.000Z",
        venue: "Newcastle",
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
        },
      },
    ],
  },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:race:7|30174778.1630",
  race: {
    urn: "ppb:race:30174778.1630",
    meeting: {
      urn: "30174778",
    },
  },
  edges: [
    {
      node: {
        ...selectableitemsCardGroupMock,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SelectableItemsCardGroup",
        urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/s/7",
      },
    },
  ],
};

const ALL_COUNTRIES_CARDS_MOCK = {
  cards: [
    {
      __typename: "SelectableItemsCardGroup",
      urn: "ppb:tbd:cardgroup:selectableItems:Ytki8REAACYA-5OJ/s/7",
      filter: { countries: ["UK_AND_IRE", "ALL_COUNTRIES"], defaultSelected: "UK_AND_IRE" },
      full: {
        edges: [
          {
            startTime: "2022-08-11T12:10:00.000Z",
            venue: "Nantes",
            promotion: {
              title: "Title",
              description: "Description",
              signposting: "MONEY_BACK",
            },
            node: {
              __typename: "RaceMarketCard",
              urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
              raceViewLink: {
                viewUrn: "ppb:tbd:view:race:29901908.1410",
                viewUrl: routes.getRaceViewUrl("7", "29901908.1410"),
              },
              title: "Win",
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.3",
                    marketType: "WIN",
                    hierarchy: {
                      __typename: "RaceHierarchy",
                      race: {
                        __typename: "Race",
                        urn: "ppb:race:29901910.1412",
                        startTime: "2020-07-13T13:30:00Z",
                        name: "13:30 Nantes",
                        details: {
                          distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901910",
                          name: "nantes 13th Jul",
                          country: "FR",
                          countryFlag: {
                            vector: "http://example.test.com/mockedImage/image.png",
                          },
                          venue: "Nantes",
                        },
                      },
                      meeting: {
                        __typename: "Meeting",
                        urn: "ppb:meeting:29901910",
                        name: "nantes 13th Jul",
                        country: "FR",
                        countryFlag: {
                          vector: "http://example.test.com/mockedImage/image.png",
                        },
                        venue: "Nantes",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.1/1",
                        name: "Shakalakaboomboom",
                        selectionId: 1,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.1/2",
                        name: "John Snow Snowing Snowing Snowing",
                        selectionId: 2,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.1/3",
                        name: "Shakalala",
                        selectionId: 3,
                      },
                    ],
                  },
                  runners: [
                    { runnerURN: "ppb:sbkRunner:924.1/1" },
                    { runnerURN: "ppb:sbkRunner:924.1/2" },
                    { runnerURN: "ppb:sbkRunner:924.1/3" },
                  ],
                },
              },
              race: {
                __typename: "Race",
                urn: "ppb:race:29901910.1412",
                startTime: "2020-07-13T13:30:00Z",
                name: "13:30 Nantes",
                details: {
                  distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                },
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:29901910",
                  name: "nantes 13th Jul",
                  country: "FR",
                  countryFlag: {
                    vector: "http://example.test.com/mockedImage/image.png",
                  },
                  venue: "Nantes",
                },
              },
              numberOfRunnersToDisplay: 3,
              numberOfRunners: 14,
            },
          },
          {
            startTime: "2022-08-11T12:30:00.000Z",
            venue: "Brighton",
            node: {
              __typename: "RaceMarketCard",
              urn: "ppb:tbd:card:raceMarket:29901908.1411;WIN|3",
              raceViewLink: {
                viewUrn: "ppb:tbd:view:race:29901908.1411",
                viewUrl: routes.getRaceViewUrl("7", "29901908.1411"),
              },
              title: "Win",
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.4",
                    marketType: "WIN",
                    hierarchy: {
                      __typename: "RaceHierarchy",
                      race: {
                        __typename: "Race",
                        urn: "ppb:race:29901908.1411",
                        startTime: "2020-07-13T12:30:00Z",
                        name: "15:50 Galway",
                        details: {
                          distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:299019081",
                          name: "Wind 13th Jul",
                          country: "GB",
                          countryFlag: {
                            medium: "http://example.test.com/mockedImage/image.png",
                          },
                          venue: "Galway",
                        },
                      },
                      meeting: {
                        __typename: "Meeting",
                        urn: "ppb:meeting:299019081",
                        name: "Wind 13th Jul",
                        country: "GB",
                        countryFlag: {
                          medium: "http://example.test.com/mockedImage/image.png",
                        },
                        venue: "Galway",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.1/1",
                        name: "Shakalakaboomboom",
                        selectionId: 1,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.1/2",
                        name: "John Snow Snowing Snowing Snowing",
                        selectionId: 2,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.1/3",
                        name: "Shakalala",
                        selectionId: 3,
                      },
                    ],
                  },
                  runners: [
                    { runnerURN: "ppb:sbkRunner:924.1/1" },
                    { runnerURN: "ppb:sbkRunner:924.1/2" },
                    { runnerURN: "ppb:sbkRunner:924.1/3" },
                  ],
                },
              },
              race: {
                __typename: "Race",
                urn: "ppb:race:29901908.1411",
                startTime: "2020-07-13T13:30:00Z",
                name: "13:30 Brighton",
                details: {
                  distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                },
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:299019081",
                  name: "Brighton 13th Jul",
                  country: "GB",
                  countryFlag: {
                    vector: "http://example.test.com/mockedImage/image.png",
                  },
                  venue: "Brighton",
                },
              },
              numberOfRunnersToDisplay: 3,
              numberOfRunners: 14,
            },
          },
        ],
      },
      partials: {
        edges: [
          {
            startTime: "2022-08-11T12:10:00.000Z",
            venue: "Nantes",
            promotion: {
              title: "Title",
              description: "Description",
              signposting: "MONEY_BACK",
            },
            node: {
              __typename: "RaceMarketCard",
              urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
            },
          },
          {
            startTime: "2022-08-11T12:30:00.000Z",
            venue: "Brighton",
            node: {
              __typename: "RaceMarketCard",
              urn: "ppb:tbd:card:raceMarket:29901908.1411;WIN|3",
            },
          },
          {
            startTime: "2022-08-11T14:55:00.000Z",
            venue: "Newcastle",
            node: {
              __typename: "RaceMarketCard",
              urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
            },
          },
          {
            startTime: "2022-08-11T15:30:00.000Z",
            venue: "Galway",
            node: {
              __typename: "RaceMarketCard",
              urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
            },
          },
          {
            startTime: "2022-08-11T16:00:00.000Z",
            venue: "Newcastle",
            node: {
              __typename: "RaceMarketCard",
              urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
            },
          },
        ],
      },
    },
  ],
};

const selectableItemsCardGroupPO = new SelectableItemsCardGroupPO();

describe("Layout Entity - SelectableItemsCardGroup", () => {
  describe("SelectableItemsCardGroup is retrieved", () => {
    // And the default state for next races filter is UK_AND_IRE
    // And the title configured is "Next Races"
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
      await mockService.mockHttpRequest(getRaceLayout(BFF_MOCK));
      await browser.url(routes.getRaceViewUrl("7", RACE_ID));
      await browser.waitUntilDisplayed(selectableItemsCardGroupPO.title);
      await browser.waitUntilDisplayed(selectableItemsPO.element);
    });

    it("[PRPI-8381] The title should be visible 'Next Races'", async () => {
      expect(await selectableItemsCardGroupPO.title.getText()).toEqual("Next Races");
    });

    it("[PRPI-8382] The country filter should be visible with 'UK & Ireland' and 'countries' options", async () => {
      expect(await segmentedControlPO.options[0].getText()).toEqual("UK & Ireland");
      expect(await segmentedControlPO.options[1].getText()).toEqual("All Countries");
    });
    it("[PRPI-8383] The 'UK & Ireland' option should be selected and highlighted by default", async () => {
      expect(await segmentedControlPO.selectedOption.getText()).toEqual("UK & Ireland");
    });
    it("[PRPI-8384] The timeline with the next 5 races should be visible", async () => {
      expect(await selectableItemsPO.element.isDisplayed()).toBe(true);
      expect(await selectableItemsPO.races.length).toBe(5);
    });
    it("[PRPI-8385] The first race visible and selected should be '13:30 Brighton'", async () => {
      expect(await firstRaceTimePO.raceTime.getText()).toBe("13:30");
      expect(await firstRaceTimePO.meetingName.getText()).toBe("Brighton");
    });
    it("[PRPI-8386] The 2nd race visible should be '15:50 Galway'", async () => {
      expect(await secondRaceTimePO.raceTime.getText()).toBe("15:50");
      expect(await secondRaceTimePO.meetingName.getText()).toBe("Galway");
    });
    it("[PRPI-8387] The racemarketcard '13:30 Brighton' should be visible", async () => {
      expect(await raceDetailsPO.raceTime.getText()).toBe("13:30");
      expect(await raceDetailsPO.meetingName.getText()).toBe("Brighton");
    });
    it("[PRPI-8388] The first runner name should be Shakalakaboomboom", async () => {
      expect(await firstRunnerPO.horseName.getText()).toBe("Shakalakaboomboom");
    });

    describe("When the user taps on the 2nd race '15:50 Galway'", () => {
      beforeAll(async () => {
        await selectableItemsPO.races[1].waitForClickable();
        await selectableItemsPO.races[1].click();

        await browser.waitUntilEquals(selectableItemsPO.activeRaceContent, "15:50\nGalway");
      });

      it("[PRPI-8389] The '15:50 Galway' race should be selected", async () => {
        expect(await selectableItemsPO.activeRaceContent.getText()).toContain("15:50");
        expect(await selectableItemsPO.activeRaceContent.getText()).toContain("Galway");
      });
      it("[PRPI-8390] The racemarketcard '15:50 Galway' should be visible", async () => {
        expect(await raceDetailsPO.raceTime.getText()).toBe("15:50");
        expect(await raceDetailsPO.meetingName.getText()).toBe("Galway");
      });
    });

    describe("When the user taps on 'All Countries' filter option", () => {
      //And the first race has associated promos
      //And the title is not configured"
      beforeAll(async () => {
        await mockService.mockHttpRequest(getFilteredSelectableItemsCardResults(ALL_COUNTRIES_CARDS_MOCK));
        await segmentedControlPO.options[1].waitForClickable();
        await segmentedControlPO.options[1].click();

        await browser.waitUntilEquals(selectableItemsPO.activeRaceContent, "13:10\nNantes");
      });

      it("[PRPI-8391] The title should not be visible", async () => {
        expect(await selectableItemsCardGroupPO.title.isDisplayed()).toBe(false);
      });

      it("[PRPI-8392] The 'All Countries' option should become selected and highlighted", async () => {
        expect(await segmentedControlPO.selectedOption.getText()).toEqual("All Countries");
      });
      it("[PRPI-8393] The timeline with the next 5 races should be visible", async () => {
        expect(await selectableItemsPO.element.isDisplayed()).toBe(true);
        expect(await selectableItemsPO.races.length).toBe(5);
      });
      it("[PRPI-8394] The first race visible and selected should be '13:10 Nantes'", async () => {
        expect(await selectableItemsPO.activeRaceContent.getText()).toContain("13:10");
        expect(await selectableItemsPO.activeRaceContent.getText()).toContain("Nantes");
      });
      it("[PRPI-8395] The first race should have money back icon visible", async () => {
        expect(await firstRaceTimePO.promoIconContainer.isDisplayed()).toBe(true);
      });
      it("[PRPI-8396] The 2nd race visible should be '13:30 Brighton'", async () => {
        expect(await secondRaceTimePO.raceTime.getText()).toBe("13:30");
        expect(await secondRaceTimePO.meetingName.getText()).toBe("Brighton");
      });
      it("[PRPI-8397] The racemarketcard '14:30 Nantes' should be visible", async () => {
        expect(await raceDetailsPO.raceTime.getText()).toBe("14:30");
        expect(await raceDetailsPO.meetingName.getText()).toBe("Nantes");
      });
    });
  });
});
