const {
  CardPO,
  SportsbookMarketPO,
  FullScreenModalPO,
  RunnerDetailsPO,
  MarketBlurbsPO,
  ExchangeMarketPO,
  HorseRacingRunnerPO,
  RecentRacesPO,
} = require("../../../../../page-objects");

const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const {
  getRaceLayout,
  getRunnerInformationLayout,
  getRaceRunners,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MarketPO = require("@ppb/tbd-shared/components/Market/Market.po");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const fullScreenModalPO = new FullScreenModalPO();
const marketPO = new MarketPO();
const marketCardPO = new CardPO(marketPO.element);
const exchangeMarketPO = new ExchangeMarketPO(marketCardPO.exchangeMarket);
const sportsbookMarketPO = new SportsbookMarketPO(marketCardPO.sportsbookMarket);

const firstHorseRacingRunnerExchangePO = new HorseRacingRunnerPO(exchangeMarketPO.horseRacingRunnerList[0]);
const firstExcRunnerDetailsPO = new RunnerDetailsPO(firstHorseRacingRunnerExchangePO.element);
const firstExcRunnerRecentRacesPO = new RecentRacesPO(firstExcRunnerDetailsPO.element);

const thirdHorseRacingRunnerExchangePO = new HorseRacingRunnerPO(exchangeMarketPO.horseRacingRunnerList[2]);

const firstHorseRacingRunnerSportsbookPO = new HorseRacingRunnerPO(sportsbookMarketPO.horseRacingRunnerList[0]);
const firstSbkRunnerDetailsPO = new RunnerDetailsPO(firstHorseRacingRunnerSportsbookPO.element);
const firstSbkRunnerRecentRacesPO = new RecentRacesPO(firstSbkRunnerDetailsPO.element);

const secondHorseRacingRunnerSportsbookPO = new HorseRacingRunnerPO(sportsbookMarketPO.horseRacingRunnerList[1]);
const secondSbkRunnerDetailsPO = new RunnerDetailsPO(secondHorseRacingRunnerSportsbookPO.element);

const thirdHorseRacingRunnerSportsbookPO = new HorseRacingRunnerPO(sportsbookMarketPO.horseRacingRunnerList[2]);

const marketBlurbsPO = new MarketBlurbsPO();

const mockService = new MockService();

const horseRacingRunners = [
  {
    __typename: "RaceRunner",
    urn: "ppb:tbd:racerunner:30061949.1335/16257108",
    raceURN: "ppb:race:30061949.1335",
    selectionId: 16257108,
    rating: 104,
    comments:
      "25/1, creditable fourth of 10 in handicap at this CD 8 days ago on first run after a breathing op. Still low mileage so he must enter calculations off same mark",
    horse: {
      name: "Shakalakaboomboom",
      sireName: "NEW APPROACH (IRE)",
      damName: "HORATIA (IRE)",
      damSireName: "TEOFILO (IRE)",
      age: 5,
      color: "BAY",
      sex: "COLT",
      bred: "IRE",
    },
    details: {
      jockeyName: "John Velazquez",
      trainerName: "Floki Vahalaa",
      saddleCloth: 4,
      silk: "http://example.test.com/mockedImage/image.png",
      draw: 10,
      type: "FLAT",
      weight: { kilograms: 1, pounds: 1, stones: "8-6" },
      equipmentDescription: "Visor and tongue strap",
    },
    form: "1-15026",
  },
  {
    __typename: "RaceRunner",
    urn: "ppb:tbd:racerunner:30061949.1335/29547685",
    raceURN: "ppb:race:30061949.1335",
    selectionId: 29547685,
    horse: {
      name: "DROMISKIN",
      sireName: "DUNADEN (FR)",
      damName: "CEILIDH BAND",
      damSireName: "CELTIC SWING",
      age: 5,
    },
    details: {
      jockeyName: "Sophie Ralston",
      trainerName: "Dean Ivory",
      saddleCloth: 1,
      draw: 2,
      silk: null,
    },
  },
  {
    __typename: "RaceRunner",
    urn: "ppb:tbd:racerunner:30061949.1335/394559",
    raceURN: "ppb:race:30061949.1335",
    selectionId: 394559,
    horse: {
      name: "Fun And Games",
    },
    details: {
      jockeyName: "Sophie Ralston",
      trainerName: "Dean Ivory",
      saddleCloth: 17,
      draw: 22,
      silk: null,
    },
  },
];

const exchangeRunners = [
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.171344945/16257108/0",
    name: "Shakalakaboomboom",
    selectionId: 16257108,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.171344945/29547685/0",
    name: "Dromiskin",
    selectionId: 29547685,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.171344945/26374771/0",
    name: "Back From Dubai",
    selectionId: 26374771,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.174705115/394559/0",
    name: "Fun And Games",
    selectionId: 394559,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.174705115/12198722/0",
    name: "Treatherlikestar",
    selectionId: 12198722,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:excRunner:1.174705115/14336638/0",
    name: "American Mission",
    selectionId: 14336638,
    handicap: 0,
    resultType: null,
  },
];

