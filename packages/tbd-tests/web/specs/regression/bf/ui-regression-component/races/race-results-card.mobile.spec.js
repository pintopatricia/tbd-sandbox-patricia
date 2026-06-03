const { SelectableItemsPO, RacingResultsPO } = require("../../../../../page-objects");
const { getRaceLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const RaceResultsCardPO = require("@ppb/tbd-shared/components/RaceResultsCard/RaceResultsCard.web.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const routes = require("../../../../../../utils/routes");
const MockService = require("../../../../../mock-essentials/mocking-service");

const MOCKED_IMAGE = "http://example.test.com/mockedImage/image.png";
const mockService = new MockService();
const raceResultsCardPO = new RaceResultsCardPO();
const racingResultsPO = new RacingResultsPO();
const selectableItemsPO = new SelectableItemsPO();

const raceViewLinksCard = {
  __typename: "RaceViewLinksCard",
  urn: "ppb:tbd:card:raceViewLinks:7|30174778.1630",
  race: {
    __typename: "Race",
    urn: "ppb:race:30174778.1630",
    startTime: "2020-02-05T14:10:00.000Z",
    runners: [],
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:30174778",
      name: "Southwell 5th Fev",
      countryFlag: {
        vector: null,
      },
      venue: "Southwell",
    },
  },
  raceViewLinks: [
    {
      race: {
        __typename: "Race",
        urn: "ppb:race:30174778.1630",
        startTime: "2020-12-10T14:10:00.000Z",
        meeting: {
          __typename: "Meeting",
          urn: "ppb:meeting:30174778",
          name: "Southwell  5th Fev",
          countryFlag: {
            vector: null,
          },
          venue: "Southwell",
        },
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:race:7|30174778.1630",
        viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
      },
    },
    {
      race: {
        __typename: "Race",
        urn: "ppb:race:30174778.1631",
        startTime: "2020-02-05T14:20:00.000Z",
        meeting: {
          __typename: "Meeting",
          urn: "ppb:meeting:30174778",
          name: "Southwell  5th Fev",
          countryFlag: {
            vector: null,
          },
          venue: "Southwell",
        },
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:race:7|30174778.1631",
        viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1631",
      },
    },
    {
      race: {
        __typename: "Race",
        urn: "ppb:race:30174778.1632",
        startTime: "2020-02-05T14:30:00.000Z",
        meeting: {
          __typename: "Meeting",
          urn: "ppb:meeting:30174778",
          name: "Southwell  5th Fev",
          countryFlag: {
            vector: null,
          },
          venue: "Southwell",
        },
      },
      viewLink: {
        viewUrn: "ppb:tbd:view:race:7|30174778.1632",
        viewUrl: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1632",
      },
    },
  ],
};

const getRaceRunners = ({ raceId, withPerformance }) => [
  {
    __typename: "RaceRunner",
    urn: `ppb:tbd:racerunner:${raceId}/16257108`,
    raceURN: `ppb:race:${raceId}`,
    selectionId: 16257108,
    horse: {
      name: "LE CHIFFRE DOR",
      sireName: "KODIAC",
      damName: "SUPREME OCCASION (IRE)",
      damSireName: "TEOFILO (IRE)",
      age: 3,
      color: "BAY",
      sex: "COLT",
      performance:
        (withPerformance && {
          positionOfficial: 1,
          performanceComment: "This is a performance comment",
          distanceBeatenStatus: "nk",
          bspAdvantage: 21,
          isp: {
            decimal: 3.6,
            fractional: {
              numerator: 12,
              denominator: 10,
            },
            americanOdd: 2600,
            favourite: true,
          },
        }) ||
        undefined,
    },
    rating123: 1,
    details: {
      jockeyName: "Harry Cobden",
      trainerName: "Harry Potter",
      saddleCloth: 12,
      silk: MOCKED_IMAGE,
      draw: 8,
    },
    form: "1-9696",
  },
  {
    __typename: "RaceRunner",
    urn: `ppb:tbd:racerunner:${raceId}/29547685`,
    raceURN: `ppb:race:${raceId}`,
    selectionId: 29547685,
    horse: {
      name: "Le Sakhallaa Dor",
      sireName: "DUNADEN (FR)",
      damName: "CEILIDH BAND",
      damSireName: "CELTIC SWING",
      age: 4,
      color: "BAY",
      sex: "FILLY",
      performance:
        (withPerformance && {
          positionOfficial: 2,
          performanceComment: "This is a performance comment",
          distanceBeatenStatus: "nk",
          isp: {
            decimal: 5.9,
            fractional: {
              numerator: 12,
              denominator: 10,
            },
            americanOdd: 5900,
          },
        }) ||
        undefined,
    },
    details: {
      jockeyName: "Thor Cobden",
      trainerName: "Black Potter",
      saddleCloth: 7,
      silk: MOCKED_IMAGE,
      draw: 9,
    },
    form: "1-9696",
  },
  {
    __typename: "RaceRunner",
    urn: `ppb:tbd:racerunner:${raceId}/26374771`,
    raceURN: `ppb:race:${raceId}`,
    selectionId: 26374771,
    horse: {
      name: "BACK FROM DUBAI (IRE)",
      sireName: "EXCEED AND EXCEL (AUS)",
      damName: "EMIRATES REWARDS",
      damSireName: "DUBAWI (IRE)",
      age: 3,
      color: "BAY",
      sex: "GELDING",
      performance:
        (withPerformance && {
          positionStatusCode: "dnf",
          performanceComment: "This is a performance comment",
          distanceBeatenStatus: "nd",
          isp: {
            decimal: 5.2,
            fractional: {
              numerator: 12,
              denominator: 10,
            },
            americanOdd: -4200,
          },
        }) ||
        undefined,
    },
    details: {
      jockeyName: "John Velazquez Figuerote",
      trainerName: "Saeed bin Suroor",
      saddleCloth: 999,
      silk: MOCKED_IMAGE,
      draw: 666,
    },
    form: "1-9696",
  },
];

const raceResultsCardNoPerformance = {
  __typename: "RaceResultsCard",
  urn: "ppb:tbd:card:raceResults:30174778.1630",
  race: {
    __typename: "Race",
    urn: "ppb:race:30174778.1630",
    startTime: "2020-02-05T14:10:00.000Z",
    runners: getRaceRunners({ raceId: "30174778.1630", withPerformance: false }),
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:30174778",
      name: "Southwell 5th Fev",
      countryFlag: {
        vector: null,
      },
      venue: "Southwell",
    },
  },
};

