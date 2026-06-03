const {
  AppPO,
  GenericPagePO,
  CardPO,
  HorseRacingRunnerPO,
  SportsbookMarketPO,
  MarketPromoPO,
  ScrollableSwimlanePO,
} = require("../../../../page-objects");
const RaceMarketCardPO = require("@ppb/tbd-shared/components/RaceMarketCard/RaceMarketCard.web.po");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;

const { getRaceLayout, getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const racePagePO = new GenericPagePO();
const cardPO = new CardPO();
const sportsbookMarketPO = new SportsbookMarketPO(cardPO.element);
const firstUnnamedFavourite = new HorseRacingRunnerPO(sportsbookMarketPO.horseRacingRunnerList[11]);
const firstPrimarySwimlanePO = new ScrollableSwimlanePO(racePagePO.scrollableSwimlanes[0]);
const secondRaceMarketCardPO = new RaceMarketCardPO(firstPrimarySwimlanePO.scrollItems[1]);

const mockService = new MockService();

const MODULE_NAME = "race_view";
const EVENT_TYPE_ID = 7;

const RACE_ID = "30264302.1755";
const MARKET_ID = "924.252091866";

const BFF_MOCK = {
  urn: "ppb:tbd:view:race:7|30264302.1755",
  title: "Kempton",
  race: {
    __typename: "Race",
    urn: "ppb:race:30264302.1755",
    startTime: "2021-02-03T17:55:00.000Z",
    name: "Handicap (Class 5)",
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:30264302",
      name: "Kemp  3rd Feb",
      country: "GB",
      venue: "Kempton",
      date: "2021-02-03T16:55:00.000Z",
    },
  },
  edges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:924.252091866/24000991/0",
        race: {
          __typename: "Race",
          urn: "ppb:race:30264302.1755",
          startTime: "2021-02-03T17:55:00.000Z",
          name: "Handicap (Class 5)",
          verdict:
            "In a very open fillies' handicap it may be worth taking a chance on northern-raider ICONIC BELLE, who shaped better than the result over a trip too far last time and is back on a favourable mark. Angel of Delight and Torbellino are others who could play a prominent role.",
          details: {
            distance: { miles: 1, furlongs: 2, yards: 220 },
            going: null,
            status: "DORMANT",
            type: "FLAT",
            country: "GB",
            countryFlag: {
              vector: null,
            },
          },
          runners: [
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30264302.1755/11374271",
              raceURN: "ppb:race:30264302.1755",
              rating123: 1,
              ratingStars: 5,
              selectionId: 11374271,
              rating: 65,
              comments:
                "Fourteen runs since last win in 2018 but is on a favourable mark and she shaped quite well over an unsuitable 2m at Newcastle last time. One to bear mind.",
              horse: {
                name: "ICONIC BELLE",
                sireName: "SIXTIES ICON",
                damName: "FIVE BELLS (IRE)",
                damSireName: "ROCK OF GIBRALTAR (IRE)",
                age: 7,
                color: "CHESTNUT",
                sex: "FILLY",
              },
              details: {
                jockeyName: "Kevin Stott",
                trainerName: "Philip Kirby",
                saddleCloth: "5",
                weight: { stones: "9-6" },
                equipmentDescription: null,
                silk: null,
                draw: 9,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30264302.1755/12041417",
              raceURN: "ppb:race:30264302.1755",
              rating123: 0,
              ratingStars: 3,
              selectionId: 12041417,
              rating: 60,
              comments:
                "Course winner. 15/2, best to ignore latest twelfth of 13 in handicap at Chelmsford, fading after being ridden more prominently than usual.",
              horse: {
                name: "SETTLE PETAL",
                sireName: "PEINTRE CELEBRE (USA)",
                damName: "SHALL WE DANCE",
                damSireName: "RAMBO DANCER (CAN)",
                age: 7,
                color: "BAY",
                sex: "FILLY",
              },
              details: {
                jockeyName: "Kieran Shoemark",
                trainerName: "Robyn Brisland",
                saddleCloth: "9",
                weight: { stones: "9-1" },
                equipmentDescription: null,
                silk: null,
                draw: 8,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30264302.1755/12443507",
              raceURN: "ppb:race:30264302.1755",
              rating123: 0,
              ratingStars: 0,
              selectionId: 12443507,
              rating: 61,
              comments: "NON RUNNER.",
              horse: {
                name: "VOI",
                sireName: "HOLY ROMAN EMPEROR (IRE)",
                damName: "BRIDE UNBRIDLED (IRE)",
                damSireName: "HURRICANE RUN (IRE)",
                age: 7,
                color: "BAY",
                sex: "MARE",
              },
              details: {
                jockeyName: "Non Runner",
                trainerName: "Conrad Allen",
                saddleCloth: "8",
                weight: { stones: "9-2" },
                equipmentDescription: "tongue strap",
                silk: null,
                draw: 10,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30264302.1755/12936312",
              raceURN: "ppb:race:30264302.1755",
              rating123: 0,
              ratingStars: 3,
              selectionId: 12936312,
              rating: 56,
              comments:
                "Latest win at Wolverhampton in December. 5/1, good second of 10 in handicap at this course (12f) 9 days ago.",
              horse: {
                name: "PLANSINA",
                sireName: "PLANTEUR (IRE)",
                damName: "SINA (GER)",
                damSireName: "TRANS ISLAND",
                age: 6,
                color: "BAY",
                sex: "FILLY",
              },
              details: {
                jockeyName: "David Probert",
                trainerName: "Adrian Wintle",
                saddleCloth: "11",
                weight: { stones: "8-11" },
                equipmentDescription: "hood",
                silk: null,
                draw: 5,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30264302.1755/20867982",
              raceURN: "ppb:race:30264302.1755",
              rating123: 0,
              ratingStars: 3,
              selectionId: 20867982,
              rating: 66,
              comments:
                "Fourteen runs since last win in 2019. 4/1, fourth of 6 in handicap at Lingfield (10f) 13 days ago, needing stiffer test. Enters calculations back up in trip.",
              horse: {
                name: "FILLES DE FLEUR",
                sireName: "GREGORIAN (IRE)",
                damName: "BIG MOZA",
                damSireName: "PASTORAL PURSUITS",
                age: 5,
                color: "UNKNOWN",
                sex: "FILLY",
              },
              details: {
                jockeyName: "Rhys Clutterbuck",
                trainerName: "Gary Moore",
                saddleCloth: "4",
                weight: { stones: "9-7" },
                equipmentDescription: null,
                silk: null,
                draw: 2,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30264302.1755/24495900",
              raceURN: "ppb:race:30264302.1755",
              rating123: 2,
              ratingStars: 4,
              selectionId: 24495900,
              rating: 69,
              comments:
                "7/2, good third of 10 in handicap at Lingfield (10f) 32 days ago. Not long with this yard. Likely to be in the shake-up.",
              horse: {
                name: "ANGEL OF DELIGHT (IRE)",
                sireName: "DARK ANGEL (IRE)",
                damName: "VENTURA MIST",
                damSireName: "PASTORAL PURSUITS",
                age: 4,
                color: "GREY",
                sex: "FILLY",
              },
              details: {
                jockeyName: "Daniel Muscutt",
                trainerName: "James Ferguson",
                saddleCloth: "3",
                weight: { stones: "9-9" },
                equipmentDescription: "blinkers and tongue strap",
                silk: null,
                draw: 1,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30264302.1755/24830530",
              raceURN: "ppb:race:30264302.1755",
              rating123: 0,
              ratingStars: 3,
              selectionId: 24830530,
              rating: 64,
              comments:
                "Another creditable effort this winter when third of 12 in handicap at Wolverhampton (9.5f, 15/2) 16 days ago. Can figure again.",
              horse: {
                name: "CITY ESCAPE (IRE)",
                sireName: "CITYSCAPE",
                damName: "LADY GABRIELLE (IRE)",
                damSireName: "DANSILI",
                age: 4,
                color: "BAY",
                sex: "FILLY",
              },
              details: {
                jockeyName: "William Humphrey",
                trainerName: "Sarah Humphrey",
                saddleCloth: "6",
                weight: { stones: "9-4" },
                equipmentDescription: null,
                silk: null,
                draw: 7,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30264302.1755/25267781",
              raceURN: "ppb:race:30264302.1755",
              rating123: 0,
              ratingStars: 2,
              selectionId: 25267781,
              rating: 69,
              comments: "No impact in 2 outings since joining this yard. Mark on the slide but need to see more.",
              horse: {
                name: "GOOD REASON",
                sireName: "DARK ANGEL (IRE)",
                damName: "SANDER CAMILLO (USA)",
                damSireName: "DIXIE UNION (USA)",
                age: 4,
                color: "GREY",
                sex: "FILLY",
              },
              details: {
                jockeyName: "Callum Shepherd",
                trainerName: "Rae Guest",
                saddleCloth: "2",
                weight: { stones: "9-9" },
                equipmentDescription: null,
                silk: null,
                draw: 3,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30264302.1755/25410685",
              raceURN: "ppb:race:30264302.1755",
              rating123: 3,
              ratingStars: 4,
              selectionId: 25410685,
              rating: 68,
              comments:
                "Eleven runs since last win in 2020. 11/8, second of 4 in handicap over C&D 7 days ago. Likely to be competitive again.",
              horse: {
                name: "TORBELLINO",
                sireName: "MAXIOS",
                damName: "TINY SMILE (IRE)",
                damSireName: "CELTIC SWING",
                age: 5,
                color: "BAY",
                sex: "FILLY",
              },
              details: {
                jockeyName: "Adam Kirby",
                trainerName: "John Best",
                saddleCloth: "1",
                weight: { stones: "9-9" },
                equipmentDescription: "hood",
                silk: null,
                draw: 6,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30264302.1755/26426214",
              raceURN: "ppb:race:30264302.1755",
              rating123: 0,
              ratingStars: 4,
              selectionId: 26426214,
              rating: 62,
              comments:
                "Winner at Wolverhampton in December. Good in frame efforts back there twice since. Ought to play a part under Hollie Doyle.",
              horse: {
                name: "BEAUTY STONE (IRE)",
                sireName: "AUSTRALIA",
                damName: "ZA'HARA (IRE)",
                damSireName: "RAVEN'S PASS (USA)",
                age: 4,
                color: "BAY",
                sex: "FILLY",
              },
              details: {
                jockeyName: "Hollie Doyle",
                trainerName: "Tom Ward",
                saddleCloth: "7",
                weight: { stones: "9-2" },
                equipmentDescription: "visor",
                silk: null,
                draw: 11,
              },
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30264302.1755/28601442",
              raceURN: "ppb:race:30264302.1755",
              rating123: 0,
              ratingStars: 3,
              selectionId: 28601442,
              rating: 61,
              comments:
                "Respectable fourth of 10 in handicap at Lingfield (10f) 7 days ago. Still early days for her with this stable. Yet another who can't be discounted.",
              horse: {
                name: "RUBY RED EMPRESS (IRE)",
                sireName: "HOLY ROMAN EMPEROR (IRE)",
                damName: "ROUGETTE",
                damSireName: "RED RANSOM (USA)",
                age: 4,
                color: "BAY",
                sex: "FILLY",
              },
              details: {
                jockeyName: "Ben Curtis",
                trainerName: "George Boughey",
                saddleCloth: "10",
                weight: { stones: "9-1" },
                equipmentDescription: null,
                silk: null,
                draw: 4,
              },
            },
          ],

          meeting: {
            __typename: "Meeting",
            urn: "ppb:meeting:30264302",
            name: "Kemp  3rd Feb",
            country: "GB",
            countryFlag: { vector: null },
            venue: "Kempton",
            date: "2021-02-03T16:55:00.000Z",
          },
        },
        numberOfRunners: 11,
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:924.252091866|15",
        cardTitle: "Win",
        viewLinks: [
          {
            viewUrn: "ppb:tbd:view:market:924.252091866",
            viewUrl: "horse-racing/kemp-3rd-feb/1m3f-hcap/r-924.252091866",
          },
          {
            viewUrn: "ppb:tbd:view:market:924.252091866",
            viewUrl: "horse-racing/kemp-3rd-feb/1m3f-hcap/r-924.252091866",
          },
        ],

        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: "ppb:sbkMarket:924.252091866",
              name: "1m3f Hcap",
              marketType: "WIN",
              marketTypeName: "Win",
              liveData: {
                inplay: false,
                turnInPlayEnabled: false,
                bspMarket: true,
              },
              sport: {
                __typename: "Sport",
                urn: `ppb:eventType:${EVENT_TYPE_ID}`,
                sportId: EVENT_TYPE_ID,
                name: "Horse Racing",
              },
              hierarchy: {
                __typename: "RaceHierarchy",
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30264302.1755",
                  startTime: "2021-02-03T17:55:00.000Z",
                  name: "Handicap (Class 5)",
                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:30264302",
                    name: "Kemp  3rd Feb",
                    country: "GB",
                    countryFlag: { vector: null },
                    venue: "Kempton",
                    date: "2021-02-03T16:55:00.000Z",
                  },
                },
                meeting: {
                  __typename: "Meeting",
                  urn: "ppb:meeting:30264302",
                  name: "Kemp  3rd Feb",
                  country: "GB",
                  countryFlag: { vector: null },
                  venue: "Kempton",
                  date: "2021-02-03T16:55:00.000Z",
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/28601442",
                  name: "Ruby Red Empress",
                  selectionId: 28601442,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/25410685",
                  name: "Torbellino",
                  selectionId: 25410685,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/24495900",
                  name: "Angel Of Delight",
                  selectionId: 24495900,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/24830530",
                  name: "City Escape",
                  selectionId: 24830530,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/12936312",
                  name: "Plansina",
                  selectionId: 12936312,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/26426214",
                  name: "Beauty Stone",
                  selectionId: 26426214,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/11374271",
                  name: "Iconic Belle",
                  selectionId: 11374271,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/20867982",
                  name: "Filles De Fleur",
                  selectionId: 20867982,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/25267781",
                  name: "Good Reason",
                  selectionId: 25267781,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/12041417",
                  name: "Settle Petal",
                  selectionId: 12041417,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/12443507",
                  name: "Voi",
                  selectionId: 12443507,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/10518227",
                  name: "Unnamed Favourite",
                  selectionId: 10518227,
                  handicap: 0,
                  resultType: null,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.252091866/10518230",
                  name: "Unnamed 2nd Favourite",
                  selectionId: 10518230,
                  handicap: 0,
                  resultType: null,
                },
              ],

              isOddsboostMarketType: false,
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.252091866/28601442" },
              { runnerURN: "ppb:sbkRunner:924.252091866/25410685" },
              { runnerURN: "ppb:sbkRunner:924.252091866/24495900" },
              { runnerURN: "ppb:sbkRunner:924.252091866/24830530" },
              { runnerURN: "ppb:sbkRunner:924.252091866/12936312" },
              { runnerURN: "ppb:sbkRunner:924.252091866/26426214" },
              { runnerURN: "ppb:sbkRunner:924.252091866/11374271" },
              { runnerURN: "ppb:sbkRunner:924.252091866/20867982" },
              { runnerURN: "ppb:sbkRunner:924.252091866/25267781" },
              { runnerURN: "ppb:sbkRunner:924.252091866/12041417" },
              { runnerURN: "ppb:sbkRunner:924.252091866/12443507" },
              { runnerURN: "ppb:sbkRunner:924.252091866/10518227" },
              { runnerURN: "ppb:sbkRunner:924.252091866/10518230" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceDetailsCard",
        urn: "ppb:tbd:card:raceDetails:924.252091866/24000991/0",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:924.252091866|15",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: 25410685,
          runnerOrder: 1,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5.0 },
              fractionalOdds: { numerator: 4, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 5.0 },
            fractionalDisplayOdds: { numerator: 4, denominator: 1 },
            americanDisplayOdds: { americanOdds: 400.0, americanOddsInt: 400 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 25267781,
          runnerOrder: 2,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 15.0 },
              fractionalOdds: { numerator: 14, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 15.0 },
            fractionalDisplayOdds: { numerator: 14, denominator: 1 },
            americanDisplayOdds: { americanOdds: 1400.0, americanOddsInt: 1400 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 15.2 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 15.3 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 15.4 },
            },
          ],

          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 24495900,
          runnerOrder: 3,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5.5 },
              fractionalOdds: { numerator: 9, denominator: 2 },
            },
            decimalDisplayOdds: { decimalOdds: 5.5 },
            fractionalDisplayOdds: { numerator: 9, denominator: 2 },
            americanDisplayOdds: { americanOdds: 450.0, americanOddsInt: 450 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 20867982,
          runnerOrder: 4,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 13.0 },
              fractionalOdds: { numerator: 12, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 13.0 },
            fractionalDisplayOdds: { numerator: 12, denominator: 1 },
            americanDisplayOdds: { americanOdds: 1200.0, americanOddsInt: 1200 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 11374271,
          runnerOrder: 5,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 15.0 },
              fractionalOdds: { numerator: 14, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 15.0 },
            fractionalDisplayOdds: { numerator: 14, denominator: 1 },
            americanDisplayOdds: { americanOdds: 1400.0, americanOddsInt: 1400 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 24830530,
          runnerOrder: 6,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 8.0 },
              fractionalOdds: { numerator: 7, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 8.0 },
            fractionalDisplayOdds: { numerator: 7, denominator: 1 },
            americanDisplayOdds: { americanOdds: 700.0, americanOddsInt: 700 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 26426214,
          runnerOrder: 7,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 12.0 },
              fractionalOdds: { numerator: 11, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 12.0 },
            fractionalDisplayOdds: { numerator: 11, denominator: 1 },
            americanDisplayOdds: { americanOdds: 1100.0, americanOddsInt: 1100 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 12443507,
          runnerOrder: 8,
          noOdds: true,
          handicap: 0.0,
          runnerStatus: "REMOVED",
        },
        {
          selectionId: 12041417,
          runnerOrder: 9,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 23.0 },
              fractionalOdds: { numerator: 22, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 23.0 },
            fractionalDisplayOdds: { numerator: 22, denominator: 1 },
            americanDisplayOdds: { americanOdds: 2200.0, americanOddsInt: 2200 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 23.2 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 23.3 },
            },
            {
              decimalDisplayOdds: { decimalOdds: 23.4 },
            },
          ],

          handicap: 0.0,
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 28601442,
          runnerOrder: 10,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 5.0 },
              fractionalOdds: { numerator: 4, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 5.0 },
            fractionalDisplayOdds: { numerator: 4, denominator: 1 },
            americanDisplayOdds: { americanOdds: 400.0, americanOddsInt: 400 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 12936312,
          runnerOrder: 11,
          runnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 8.0 },
              fractionalOdds: { numerator: 7, denominator: 1 },
            },
            decimalDisplayOdds: { decimalOdds: 8.0 },
            fractionalDisplayOdds: { numerator: 7, denominator: 1 },
            americanDisplayOdds: { americanOdds: 700.0, americanOddsInt: 700 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 10518227,
          runnerOrder: 98,
          noOdds: true,
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 10518230,
          noOdds: true,
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 327679,
          runnerOrder: 100,
          noOdds: true,
          runnerStatus: "REMOVED",
          runnerScope: "INPLAY",
        },
      ],
    },
  ],
};

