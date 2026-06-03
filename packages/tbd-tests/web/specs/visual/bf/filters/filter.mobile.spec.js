const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const { getGenericLayout, getQueryCardResponse } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { OptionListPO, FilterByPO, AlertPO, FilterCriteriaPO, PebblePO } = require("../../../../page-objects");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();

const filterByPO = new FilterByPO();
const sortPebblePO = new PebblePO(filterByPO.filters[0]);
const competitionsPebblePO = new PebblePO(filterByPO.filters[2]);
const filterCriteriaPO = new FilterCriteriaPO();
const optionListPO = new OptionListPO(filterCriteriaPO.element);

const alertPO = new AlertPO();
const EVENT_TYPE_ID = "1";

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:allmatchesraces/1",
  url: "view/generic:allmatchesraces/1",
  title: null,
  pageInfo: null,
  edges: [
    {
      node: {
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
                  urn: "ppb:tbd:country:PRT",
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
        },
        full: {
          edges: [
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
                defaultIndex: 1,
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:30464707",
                  name: "Chelsea v Real Madrid",
                },
                displayRunners: {
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.262429640",
                      name: "Match Odds",
                      hierarchy: {
                        __typename: "EventCompetitionHierarchy",
                        sportevent: {
                          urn: `ppb:event:30464707`,
                        },
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
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.262429640/55190",
                          name: "Chelsea",
                          selectionId: 55190,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.262429640/58805",
                          name: "The Draw",
                          selectionId: 58805,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.262429640/2426",
                          name: "Real Madrid",
                          selectionId: 2426,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.262429640/55190",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.262429640/58805",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.262429640/2426",
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
                    viewUrn: "ppb:tbd:view:runner:1.182896135/48799/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.182896135/48787/0",
                    viewUrn: "ppb:tbd:view:runner:1.182896135/48787/0",
                  },
                  {
                    runnerUrn: "ppb:excRunner:1.182896135/58805/0",
                    viewUrn: "ppb:tbd:view:runner:1.182896135/58805/0",
                  },
                ],

                title: "Match Odds",
                defaultIndex: 1,
                sportevent: {
                  __typename: "SportsEvent",
                  urn: "ppb:event:30482022",
                  name: "Braga v Pacos Ferreira",
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
                        sportevent: {
                          urn: `ppb:event:30482022`,
                        },
                        competition: {
                          __typename: "Competition",
                          urn: "ppb:competition:99",
                          name: "Portuguese Primeira Liga",
                          competitionId: 99,
                        },
                      },
                      runners: [
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.263003281/48799",
                          name: "Braga",
                          selectionId: 48799,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.263003281/58805",
                          name: "The Draw",
                          selectionId: 58805,
                        },
                        {
                          __typename: "Runner",
                          runnerURN: "ppb:sbkRunner:924.263003281/48787",
                          name: "Pacos Ferreira",
                          selectionId: 48787,
                        },
                      ],
                    },
                    runners: [
                      {
                        runnerURN: "ppb:sbkRunner:924.263003281/48799",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.263003281/58805",
                      },
                      {
                        runnerURN: "ppb:sbkRunner:924.263003281/48787",
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
        viewAll: {
          label: "View More",
          icon: null,
          viewLink: {
            viewUrn: "ppb:tbd:view:sport:1",
            viewUrl: "football/s-1",
          },
        },
      },
    },
    {
      node: {
        __typename: "RegulatoryCard",
        urn: "ppb:tbd:card:regulatory:footer",
        sections: [
          {
            sectionType: "GENERIC",
            __typename: "RegulatorySectionGeneric",
            genericSectionTitle: "Responsible Gambling",
          },
        ],
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
      },
    },
    {
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
      },
    },
  ],
};

