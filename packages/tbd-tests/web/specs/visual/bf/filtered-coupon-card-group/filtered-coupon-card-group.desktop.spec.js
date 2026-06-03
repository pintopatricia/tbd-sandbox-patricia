const {
  getGenericLayout,
  getFilteredCardResults,
  getQueryCardResponse,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");
const { SMP } = require("@flutter-global/uki-channels-http-clients/mock-index");
const FilteredCouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const CompetitionFilterDrawerPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/CompetitionFilterDrawer/CompetitionFilterDrawer.web.po");
const {
  MarketSwitcherPO,
  FilterByPO,
  CardPO,
  OptionListPO,
  ActionButtonPO,
  PebblePO,
  PebbleListPO,
  RadioListPO,
} = require("../../../../page-objects");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getHomeViewUrl } = require("../../../../../utils/routes");

const { getMarketPrices } = SMP;

const MODULE_NAME = "filtered_coupon_card_group";
const mockService = new MockService();
const filteredCouponCardGroupPO = new FilteredCouponCardGroupPO();
const filterByPO = new FilterByPO();
const competitionsPebblePO = new PebblePO(filterByPO.filters[0]);
const actionButtonPO = new ActionButtonPO();
const competitionFilterDrawerPO = new CompetitionFilterDrawerPO();
const marketSwitcherPO = new MarketSwitcherPO(filteredCouponCardGroupPO.marketSwitcher);
const pebbleListPO = new PebbleListPO(filteredCouponCardGroupPO.pebbleListContainer);
const radioListPO = new RadioListPO();
const NUMBER_OF_MARKETS = 3;

const createCompetition = (id) => ({
  __typename: "Competition",
  urn: `ppb:competition:${id}`,
  name: `Competition ${id}`,
  competitionId: id,
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:1",
    name: "Football",
    sportId: 1,
  },
});

const createCountry = (countryCode) => ({
  urn: `ppb:tbd:country:${countryCode}`,
  code: countryCode,
});

const createMarketRunner = (marketId, selectionId) => ({
  _typename: "Runner",
  runnerURN: `ppb:sbkRunner:924.${marketId}/${selectionId}`,
  name: `Runner ${selectionId}`,
  resultType: null,
  selectionId,
});

const createEventMarketcard = (id, marketName, competitionId, label) => ({
  node: {
    __typename: "EventMarketCard",
    urn: `ppb:tbd:card:eventPrimaryMarket:${id}`,
    eventViewLink: {
      viewUrn: `ppb:tbd:view:event:${id}`,
      viewUrl: `football/competition/event/e-${id}`,
    },
    runnerViewLinks: [],
    title: marketName,
    sportevent: {
      urn: `ppb:event:${id}`,
      eventId: id,
      name: `Team A ${id} v Team B ${id}`,
      competition: createCompetition(competitionId),
    },
    displayRunners: {
      sportsbook: {
        market: {
          __typename: "SportsbookMarket",
          urn: `ppb:sbkMarket:924.${id}`,
          name: marketName,
          marketType: marketName.replace(" ", "_").toUpperCase(),
          noLiveData: true,
          hierarchy: {
            __typename: "EventCompetitionHierarchy",
            sportevent: {
              urn: `ppb:event:${id}`,
              eventId: id,
              name: `Team A ${id} v Team B ${id}`,
              competition: createCompetition(competitionId),
            },
            competition: createCompetition(competitionId),
          },
          runners: [1, 2, 3].map((key) => createMarketRunner(id, key)),
        },
        runners: [1, 2, 3].map((key) => ({
          __typename: "Runner",
          runnerURN: `ppb:sbkRunner:924.${id}/${key}`,
        })),
      },
    },
    fixture: {
      urn: `ppb:fixture:${id}`,
      home: {
        name: `${label || "Home"} ${id}`,
      },
      away: {
        name: `${label || "Away"} ${id}`,
      },
      scheduledAt: `2021-05-10T${id < 10 ? `0${id}` : id}:00:00Z`,
    },
  },
});

const createEventMarketCardPartial = (id) => ({
  node: {
    __typename: "EventMarketCard",
    urn: `ppb:tbd:card:eventPrimaryMarket:${id}`,
  },
});