const sporstBookRunners = [
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.234263186/16257108",
    name: "Shakalakaboomboom",
    selectionId: 16257108,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.234263186/29547685",
    name: "Dromiskin",
    selectionId: 29547685,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.234263186/26374771",
    name: "Back From Dubai",
    selectionId: 26374771,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.234263186/28633350",
    name: "Angels Roc",
    selectionId: 28633350,
    handicap: 0,
    resultType: null,
  },
];

const raceWithoutRunners = {
  __typename: "Race",
  urn: "ppb:race:30061949.1335",
  name: "14:40 Aintree",
  meeting: {
    __typename: "Meeting",
    urn: "ppb:meeting:29901908",
    venue: "Aintree",
    countryFlag: {
      medium: "http://example.test.com/mockedImage/image.png",
    },
  },
};

const raceWithRunners = {
  ...raceWithoutRunners,
  runners: horseRacingRunners,
};

const BFF_RUNNER_VIEW_MOCK = {
  __typename: "RunnerView",
  urn: "ppb:tbd:view:runner:1.171344945/16257108/0",
  url: "Not Implemented",
  title: "Additional Information",
  edges: [
    {
      node: {
        __typename: "RunnerInfoCard",
        urn: "ppb:tbd:card:runnerInfo:1.178518448/16257108/0",
        title: "RunnerInfoCard",
        raceRunner: raceWithRunners.runners[0],
      },
    },
    {
      node: {
        __typename: "MarketGraphsCard",
        urn: "ppb:tbd:card:marketGraphs:1.171344945/16257108/0",
        title: "null",
        market: {
          __typename: "ExchangeMarket",
          urn: "ppb:excMarket:1.171344945",
          liveData: {
            totalMatched: 106376.90528005445,
            exchangeMarketStatus: "OPEN",
            inplay: true,
          },
          name: "7f Hcap",
          marketType: "WIN",
          marketTypeName: "null",
          hierarchy: {
            __typename: "RaceHierarchy",
            race: raceWithoutRunners,
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:29940402",
              name: "Bev  4th Aug",
              country: "GB",
              countryFlag: null,
              venue: "Beverley",
            },
          },
          bettingType: "ODDS",
          eachWayDivisor: null,
          numberOfWinners: 1,
          competition: {
            __typename: "Competition",
            urn: "ppb:competition:morais-competition",
            name: "morais-competition",
            competitionId: 0,
            sport: {
              __typename: "Sport",
              urn: "ppb:eventType:7",
              name: "Horse Racing",
              sportId: 7,
            },
          },
          sportevent: {
            __typename: "SportsEvent",
            urn: "ppb:competition:morais-event",
            name: "morais-event",
          },
          runners: exchangeRunners,
        },
        runner: {
          runnerURN: "ppb:excRunner:1.171344945/16257108/0",
          graphParams: "?marketId=1.171344945&selectionId=16257108&handicap=0&theme=DARK",
          liveData: {
            urn: "ppb:tbd:excRunnerLiveData:1.171344945/16257108/0",
            selectionId: 16257108,
            handicap: 0,
            totalMatched: 86694.8600300528,
            lastPriceTraded: 1.23,
            availableToLay: [
              { odd: 3.5, liquidity: 143.16 },
              { odd: 3.55, liquidity: 37.19 },
              { odd: 3.6, liquidity: 36.37 },
            ],

            availableToBack: [
              { odd: 3.45, liquidity: 45.62 },
              { odd: 3.4, liquidity: 75.66 },
              { odd: 3.35, liquidity: 31.84 },
            ],

            traded: [
              { odd: 3.35, liquidity: 13.12 },
              { odd: 3.4, liquidity: 278.45 },
              { odd: 3.45, liquidity: 864.2 },
            ],
          },
        },
      },
    },
  ],
};

