const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;
const {
  getSportsLayout,
  getRaceLayout,
  getCardResults,
  getHomeLayoutWithViewLink,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");

const { getConnectivityCheck } = require("@ppb/tbd-shared/mocks/connectivity-check/connectivity-check.controller");
const RaceResultsCardSO = require("@ppb/tbd-shared/components/RaceResultsCard/RaceResultsCard.native.so");

const { SelectableItemsSO, RacingResultsSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { swipeUp } = require("../../../../helpers/gestures");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const raceResultsCardSO = new RaceResultsCardSO();
const racingResultsSO = new RacingResultsSO();
const selectableItemsSO = new SelectableItemsSO();

const WALLET_MOCK = [
  { amount: "25.00", walletName: "MAIN" },
  { amount: "2.00", walletName: "BOOST_TOKENS" },
];

const MOCKED_IMAGE = `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`;

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
          distanceBeatenStatus: "nd",
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
      silk: `http://${mockServerHost}:${mockServerPort}/mockedErrorImage/image.png`,
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
        runners: [
          ...getRaceRunners({ raceId: "30174778.1630", withPerformance: true }),
          {
            __typename: "RaceRunner",
            urn: "ppb:tbd:racerunner:30174778.1630/29547686",
            raceURN: "ppb:race:30174778.1630",
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
            urn: "ppb:tbd:racerunner:30174778.1630/26374777",
            raceURN: "ppb:race:30174778.1630",
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
  __typename: "SportView",
  urn: `ppb:tbd:view:sport:7`,
  title: "DUMMY TITLE",
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
    urn: "ppb:race:30174778.1632",
    meeting: {
      urn: "30174778",
    },
  },
  edges: [
    {
      node: {
        ...raceViewLinksCard,
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1632",
        race: {
          ...raceViewLinksCard.race,
          urn: "ppb:race:30174778.1632",
        },
      },
    },
    {
      node: {
        ...raceResultsCardNoPerformance,
        urn: "ppb:tbd:card:raceResults:30174778.1632",
        race: {
          ...raceResultsCardNoPerformance.race,
          urn: "ppb:race:30174778.1632",
          details: {
            numberOfParticipants: 5,
            resultType: "FULL_RESULT",
          },
          runners: [
            ...getRaceRunners({ raceId: "30174778.1632", withPerformance: false }),
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
        urn: "ppb:tbd:card:raceViewLinks:7|30174778.1632",
        __typename: "RaceViewLinksCard",
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:raceResults:30174778.1632",
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
  describe("When the user is on a given screen and 3 races are retrieved And the 1st race has no results", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getAppContext({
          sportsbookOddsDisplay: "AMERICAN",
        }),
      );
      await mockService.mockHttpRequest(getScaResponse({}));
      await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getSportsLayout(FIRST_BFF_MOCK));
      await mockService.mockHttpRequest(getConnectivityCheck({}));
      const url = "horse-racing/s-7";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(raceResultsCardSO.element);
    });

    describe("And the first race gets quick results", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_RACES_MOCK_QUICK_RESULTS));
        await mockService.mockHttpRequest(getCardResults(RACE_RESULTS_CARD_QUICK_RESULTS));
        await browser.waitUntilDisplayed(racingResultsSO.element);
      });

      it("[PRPI-3638] The 'Quick Result' label should be visible", async () => {
        expect(await racingResultsSO.title.getText()).toBe("Quick Results");
      });

      it("[PRPI-3639] The number of runners that ran: 'Ran: 5'", async () => {
        expect(await racingResultsSO.numberOfRanRunners.getText()).toBe("Ran: 5");
      });

      it("[PRPI-3640] The 3 first runners should be visible (pos 1,2,DNF)", async () => {
        expect(await racingResultsSO.runners.length).toBe(3);
        expect(await racingResultsSO.positions[0].getText()).toBe("1");
        expect(await racingResultsSO.positions[1].getText()).toBe("2");
        expect(await racingResultsSO.positions[2].getText()).toBe("DNF");
      });

      it("[PRPI-3641] The 1st runner should be displayed", async () => {
        expect(await racingResultsSO.positions[0].getText()).toBe("1");
        expect(await racingResultsSO.horseNames[0].getText()).toBe("Le Chiffre Dor");
        expect(await racingResultsSO.drawNumbers[0].getText()).toBe("(8)");
        expect(await racingResultsSO.saddleCloths[0].getText()).toBe("12");
        expect(await racingResultsSO.jockeyNames[0].getText()).toBe("J: Harry Cobden");
        expect(await racingResultsSO.trainerName[0].getText()).toBe("T: Harry Potter");
        expect(await racingResultsSO.startingPrices[0].getText()).toBe("+2600");
        expect(await racingResultsSO.favouriteLabels[0].getText()).toBe("Fav");
      });

      it("[PRPI-3642] The 1st runner silk should be displayed", async () => {
        expect(await racingResultsSO.silks[0].isDisplayed()).toBe(true);
      });

      it("[PRPI-3643] The 1st runner winner ribbon should be displayed", async () => {
        expect(await racingResultsSO.winnerRibbon.isDisplayed()).toBe(true);
      });

      it("[PRPI-3644] The 2nd runner should be visible with position '2'", async () => {
        expect(await racingResultsSO.positions[1].getText()).toBe("2");
      });

      it("[PRPI-3645] The 3rd runner should be visible with position 'DNF'", async () => {
        expect(await racingResultsSO.positions[2].getText()).toBe("DNF");
      });
    });

    describe("And the first race gets full results", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_RACES_MOCK_FULL_RESULTS));
        await mockService.mockHttpRequest(getCardResults(RACE_RESULTS_CARD_FULL_RESULTS));
        await browser.waitUntilEquals(racingResultsSO.title, "Full Results");
      });

      it("[PRPI-3646] The 'Full Results' label should be visible", async () => {
        expect(await racingResultsSO.title.getText()).toBe("Full Results");
      });

      it("[PRPI-3647] The number of runners that ran: 'Ran: 5'", async () => {
        expect(await racingResultsSO.numberOfRanRunners.getText()).toBe("Ran: 5");
      });

      it("[PRPI-3648] The 5 runners that ran should be visible (pos 1,2,DNF,PU,-)", async () => {
        expect(await racingResultsSO.runners.length).toBe(5);

        expect(await racingResultsSO.positions[0].getText()).toBe("1");
        expect(await racingResultsSO.positions[1].getText()).toBe("2");
        expect(await racingResultsSO.positions[2].getText()).toBe("DNF");
        expect(await racingResultsSO.positions[3].getText()).toBe("PU");
        expect(await racingResultsSO.positions[4].getText()).toBe("-");
      });

      it("[PRPI-3649] The runners starting prices should be displayed in American format", async () => {
        expect(await racingResultsSO.startingPrices[0].getText()).toBe("+2600");
        expect(await racingResultsSO.startingPrices[1].getText()).toBe("+5900");
        expect(await racingResultsSO.startingPrices[2].getText()).toBe("-4200");
        expect(await racingResultsSO.startingPrices[3].getText()).toBe("+4550000000");
      });

      it("[PRPI-3650] The 1st runner should be visible with position '1'", async () => {
        expect(await racingResultsSO.positions[0].getText()).toBe("1");
      });

      it("[PRPI-3651] The 2nd runner should be displayed", async () => {
        expect(await racingResultsSO.positions[1].getText()).toBe("2");
        expect(await racingResultsSO.distances[1].getText()).toBe("nd");
        expect(await racingResultsSO.defaultSilks[0].isDisplayed()).toBe(true);
      });

      it("[PRPI-3652] The 3rd runner should be visible with position 'DNF'", async () => {
        expect(await racingResultsSO.positions[2].getText()).toBe("DNF");
      });

      it("[PRPI-3653] The 4th runner should be visible with position 'PU'", async () => {
        expect(await racingResultsSO.positions[3].getText()).toBe("PU");
      });

      it("[PRPI-3654] The last runner should be displayed", async () => {
        expect(await racingResultsSO.positions[4].getText()).toBe("-");
        expect(await racingResultsSO.distances[3].getText()).toBe("-");
        expect(await racingResultsSO.horseNames[4].getText()).toBe("Neo Jose");
        expect(await racingResultsSO.drawNumbers[4].getText()).toBe("(7)");
        expect(await racingResultsSO.saddleCloths[4].getText()).toBe("6");
        expect(await racingResultsSO.jockeyNames[4].getText()).toBe("J: Trinity Maria");
        expect(await racingResultsSO.startingPrices[4].getText()).toBe("Non Runner");
        expect(await racingResultsSO.silks[3].isDisplayed()).toBe(true);
      });

      it("[PRPI-3655] The info section should be visible with 'DNF: did not finish' and 'PU: pull up' label", async () => {
        expect(await racingResultsSO.dnfCodes[0].getText()).toBe("DNF:");
        expect(await racingResultsSO.dnfValues[0].getText()).toBe("Did not finish");
        expect(await racingResultsSO.dnfCodes[1].getText()).toBe("PU:");
        expect(await racingResultsSO.dnfValues[1].getText()).toBe("Pulled up");
      });

      describe("When the user scrolls down", () => {
        beforeAll(async () => {
          await swipeUp(0.6);
          await browser.waitUntilEquals(raceResultsCardSO.bspAdvantage, "21%");
        });

        it("[PRPI-3656] The title 'Winning Time & BSP Advantage' should be visible", async () => {
          expect(await raceResultsCardSO.winningTimeAndBspAdvantageLabel.getText()).toBe(
            "Winning Time & BSP Advantage",
          );
        });

        it("[PRPI-3657] The 'Winning Time' label and value should be visible", async () => {
          expect(await raceResultsCardSO.winningTimeLabel.getText()).toBe("WINNING TIME");
          expect(await raceResultsCardSO.winningTime.getText()).toBe("4m 10.70s");
        });

        it("[PRPI-3658] The 'BSP Advantage' label and value should be visible '21%'", async () => {
          expect(await raceResultsCardSO.bspAdvantageLabel.getText()).toBe("BSP ADVANTAGE");
          expect(await raceResultsCardSO.bspAdvantage.getText()).toBe("21%");
        });
      });
    });

    describe("When the user taps the 3rd race And the race has full results available And 1st and 2nd runners have performance info available", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getRaceLayout(THIRD_BFF_MOCK));
        await mockService.mockHttpRequest(getScaResponse({}));
        await selectableItemsSO.races[2].click();
        await browser.waitUntilDisplayed(raceResultsCardSO.element);
        await browser.waitUntilEquals(racingResultsSO.title, "Full Results");
      });

      it("[PRPI-3128] The 'Full Result' label should be visible", async () => {
        expect(await racingResultsSO.title.getText()).toBe("Full Results");
      });

      it("[PRPI-3128] The number of runners that ran: 'Ran: 5'", async () => {
        expect(await racingResultsSO.numberOfRanRunners.getText()).toBe("Ran: 5");
      });

      it("[PRPI-3128] The runners with performance and the non-runner should be visible (pos 4,-)", async () => {
        expect(await racingResultsSO.runners.length).toBe(2);

        expect(await racingResultsSO.positions[0].getText()).toBe("4");
        expect(await racingResultsSO.positions[1].getText()).toBe("-");
      });

      it("[PRPI-3128] The 1st runner should be displayed", async () => {
        expect(await racingResultsSO.positions[0].getText()).toBe("4");
        expect(await racingResultsSO.horseNames[0].getText()).toBe("Back From Dubai (Ire)");
        expect(await racingResultsSO.drawNumbers[0].getText()).toBe("(666)");
        expect(await racingResultsSO.saddleCloths[0].getText()).toBe("999");
        expect(await racingResultsSO.jockeyNames[0].getText()).toBe("J: John Velazquez Figuerote");
        expect(await racingResultsSO.startingPrices[0].getText()).toBe("-4200");
        expect(await racingResultsSO.silks[0].isDisplayed()).toBe(true);
        expect(await racingResultsSO.winnerRibbon.isDisplayed()).toBe(false);
        expect(await racingResultsSO.distances[0].getText()).toBe("nd");
      });

      it("[PRPI-3128] The non runner should be displayed", async () => {
        expect(await racingResultsSO.positions[1].getText()).toBe("-");
        expect(await racingResultsSO.distances[1].getText()).toBe("-");
        expect(await racingResultsSO.horseNames[1].getText()).toBe("Neo Jose");
        expect(await racingResultsSO.drawNumbers[1].getText()).toBe("(7)");
        expect(await racingResultsSO.saddleCloths[1].getText()).toBe("6");
        expect(await racingResultsSO.jockeyNames[1].getText()).toBe("J: Trinity Maria");
        expect(await racingResultsSO.startingPrices[1].getText()).toBe("Non Runner");
        expect(await racingResultsSO.silks[1].isDisplayed()).toBe(true);
      });
    });
  });
});
