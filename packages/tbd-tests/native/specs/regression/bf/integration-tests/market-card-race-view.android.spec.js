const {
  getRaceLayout,
  getRunnerInformationLayout,
  getRaceRunners,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MarketSO = require("@ppb/tbd-shared/components/Market/Market.so");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { swipeDownElementFullscreen } = require("../../../../helpers/gestures");

const {
  CardSO,
  HorseRacingRunnerSO,
  SportsbookMarketSO,
  RunnerDetailsSO,
  MarketBlurbsSO,
  ExchangeMarketSO,
  RecentRacesSO,
  ModalHeaderSO,
  LabelSO,
} = require("../../../../screen-objects");

const modalHeaderSO = new ModalHeaderSO();
const marketSO = new MarketSO();
const marketCardSO = new CardSO(marketSO.element);
const exchangeMarketSO = new ExchangeMarketSO();
const sportsbookMarketSO = new SportsbookMarketSO();
const marketBlurbsSO = new MarketBlurbsSO(marketSO.element);
const labelSO = new LabelSO();

const firstHorseRacingRunnerExchangeSO = new HorseRacingRunnerSO(exchangeMarketSO.runnerList[0]);
const firstExcRunnerDetailsSO = new RunnerDetailsSO(firstHorseRacingRunnerExchangeSO.element);
const firstExcRunnerRecentRacesSO = new RecentRacesSO(firstExcRunnerDetailsSO.element);

const firstHorseRacingRunnerSportsbookSO = new HorseRacingRunnerSO(sportsbookMarketSO.horseRunnerList[0]);
const firstSportsbookRunnerDetailsSO = new RunnerDetailsSO(firstHorseRacingRunnerSportsbookSO.element);
const firstSportsbookRunnerRecentRacesSO = new RecentRacesSO(firstSportsbookRunnerDetailsSO.element);

const secondHorseRacingRunnerSportsbookSO = new HorseRacingRunnerSO(sportsbookMarketSO.horseRunnerList[1]);
const secondSportsbookRunnerDetailsSO = new RunnerDetailsSO(secondHorseRacingRunnerSportsbookSO.element);

const thirdHorseRacingRunnerSportsbookSO = new HorseRacingRunnerSO(sportsbookMarketSO.horseRunnerList[2]);

const thirdHorseRacingRunnerExchangeSO = new HorseRacingRunnerSO(exchangeMarketSO.runnerList[2]);

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const horseRacingRunners = [
  {
    __typename: "RaceRunner",
    urn: "ppb:tbd:racerunner:30061949.1335/16257108",
    raceURN: "ppb:race:30061949.1335",
    selectionId: 16257108,
    rating: 104,
    apprenticeClaim: 3,
    crsDisWinFavText: "CD",
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
      silk: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
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
      medium: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
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
                    name: "Horse Racing",
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
          blurbs: [],
        }),
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

describe("When the user is on race screen", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getRunnerInformationLayout(BFF_RUNNER_VIEW_MOCK));
    await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK()));
    await mockService.mockHttpRequest(getRaceRunners(BFF_FIRST_RACE_RUNNER_MOCK));
    const url = "horse-racing/clairefontaine-3rd-aug/r-7%7C30061949.1335";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK, pullToRefresh: true });
    await browser.waitUntilDisplayed(marketCardSO.title);
  });

  it("[PRPI-3915] The first runner expandable section should be collapsed", async () => {
    expect(await firstHorseRacingRunnerExchangeSO.expandableDetails.isDisplayed()).toBe(false);
  });

  it("[PRPI-3916] The first runner's name should be 'Shakalakaboomboom'", async () => {
    expect(await firstHorseRacingRunnerExchangeSO.runnerHorseName.getText()).toBe("Shakalakaboomboom");
  });

  it("[PRPI-3917] The first runner cloth number should be '4'", async () => {
    expect(await firstHorseRacingRunnerExchangeSO.clothNumber.getText()).toBe("4");
  });

  it("[PRPI-3918] The first runner draw number should be '(10)'", async () => {
    expect(await firstHorseRacingRunnerExchangeSO.drawNumber.getText()).toBe("(10)");
  });

  it("[PRPI-3919] The first runner silk should be visible", async () => {
    expect(await firstHorseRacingRunnerExchangeSO.silk.isDisplayed()).toBe(true);
  });

  it("[PRPI-3920] The Jockey name should be 'John Velazquez'", async () => {
    expect(await firstHorseRacingRunnerExchangeSO.jockeyName.getText()).toContain("Jockey: John Velazquez");
  });

  it("[PRPI-3985] The Jockey name should be followed by a claimed weight '3'", async () => {
    expect(await firstHorseRacingRunnerExchangeSO.jockeyName.getText()).toContain("(3)");
  });

  it("[PRPI-3921] The trainer's name should be 'Trainer: Floki Vahalaa'", async () => {
    expect(await firstHorseRacingRunnerExchangeSO.trainerName.getText()).toBe("Trainer: Floki Vahalaa");
  });

  it("[PRPI-3986] The form, age and weight info should be 'F: 1-15026 | Age: 3 | Weight: 8-6'", async () => {
    expect(await firstHorseRacingRunnerExchangeSO.form.getText()).toBe("F: 1-15026 | Age: 5 | Weight: 8-6");
  });

  it("[PRPI-3987] The course, distance and win favourite text should be 'CD'", async () => {
    expect(await labelSO.element.getText()).toBe("CD");
  });

  describe("When the user taps the first runner ('Shakalakaboomboom'), And BFF is retrieving runnerViewLinks", () => {
    beforeAll(async () => {
      await browser.waitUntilClickableNative(firstHorseRacingRunnerExchangeSO.innerContainer);
      await firstHorseRacingRunnerExchangeSO.innerContainer.click();
      await browser.waitUntilDisplayed(firstExcRunnerDetailsSO.element);
      await browser.waitUntilEquals(firstExcRunnerDetailsSO.officialRating, "104");
    });

    it("[PRPI-3922] The first runner name should be Shakalakaboomboom", async () => {
      expect(await firstHorseRacingRunnerExchangeSO.runnerHorseName.getText()).toBe("Shakalakaboomboom");
      expect(await firstHorseRacingRunnerExchangeSO.clothNumber.getText()).toBe("4");
    });

    it("[PRPI-3923] The runner expandable section should expand", async () => {
      expect(await firstHorseRacingRunnerExchangeSO.expandableDetails.isDisplayed()).toBe(true);
    });

    it("[PRPI-3924] The 'Age' field should have '5' info", async () => {
      expect(await firstExcRunnerDetailsSO.age.getText()).toBe("5");
    });

    it("[PRPI-3925] The 'Weight' field should have '8-6' info", async () => {
      expect(await firstExcRunnerDetailsSO.weight.getText()).toBe("8-6");
    });

    it("[PRPI-3926] The 'OR' field should have '104' info", async () => {
      expect(await firstExcRunnerDetailsSO.officialRating.getText()).toBe("104");
    });

    it("[PRPI-3927] The TIMEFORM section should be visible", async () => {
      expect(await firstExcRunnerDetailsSO.timeformSection.isDisplayed()).toBe(true);
    });

    it("[PRPI-8741]The runner comment info should be visible and the field should have: '25/1, creditable", async () => {
      //fourth of 10 in handicap at this CD 8 days ago on first run after a breathing op. Still low mileage so he must
      //enter calculations off same mark
      expect(await firstExcRunnerDetailsSO.timeformTextSection.getText()).toContain(
        "25/1, creditable fourth of 10 in handicap at this CD 8 days ago on first run after a breathing op. Still low mileage so he must enter calculations off same mark",
      );
    });

    it("[PRPI-3928] The 'Pedigree' field should have 'NEW APPROACH (IRE) HORATIA (IRE)' info", async () => {
      expect(await firstExcRunnerDetailsSO.pedigree.getText()).toBe("NEW APPROACH (IRE) | HORATIA (IRE)");
    });

    it("[PRPI-3929] The 'Bred' field should have 'IRE' info", async () => {
      expect(await firstExcRunnerDetailsSO.bred.getText()).toBe("IRE");
    });

    it("[PRPI-3930] The 'Equipment' field should have 'Visor and tongue strap' info", async () => {
      expect(await firstExcRunnerDetailsSO.equipment.getText()).toBe("Visor and tongue strap");
    });

    it("[PRPI-3931] The 5 most recent races for that runner should be visible", async () => {
      expect(await firstExcRunnerRecentRacesSO.raceInfoRows.length).toBe(5);
    });

    it("[PRPI-3932] The 'DATE' title and info should be visible", async () => {
      expect(await firstExcRunnerRecentRacesSO.headers[0].getText()).toEqual("DATE");
      expect(await firstExcRunnerRecentRacesSO.raceInfoDate[0].getText()).toContain("Apr 23");
    });

    it("[PRPI-3933] The 'COURSE' title should be visible", async () => {
      expect(await firstExcRunnerRecentRacesSO.headers[1].getText()).toEqual("COURSE");
    });

    it("[PRPI-3934] The 'N/A' label should be visible for the course field", async () => {
      expect(await firstExcRunnerRecentRacesSO.raceInfoCourse[0].getText()).toEqual("N/A");
    });

    it("[PRPI-3935] The 'DISTANCE' title and info should be visible", async () => {
      expect(await firstExcRunnerRecentRacesSO.headers[2].getText()).toEqual("DISTANCE");
      expect(await firstExcRunnerRecentRacesSO.raceInfoDistance[0].getText()).toEqual("4f 220y");
    });

    it("[PRPI-3936] The 'GOING' title and info should be visible", async () => {
      expect(await firstExcRunnerRecentRacesSO.headers[3].getText()).toEqual("GOING");
      expect(await firstExcRunnerRecentRacesSO.raceInfoGoing[0].getText()).toEqual("Good Soft");
    });

    it("[PRPI-3937] The 'POS' title and info should be visible", async () => {
      expect(await firstExcRunnerRecentRacesSO.headers[4].getText()).toEqual("POS");
      expect(await firstExcRunnerRecentRacesSO.raceInfoPos[0].getText()).toEqual("2/13");
    });

    it("[PRPI-3938] The 'TYPE' title and info should be visible", async () => {
      expect(await firstExcRunnerRecentRacesSO.headers[5].getText()).toEqual("TYPE");
      expect(await firstExcRunnerRecentRacesSO.raceInfoType[0].getText()).toEqual("Flat");
    });

    describe("When the user taps on a given past race", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(firstExcRunnerRecentRacesSO.raceInfoRows[0]);
        await firstExcRunnerRecentRacesSO.raceInfoRows[0].click();
        await browser.waitUntilDisplayed(firstExcRunnerRecentRacesSO.raceInfoComment[0]);
      });

      it("[PRPI-3939] The 'DATE' title and info should be visible", async () => {
        expect(await firstExcRunnerRecentRacesSO.headers[0].getText()).toEqual("DATE");
        expect(await firstExcRunnerRecentRacesSO.raceInfoDate[0].getText()).toContain("Apr 23");
      });

      it("[PRPI-3940] The runner comments info should be visible", async () => {
        expect(await firstExcRunnerRecentRacesSO.raceInfoComment[0].getText()).toEqual(
          "No runner comments available for this event",
        );
      });

      describe("When the user taps again on that past race", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(firstExcRunnerRecentRacesSO.raceInfoRows[0]);
          await firstExcRunnerRecentRacesSO.raceInfoRows[0].click();

          await browser.waitUntil(async () => (await firstExcRunnerRecentRacesSO.raceInfoComment.length) === 0);
        });

        it("[PRPI-3941] The 'DATE' title and info should be visible", async () => {
          expect(await firstExcRunnerRecentRacesSO.headers[0].getText()).toEqual("DATE");
          expect(await firstExcRunnerRecentRacesSO.raceInfoDate[0].getText()).toContain("Apr 23");
        });

        it("[PRPI-3942] The runner comments info should not be visible", async () => {
          expect(await firstExcRunnerRecentRacesSO.raceInfoComment.length).toBe(0);
        });
      });
    });
  });

  describe("When BFF is not retrieving runnerviewLinks for that runner, And SCA is not retrieving info", () => {
    beforeAll(async () => {
      await swipeDownElementFullscreen(marketCardSO.element);
      await browser.waitUntilDisplayed(thirdHorseRacingRunnerExchangeSO.element);
      await browser.waitUntilDisplayed(thirdHorseRacingRunnerExchangeSO.innerContainer);
      await thirdHorseRacingRunnerExchangeSO.innerContainer.click();
      await browser.waitUntilDisplayed(thirdHorseRacingRunnerExchangeSO.element);
    });

    it("[PRPI-3943] The chevron for that runner should not be visible", async () => {
      expect(await thirdHorseRacingRunnerExchangeSO.chevron.isDisplayed()).toBe(false);
    });

    it("[PRPI-3944] The modal should not open", async () => {
      expect(await modalHeaderSO.element.isDisplayed()).toBe(false);
    });
  });

  describe("When there is a market promo available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK(true)));
      await swipeDownElementFullscreen(marketCardSO.element);
      await browser.waitUntilDisplayed(marketBlurbsSO.marketPromo);
    });

    it("[PRPI-3945] The market promo should be displayed", async () => {
      expect(await marketBlurbsSO.marketPromo.isDisplayed()).toBe(true);
    });
  });

  describe("When the user is on sportsbook", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK(false, false, true)));
      await swipeDownElementFullscreen(marketCardSO.element);
      await browser.waitUntilDisplayed(firstHorseRacingRunnerSportsbookSO.element);
    });

    describe("And taps on the first SBK runner ('Shakalakaboomboom') and BFF is not retrieving runnerViewLinks", () => {
      beforeAll(async () => {
        await firstHorseRacingRunnerSportsbookSO.innerContainer.click();
        await browser.waitUntilDisplayed(firstHorseRacingRunnerSportsbookSO.expandableDetails);
      });

      it("[PRPI-3946] The runner expandable section should expand", async () => {
        expect(await firstHorseRacingRunnerSportsbookSO.expandableDetails.isDisplayed()).toBe(true);
      });

      it("[PRPI-3947] The 'Graphs' link should not be visible", async () => {
        expect(await firstSportsbookRunnerDetailsSO.graphsContainer.isExisting()).toBe(false);
      });

      it("[PRPI-3948] The 'Age' tile with '5' info should be visible", async () => {
        expect(await firstSportsbookRunnerDetailsSO.age.getText()).toBe("5");
      });

      it("[PRPI-8742]The runner comment info should be visible: '25/1, creditable fourth of 10 in handicap at ", async () => {
        // this CD 8 days ago on first run after a breathing op. Still low mileage so he must enter calculations off same" mark
        expect(await firstSportsbookRunnerDetailsSO.timeformTextSection.getText()).toContain(
          "25/1, creditable fourth of 10 in handicap at this CD 8 days ago on first run after a breathing op. Still low mileage so he must enter calculations off same mark",
        );
      });

      it("[PRPI-3949] The 5 most recent races for that runner should be visible", async () => {
        expect(await firstSportsbookRunnerRecentRacesSO.raceInfoRows.length).toBe(5);
      });
    });

    describe("And taps on the second SBK runner and BFF is not retrieving runnerViewLinks nor runner optional fields", () => {
      beforeAll(async () => {
        await firstHorseRacingRunnerSportsbookSO.innerContainer.click();
        await secondHorseRacingRunnerSportsbookSO.innerContainer.click();
        await browser.waitUntilDisplayed(secondHorseRacingRunnerSportsbookSO.expandableDetails);
        await browser.waitUntilDisplayed(secondSportsbookRunnerDetailsSO.element);
      });

      it("[PRPI-3950] The 'Graphs' link should not be visible", async () => {
        expect(await secondSportsbookRunnerDetailsSO.graphsContainer.isExisting()).toBe(false);
      });

      it("[PRPI-3951] The 'Age' field should have '5' info", async () => {
        expect(await secondSportsbookRunnerDetailsSO.age.getText()).toBe("5");
      });

      it("[PRPI-3952] The 'Weight' field should not be visible", async () => {
        expect(await secondSportsbookRunnerDetailsSO.weight.isExisting()).toBe(false);
      });

      it("[PRPI-3953] The runner comments should not be visible", async () => {
        expect(await secondSportsbookRunnerDetailsSO.timeformTextSection.isExisting()).toBe(false);
      });

      it("[PRPI-3954] The 'Pedigree' field and info should be visible", async () => {
        expect(await secondSportsbookRunnerDetailsSO.pedigree.isDisplayed()).toBe(true);
      });
    });

    describe("When the user taps on the third runner, And SCA is not retrieving info", () => {
      beforeAll(async () => {
        await secondHorseRacingRunnerSportsbookSO.innerContainer.click();
        await thirdHorseRacingRunnerSportsbookSO.innerContainer.click();
      });

      it("[PRPI-3955] The chevron for that runner should not be visible", async () => {
        expect(await thirdHorseRacingRunnerSportsbookSO.chevron.isExisting()).toBe(false);
      });

      it("[PRPI-3956] The modal should not open", async () => {
        expect(await modalHeaderSO.element.isDisplayed()).toBe(false);
      });
    });
  });
});
