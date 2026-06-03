const {
  AnimatedIconPO,
  ScrollableSwimlanePO,
  EventPagePO,
  HalfTimeSpecialsSwimlaneCardGroupPO,
  MatchStatSelectionCardPO,
  SportsbookBetButtonPO,
  SportsbookPlacePanelPO,
  BetDetailsPO,
  CurrencyNumberInputFieldPO,
  SportsbookReceiptPanelPO,
  BetControlsPO,
} = require("../../../../../page-objects");
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getPlaceBet } = require("@flutter-global/uki-channels-http-clients/mock-index").SPB;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const routes = require("../../../../../../utils/routes");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

// mocks for swimlane and card
const mockService = new MockService();
const eventPagePO = new EventPagePO();
const htsSwimlanePO = new HalfTimeSpecialsSwimlaneCardGroupPO(eventPagePO.halfTimeSpecialsSwimlaneCardGroups[0]);
const scrollableSwimlanePO = new ScrollableSwimlanePO(htsSwimlanePO.scrollableSwimlane);
const htsCardPO = new MatchStatSelectionCardPO(scrollableSwimlanePO.matchStatSelectionCards[0]);

// mocks for placing bet
const htsBetButtonPO = new SportsbookBetButtonPO(htsCardPO.sportsbookBetButton);
const placePanelPO = new SportsbookPlacePanelPO();
const betDetailsPO = new BetDetailsPO(placePanelPO.element);
const controlsPO = new BetControlsPO(placePanelPO.element);
const sportsbookStakeInputPO = new CurrencyNumberInputFieldPO(controlsPO.currencyInput);
const sportsbookReceiptPanelPO = new SportsbookReceiptPanelPO();

// mock data
const EVENT_ID = 12345;
const EVENT_TYPE_ID = 1;
const COMPETITION_ID = 123451;

const SPORT_MOCK = {
  urn: `ppb:eventType:${EVENT_TYPE_ID}`,
  name: "Football",
  sportId: EVENT_TYPE_ID,
};

const COMPETITION_MOCK = {
  urn: `ppb:competition:${COMPETITION_ID}`,
  name: "English Premier League",
  competitionId: COMPETITION_ID,
  sport: SPORT_MOCK,
};

const EVENT_MOCK = {
  __typename: "SportsEvent",
  urn: `ppb:event:${EVENT_ID}`,
  eventId: EVENT_ID,
  name: "Team A v Team B",
  openDate: "2021-06-15T11:00:00Z",
  competition: COMPETITION_MOCK,
  sport: SPORT_MOCK,
};

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
  sportevent: EVENT_MOCK,
  edges: [
    {
      node: {
        __typename: "HalfTimeSpecialsSwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:halfTimeSpecialsSwimlane:aCyq4RAAACMAaNgm/e/${EVENT_ID}`,
        halfTimeSpecialsCardGroupTitle: "Half down. Bets up.",
        cardGroupSubtitle: "We have got some fresh bets. Get your stakes in before the end of the half-time break.",
        displayName: null,
        isDecorated: false,
        isIconSupportingTitle: false,
        halfTimeSpecialsFull: {
          edges: [
            {
              __typename: "HalfTimeSpecialsSwimlaneCardGroupItemEdge",
              node: {
                __typename: "MatchStatSelectionCard",
                urn: "ppb:tbd:card:matchStatSelection:924.1/1",
                matchStatTitle: {
                  playerNames: ["Kaka", "Pele"],
                  combiner: "AND",
                  __typename: "MatchStatTitle",
                },
                matchStatSubtitle: "To have 6 or more shots on target",
                statsDescription: "0 each so far",
                incidentType: "Shots",
                market: {
                  __typename: "SportsbookMarket",
                  urn: "ppb:sbkMarket:924.1",
                  name: "#OddsOnThat - 2nd Half",
                  marketType: "#WHATODDSPADDY_-_2ND_HALF",
                  marketTypeName: null,
                  bettingType: "ODDS",
                  hierarchy: {
                    __typename: "EventCompetitionHierarchy",
                    sportevent: EVENT_MOCK,
                    competition: COMPETITION_MOCK,
                  },
                  sport: SPORT_MOCK,
                  runners: [
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.1/1",
                      name: "Kaka & Pele  To have 6 or more shots on target  (0 each so far)",
                      selectionId: 1,
                      handicap: 0,
                      resultType: null,
                    },
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.1/83471676",
                      name: "Casemiro / Rodri  To commit 4 or more fouls  (Casemiro: 3 Fouls)  (Rodri: 2 Fouls)",
                      selectionId: 83471676,
                      handicap: 0,
                      resultType: null,
                    },
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.1/83471674",
                      name: "Erling Haaland & Dusan Vlahovic  To combine for 6 or more shots on target  (3 Shots combined so far)",
                      selectionId: 83471674,
                      handicap: 0,
                      resultType: null,
                    },
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.1/83471675",
                      name: "Erling Haaland & Dusan Vlahovic  To have 3 or more Shots on Target each   (E. Haaland: 2 SoTs)  (Dusan Vlahovic: 1 SoT)",
                      selectionId: 83471675,
                      handicap: 0,
                      resultType: null,
                    },
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.1/83471679",
                      name: "Robert Lewandoski   To Score more Goals than Real Madrid   (R. Lewandoski: 2 Goals)  (Real Madrid: 1 Goal)",
                      selectionId: 83471679,
                      handicap: 0,
                      resultType: null,
                    },
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.1/83471677",
                      name: "Casemiro & Rodri  To combine for 6 or more fouls  (4 Fouls combined so far)",
                      selectionId: 83471677,
                      handicap: 0,
                      resultType: null,
                    },
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.1/83471680",
                      name: "Erling Haaland  To score a goal before Bruno Fernandes  (E. Haaland: 0 Goals)  (B. Fernandes: 0 Goals)",
                      selectionId: 83471680,
                      handicap: 0,
                      resultType: null,
                    },
                    {
                      __typename: "Runner",
                      runnerURN: "ppb:sbkRunner:924.1/83471678",
                      name: "Erling Haaland & Dusan Vlahovic  To have 6 or more shots on target  (0 each so far)",
                      selectionId: 83471678,
                      handicap: 0,
                      resultType: null,
                    },
                  ],

                  isOddsboostMarketType: false,
                  isSuperSub: false,
                  isAccaFreezeEligible: false,
                },
                runner: {
                  runnerURN: "ppb:sbkRunner:924.1/1",
                  __typename: "Runner",
                },
              },
            },
          ],

          __typename: "HalfTimeSpecialsSwimlaneCardGroupItemsConnection",
        },
        halfTimeSpecialsPartials: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:matchStatSelection:924.1/1",
                __typename: "MatchStatSelectionCard",
              },
              __typename: "HalfTimeSpecialsSwimlaneCardGroupItemEdge",
            },
          ],

          __typename: "HalfTimeSpecialsSwimlaneCardGroupItemsConnection",
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "HalfTimeSpecialsSwimlaneCardGroup",
        urn: `ppb:tbd:cardgroup:halfTimeSpecialsSwimlane:aCyq4RAAACMAaNgm/e/${EVENT_ID}`,
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: [
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.1 },
            },
          ],
        },
      ],
    },
  ],
};

