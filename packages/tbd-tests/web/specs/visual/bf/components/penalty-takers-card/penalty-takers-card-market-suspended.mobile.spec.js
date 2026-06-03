const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getEventLayout, getMarkets, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { PenaltyTakersCardPO, SportsbookBetButtonPO } = require("../../../../../page-objects");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getCustomerBehaviourService } = require("../../../../../mock-essentials/controllers/cbs/cbs-controller");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const penaltyTakersCardPO = new PenaltyTakersCardPO();

const MODULE_NAME = "penalty_takers_card_market_suspended";

const EVENT_ID = "35497448";

const BFF_PENALTY_TAKERS_CARD_MOCK = {
  __typename: "PenaltyTakersCard",
  urn: "ppb:tbd:card:penaltyTakers:acO6QhQAAF2E2RnN/e/35497448",
  penaltyTakersCardTitle: {
    name: "Penalties Taken",
    __typename: "DisplayNameTitle",
  },
  penaltyTakersCardSubtitle: {
    name: "Select a player and where he will score or miss",
    __typename: "DisplayNameTitle",
  },
  penaltyTakersCardFooter: {
    name: "We allow a 5% margin between goal quadrants to account for goals scored on section boundaries.",
    __typename: "DisplayNameTitle",
  },
  event: {
    __typename: "SportsEvent",
    urn: "ppb:event:35497448",
    eventId: 35497448,
    name: "Paris St-G v Bayern Munich",
    openDate: "2026-04-28T19:00:00.000Z",
    competition: {
      __typename: "Competition",
      urn: "ppb:competition:228",
      name: "UEFA Champions League",
      competitionId: 228,
      sport: {
        __typename: "Sport",
        urn: "ppb:eventType:1",
        name: "Football",
        shortName: null,
        sportId: 1,
      },
      logo: {},
      country: {
        urn: "",
        code: "",
        flag: {
          vector: "",
        },
      },
    },
  },
  penaltyTakers: [
    {
      player: {
        __typename: "FootballPlayerFixtureContext",
        urn: "ppb:tbd:footballplayer:fixture:2960|35497448",
        player: {
          id: "2960",
          name: "Harry Kane",
          __typename: "FootballPlayerFixture",
        },
        team: {
          jerseys: [
            {
              url: "http://example.test.com/mockedImage/image.png",
              __typename: "Jerseys",
            },
            {
              url: "http://example.test.com/mockedImage/image.png",
              __typename: "Jerseys",
            },
          ],

          __typename: "FootballTeam",
        },
      },
      toScore: {
        topLeft: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        topCenter: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        topRight: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomLeft: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomCenter: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomRight: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        __typename: "ToScorePenalty",
      },
      toMiss: {
        leftPostMiss: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        skyrocketCrossbar: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        rightPostMiss: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        leftSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        centerSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        rightSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                numerator: 9,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        __typename: "ToMissPenalty",
      },
      __typename: "PenaltyTaker",
    },
    {
      player: {
        __typename: "FootballPlayerFixtureContext",
        urn: "ppb:tbd:footballplayer:fixture:80070|35497448",
        player: {
          id: "80070",
          name: "Khvicha Kvaratskhelia",
          __typename: "FootballPlayerFixture",
        },
        team: {
          jerseys: [
            {
              url: "http://example.test.com/mockedImage/image.png",
              __typename: "Jerseys",
            },
            {
              url: "http://example.test.com/mockedImage/image.png",
              __typename: "Jerseys",
            },
          ],

          __typename: "FootballTeam",
        },
      },
      toScore: {
        topLeft: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        topCenter: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        topRight: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomLeft: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomCenter: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomRight: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        __typename: "ToScorePenalty",
      },
      toMiss: {
        leftPostMiss: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        skyrocketCrossbar: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        rightPostMiss: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        leftSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        centerSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        rightSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                numerator: 13,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        __typename: "ToMissPenalty",
      },
      __typename: "PenaltyTaker",
    },
    {
      player: {
        __typename: "FootballPlayerFixtureContext",
        urn: "ppb:tbd:footballplayer:fixture:70271|35497448",
        player: {
          id: "70271",
          name: "Luis Diaz",
          __typename: "FootballPlayerFixture",
        },
        team: {
          jerseys: [
            {
              url: "http://example.test.com/mockedImage/image.png",
              __typename: "Jerseys",
            },
            {
              url: "http://example.test.com/mockedImage/image.png",
              __typename: "Jerseys",
            },
          ],

          __typename: "FootballTeam",
        },
      },
      toScore: {
        topLeft: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        topCenter: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        topRight: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomLeft: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomCenter: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomRight: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        __typename: "ToScorePenalty",
      },
      toMiss: {
        leftPostMiss: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        skyrocketCrossbar: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        rightPostMiss: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        leftSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        centerSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        rightSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          resultType: "AWAY",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                numerator: 7,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        __typename: "ToMissPenalty",
      },
      __typename: "PenaltyTaker",
    },
    {
      player: {
        __typename: "FootballPlayerFixtureContext",
        urn: "ppb:tbd:footballplayer:fixture:89739|35497448",
        player: {
          id: "89739",
          name: "Vitinha",
          __typename: "FootballPlayerFixture",
        },
        team: {
          jerseys: [
            {
              url: "http://example.test.com/mockedImage/image.png",
              __typename: "Jerseys",
            },
            {
              url: "http://example.test.com/mockedImage/image.png",
              __typename: "Jerseys",
            },
          ],

          __typename: "FootballTeam",
        },
      },
      toScore: {
        topLeft: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        topCenter: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        topRight: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomLeft: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomCenter: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomRight: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        __typename: "ToScorePenalty",
      },
      toMiss: {
        leftPostMiss: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        skyrocketCrossbar: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        rightPostMiss: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        leftSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        centerSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        rightSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                numerator: 16,
                denominator: 1,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        __typename: "ToMissPenalty",
      },
      __typename: "PenaltyTaker",
    },
    {
      player: {
        __typename: "FootballPlayerFixtureContext",
        urn: "ppb:tbd:footballplayer:fixture:124392|35497448",
        player: {
          id: "124392",
          name: "Desire Doue",
          __typename: "FootballPlayerFixture",
        },
        team: {
          jerseys: [
            {
              url: "http://example.test.com/mockedImage/image.png",
              __typename: "Jerseys",
            },
            {
              url: "http://example.test.com/mockedImage/image.png",
              __typename: "Jerseys",
            },
          ],

          __typename: "FootballTeam",
        },
      },
      toScore: {
        topLeft: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        topCenter: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        topRight: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomLeft: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomCenter: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        bottomRight: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        __typename: "ToScorePenalty",
      },
      toMiss: {
        leftPostMiss: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        skyrocketCrossbar: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        rightPostMiss: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        leftSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        centerSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        rightSave: {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          resultType: "HOME",
          market: {
            urn: "ppb:sbkMarket:930.362534228",
            name: "1st Goalscorer",
            liveData: {
              urn: "ppb:sbkMarket:930.362534228",
              sportsbookMarketStatus: "OPEN",
              __typename: "SportsbookMarketLiveData",
            },
            __typename: "SportsbookMarket",
          },
          runnerLiveData: {
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            runnerStatus: "ACTIVE",
            odds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                numerator: 15,
                denominator: 2,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            __typename: "SportsbookRunnerLiveData",
          },
        },
        __typename: "ToMissPenalty",
      },
      __typename: "PenaltyTaker",
    },
  ],
};