const raceResultsCard = {
  __typename: "RaceResultsCard",
  urn: "ppb:tbd:card:raceResults:30174778.1630",
  race: {
    __typename: "Race",
    urn: "ppb:race:30174778.1630",
    startTime: "2020-02-05T14:10:00.000Z",
    runners: getRaceRunners({ raceId: "30174778.1630", withPerformance: true }),
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:30174778",
      name: "Southwell 5th Fev",
      countryFlag: {
        vector: null,
      },
      venue: "Southwell",
    },
  },
};

const RACE_RESULTS_CARD_QUICK_RESULTS = {
  cards: [
    {
      ...raceResultsCard,
      race: {
        ...raceResultsCard.race,
        details: {
          resultType: "QUICK_RESULT",
          numberOfParticipants: 5,
        },
      },
    },
  ],
};

const RACE_RESULTS_CARD_FULL_RESULTS = {
  cards: [
    {
      ...raceResultsCard,
      race: {
        ...raceResultsCard.race,
        urn: "ppb:race:30174778.1632",
        runners: [
          ...getRaceRunners({ raceId: "30174778.1632", withPerformance: true }),
          {
            __typename: "RaceRunner",
            urn: "ppb:tbd:racerunner:30174778.1632/29547686",
            raceURN: "ppb:race:30174778.1632",
            selectionId: 29547686,
            horse: {
              name: "NEO JOSE",
              sireName: "DUNADEN (FR)",
              damName: "CEILIDH BAND",
              damSireName: "CELTIC SWING",
              age: 4,
              color: "BAY",
              sex: "FILLY",
              performance: {
                positionOfficial: null,
                performanceComment: "This is a performance comment",
                distanceBeatenStatus: null,
                isp: null,
              },
            },
            details: {
              jockeyName: "Trinity Maria",
              trainerName: "Dean Ivory",
              saddleCloth: 6,
              silk: MOCKED_IMAGE,
              draw: 7,
            },
            form: "1-9696",
            status: "NON_RUNNER",
          },
          {
            __typename: "RaceRunner",
            urn: "ppb:tbd:racerunner:30174778.1632/26374777",
            raceURN: "ppb:race:30174778.1632",
            selectionId: 26374777,
            horse: {
              name: "A GREAT NAME",
              sireName: "THE SIRE",
              damName: "THE DAM",
              damSireName: "THE DAM SIRE",
              age: 3,
              color: "BAY",
              sex: "GELDING",
              performance: {
                positionStatusCode: "pu",
                performanceComment: "This is a performance comment",
                distanceBeatenStatus: "nd",
                isp: {
                  decimal: 5.2,
                  fractional: {
                    numerator: 12,
                    denominator: 10,
                  },
                  americanOdd: 4550000000,
                  favourite: false,
                },
              },
            },
            rating123: 2,
            details: {
              jockeyName: "I sit in a horse for a living",
              trainerName: "I do not train just watching",
              saddleCloth: 0,
              silk: MOCKED_IMAGE,
              draw: 0,
            },
            form: "1-9696",
          },
        ],

        winningTime: 250.7,
        details: {
          resultType: "FULL_RESULT",
          numberOfParticipants: 6,
          numberOfNonRunners: 1,
        },
      },
    },
  ],
};

