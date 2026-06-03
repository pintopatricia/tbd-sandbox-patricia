const RaceMarketCardSO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.native.so");
const CorrectScoreCardSO = require("@ppb/tbd-shared/components/CorrectScoreCard/CorrectScoreCard.so");
const {
  getSportsLayout,
  getRaceLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { swipeLeftElement, swipeUp, swipeDownElement } = require("../../../../helpers/gestures");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  PebbleCardGroupSO,
  GenericScreenSO,
  SportPageScreenSO,
  RunnerSO,
  SportsbookMarketSO,
  PebbleListSO,
  CardSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const sportScreenSO = new SportPageScreenSO();
const firstPebbleCardGroup = new PebbleCardGroupSO(sportScreenSO.pebbleCardGroups[0]);
const thirdPebbleCardGroup = new PebbleCardGroupSO(sportScreenSO.pebbleCardGroups[1]);
const thirdPebbleCardGroupCardSO = new CardSO(thirdPebbleCardGroup.element);
const thirdPebbleCardGroupPebbles = new PebbleListSO(thirdPebbleCardGroup.element);

const correctScoreCard = new CorrectScoreCardSO(firstPebbleCardGroup.element);

const genericScreenSO = new GenericScreenSO();
const sportsbookMarketSO = new SportsbookMarketSO();
const pebbleListSO = new PebbleListSO();
const raceMarketCardSO = new RaceMarketCardSO();

const OTHER_SPORTSBOOK_MARKET_ID = "924.11111111111";

const fourPlacesPebbleSO = pebbleListSO.pebbleListElements[2];
const lastPebbleSO = pebbleListSO.pebbleListElements[5];
const firstRunnerSO = new RunnerSO(sportsbookMarketSO.horseRunnerList[0]);

const MARKET_URN = "ppb:sbkMarket:924.1";

const createCorrectScoreRunners = (isDetails = false) => {
  const result = [];

  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      const selectionId = `${i + 1}${j}`;

      result.push(
        isDetails
          ? {
              selectionId,
              runnerOdds: {
                decimalDisplayOdds: { decimalOdds: parseFloat(`1.${selectionId}`) },
                fractionalDisplayOdds: { numerator: 1, denominator: 2 },
              },
            }
          : {
              runnerURN: `ppb:sbkRunner:924.1/${selectionId}`,
              selectionId,
              name: `${i} - ${j}`,
              marketURN: MARKET_URN,
            },
      );
    }
  }

  return result;
};

const sporstBookRunners = [
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.234263186/16257108",
    name: "Photograph",
    selectionId: 16257108,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.234263186/29547685",
    name: "Dromiskin",
    selectionId: 29547685,
  },
];

