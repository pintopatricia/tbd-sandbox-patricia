const {
  MarketPagePO,
  AppPO,
  FullScreenModalPO,
  MarketRulesSectionPO,
  MarketBlurbsPO,
} = require("../../../../../page-objects");
const { getMarkets } = require("@flutter-global/uki-channels-http-clients/mock-index").ERO;
const MarketRulesPO = require("@ppb/tbd-shared/components/MarketRulesCard/MarketRules/MarketRules.web.po");
const { getMarketLayout, getMarketRulesLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const marketPagePO = new MarketPagePO();
const fullScreenModalPO = new FullScreenModalPO();
const marketRulesPO = new MarketRulesPO(fullScreenModalPO.element);
const marketBlurbs = new MarketBlurbsPO();

const firstMarketRulesSection = new MarketRulesSectionPO(marketRulesPO.sections[0]);
const secondMarketRulesSection = new MarketRulesSectionPO(marketRulesPO.sections[1]);
const thirdMarketRulesSection = new MarketRulesSectionPO(marketRulesPO.sections[2]);
const fourthMarketRulesSection = new MarketRulesSectionPO(marketRulesPO.sections[3]);
const fifthMarketRulesSection = new MarketRulesSectionPO(marketRulesPO.sections[4]);
const sixthMarketRulesSection = new MarketRulesSectionPO(marketRulesPO.sections[5]);
const seventhMarketRulesSection = new MarketRulesSectionPO(marketRulesPO.sections[6]);

const mockService = new MockService();
const EXCHANGE_MARKET_ID = "1.123456789";
const EVENT_ID = "29682729";

const BFF_MOCK_URN = `ppb:tbd:view:market:${EXCHANGE_MARKET_ID}`;

const getMarketMock = (withMarketRules) => ({
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

  marketRulesViewLink: withMarketRules
    ? {
        viewUrn: `ppb:tbd:view:marketRules:${EXCHANGE_MARKET_ID}`,
        viewUrl: "",
      }
    : undefined,
});

const getMockBFF = ({ withMarketRules }) => ({
  urn: BFF_MOCK_URN,
  mainMarket: getMarketMock(withMarketRules),
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture##${EVENT_ID}`,
        sportevent: {
          __typename: "SportsEvent",
          urn: `ppb:event:${EVENT_ID}`,
        },
        fixture: {
          urn: `ppb:fixture:${EVENT_ID}`,
          home: {
            name: "Chelsea",
          },
          away: {
            name: "Tottenham",
          },
        },
      },
    },
    {
      node: {
        __typename: "MarketExtendedCard",
        urn: `ppb:tbd:card:marketExtended##${EXCHANGE_MARKET_ID}##924.222615412`,
        cardTitle: "Match Odds",
        displayRunners: {
          exchange: {
            market: getMarketMock(withMarketRules),
            runners: [
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/55190/0` },
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/48224/0` },
              { runnerURN: `ppb:excRunner:${EXCHANGE_MARKET_ID}/58805/0` },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: `pb:tbd:card:quickLinks:view:event;${EVENT_ID}`,
        sportevent: {
          name: "Chelsea v Tottenham",
          eventId: EVENT_ID,
        },
      },
    },
  ],
});

const ERO_MOCK = [
  {
    marketId: EXCHANGE_MARKET_ID,
    runners: [
      {
        selectionId: "55190",
        availableToBack: [{ price: 1.1, size: 100 }],
        availableToLay: [{ price: 1.2, size: 110 }],
      },
      {
        selectionId: "48224",
        availableToBack: [{ price: 2.1, size: 200 }],
        availableToLay: [{ price: 2.2, size: 210 }],
      },
      {
        selectionId: "58805",
        availableToBack: [{ price: 3.1, size: 300 }],
        availableToLay: [{ price: 3.2, size: 310 }],
      },
    ],
  },
];

const MARKET_RULES_MOCK = {
  urn: `ppb:tbd:view:marketRules:${EXCHANGE_MARKET_ID}`,
  edges: [
    {
      urn: `ppb:tbd:card:marketRules:${EXCHANGE_MARKET_ID}`,
      sections: [
        {
          name: "MARKET_INFORMATION",
          content:
            "Predict the result of this match.<br><b><font color=red> All bets apply to Full Time according to the match officials, plus any stoppage time.  Extra-time/penalty shoot-outs are not included.</b></font>",
        },
        {
          name: "CUSTOMER_AWARENESS",
          content:
            "<li>Transmissions described as “live” by some broadcasters may actually be delayed</li><br><li>The extent of any such delay may vary, depending on the set-up through which they are receiving pictures or data.</b>",
        },
      ],
    },
  ],
};

