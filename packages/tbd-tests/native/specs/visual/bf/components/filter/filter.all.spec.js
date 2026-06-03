const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const {
  getAppContext,
  getGenericLayout,
  getFilteredCardResults,
  getHomeLayoutWithViewLink,
  getQueryCardResponse,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const {
  GenericScreenSO,
  FilterBySO,
  OptionListSO,
  PrimaryButtonSO,
  RadioListSO,
  PebbleSO,
  FilterCriteriaSO,
} = require("../../../../../screen-objects");

const genericScreenSO = new GenericScreenSO();
const filteredCouponCardGroupSO = new FilteredCouponCardGroupSO();
const filterCriteriaSO = new FilterCriteriaSO();
const optionListSO = new OptionListSO();
const primaryButtonSO = new PrimaryButtonSO();
const filterBySO = new FilterBySO(filteredCouponCardGroupSO.element);
const competitionsPebbleSO = new PebbleSO(filterBySO.filters[2]);

const mockService = new MockService();
const radioListSO = new RadioListSO();
const sortPebbleSO = new PebbleSO(filterBySO.filters[0]);
const dateRangePebbleSO = new PebbleSO(filterBySO.filters[1]);

const competitionPebbleSO = new PebbleSO(filterBySO.filters[2]);

const FILTERED_CARD_MOCK = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
  filteredCouponTitle: "All Matches",
  filterOptions: {
    sortOption: {
      defaultOption: "RANK",
      availableOptions: ["RANK", "TIME"],
    },
    dateRangeFilter: {
      urn: "ppb:tbd:cardfilter:daterange:YIA8mBEAACMAMOhA/s/1",
      defaultOption: {
        urn: "ppb:tbd:daterangeoption:YIA8mBEAACMAMOhA/s/1|YIA8exEAACQAMOeu",
        title: {
          __typename: "DisplayNameTranslationKey",
          translationKey: "I18N.DATE.TODAY",
        },
      },
      availableOptions: [
        {
          urn: "ppb:tbd:daterangeoption:YIA8mBEAACMAMOhA/s/1|YIA8exEAACQAMOeu",
          title: {
            __typename: "DisplayNameTranslationKey",
            translationKey: "I18N.DATE.TODAY",
          },
        },
        {
          urn: "ppb:tbd:daterangeoption:YIA8mBEAACMAMOhA/s/1|YJFSZxQAACMATL6T",
          title: {
            __typename: "DisplayNameTitle",
            name: "In-Play Now",
          },
        },
      ],
    },
    marketTypeFilter: {
      urn: "ppb:tbd:cardfilter:markettype:YIA8mBEAACMAMOhA/s/1",
      defaultOption: null,
      availableOptions: [
        {
          name: "Match Odds",
          marketType: {
            urn: "ppb:marketType:MATCH_ODDS",
          },
        },
      ],
    },
    competitionsFilter: {
      urn: "ppb:tbd:cardfilter:competitions:YIA8mBEAACMAMOhA/s/1",
      defaultOptions: null,
      topCompetitions: [
        {
          __typename: "Competition",
          urn: "ppb:competition:228",
          name: "UEFA Champions League",
          competitionId: 228,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            sportId: 1,
          },
        },
        {
          __typename: "Competition",
          urn: "ppb:competition:99",
          name: "Portuguese Primeira Liga",
          competitionId: 99,
          sport: {
            __typename: "Sport",
            urn: "ppb:eventType:1",
            name: "Football",
            sportId: 1,
          },
        },
      ],

      allCompetitions: [
        {
          country: {
            urn: "ppb:tbd:country:international",
            code: "International",
          },
          competitions: [
            {
              __typename: "Competition",
              urn: "ppb:competition:228",
              name: "UEFA Champions League",
              competitionId: 228,
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:1",
                name: "Football",
                sportId: 1,
              },
            },
          ],
        },
        {
          country: {
            urn: "ppb:tbd:country:prt",
            code: "PRT",
          },
          competitions: [
            {
              __typename: "Competition",
              urn: "ppb:competition:99",
              name: "Portuguese Primeira Liga",
              competitionId: 99,
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:1",
                name: "Football",
                sportId: 1,
              },
            },
          ],
        },
      ],
    },
    filtersSorting: ["competitionsFilter", "sortOption", "dateRangeFilter"],
  },
  full: {
    edges: [
      {
        node: {
          __typename: "CouponHeaderCard",
          urn: "ppb:tbd:card:couponheader:YIA8mBEAACMAMOhA/s/1|228",
          competition: {
            __typename: "Competition",
            urn: "ppb:competition:228",
            name: "Friendly Matches",
            competitionId: 228,
            sport: {
              __typename: "Sport",
              urn: "ppb:eventType:1",
              name: "Football",
              sportId: 1,
            },
          },
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30464707/MATCH_ODDS",
          eventViewLink: {
            viewUrn: "ppb:tbd:view:event:30464707",
            viewUrl: "football/uefa-champions-league/chelsea-v-real-madrid/e-30464707",
          },
          runnerViewLinks: [
            {
              runnerUrn: "ppb:excRunner:1.182678271/55190/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182678271/55190/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182678271/2426/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182678271/2426/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182678271/58805/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182678271/58805/0",
            },
          ],

          title: "Match Odds",
          sportevent: {
            __typename: "SportsEvent",
            urn: "ppb:event:30464707",
            name: "Chelsea v Real Madrid",
            competition: {
              __typename: "Competition",
              urn: "ppb:competition:228",
              name: "UEFA Champions League",
              competitionId: 228,
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:1",
                name: "Football",
                sportId: 1,
              },
            },
          },
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.262429640",
                name: "Match Odds",
                hierarchy: {
                  __typename: "EventCompetitionHierarchy",
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:228",
                    name: "UEFA Champions League",
                    competitionId: 228,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                      sportId: 1,
                    },
                  },
                  sportevent: {
                    __typename: "SportsEvent",
                    urn: "ppb:event:30464707",
                    name: "Chelsea v Real Madrid",
                  },
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.262429640/55190",
                    name: "Chelsea",
                    selectionId: 55190,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.262429640/2426",
                    name: "Real Madrid",
                    selectionId: 2426,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.262429640/58805",
                    name: "The Draw",
                    selectionId: 58805,
                    handicap: 0,
                    resultType: null,
                  },
                ],
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.262429640/55190",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.262429640/2426",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.262429640/58805",
                },
              ],
            },
          },
          fixture: {
            urn: "ppb:fixture:30464707",
            home: {
              name: "Chelsea",
            },
            away: {
              name: "Real Madrid",
            },
            scheduledAt: "2021-05-05T19:00:00Z",
          },
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482022/MATCH_ODDS",
          eventViewLink: {
            viewUrn: "ppb:tbd:view:event:30482022",
            viewUrl: "football/portuguese-primeira-liga/braga-v-pacos-ferreira/e-30482022",
          },
          runnerViewLinks: [
            {
              runnerUrn: "ppb:excRunner:1.182896135/48799/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182896135/48799/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182896135/48787/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182896135/48787/0",
            },
            {
              runnerUrn: "ppb:excRunner:1.182896135/58805/0",
              viewUrl: "Not Implemented",
              viewUrn: "ppb:tbd:view:runner:1.182896135/58805/0",
            },
          ],

          title: "Match Odds",
          sportevent: {
            __typename: "SportsEvent",
            urn: "ppb:event:30482022",
            name: "Braga v Pacos Ferreira",
            competition: {
              __typename: "Competition",
              urn: "ppb:competition:99",
              name: "Portuguese Primeira Liga",
              competitionId: 99,
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:1",
                name: "Football",
                sportId: 1,
              },
            },
          },
          displayRunners: {
            sportsbook: {
              market: {
                __typename: "SportsbookMarket",
                urn: "ppb:sbkMarket:924.263003281",
                name: "Match Odds",
                marketType: "MATCH_ODDS",
                hierarchy: {
                  __typename: "EventCompetitionHierarchy",
                  competition: {
                    __typename: "Competition",
                    urn: "ppb:competition:99",
                    name: "Portuguese Primeira Liga",
                    competitionId: 99,
                    sport: {
                      __typename: "Sport",
                      urn: "ppb:eventType:1",
                      name: "Football",
                      sportId: 1,
                    },
                  },
                  sportevent: {
                    __typename: "SportsEvent",
                    urn: "ppb:event:30482022",
                    name: "Braga v Pacos Ferreira",
                  },
                },
                runners: [
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.263003281/48799",
                    name: "Braga",
                    selectionId: 48799,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.263003281/48787",
                    name: "Pacos Ferreira",
                    selectionId: 48787,
                    handicap: 0,
                    resultType: null,
                  },
                  {
                    __typename: "Runner",
                    runnerURN: "ppb:sbkRunner:924.263003281/58805",
                    name: "The Draw",
                    selectionId: 58805,
                    handicap: 0,
                    resultType: null,
                  },
                ],

                isOddsboostMarketType: false,
              },
              runners: [
                {
                  runnerURN: "ppb:sbkRunner:924.263003281/48799",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.263003281/48787",
                },
                {
                  runnerURN: "ppb:sbkRunner:924.263003281/58805",
                },
              ],
            },
          },
          fixture: {
            urn: "ppb:fixture:30482022",
            home: {
              name: "Braga",
            },
            away: {
              name: "Pacos Ferreira",
            },
            scheduledAt: "2021-05-05T18:00:00Z",
          },
        },
      },
    ],
  },
  partials: {
    partialEdges: [
      {
        node: {
          __typename: "CouponHeaderCard",
          urn: "ppb:tbd:card:couponheader:YIA8mBEAACMAMOhA/s/1|228",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30464707/MATCH_ODDS",
        },
      },
      {
        node: {
          __typename: "EventMarketCard",
          urn: "ppb:tbd:card:eventPrimaryMarket:30482022/MATCH_ODDS",
        },
      },
    ],
  },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:allmatchesraces:1",
  url: "view/amc-1",
  title: null,
  pageInfo: null,
  edges: [
    {
      node: FILTERED_CARD_MOCK,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      },
    },
  ],
};

