const { SegmentedControlPO, SportsbookBetButtonPO, NumberInputFieldPO } = require("../../../../../page-objects");
const { getGenericLayout, getUpdatedPreference } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const { SMP, SIB } = require("@flutter-global/uki-channels-http-clients/mock-index");
const PreferenceSingleChoiceCardPO = require("@ppb/tbd-shared/components/PreferenceSingleChoiceCard/PreferenceSingleChoiceCard.po");

const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { getHomeViewUrl } = require("../../../../../../utils/routes");

const { getMarketPrices } = SMP;
const { getImplyBetsResponse } = SIB;

const mockService = new MockService();
const preferenceSingleChoiceCardPO = new PreferenceSingleChoiceCardPO();
const firstSportsbookBetButtonPO = new SportsbookBetButtonPO();
const numberInputFieldPO = new NumberInputFieldPO();

const segmentedControlPO = new SegmentedControlPO(preferenceSingleChoiceCardPO.toggleContainer);
const SPORTSBOOK_MARKET_ID = "924.1";
const EVENT_ID = "1";

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        urn: `ppb:tbd:card:${SPORTSBOOK_MARKET_ID}##MATCH_ODDS`,
        typename: "MarketCard",
        cardTitle: "Match Odds",
        displayRunners: {
          sportsbook: {
            market: {
              __typename: "SportsbookMarket",
              urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
              noLiveData: true,
              name: "Match Odds",
              hierarchy: {
                __typename: "EventHierarchy",
                sportevent: {
                  urn: `ppb:event:${EVENT_ID}`,
                },
              },
              runners: [
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/1`,
                  selectionId: 1,
                  name: "Rebuild",
                },
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/2`,
                  selectionId: 2,
                  name: "Desktop",
                },
                {
                  runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/3`,
                  selectionId: 3,
                  name: "Test",
                },
              ],
            },
            runners: [
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/1` },
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/2` },
              { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/3` },
            ],
          },
        },
      },
    },
    {
      node: {
        __typename: "PreferenceSingleChoiceCard",
        urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay|SEGMENTED",
        title: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.TITLE",
        description: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.DESCRIPTION",
        cardLayout: "SEGMENTED",
        preference: {
          __typename: "PreferenceSingleChoice",
          urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
          preferenceKey: "sportsbookOddsDisplay",
          preferenceValues: [
            {
              value: "FRACTIONAL",
              translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.FRACTIONAL",
            },
            {
              value: "DECIMAL",
              translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.DECIMAL",
            },
            {
              value: "AMERICAN",
              translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.AMERICAN",
            },
          ],

          selectedValueIndex: 1,
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        urn: `ppb:tbd:card:${SPORTSBOOK_MARKET_ID}##MATCH_ODDS`,
        __typename: "MarketCard",
      },
    },
    {
      node: {
        __typename: "PreferenceSingleChoiceCard",
        urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay|SEGMENTED",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          selectionId: "1",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2 },
            fractionalDisplayOdds: { numerator: 2, denominator: 3 },
            americanDisplayOdds: { americanOdds: 100.0, americanOddsInt: 100 },
          },
        },
        {
          selectionId: "2",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3 },
            fractionalDisplayOdds: { numerator: 3, denominator: 4 },
            americanDisplayOdds: { americanOdds: 200.0, americanOddsInt: 200 },
          },
        },
        {
          selectionId: "3",
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 4 },
            fractionalDisplayOdds: { numerator: 4, denominator: 5 },
            americanDisplayOdds: { americanOdds: 300.0, americanOddsInt: 300 },
          },
        },
      ],
    },
  ],
};

const SINGLE_MOCK = {
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

  betMinStake: 0.12,
  betMaxStake: 1000,
  averageOdds: 1.1,
  winAverageOdds: 1.1,
  betMinStakeIncrement: 0.01,
  winAvgOdds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    fractionalDisplayOdds: { numerator: 2, denominator: 3 },
    americanDisplayOdds: { americanOdds: 100.0, americanOddsInt: 100 },
  },
};