const ALL_COMPETITIONS_MOCK = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:filtered:YIA8mBEAACMAMOhA/s/1",
  filteredCouponTitle: "All Matches",
  filterOptions: {
    competitionsFilter: {
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
            urn: "ppb:tbd:country:PRT",
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
  },
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

const BFF_NO_ITEMS_MOCK = {
  urn: "ppb:tbd:view:generic:allmatchesraces/1",
  url: "view/generic:allmatchesraces/1",
  title: null,
  pageInfo: null,
  edges: [
    {
      node: {
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
            defaultOption: null,
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
                  urn: "ppb:tbd:country:International",
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
                  urn: "ppb:tbd:country:PRT",
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
        },
        full: {
          edges: [],
        },
        partials: {
          edges: [],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
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

const MODULE_NAME = "all_matches_filters";

describe("When user is on a Generic View with all matches", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getQueryCardResponse("AllCompetitionsFilter", ALL_COMPETITIONS_MOCK));
    await mockService.mockHttpRequest(getScaResponse({}));
    await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1299]_should_render_all_matches_filters`);
  });

  it("[PRPI-1299]_should_render_all_matches_filters", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1299]_should_render_all_matches_filters`)).toBe(0);
  });

  describe("when the user clicks on the sort filter", () => {
    beforeAll(async () => {
      await sortPebblePO.element.waitForClickable();
      await sortPebblePO.element.click();
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1300]_should_render_filter_criteria_options`);
    });
    afterAll(async () => {
      await filterCriteriaPO.closeButton.waitForClickable();
      await filterCriteriaPO.closeButton.click();
    });

    it("[PRPI-1300]_should_render_filter_criteria_options", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1300]_should_render_filter_criteria_options`)).toBe(0);
    });
  });

  describe("when the user scrolls to competitions filter", () => {
    beforeAll(async () => {
      await competitionsPebblePO.element.scrollIntoView({ block: "end", inline: "end" });
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1301]_should_render_competition_filter_not_highlighted`);
    });

    it("[PRPI-1301]_should_render_competition_filter_not_highlighted", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1301]_should_render_competition_filter_not_highlighted`),
      ).toBe(0);
    });
  });

  describe("when the user clicks on the competitions filter", () => {
    beforeAll(async () => {
      await competitionsPebblePO.element.click();
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1302]_should_render_competions_filter_options_without_reset_button`,
      );
    });

    it("[PRPI-1302]_should_render_competions_filter_options_without_reset_button", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1302]_should_render_competions_filter_options_without_reset_button`,
        ),
      ).toBe(0);
    });

    describe("and selects multiple competetitions", () => {
      beforeAll(async () => {
        await optionListPO.itemText[0].waitForClickable();
        await optionListPO.itemText[0].click();
        await optionListPO.itemText[1].waitForClickable();
        await optionListPO.itemText[1].click();
        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1303]_should_render_competions_filter_options_with_reset_button`,
        );
      });

      it("[PRPI-1303]_should_render_competions_filter_options_with_reset_button", async () => {
        expect(
          await browser.checkScreen(
            `${MODULE_NAME}_[PRPI-1303]_should_render_competions_filter_options_with_reset_button`,
          ),
        ).toBe(0);
      });
    });
  });

  describe("when there are no events to be shown", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_NO_ITEMS_MOCK.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGenericLayout(BFF_NO_ITEMS_MOCK));
      await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1304]_should_render_no_matches_message`);
    });

    it("[PRPI-1304]_should_render_no_matches_message", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1304]_should_render_no_matches_message`)).toBe(0);
    });
  });

  describe("and scroll down until the end of cards", () => {
    beforeAll(async () => {
      const BFF_MAX_ITEMS_REACHED = {
        ...BFF_MOCK,
      };

      BFF_MAX_ITEMS_REACHED.edges[0].node.partials = {
        ...BFF_MAX_ITEMS_REACHED.edges[0].node.partials,
        pageInfo: {
          hasNextPage: true,
        },
      };

      await mockService.mockHttpRequest(await getIndexHTML(BFF_MAX_ITEMS_REACHED.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGenericLayout(BFF_MAX_ITEMS_REACHED));
      await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
      await alertPO.element.scrollIntoView();
      await browser.waitUntilDisplayed(alertPO.element);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1305]_should_render_warning_message`);
    });

    describe("and there are more events than the max allowed", () => {
      it("[PRPI-1305]_should_render_warning_message", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1305]_should_render_warning_message`)).toBe(0);
      });
    });
  });

  describe("When the competitions filter is active", () => {
    beforeAll(async () => {
      const BFF_MOCK_COMPETITIONS_FILTER_SORTED = {
        ...BFF_MOCK,
      };

      BFF_MOCK_COMPETITIONS_FILTER_SORTED.edges[0].node.filterOptions = {
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
        },
        competitionsFilter: {
          urn: "ppb:tbd:cardfilter:competitions:YIA8mBEAACMAMOhA/s/1",
          defaultOptions: [
            {
              urn: "ppb:competition:228",
              name: "UEFA Champions League",
              sport: {
                urn: "Football",
              },
            },
          ],
        },
        filtersSorting: ["competitionsFilter", "sortOption", "dateRangeFilter"],
      };
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_COMPETITIONS_FILTER_SORTED.urn));
      await mockService.mockFonts(getMockFonts());
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_COMPETITIONS_FILTER_SORTED));
      await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1306]_should_show_the_competition_filter_as_the_first_one`,
      );
    });

    it("[PRPI-1306]_should_show_the_competition_filter_as_the_first_one", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1306]_should_show_the_competition_filter_as_the_first_one`),
      ).toBe(0);
    });
  });
});