const BFF_RACE_VIEW_MOCK = (withMarketPromo = false, exchange = true, sportsbook = false) => ({
  __typename: "RaceView",
  url: "horse-racing/clairefontaine-3rd-aug/r-7|30061949.1335",
  urn: "ppb:tbd:view:race:7|30061949.1335",
  race: {
    urn: "ppb:race:30061949.1335",
    meeting: {
      urn: "ppb:meeting:29901908",
    },
  },
  edges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
        cardTitle: "Win",
        displayRunners: {
          exchange: exchange
            ? {
                market: {
                  __typename: "ExchangeMarket",
                  urn: "ppb:excMarket:1.171344945",
                  name: "1m2f Nov Stks",
                  hierarchy: {
                    __typename: "RaceHierarchy",
                    race: raceWithoutRunners,
                    meeting: {
                      __typename: "Meeting",
                      urn: "ppb:meeting:29901908",
                      venue: "Aintree",
                      countryFlag: {
                        medium: "http://example.test.com/mockedImage/image.png",
                      },
                    },
                  },
                  runners: exchangeRunners,
                },
                runners: [
                  { runnerURN: "ppb:excRunner:1.171344945/16257108/0" },
                  { runnerURN: "ppb:excRunner:1.171344945/29547685/0" },
                  { runnerURN: "ppb:excRunner:1.171344945/26374771/0" },
                  { runnerURN: "ppb:excRunner:1.174705115/394559/0" },
                ],
              }
            : undefined,
          sportsbook: sportsbook
            ? {
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.234263186",
                  name: "1m2f Nov Stks",
                  marketType: "WIN",
                  sport: {
                    __typename: "Sport",
                    urn: "ppb:eventType:7",
                    name: "HR",
                    sportId: 7,
                  },
                  hierarchy: {
                    __typename: "RaceHierarchy",
                    race: raceWithoutRunners,
                    meeting: {
                      __typename: "Meeting",
                      urn: "ppb:meeting:29901908",
                    },
                  },
                  runners: sporstBookRunners,
                },
                runners: [
                  { runnerURN: "ppb:sbkRunner:924.234263186/16257108" },
                  { runnerURN: "ppb:sbkRunner:924.234263186/29547685" },
                  { runnerURN: "ppb:sbkRunner:924.234263186/26374771" },
                ],
              }
            : undefined,
        },
        marketsHierarchy: {
          __typename: "RaceHierarchy",
          race: raceWithRunners,
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:29901908",
            venue: "Aintree",
            countryFlag: {
              medium: "http://example.test.com/mockedImage/image.png",
            },
          },
        },
        viewLinks: [
          {
            viewUrn: "ppb:tbd:view:market:1.171344945",
            viewUrl: "horse-racing/here-13th-oct/3m1f-hcap-hrd/rc-1.171344945",
          },
        ],

        runnerViewLinks: [
          {
            runnerUrn: "ppb:excRunner:1.171344945/16257108/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.171344945/16257108/0",
          },
          {
            runnerUrn: "ppb:excRunner:1.174705115/394559/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.174705115/394559/0",
          },
        ],

        isRunnerExpandable: true,
        ...(withMarketPromo && {
          marketPromo: {
            title: "market title",
            description: "market description",
            signposting: "EXTRA_PLACES",
          },
        }),
        blurbs: [],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
      },
    },
  ],
});

