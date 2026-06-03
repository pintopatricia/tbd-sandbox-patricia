const { SportPagePO, PebbleListPO, CardPO } = require("../../../../../page-objects");
const { getRaceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MarketExtendedCardPO = require("@ppb/tbd-shared/components/MarketExtendedCard/MarketExtendedCard.po");
const PebbleCardGroupPO = require("@ppb/tbd-shared/components/PebbleCardGroup/PebbleCardGroup.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();

const firstPebbleCardGroup = new PebbleCardGroupPO(sportPagePO.pebbleCardGroups[0]);
const secondPebbleCardGroup = new PebbleCardGroupPO(sportPagePO.pebbleCardGroups[1]);
const thirdPebbleCardGroup = new PebbleCardGroupPO(sportPagePO.pebbleCardGroups[2]);
const fourthPebbleCardGroup = new PebbleCardGroupPO(sportPagePO.pebbleCardGroups[3]);
const thirdPebbleCardGroupCardPO = new CardPO(thirdPebbleCardGroup.element);
const thirdPebbleCardGroupPebbles = new PebbleListPO(thirdPebbleCardGroup.element);
const fourthPebbleCardGroupPebbles = new PebbleListPO(fourthPebbleCardGroup.element);
const marketExtendedCardPO = new MarketExtendedCardPO();
const mockService = new MockService();

const createRunners = () =>
  [
    "Each Team to Have 2+ Corners in Each Half",
    "Both teams to score & 3+ corners for each team & 2+ cards for each team",
    "Each Team 2+ Shots on Target in each Half",
    "Leicester to Win, Leicester Most Shots On Target and Leicester Most Corners",
    "Leicester to Win; Leicester Most Corners and Leeds Most Cards",
    "Leeds to Have 2 or More Cards in Each Half",
  ].map((name, i) => ({
    __typename: "Runner",
    runnerURN: `ppb:sbkRunner:924.1/${i + 1}`,
    name,
    selectionId: i + 1,
    handicap: 0,
    resultType: null,
  }));

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
                  runnerURN: "ppb:sbkRunner:924.257358352/13764961",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.257358352/13764962",
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
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.257358353",
                name: "Winning Distance 3-Way",
                marketType: "WINNING_DISTANCE",
                marketTypeName: null,
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
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.257358353/13764961",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.257358353/13764962",
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
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:924.257358354",
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
                  runnerURN: "ppb:sbkRunner:924.257358354/13764961",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.257358354/13764962",
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
          urn: "ppb:tbd:card:market:924.257358354",
        },
      },
    ],
  },
};

const BFF_RACE_VIEW_MOCK = {
  __typename: "RaceView",
  urn: "ppb:tbd:view:race:7|30355179.1430",
  url: "horse-racing/cheltenham-16th-mar/r-7%7C30355179.1430",
  title: "Cheltenham",
  canonicalUrl: "/exchange/plus/horse-racing/market/1.180590053",
  race: {
    urn: "ppb:tbd:race:7|30355179.1430",
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
        urn: "ppb:tbd:card:pebbleCard:30355179.1530|PLACES",
        pebbleCardGroupTitle: null,
        selectedItemUrn: "ppb:tbd:card:market:924.257358354",
      },
    },
    {
      node: {
        ...pebbleCardGroup,
        urn: "ppb:tbd:card:pebbleCard:30355179.1630|PLACES",
        pebbleExpanded: false,
        selectedItemUrn: "ppb:tbd:card:market:924.257358354",
      },
    },
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:batista/e/1",
        pebbleCardGroupTitle: { translated: "OddsOnThat" },
        selectedItemUrn: `ppb:tbd:card:marketExtended:924.1|4`,
        full: {
          edges: [
            {
              name: "OddsOnThat",
              node: {
                __typename: "MarketExtendedCard",
                urn: `ppb:tbd:card:marketExtended:924.1|4`,
                numberOfItemsToDisplay: 4,
                name: "OddsOnThat - Featured",
                marketType: "PRE_MATCH_COMBO_-_FEATURED",
                noLiveData: true,
                displayRunners: {
                  exchange: null,
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
                      name: "OddsOnThat - Featured",
                      marketType: "PRE_MATCH_COMBO_-_FEATURED",
                      noLiveData: true,
                      runners: createRunners(),
                    },
                    runners: createRunners(),
                  },
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "OddsOnThat",
              node: {
                __typename: "MarketExtendedCard",
                urn: `ppb:tbd:card:marketExtended:924.1|4`,
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
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleCard:30355179.1430|PLACES",
      },
    },
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleCard:30355179.1530|PLACES",
      },
    },
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:card:pebbleCard:30355179.1630|PLACES",
      },
    },
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:batista/e/1",
      },
    },
  ],

  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:generic:home",
          viewUrl: "",
        },
      },
      {
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: "browse/browse:sports",
        },
      },
      {
        tileType: "MY_BETS",
        viewLink: {
          viewUrn: "ppb:tbd:view:myBets:open",
          viewUrl: "mybets/myBets-open",
        },
      },
      {
        tileType: "GAMING",
        viewLink: {
          viewUrn: "ppb:tbd:view:gaming:1",
          viewUrl: "casino/gm-1",
        },
      },
    ],
  },
};

