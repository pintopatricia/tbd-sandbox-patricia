const { getMyBetsLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMyBetsSBKViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");
const { getBlhResponse } = require("@ppb/tbd-shared/mocks/blh/blh.controller");

const { CardPO } = require("../../../../page-objects");
const routes = require("../../../../../utils/routes");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../mock-essentials/mocking-service");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const MODULE_NAME = "my_bets_sbk";

const mockService = new MockService();

const cardPO = new CardPO();

const buildPrice = (price) => ({
  decimal: price,
  fractional: {
    numerator: price * 100,
    denominator: 100,
  },
});

const SBK_MULTIPLE_BET_MOCK_OPEN = getMyBetsSBKViewMock([
  {
    betType: "TBL",
    isOpen: true,
    profitAndLoss: 0.52,
    currentSize: 0.1,
    betPrice: buildPrice(5.2),
    lowestEventStartTime: "2024-06-25T09:45:00.000Z",
    edges: {
      legCardGroups: [
        {
          legs: [
            {
              legNumber: 1,
              parts: [
                {
                  sportId: "1",
                  price: buildPrice(1.95),
                  originalPrice: buildPrice(1.95),
                  eventDescription: "Caide de Rei v Porto",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Caide de Rei",
                },
              ],
            },
          ],

          footballFixture: {
            homeName: "Caide de Rei",
            awayName: "Porto",
            scheduledAt: "2024-07-18T18:30:00.000Z",
          },
        },
        {
          legs: [
            {
              legNumber: 2,
              parts: [
                {
                  sportId: "1",
                  price: buildPrice(2.4),
                  originalPrice: buildPrice(2.4),
                  eventDescription:
                    "Evento para ganhar uma viagem para duas pessoas a Fátima v Oxalá seja feita a pé e pode começar quando o vencedor quiser - possível troca por viagem a pé para Santiago de Compostela",
                  eventMarketDescription: "Match Odds",
                  selectionName:
                    "Oxalá seja feita a pé e pode começar quando o vencedor quiser - possível troca por viagem a pé para Santiago de Compostela",
                },
              ],
            },
          ],

          footballFixture: {
            homeName: "Evento para ganhar uma viagem para duas pessoas a Fátima",
            awayName:
              "Oxalá seja feita a pé e pode começar quando o vencedor quiser - possível troca por viagem a pé para Santiago de Compostela",
            scheduledAt: "2024-06-25T09:45:00.000Z",
          },
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
      },
    },
  },
]);

const SBK_SINGLE_BET_MOCK_OPEN = getMyBetsSBKViewMock([
  {
    betType: "TBL",
    isOpen: true,
    profitAndLoss: 0.52,
    currentSize: 0.1,
    betPrice: buildPrice(5.2),
    lowestEventStartTime: "2024-06-25T09:45:00.000Z",
    edges: {
      legCardGroups: [
        {
          footballFixture: {
            homeName: "Caide de Rei",
            awayName: "Porto",
            scheduledAt: "2024-07-18T18:30:00.000Z",
          },
          legs: [
            {
              legNumber: 1,
              parts: [
                {
                  sportId: "1",
                  price: buildPrice(1.95),
                  originalPrice: buildPrice(1.95),
                  eventDescription: "Caide de Rei v Porto",
                  eventMarketDescription: "Match Odds",
                  selectionName: "Caide de Rei",
                },
              ],
            },
          ],
        },
      ],

      betInfo: {
        betReceiptId: "O/11037374/0002965",
        placedDate: "2023-04-21T09:45:41.000Z",
      },
    },
  },
]);

const getBLHMock = ({ betResult, betResultType, legs }) => ({
  betsResult: [
    {
      resultType: betResultType || "UNKNOWN",
      result: betResult || "PENDING",
      legs: legs.map(({ legResult, legResultType }, index) => ({
        legNumber: index + 1,
        runners: [
          {
            id: index + 1,
            marketId: `924.33333333${index + 1}`,
            result: legResult || "PENDING",
            resultType: legResultType || "UNKNOWN",
          },
        ],
      })),
    },
  ],
});

const browseToMyBets = async (date, BFF_MOCK, { betResult, betResultType, legs }) => {
  await mockService.mockFonts(getMockFonts());

  await mockService.mockHttpRequest(
    await getIndexHTML(BFF_MOCK.urn, {
      products: ["sportsbook"],
      MY_BETS_WIN_LOSE_VOID: { isActive: true },
      date,
    }),
  );
  await mockService.mockHttpRequest(getMyBetsLayout(BFF_MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));
  if (betResult) {
    await mockService.mockHttpRequest(
      getBlhResponse(
        getBLHMock({
          betResult,
          betResultType,
          legs,
        }),
      ),
    );
    await browser.tickFakeClock("00:00:30");
  }

  await browser.url(routes.getMyBetsViewUrl("open"));

  await browser.waitUntilInViewport(cardPO.title);
  await cardPO.title.click();
  await browser.waitUntilDisplayed(cardPO.content);
};

describe("My Bets Page (Open Bets) - Win Lose Void", () => {
  describe("When the user has an open multiple bet in Football Match Odds Markets", () => {
    describe("and all of the events are still in Pre-play (lowestEventStartTime is further than the current date)", () => {
      beforeAll(async () => {
        await browseToMyBets("2024-06-18T09:45:00.000Z", SBK_MULTIPLE_BET_MOCK_OPEN, {});

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1435]_should_be_displayed_the_status_label_with_most_recent_event_date_and_all_bet_legs_icons_display_the_default_colour`,
        );
      });

      it("[PRPI-1435]_should_be_displayed_the_status_label_with_most_recent_event_date_and_all_bet_legs_icons_display_the_default_colour", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1435]_should_be_displayed_the_status_label_with_most_recent_event_date_and_all_bet_legs_icons_display_the_default_colour`,
          ),
        ).toBe(0);
      });
    });

    describe("and then one of the legs goes inPlay and the results from BLH are PENDING", () => {
      beforeAll(async () => {
        await browseToMyBets("2024-06-25T10:45:00.000Z", SBK_MULTIPLE_BET_MOCK_OPEN, {
          betResult: "PENDING",
          betResultType: "POTENTIAL",
          legs: [
            { legResult: "PENDING", legResultType: "POTENTIAL" },
            { legResult: "PENDING", legResultType: "POTENTIAL" },
          ],
        });

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1437]_should_be_displayed_the_in_progress_label_on_bet_panel_and_all_bet_legs_icons_display_the_default_colour`,
        );
      });

      it("[PRPI-1436]_should_be_displayed_the_in_progress_label_on_bet_panel_and_all_bet_legs_icons_display_the_default_colour", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1437]_should_be_displayed_the_in_progress_label_on_bet_panel_and_all_bet_legs_icons_display_the_default_colour`,
          ),
        ).toBe(0);
      });

      describe("and then the 1st leg is 'Winning' and the 2nd leg is 'Losing'", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getBlhResponse(
              getBLHMock({
                betResult: "LOSE",
                betResultType: "POTENTIAL",
                legs: [
                  { legResult: "WIN", legResultType: "POTENTIAL" },
                  { legResult: "LOSE", legResultType: "POTENTIAL" },
                ],
              }),
            ),
          );
          await browser.tickFakeClock("00:00:30");

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1437]_should_be_displayed_the_losing_label_on_bet_panel_and_icons_colours_should_be_displayed_accordingly_on_bet_legs`,
          );
        });

        it("[PRPI-1437]_should_be_displayed_the_losing_label_on_bet_panel_and_icons_colours_should_be_displayed_accordingly_on_bet_legs", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1437]_should_be_displayed_the_losing_label_on_bet_panel_and_icons_colours_should_be_displayed_accordingly_on_bet_legs`,
            ),
          ).toBe(0);
        });

        describe("and then the BLH retrieves UNKNOWN for the bet and both legs", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              getBlhResponse(
                getBLHMock({
                  betResult: "PENDING",
                  betResultType: "UNKNOWN",
                  legs: [
                    { legResult: "PENDING", legResultType: "UNKNOWN" },
                    { legResult: "PENDING", legResultType: "UNKNOWN" },
                  ],
                }),
              ),
            );
            await browser.tickFakeClock("00:00:30");

            await browser.waitUntilImageEquals(
              `${MODULE_NAME}_[PRPI-1437]_should_be_displayed_the_in_progress_label_on_bet_panel_and_all_bet_legs_icons_display_the_default_colour`,
            );
          });

          it("[PRPI-1437]_should_be_displayed_the_in_progress_label_on_bet_panel_and_all_bet_legs_icons_display_the_default_colour", async () => {
            expect(
              await browser.checkScreen(
                `${MODULE_NAME}_[PRPI-1437]_should_be_displayed_the_in_progress_label_on_bet_panel_and_all_bet_legs_icons_display_the_default_colour`,
              ),
            ).toBe(0);
          });

          describe("and then the 1st leg is 'Won' and the 2nd leg is 'Lost", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getBlhResponse(
                  getBLHMock({
                    betResult: "LOSE",
                    betResultType: "CONFIRMED",
                    legs: [
                      { legResult: "WIN", legResultType: "CONFIRMED" },
                      { legResult: "LOSE", legResultType: "CONFIRMED" },
                    ],
                  }),
                ),
              );
              await browser.tickFakeClock("00:00:30");

              await browser.waitUntilImageEquals(
                `${MODULE_NAME}_[PRPI-1437]_should_be_displayed_the_lost_label_on_bet_panel_and_won_lost_on_bet_legs_panels_and_icons_colours_should_be_displayed_accordingly_on_bet_legs`,
              );
            });

            it("[PRPI-1437]_should_be_displayed_the_lost_label_on_bet_panel_and_won_lost_on_bet_legs_panels_and_icons_colours_should_be_displayed_accordingly_on_bet_legs", async () => {
              expect(
                await browser.checkScreen(
                  `${MODULE_NAME}_[PRPI-1437]_should_be_displayed_the_lost_label_on_bet_panel_and_won_lost_on_bet_legs_panels_and_icons_colours_should_be_displayed_accordingly_on_bet_legs`,
                ),
              ).toBe(0);
            });
          });
        });
      });
    });
  });

  describe("When the user has an open single bet in Football Match Odds Markets", () => {
    describe("and the event becomes Inplay but the BLH service returns Potential Void for both the bet and bet leg", () => {
      beforeAll(async () => {
        await browseToMyBets("2024-06-25T10:45:00.000Z", SBK_SINGLE_BET_MOCK_OPEN, {
          betResult: "VOID",
          betResultType: "POTENTIAL",
          legs: [{ legResult: "VOID", legResultType: "POTENTIAL" }],
        });

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1438]_should_be_displayed_the_in_progress_label_on_bet_panel_and_the_sports_icon_display_the_default_colour`,
        );
      });

      it("[PRPI-1438]_should_be_displayed_the_in_progress_label_on_bet_panel_and_the_sports_icon_display_the_default_colour", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1438]_should_be_displayed_the_in_progress_label_on_bet_panel_and_the_sports_icon_display_the_default_colour`,
          ),
        ).toBe(0);
      });

      describe("and then the result type for the both the bet and leg are Confirmed", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(
            getBlhResponse(
              getBLHMock({
                betResult: "VOID",
                betResultType: "CONFIRMED",
                legs: [{ legResult: "VOID", legResultType: "CONFIRMED" }],
              }),
            ),
          );
          await browser.tickFakeClock("00:00:30");

          await browser.waitUntilImageEquals(
            `${MODULE_NAME}_[PRPI-1439]_should_be_displayed_the_void_label_on_bet_and_bet_leg_panels_and_the_sports_icon_display_the_default_colour`,
          );
        });

        it("[PRPI-1439]_should_be_displayed_the_void_label_on_bet_and_bet_leg_panels_and_the_sports_icon_display_the_default_colour", async () => {
          expect(
            await browser.checkScreen(
              `${MODULE_NAME}_[PRPI-1439]_should_be_displayed_the_void_label_on_bet_and_bet_leg_panels_and_the_sports_icon_display_the_default_colour`,
            ),
          ).toBe(0);
        });
      });
    });
  });
});
