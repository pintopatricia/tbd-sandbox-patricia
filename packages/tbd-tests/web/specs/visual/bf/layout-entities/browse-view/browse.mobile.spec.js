const { SportsBrowsePO, BottomBarPO, SearchBarPO, LinkPO, PebbleListPO } = require("../../../../../page-objects");
const { getBrowseLayout, getSearchResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { setCookie } = require("../../../../../helpers/cookie.util");

const bottomBarPO = new BottomBarPO();
const searchBarPO = new SearchBarPO();
const sportsBrowsePO = new SportsBrowsePO();
const sportQuickLinks = new LinkPO(sportsBrowsePO.quicklinks);
const sportFiltersPebbleListPO = new PebbleListPO(sportsBrowsePO.element);

const mockService = new MockService();

const browseBottomTile = bottomBarPO.tiles[1];

const VISITOR_ID_COOKIE = { name: "vid", value: "test-vid" };

const EXPERIMENT_MOCK = {
  experiments: [{ name: "exp-search-filter", variant: "search-filter" }],
  LPS_FE_EXPOSURE: { isActive: true },
};

const BFF_MOCK = {
  urn: "ppb:tbd:view:browse:sports",
  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:sport:1",
          viewUrl: routes.getSportViewUrl("1"),
        },
      },
      {
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: routes.getBrowseViewUrl(),
        },
      },
      {
        tileType: "MY_BETS",
        viewLink: {
          viewUrn: "ppb:tbd:view:myBets:open",
          viewUrl: routes.getMyBetsViewUrl("open"),
        },
      },
      {
        tileType: "GAMING",
        viewLink: {
          viewUrn: "ppb:tbd:view:gaming:1",
          viewUrl: routes.getGamingViewUrl("1"),
        },
      },
    ],
  },
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
        quickLinksTitle: null,
        links: [
          {
            label: "Football",
            icon: "1",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:1",
              viewUrl: "football/sport:1",
            },
            target: null,
          },
          {
            label: "Horse Racing",
            icon: "7",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:7",
              viewUrl: "horse-racing/s-7",
            },
            target: null,
          },
          {
            label: "Greyhound Racing",
            icon: "4339",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:4339",
              viewUrl: "greyhound-racing/sport:4339",
            },
            target: null,
          },
        ],
      },
    },
  ],
};

const BFF_MOCK_WITHOUT_CASINO = {
  urn: "ppb:tbd:view:browse:sports",
  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:sport:1",
          viewUrl: routes.getSportViewUrl("1"),
        },
      },
      {
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: routes.getBrowseViewUrl(),
        },
      },
      {
        tileType: "MY_BETS",
        viewLink: {
          viewUrn: "ppb:tbd:view:myBets:open",
          viewUrl: routes.getMyBetsViewUrl("open"),
        },
      },
    ],
  },
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
        quickLinksTitle: null,
        links: [
          {
            label: "Football",
            icon: "1",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:1",
              viewUrl: "football/sport:1",
            },
            target: null,
          },
          {
            label: "Horse Racing",
            icon: "7",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:7",
              viewUrl: "horse-racing/s-7",
            },
            target: null,
          },
        ],
      },
    },
  ],
};

const SEARCH_MOCK = [
  {
    __typename: "CompetitionView",
    urn: "ppb:tbd:view:competition:2",
    competition: {
      name: "Spanish Copa del Rey",
      urn: "ppb:competition:2",
      sport: {
        name: "Football",
        sportId: 1,
      },
      logo: {
        large: "http://example.test.com/mockedImage/image.png",
      },
    },
    sport: {
      name: "Football",
      sportId: 1,
    },
  },
  {
    __typename: "CompetitionView",
    urn: "ppb:tbd:view:competition:3",
    competition: {
      name: "Spanish La Liga",
      urn: "ppb:competition:3",
      sport: {
        name: "Football",
        sportId: 1,
      },
    },
    sport: {
      name: "Football",
      sportId: 1,
    },
  },
  {
    __typename: "EventView",
    urn: "ppb:tbd:view:event:29661847",
    sportevent: {
      name: "Real Madrid v Atletico Madrid",
      openDate: "2009-10-10T22:00Z",
      competition: {
        name: "Spanish La Liga",
        sport: {
          sportId: 1,
          name: "Football",
        },
      },
      sport: {
        name: "Football",
        sportId: 1,
      },
    },
  },
  {
    __typename: "EventView",
    urn: "ppb:tbd:view:event:29675213",
    sportevent: {
      name: "San Fernando CD v Real Murcia",
      openDate: "2020-02-02T16:00Z",
      competition: {
        name: "Spanish Segunda Division B - Group 4",
        sport: {
          sportId: 1,
          name: "Football",
        },
      },
      sport: {
        name: "Football",
        sportId: 1,
      },
    },
  },
  {
    __typename: "EventView",
    urn: "ppb:tbd:view:event:29673302",
    sportevent: {
      name: "Atletico Huila v Real Santander",
      openDate: "2020-02-06T00:40Z",
      competition: {
        name: "Colombian Primera B",
        sport: {
          sportId: 1,
          name: "Football",
        },
      },
      sport: {
        name: "Football",
        sportId: 1,
      },
    },
  },
  {
    __typename: "EventView",
    urn: "ppb:tbd:view:event:29675162",
    sportevent: {
      name: "CF Rayo Majadahonda v Real Oviedo II",
      openDate: "2020-02-02T15:00Z",
      competition: {
        name: "Spanish Segunda Division B - Group 1",
        sport: {
          sportId: 1,
          name: "Football",
        },
      },
      sport: {
        name: "Football",
        sportId: 1,
      },
    },
  },
  {
    __typename: "EventView",
    urn: "ppb:tbd:view:event:29876543",
    sportevent: {
      name: "Grand National Real Racing",
      openDate: "2020-04-04T15:00Z",
      competition: {
        name: "Grand National Festival",
        sport: {
          sportId: 7,
          name: "Horse Racing",
        },
      },
      sport: {
        name: "Horse Racing",
        sportId: 7,
      },
    },
  },
];