describe("Pebble Market Template", () => {
  describe("When the user is at a given page and 3 pebblecardgroup are retrieved", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_RACE_VIEW_MOCK.urn, {
          currentUrl: routes.getRaceViewUrl("7", "7", "30355179.1430"),
        }),
      );
      await mockService.mockHttpRequest(getRaceLayout(BFF_RACE_VIEW_MOCK));
      await browser.url(routes.getRaceViewUrl("7", "7", "30355179.1430"));
      await browser.waitUntilDisplayed(firstPebbleCardGroup.element);
    });

    it("[PRPI-6208] The 1st pebblecardgroup should be visible with 'Places' title", async () => {
      expect(await firstPebbleCardGroup.collapseTitle.getText()).toBe("Places");
    });

    it("[PRPI-6209] The 2nd pebblecardgroup should be visible without title", async () => {
      expect(await secondPebbleCardGroup.collapseTitle.isDisplayed()).toBe(false);
    });

    describe("And the pebbleExpanded is defined for the 3rd pebblecardgroup", () => {
      it("[PRPI-6210] The 3rd pebblecardgroup should be collapsed by default", async () => {
        expect(await thirdPebbleCardGroupCardPO.content.isDisplayed()).toBe(false);
      });

      describe("When the user taps the market name 'Places' of the 3rd pebblecardgrpoup", () => {
        beforeAll(async () => {
          await thirdPebbleCardGroup.collapseTitle.waitForClickable();
          await thirdPebbleCardGroup.collapseTitle.click();
        });

        it("[PRPI-6211] The pebblecardgroup should expand", async () => {
          expect(await thirdPebbleCardGroupCardPO.content.isDisplayed()).toBe(true);
        });

        it("[PRPI-6212] The 3 pebbles should be visible: '2 Places, 3 Places, 4 Places'", async () => {
          expect(await thirdPebbleCardGroupPebbles.pebbles[0].getText()).toBe("2 Places");
          expect(await thirdPebbleCardGroupPebbles.pebbles[1].getText()).toBe("3 Places");
          expect(await thirdPebbleCardGroupPebbles.pebbles[2].getText()).toBe("4 Places");
        });
      });
    });

    describe("And the pebbleExpanded is defined for the 4th pebblecardgroup", () => {
      beforeAll(async () => {
        await thirdPebbleCardGroup.collapseTitle.click();
        await browser.waitUntilNotDisplayed(thirdPebbleCardGroupCardPO.content);
      });
      it("[PRPI-6213] The 4th pebblecardgroup should be displayed", async () => {
        expect(await fourthPebbleCardGroupPebbles.element.isDisplayed()).toBe(true);
      });

      it("[PRPI-6214] The 4th pebblecardgroup should not display any pebble", async () => {
        expect(await fourthPebbleCardGroupPebbles.pebbles.length).toBe(0);
      });

      it("[PRPI-6215] The market (MarketExtendedCard) should be displayed", async () => {
        expect(await marketExtendedCardPO.element.isDisplayed()).toBe(true);
      });
    });
  });
});