const ALL_COMPETITIONS_MOCK = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
  filteredCouponTitle: "All Matches",
  filterOptions: {
    __typename: "FilteredCouponOptions",
    competitionsFilter: {
      urn: "ppb:tbd:apollocriessilencer",
      allCompetitions: [
        {
          country: {
            urn: "ppb:tbd:country:international",
            code: "International",
            flag: null,
          },
          competitions: [
            {
              __typename: "Competition",
              urn: "ppb:competition:228",
              name: "UEFA Champions League",
              competitionId: 228,
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:1",
                name: "Football",
                sportId: 1,
              },
            },
          ],
        },
        {
          country: {
            urn: "ppb:tbd:country:PRT",
            code: "PRT",
            flag: null,
          },
          competitions: [
            {
              __typename: "Competition",
              urn: "ppb:competition:99",
              name: "Portuguese Primeira Liga",
              competitionId: 99,
              sport: {
                __typename: "Sport",
                urn: "ppb:eventType:1",
                name: "Football",
                sportId: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

const COMPETITION_FILTERED_CARD_MOCK = {
  cards: [
    {
      __typename: "FilteredCouponCardGroup",
      urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      filteredCouponTitle: "All Matches",
      full: {
        edges: [
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30482021/MATCH_ODDS",
              eventViewLink: {
                viewUrn: "ppb:tbd:view:event:30482021",
                viewUrl: "football/portuguese-primeira-liga/rio-ave-v-sporting-lisbon/e-30482021",
              },
              runnerViewLinks: [
                {
                  runnerUrn: "ppb:excRunner:1.182896261/495321/0",
                  viewUrn: "ppb:tbd:view:runner:1.182896261/495321/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182896261/2506293/0",
                  viewUrn: "ppb:tbd:view:runner:1.182896261/2506293/0",
                },
                {
                  runnerUrn: "ppb:excRunner:1.182896261/58805/0",
                  viewUrn: "ppb:tbd:view:runner:1.182896261/58805/0",
                },
              ],

              title: "Match Odds",
              sportevent: {
                __typename: "SportsEvent",
                urn: "ppb:event:30482021",
                name: "Rio Ave v Sporting Lisbon",
                competition: {
                  __typename: "Competition",
                  urn: "ppb:competition:99",
                  name: "Portuguese Primeira Liga",
                  competitionId: 99,
                },
              },
              displayRunners: {
                sportsbook: {
                  market: {
                    __typename: "SportsbookMarket",
                    urn: "ppb:sbkMarket:924.263003261",
                    name: "Match Odds",
                    hierarchy: {
                      __typename: "EventCompetitionHierarchy",
                      competition: {
                        __typename: "Competition",
                        urn: "ppb:competition:99",
                        name: "Portuguese Primeira Liga",
                        competitionId: 99,
                      },
                      sportevent: {
                        __typename: "SportsEvent",
                        urn: "ppb:event:30482021",
                        name: "Rio Ave v Sporting Lisbon",
                      },
                    },
                    runners: [
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003261/495321",
                        name: "Rio Ave",
                        selectionId: 495321,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003261/2506293",
                        name: "Sporting Lisbon",
                        selectionId: 2506293,
                      },
                      {
                        __typename: "Runner",
                        runnerURN: "ppb:sbkRunner:924.263003261/58805",
                        name: "The Draw",
                        selectionId: 58805,
                      },
                    ],

                    liveData: { inplay: true },
                  },
                  runners: [
                    {
                      runnerURN: "ppb:sbkRunner:924.263003261/495321",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.263003261/2506293",
                    },
                    {
                      runnerURN: "ppb:sbkRunner:924.263003261/58805",
                    },
                  ],
                },
              },
              fixture: {
                urn: "ppb:fixture:30482021",
                home: {
                  name: "Rio Ave",
                },
                away: {
                  name: "Sporting Lisbon",
                },
                scheduledAt: "2021-05-05T20:15:00Z",
                startedAt: null,
                score: null,
                duration: {
                  period: "REGULAR",
                  status: "INPLAY_FIRST_HALF",
                  clock: null,
                },
              },
            },
          },
        ],
      },
      partials: {
        partialEdges: [
          {
            node: {
              __typename: "EventMarketCard",
              urn: "ppb:tbd:card:eventPrimaryMarket:30482021/MATCH_ODDS",
            },
          },
        ],
      },
    },
  ],
};

const SMP_MOCK = {
  markets: [
    {
      marketId: "924.262429640",
      runnerDetails: [
        {
          selectionId: 55190,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.0 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 2426,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.4 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
          },
          runnerStatus: "ACTIVE",
        },
      ],
    },
    {
      marketId: "924.263003281",
      runnerDetails: [
        {
          selectionId: 48799,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 3.0 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 48787,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.75 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 58805,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.0 },
          },
          runnerStatus: "ACTIVE",
        },
      ],
    },
  ],
};