const sportsbookMarket = {
  __typename: "SportsbookMarket",
  urn: "ppb:sbkMarket:924.257358353",
  name: "Winning Distance 3-Way",
  marketType: "WINNING_DISTANCE",
  marketTypeName: null,
  liveData: {
    inplay: false,
    turnInPlayEnabled: false,
  },
  hierarchy: {
    __typename: "RaceHierarchy",
    race: {
      __typename: "Race",
      urn: "ppb:race:30355179.1430",
      startTime: "2021-03-16T14:30:00.000Z",
      raceId: "30355179.1430",
      name: "Festival Handicap Chase",
      meeting: {
        __typename: "Meeting",
        urn: "ppb:meeting:30355179",
        name: "Cheltenham 16th Mar",
        meetingId: "30355179",
        country: "GB",
        countryFlag: {
          small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
          medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
          large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
        },
        venue: "Cheltenham",
        date: "2021-03-16T13:20:00.000Z",
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
      urn: "ppb:meeting:30355179",
      name: "Cheltenham 16th Mar",
      meetingId: "30355179",
      country: "GB",
      countryFlag: {
        small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
        medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
        large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
      },
      venue: "Cheltenham",
      date: "2021-03-16T13:20:00.000Z",
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
      runnerURN: "ppb:sbkRunner:924.257358353/13764961",
      name: "Up To And Including 2 & 1/4 Lengths",
      selectionId: 13764961,
      handicap: 0,
      resultType: null,
    },
    {
      __typename: "Runner",
      runnerURN: "ppb:sbkRunner:924.257358353/13764962",
      name: "2 & 1/2 Lengths To 3 & 3/4 Lengths Inclusive",
      selectionId: 13764962,
      handicap: 0,
      resultType: null,
    },
  ],

  isOddsboostMarketType: false,
};

const pebbleCardGroup = {
  __typename: "PebbleCardGroup",
  urn: "ppb:tbd:card:pebbleCard:30355179.1430|PLACES",
  pebbleCardGroupTitle: { translated: "Places" },
  selectedItemUrn: "ppb:tbd:card:market:924.257358353",
  full: {
    edges: [
      {
        name: "2 Places",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:924.257358352",
          cardTitle: "Match Odds",
          viewLinks: [
            {
              viewUrn: "ppb:tbd:view:market:924.257358352",
              viewUrl: "horse-racing/cheltenham-16th-mar/winning-distance-3-way/r-924.257358352",
            },
          ],

          marketsHierarchy: {
            race: {
              __typename: "Race",
              urn: "ppb:race:30355179.1430",
              startTime: "2021-03-16T14:30:00.000Z",
              name: "Festival Handicap Chase",
              raceId: "30355179.1430",
              verdict: "Novices have an excellent record in this and HAPPYGOLUCKY .",
              details: {
                distance: {
                  miles: 3,
                  furlongs: 1,
                  yards: 0,
                },
                going: "SOFT",
                status: "PARADING",
                type: "CHASE",
              },
              runners: [
                {
                  rating123: 0,
                  ratingStars: 2,
                  selectionId: 9045752,
                  form: "P3158-753",
                  rating: 143,
                  comments:
                    "Placed twice in this race but only eighth last year and below par all 3 starts this term. Back on last winning mark but possibly best days are behind him. Headgear on.",
                  horse: {
                    name: "VINTAGE CLOUDS (IRE)",
                    sireName: "CLOUDINGS (IRE)",
                    damName: "RARE VINTAGE (IRE)",
                    damSireName: "GERMANY (USA)",
                    age: 11,
                    color: "GREY",
                    sex: "GELDING",
                  },
                  details: {
                    jockeyName: "Ryan Mania",
                    trainerName: "Sue Smith",
                    saddleCloth: "9",
                    weight: {
                      stones: "10-11",
                    },
                    equipmentDescription: "cheekpieces",
                    silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00004175.png",
                    draw: null,
                  },
                },
                {
                  rating123: 0,
                  ratingStars: 3,
                  selectionId: 2578078,
                  form: "11P/091-",
                  rating: 151,
                  comments: "Low-mileage 11-y-o. Runner-up in Albert Bartlett in 2018. .",
                  horse: {
                    name: "OK CORRAL (IRE)",
                    sireName: "MAHLER",
                    damName: "ACOOLA (IRE)",
                    damSireName: "FLEMENSFIRTH (USA)",
                    age: 11,
                    color: "BAY",
                    sex: "GELDING",
                  },
                  details: {
                    jockeyName: "M. P. Walsh",
                    trainerName: "Nicky Henderson",
                    saddleCloth: "4",
                    weight: {
                      stones: "11-5",
                    },
                    equipmentDescription: null,
                    silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00032184.png",
                    draw: null,
                  },
                },
              ],

              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30355179",
                name: "Cheltenham 16th Mar",
                meetingId: "30355179",
                country: "GB",
                countryFlag: {
                  small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                  medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                  large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                },
                venue: "Cheltenham",
                date: "2021-03-16T13:20:00.000Z",
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7",
                  name: "Horse Racing",
                  sportId: 7,
                },
              },
            },
          },
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.257358352",
                name: "Winning Distance 3-Way",
                marketType: "WINNING_DISTANCE",
                marketTypeName: null,
                liveData: {
                  inplay: false,
                  turnInPlayEnabled: false,
                },
                hierarchy: {
                  __typename: "RaceHierarchy",
                  race: {
                    __typename: "Race",
                    urn: "ppb:race:30355179.1430",
                    startTime: "2021-03-16T14:30:00.000Z",
                    raceId: "30355179.1430",
                    name: "Festival Handicap Chase",
                    meeting: {
                      __typename: "Meeting",
                      urn: "ppb:meeting:30355179",
                      name: "Cheltenham 16th Mar",
                      meetingId: "30355179",
                      country: "GB",
                      countryFlag: {
                        small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                        medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                        large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                      },
                      venue: "Cheltenham",
                      date: "2021-03-16T13:20:00.000Z",
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
                    urn: "ppb:meeting:30355179",
                    name: "Cheltenham 16th Mar",
                    meetingId: "30355179",
                    country: "GB",
                    countryFlag: {
                      small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                      medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                      large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                    },
                    venue: "Cheltenham",
                    date: "2021-03-16T13:20:00.000Z",
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
                    runnerURN: "ppb:sbkRunner:924.257358352/13764961",
                    name: "Up To And Including 2 & 1/4 Lengths",
                    selectionId: 13764961,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.257358352/13764962",
                    name: "2 & 1/2 Lengths To 3 & 3/4 Lengths Inclusive",
                    selectionId: 13764962,
                    handicap: 0,
                    resultType: null,
                  },
                ],

                isOddsboostMarketType: false,
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.257358352/13764961",
                  name: "Up To And Including 2 & 1/4 Lengths",
                  selectionId: 13764961,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.257358352/13764962",
                  name: "2 & 1/2 Lengths To 3 & 3/4 Lengths Inclusive",
                  selectionId: 13764962,
                  handicap: 0,
                  resultType: null,
                },
              ],
            },
          },
          numberOfRunnersToDisplay: null,
          runnerViewLinks: [
            {
              runnerUrn: "ppb:sbkRunner:924.257358352/13764961",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:924.257358352/13764961/0",
            },
            {
              runnerUrn: "ppb:sbkRunner:924.257358352/13764962",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:924.257358352/13764962/0",
            },
          ],
        },
      },
      {
        name: "3 Places",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:924.257358353",
          cardTitle: "Winning Distance 3-Way",
          viewLinks: [
            {
              viewUrn: "ppb:tbd:view:market:924.257358353",
              viewUrl: "horse-racing/cheltenham-16th-mar/winning-distance-3-way/r-924.257358353",
            },
          ],

          marketsHierarchy: {
            race: {
              __typename: "Race",
              urn: "ppb:race:30355179.1430",
              startTime: "2021-03-16T14:30:00.000Z",
              name: "Festival Handicap Chase",
              raceId: "30355179.1430",
              verdict: "Novices have an excellent record in this and HAPPYGOLUCKY.",
              details: {
                distance: {
                  miles: 3,
                  furlongs: 1,
                  yards: 0,
                },
                going: "SOFT",
                status: "PARADING",
                type: "CHASE",
              },
              runners: [
                {
                  rating123: 0,
                  ratingStars: 2,
                  selectionId: 9045752,
                  form: "P3158-753",
                  rating: 143,
                  comments:
                    "Placed twice in this race but only eighth last year and below par all 3 starts this term. Back on last winning mark but possibly best days are behind him. Headgear on.",
                  horse: {
                    name: "VINTAGE CLOUDS (IRE)",
                    sireName: "CLOUDINGS (IRE)",
                    damName: "RARE VINTAGE (IRE)",
                    damSireName: "GERMANY (USA)",
                    age: 11,
                    color: "GREY",
                    sex: "GELDING",
                  },
                  details: {
                    jockeyName: "Ryan Mania",
                    trainerName: "Sue Smith",
                    saddleCloth: "9",
                    weight: {
                      stones: "10-11",
                    },
                    equipmentDescription: "cheekpieces",
                    silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00004175.png",
                    draw: null,
                  },
                },
                {
                  rating123: 0,
                  ratingStars: 3,
                  selectionId: 2578078,
                  form: "11P/091-",
                  rating: 151,
                  comments:
                    "Low-mileage 11-y-o. Runner-up in Albert Bartlett in 2018. All-or-nothing record over fences but produced a career best when defying top weight in Sky Bet at Doncaster when last seen 13 months ago.",
                  horse: {
                    name: "OK CORRAL (IRE)",
                    sireName: "MAHLER",
                    damName: "ACOOLA (IRE)",
                    damSireName: "FLEMENSFIRTH (USA)",
                    age: 11,
                    color: "BAY",
                    sex: "GELDING",
                  },
                  details: {
                    jockeyName: "M. P. Walsh",
                    trainerName: "Nicky Henderson",
                    saddleCloth: "4",
                    weight: {
                      stones: "11-5",
                    },
                    equipmentDescription: null,
                    silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00032184.png",
                    draw: null,
                  },
                },
              ],

              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30355179",
                name: "Cheltenham 16th Mar",
                meetingId: "30355179",
                country: "GB",
                countryFlag: {
                  small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                  medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                  large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                },
                venue: "Cheltenham",
                date: "2021-03-16T13:20:00.000Z",
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7",
                  name: "Horse Racing",
                  sportId: 7,
                },
              },
            },
          },
          displayRunners: {
            sportsbook: {
              market: sportsbookMarket,
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.257358353/13764961",
                  name: "Up To And Including 2 & 1/4 Lengths",
                  selectionId: 13764961,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.257358353/13764962",
                  name: "2 & 1/2 Lengths To 3 & 3/4 Lengths Inclusive",
                  selectionId: 13764962,
                  handicap: 0,
                  resultType: null,
                },
              ],
            },
          },
          numberOfRunnersToDisplay: null,
          runnerViewLinks: [
            {
              runnerUrn: "ppb:sbkRunner:924.257358353/13764961",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:924.257358353/13764961/0",
            },
            {
              runnerUrn: "ppb:sbkRunner:924.257358353/13764962",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:924.257358353/13764962/0",
            },
          ],
        },
      },
      {
        name: "4 Places",
        node: {
          __typename: "CorrectScoreCard",
          urn: "ppb:tbd:card:correctScore:924.1|5",
          numberOfItemsToDisplay: 3,
          market: {
            __typename: "SportsbookMarket",
            urn: MARKET_URN,
            marketType: "CORRECT_SCORE",
            marketTypeName: null,
            name: "4 Places",
            runners: createCorrectScoreRunners(),
            noLiveData: true,
          },
        },
      },
      {
        name: "5 Places",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:924.257358354",
          cardTitle: "Winning Distance 3-Way",
          viewLinks: [
            {
              viewUrn: "ppb:tbd:view:market:924.257358354",
              viewUrl: "horse-racing/cheltenham-16th-mar/winning-distance-3-way/r-924.257358354",
            },
          ],

          marketsHierarchy: {
            race: {
              __typename: "Race",
              urn: "ppb:race:30355179.1430",
              startTime: "2021-03-16T14:30:00.000Z",
              name: "Festival Handicap Chase",
              raceId: "30355179.1430",
              verdict: "Novices have an excellent record in this and HAPPYGOLUCKY.",
              details: {
                distance: {
                  miles: 3,
                  furlongs: 1,
                  yards: 0,
                },
                going: "SOFT",
                status: "PARADING",
                type: "CHASE",
              },
              runners: [
                {
                  rating123: 0,
                  ratingStars: 2,
                  selectionId: 9045752,
                  form: "P3158-753",
                  rating: 143,
                  comments:
                    "Placed twice in this race but only eighth last year and below par all 3 starts this term. Back on last winning mark but possibly best days are behind him. Headgear on.",
                  horse: {
                    name: "VINTAGE CLOUDS (IRE)",
                    sireName: "CLOUDINGS (IRE)",
                    damName: "RARE VINTAGE (IRE)",
                    damSireName: "GERMANY (USA)",
                    age: 11,
                    color: "GREY",
                    sex: "GELDING",
                  },
                  details: {
                    jockeyName: "Ryan Mania",
                    trainerName: "Sue Smith",
                    saddleCloth: "9",
                    weight: {
                      stones: "10-11",
                    },
                    equipmentDescription: "cheekpieces",
                    silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00004175.png",
                    draw: null,
                  },
                },
                {
                  rating123: 0,
                  ratingStars: 3,
                  selectionId: 2578078,
                  form: "11P/091-",
                  rating: 151,
                  comments:
                    "Low-mileage 11-y-o. Runner-up in Albert Bartlett in 2018. All-or-nothing record over fences but produced a career best when defying top weight in Sky Bet at Doncaster when last seen 13 months ago.",
                  horse: {
                    name: "OK CORRAL (IRE)",
                    sireName: "MAHLER",
                    damName: "ACOOLA (IRE)",
                    damSireName: "FLEMENSFIRTH (USA)",
                    age: 11,
                    color: "BAY",
                    sex: "GELDING",
                  },
                  details: {
                    jockeyName: "M. P. Walsh",
                    trainerName: "Nicky Henderson",
                    saddleCloth: "4",
                    weight: {
                      stones: "11-5",
                    },
                    equipmentDescription: null,
                    silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00032184.png",
                    draw: null,
                  },
                },
              ],

              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30355179",
                name: "Cheltenham 16th Mar",
                meetingId: "30355179",
                country: "GB",
                countryFlag: {
                  small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                  medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                  large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                },
                venue: "Cheltenham",
                date: "2021-03-16T13:20:00.000Z",
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7",
                  name: "Horse Racing",
                  sportId: 7,
                },
              },
            },
          },
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.257358354",
                name: "Winning Distance 3-Way",
                marketType: "WINNING_DISTANCE",
                marketTypeName: null,
                liveData: {
                  inplay: false,
                  turnInPlayEnabled: false,
                },
                hierarchy: {
                  __typename: "RaceHierarchy",
                  race: {
                    __typename: "Race",
                    urn: "ppb:race:30355179.1430",
                    startTime: "2021-03-16T14:30:00.000Z",
                    raceId: "30355179.1430",
                    name: "Festival Handicap Chase",
                    meeting: {
                      __typename: "Meeting",
                      urn: "ppb:meeting:30355179",
                      name: "Cheltenham 16th Mar",
                      meetingId: "30355179",
                      country: "GB",
                      countryFlag: {
                        small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                        medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                        large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                      },
                      venue: "Cheltenham",
                      date: "2021-03-16T13:20:00.000Z",
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
                    urn: "ppb:meeting:30355179",
                    name: "Cheltenham 16th Mar",
                    meetingId: "30355179",
                    country: "GB",
                    countryFlag: {
                      small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                      medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                      large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                    },
                    venue: "Cheltenham",
                    date: "2021-03-16T13:20:00.000Z",
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
                    runnerURN: "ppb:sbkRunner:924.257358354/13764961",
                    name: "Up To And Including 2 & 1/4 Lengths",
                    selectionId: 13764961,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.257358354/13764962",
                    name: "2 & 1/2 Lengths To 3 & 3/4 Lengths Inclusive",
                    selectionId: 13764962,
                    handicap: 0,
                    resultType: null,
                  },
                ],

                isOddsboostMarketType: false,
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.257358354/13764961",
                  name: "Up To And Including 2 & 1/4 Lengths",
                  selectionId: 13764961,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.257358354/13764962",
                  name: "2 & 1/2 Lengths To 3 & 3/4 Lengths Inclusive",
                  selectionId: 13764962,
                  handicap: 0,
                  resultType: null,
                },
              ],
            },
          },
          numberOfRunnersToDisplay: null,
          runnerViewLinks: [
            {
              runnerUrn: "ppb:sbkRunner:924.257358354/13764961",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:924.257358354/13764961/0",
            },
            {
              runnerUrn: "ppb:sbkRunner:924.257358354/13764962",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:924.257358354/13764962/0",
            },
          ],
        },
      },
      {
        name: "6 Places",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:924.257358354",
          cardTitle: "Winning Distance 3-Way",
          viewLinks: [
            {
              viewUrn: "ppb:tbd:view:market:924.257358354",
              viewUrl: "horse-racing/cheltenham-16th-mar/winning-distance-3-way/r-924.257358354",
            },
          ],

          marketsHierarchy: {
            race: {
              __typename: "Race",
              urn: "ppb:race:30355179.1430",
              startTime: "2021-03-16T14:30:00.000Z",
              name: "Festival Handicap Chase",
              raceId: "30355179.1430",
              verdict: "Novices have an excellent record in this and HAPPYGOLUCKY.",
              details: {
                distance: {
                  miles: 3,
                  furlongs: 1,
                  yards: 0,
                },
                going: "SOFT",
                status: "PARADING",
                type: "CHASE",
              },
              runners: [
                {
                  rating123: 0,
                  ratingStars: 2,
                  selectionId: 9045752,
                  form: "P3158-753",
                  rating: 143,
                  comments:
                    "Placed twice in this race but only eighth last year and below par all 3 starts this term. Back on last winning mark but possibly best days are behind him. Headgear on.",
                  horse: {
                    name: "VINTAGE CLOUDS (IRE)",
                    sireName: "CLOUDINGS (IRE)",
                    damName: "RARE VINTAGE (IRE)",
                    damSireName: "GERMANY (USA)",
                    age: 11,
                    color: "GREY",
                    sex: "GELDING",
                  },
                  details: {
                    jockeyName: "Ryan Mania",
                    trainerName: "Sue Smith",
                    saddleCloth: "9",
                    weight: {
                      stones: "10-11",
                    },
                    equipmentDescription: "cheekpieces",
                    silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00004175.png",
                    draw: null,
                  },
                },
                {
                  rating123: 0,
                  ratingStars: 3,
                  selectionId: 2578078,
                  form: "11P/091-",
                  rating: 151,
                  comments:
                    "Low-mileage 11-y-o. Runner-up in Albert Bartlett in 2018. All-or-nothing record over fences but produced a career best when defying top weight in Sky Bet at Doncaster when last seen 13 months ago.",
                  horse: {
                    name: "OK CORRAL (IRE)",
                    sireName: "MAHLER",
                    damName: "ACOOLA (IRE)",
                    damSireName: "FLEMENSFIRTH (USA)",
                    age: 11,
                    color: "BAY",
                    sex: "GELDING",
                  },
                  details: {
                    jockeyName: "M. P. Walsh",
                    trainerName: "Nicky Henderson",
                    saddleCloth: "4",
                    weight: {
                      stones: "11-5",
                    },
                    equipmentDescription: null,
                    silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00032184.png",
                    draw: null,
                  },
                },
              ],

              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30355179",
                name: "Cheltenham 16th Mar",
                meetingId: "30355179",
                country: "GB",
                countryFlag: {
                  small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                  medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                  large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                },
                venue: "Cheltenham",
                date: "2021-03-16T13:20:00.000Z",
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7",
                  name: "Horse Racing",
                  sportId: 7,
                },
              },
            },
          },
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.257358354",
                name: "Winning Distance 3-Way",
                marketType: "WINNING_DISTANCE",
                marketTypeName: null,
                liveData: {
                  inplay: false,
                  turnInPlayEnabled: false,
                },
                hierarchy: {
                  __typename: "RaceHierarchy",
                  race: {
                    __typename: "Race",
                    urn: "ppb:race:30355179.1430",
                    startTime: "2021-03-16T14:30:00.000Z",
                    raceId: "30355179.1430",
                    name: "Festival Handicap Chase",
                    meeting: {
                      __typename: "Meeting",
                      urn: "ppb:meeting:30355179",
                      name: "Cheltenham 16th Mar",
                      meetingId: "30355179",
                      country: "GB",
                      countryFlag: {
                        small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                        medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                        large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                      },
                      venue: "Cheltenham",
                      date: "2021-03-16T13:20:00.000Z",
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
                    urn: "ppb:meeting:30355179",
                    name: "Cheltenham 16th Mar",
                    meetingId: "30355179",
                    country: "GB",
                    countryFlag: {
                      small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                      medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                      large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                    },
                    venue: "Cheltenham",
                    date: "2021-03-16T13:20:00.000Z",
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
                    runnerURN: "ppb:sbkRunner:924.257358354/13764961",
                    name: "Up To And Including 2 & 1/4 Lengths",
                    selectionId: 13764961,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.257358354/13764962",
                    name: "2 & 1/2 Lengths To 3 & 3/4 Lengths Inclusive",
                    selectionId: 13764962,
                    handicap: 0,
                    resultType: null,
                  },
                ],

                isOddsboostMarketType: false,
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.257358354/13764961",
                  name: "Up To And Including 2 & 1/4 Lengths",
                  selectionId: 13764961,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.257358354/13764962",
                  name: "2 & 1/2 Lengths To 3 & 3/4 Lengths Inclusive",
                  selectionId: 13764962,
                  handicap: 0,
                  resultType: null,
                },
              ],
            },
          },
          numberOfRunnersToDisplay: null,
          runnerViewLinks: [
            {
              runnerUrn: "ppb:sbkRunner:924.257358354/13764961",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:924.257358354/13764961/0",
            },
            {
              runnerUrn: "ppb:sbkRunner:924.257358354/13764962",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:924.257358354/13764962/0",
            },
          ],
        },
      },
      {
        name: "7 Places",
        node: {
          __typename: "MarketCard",
          urn: `ppb:tbd:card:market:${OTHER_SPORTSBOOK_MARKET_ID}`,
          cardTitle: "Winning Distance 3-Way",
          viewLinks: [
            {
              viewUrn: "ppb:tbd:view:market:924.257358354",
              viewUrl: "horse-racing/cheltenham-16th-mar/winning-distance-3-way/r-924.257358354",
            },
          ],

          marketsHierarchy: {
            race: {
              __typename: "Race",
              urn: "ppb:race:30355179.1430",
              startTime: "2021-03-16T14:30:00.000Z",
              name: "Festival Handicap Chase",
              raceId: "30355179.1430",
              verdict: "Novices have an excellent record in this and HAPPYGOLUCKY.",
              details: {
                distance: {
                  miles: 3,
                  furlongs: 1,
                  yards: 0,
                },
                going: "SOFT",
                status: "PARADING",
                type: "CHASE",
              },
              runners: [
                {
                  rating123: 0,
                  ratingStars: 2,
                  selectionId: 9045752,
                  form: "P3158-753",
                  rating: 143,
                  comments:
                    "Placed twice in this race but only eighth last year and below par all 3 starts this term. Back on last winning mark but possibly best days are behind him. Headgear on.",
                  horse: {
                    name: "VINTAGE CLOUDS (IRE)",
                    sireName: "CLOUDINGS (IRE)",
                    damName: "RARE VINTAGE (IRE)",
                    damSireName: "GERMANY (USA)",
                    age: 11,
                    color: "GREY",
                    sex: "GELDING",
                  },
                  details: {
                    jockeyName: "Ryan Mania",
                    trainerName: "Sue Smith",
                    saddleCloth: "9",
                    weight: {
                      stones: "10-11",
                    },
                    equipmentDescription: "cheekpieces",
                    silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00004175.png",
                    draw: null,
                  },
                },
                {
                  rating123: 0,
                  ratingStars: 3,
                  selectionId: 2578078,
                  form: "11P/091-",
                  rating: 151,
                  comments:
                    "Low-mileage 11-y-o. Runner-up in Albert Bartlett in 2018. All-or-nothing record over fences but produced a career best when defying top weight in Sky Bet at Doncaster when last seen 13 months ago.",
                  horse: {
                    name: "OK CORRAL (IRE)",
                    sireName: "MAHLER",
                    damName: "ACOOLA (IRE)",
                    damSireName: "FLEMENSFIRTH (USA)",
                    age: 11,
                    color: "BAY",
                    sex: "GELDING",
                  },
                  details: {
                    jockeyName: "M. P. Walsh",
                    trainerName: "Nicky Henderson",
                    saddleCloth: "4",
                    weight: {
                      stones: "11-5",
                    },
                    equipmentDescription: null,
                    silk: "https://content.betfair.com/feeds_images/Horses/SilkColours/c20210316chl/00032184.png",
                    draw: null,
                  },
                },
              ],

              meeting: {
                __typename: "Meeting",
                urn: "ppb:meeting:30355179",
                name: "Cheltenham 16th Mar",
                meetingId: "30355179",
                country: "GB",
                countryFlag: {
                  small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                  medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                  large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                },
                venue: "Cheltenham",
                date: "2021-03-16T13:20:00.000Z",
                sport: {
                  __typename: "Sport",
                  urn: "ppb:eventType:7",
                  name: "Horse Racing",
                  sportId: 7,
                },
              },
            },
          },
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: `ppb:sbkMarket:${OTHER_SPORTSBOOK_MARKET_ID}`,
                name: "Winning Distance 3-Way",
                marketType: "WINNING_DISTANCE",
                marketTypeName: null,
                liveData: {
                  inplay: false,
                  turnInPlayEnabled: false,
                },
                hierarchy: {
                  __typename: "RaceHierarchy",
                  race: {
                    __typename: "Race",
                    urn: "ppb:race:30355179.1430",
                    startTime: "2021-03-16T14:30:00.000Z",
                    raceId: "30355179.1430",
                    name: "Festival Handicap Chase",
                    meeting: {
                      __typename: "Meeting",
                      urn: "ppb:meeting:30355179",
                      name: "Cheltenham 16th Mar",
                      meetingId: "30355179",
                      country: "GB",
                      countryFlag: {
                        small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                        medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                        large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                      },
                      venue: "Cheltenham",
                      date: "2021-03-16T13:20:00.000Z",
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
                    urn: "ppb:meeting:30355179",
                    name: "Cheltenham 16th Mar",
                    meetingId: "30355179",
                    country: "GB",
                    countryFlag: {
                      small: "https://sca.cdnppb.net/Assets/logo/small/5701.png",
                      medium: "https://sca.cdnppb.net/Assets/logo/medium/5701.png",
                      large: "https://sca.cdnppb.net/Assets/logo/big/5701.png",
                    },
                    venue: "Cheltenham",
                    date: "2021-03-16T13:20:00.000Z",
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
                    runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/2542448`,
                    name: "7 Places",
                    selectionId: 2542448,
                    handicap: 0,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/2542449`,
                    name: "7 Places",
                    selectionId: 2542449,
                    handicap: 0,
                  },
                ],

                isOddsboostMarketType: false,
              },
              runners: [
                { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/2542448` },
                { runnerURN: `ppb:sbkRunner:${OTHER_SPORTSBOOK_MARKET_ID}/2542449` },
              ],
            },
          },
          numberOfRunnersToDisplay: null,
          runnerViewLinks: [
            {
              runnerUrn: "ppb:sbkRunner:924.257358354/13764961",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:924.257358354/13764961/0",
            },
            {
              runnerUrn: "ppb:sbkRunner:924.257358354/13764962",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:924.257358354/13764962/0",
            },
          ],
        },
      },
    ],
  },
  partials: {
    edges: [
      {
        name: "2 Places",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:924.257358352",
        },
      },
      {
        name: "3 Places",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:924.257358353",
        },
      },
      {
        name: "4 Places",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:correctScore:924.1|5",
        },
      },
      {
        name: "5 Places",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:924.257358354",
        },
      },
      {
        name: "6 Places",
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:924.257358354",
        },
      },
      {
        name: "7 Places",
        node: {
          __typename: "MarketCard",
          urn: `ppb:tbd:card:market:${OTHER_SPORTSBOOK_MARKET_ID}`,
        },
      },
    ],
  },
};

const BFF_HR_PAGE_MOCK = {
  __typename: "GenericView",
  urn: `ppb:tbd:view:sport:7`,
  url: "Not Implemented",
  edges: [
    {
      node: {
        __typename: "RaceMarketCard",
        numberOfRunners: 6,
        urn: "ppb:tbd:card:raceMarket:7|30355179.1430",
        raceViewLink: {
          viewUrn: "ppb:tbd:view:race:7|30355179.1430",
          viewUrl: "",
        },
        title: "Win",
        race: {
          __typename: "Race",
          urn: "ppb:race:30355179.1430",
          startTime: "2020-11-13T14:40:00",
          name: "14:40 Aintree",
          details: {
            distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
            going: "GOOD_FIRM",
            status: "GOING_DOWN",
            numberOfRunners: 14,
          },
          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30184830",
            name: "Wind 13th Jul",
            country: "GB",
            countryFlag: {
              small: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
            },
            venue: "Aintree",
          },
        },
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.234263186",
              name: "1m2f Nov Stks",
              marketType: "WIN",
              hierarchy: {
                __typename: "RaceHierarchy",
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30355179.1430",
                  startTime: "2020-11-13T14:40:00",
                  name: "14:40 Aintree",
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:30184830",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: {
                      small: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
                    },
                    venue: "Aintree",
                  },
                },
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:30184830",
                  name: "Wind 13th Jul",
                  country: "GB",
                  countryFlag: {
                    small: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
                  },
                  venue: "Aintree",
                },
              },
              runners: sporstBookRunners,
            },
            runners: sporstBookRunners,
          },
        },
        numberOfRunnersToDisplay: 6,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceMarketCard",
        urn: "ppb:tbd:card:raceMarket:7|30355179.1430",
      },
    },
  ],
};

const BFF_RACE_VIEW_MOCK = {
  __typename: "RaceView",
  urn: "ppb:tbd:view:race:7|30355179.1430",
  url: "horse-racing/cheltenham-16th-mar/r-7%7C30355179.1430",
  title: "Cheltenham",
  canonicalUrl: "/exchange/plus/horse-racing/market/1.180590053",
  race: {
    urn: "ppb:race:30355179.1430",
    meeting: {
      urn: "30355179",
    },
  },
  edges: [
    {
      node: pebbleCardGroup,
    },
    {
      node: {
        ...pebbleCardGroup,
        urn: "ppb:tbd:card:pebbleCard:30355179.1630|PLACES",
        pebbleExpanded: false,
        selectedItemUrn: "ppb:tbd:card:market:924.257358352",
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleCard:30355179.1430|PLACES",
      },
    },
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleCard:30355179.1630|PLACES",
      },
    },
  ],
};

describe("Pebble Market Template", () => {
  describe("When the user is at a given screen and 2 pebblecardgroup are retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getSportsLayout(BFF_HR_PAGE_MOCK));
      const url = "horse-racing/s-7";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericScreenSO.element);
      // inside race homepage
      await browser.waitUntilDisplayed(raceMarketCardSO.meetingInfo);
      await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK));
      await raceMarketCardSO.detailsContainer.click();

      // inside race page with pebble card group
      await browser.waitUntilDisplayed(firstPebbleCardGroup.element);
    });

    it("[PRPI-4223] The 1st pebblecardgroup should be visible with 'Places' title", async () => {
      expect(await firstPebbleCardGroup.title.getText()).toBe("Places");
    });

    it("[PRPI-4224] The 2nd pebblecardgroup should be visible with title", async () => {
      expect(await thirdPebbleCardGroup.title.isDisplayed()).toBe(true);
    });

    describe("And the pebbleExpanded is defined for the 2nd pebblecardgroup", () => {
      beforeAll(async () => {
        await browser.waitUntilNotDisplayed(thirdPebbleCardGroupCardSO.content);
      });

      it("[PRPI-2377] The 2nd pebblecardgroup should be collapsed by default", async () => {
        expect(await thirdPebbleCardGroupCardSO.content.isDisplayed()).toBe(false);
      });

      describe("When the user taps the market name 'Places' of the 2nd pebblecardgroup", () => {
        beforeAll(async () => {
          await thirdPebbleCardGroup.title.click();
          await swipeUp(0.5);
        });

        it("[PRPI-2378] The pebblecardgroup should expand", async () => {
          expect(await thirdPebbleCardGroupCardSO.content.isDisplayed()).toBe(true);
        });

        it("[PRPI-2378] The 3 pebbles should be visible: '2 Places, 3 Places, 4 Places'", async () => {
          expect(await thirdPebbleCardGroupPebbles.pebbleListElements[0].getText()).toBe("2 Places");
          expect(await thirdPebbleCardGroupPebbles.pebbleListElements[1].getText()).toBe("3 Places");
          expect(await thirdPebbleCardGroupPebbles.pebbleListElements[2].getText()).toBe("4 Places");
        });
      });
    });

    describe("When the user taps the 3rd pebble (4 Places) and SBK tab for the 1st pebblecardgroup", () => {
      beforeAll(async () => {
        await thirdPebbleCardGroup.title.click();
        await swipeDownElement(firstPebbleCardGroup.element);
        await browser.waitUntilDisplayed(fourPlacesPebbleSO);
        await fourPlacesPebbleSO.click();
        await browser.waitUntilDisplayed(firstPebbleCardGroup.title);
      });

      it("[PRPI-2379] The market screen should be visible with title 'Places'", async () => {
        expect(await firstPebbleCardGroup.title.getText()).toBe("Places");
      });

      it("[PRPI-2380] The selected pebble should be '4 Places'", async () => {
        expect(await fourPlacesPebbleSO.getText()).toBe("4 Places");
      });

      it("[PRPI-2381] The content should be a Correct Score Card", async () => {
        expect(await correctScoreCard.element.isDisplayed()).toBe(true);
      });

      describe("When user scrolls to last pebble", () => {
        beforeAll(async () => {
          await swipeLeftElement(pebbleListSO.element);
          await browser.waitUntilDisplayed(lastPebbleSO);
        });

        it("[PRPI-2382] The last pebble should be displayed", async () => {
          expect(await lastPebbleSO.isDisplayed()).toBe(true);
        });

        describe("When user taps on last pebble", () => {
          beforeAll(async () => {
            await lastPebbleSO.click();
            await browser.waitUntilEquals(firstRunnerSO.element, "7 Places");
          });

          it("[PRPI-2383] The correct sportsbook market should be displayed", async () => {
            expect(await firstRunnerSO.element.getText()).toBe("7 Places");
          });
        });
      });
    });
  });
});
