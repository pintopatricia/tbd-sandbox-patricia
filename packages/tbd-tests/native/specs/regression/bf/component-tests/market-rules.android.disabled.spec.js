const MarketRulesContentSO = require("@ppb/tbd-shared/components/MarketRulesCard/MarketRules/MarketRulesContent/MarketRulesContent.native.so");

const {
  getMarketLayout,
  getMarketRulesLayout,
  getEventLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const MockService = require("../../../../mock-essentials/mocking-service");

const {
  GenericScreenSO,
  CardSO,
  MarketRulesSectionSO,
  MarketBlurbsSO,
  ExchangeMarketSO,
  TabsGroupSO,
  ModalHeaderSO,
} = require("../../../../screen-objects");

const mockService = new MockService();

const modalHeaderSO = new ModalHeaderSO();
const genericScreenSO = new GenericScreenSO();
const marketRulesContentSO = new MarketRulesContentSO();

const cardSO = new CardSO(genericScreenSO.element);
const exchangeMarketSO = new ExchangeMarketSO(cardSO.exchangeMarket);
const marketBlurbsSO = new MarketBlurbsSO(exchangeMarketSO.blurbs);
const modalTabsSO = new TabsGroupSO();

const firstMarketRulesSectionSO = new MarketRulesSectionSO(marketRulesContentSO.sections[0]);
const secondMarketRulesSectionSO = new MarketRulesSectionSO(marketRulesContentSO.sections[1]);
const thirdMarketRulesSectionSO = new MarketRulesSectionSO(marketRulesContentSO.sections[2]);
const fourthMarketRulesSectionSO = new MarketRulesSectionSO(marketRulesContentSO.sections[3]);
const fifthMarketRulesSectionSO = new MarketRulesSectionSO(marketRulesContentSO.sections[4]);
const sixthMarketRulesSectionSO = new MarketRulesSectionSO(marketRulesContentSO.sections[5]);
const seventhMarketRulesSectionSO = new MarketRulesSectionSO(marketRulesContentSO.sections[6]);

const thirdMarketRulesSectionContent = marketRulesContentSO.contentList[0];
const fourthMarketRulesSectionContent = marketRulesContentSO.contentList[1];
const fifthMarketRulesSectionContent = marketRulesContentSO.contentList[2];
const sixthMarketRulesSectionContent = marketRulesContentSO.contentList[3];
const seventhMarketRulesSectionContent = marketRulesContentSO.contentList[4];

const EVENT_ID = "29682729";
const EXCHANGE_MARKET_ID = "1.123456789";
const SPORTSBOOK_MARKET_ID = "924.222615412";

const BFF_FIXTURE_CARD = {
  node: {
    __typename: "FixtureCard",
    urn: `ppb:tbd:card:fixture:${EVENT_ID}|viewLink`,
    sportevent: {
      __typename: "SportsEvent",
      urn: `ppb:event:${EVENT_ID}`,
    },
    fixture: {
      urn: `ppb:fixture:${EVENT_ID}`,
      home: {
        name: "Chelsea",
        color: null,
        crest: null,
      },
      away: {
        name: "Tottenham",
        color: null,
        crest: null,
      },
      scheduledAt: "2020-02-22T12:30Z",
      duration: {
        period: "REGULAR",
        status: "PRE_MATCH",
      },
      penaltyShootout: null,
    },
    fixtureEventViewLink: {
      viewUrn: `ppb:tbd:view:event:${EVENT_ID}`,
      viewUrl: `/soccer/english-premier-league/chelsea-v-tottenham/e-${EVENT_ID}`,
    },
  },
};

const BFF_EXCHANGE_MARKET = {
  eventId: EVENT_ID,
  __typename: "ExchangeMarket",
  urn: `ppb:excMarket:${EXCHANGE_MARKET_ID}`,
  name: "Match Odds",
  marketType: "MATCH_ODDS",
  bettingType: "ODDS",
  hierarchy: {
    __typename: "EventHierarchy",
    sportevent: {
      urn: `ppb:event:${EVENT_ID}`,
      name: "Chelsea v Tottenham",
    },
  },
  runners: [
    {
      __typename: "Runner",
      runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/55190/0`,
      name: "Chelsea",
      selectionId: 55190,
      handicap: 0,
    },
    {
      __typename: "Runner",
      runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48224/0`,
      name: "Tottenham",
      selectionId: 48224,
      handicap: 0,
    },
    {
      __typename: "Runner",
      runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/58805/0`,
      name: "The Draw",
      selectionId: 58805,
      handicap: 0,
    },
  ],

  marketRulesViewLink: {
    viewUrn: `ppb:tbd:view:marketRules:${EXCHANGE_MARKET_ID}`,
    viewUrl: "",
  },
};

const BFF_MARKET_VIEW_MOCK = {
  urn: `ppb:tbd:view:market:${EXCHANGE_MARKET_ID}`,
  mainMarket: BFF_EXCHANGE_MARKET,
  edges: [
    BFF_FIXTURE_CARD,
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: `ppb:tbd:card:marketExtended:${EXCHANGE_MARKET_ID};${SPORTSBOOK_MARKET_ID}`,
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: BFF_EXCHANGE_MARKET,
            runners: [
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/55190/0` },
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48224/0` },
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/58805/0` },
            ],
          },
        },
      },
    },
  ],
};