const MODULE_NAME = "browse";

describe("Searching on the browse section", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, {
        date: "2009-10-10T18:44Z",
        disableCSSAnimations: true,
        BROWSE_CASINO_WEB: { isActive: false },
        ...EXPERIMENT_MOCK,
      }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getBrowseLayout(BFF_MOCK));
    await browser.url(routes.getBrowseViewUrl());
    await setCookie(VISITOR_ID_COOKIE.name, VISITOR_ID_COOKIE.value);
    await browser.refresh();
    await browser.waitUntilDisplayed(bottomBarPO.element);
    await browseBottomTile.click();
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1624]_should_render_basic_browse`);
  });

  it("[PRPI-1624]_should_render_basic_browse", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1624]_should_render_basic_browse`)).toBe(0);
  });

  describe("And user clicks on the search input", () => {
    beforeAll(async () => {
      await searchBarPO.input.click();
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1625]_should_dismiss_section_items`);
    });

    it("[PRPI-1625]_should_dismiss_section_items", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1625]_should_dismiss_section_items`)).toBe(0);
    });

    describe("And user inputs 'real'", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getSearchResults({ query: "real", results: SEARCH_MOCK }));
        await searchBarPO.setValue("real");
        await browser.waitUntilDisplayed(sportFiltersPebbleListPO.element);
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1626]_should_show_results`);
      });

      it("[PRPI-1626]_should_show_results", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1626]_should_show_results`)).toBe(0);
      });

      describe("And user clicks on the 'x' icon", () => {
        beforeAll(async () => {
          await searchBarPO.cleanButton.click();
          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1627]_should_show_be_empty`);
        });

        it("[PRPI-1627]_should_show_be_empty", async () => {
          expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1627]_should_show_be_empty`)).toBe(0);
        });
      });

      describe("And user clicks on the cancel button", () => {
        beforeAll(async () => {
          await searchBarPO.cancelButton.click();
          await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1628]_should_show_section_items`);
        });

        it("[PRPI-1628]_should_show_section_items", async () => {
          expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1628]_should_show_section_items`)).toBe(0);
        });
      });
    });

    describe("Search with 'typos' and it returns did you mean", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getSearchResults({ query: "rial", results: SEARCH_MOCK, didYouMean: "Real" }),
        );
        await searchBarPO.setValue("rial");
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1629]_should_show_did_you_mean`);
      });

      afterAll(async () => {
        await searchBarPO.cancelButton.click();
        await browser.waitUntilDisplayed(sportQuickLinks.element);
      });

      it("[PRPI-1629]_should_show_did_you_mean", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1629]_should_show_did_you_mean`)).toBe(0);
      });
    });

    describe("Search with 'typos' and there aren't results", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getSearchResults({ query: "wzk", results: [] }));
        await searchBarPO.setValue("wzk");
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1630]_should_show_zero_results`);
      });

      it("[PRPI-1630]_should_show_zero_results", async () => {
        expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1630]_should_show_zero_results`)).toBe(0);
      });
    });
  });
});

describe("When user opens the Browse View and is self excluded for GAMES", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK_WITHOUT_CASINO.urn, {
        date: "2009-10-10T18:44Z",
        disableCSSAnimations: true,
        productExclusions: ["GAMES"],
      }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getBrowseLayout(BFF_MOCK_WITHOUT_CASINO));
    await browser.url(routes.getBrowseViewUrl());
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1631]_casino_tab_should_not_be_present`);
  });

  it("[PRPI-1631]_casino_tab_should_not_be_present", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1631]_casino_tab_should_not_be_present`)).toBe(0);
  });
});
