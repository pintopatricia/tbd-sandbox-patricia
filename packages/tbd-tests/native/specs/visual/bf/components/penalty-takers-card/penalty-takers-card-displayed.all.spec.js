const { getEventLayout, getHomeLayoutWithViewLink, getMarkets } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const {
  PenaltyTakersCardSO,
  SnackbarSO,
  SegmentedControlSO,
  SportsbookBetButtonSO,
} = require("../../../../../screen-objects");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { swipeLeftElement } = require("../../../../../helpers/gestures");

const penaltyTakersCardSO = new PenaltyTakersCardSO();
const snackbarSO = new SnackbarSO();
const segmentedControlSO = new SegmentedControlSO();

const mockService = new MockService();

const MODULE_NAME = "penalty_takers_card";

const EVENT_ID = "35497448";

const BFF_PENALTY_TAKERS_CARD_MOCK = {
  __typename: "PenaltyTakersCard",
  urn: `ppb:tbd:card:penaltyTakers:acO6QhQAAF2E2RnN/e/${EVENT_ID}`,
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
    urn: `ppb:event:${EVENT_ID}`,
    eventId: EVENT_ID,
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
        urn: `ppb:tbd:footballplayer:fixture:2960|${EVENT_ID}`,
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

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  url: `/football/friendly-matches/rsm-hodonin-v-h-slavia-kromeriz/e-${EVENT_ID}`,
  sportevent: {
    urn: `ppb:tbd:event:${EVENT_ID}`,
    name: "Paris St-G v Bayern Munich",
  },
  edges: [
    {
      node: BFF_PENALTY_TAKERS_CARD_MOCK,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "PenaltyTakersCard",
        urn: `ppb:tbd:card:penaltyTakers:acO6QhQAAF2E2RnN/e/${EVENT_ID}`,
      },
    },
  ],
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

const SMP_MOCK = {
  markets: [
    {
      marketId: "930.362534228",
      runnerDetails: [
        {
          selectionId: 14843951,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.5 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 23120360,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 7.5 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 20517689,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 8 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 7973582,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 17 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 43172153,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 8.5 },
          },
          runnerStatus: "ACTIVE",
        },
      ],
    },
  ],
};

const SMP_MOCK_NO_ODDS = {
  markets: [
    {
      marketId: "930.362534228",
      marketStatus: "CLOSED",
      runnerDetails: [
        {
          selectionId: 14843951,
          noOdds: true,
        },
        {
          selectionId: 23120360,
          noOdds: true,
        },
        {
          selectionId: 20517689,
          noOdds: true,
        },
        {
          selectionId: 7973582,
          noOdds: true,
        },
        {
          selectionId: 43172153,
          noOdds: true,
        },
      ],
    },
  ],
};

describe("Penalty Takers Card in Event Page", () => {
  describe("When the user goes to a football event view", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarkets(GET_MARKETS_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));

      const HOME_VIEW_LINK = getStartViewLink(
        `/football/friendly-matches/rsm-hodonin-v-h-slavia-kromeriz/e-${EVENT_ID}`,
      );
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(snackbarSO.element);
      await snackbarSO.closeButton.click();
    });

    describe("and there is a Penalty Takers Card", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(penaltyTakersCardSO.element);
        await browser.pause(2000); // wait for app to stabilise

        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-11981]_should_display_penalty_takers_card`);
      });

      it("[PRPI-11981]_should_display_penalty_takers_card", async () => {
        expect(
          (await browser.compareScreen(`${MODULE_NAME}_[PRPI-11981]_should_display_penalty_takers_card`))
            .misMatchPercentage,
        ).toEqual(0);
      });
    });

    describe("and the user clicks on the SegmentedControl to change to the To Miss tab", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(segmentedControlSO.options[1]);
        await segmentedControlSO.options[1].click();

        await browser.pause(2000); // wait for app to stabilise

        await browser.waitUntilEquals(segmentedControlSO.selectedOptionText, "To Miss");

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-11982]_should_display_penalty_takers_card_to_miss_tab`,
        );
      });

      it("[PRPI-11982]_should_display_penalty_takers_card_to_miss_tab", async () => {
        expect(
          (await browser.compareScreen(`${MODULE_NAME}_[PRPI-11982]_should_display_penalty_takers_card_to_miss_tab`))
            .misMatchPercentage,
        ).toEqual(0);
      });

      describe("and the user swipes on the carousel", () => {
        beforeAll(async () => {
          await swipeLeftElement(penaltyTakersCardSO.playerCarouselSlides[2]);
          await browser.pause(2000); // wait for app to stabilise

          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-11983]_should_display_second_penalty_taker`);
        });

        it("[PRPI-11983]_should_display_second_penalty_taker", async () => {
          expect(
            (await browser.compareScreen(`${MODULE_NAME}_[PRPI-11983]_should_display_second_penalty_taker`))
              .misMatchPercentage,
          ).toEqual(0);
        });

        describe("and the market has no odds", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_NO_ODDS));

            const toMissLeftSaveSportsbookBetButtonSO = new SportsbookBetButtonSO(
              penaltyTakersCardSO.toMissMarketLeftSave,
            );

            await browser.waitUntilEquals(toMissLeftSaveSportsbookBetButtonSO.odd, "-");

            await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-11984]_should_display_no_odds_state`);
          });

          it("[PRPI-11984]_should_display_no_odds_state", async () => {
            expect(
              (await browser.compareScreen(`${MODULE_NAME}_[PRPI-11984]_should_display_no_odds_state`))
                .misMatchPercentage,
            ).toEqual(0);
          });
        });
      });
    });
  });
});