const FIRST_BFF_MOCK = {
  __typename: "RaceView",
  urn: "ppb:tbd:view:race:7|30174778.1630",
  url: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
  race: {
    urn: "ppb:race:30174778.1630",
    meeting: {
      urn: "30174778",
    },
  },
  edges: [
    {
      node: {
        ...raceViewLinksCard,
      },
    },
    {
      node: {
        ...raceResultsCard,
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1630",
        __typename: "RaceViewLinksCard",
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:raceResults:30174778.1630",
        __typename: "RaceResultsCard",
      },
    },
  ],
};

const THIRD_BFF_MOCK = {
  __typename: "RaceView",
  urn: "ppb:tbd:view:race:7|30174778.1632",
  url: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1632",
  race: {
    urn: "ppb:race:30174778.1634",
    meeting: {
      urn: "30174778",
    },
  },
  edges: [
    {
      node: {
        ...raceViewLinksCard,
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1634",
        race: {
          ...raceViewLinksCard.race,
          urn: "ppb:race:30174778.1634",
        },
      },
    },
    {
      node: {
        ...raceResultsCardNoPerformance,
        urn: "ppb:tbd:card:raceResults:30174778.1634",
        race: {
          ...raceResultsCardNoPerformance.race,
          urn: "ppb:race:30174778.1634",
          details: {
            numberOfParticipants: 5,
            resultType: "FULL_RESULT",
          },
          runners: [
            ...getRaceRunners({ raceId: "30174778.1632", withPerformance: false }),
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30174778.1634/29547686",
              raceURN: "ppb:race:30174778.1634",
              selectionId: 29547686,
              horse: {
                name: "NEO JOSE",
                sireName: "DUNADEN (FR)",
                damName: "CEILIDH BAND",
                damSireName: "CELTIC SWING",
                age: 4,
                color: "BAY",
                sex: "FILLY",
                performance: {
                  positionOfficial: null,
                  performanceComment: "This is a performance comment",
                  distanceBeatenStatus: null,
                  isp: null,
                },
              },
              details: {
                jockeyName: "Trinity Maria",
                trainerName: "Dean Ivory",
                saddleCloth: 6,
                silk: MOCKED_IMAGE,
                draw: 7,
              },
              form: "1-9696",
              status: "NON_RUNNER",
            },
            {
              __typename: "RaceRunner",
              urn: "ppb:tbd:racerunner:30174778.1634/26374777",
              raceURN: "ppb:race:30174778.1634",
              selectionId: 26374777,
              horse: {
                name: "BACK FROM DUBAI (IRE)",
                sireName: "EXCEED AND EXCEL (AUS)",
                damName: "EMIRATES REWARDS",
                damSireName: "DUBAWI (IRE)",
                age: 3,
                color: "BAY",
                sex: "GELDING",
                performance: {
                  positionOfficial: 4,
                  performanceComment: "This is a performance comment",
                  distanceBeatenStatus: "nd",
                  isp: {
                    decimal: 5.2,
                    fractional: {
                      numerator: 12,
                      denominator: 10,
                    },
                    americanOdd: -4200,
                  },
                },
              },
              details: {
                jockeyName: "John Velazquez Figuerote",
                trainerName: "Saeed bin Suroor",
                saddleCloth: 999,
                silk: MOCKED_IMAGE,
                draw: 666,
              },
              form: "1-9696",
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1634",
        __typename: "RaceViewLinksCard",
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:raceResults:30174778.1634",
        __typename: "RaceResultsCard",
      },
    },
  ],
};

const SCA_RACES_MOCK_QUICK_RESULTS = {
  race: [
    {
      id: "30174778.1630",
      details: {
        status: "RESULT",
        resultType: "QUICK_RESULT",
      },
    },
  ],
};

const SCA_RACES_MOCK_FULL_RESULTS = {
  race: [
    {
      id: "30174778.1630",
      details: {
        status: "RESULT",
        resultType: "FULL_RESULT",
      },
    },
  ],
};

describe("Layout Entity - Race Results Card", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(FIRST_BFF_MOCK.urn));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getRaceLayout(FIRST_BFF_MOCK));
    await browser.url(routes.getRaceViewUrl("7", "30174778.1630"));
    await browser.waitUntilDisplayed(raceResultsCardPO.element);
  });

  describe("And the first race gets quick results", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getScaResponse(SCA_RACES_MOCK_QUICK_RESULTS));
      await mockService.mockHttpRequest(getCardResults(RACE_RESULTS_CARD_QUICK_RESULTS));
      await browser.tickFakeClock();
      await browser.waitUntilEquals(racingResultsPO.title, "Quick Results");
      await browser.waitUntilDisplayed(racingResultsPO.winnerRibbon);
    });

    it("[PRPI-6296] The 'Quick Result' label should be visible", async () => {
      expect(await racingResultsPO.title.getText()).toBe("Quick Results");
    });

    it("[PRPI-6297] The number of runners that ran: 'Ran: 5'", async () => {
      expect(await racingResultsPO.numberOfRanRunners.getText()).toBe("Ran: 5");
    });

    it("[PRPI-6298] The 3 first runners should be visible (pos 1,2,DNF)", async () => {
      expect(await racingResultsPO.runners.length).toBe(3);

      expect(await racingResultsPO.positions[0].getText()).toBe("1");
      expect(await racingResultsPO.positions[1].getText()).toBe("2");
      expect(await racingResultsPO.positions[2].getText()).toBe("DNF");
    });

    it("[PRPI-6299] The 1st runner should be displayed", async () => {
      expect(await racingResultsPO.positions[0].getText()).toBe("1");
      expect(await racingResultsPO.horseNames[0].getText()).toBe("Le Chiffre Dor");
      expect(await racingResultsPO.drawNumbers[0].getText()).toBe("(8)");
      expect(await racingResultsPO.saddleCloths[0].getText()).toBe("12");
      expect(await racingResultsPO.jockeyNames[0].getText()).toBe("J: Harry Cobden");
      expect(await racingResultsPO.trainerName[0].getText()).toBe("T: Harry Potter");
      expect(await racingResultsPO.startingPrices[0].getText()).toBe("3.6");
      expect(await racingResultsPO.silks[0].isDisplayed()).toBe(true);
      expect(await racingResultsPO.winnerRibbon.isDisplayed()).toBe(true);
      expect(await racingResultsPO.favouriteLabels[0].getText()).toBe("Fav");
    });

    it("[PRPI-6300] The 2nd runner should be visible with position '2'", async () => {
      expect(await racingResultsPO.positions[1].getText()).toBe("2");
    });

    it("[PRPI-6301] The 3rd runner should be visible with position 'DNF'", async () => {
      expect(await racingResultsPO.positions[2].getText()).toBe("DNF");
    });
  });

  describe("And the first race gets full results", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getScaResponse(SCA_RACES_MOCK_FULL_RESULTS));
      await mockService.mockHttpRequest(getCardResults(RACE_RESULTS_CARD_FULL_RESULTS));
      await browser.tickFakeClock();
      await browser.waitUntilEquals(racingResultsPO.title, "Full Results");
    });

    it("[PRPI-6302] The 'Full Result' label should be visible", async () => {
      expect(await racingResultsPO.title.getText()).toBe("Full Results");
    });

    it("[PRPI-6303] The number of runners that ran: 'Ran: 5'", async () => {
      expect(await racingResultsPO.numberOfRanRunners.getText()).toBe("Ran: 5");
    });

    it("[PRPI-6304] The 5 runners that ran should be visible (pos 1,2,DNF,PU,-)", async () => {
      expect(await racingResultsPO.runners.length).toBe(5);

      expect(await racingResultsPO.positions[0].getText()).toBe("1");
      expect(await racingResultsPO.positions[1].getText()).toBe("2");
      expect(await racingResultsPO.positions[2].getText()).toBe("DNF");
      expect(await racingResultsPO.positions[3].getText()).toBe("PU");
      expect(await racingResultsPO.positions[4].getText()).toBe("-");
    });

    it("[PRPI-6305] The 1st runner should be visible with position '1'", async () => {
      expect(await racingResultsPO.positions[0].getText()).toBe("1");
    });

    it("[PRPI-6306] The 2nd runner should be displayed", async () => {
      expect(await racingResultsPO.positions[1].getText()).toBe("2");
      expect(await racingResultsPO.distances[1].getText()).toBe("nk");
      expect(await racingResultsPO.silks[0].isDisplayed()).toBe(true);
    });

    it("[PRPI-6307] The 3rd runner should be visible with position 'DNF'", async () => {
      expect(await racingResultsPO.positions[2].getText()).toBe("DNF");
    });

    it("[PRPI-6308] The 4th runner should be visible with position 'PU'", async () => {
      expect(await racingResultsPO.positions[3].getText()).toBe("PU");
    });

    it("[PRPI-6309] The last runner should be displayed", async () => {
      expect(await racingResultsPO.positions[4].getText()).toBe("-");
      expect(await racingResultsPO.distances[4].getText()).toBe("-");
      expect(await racingResultsPO.horseNames[4].getText()).toBe("Neo Jose");
      expect(await racingResultsPO.drawNumbers[4].getText()).toBe("(7)");
      expect(await racingResultsPO.saddleCloths[4].getText()).toBe("6");
      expect(await racingResultsPO.jockeyNames[4].getText()).toBe("J: Trinity Maria");
      expect(await racingResultsPO.startingPrices[4].getText()).toBe("Non Runner");
      expect(await racingResultsPO.silks[3].isDisplayed()).toBe(true);
    });

    it("[PRPI-6310] The info section should be visible with 'DNF: did not finish' and 'PU: pull up' label", async () => {
      expect(await racingResultsPO.dnfItems[0].getText()).toBe("DNF:Did not finish");
      expect(await racingResultsPO.dnfItems[1].getText()).toBe("PU:Pulled up");
    });

    it("[PRPI-6311] The title 'Winning Time & BSP Advantage' should be visible", async () => {
      expect(await raceResultsCardPO.winningTimeAndBspAdvantageLabel.getText()).toBe("Winning Time & BSP Advantage");
    });

    it("[PRPI-6312] The 'Winning Time' label and value should be visible: '3m 2s'", async () => {
      expect(await raceResultsCardPO.winningTimeLabel.getText()).toBe("WINNING TIME");
      expect(await raceResultsCardPO.winningTime.getText()).toBe("4m 10.70s");
    });

    it("[PRPI-6313] The 'BSP Advantage' label and value should be visible '21%'", async () => {
      expect(await raceResultsCardPO.bspAdvantageLabel.getText()).toBe("BSP ADVANTAGE");
      expect(await raceResultsCardPO.bspAdvantage.getText()).toBe("21%");
    });
  });

  describe("When the user taps the 3rd race And the race has full results available And 1st and 2nd runners have performance info available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getRaceLayout(THIRD_BFF_MOCK));
      await selectableItemsPO.races[2].click();
      await browser.waitUntilDisplayed(raceResultsCardPO.element);
    });

    it("[PRPI-6314] The 'Full Result' label should be visible", async () => {
      expect(await racingResultsPO.title.getText()).toBe("Full Results");
    });

    it("[PRPI-6315] The number of runners that ran: 'Ran: 5'", async () => {
      expect(await racingResultsPO.numberOfRanRunners.getText()).toBe("Ran: 5");
    });

    it("[PRPI-6316] The runners with performance and the non-runner should be visible (pos 4,-)", async () => {
      expect(await racingResultsPO.runners.length).toBe(2);

      expect(await racingResultsPO.positions[0].getText()).toBe("4");
      expect(await racingResultsPO.positions[1].getText()).toBe("-");
    });

    it("[PRPI-6317] The 1st runner should be displayed", async () => {
      expect(await racingResultsPO.positions[0].getText()).toBe("4");
      expect(await racingResultsPO.horseNames[0].getText()).toBe("Back From Dubai (Ire)");
      expect(await racingResultsPO.drawNumbers[0].getText()).toBe("(666)");
      expect(await racingResultsPO.saddleCloths[0].getText()).toBe("999");
      expect(await racingResultsPO.jockeyNames[0].getText()).toBe("J: John Velazquez Figuerote");
      expect(await racingResultsPO.startingPrices[0].getText()).toBe("5.2");
      expect(await racingResultsPO.silks[0].isDisplayed()).toBe(true);
      expect(await racingResultsPO.winnerRibbon.isDisplayed()).toBe(false);
      expect(await racingResultsPO.distances[0].getText()).toBe("nd");
    });

    it("[PRPI-6318] The non runner should be displayed", async () => {
      expect(await racingResultsPO.positions[1].getText()).toBe("-");
      expect(await racingResultsPO.distances[1].getText()).toBe("-");
      expect(await racingResultsPO.horseNames[1].getText()).toBe("Neo Jose");
      expect(await racingResultsPO.drawNumbers[1].getText()).toBe("(7)");
      expect(await racingResultsPO.saddleCloths[1].getText()).toBe("6");
      expect(await racingResultsPO.jockeyNames[1].getText()).toBe("J: Trinity Maria");
      expect(await racingResultsPO.startingPrices[1].getText()).toBe("Non Runner");
      expect(await racingResultsPO.silks[1].isDisplayed()).toBe(true);
    });
  });

  describe("When the user selects American odds as the preferred odds format", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(FIRST_BFF_MOCK.urn, { sportsbookOddsDisplay: "AMERICAN" }));
      await browser.refresh();
      await mockService.mockHttpRequest(getRaceLayout(FIRST_BFF_MOCK));
      await mockService.mockHttpRequest(getScaResponse(SCA_RACES_MOCK_FULL_RESULTS));
      await mockService.mockHttpRequest(getCardResults(RACE_RESULTS_CARD_FULL_RESULTS));
      await browser.tickFakeClock();
      await browser.waitUntilDisplayed(raceResultsCardPO.element);
      await browser.waitUntilEquals(racingResultsPO.title, "Full Results");
    });

    it("[PRPI-6319] The runners starting prices should be displayed in American format", async () => {
      expect(await racingResultsPO.startingPrices[0].getText()).toBe("+2600");
      expect(await racingResultsPO.startingPrices[1].getText()).toBe("+5900");
      expect(await racingResultsPO.startingPrices[2].getText()).toBe("-4200");
      expect(await racingResultsPO.startingPrices[3].getText()).toBe("+4550000000");
    });
  });
});