const MARKET_TYPE_FILTER = {
  urn: "ppb:tbd:cardfilter:markettype:coupon/s/1",
  defaultOption: null,
  availableOptions: [
    {
      name: "Match Odds",
      marketType: {
        urn: "ppb:marketType:MATCH_ODDS",
      },
    },
    {
      name: "Half Time",
      marketType: {
        urn: "ppb:marketType:HALF_TIME",
      },
    },
  ],
};

const COMPETITIONS_FILTER = {
  urn: "ppb:tbd:cardfilter:competitions:coupon/s/1",
  defaultOptions: null,
  topCompetitions: [1, 2].map((key) => createCompetition(key)),
};

const FILTERED_COUPON_PARAMS = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:coupon:filtered/cv/home",
  defaultMarketTab: null,
  filteredCouponTitle: "Desktop Test",
  filterOptions: {
    marketTypeFilter: MARKET_TYPE_FILTER,
    competitionsFilter: COMPETITIONS_FILTER,
  },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:generic:home",
  edges: [
    {
      node: {
        ...FILTERED_COUPON_PARAMS,
        full: {
          edges: [...Array(NUMBER_OF_MARKETS).keys()].map((key) => createEventMarketcard(key + 1, "Match Odds", 1)),
        },
        partials: {
          partialEdges: [...Array(NUMBER_OF_MARKETS).keys()].map((key) => createEventMarketCardPartial(key + 1)),
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:coupon:filtered/cv/home",
      },
    },
  ],
};

const ALL_COMPETITIONS_MOCK = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:coupon:filtered/cv/home",
  filteredCouponTitle: "All Matches",
  filterOptions: {
    competitionsFilter: {
      allCompetitions: ["ARG", "BRA", "GBR", "International", "ITA", "JPN", "POL", "PRT"].map((country, id) => ({
        country: createCountry(country),
        competitions: [createCompetition(id + 3)],
      })),
    },
  },
};

const COMPETITION_FILTERED_BFF_MOCK = {
  cards: [
    {
      ...FILTERED_COUPON_PARAMS,
      full: {
        edges: [createEventMarketcard(9, "Match Odds", 9), createEventMarketcard(10, "Match Odds", 10)],
      },
      partials: {
        partialEdges: [9, 10].map((key) => createEventMarketCardPartial(key)),
      },
    },
  ],
};

const HALF_TIME_BFF_MOCK = {
  cards: [
    {
      ...FILTERED_COUPON_PARAMS,
      full: {
        edges: [createEventMarketcard(11, "Half Time", 9)],
      },
      partials: {
        partialEdges: [createEventMarketCardPartial(11)],
      },
    },
  ],
};

const createSMPMarketMock = (id) => ({
  marketId: `924.${id}`,
  runnerDetails: [1, 2, 3].map((key) => ({
    selectionId: key,
    runnerOdds: {
      decimalDisplayOdds: { decimalOdds: id + key * 0.1 },
    },
    runnerStatus: "ACTIVE",
  })),
});

const SMP_MOCK = {
  markets: [1, 2, 3, 9, 10, 11].map((key) => createSMPMarketMock(key)),
};

// New mock data for market type filter layout tests
const MARKET_TYPE_FILTER_PEBBLES = {
  urn: "ppb:tbd:cardfilter:markettype:coupon/s/1",
  defaultOption: null,
  layout: "PEBBLES",
  availableOptions: [
    {
      id: "over_under_15",
      name: "Over/Under 1.5 Goals",
      marketType: {
        urn: "ppb:marketType:OVER_UNDER_15",
      },
    },
    {
      id: "over_under_25",
      name: "Over/Under 2.5 Goals",
      marketType: {
        urn: "ppb:marketType:OVER_UNDER_25",
      },
    },
  ],
};

const MARKET_TYPE_FILTER_LIST = {
  urn: "ppb:tbd:cardfilter:markettype:coupon/s/1",
  defaultOption: null,
  layout: "LIST",
  availableOptions: [
    {
      id: "both_teams_to_score",
      name: "Both Teams To Score",
      marketType: {
        urn: "ppb:marketType:BOTH_TEAMS_TO_SCORE",
      },
    },
    {
      id: "over_under_35",
      name: "Over/Under 3.5 Goals",
      marketType: {
        urn: "ppb:marketType:OVER_UNDER_35",
      },
    },
  ],
};

