const {
  SportPagePO,
  PromotionCardPO,
  CasinoPromotionCardPO,
  ScrollableSwimlanePO,
  SportsbookBetButtonPO,
  PromotionTitlesPO,
} = require("../../../../../page-objects");
const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const SPORT_ID = 1;

const sportPagePO = new SportPagePO();
const promotionsSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);
const promotionFirstCardPO = new PromotionCardPO(promotionsSwimlanePO.scrollItems[0]);
const promotionSecondCardPO = new PromotionCardPO(promotionsSwimlanePO.scrollItems[1]);
const promotionThirdCardPO = new PromotionCardPO(promotionsSwimlanePO.scrollItems[2]);
const promotionFourthCardPO = new CasinoPromotionCardPO(promotionsSwimlanePO.scrollItems[3]);
const promotionFifthCardPO = new CasinoPromotionCardPO(promotionsSwimlanePO.scrollItems[4]);
const promotionTitlesFirstCardPO = new PromotionTitlesPO(promotionFirstCardPO.element);
const promotionTitlesSecondCardPO = new PromotionTitlesPO(promotionSecondCardPO.element);

const oddsboostBetButtonPO = new SportsbookBetButtonPO();

const PROMO_CARD_PROPS = {
  __typename: "PromotionCard",
  promotionContentType: "GENERIC",
  promotionName: "BET €20 ON MULTIPLES",
  backgroundImage: [
    {
      url: "http://example.test.com/mockedImage/image.png",
      width: 456,
      height: 123,
    },
  ],
};
const MARKET_ID = "924.266233830";
const SELECTION_ID = "39879518";

const PROMO_ODDSBOOST_MARKET = {
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${MARKET_ID}`,
  name: "Daily Treble Boost",
  marketType: "COMMERCIAL_ODDSBOOST",
  hierarchy: {
    __typename: "EventCompetitionHierarchy",
    competition: {
      urn: "ppb:competition:2608550",
      name: "Specials",
      competitionId: 2608550,
    },
    sportevent: {
      urn: "ppb:event:26896160",
      name: "OddsBoost",
    },
  },
  runners: [
    {
      runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
      name: "Ciro Immobile and Lorenzo Insigne to have 1 or more shots",
      selectionId: SELECTION_ID,
    },
  ],

  isOddsboostMarketType: true,
};

const PROMO_ODDSBOOST_RUNNER = {
  runnerURN: `ppb:sbkRunner:${MARKET_ID}/${SELECTION_ID}`,
  selectionId: SELECTION_ID,
};

const BFF_SPORT_PAGE_MOCK = {
  title: "Football",
  urn: `ppb:tbd:view:sport:${SPORT_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:personalisedPromotions:435d2d3b#svp",
        full: {
          edges: [
            {
              node: {
                urn: "ppb:tbd:card:promotion:1",
                termsAndConditions: null,
                label: "Place Bet Now",
                viewLink: {
                  viewUrn: "ppb:tbd:view:external:external",
                  viewUrl: "https://www.betfair.com/betting/",
                },
                ...PROMO_CARD_PROPS,
              },
            },
            {
              node: {
                urn: "ppb:tbd:card:promotion:2",
                promotionTitle: "BET TO WIN!",
                termsAndConditions: {
                  url: "https://promos.betfair.com/promotion?promoCode=sbkb20g5280720p",
                  summary: "terms And Conditions Summary",
                  label: { translationKey: "I18N.BETSLIP.ACCA_INSURANCE_TERMS_LABEL" },
                },
                label: "Click here",
                viewLink: {
                  viewUrn: "ppb:tbd:view:external:external",
                  viewUrl: "https://www.betfair.com/betting/",
                },
                ...PROMO_CARD_PROPS,
              },
            },
            {
              node: {
                ...PROMO_CARD_PROPS,
                urn: "ppb:tbd:card:promotion:3",
                promotionContentType: "ODDSBOOST",
                name: "Oddsboost Promotion Test",
                promotionTitle: "Oddsboost Subtitle",
                termsAndConditions: {
                  url: "https://promos.betfair.com/promotion?promoCode=sbkb20g5280720p",
                  summary: "terms And Conditions Summary",
                },
                market: PROMO_ODDSBOOST_MARKET,
                runner: PROMO_ODDSBOOST_RUNNER,
                displayPreviousOdd: true,
              },
            },
            {
              node: {
                ...PROMO_CARD_PROPS,
                promotionName: "Casino Promotion Test",
                promotionContentType: "CASINO",
                label: "Opt In",
                viewLink: {
                  viewUrl: "https://www.betfair.com/betting/",
                  viewUrn: "ppb:tbd:view:external:external",
                },
                promotionTitle: "Casino Subtitle",
                termsAndConditions: {
                  summary: "Terms And Conditions Summary",
                  url: "https://promos.betfair.com/promotion?promoCode=sbkb20g5280720p",
                },
                urn: "ppb:tbd:card:promotion:4",
              },
            },
            {
              node: {
                __typename: "PromotionCard",
                promotionContentType: "CASINO",
                headline: "ACCEPT FREE SPINS-H1",
                subHeadline: "ACCEPT FREE SPINS-H2",
                strapline: "STRAPLINE",
                promotionTitle: "Footer summary",
                isImsPromo: true,
                label: "Accept",
                viewLink: {
                  viewUrn: "ppb:tbd:view:imsPromotion:promotion1",
                  viewUrl: "gamingName/tagName/promotion/ip-promotion1",
                },
                backgroundImage: [
                  {
                    url: "http://example.test.com/mockedImage/image.png",
                    width: 563,
                    height: 750,
                  },
                ],

                urn: "ppb:tbd:card:promotion:ims/promotion1",
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "PromotionCard",
                urn: "ppb:tbd:card:promotion:1",
              },
            },
            {
              node: {
                __typename: "PromotionCard",
                urn: "ppb:tbd:card:promotion:2",
              },
            },
            {
              node: {
                __typename: "PromotionCard",
                urn: "ppb:tbd:card:promotion:3",
              },
            },
            {
              node: {
                __typename: "PromotionCard",
                urn: "ppb:tbd:card:promotion:4",
              },
            },
            {
              node: {
                __typename: "PromotionCard",
                urn: "ppb:tbd:card:promotion:ims/promotion1",
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
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:personalisedPromotions:435d2d3b#svp",
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_ID,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.3 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 1.2 },
            },
          ],
        },
      ],
    },
  ],
};