const sporstBookRunnersBlurbs = [
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.1/1",
    name: "A",
    selectionId: 1,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.1/2",
    name: "B",
    selectionId: 2,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.1/3",
    name: "C",
    selectionId: 3,
    handicap: 0,
    resultType: null,
  },
];

const sporstBookRunnersTwoBlurbs = [
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.2/1",
    name: "D",
    selectionId: 1,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.2/2",
    name: "E",
    selectionId: 2,
    handicap: 0,
    resultType: null,
  },
  {
    __typename: "Runner",
    runnerURN: "ppb:sbkRunner:924.2/3",
    name: "F",
    selectionId: 3,
    handicap: 0,
    resultType: null,
  },
];

const BFF_VIEW_MOCK_BLURBS = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  title: "Horse Racing",
  edges: [
    {
      node: {
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s/7",
        cardGroupTitle: "Next Races",
        full: {
          edges: [
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
                numberOfRunners: 14,
                title: "Race with blurbs!",
                numberOfRunnersToDisplay: 3,
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.1",
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
                        race: {
                          __typename: "Race",
                          urn: "ppb:race:30061949.1335",
                          startTime: "2020-07-13T14:30:00Z",
                          name: "14:30 Windsor",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901908",
                            venue: "Windsor",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901908",
                          venue: "Windsor",
                        },
                      },
                      runners: sporstBookRunnersBlurbs,
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
                  urn: "ppb:race:30061949.1335",
                  startTime: "2020-07-13T14:30:00Z",
                  name: "14:30 Windsor",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 14,
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1335/1",
                      raceURN: "ppb:race:30061949.1335",
                      selectionId: 1,
                      horse: {
                        name: "A",
                        sireName: "KODIAC",
                        damName: "SUPREME OCCASION (IRE)",
                        damSireName: "TEOFILO (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "COLT",
                      },
                      details: {
                        jockeyName: "John Velazquez",
                        trainerName: "Richard Hannon",
                        saddleCloth: 3,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 10,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1335/2",
                      raceURN: "ppb:race:30061949.1335",
                      selectionId: 2,
                      horse: {
                        name: "B",
                        sireName: "DUNADEN (FR)",
                        damName: "CEILIDH BAND",
                        damSireName: "CELTIC SWING",
                        age: 4,
                        color: "BAY",
                        sex: "FILLY",
                      },
                      details: {
                        jockeyName: "Sophie Ralston",
                        trainerName: "Dean Ivory",
                        saddleCloth: 5,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 2,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061949.1335/3",
                      raceURN: "ppb:race:30061949.1335",
                      selectionId: 3,
                      horse: {
                        name: "C",
                        sireName: "EXCEED AND EXCEL (AUS)",
                        damName: "EMIRATES REWARDS",
                        damSireName: "DUBAWI (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "GELDING",
                      },
                      details: {
                        jockeyName: "Oisin Murphy",
                        trainerName: "Saeed bin Suroor",
                        saddleCloth: 7,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 5,
                      },
                    },
                  ],

                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901908",
                    name: "Wind 13th Jul",
                    country: "GB",
                    countryFlag: {
                      vector: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Windsor",
                  },
                },
                marketPromo: {
                  title: "New promo!!!",
                  description: "Paying 6 Places instead of 4 in the 14:40 Cheltenham. 1/5 odds on EW bets. ",
                  signposting: "EXTRA_PLACES",
                },
                blurbs: [
                  {
                    __typename: "InformativeBlurb",
                    title: {
                      __typename: "DisplayNameTitle",
                      name: "Calculate potential payouts for double bets.",
                    },
                    description: {
                      __typename: "DisplayNameTitle",
                      name: "Betfair double bet calculator makes it easy to calculate potential payouts for double bets",
                    },
                    isCollapsed: false,
                    supplementaryInfo: {
                      __typename: "SupplementaryInfo",
                      label: {
                        __typename: "DisplayNameTitle",
                        name: "Betfair double bet calculator",
                      },
                      viewLink: {
                        viewUrl: "https://betting.betfair.com/bet-calculator/double/",
                        viewDisplayMode: "BLANK_INAPP",
                        __typename: "ViewLink",
                      },
                    },
                  },
                  {
                    __typename: "InformativeBlurb",
                    title: {
                      __typename: "DisplayNameTitle",
                      name: "Cheltenham Festival 2025",
                    },
                    description: {
                      __typename: "DisplayNameTitle",
                      name: "Everything you need to know in our Ultimate Guide",
                    },
                    isCollapsed: false,
                    supplementaryInfo: {
                      __typename: "SupplementaryInfo",
                      label: {
                        __typename: "DisplayNameTitle",
                        name: "Cheltenham Tips",
                      },
                      viewLink: {
                        viewUrl:
                          "https://betting.betfair.com/horse-racing/cheltenham/2025-cheltenham-festival-betting-guide-and-tips-betfair-hub-everything-you-need-to-know-040225-200.html",
                        viewDisplayMode: "BLANK_INAPP",
                        __typename: "ViewLink",
                      },
                    },
                  },
                ],
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:30061950.1400;WIN|3",
                title: "Race without blurbs!",
                numberOfRunners: 14,
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.2",
                      name: "2m3f Nov Stks",
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
                          urn: "ppb:race:30061950.1400",
                          startTime: "2020-07-13T14:00:00Z",
                          name: "14:00 Lingfield",
                          meeting: {
                            __typename: "Meeting",
                            urn: "ppb:meeting:29901909",
                            venue: "Lingfield",
                          },
                        },
                        meeting: {
                          __typename: "Meeting",
                          urn: "ppb:meeting:29901909",
                          venue: "Lingfield",
                        },
                      },
                      runners: sporstBookRunnersTwoBlurbs,
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.2/1" },
                      { runnerURN: "ppb:sbkRunner:924.2/2" },
                      { runnerURN: "ppb:sbkRunner:924.2/3" },
                    ],
                  },
                },
                race: {
                  __typename: "Race",
                  urn: "ppb:race:30061950.1400",
                  startTime: "2020-07-13T14:00:00Z",
                  name: "14:00 Lingfield",
                  details: {
                    distance: { totalFurlongs: 1, totalMeters: 1, miles: 10, furlongs: 4, yards: 5 },
                    going: "GOOD_FIRM",
                    status: "GOING_DOWN",
                    numberOfRunners: 14,
                  },
                  runners: [
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061950.1400/1",
                      raceURN: "ppb:race:30061950.1400",
                      selectionId: 1,
                      horse: {
                        name: "D",
                        sireName: "KODIAC",
                        damName: "SUPREME OCCASION (IRE)",
                        damSireName: "TEOFILO (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "COLT",
                      },
                      details: {
                        jockeyName: "John Velazquez",
                        trainerName: "Richard Hannon",
                        saddleCloth: 3,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 10,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061950.1400/2",
                      raceURN: "ppb:race:30061950.1400",
                      selectionId: 2,
                      horse: {
                        name: "E",
                        sireName: "DUNADEN (FR)",
                        damName: "CEILIDH BAND",
                        damSireName: "CELTIC SWING",
                        age: 4,
                        color: "BAY",
                        sex: "FILLY",
                      },
                      details: {
                        jockeyName: "Sophie Ralston",
                        trainerName: "Dean Ivory",
                        saddleCloth: 5,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 2,
                      },
                    },
                    {
                      __typename: "RaceRunner",
                      urn: "ppb:tbd:racerunner:30061950.1400/3",
                      raceURN: "ppb:race:30061950.1400",
                      selectionId: 3,
                      horse: {
                        name: "F",
                        sireName: "EXCEED AND EXCEL (AUS)",
                        damName: "EMIRATES REWARDS",
                        damSireName: "DUBAWI (IRE)",
                        age: 3,
                        color: "BAY",
                        sex: "GELDING",
                      },
                      details: {
                        jockeyName: "Oisin Murphy",
                        trainerName: "Saeed bin Suroor",
                        saddleCloth: 7,
                        silk: "http://example.test.com/mockedImage/image.png",
                        draw: 5,
                      },
                    },
                  ],

                  meeting: {
                    __typename: "Meeting",
                    urn: "ppb:meeting:29901909",
                    name: "Ling 13th Jul",
                    country: "GB",
                    countryFlag: {
                      vector: "http://example.test.com/mockedImage/image.png",
                    },
                    venue: "Lingfield",
                  },
                },
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
                urn: "ppb:tbd:card:raceMarket:30061949.1335;WIN|3",
              },
            },
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:30061950.1400;WIN|3",
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
        __typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:nextRaces/s/7",
      },
    },
  ],
};