const FILTERED_COUPON_PARAMS_PEBBLES = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:coupon:filtered/cv/pebbles",
  defaultMarketTab: null,
  filteredCouponTitle: "Pebbles Layout Test",
  filterOptions: {
    marketTypeFilter: MARKET_TYPE_FILTER_PEBBLES,
  },
};

const FILTERED_COUPON_PARAMS_LIST = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:coupon:filtered/cv/list",
  defaultMarketTab: null,
  filteredCouponTitle: "List Layout Test",
  filterOptions: {
    marketTypeFilter: MARKET_TYPE_FILTER_LIST,
  },
};

const FILTERED_COUPON_PARAMS_SINGLE = {
  __typename: "FilteredCouponCardGroup",
  urn: "ppb:tbd:cardgroup:coupon:filtered/cv/single",
  defaultMarketTab: null,
  filteredCouponTitle: "Single Item Test",
};

const BFF_MOCK_PEBBLES = {
  urn: "ppb:tbd:view:generic:pebbles",
  edges: [
    {
      node: {
        ...FILTERED_COUPON_PARAMS_PEBBLES,
        full: {
          edges: [...Array(NUMBER_OF_MARKETS).keys()].map((key) =>
            createEventMarketcard(key + 12, "Over/Under 1.5 Goals", 1),
          ),
        },
        partials: {
          partialEdges: [...Array(NUMBER_OF_MARKETS).keys()].map((key) => createEventMarketCardPartial(key + 12)),
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:coupon:filtered/cv/pebbles",
      },
    },
  ],
};

const BFF_MOCK_LIST = {
  urn: "ppb:tbd:view:generic:list",
  edges: [
    {
      node: {
        ...FILTERED_COUPON_PARAMS_LIST,
        full: {
          edges: [...Array(NUMBER_OF_MARKETS).keys()].map((key) =>
            createEventMarketcard(key + 15, "Both Teams To Score", 1),
          ),
        },
        partials: {
          partialEdges: [...Array(NUMBER_OF_MARKETS).keys()].map((key) => createEventMarketCardPartial(key + 15)),
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:coupon:filtered/cv/list",
      },
    },
  ],
};

const BFF_MOCK_SINGLE = {
  urn: "ppb:tbd:view:generic:single",
  edges: [
    {
      node: {
        ...FILTERED_COUPON_PARAMS_SINGLE,
        full: {
          edges: [...Array(NUMBER_OF_MARKETS).keys()].map((key) => createEventMarketcard(key + 18, "Match Odds", 1)),
        },
        partials: {
          partialEdges: [...Array(NUMBER_OF_MARKETS).keys()].map((key) => createEventMarketCardPartial(key + 18)),
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FilteredCouponCardGroup",
        urn: "ppb:tbd:cardgroup:coupon:filtered/cv/single",
      },
    },
  ],
};

const OVER_UNDER_25_BFF_MOCK = {
  cards: [
    {
      ...FILTERED_COUPON_PARAMS_PEBBLES,
      filterOptions: {
        marketTypeFilter: {
          ...MARKET_TYPE_FILTER_PEBBLES,
          defaultOption: {
            id: "over_under_25",
            name: "Over/Under 2.5 Goals",
            marketType: {
              urn: "ppb:marketType:OVER_UNDER_25",
            },
          },
        },
      },
      full: {
        edges: [...Array(NUMBER_OF_MARKETS).keys()].map((key) =>
          createEventMarketcard(key + 12, "Over/Under 1.5 Goals", 1, "UEFA Nations League"),
        ),
      },
      partials: {
        partialEdges: [createEventMarketCardPartial(21)],
      },
    },
  ],
};

const OVER_UNDER_35_BFF_MOCK = {
  cards: [
    {
      ...FILTERED_COUPON_PARAMS_LIST,
      filterOptions: {
        marketTypeFilter: {
          ...MARKET_TYPE_FILTER_LIST,
          defaultOption: {
            id: "over_under_35",
            name: "Over/Under 3.5 Goals",
            marketType: {
              urn: "ppb:marketType:OVER_UNDER_35",
            },
          },
        },
      },
      full: {
        edges: [createEventMarketcard(22, "Over/Under 3.5 Goals", 1)],
      },
      partials: {
        partialEdges: [createEventMarketCardPartial(22)],
      },
    },
  ],
};

const EXTENDED_SMP_MOCK = {
  markets: [1, 2, 3, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22].map((key) => createSMPMarketMock(key)),
};

// I am fixing this test now
describe("Filtered Coupon Card Group - Competition Filters", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK, { withBottomBar: false }));
    await mockService.mockHttpRequest(getQueryCardResponse("AllCompetitionsFilter", ALL_COMPETITIONS_MOCK));
    await mockService.mockHttpRequest(getSSCHeaderCSS());
    await mockService.mockHttpRequest(getSSCv1Content());
    await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockFonts(getMockFonts());
    await browser.url(getHomeViewUrl());
  });

  describe("when BFF returns a filtered coupon cardgroup with available filters", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(filteredCouponCardGroupPO.element);

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1288]_should_correctly_display_the_filtered_coupon_card_group`,
      );
    });

    it("[PRPI-1288]_should_correctly_display_the_filtered_coupon_card_group", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1288]_should_correctly_display_the_filtered_coupon_card_group`),
      ).toBe(0);
    });
  });

  describe("when the user clicks on the competitions filter", () => {
    beforeAll(async () => {
      await competitionsPebblePO.element.waitForClickable();
      await competitionsPebblePO.element.click();

      await browser.waitUntilDisplayed(competitionFilterDrawerPO.element);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1289]_should_open_the_competitions_filter_dropdown`);
    });

    it("[PRPI-1289]_should_open_the_competitions_filter_dropdown", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1289]_should_open_the_competitions_filter_dropdown`)).toBe(
        0,
      );
    });
  });

  describe("when the user scrolls to the end of all competition and selects the last two", () => {
    beforeAll(async () => {
      await browser.waitUntil(async () => {
        const totalCompetitionGroups = await competitionFilterDrawerPO.competitionByCountry.length;
        return totalCompetitionGroups === 8;
      });
      const accordionsLength = await competitionFilterDrawerPO.competitionByCountry.length;
      const portugalCardPO = new CardPO(competitionFilterDrawerPO.competitionByCountry[accordionsLength - 1]);
      const polandCardPO = new CardPO(competitionFilterDrawerPO.competitionByCountry[accordionsLength - 2]);

      await browser.waitUntilDisplayed(portugalCardPO.element);
      await browser.waitUntilDisplayed(polandCardPO.element);

      await portugalCardPO.element.scrollIntoView();

      // Open Poland collapse and select the competition
      await polandCardPO.header.waitForClickable();
      await polandCardPO.header.click();

      const polandCompetitionCheckbox = new OptionListPO(polandCardPO.element);
      await polandCompetitionCheckbox.itemText[0].waitForClickable();
      await polandCompetitionCheckbox.itemText[0].click();

      // dropdown "header" pushes content down...
      await portugalCardPO.element.scrollIntoView();

      // Open Portugal collapse and select the competition
      await portugalCardPO.header.waitForClickable();
      await portugalCardPO.header.click();

      const portugalCompetitionCheckbox = new OptionListPO(portugalCardPO.element);
      // scroll isn't corrected with click...
      await portugalCompetitionCheckbox.itemText[0].scrollIntoView();
      await portugalCompetitionCheckbox.itemText[0].waitForClickable();
      await portugalCompetitionCheckbox.itemText[0].click();

      await browser.waitUntilImageEquals(
        `${MODULE_NAME}_[PRPI-1290]_should_have_both_portuguese_and_poland_competitions_selected`,
      );
    });

    it("[PRPI-1290]_should_have_both_portuguese_and_poland_competitions_selected", async () => {
      expect(
        await browser.checkScreen(
          `${MODULE_NAME}_[PRPI-1290]_should_have_both_portuguese_and_poland_competitions_selected`,
        ),
      ).toBe(0);
    });
  });

  describe("when the user clicks to accept the selected competition filters", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getFilteredCardResults(COMPETITION_FILTERED_BFF_MOCK));

      await actionButtonPO.element.waitForClickable();
      await actionButtonPO.element.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1291]_should_see_the_competition_filters_applied`);
    });

    it("[PRPI-1291]_should_see_the_competition_filters_applied", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1291]_should_see_the_competition_filters_applied`)).toBe(
        0,
      );
    });
  });

  describe("when the user clicks on the market switcher", () => {
    beforeAll(async () => {
      await marketSwitcherPO.element.waitForClickable();
      await marketSwitcherPO.element.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1292]_should_open_the_market_switcher`);
    });

    it("[PRPI-1292]_should_open_the_market_switcher", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1292]_should_open_the_market_switcher`)).toBe(0);
    });
  });

  describe("and the user clicks to select Half Time", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getFilteredCardResults(HALF_TIME_BFF_MOCK));

      const radioListThirdItem = await radioListPO.listItems[2];
      await radioListThirdItem.waitForClickable();
      await radioListThirdItem.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1293]_should_select_half_time_markets`);
    });

    it("[PRPI-1293]_should_select_half_time_markets", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1293]_should_select_half_time_markets`)).toBe(0);
    });
  });
});