const SMP_MOCK_POLLING = {
  markets: [
    {
      marketId: MARKET_ID,
      runnerDetails: [
        {
          selectionId: SELECTION_ID,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.3 },
          },
          previousWinRunnerOdds: [
            {
              decimalDisplayOdds: { decimalOdds: 2.2 },
            },
          ],
        },
      ],
    },
  ],
};

const SMP_MOCK_SUSPENDED = {
  markets: [
    {
      ...SMP_MOCK_POLLING.markets[0],
      marketStatus: "SUSPENDED",
    },
  ],
};

const SMP_MOCK_CLOSED = {
  markets: [
    {
      ...SMP_MOCK_POLLING.markets[0],
      noMarketInfo: true,
    },
  ],
};

describe("Promotions", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_SPORT_PAGE_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_PAGE_MOCK));
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
  });

  describe("When user is in Promotion swimlane with promotion card returning all required properties except the T&C link and subtitle", () => {
    beforeAll(async () => {
      await browser.url(`${routes.getSportViewUrl(SPORT_ID)}`);
      await browser.waitUntilDisplayed(promotionFirstCardPO.element);
    });

    it("[PRPI-7260] The 'T&C Apply' link should not be rendered in card", async () => {
      expect(await promotionFirstCardPO.termsAndConditionsLink.isDisplayed()).toBe(false);
    });

    it("[PRPI-7261] The subtitle should not be rendered in card", async () => {
      expect(await promotionTitlesFirstCardPO.subtitle.isDisplayed()).toBe(false);
    });

    describe("When the user swipes to second promotion card with all available properties", () => {
      beforeAll(async () => {
        await promotionSecondCardPO.element.scrollIntoView(true);
        await browser.waitUntilInViewport(promotionSecondCardPO.element);
      });

      it("[PRPI-7262] The T&C link label should show the correct label", async () => {
        expect(await promotionSecondCardPO.termsAndConditionsLink.getText()).toEqual("T&C’s apply");
      });

      it("[PRPI-7263] The Title should be displayed", async () => {
        expect(await promotionTitlesSecondCardPO.title.isDisplayed()).toBe(true);
      });

      it("[PRPI-7264] The subtitle should be displayed", async () => {
        expect(await promotionTitlesSecondCardPO.subtitle.isDisplayed()).toBe(true);
      });

      it("[PRPI-7265] The T&C summary should be displayed", async () => {
        expect(await promotionSecondCardPO.summary.isDisplayed()).toBe(true);
      });

      it("[PRPI-7266] The CTA should be displayed", async () => {
        expect(await promotionSecondCardPO.actionButton.getText()).toEqual("Click here");
      });

      describe("When user swipes to third promotion card with oddsboost", () => {
        beforeAll(async () => {
          await promotionThirdCardPO.element.scrollIntoView(true);
          await browser.waitUntilInViewport(oddsboostBetButtonPO.element);
        });

        describe("When oddsboost price is updated", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(
              getMarketPrices(SMP_MOCK_POLLING, { ignoreRequestedMarketIdsMatch: true }),
            );
            await browser.tickFakeClock();
            await browser.waitUntilEquals(oddsboostBetButtonPO.odd, "2.3");
          });

          it("[PRPI-7267] The bet button price should be updated", async () => {
            expect(await oddsboostBetButtonPO.odd.getText()).toBe("2.3");
            expect(await oddsboostBetButtonPO.secondaryLabel.getText()).toBe("2.2");
          });

          describe("And the oddboost market suspends", () => {
            beforeAll(async () => {
              await mockService.mockHttpRequest(
                getMarketPrices(SMP_MOCK_SUSPENDED, { ignoreRequestedMarketIdsMatch: true }),
              );
              await browser.tickFakeClock();
              await browser.waitUntil(() => oddsboostBetButtonPO.element.isEnabled());
            });

            it("[PRPI-7267] The oddsboost bet button should be enabled", async () => {
              expect(await oddsboostBetButtonPO.element.isEnabled()).toBe(true);
            });

            describe("And the oddsboost market closes", () => {
              beforeAll(async () => {
                await mockService.mockHttpRequest(
                  getMarketPrices(SMP_MOCK_CLOSED, { ignoreRequestedMarketIdsMatch: true }),
                );
                await browser.tickFakeClock();
                await browser.waitUntil(() => oddsboostBetButtonPO.element.isEnabled());
              });

              it("[PRPI-7267] The oddsboost bet button should be enabled", async () => {
                expect(await oddsboostBetButtonPO.element.isEnabled()).toBe(true);
              });

              describe("When user swipes to reveal fourth promotion card", () => {
                beforeAll(async () => {
                  await promotionFourthCardPO.element.scrollIntoView(true);
                  await browser.waitUntilInViewport(promotionFourthCardPO.element);
                });

                it("[PRPI-7267] The fourth promotion card should be displayed", async () => {
                  expect(await promotionFourthCardPO.element.isDisplayed()).toBe(true);
                });

                it("[PRPI-7267] The title should be displayed", async () => {
                  expect(await promotionFourthCardPO.title.getText()).toBe("CASINO PROMOTION TEST");
                });

                it("[PRPI-7267] The subtitle should be displayed", async () => {
                  expect(await promotionFourthCardPO.subtitle.isDisplayed()).toBe(true);
                });

                it("[PRPI-7267] The CTA label should be displayed", async () => {
                  expect(await promotionFourthCardPO.actionButton.getText()).toBe("Opt In");
                });

                it("[PRPI-7267] The T&C summary should be displayed", async () => {
                  expect(await promotionFourthCardPO.summary.isDisplayed()).toBe(true);
                });

                describe("When user swipes to reveal fifth promotion card", () => {
                  beforeAll(async () => {
                    await promotionFifthCardPO.element.scrollIntoView(true);
                    await browser.waitUntilInViewport(promotionFifthCardPO.element);
                  });

                  it("[PRPI-7267] The fifth promotion card should be displayed", async () => {
                    expect(await promotionFifthCardPO.element.isDisplayed()).toBe(true);
                  });

                  it("[PRPI-7267] The title should be displayed", async () => {
                    expect(await promotionFifthCardPO.title.getText()).toBe("ACCEPT FREE SPINS-H1");
                  });

                  it("[PRPI-7267] The headline should be displayed", async () => {
                    expect(await promotionFifthCardPO.headline.getText()).toBe("ACCEPT FREE SPINS-H2");
                  });

                  it("[PRPI-7267] The strapline should be displayed", async () => {
                    expect(await promotionFifthCardPO.subtitle.getText()).toBe("STRAPLINE");
                  });

                  it("[PRPI-7267] The CTA label should be displayed", async () => {
                    expect(await promotionFifthCardPO.actionButton.getText()).toBe("Accept");
                  });

                  it("[PRPI-7267] The T&C summary should be displayed", async () => {
                    expect(await promotionFifthCardPO.summary.isDisplayed()).toBe(true);
                  });

                  describe("When user clicks the CTA button", () => {
                    beforeAll(async () => {
                      await promotionFifthCardPO.actionButton.click();
                      await browser.waitUntilBrowserUrlContains("ip-promotion1");
                    });
                    it("[PRPI-7267] The user should be redirected to promo details page", async () => {
                      const url = await browser.getUrl();

                      expect(url.endsWith("ip-promotion1")).toBe(
                        true,
                        `${url} does not have the ims promo details page ending`,
                      );
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
});