const bffResponse = {
  data: {
    View: {
      __typename: "EventView",
      urn: "ppb:tbd:view:event:35497448",
      url: "football/uefa-champions-league/paris-st-g-v-bayern-munich/e-35497448",
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:35497448",
        eventId: 35497448,
        name: "Paris St-G v Bayern Munich",
        openDate: "2026-04-28T19:00:00.000Z",
        competition: {
          __typename: "Competition",
          urn: "ppb:competition:228",
          name: "UEFA Champions League",
          competitionId: 228,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            shortName: null,
            sportId: 1,
          },
          logo: {},
          country: {
            urn: "",
            code: "",
            flag: {
              vector: "",
            },
          },
        },
      },
      leftSidebar: {
        __typename: "LeftSidebar",
        items: {
          edges: [],
        },
        pageInfo: null,
      },
      items: {
        pageInfo: {
          nextPageCursor: "TUFUQ0hfT0REUyxDT1JSRUNUX1NDT1JFLE9WRVJfVU5ERVJfMDUsT1ZFUl9VTkRFUl8xNQ==",
        },
        edges: [
          {
            node: BFF_PENALTY_TAKERS_CARD_MOCK,
          },
        ],
      },
      partialItems: {
        pageInfo: null,
        edges: [
          {
            node: {
              __typename: "PenaltyTakersCard",
              urn: "ppb:tbd:card:penaltyTakers:acO6QhQAAF2E2RnN/e/35497448",
            },
          },
        ],
      },
      bottomBar: {
        __typename: "BottomBar",
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
              viewUrl: "browse/b-sports",
            },
          },
          {
            tileType: "MY_BETS",
            viewLink: {
              viewUrn: "ppb:tbd:view:myBets:open",
              viewUrl: "mybets/mybets-open",
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

        hasProductSwitcher: false,
      },
    },
  },
};

