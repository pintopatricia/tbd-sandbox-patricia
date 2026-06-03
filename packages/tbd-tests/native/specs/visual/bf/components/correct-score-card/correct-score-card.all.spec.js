const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getImplyBetsResponse } = require("@flutter-global/uki-channels-http-clients/mock-index").SIB;
const { getEventLayout, getHomeLayoutWithViewLink } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const { ShowMoreSO, SportsbookBetButtonSO, SnackbarSO } = require("../../../../../screen-objects");

const CARD_NAME = "correct-score-card";
const mockService = new MockService();
const sportsbookBetButtonSO = new SportsbookBetButtonSO();
const showMoreSO = new ShowMoreSO();
const MARKET_URN = "ppb:sbkMarket:924.1";
const snackbarSO = new SnackbarSO();

const createCorrectScoreRunners = (isDetails = false) => {
  const result = [];

  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) {
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

const IMPLY_MOCK = {
  betCombinations: [
    {
      legCombinations: [
        {
          runners: [
            {
              marketId: "924.1",
              selectionId: 20,
            },
          ],
        },
      ],
    },
  ],

  runnerOdds: [
    {
      runner: {
        marketId: "924.1",
        selectionId: 20,
      },
      odds: {
        trueOdds: {
          decimalOdds: { decimalOdds: 1.2 },
        },
        decimalDisplayOdds: {
          decimalOdds: 1.2,
        },
      },
    },
  ],
};

const BFF_VIEW_MOCK = {
  __typename: "EventView",
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
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getImplyBetsResponse(IMPLY_MOCK, { ignoreLegsOrder: true }));
    await mockService.mockHttpRequest(getEventLayout(BFF_VIEW_MOCK));
  });

  describe("and there is a snackbar", () => {
    beforeAll(async () => {
      const HOME_VIEW_LINK = getStartViewLink(`sport/competition/event/e-1`);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(snackbarSO.element);
      await snackbarSO.closeButton.click();
    });

    describe("when the user is in an event view with a pebblecardgroup for correct score", () => {
      beforeAll(async () => {
        await browser.waitUntilEquals(await sportsbookBetButtonSO.odd, "1.2");
        await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4900]_should_render_correct_score_card`);
      });

      it("[PRPI-4900]_should_render_correct_score_card", async () => {
        expect(
          (await browser.compareScreen(`${CARD_NAME}_[PRPI-4900]_should_render_correct_score_card`)).misMatchPercentage,
        ).toEqual(0);
      });

      describe('When the user clicks on "show more" option', () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(showMoreSO.element);
          await showMoreSO.element.click();

          await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4967]_should_render_expanded_correct_score_card`);
        });

        it("[PRPI-4967]_should_render_expanded_correct_score_card", async () => {
          expect(
            (await browser.compareScreen(`${CARD_NAME}_[PRPI-4967]_should_render_expanded_correct_score_card`))
              .misMatchPercentage,
          ).toEqual(0);
        });

        describe("When the user clicks on a bet button", () => {
          beforeAll(async () => {
            await sportsbookBetButtonSO.element.click();
            await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4968]_should_open_betslip`);
          });

          it("[PRPI-4968]_should_open_betslip", async () => {
            expect(
              (await browser.compareScreen(`${CARD_NAME}_[PRPI-4968]_should_open_betslip`)).misMatchPercentage,
            ).toEqual(0);
          });
        });
      });
    });
  });
});
