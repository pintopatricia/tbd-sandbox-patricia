const {
  getGenericLayout,
  getFilteredSelectableItemsCardResults,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");

const {
  SelectableItemsCardGroupSO,
  HorseRacingRunnerSO,
  SegmentedControlSO,
  SelectableItemsSO,
  RaceTimeSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const selectableItemsCardGroupSO = new SelectableItemsCardGroupSO();
const segmentedControlSO = new SegmentedControlSO();
const selectableItemsSO = new SelectableItemsSO();
const firstRaceTimeSO = new RaceTimeSO(selectableItemsSO.races[0]);
const secondRaceTimeSO = new RaceTimeSO(selectableItemsSO.races[1]);
const raceMarketCardSO = new RaceMarketCardSO();

const firstHorseRacingRunnerSO = new HorseRacingRunnerSO(raceMarketCardSO.runners[0]);

const BFF_VIEW_WITH_RECENT_RACES_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:home",
  url: "view/generic:home",
  edges: [
    {
      node: {
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
                  viewUrn: "ppb:tbd:view:race:29901908.1410",
                  viewUrl: "home",
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
                          urn: "ppb:race:29901908.1412",
                          startTime: "2020-07-13T12:30:00Z",
                          name: "13:30 Brighton",
                          details: {
                            distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                          },
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901908",
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
                          urn: "ppb:meeting:29901908",
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
                  urn: "ppb:race:29901908.1412",
                  startTime: "2020-07-13T12:30:00Z",
                  name: "13:30 Brighton",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                  },
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901908",
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
                  viewUrl: "home",
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
              signposting: "MONEY_BACK",
            },
            node: {
              __typename: "RaceMarketCard",
              urn: "ppb:tbd:card:raceMarket:29901908.1410;WIN|3",
              raceViewLink: {
                viewUrn: "ppb:tbd:view:race:29901908.1410",
                viewUrl: "home",
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
                        urn: "ppb:race:29901908.1430",
                        startTime: "2020-07-13T12:10:00Z",
                        name: "13:10 Nantes",
                        details: {
                          distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 40, yards: 50 },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901930",
                          name: "Nantes 13th Jul",
                          country: "FR",
                          countryFlag: {
                            medium: "http://example.test.com/mockedImage/image.png",
                          },
                          venue: "Nantes",
                        },
                      },
                      meeting: {
                        __typename: "Meeting",
                        urn: "ppb:meeting:29901930",
                        name: "Nantes 13th Jul",
                        country: "FR",
                        countryFlag: {
                          medium: "http://example.test.com/mockedImage/image.png",
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
                urn: "ppb:race:29901908.1410",
                startTime: "2020-07-13T12:10:00Z",
                name: "13:10 Nantes",
                details: {
                  distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                },
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:29901908",
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
                viewUrl: "home",
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

describe("Layout Entity - SelectableItemsCardGroup", () => {
  describe("When the user is on a given screen and a SelectableItemsCardGroup is retrieved with default state for UK_AND_IRE", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext());
      await mockService.mockHttpRequest(getGenericLayout(BFF_VIEW_WITH_RECENT_RACES_MOCK));
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await startApp("home");
      await browser.waitUntilDisplayed(selectableItemsCardGroupSO.title);
      await browser.waitUntilDisplayed(selectableItemsSO.element);
    });

    it("[PRPI-3781] The title should be visible 'Next Races'", async () => {
      expect(await selectableItemsCardGroupSO.title.getText()).toEqual("Next Races");
    });

    it("[PRPI-3782] The country filter should be visible with 'UK & Ireland' and 'All Countries' options", async () => {
      expect(await segmentedControlSO.options.length).toBe(2);
      expect(await segmentedControlSO.selectedOptionText.getText()).toEqual("UK & Ireland");
      expect(await segmentedControlSO.optionText.getText()).toEqual("All Countries");
    });
    it("[PRPI-3783] The 'UK & Ireland' option should be selected and highlighted by default", async () => {
      expect(await segmentedControlSO.selectedOptionText.getText()).toEqual("UK & Ireland");
    });
    it("[PRPI-3784] The timeline with the next 5 races should be visible", async () => {
      expect(await selectableItemsCardGroupSO.element.isDisplayed()).toBe(true);
      expect(await selectableItemsSO.races.length).toBe(5);
    });
    it("[PRPI-3785] The first race visible and selected should be '13:30 Brighton'", async () => {
      expect(await firstRaceTimeSO.selectedRace.getText()).toBe("13:30");
      expect(await firstRaceTimeSO.meetingName.getText()).toBe("Brighton");
    });
    it("[PRPI-3786] The 2nd race visible should be '15:50 Galway'", async () => {
      expect(await secondRaceTimeSO.raceTimeText.getText()).toBe("15:50");
      expect(await secondRaceTimeSO.meetingName.getText()).toBe("Galway");
    });
    it("[PRPI-3787] The racemarketcard '13:30 Brighton' should be visible", async () => {
      expect(await raceMarketCardSO.meetingTime.getText()).toBe("13:30");
      expect(await raceMarketCardSO.meetingName.getText()).toBe("Brighton");
    });
    it("[PRPI-3788] The first runner name should be Shakalakaboomboom", async () => {
      expect(await firstHorseRacingRunnerSO.runnerHorseName.getText()).toBe("Shakalakaboomboom");
    });

    describe("When the user taps on the 2nd race '15:50 Galway'", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(selectableItemsSO.element);
        await selectableItemsSO.races[1].click();

        await browser.waitUntilEquals(raceMarketCardSO.meetingTime, "15:50");
      });

      it("[PRPI-3789] The '15:50 Galway' race should be selected", async () => {
        expect(await secondRaceTimeSO.selectedRace.getText()).toContain("15:50");
        expect(await secondRaceTimeSO.meetingName.getText()).toContain("Galway");
      });
      it("[PRPI-3790] The racemarketcard '15:50 Galway' should be visible", async () => {
        expect(await raceMarketCardSO.meetingTime.getText()).toBe("15:50");
        expect(await raceMarketCardSO.meetingName.getText()).toBe("Galway");
      });
    });

    describe("When the user taps on 'All Countries' filter option with first races containing associated promos and no title", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getFilteredSelectableItemsCardResults(ALL_COUNTRIES_CARDS_MOCK));
        await browser.waitUntilClickableNative(segmentedControlSO.options[1]);
        await segmentedControlSO.options[1].click();

        await browser.waitUntilEquals(raceMarketCardSO.meetingTime, "13:10");
      });

      it("[PRPI-3798] The title should not be visible", async () => {
        expect(await selectableItemsCardGroupSO.title.isDisplayed()).toBe(false);
      });

      it("[PRPI-3798] The 'All Countries' option should become selected and highlighted", async () => {
        expect(await segmentedControlSO.selectedOptionText.getText()).toEqual("All Countries");
      });
      it("[PRPI-3798] The timeline with the next 5 races should be visible", async () => {
        expect(await selectableItemsCardGroupSO.element.isDisplayed()).toBe(true);
        expect(await selectableItemsSO.races.length).toBe(5);
      });
      it("[PRPI-3798] The first race visible and selected should be '13:10 Nantes'", async () => {
        expect(await firstRaceTimeSO.selectedRace.getText()).toBe("13:10");
        expect(await firstRaceTimeSO.meetingName.getText()).toBe("Nantes");
      });
      it("[PRPI-3798] The first race should have money back icon visible", async () => {
        expect(await firstRaceTimeSO.promoIconContainer.isDisplayed()).toBe(true);
      });
      it("[PRPI-3798] The 2nd race visible should be '13:30 Brighton'", async () => {
        expect(await secondRaceTimeSO.raceTimeText.getText()).toBe("13:30");
        expect(await secondRaceTimeSO.meetingName.getText()).toBe("Brighton");
      });
      it("[PRPI-3798] The racemarketcard '13:10 Nantes' should be visible", async () => {
        expect(await raceMarketCardSO.meetingTime.getText()).toBe("13:10");
        expect(await raceMarketCardSO.meetingName.getText()).toBe("Nantes");
      });
    });
  });
});