const BFF_FIRST_RACE_RUNNER_MOCK = {
  RaceRunners: [
    {
      ...horseRacingRunners[0],
      horse: {
        ...horseRacingRunners[0].horse,
        pastPerformances: [
          {
            race: {
              details: {
                scheduledTime: "2021-04-23T00:00:00Z",
                distance: {
                  miles: 0,
                  furlongs: 4,
                  yards: 220,
                },
                numberOfRunners: 13,
                going: "GOOD_SOFT",
                type: "FLAT",
              },
              venue: null,
            },
            positionOfficial: 2,
          },
          {
            race: {
              details: {
                scheduledTime: "2021-01-07T00:00:00Z",
                distance: {
                  miles: 0,
                  furlongs: 5,
                  yards: 220,
                },
                numberOfRunners: 10,
                going: null,
                type: "FLAT",
              },
              venue: "DOOMBEN",
            },
            positionOfficial: 2,
          },
          {
            race: {
              details: {
                scheduledTime: "2020-12-04T00:00:00Z",
                distance: {
                  miles: 0,
                  furlongs: 5,
                  yards: 110,
                },
                numberOfRunners: 8,
                going: null,
                type: "FLAT",
              },
              venue: "MUDGEE",
            },
            positionOfficial: 3,
          },
          {
            race: {
              details: {
                scheduledTime: "2020-12-14T00:00:00Z",
                distance: {
                  miles: 0,
                  furlongs: 6,
                  yards: 134,
                },
                numberOfRunners: 8,
                going: null,
                type: "FLAT",
              },
              venue: "MUDGEE",
            },
            positionOfficial: 4,
          },
          {
            race: {
              details: {
                scheduledTime: "2020-12-14T00:00:00Z",
                distance: {
                  miles: 0,
                  furlongs: 2,
                  yards: 116,
                },
                numberOfRunners: 5,
                going: null,
                type: "FLAT",
              },
              venue: "MUDGEE",
            },
            positionOfficial: 2,
          },
        ],
      },
    },
  ],
};

const BFF_SECOND_RACE_RUNNER_MOCK = {
  RaceRunners: [horseRacingRunners[1]],
};

