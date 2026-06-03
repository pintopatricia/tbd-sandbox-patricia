const {
  SinglesCardPO,
  BetslipDrawerPO,
  BottomBarPO,
  SelectionsBoardPO,
  SportsbookPlacePanelPO,
} = require("../../../page-objects");
const { openPageAndAcceptCookieConsent } = require("../../../helpers/helper.util");
const { loginWithSSOID } = require("../../../helpers/login.util");
const { Weaver } = require("../../../../utils/weaver");
const { getHomeViewUrl } = require("../../../../utils/routes");
const { openPage } = require("../../../helpers/navigation.util");

const weaver = new Weaver();
const betslipDrawerPO = new BetslipDrawerPO();
const sportsbookPlacePanelPO = new SportsbookPlacePanelPO();
const singlesCardPO = new SinglesCardPO(sportsbookPlacePanelPO.element);
const selectionsBoardPO = new SelectionsBoardPO();
const bottomBarPO = new BottomBarPO();

function buildSmxQueryStr({ initialValue = "bets=", selections }) {
  const ENCODED_PIPE = encodeURIComponent("|");

  return selections.reduce((acc, selection) => {
    const isLast = selections[selections.length - 1] === selection;
    const { marketId, selectionId } = selection;
    const separator = isLast ? "" : ";";

    return `${acc}${marketId}${ENCODED_PIPE}${selectionId}${separator}`;
  }, initialValue);
}

function buildSmxSimpleSelectionQueryStr(selection) {
  return buildSmxQueryStr({
    initialValue: "?bets=SIMPLE_SELECTION:",
    selections: [selection],
  });
}

function buildSmxMultipleQueryStr(selections) {
  return buildSmxQueryStr({
    selections,
  });
}

function buildSbwQueryStr({ selections }) {
  const STATIC_PARAMS = "modules=betslip&action=addAffiliateSelections";
  const bssId = selections.map((selection) => selection.selectionId).join(",");
  const bsmId = selections.map((selection) => selection.marketId).join(",");
  return `${STATIC_PARAMS}&bssId=${bssId}&bsmId=${bsmId}`;
}

function buildSbwSingleQueryStr(selection) {
  return buildSbwQueryStr({
    selections: [selection],
  });
}

function buildSbwMultipleQueryStr(selections) {
  return buildSbwQueryStr({
    selections,
  });
}

async function getMatchOddsMarkets(numberOfMarkets = 1) {
  const facetFilter = {
    eventTypeIds: [1],
    selectBy: "LAST_TO_START",
    marketTypeCodes: ["MATCH_ODDS"],
    attachments: ["MARKET"],
    maxResults: 30,
    inPlayOnly: false,
    productTypes: ["SPORTSBOOK"],
  };
  const {
    attachments: { sportsBookMarkets = {} },
  } = await weaver.facetClient.facetedSearch(facetFilter, { locale: "en_GB" });
  const markets = Object.values(sportsBookMarkets);

  if (markets.length < numberOfMarkets) {
    throw new Error(`There is not enough markets. Number of markets requested: ${numberOfMarkets}`);
  }

  return markets.slice(0, numberOfMarkets);
}

async function getSelections(numberOfSelections) {
  const markets = await getMatchOddsMarkets(numberOfSelections);

  return markets.map((market) => {
    const { marketId, runners } = market;
    const [runner] = runners;
    const { selectionId } = runner;
    return { marketId, selectionId };
  });
}

async function openPageWithQueryParams(queryStr) {
  const basePath = getHomeViewUrl();
  const separator = basePath.includes("?") ? "&" : "?";
  await openPage(`${basePath}${separator}${queryStr}`);
}

describe("Deep linking - e2e", () => {
  beforeAll(async () => {
    await openPageAndAcceptCookieConsent();
    await loginWithSSOID("gtaAccount");
  });

  describe("SMX pattern", () => {
    describe("SIMPLE_SELECTION pattern", () => {
      beforeAll(async () => {
        const [selection] = await getSelections(1);
        await openPageWithQueryParams(buildSmxSimpleSelectionQueryStr(selection));
        await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
      });

      it("[PRPI-666] The betslip should be populated with 1 single", async () => {
        expect(await singlesCardPO.singles.length).toBe(1);
      });
    });

    describe("MULTIPLE pattern", () => {
      describe("and both selections are valid", () => {
        beforeAll(async () => {
          const selections = await getSelections(2);
          await openPageWithQueryParams(buildSmxMultipleQueryStr(selections, sportsbookPlacePanelPO.element));
          await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
        });

        it("[PRPI-669] The betslip should be populated with 1 multiple and 2 singles", async () => {
          expect(await selectionsBoardPO.title.getText()).toBe("2 Selections");
          expect(await singlesCardPO.singles.length).toBe(2);
        });
      });

      describe("and one selection is not valid", () => {
        beforeAll(async () => {
          const [validSelection] = await getSelections(1);
          const invalidSelection = { marketId: "924.000000", selectionId: "1" };
          await openPageWithQueryParams(buildSmxMultipleQueryStr([validSelection, invalidSelection]));
          await browser.waitUntilDisplayed(bottomBarPO.element);
        });

        it("[PRPI-673] The betslip should not be displayed", async () => {
          expect(await betslipDrawerPO.element.isExisting()).toBe(false);
          expect(await sportsbookPlacePanelPO.element.isExisting()).toBe(false);
        });
      });
    });
  });

  describe("SBW pattern", () => {
    describe("SINGLE", () => {
      beforeAll(async () => {
        const [selection] = await getSelections(1);
        await openPageWithQueryParams(buildSbwSingleQueryStr(selection));
        await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
      });

      it("[PRPI-676] The betslip should be populated with 1 single", async () => {
        expect(await singlesCardPO.singles.length).toBe(1);
      });
    });

    describe("MULTIPLE", () => {
      describe("and both selections are valid", () => {
        beforeAll(async () => {
          const selections = await getSelections(2);
          await openPageWithQueryParams(buildSbwMultipleQueryStr(selections), sportsbookPlacePanelPO.element);
          await browser.waitUntilDisplayed(sportsbookPlacePanelPO.element);
        });

        it("[PRPI-678] The betslip should be populated with 1 multiple and 2 singles", async () => {
          expect(await selectionsBoardPO.title.getText()).toBe("2 Selections");
          expect(await singlesCardPO.singles.length).toBe(2);
        });
      });
      describe("and one selection is not valid", () => {
        beforeAll(async () => {
          const [validSelection] = await getSelections(1);
          const invalidSelection = { marketId: "924.000000", selectionId: "1" };
          await openPageWithQueryParams(buildSbwMultipleQueryStr([validSelection, invalidSelection]));
          await browser.waitUntilDisplayed(bottomBarPO.element);
        });

        it("[PRPI-680] The betslip should not be displayed", async () => {
          expect(await betslipDrawerPO.element.isExisting()).toBe(false);
          expect(await sportsbookPlacePanelPO.element.isExisting()).toBe(false);
        });
      });
    });
  });
});