const MARKET_RULES_MOCK = {
  urn: `ppb:tbd:view:marketRules:${EXCHANGE_MARKET_ID}`,
  edges: [
    {
      urn: `ppb:tbd:card:marketRules:${EXCHANGE_MARKET_ID}`,
      sections: [
        {
          name: "MARKET_INFORMATION",
          content:
            "Predict the result of this match.<br><b><font color=red>All bets apply to Full Time according to the match officials, plus any stoppage time. Extra-time/penalty shoot-outs are not included.</b></font>",
        },
        {
          name: "CUSTOMER_AWARENESS",
          content:
            "Transmissions described as “live” by some broadcasters may actually be delayed<br>The extent of any such delay may vary, depending on the set-up through which they are receiving pictures or data.",
        },
      ],
    },
  ],
};

const BFF_EVENT_VIEW_MOCK = {
  __typename: "EventView",
  urn: "ppb:tbd:view:event:29682729",
  sportevent: {
    eventId: 29682729,
    name: "Chelsea v Man Utd",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        away: "Chelsea",
        home: "Man Utd",
        sportevent: {
          eventName: "Chelsea v Man Utd",
          urn: "ppb:event:29682729",
          __typename: "SportsEvent",
        },
        urn: "ppb:tbd:card:fixture##29682729",
        fixture: {
          urn: "ppb:fixture:29682729",
          home: {
            name: "Chelsea",
            color: "f9f9fa",
          },
          away: {
            name: "Man Utd",
            color: "050b5c",
          },
          scheduledAt: "2021-02-17T20:00Z",
          duration: {},
        },
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.179657117;924.254652329",
        viewLinks: [
          {
            viewUrn: `ppb:tbd:view:market:123`,
            viewUrl: `/football/english-premier-league/chelsea-man-utd/match-odds/m-123`,
          },
          {
            viewUrn: `ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`,
            viewUrl: `/football/english-premier-league/chelsea-man-utd/match-odds/m-${SPORTSBOOK_MARKET_ID}`,
          },
        ],

        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: {
              __typename: "ExchangeMarket",
              urn: `ppb:excMarket:123`,
              name: "Match Odds",
              marketType: "MATCH_ODDS",
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:12345",
                  name: "English Premier League",
                  competitionId: 12345,
                },
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:29682729",
                  name: "Chelsea v Tottenham",
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:excRunner:1.987654321/48044/0",
                  name: "Chelsea",
                  selectionId: 48044,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:excRunner:1.987654321/48351/0",
                  name: "Tottenham",
                  selectionId: 48351,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:excRunner:1.987654321/58805/0",
                  name: "The Draw",
                  selectionId: 58805,
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:excRunner:1.987654321/48044/0" },
              { runnerURN: "ppb:excRunner:1.987654321/48351/0" },
              { runnerURN: "ppb:excRunner:1.987654321/58805/0" },
            ],
          },
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              name: "Match Odds",
              marketType: "MATCH_ODDS",
              hierarchy: {
                __typename: "EventCompetitionHierarchy",
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:12345",
                  name: "English Premier League",
                  competitionId: 12345,
                },
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:29682729",
                  name: "Chelsea v Tottenham",
                },
              },
              runners: [
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.222615412/48044",
                  name: "Chelsea",
                  selectionId: 48044,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.222615412/48351",
                  name: "Tottenham",
                  selectionId: 48351,
                },
                {
                  __typename: "Runner",
                  runnerURN: "ppb:sbkRunner:924.222615412/58805",
                  name: "The Draw",
                  selectionId: 58805,
                },
              ],
            },
            runners: [
              { runnerURN: "ppb:sbkRunner:924.222615412/48044" },
              { runnerURN: "ppb:sbkRunner:924.222615412/48351" },
              { runnerURN: "ppb:sbkRunner:924.222615412/58805" },
            ],
          },
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture##29682729",
      },
    },
    {
      node: {
        __typename: "MarketCard",
        urn: "ppb:tbd:card:market:1.179657117;924.254652329",
      },
    },
  ],
};

