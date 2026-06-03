const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const SportsbookExpandableLegCardGroupPO = require("@ppb/tbd-shared/components/SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web.po");

const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const {
  MyBetsPagePO,
  SportsbookBetPanelPO,
  AvBFixturePO,
  StatusLabelPO,
  CardPO,
  BetSelectionDetailsPO,
} = require("../../../../../page-objects");
const routes = require("../../../../../../utils/routes");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../../helpers/mybets.util");

const cardPO = new CardPO();
const mockService = new MockService();
const myBetsPO = new MyBetsPagePO();

const firstBetPanelPO = new SportsbookBetPanelPO(myBetsPO.betCardGroups[0]);
const betStatusLabelPO = new StatusLabelPO(firstBetPanelPO.statusLabel);
const firstSportsbookExpandableLegCardGroupPO = new SportsbookExpandableLegCardGroupPO(myBetsPO.betCardGroups[0]);
const firstAvBFixturePO = new AvBFixturePO(firstSportsbookExpandableLegCardGroupPO.cards[0]);
const betSelectionDetailsPO = new BetSelectionDetailsPO(myBetsPO.betCardGroups[0]);

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const OBB_SINGLE_SQUAD_VS_SQUAD_ACTIVE_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: true,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(1.9),
    product: "OUTCOME_BASED_BETTING",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            eventId: "32483335",
            typename: "FootballFixture",
          },
          legs: [
            {
              type: "OB",
              legNumber: 0,
              result: null,
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "squadVsSquad",
                  templateVersion: 1,
                  expressionMetadata: {
                    participants: [
                      { id: "404040", name: "João" },
                      { id: "404041", name: "Mota" },
                    ],
                  },
                  params: {
                    squadAParticipantIds: ["404040"],
                    squadBParticipantIds: ["404041"],
                    outcomeIds: ["GOALS_TIME_ADJUSTED"],
                    quantifier: "GREATER_THAN",
                    timePeriodId: "MATCH",
                  },
                  expressionComponents: {
                    leftOperand: [
                      {
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                        participantId: "404040",
                      },
                    ],

                    operator: ">",
                    rightOperand: [
                      {
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                        participantId: "404041",
                      },
                    ],
                  },
                  subExpressionInfos: [],
                },
              },
              parts: [
                {
                  price: buildPrice(1.9),
                  originalPrice: buildPrice(1.9),
                  eventMarketDescription: "Match Ups",
                  eventUrn: "ppb:event:32483335",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "o:01jergknngfqk84v6reh606xd1",
        placedDate: "2024-09-01T00:00:00Z",
      },
    },
  },
]);

const OBB_SINGLE_SQUAD_VS_SQUAD_WON_BET_MOCK = getMyBetsSBKViewMock([
  {
    betType: "SGL",
    isOpen: false,
    profitAndLoss: 0.19,
    currentSize: 0.1,
    betPrice: buildPrice(1.9),
    product: "OUTCOME_BASED_BETTING",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Girona",
            awayName: "Liverpool",
            scheduledAt: "2023-05-18T18:30:00.000Z",
            eventId: "32483335",
            typename: "FootballFixture",
          },
          legs: [
            {
              type: "OB",
              legNumber: 0,
              result: "WON",
              outcomeBasedDetails: {
                expressionInfo: {
                  templateId: "squadVsSquad",
                  templateVersion: 1,
                  expressionMetadata: {
                    participants: [
                      { id: "404040", name: "João" },
                      { id: "404041", name: "Mota" },
                    ],
                  },
                  params: {
                    squadAParticipantIds: ["404040"],
                    squadBParticipantIds: ["404041"],
                    outcomeIds: ["GOALS_TIME_ADJUSTED"],
                    quantifier: "GREATER_THAN",
                    timePeriodId: "MATCH",
                  },
                  expressionComponents: {
                    leftOperand: [
                      {
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                        participantId: "404040",
                      },
                    ],

                    operator: ">",
                    rightOperand: [
                      {
                        outcomeId: "GOALS_TIME_ADJUSTED",
                        timePeriodId: "MATCH",
                        participantId: "404041",
                      },
                    ],
                  },
                  subExpressionInfos: [],
                },
              },
              parts: [
                {
                  price: buildPrice(1.9),
                  originalPrice: buildPrice(1.9),
                  eventMarketDescription: "Match Ups",
                  eventUrn: "ppb:event:32483335",
                  eventDescription: "|Girona| |v| |Liverpool|",
                  outcomeDefinitionExp: null,
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "o:01jergknngfqk84v6reh606xd1",
        placedDate: "2024-09-01T00:00:00Z",
      },
    },
  },
]);

const SCA_PRE_PLAY_MOCK = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 0,
        away: 0,
      },
      duration: {
        period: null,
        status: "PRE_MATCH",
        stoppageMinutes: null,
        clock: {
          minute: 0,
          second: 0,
        },
      },
      stats: [],
    },
  ],
};