const CARD_NAME = "all_matches_filters";

describe("Filter", () => {
  describe("When user is on a Generic View with all matches", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getQueryCardResponse("AllCompetitionsFilter", ALL_COMPETITIONS_MOCK));
      const HOME_VIEW_LINK = getStartViewLink("view/amc-1");
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await browser.waitUntilDisplayed(genericScreenSO.element);

      await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4905]_should_render_all_matches_filters`);
    });

    it("[PRPI-4905]_should_render_all_matches_filters", async () => {
      expect(
        (await browser.compareScreen(`${CARD_NAME}_[PRPI-4905]_should_render_all_matches_filters`)).misMatchPercentage,
      ).toEqual(0);
    });

    describe("when the user clicks on the sort filter", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(sortPebbleSO.element);
        await sortPebbleSO.element.click();
        await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4906]_should_render_filter_criteria_sort_options`);
      });

      it("[PRPI-4906]_should_render_filter_criteria_sort_options", async () => {
        expect(
          (await browser.compareScreen(`${CARD_NAME}_[PRPI-4906]_should_render_filter_criteria_sort_options`))
            .misMatchPercentage,
        ).toEqual(0);
      });

      describe("and when the user changes the sort option", () => {
        beforeAll(async () => {
          await browser.waitUntilClickableNative(radioListSO.item[1]);
          await radioListSO.item[1].click();
          await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4907]_should_render_sort_filter`);
        });

        it("[PRPI-4907]_should_render_sort_filter", async () => {
          expect(
            (await browser.compareScreen(`${CARD_NAME}_[PRPI-4907]_should_render_sort_filter`)).misMatchPercentage,
          ).toEqual(0);
        });

        describe("when the user clicks on the date range filter", () => {
          beforeAll(async () => {
            await browser.waitUntilClickableNative(dateRangePebbleSO.element);
            await dateRangePebbleSO.element.click();
            await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4908]_should_render_filter_criteria_date_options`);
          });

          it("[PRPI-4908]_should_render_filter_criteria_date_options", async () => {
            expect(
              (await browser.compareScreen(`${CARD_NAME}_[PRPI-4908]_should_render_filter_criteria_date_options`))
                .misMatchPercentage,
            ).toEqual(0);
          });

          describe("and when the user changes the date option", () => {
            beforeAll(async () => {
              await browser.waitUntilClickableNative(radioListSO.item[1]);
              await radioListSO.item[1].click();
              await browser.waitUntilImageEquals(`${CARD_NAME}_[PRPI-4909]_should_render_date_filter`);
            });

            it("[PRPI-4909]_should_render_date_filter", async () => {
              expect(
                (await browser.compareScreen(`${CARD_NAME}_[PRPI-4909]_should_render_date_filter`)).misMatchPercentage,
              ).toEqual(0);
            });
          });
        });
      });
    });

    describe("when the user clicks on competition filter", () => {
      beforeAll(async () => {
        await browser.waitUntilClickableNative(competitionsPebbleSO.element);
        await competitionsPebbleSO.element.click();

        await browser.waitUntilImageEquals(
          `${CARD_NAME}_[PRPI-4910]_should_render_competions_filter_options_without_reset_button`,
        );
      });

      it("[PRPI-4910]_should_render_competions_filter_options_without_reset_button", async () => {
        expect(
          (
            await browser.compareScreen(
              `${CARD_NAME}_[PRPI-4910]_should_render_competions_filter_options_without_reset_button`,
            )
          ).misMatchPercentage,
        ).toEqual(0);
      });

      describe("When user selects one competition", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getFilteredCardResults(COMPETITION_FILTERED_CARD_MOCK));

          await browser.waitUntilClickableNative(optionListSO.options[1]);
          await optionListSO.options[1].click();

          await browser.waitUntilClickableNative(primaryButtonSO.element);
          await primaryButtonSO.element.click();

          await browser.waitUntilImageEquals(
            `${CARD_NAME}_[PRPI-4911]_should_show_the_competition_filter_as_the_first_one_and_with_a_counter`,
          );
        });

        it("[PRPI-4911]_should_show_the_competition_filter_as_the_first_one_and_with_a_counter", async () => {
          expect(
            (
              await browser.compareScreen(
                `${CARD_NAME}_[PRPI-4911]_should_show_the_competition_filter_as_the_first_one_and_with_a_counter`,
              )
            ).misMatchPercentage,
          ).toEqual(0);
        });
      });

      describe("When user selects two competitions", () => {
        beforeAll(async () => {
          const newCompetitionsPebbleSO = new PebbleSO(filterBySO.filters[0]);
          await browser.waitUntilClickableNative(newCompetitionsPebbleSO.element);
          await newCompetitionsPebbleSO.element.click();

          await browser.waitUntilClickableNative(optionListSO.options[0]);
          await optionListSO.options[0].click();

          await browser.waitUntilImageEquals(
            `${CARD_NAME}_[PRPI-4912]_should_render_competions_filter_options_with_reset_button`,
          );
        });

        it("[PRPI-4912]_should_render_competions_filter_options_with_reset_button", async () => {
          expect(
            (
              await browser.compareScreen(
                `${CARD_NAME}_[PRPI-4912]_should_render_competions_filter_options_with_reset_button`,
              )
            ).misMatchPercentage,
          ).toEqual(0);
        });

        afterEach(async () => {
          await filterCriteriaSO.closeButton.click();
          await browser.waitUntilClickableNative(competitionPebbleSO.element);
        });
      });
    });
  });
});