describe("Given I am on the Football Market Page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_URN));
    await mockService.mockHttpRequest(getMarkets(ERO_MOCK));
  });

  describe("when market rules are available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMarketLayout(getMockBFF({ withMarketRules: true })));
      await mockService.mockHttpRequest(getMarketRulesLayout(MARKET_RULES_MOCK));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MARKET_ID));
      await browser.waitUntil(AppPO.exchangeRunnerBetButtonHasPrice({ market: marketPagePO.element, price: 1.1 }));
      await browser.waitUntilDisplayed(marketBlurbs.marketInfoButton);
    });

    it("[PRPI-6144] should have market rules button present in the page", async () => {
      expect(await marketBlurbs.marketInfoButton.isDisplayed()).toEqual(true);
    });

    describe("when user opens the market rules modal", () => {
      beforeAll(async () => {
        await marketBlurbs.marketInfoButton.click();
        await browser.waitUntilDisplayed(fullScreenModalPO.headerTitle);
        await browser.waitUntilEquals(seventhMarketRulesSection.title, "Customer Awareness");
      });

      it("[PRPI-6145] should show correct modal title", async () => {
        expect(await fullScreenModalPO.headerTitle.getText()).toBe("Market Rules");
      });

      it("[PRPI-6146] should have 7 sections", async () => {
        expect(await marketRulesPO.sections.length).toEqual(7);
      });

      describe("first section 'Commission on this market'", () => {
        it("[PRPI-6147] should have correct title", async () => {
          expect(await firstMarketRulesSection.title.getText()).toEqual("Commission on this market");
        });

        it("[PRPI-6148] should have market base rate", async () => {
          expect(await firstMarketRulesSection.sectionParagraphs.length).toEqual(2);
          expect(await firstMarketRulesSection.sectionParagraphs[0].getText()).toEqual("3% Discounted Rate");
        });

        it("[PRPI-6149] should have discount allowed option", async () => {
          expect(await firstMarketRulesSection.sectionParagraphs[1].getText()).toEqual(
            "(Minus your discount if applicable)",
          );
        });

        it("[PRPI-6150] should have discount rate explanation link", async () => {
          const sectionLink = await firstMarketRulesSection.sectionLinks[0];

          expect(await sectionLink.getText()).toEqual("Your Discount Rate explained");
          expect((await sectionLink.getAttribute("href")).startsWith("//support.betfair")).toBe(true);
        });
      });

      describe("second section Event Start Time", () => {
        it("[PRPI-6151] should have correct title", async () => {
          expect(await secondMarketRulesSection.title.getText()).toEqual("Event Start Time");
        });

        it("[PRPI-6152] should have event start date and time", async () => {
          expect(await secondMarketRulesSection.sectionParagraphs.length).toEqual(1);
          expect(await secondMarketRulesSection.sectionParagraphs[0].getText()).toEqual("January 7, 2020 at 20:00");
        });
      });

      describe("third section Clarifications", () => {
        it("[PRPI-6153] should have correct title", async () => {
          expect(await thirdMarketRulesSection.title.getText()).toEqual("Clarifications");
        });

        it("[PRPI-6154] should have correct content", async () => {
          expect(await thirdMarketRulesSection.content.getText()).toEqual("Rules section clarification");
        });
      });

      describe("fourth section Wallet", () => {
        it("[PRPI-6155] should have correct title ", async () => {
          expect(await fourthMarketRulesSection.title.getText()).toEqual("Wallet");
        });

        it("[PRPI-6156] should have correct content", async () => {
          expect(await fourthMarketRulesSection.content.getText()).toEqual("UK wallet");
        });
      });

      describe("fifth section Rules", () => {
        it("[PRPI-6157] should have correct title", async () => {
          expect(await fifthMarketRulesSection.title.getText()).toEqual("Rules");
        });

        it("[PRPI-6158] should have correct content", async () => {
          expect(await fifthMarketRulesSection.content.getText()).toEqual(`1 to be placed`);
        });
      });

      describe("sixth section Market Information", () => {
        it("[PRPI-6159] should have correct title", async () => {
          expect(await sixthMarketRulesSection.title.getText()).toEqual("Market Information");
        });

        it("[PRPI-6160] should have correct content", async () => {
          expect(await sixthMarketRulesSection.content.getText()).toEqual(`Predict the result of this match.
All bets apply to Full Time according to the match officials, plus any stoppage time. Extra-time/penalty shoot-outs are not included.`);
        });
      });

      describe("seventh section Customer Awareness", () => {
        it("[PRPI-6161] should have correct title", async () => {
          expect(await seventhMarketRulesSection.title.getText()).toEqual("Customer Awareness");
        });

        it("[PRPI-6162] should have correct content", async () => {
          expect(await seventhMarketRulesSection.content.getText())
            .toEqual(`Transmissions described as “live” by some broadcasters may actually be delayed

The extent of any such delay may vary, depending on the set-up through which they are receiving pictures or data.`);
        });
      });

      it("[PRPI-6163] should have market rules footer", async () => {
        expect(await marketRulesPO.footer.getText()).toEqual("For further information please see Rules & Regs.");
        expect(await marketRulesPO.footerLink.getAttribute("href")).toEqual(
          "http://content.betfair.com/aboutus/content.asp?sWhichKey=Rules%20and%20Regulations#undefined.do",
        );
      });
    });
  });

  describe("when market rules are not available", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_URN));
      await mockService.mockHttpRequest(getMarketLayout(getMockBFF({ withMarketRules: false })));
      await browser.url(routes.getMarketViewUrl(EXCHANGE_MARKET_ID));
      await browser.waitUntil(AppPO.exchangeRunnerBetButtonHasPrice({ market: marketPagePO.element, price: 1.1 }));
    });

    it("[PRPI-6164] should not have market rules button present in the page", async () => {
      expect(await marketBlurbs.marketInfoButton.isExisting()).toEqual(false);
    });
  });
});