const SCA_FINAL = {
  fixture: [
    {
      eventId: "32483335",
      scheduledAt: "2023-07-14T13:00:00Z",
      score: {
        home: 7,
        away: 0,
      },
      duration: {
        period: "REGULAR",
        status: "FULL",
        stoppageMinutes: null,
        clock: {
          minute: 90,
          second: 11,
        },
      },
      players: [
        {
          id: 404040,
          name: "JOAO",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              fouls: null,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 2,
              fouls: 3,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 3,
              fouls: 5,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
        {
          id: 404041,
          name: "MOTA",
          stats: [
            {
              period: "REGULAR",
              periodStatus: "INPLAY_FIRST_HALF",
              goals: 1,
              fouls: 2,
              totalCards: 1,
              totalShots: 1,
            },
            {
              period: "REGULAR",
              periodStatus: "INPLAY_SECOND_HALF",
              goals: 1,
              fouls: null,
              totalCards: null,
              totalShots: null,
            },
            {
              period: "REGULAR",
              periodStatus: "FULL",
              goals: 2,
              fouls: null,
              totalCards: 1,
              totalShots: 10,
            },
          ],
        },
      ],
    },
  ],
};

const browseToMyBets = async (MOCK) => {
  await mockService.mockHttpRequest(await getIndexHTML(MOCK.urn));
  await mockService.mockHttpRequest(getMyBetsLayout(MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
};

describe("OBB Squad Vs Squad Singles My Bets Page", () => {
  describe("Given I have a squad vs squad bet placed", () => {
    describe("[LCKYCHRM-555] And the game is pre play", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_PRE_PLAY_MOCK));
        await browseToMyBets(OBB_SINGLE_SQUAD_VS_SQUAD_ACTIVE_BET_MOCK);

        await browser.url(routes.getMyBetsViewUrl("open"));

        await cardPO.title.waitForClickable();
        await cardPO.title.click();

        await browser.waitUntilDisplayed(firstBetPanelPO.element);
      });

      it("[PRPI-7085] Then the bet is displayed on open bet tab", async () => {
        expect(await firstAvBFixturePO.element.isDisplayed()).toEqual(true);
        expect(await firstBetPanelPO.panelTitle.isDisplayed()).toEqual(true);
        expect(await firstBetPanelPO.panelTitle.getText()).toEqual("Squad Bet Single @1.9");
      });

      it("[PRPI-7086] And the name of the players are displayed", async () => {
        expect(await firstBetPanelPO.panelSupportingText.getText()).toEqual("João To Score More Goals Than Mota");
        expect(await betSelectionDetailsPO.title.getText()).toEqual("João");
        expect(await betSelectionDetailsPO.subtitle.getText()).toEqual("To Score More Goals Than Mota");
      });
    });
  });

  describe("When the game ends", () => {
    describe("[LCKYCHRM-555] And all the outcomes are achieved", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getScaResponse(SCA_FINAL));
        await browseToMyBets(OBB_SINGLE_SQUAD_VS_SQUAD_WON_BET_MOCK);

        await browser.url(routes.getMyBetsViewUrl("settled"));

        await cardPO.title.waitForClickable();
        await cardPO.title.click();

        await browser.waitUntilDisplayed(firstBetPanelPO.element);
      });

      it("[PRPI-7087] Then the bet change to settled tab", async () => {
        expect(await firstAvBFixturePO.element.isDisplayed()).toEqual(true);
        expect(await firstBetPanelPO.panelTitle.isDisplayed()).toEqual(true);
        expect(await firstBetPanelPO.panelTitle.getText()).toEqual("Squad Bet Single @1.9");
        expect(await firstBetPanelPO.panelSupportingText.getText()).toEqual("João To Score More Goals Than Mota");
      });

      it("[PRPI-7088] And the label 'Won' is displayed", async () => {
        expect(await betStatusLabelPO.element.isDisplayed()).toBe(true);
        expect(await betStatusLabelPO.text.getText()).toBe("Won");
      });
    });
  });
});