const BFF_FETCH_CARDS_MOCK = {
  cards: [BFF_PENALTY_TAKERS_CARD_MOCK],
};

const GET_MARKETS_MOCK = {
  markets: [
    {
      __typename: "SportsbookMarket",
      urn: "ppb:sbkMarket:930.362534228",
      name: "1st Goalscorer",
      marketType: "FIRST_GOAL_SCORER",
      marketTypeName: null,
      bettingType: "ODDS",
      liveData: {
        inplay: false,
        turnInPlayEnabled: true,
        runners: [
          {
            __typename: "SportsbookRunnerLiveData",
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/43172153",
            marketURN: "ppb:sbkMarket:930.362534228",
            runnerURN: "ppb:sbkRunner:930.362534228/43172153",
            selectionId: 43172153,
            runnerStatus: "ACTIVE",
            handicap: 0,
            odds: {
              decimal: 8.5,
              fractional: {
                denominator: 2,
                numerator: 15,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8.5,
              fractional: {
                denominator: 2,
                numerator: 15,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
          },
          {
            __typename: "SportsbookRunnerLiveData",
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/23120360",
            marketURN: "ppb:sbkMarket:930.362534228",
            runnerURN: "ppb:sbkRunner:930.362534228/23120360",
            selectionId: 23120360,
            runnerStatus: "ACTIVE",
            handicap: 0,
            odds: {
              decimal: 7.5,
              fractional: {
                denominator: 2,
                numerator: 13,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 7.5,
              fractional: {
                denominator: 2,
                numerator: 13,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
          },
          {
            __typename: "SportsbookRunnerLiveData",
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/7973582",
            marketURN: "ppb:sbkMarket:930.362534228",
            runnerURN: "ppb:sbkRunner:930.362534228/7973582",
            selectionId: 7973582,
            runnerStatus: "ACTIVE",
            handicap: 0,
            odds: {
              decimal: 17,
              fractional: {
                denominator: 1,
                numerator: 16,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 17,
              fractional: {
                denominator: 1,
                numerator: 16,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
          },
          {
            __typename: "SportsbookRunnerLiveData",
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/14843951",
            marketURN: "ppb:sbkMarket:930.362534228",
            runnerURN: "ppb:sbkRunner:930.362534228/14843951",
            selectionId: 14843951,
            runnerStatus: "ACTIVE",
            handicap: 0,
            odds: {
              decimal: 5.5,
              fractional: {
                denominator: 2,
                numerator: 9,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 5.5,
              fractional: {
                denominator: 2,
                numerator: 9,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
          },
          {
            __typename: "SportsbookRunnerLiveData",
            urn: "ppb:tbd:sbkRunnerLiveData:930.362534228/20517689",
            marketURN: "ppb:sbkMarket:930.362534228",
            runnerURN: "ppb:sbkRunner:930.362534228/20517689",
            selectionId: 20517689,
            runnerStatus: "ACTIVE",
            handicap: 0,
            odds: {
              decimal: 8,
              fractional: {
                denominator: 1,
                numerator: 7,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
            displayOdds: {
              decimal: 8,
              fractional: {
                denominator: 1,
                numerator: 7,
                __typename: "FractionalOdds",
              },
              __typename: "SportsbookOdds",
            },
          },
        ],

        __typename: "SportsbookMarketLiveData",
      },
      hierarchy: {
        __typename: "EventCompetitionHierarchy",
        sportevent: {
          __typename: "SportsEvent",
          urn: "ppb:event:35497448",
          eventId: 35497448,
          name: "Paris St-G v Bayern Munich",
          openDate: "2026-04-28T19:00:00.000Z",
          competition: {
            __typename: "Competition",
            urn: "ppb:competition:228",
            name: "UEFA Champions League",
            competitionId: 228,
            sport: {
              __typename: "Sport",
              urn: "ppb:eventType:1",
              name: "Football",
              sportId: 1,
            },
          },
        },
        competition: {
          __typename: "Competition",
          urn: "ppb:competition:228",
          name: "UEFA Champions League",
          competitionId: 228,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            sportId: 1,
          },
        },
      },
      sport: {
        __typename: "Sport",
        urn: "ppb:eventType:1",
        name: "Football",
        sportId: 1,
      },
      runners: [
        {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/43172153",
          name: "Desire Doue",
          selectionId: 43172153,
          handicap: 0,
          resultType: "HOME",
        },
        {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/23120360",
          name: "Khvicha Kvaratskhelia",
          selectionId: 23120360,
          handicap: 0,
          resultType: "HOME",
        },
        {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/7973582",
          name: "Vitinha",
          selectionId: 7973582,
          handicap: 0,
          resultType: "HOME",
        },
        {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/14843951",
          name: "Harry Kane",
          selectionId: 14843951,
          handicap: 0,
          resultType: "AWAY",
        },
        {
          __typename: "Runner",
          runnerURN: "ppb:sbkRunner:930.362534228/20517689",
          name: "Luis Diaz",
          selectionId: 20517689,
          handicap: 0,
          resultType: "AWAY",
        },
      ],

      isOddsboostMarketType: false,
      isSuperSub: true,
      isAccaFreezeEligible: false,
    },
  ],
};

const SMP_MOCK_SUSPENDED = {
  markets: [
    {
      marketId: "930.362534228",
      marketStatus: "SUSPENDED",
      runnerDetails: [
        {
          selectionId: 14843951,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.5 },
          },
          runnerStatus: "SUSPENDED",
        },
        {
          selectionId: 23120360,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 7.5 },
          },
          runnerStatus: "SUSPENDED",
        },
        {
          selectionId: 20517689,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 8 },
          },
          runnerStatus: "SUSPENDED",
        },
        {
          selectionId: 7973582,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 17 },
          },
          runnerStatus: "SUSPENDED",
        },
        {
          selectionId: 43172153,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 8.5 },
          },
          runnerStatus: "SUSPENDED",
        },
      ],
    },
  ],
};

const SUCCESSFUL_WAS_REQUEST = [{ walletName: "MAIN", amount: "123" }];

function responseToTemplate(json) {
  return {
    urn: json.data.View.urn,
    url: json.data.View.url,
    sportevent: json.data.View.sportevent,
    edges: json.data.View.items.edges,
    partialEdges: json.data.View.partialItems.edges,
  };
}

const BFF_MOCK = responseToTemplate(bffResponse);

describe("Penalty Takers Card — market suspended", () => {
  describe("Given I'm on an football event page", () => {
    describe("And the market becomes suspended", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
        await mockService.mockFonts(getMockFonts());
        await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
        await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));
        await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_SUSPENDED));
        await mockService.mockHttpRequest(getCardResults(BFF_FETCH_CARDS_MOCK));
        await mockService.mockHttpRequest(getWallets(SUCCESSFUL_WAS_REQUEST));
        await mockService.mockHttpRequest(getCustomerBehaviourService());

        await browser.url(routes.getEventViewUrl(EVENT_ID));
        await browser.waitUntilDisplayed(penaltyTakersCardPO.element);

        const toScoreTopLeftSportsbookBetButtonPO = new SportsbookBetButtonPO(penaltyTakersCardPO.toScoreMarketTopLeft);
        await browser.waitUntilEquals(toScoreTopLeftSportsbookBetButtonPO.odd, "-");

        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-11902]_then_the_betting_opportunity_is_blocked`);
      });

      it("[PRPI-11902]_then_the_betting_opportunity_is_blocked", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-11902]_then_the_betting_opportunity_is_blocked`)).toBe(
          0,
        );
      });
    });
  });
});