describe("When the user is on race view", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_RACE_VIEW_MOCK().urn, {
        currentUrl: routes.getRacingViewUrl(),
      }),
    );
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getRunnerInformationLayout(BFF_RUNNER_VIEW_MOCK));
    await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK()));
    await browser.url(routes.getRacingViewUrl());
    await browser.waitUntilDisplayed(marketCardPO.title);
  });

  it("[PRPI-6787] The first runner expandable section should be collapsed", async () => {
    expect(await firstHorseRacingRunnerExchangePO.expandableDetails.isDisplayed()).toBe(false);
  });

  it("[PRPI-6788] The\xA0first runner's name should be 'Shakalakaboomboom'", async () => {
    expect(await firstHorseRacingRunnerExchangePO.horseName.getText()).toBe("Shakalakaboomboom");
  });

  it("[PRPI-6789] The first runner cloth number should be '4'", async () => {
    expect(await firstHorseRacingRunnerExchangePO.horseNumber.getText()).toBe("4");
  });

  it("[PRPI-6790] The first runner draw number should be '(10)'", async () => {
    expect(await firstHorseRacingRunnerExchangePO.jockeyNumber.getText()).toBe("(10)");
  });

  it("[PRPI-6791] The first runner silk should be visible", async () => {
    expect(await firstHorseRacingRunnerExchangePO.runnerSilk.isDisplayed()).toBe(true);
  });

  it("[PRPI-6792] The Jockey name should be 'John Velazquez'", async () => {
    expect(await firstHorseRacingRunnerExchangePO.jockeyName.getText()).toContain("Jockey: John Velazquez");
  });

  it("[PRPI-6793] The trainer's name should be 'Trainer: Floki Vahalaa'", async () => {
    expect(await firstHorseRacingRunnerExchangePO.trainerName.getText()).toBe("Trainer: Floki Vahalaa");
  });

  it("[PRPI-6794] The form info should be 'F: 1-15026 | Age: 5 | Weight: 8-6'", async () => {
    expect(await firstHorseRacingRunnerExchangePO.form.getText()).toBe("F: 1-15026 | Age: 5 | Weight: 8-6");
  });

  describe("When the user taps the first runner ('Shakalakaboomboom'), And BFF is retrieving runnerViewLinks)", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getRaceRunners(BFF_FIRST_RACE_RUNNER_MOCK));
      await firstHorseRacingRunnerExchangePO.getRunnerInformationContainers()[0].waitForClickable();
      await firstHorseRacingRunnerExchangePO.getRunnerInformationContainers()[0].click();
      await browser.waitUntilDisplayed(firstExcRunnerRecentRacesPO.raceInfoRow[0]);
    });

    it("[PRPI-6795] The first runner name shoud be Shakalakaboomboom", async () => {
      expect(await firstHorseRacingRunnerExchangePO.horseName.getText()).toBe("Shakalakaboomboom");
      expect(await firstHorseRacingRunnerExchangePO.horseNumber.getText()).toBe("4");
    });

    it("[PRPI-6796] The runner expandable section should expand", async () => {
      expect(await firstHorseRacingRunnerExchangePO.expandableDetails.isDisplayed()).toBe(true);
    });

    it("[PRPI-6797] The 'Age' field should have '5' info", async () => {
      expect(await firstExcRunnerDetailsPO.age.getText()).toBe("5");
    });

    it("[PRPI-6798] The 'Weight' field should have '8-6' info", async () => {
      expect(await firstExcRunnerDetailsPO.weight.getText()).toBe("8-6");
    });

    it("[PRPI-6799] The 'OR' field should have '104' info", async () => {
      expect(await firstExcRunnerDetailsPO.officialRating.getText()).toBe("104");
    });

    it("[PRPI-6800] The 'TIMEFORM' logo should be visible", async () => {
      expect(await firstExcRunnerDetailsPO.timeformLogo.isDisplayed()).toBe(true);
    });

    it("[PRPI-6801] The runner comment info should be visible", async () => {
      //and the field should have: 25/1, creditable fourth of 10 in handicap at this CD 8 days ago on first run after
      //a breathing op. Still low mileage so he must enter calculations off same mark"`, async () => {
      expect(await firstExcRunnerDetailsPO.runnerComment.getText()).toBe(
        "25/1, creditable fourth of 10 in handicap at this CD 8 days ago on first run after a breathing op. Still low mileage so he must enter calculations off same mark",
      );
    });

    it("[PRPI-6802] The 'Pedigree' field should have 'NEW APPROACH (IRE) HORATIA (IRE)' info", async () => {
      expect(await firstExcRunnerDetailsPO.pedigree.getText()).toBe("NEW APPROACH (IRE) | HORATIA (IRE)");
    });

    it("[PRPI-6803] The 'Bred' field should have 'IRE' info", async () => {
      expect(await firstExcRunnerDetailsPO.bred.getText()).toBe("IRE");
    });

    it("[PRPI-6804] The 'Equipment' field should have 'Visor and tongue strap' info", async () => {
      expect(await firstExcRunnerDetailsPO.equipment.getText()).toBe("Visor and tongue strap");
    });

    it("[PRPI-6805] The 5 most recent races for that runner should be visible", async () => {
      expect(await firstExcRunnerRecentRacesPO.raceInfoRow.length).toBe(5);
    });

    it("[PRPI-6806] The 'DATE' title and info should be visible", async () => {
      expect(await firstExcRunnerRecentRacesPO.headerLabels[0].getText()).toEqual("DATE");
      expect(await firstExcRunnerRecentRacesPO.raceInfo[0].getText()).toEqual("Apr 23 21");
    });

    it("[PRPI-6807] The 'COURSE' title should be visible", async () => {
      expect(await firstExcRunnerRecentRacesPO.headerLabels[1].getText()).toEqual("COURSE");
    });

    it("[PRPI-6808] The 'N/A' label should be visible for the course field", async () => {
      expect(await firstExcRunnerRecentRacesPO.raceInfo[1].getText()).toEqual("N/A");
    });

    it("[PRPI-6809] The 'DISTANCE' title and info should be visible", async () => {
      expect(await firstExcRunnerRecentRacesPO.headerLabels[2].getText()).toEqual("DISTANCE");
      expect(await firstExcRunnerRecentRacesPO.raceInfo[2].getText()).toEqual("4f 220y");
    });

    it("[PRPI-6810] The 'GOING' title and info should be visible", async () => {
      expect(await firstExcRunnerRecentRacesPO.headerLabels[3].getText()).toEqual("GOING");
      expect(await firstExcRunnerRecentRacesPO.raceInfo[3].getText()).toEqual("Good Soft");
    });

    it("[PRPI-6811] The 'POS' title and info should be visible", async () => {
      expect(await firstExcRunnerRecentRacesPO.headerLabels[4].getText()).toEqual("POS");
      expect(await firstExcRunnerRecentRacesPO.raceInfo[4].getText()).toEqual("2/13");
    });

    it("[PRPI-6812] The 'TYPE' title and info should be visible", async () => {
      expect(await firstExcRunnerRecentRacesPO.headerLabels[5].getText()).toEqual("TYPE");
      expect(await firstExcRunnerRecentRacesPO.raceInfo[5].getText()).toEqual("Flat");
    });

    describe("When the user taps on a given past race", () => {
      beforeAll(async () => {
        await firstExcRunnerRecentRacesPO.raceInfoRow[0].waitForClickable();
        await firstExcRunnerRecentRacesPO.raceInfoRow[0].click();
        await browser.waitUntilInViewport(firstExcRunnerRecentRacesPO.raceInfoComment[0]);
      });

      it("[PRPI-6813] The 'DATE' title and info should be visible", async () => {
        expect(await firstExcRunnerRecentRacesPO.headerLabels[0].getText()).toEqual("DATE");
        expect(await firstExcRunnerRecentRacesPO.raceInfo[0].getText()).toEqual("Apr 23 21");
      });

      it("[PRPI-6814] The runner comments info should be visible", async () => {
        expect(await firstExcRunnerRecentRacesPO.raceInfoComment[0].getText()).toEqual(
          "No runner comments available for this event",
        );
      });

      describe("When the user taps again on that race", () => {
        beforeAll(async () => {
          await firstExcRunnerRecentRacesPO.raceInfoRow[0].waitForClickable();
          await firstExcRunnerRecentRacesPO.raceInfoRow[0].click();

          await browser.waitUntilNotDisplayed(
            firstExcRunnerRecentRacesPO.raceInfoComment[0],
            "Race comment shouldn't be visible anymore",
          );
        });

        it("[PRPI-6815] The 'DATE' title and info should be visible", async () => {
          expect(await firstExcRunnerRecentRacesPO.headerLabels[0].getText()).toEqual("DATE");
          expect(await firstExcRunnerRecentRacesPO.raceInfo[0].getText()).toEqual("Apr 23 21");
        });

        it("[PRPI-6816] The runner comments info should not be visible", async () => {
          expect(await firstExcRunnerRecentRacesPO.raceInfoComment[0].getValue()).toBeNull();
        });
      });
    });
  });

  describe("When BFF is not retrieving runnerviewLinks for that runner, And SCA is not retrieving info", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(thirdHorseRacingRunnerExchangePO.element);

      await thirdHorseRacingRunnerExchangePO.getRunnerInformationContainers()[0].waitForClickable();
      await thirdHorseRacingRunnerExchangePO.getRunnerInformationContainers()[0].click();
    });

    it("[PRPI-6817] The chevron for that runner should not be visible", async () => {
      expect(await thirdHorseRacingRunnerExchangePO.chevron.isExisting()).toBe(false);
    });

    it("[PRPI-6818] The modal should not open", async () => {
      expect(await fullScreenModalPO.element.isExisting()).toBe(false);
    });
  });

  describe("When there is a market promo available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK(true)));
      await browser.url(routes.getRacingViewUrl());
      await browser.waitUntilDisplayed(marketCardPO.title);
    });

    it("[PRPI-6819] The market promo should be displayed", async () => {
      expect(await marketBlurbsPO.marketPromo.isDisplayed()).toBe(true);
    });
  });

  describe("When the user is on sportsbook", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_RACE_VIEW_MOCK().urn, {
          currentUrl: routes.getRacingViewUrl(),
        }),
      );
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getRunnerInformationLayout(BFF_RUNNER_VIEW_MOCK));
      await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK(false, false, true)));
      await browser.url(routes.getRacingViewUrl());
      await browser.waitUntilDisplayed(firstHorseRacingRunnerSportsbookPO.element);
    });

    describe("And then taps on the first SBK runner ('Shakalakaboomboom') And BFF not retrieving runnerViewLinks", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getRaceRunners(BFF_FIRST_RACE_RUNNER_MOCK));
        await firstHorseRacingRunnerSportsbookPO.getRunnerInformationContainers()[0].waitForClickable();
        await firstHorseRacingRunnerSportsbookPO.getRunnerInformationContainers()[0].click();
        await browser.waitUntilDisplayed(firstSbkRunnerRecentRacesPO.raceInfoRow[0]);
      });

      it("[PRPI-6820] The runner expandable section should expand", async () => {
        expect(await firstHorseRacingRunnerSportsbookPO.expandableDetails.isDisplayed()).toBe(true);
      });

      it("[PRPI-6821] The 'Graphs' link should not be visible", async () => {
        expect(await firstSbkRunnerDetailsPO.graphs.isExisting()).toBe(false);
      });

      it("[PRPI-6822] The 'Age' field should have '5' info", async () => {
        expect(await firstSbkRunnerDetailsPO.age.getText()).toBe("5");
      });

      it("[PRPI-6823] The runner comment info should be visible", async () => {
        //and the field should have: "25/1, creditable fourth of 10 in handicap at this CD 8 days ago on first run after
        //a breathing op. Still low mileage so he must enter calculations off same mark"
        expect(await firstSbkRunnerDetailsPO.runnerComment.getText()).toBe(
          "25/1, creditable fourth of 10 in handicap at this CD 8 days ago on first run after a breathing op. Still low mileage so he must enter calculations off same mark",
        );
      });

      it("[PRPI-6824] The 5 most recent races for that runner should be visible", async () => {
        expect(await firstSbkRunnerRecentRacesPO.raceInfoRow.length).toBe(5);
      });

      describe("When the user taps the second runner, And BFF is not retrieving runnerviewLinks nor optional fields", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getRaceRunners(BFF_SECOND_RACE_RUNNER_MOCK));
          await secondHorseRacingRunnerSportsbookPO.getRunnerInformationContainers()[0].waitForClickable();
          await secondHorseRacingRunnerSportsbookPO.getRunnerInformationContainers()[0].click();
          await browser.waitUntilDisplayed(secondSbkRunnerDetailsPO.age);
        });

        it("[PRPI-6825] The 'Graphs' link should not be visible", async () => {
          expect(await secondSbkRunnerDetailsPO.graphs.isExisting()).toBe(false);
        });

        it("[PRPI-6825] The 'Age' field should have '5' info", async () => {
          expect(await secondSbkRunnerDetailsPO.age.getText()).toBe("5");
        });

        it("[PRPI-6825] The 'Weight' field should not be visible", async () => {
          expect(await secondSbkRunnerDetailsPO.weight.isExisting()).toBe(false);
        });

        it("[PRPI-6825] The runner comments should not be visible", async () => {
          expect(await secondSbkRunnerDetailsPO.runnerComment.isExisting()).toBe(false);
        });

        it("[PRPI-6825] The 'Pedigree' field and info should be visible", async () => {
          expect(await secondSbkRunnerDetailsPO.pedigree.isDisplayed()).toBe(true);
        });
      });

      describe("When the user taps on the third runner, And SCA is not retrieving info", () => {
        beforeAll(async () => {
          await thirdHorseRacingRunnerSportsbookPO.getRunnerInformationContainers()[0].waitForClickable();
          await thirdHorseRacingRunnerSportsbookPO.getRunnerInformationContainers()[0].click();
        });

        it("[PRPI-6826] The chevron for that runner should not be visible", async () => {
          expect(await thirdHorseRacingRunnerSportsbookPO.chevron.isExisting()).toBe(false);
        });

        it("[PRPI-6826] The modal should not open", async () => {
          expect(await fullScreenModalPO.element.isExisting()).toBe(false);
        });
      });
    });
  });
});