describe("Market Rules", () => {
  describe("When user enters a market view with exchange market", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MARKET_VIEW_MOCK));
      await mockService.mockHttpRequest(getMarketRulesLayout(MARKET_RULES_MOCK));
      const url = `sport/competition/event/market/m-${EXCHANGE_MARKET_ID}`;
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(marketBlurbsSO.marketInfoButton);
    });

    it("[PRPI-2267] The market rules button should be displayed", async () => {
      expect(await marketBlurbsSO.marketInfoButton.isDisplayed()).toBe(true);
    });

    describe("And when user taps on market rules button", () => {
      beforeAll(async () => {
        await browser.waitUntilDisplayed(marketBlurbsSO.marketInfoButton);
        await marketBlurbsSO.marketInfoButton.click();
        await browser.waitUntilEquals(seventhMarketRulesSectionSO.title, "Customer Awareness");
        await browser.waitUntilArrayLength(modalTabsSO.tabsTitles, (length) => length === 1);
      });

      it("[PRPI-2268] The market rules modal should be displayed", async () => {
        expect(await modalHeaderSO.title.getText()).toBe("Market Rules");
      });

      it("[PRPI-2269] The market rules close button should be displayed", async () => {
        expect(await modalHeaderSO.close.isDisplayed()).toBe(true);
      });

      it("[PRPI-2270] The market rules Exchange tab should be displayed", async () => {
        expect(await modalTabsSO.tabsTitles[0].getText()).toBe("Exchange");
      });

      it("[PRPI-2271] The section 'Commission on this market' should be displayed", async () => {
        expect(await firstMarketRulesSectionSO.title.getText()).toEqual("Commission on this market");
        expect(await marketRulesContentSO.marketBaseRate.getText()).toEqual("3% Discounted Rate");
        expect(await marketRulesContentSO.discountAllowed.getText()).toEqual("(Minus your discount if applicable)");
        expect(await marketRulesContentSO.discountRateExplained.getText()).toEqual("Your Discount Rate explained");
      });

      it("[PRPI-2272] The section 'Event Start Time' should be displayed", async () => {
        expect(await secondMarketRulesSectionSO.title.getText()).toEqual("Event Start Time");
        expect(await marketRulesContentSO.eventStartTime.getText()).toEqual("January 7, 2020 at 20:00");
      });

      it("[PRPI-2273] The section Clarifications' should be displayed", async () => {
        expect(await thirdMarketRulesSectionSO.title.getText()).toEqual("Clarifications");
        expect(await thirdMarketRulesSectionContent.getText()).toEqual("Rules section clarification");
      });

      it("[PRPI-2274] The section 'Wallet' should be displayed", async () => {
        expect(await fourthMarketRulesSectionSO.title.getText()).toEqual("Wallet");
        expect(await fourthMarketRulesSectionContent.getText()).toEqual("UK wallet");
      });

      it("[PRPI-2275] The section 'Rules' should be displayed", async () => {
        expect(await fifthMarketRulesSectionSO.title.getText()).toEqual("Rules");
        expect(await fifthMarketRulesSectionContent.getText()).toEqual("1 to be placed");
      });

      it("[PRPI-2276] The section 'Market Information' should be displayed", async () => {
        expect(await sixthMarketRulesSectionSO.title.getText()).toEqual("Market Information");
        expect(await sixthMarketRulesSectionContent.getText()).toEqual(`Predict the result of this match.
All bets apply to Full Time according to the match officials, plus any stoppage time. Extra-time/penalty shoot-outs are not included.`);
      });

      it("[PRPI-2277] The section 'Customer Awareness' should be displayed", async () => {
        expect(await seventhMarketRulesSectionSO.title.getText()).toEqual("Customer Awareness");
        expect(await seventhMarketRulesSectionContent.getText())
          .toEqual(`Transmissions described as “live” by some broadcasters may actually be delayed
The extent of any such delay may vary, depending on the set-up through which they are receiving pictures or data.`);
      });

      it("[PRPI-2278] The market rules footer section should be displayed", async () => {
        expect(await marketRulesContentSO.footer.getText()).toEqual("For further information please see Rules & Regs.");
      });

      describe("And when user taps on market rules close button", () => {
        beforeAll(async () => {
          await browser.waitUntilDisplayed(modalHeaderSO.close);
          await modalHeaderSO.close.click();
          await browser.waitUntilNotDisplayed(modalHeaderSO.element);
          await browser.waitUntilDisplayed(marketBlurbsSO.marketInfoButton);
        });

        it("[PRPI-2279] The market rules modal should not be displayed", async () => {
          expect(await modalHeaderSO.element.isDisplayed()).toBe(false);
        });

        it("[PRPI-2280] The market view should be displayed", async () => {
          expect(await exchangeMarketSO.element.isDisplayed()).toBe(true);
        });
      });
    });
  });
});