const SINGLE_ODDS_MOCK = {
  runner: {
    marketId: "924.1",
    selectionId: 1,
  },
  odds: {
    trueOdds: {
      decimalOdds: { decimalOdds: 2 },
    },
    fractionalDisplayOdds: { numerator: 2, denominator: 3 },
    americanDisplayOdds: { americanOdds: 100.0, americanOddsInt: 100 },
  },
};

const SIB_MOCK = {
  betCombinations: [SINGLE_MOCK],
  runnerOdds: [SINGLE_ODDS_MOCK],
};

const FRACTIONAL_PREFERENCE_UPDATE_MOCK = {
  urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
  data: {
    setPreferences: {
      result: [
        {
          __typename: "PreferenceSingleChoice",
          preferenceValues: [
            {
              value: "FRACTIONAL",
              translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.FRACTIONAL",
            },
            {
              value: "DECIMAL",
              translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.DECIMAL",
            },
            {
              value: "AMERICAN",
              translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.AMERICAN",
            },
          ],

          selectedValueIndex: 0,
        },
      ],

      error: [],
    },
  },
};

const AMERICAN_PREFERENCE_UPDATE_MOCK = {
  urn: "ppb:tbd:preference:singleChoice:sportsbookOddsDisplay",
  data: {
    setPreferences: {
      result: [
        {
          __typename: "PreferenceSingleChoice",
          preferenceValues: [
            {
              value: "FRACTIONAL",
              translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.FRACTIONAL",
            },
            {
              value: "DECIMAL",
              translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.DECIMAL",
            },
            {
              value: "AMERICAN",
              translationKey: "I18N.PREFERENCES.SPORTSBOOK_ODDS_DISPLAY.AMERICAN",
            },
          ],

          selectedValueIndex: 2,
        },
      ],

      error: [],
    },
  },
};

describe("Odds Display", () => {
  beforeAll(async () => {
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK, { withBottomBar: false }));
    await mockService.mockHttpRequest(getSSCHeaderCSS());
    await mockService.mockHttpRequest(getSSCv1Content());
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await browser.url(getHomeViewUrl());
  });

  describe("when BFF returns odds display", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(preferenceSingleChoiceCardPO.element);
    });

    it("[PRPI-5103]The odds display should be correctly displayed", async () => {
      expect(await firstSportsbookBetButtonPO.odd.getText()).toEqual("2");
    });
  });

  describe("and there is a click on the radio button to switch to fractional", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getUpdatedPreference(FRACTIONAL_PREFERENCE_UPDATE_MOCK, "SetSingleChoicePreferenceMutation"),
      );

      const fractionalOption = segmentedControlPO.options[0];
      await fractionalOption.waitForClickable();
      await fractionalOption.click();

      await browser.waitUntilContainsText(segmentedControlPO.selectedOption, "Fractional");
    });

    it("[PRPI-5816]_should_switch_preference_to_fractional", async () => {
      expect(await firstSportsbookBetButtonPO.odd.getText()).toEqual("2/3");
    });
  });

  describe("and a bet is added to betslip", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getImplyBetsResponse(SIB_MOCK));
      await firstSportsbookBetButtonPO.element.waitForClickable();
      await firstSportsbookBetButtonPO.element.click();
    });

    it("[PRPI-5104]Should add bet to betslip", async () => {
      expect(await numberInputFieldPO.numberField.getValue()).toBe("2/3");
    });
  });
  describe("and there is a click on the radio button to switch to American", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(
        getUpdatedPreference(AMERICAN_PREFERENCE_UPDATE_MOCK, "SetSingleChoicePreferenceMutation"),
      );

      const americanOption = segmentedControlPO.options[2];
      await americanOption.waitForClickable();
      await americanOption.click();

      await browser.waitUntilContainsText(segmentedControlPO.selectedOption, "American");
    });

    it("[PRPI-5105]Should switch preference to american", async () => {
      expect(await numberInputFieldPO.numberField.getValue()).toBe("+100");
    });
  });
});