describe("Filtered Coupon Card Group - Market Type Filter Layouts", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getSSCHeaderCSS());
    await mockService.mockHttpRequest(getSSCv1Content());
    await mockService.mockHttpRequest(getMarketPrices(EXTENDED_SMP_MOCK, { ignoreRequestedMarketIdsMatch: true }));
    await mockService.mockFonts(getMockFonts());
    await browser.url(getHomeViewUrl());
  });

  // GNSS-310: Market Type Filter with PEBBLES layout
  describe("when FilteredCouponCardGroup has marketTypeFilter with PEBBLES layout and two availableOptions", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_PEBBLES.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_PEBBLES, { withBottomBar: false }));
      await mockService.mockFonts(getMockFonts());
      await browser.url(getHomeViewUrl());
      await browser.waitUntilDisplayed(filteredCouponCardGroupPO.element);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1294]_should_display_pebbles_for_market_type_filter`);
    });

    it("[PRPI-1294]_should_display_pebbles_for_market_type_filter", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1294]_should_display_pebbles_for_market_type_filter`),
      ).toBe(0);
    });

    describe("when a pebble is clicked", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getFilteredCardResults(OVER_UNDER_25_BFF_MOCK));

        // Click the second pebble (Over/Under 2.5 Goals)
        await pebbleListPO.pebbles[1].waitForClickable();
        await pebbleListPO.pebbles[1].click();

        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1295]_should_update_market_list_when_pebble_clicked`);
      });

      it("[PRPI-1295]_should_update_market_list_when_pebble_clicked", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1295]_should_update_market_list_when_pebble_clicked`),
        ).toBe(0);
      });
    });
  });

  // GNSS-310: Market Type Filter with LIST layout
  describe("when FilteredCouponCardGroup has marketTypeFilter with LIST layout and two availableOptions", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_LIST.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_LIST, { withBottomBar: false }));
      await mockService.mockFonts(getMockFonts());
      await browser.url(getHomeViewUrl());
      await browser.waitUntilDisplayed(filteredCouponCardGroupPO.element);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1296]_should_display_dropdown_for_market_type_filter`);
    });

    it("[PRPI-1296]_should_display_dropdown_for_market_type_filter", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1296]_should_display_dropdown_for_market_type_filter`),
      ).toBe(0);
    });

    describe("when a dropdown item is selected", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getFilteredCardResults(OVER_UNDER_35_BFF_MOCK));

        await marketSwitcherPO.element.waitForClickable();
        await marketSwitcherPO.element.click();

        // Select the second option (Over/Under 3.5 Goals)
        const radioListSecondItem = await radioListPO.listItems[1];
        await radioListSecondItem.waitForClickable();
        await radioListSecondItem.click();

        await browser.waitUntilImageEquals(
          `${MODULE_NAME}_[PRPI-1297]_should_update_market_list_when_dropdown_item_selected`,
        );
      });

      it("[PRPI-1297]_should_update_market_list_when_dropdown_item_selected", async () => {
        expect(
          await browser.checkScreen(`${MODULE_NAME}_[PRPI-1297]_should_update_market_list_when_dropdown_item_selected`),
        ).toBe(0);
      });
    });
  });

  // GNSS-310: Market Type Filter with single item
  describe("when FilteredCouponCardGroup has only one marketTypeFilter availableOption", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_SINGLE.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_SINGLE, { withBottomBar: false }));
      await mockService.mockFonts(getMockFonts());
      await browser.url(getHomeViewUrl());
      await browser.waitUntilDisplayed(filteredCouponCardGroupPO.element);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1298]_should_not_display_filter_with_single_option`);
    });

    it("[PRPI-1298]_should_not_display_filter_with_single_option", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1298]_should_not_display_filter_with_single_option`)).toBe(
        0,
      );
    });
  });
});