const SPB_MOCK = {
  result: [
    {
      totalStake: 1.01,
      runners: [
        {
          runner: { marketId: "924.1", selectionId: 1 },
          odds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
        },
      ],

      legs: [
        {
          leg: {
            betRunners: [{ runner: { marketId: "924.1", selectionId: 1 } }],
          },
          winOdds: {
            decimalDisplayOdds: { decimalOdds: 1.2 },
          },
        },
      ],

      totalPotentialWin: 2,
    },
  ],
};

const SIB_MOCK = {
  betCombinations: [
    {
      legCombinations: [
        {
          runners: [
            {
              marketId: "924.1",
              selectionId: 1,
            },
          ],
        },
      ],

      winAverageOdds: 1.2,
      winAvgOdds: {
        decimalDisplayOdds: { decimalOdds: 1.2 },
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
      },
      averageOdds: 1.2,
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: "924.1",
        selectionId: 1,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.1 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.2,
        },
      },
    },
  ],
};

describe("OBB - Half Time Specials", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));
    await browser.url(routes.getEventViewUrl(EVENT_ID));

    await browser.waitUntilDisplayed(htsSwimlanePO.element);
    await browser.waitUntilDisplayed(scrollableSwimlanePO.element);
    await browser.waitUntilDisplayed(htsCardPO.element);
  });

  describe("When the Half Time Specials swimlane is displayed", () => {
    it("[PRPI-5188]The title, subtitle, and animated icon should be displayed", async () => {
      const animatedIconPO = new AnimatedIconPO(htsSwimlanePO.animatedIcon);
      await browser.waitUntilDisplayed(animatedIconPO.element);

      expect(await htsSwimlanePO.title.getText()).toBe("Half down. Bets up.");
      expect(await htsSwimlanePO.subtitle.getText()).toBe(
        "We have got some fresh bets. Get your stakes in before the end of the half-time break.",
      );

      expect(await animatedIconPO.element.isDisplayed()).toBeTrue();
      expect(await animatedIconPO.text.getText()).toBe("NEW");
    });

    describe("With at least one card", () => {
      it("[PRPI-5189]The card title and subtitle should be displayed", async () => {
        expect(await htsCardPO.title.getText()).toBe("Kaka\nAND\nPele");
        expect(await htsCardPO.subtitle.getText()).toBe("To have 6 or more shots on target");
      });
    });
  });

  describe("When the user clicks on the bet button of a Half Time Specials card", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(htsBetButtonPO.element);
      await htsBetButtonPO.element.click();
      await browser.waitUntilDisplayed(placePanelPO.element);
    });

    it("[PRPI-5190]The betslip should be displayed with the correct selection", async () => {
      expect(await placePanelPO.element.isDisplayed()).toBeTrue();
      expect(await betDetailsPO.title.getText()).toBe(
        "Kaka &amp; Pele To have 6 or more shots on target (0 each so far)",
      );
    });

    it("[PRPI-5191]The user can change the odds and place the bet", async () => {
      await sportsbookStakeInputPO.setValue("1.01");
      await mockService.mockHttpRequest(getPlaceBet(SPB_MOCK));
      await placePanelPO.place.click();
      await browser.waitUntilDisplayed(sportsbookReceiptPanelPO.element);

      expect(await sportsbookReceiptPanelPO.element.isDisplayed()).toBeTrue();
    });
  });
});