const SMP_MOCK_BLURBS = {
  markets: [
    {
      marketId: "924.1",
      numberOfPlaces: 3,
      placeFraction: { numerator: 1, denominator: 5 },
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.2 },
            fractionalDisplayOdds: { numerator: 16, denominator: 5 },
          },
        },
      ],
    },
    {
      marketId: "924.2",
      numberOfPlaces: 3,
      placeFraction: { numerator: 1, denominator: 5 },
      eachwayAvailable: true,
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 1, denominator: 1 },
          },
          eachwayRunnerOdds: {
            trueOdds: {
              decimalOdds: { decimalOdds: 1.5 },
            },
          },
        },
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4.2 },
            fractionalDisplayOdds: { numerator: 16, denominator: 5 },
          },
        },
      ],
    },
  ],
};

describe("Horse Racing - Sportsbook - Starting Price", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getRaceLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getScaResponse({}));

    await browser.url(routes.getRaceViewUrl("7", RACE_ID));
    await browser.waitUntil(
      AppPO.sportsbookRunnerBetButtonHasPrice({ market: racePagePO.element, price: 5, isHorseRacing: true }),
    );

    await firstUnnamedFavourite.element.scrollIntoView({
      block: "center",
    });
    await browser.waitUntilDisplayed(firstUnnamedFavourite.sportsbookBetButton);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1526]_should_render_bet_buttons_sp_for_unnamed_favourites`,
    );
  });

  describe("When the race card is displayed", () => {
    it("[PRPI-1526]_should_render_bet_buttons_sp_for_unnamed_favourites", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1526]_should_render_bet_buttons_sp_for_unnamed_favourites`),
      ).toEqual(0);
    });
  });

  describe("When the first card on a swimlane contains each way, market promo and info blurbs'", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        await getIndexHTML(BFF_VIEW_MOCK_BLURBS.urn, {
          currentUrl: routes.getRacingViewUrl(),
        }),
      );

      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK_BLURBS));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK_BLURBS));
      await browser.url(routes.getRacingViewUrl());
    });

    describe("When the fourth market promo is clicked and opened", () => {
      beforeAll(async () => {
        const fourthMarketPromo = new MarketPromoPO(3);
        await fourthMarketPromo.element.click();
        await fourthMarketPromo.description.waitForDisplayed();
        // there is a color transition after clicking and opening the description
        // and as such this pause of (500ms) is performed to improve test stability
        await browser.pause(500);
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-4795]_swimlane_template_should_render_blurbs_with_all_properties_correctly`,
        );
      });
      it("[PRPI-4795]_swimlane_template_should_render_blurbs_with_all_properties_correctly", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-4795]_swimlane_template_should_render_blurbs_with_all_properties_correctly`,
          ),
        ).toEqual(0);
      });

      describe("When scroll to the second element", () => {
        beforeAll(async () => {
          await firstPrimarySwimlanePO.scrollItems[1].scrollIntoView({ block: "center" });
          await browser.waitUntilDisplayed(secondRaceMarketCardPO.element);
          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-4795]_the_second_card_without_blurbs_should_not_have_space_between_title_and_runners`,
          );
        });
        it("[PRPI-1527]_the_second_card_without_blurbs_should_not_have_space_between_title_and_runners", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-4795]_the_second_card_without_blurbs_should_not_have_space_between_title_and_runners`,
            ),
          ).toEqual(0);
        });
      });
    });
  });
});
