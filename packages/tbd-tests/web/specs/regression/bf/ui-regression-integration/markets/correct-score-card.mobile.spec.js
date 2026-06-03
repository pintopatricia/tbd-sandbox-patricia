const { ShowMorePO, BetDetailsPO, RunnerPO } = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const CorrectScoreCardPO = require("@ppb/tbd-shared/components/CorrectScoreCard/CorrectScoreCard.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const correctScoreCardPO = new CorrectScoreCardPO();
// collapsed
const firstHomeRunner = new RunnerPO(correctScoreCardPO.runners[0]);
// expanded
const lastHomeRunner = new RunnerPO(correctScoreCardPO.runners[9]);
const lastDrawRunner = new RunnerPO(correctScoreCardPO.runners[14]);
const showMorePO = new ShowMorePO();
const selectionPO = new BetDetailsPO();

const MARKET_URN = "ppb:sbkMarket:924.1";

const createCorrectScoreRunners = (isDetails = false) => {
  const result = [];

  for (let i = 0; i < 4; i += 1) {
    for (let j = 0; j < 4; j += 1) {
      const selectionId = `${i + 1}${j}`;

      result.push(
        isDetails
          ? {
              selectionId,
              runnerOdds: {
                decimalDisplayOdds: { decimalOdds: parseFloat(`1.${selectionId}`) },
                fractionalDisplayOdds: { numerator: 1, denominator: 2 },
              },
            }
          : {
              runnerURN: `ppb:sbkRunner:924.1/${selectionId}`,
              selectionId,
              name: `${i} - ${j}`,
              marketURN: MARKET_URN,
            },
      );
    }
  }

  return result;
};

const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:event:1",
  sportevent: {
    urn: "ppb:event:1",
    eventId: 1,
    name: "Batistruta v Correct Score",
  },
  edges: [
    {
      node: {
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:batista/e/1",
        pebbleCardGroupTitle: { translated: "Correct Score Markets" },
        selectedItemUrn: "ppb:tbd:card:correctScore:924.1|5",
        full: {
          edges: [
            {
              name: "Correct Score",
              node: {
                __typename: "CorrectScoreCard",
                urn: "ppb:tbd:card:correctScore:924.1|5",
                numberOfItemsToDisplay: 3,
                market: {
                  __typename: "SportsbookMarket",
                  urn: MARKET_URN,
                  marketType: "CORRECT_SCORE",
                  marketTypeName: null,
                  name: "Correct Score",
                  runners: createCorrectScoreRunners(),
                  noLiveData: true,
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              name: "Correct Score",
              node: {
                __typename: "CorrectScoreCard",
                urn: "ppb:tbd:card:correctScore:924.1|5",
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
        __typename: "PebbleCardGroup",
        urn: "ppb:tbd:cardgroup:pebble:marketTemplateEvent:batista/e/1",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.1",
      runnerDetails: createCorrectScoreRunners(true),
    },
  ],
};

describe("CorrectScoreCard", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse({}, { ignoreLegsOrder: true }));
    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
    await browser.url(routes.getEventViewUrl("1"));
    await browser.waitUntilEquals(firstHomeRunner.sportsbookBetButton, "1.2");
  });

  it("[PRPI-6751] the correct score market should be displayed", async () => {
    expect(await correctScoreCardPO.element.isDisplayed()).toBe(true);
  });

  describe("when the user clicks in the show more option", () => {
    beforeAll(async () => {
      await showMorePO.element.click();
      await browser.tickFakeClock();
      await browser.waitUntilEquals(showMorePO.element, "Show Less");
    });

    it("[PRPI-6752] the expanded card should display the last runners", async () => {
      expect(await lastHomeRunner.runnerName.getText()).toBe("3 - 3");
      expect(await lastDrawRunner.runnerName.getText()).toBe("1 - 3");
    });

    it("[PRPI-6753] the expanded card should display the last runner prices", async () => {
      expect(await lastHomeRunner.sportsbookBetButton.getText()).toBe("1.43");
      expect(await lastDrawRunner.sportsbookBetButton.getText()).toBe("1.23");
    });
  });

  describe("When the user clicks on show less", () => {
    beforeAll(async () => {
      await showMorePO.element.click();
      await browser.tickFakeClock();
      await browser.waitUntilEquals(showMorePO.element, "Show More");
    });

    it("[PRPI-6754] the card should shrink to show equal before expanded and the app should scroll to the card.", async () => {
      expect(await correctScoreCardPO.element.isDisplayed()).toBe(true);
      expect(await correctScoreCardPO.runners.length).toBe(9);
    });
  });

  describe("when the user clicks on a price available", () => {
    beforeAll(async () => {
      await firstHomeRunner.sportsbookBetButton.click();
      await browser.waitUntilDisplayed(selectionPO.element);
    });

    it("[PRPI-6755] The betslip should be displayed", async () => {
      expect(await selectionPO.element).not.toBeNull();
    });

    it("[PRPI-6756] The selections should have correct title", async () => {
      expect(await selectionPO.title.getText()).toBe("1 - 0");
    });
  });
});
