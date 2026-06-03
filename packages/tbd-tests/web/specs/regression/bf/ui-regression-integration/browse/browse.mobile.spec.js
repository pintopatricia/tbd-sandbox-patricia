const {
  SportsBrowsePO,
  SectionHeaderPO,
  SearchBarPO,
  SearchResultsListPO,
  LinkPO,
  BottomBarPO,
  PebbleListPO,
  SearchResultItemPO,
  TabsGroupPO,
  SearchBarHistoryPO,
} = require("../../../../../page-objects");
const {
  getEventLayout,
  getSearchResults,
  getSportsLayout,
  getBrowseLayout,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");
const { setCookie } = require("../../../../../helpers/cookie.util");

const bottomBarPO = new BottomBarPO();
const browsePO = new SectionHeaderPO();
const sportsBrowsePO = new SportsBrowsePO();
const searchBarPO = new SearchBarPO();
const tabsPO = new TabsGroupPO();
const sportsFilterPebbleListPO = new PebbleListPO(sportsBrowsePO.element);
const searchBarHistoryPO = new SearchBarHistoryPO(sportsBrowsePO.element);

const sportQuickLinks = new LinkPO(sportsBrowsePO.quicklinks);
const footballLink = new LinkPO(sportsBrowsePO.quicklinkLinks[0]);
const horseRacingLink = new LinkPO(sportsBrowsePO.quicklinkLinks[1]);
const greyhoundRacingLink = new LinkPO(sportsBrowsePO.quicklinkLinks[2]);

const mockService = new MockService();

const EVENT_ID = "29465861";
const EVENT_TYPE_ID = 1;
const searchResultsListPO = new SearchResultsListPO();

const firstSearchResult = new SearchResultItemPO(searchResultsListPO.results[0]);
const secondSearchResult = new SearchResultItemPO(searchResultsListPO.results[1]);
const thirdSearchResult = new SearchResultItemPO(searchResultsListPO.results[2]);
const fourthSearchResult = new SearchResultItemPO(searchResultsListPO.results[3]);
const browseBottomTile = bottomBarPO.tiles[1];

const BFF_MOCK = {
  urn: `ppb:tbd:view:event:${EVENT_ID}`,
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
          viewUrn: "ppb:tbd:view:sport:1",
          viewUrl: routes.getMyBetsViewUrl("open"),
        },
      },
      {
        tileType: "GAMING",
        viewLink: {
          viewUrn: "ppb:tbd:view:sport:1",
          viewUrl: routes.getGamingViewUrl("1"),
        },
      },
    ],
  },
  edges: [],
};

const BFF_BROWSE_MOCK = {
  urn: "ppb:tbd:view:browse:sports",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:group:azmenu-quicklinks/cv/browse",
        quickLinksTitle: null,
        links: [
          {
            label: "Football",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:1",
              viewUrl: "football/sport:1",
            },
            target: null,
            icon: null,
          },
          {
            label: "Horse Racing",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:7",
              viewUrl: "horse-racing/s-7",
            },
            target: null,
            icon: null,
          },
          {
            label: "Greyhound Racing",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:4339",
              viewUrl: "greyhound-racing/sport:4339",
            },
            target: null,
            icon: null,
          },
        ],
      },
    },
  ],
};

const BFF_SPORT_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
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
          viewUrn: "ppb:tbd:view:sport:1",
          viewUrl: routes.getMyBetsViewUrl("open"),
        },
      },
      {
        tileType: "GAMING",
        viewLink: {
          viewUrn: "ppb:tbd:view:sport:1",
          viewUrl: routes.getGamingViewUrl("1"),
        },
      },
    ],
  },
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetitionLink:11086347",
        cardGroupTitle: "UEFA Champions League",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventViewLinkCard",
                urn: "ppb:tbd:card:eventViewLink:29682729",
                sportevent: {
                  name: "Wolves v Man Utd",
                  eventId: 29359895,
                },
                fixture: {
                  urn: "ppb:fixture:29359895",
                  scheduledAt: "2020-02-01T12:30Z",
                  startedAt: "2020-02-01T12:30Z",
                  home: { name: "Wolves" },
                  away: { name: "Man Utd" },
                },
              },
            },
          ],
        },
      },
    },
  ],
};

const SEARCH_MOCK = [
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
        },
      },
      sport: {
        name: "Football",
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
        },
      },
      sport: {
        name: "Football",
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
        },
      },
      sport: {
        name: "Football",
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
        },
      },
      sport: {
        name: "Football",
      },
    },
  },
];

const SEARCH_MOCK1 = [
  {
    __typename: "CompetitionView",
    urn: "ppb:tbd:view:competition:59",
    competition: {
      name: "Italian Serie A",
      urn: "ppb:competition:59",
      sport: {
        name: "Football",
        sportId: 1,
      },
    },
  },
  {
    __typename: "EventView",
    urn: "ppb:tbd:view:event:29738719",
    sportevent: {
      name: "Italy v Bosnia",
      openDate: "2020-09-04T19:45Z",
      competition: {
        name: "UEFA Nations League A",
        sport: {
          sportId: 1,
        },
      },
      sport: {
        name: "Football",
      },
    },
  },
];

const SEARCH_MOCK_HORSE_RACING = {
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
};
const VISITOR_ID_COOKIE = { name: "vid", value: "test-vid" };

const INITIAL_STATE_MOCK_WITH_SEARCH_FILTER = {
  experiments: [{ name: "exp-search-filter", variant: "search-filter" }],
  LPS_FE_EXPOSURE: { isActive: true },
};
const INITIAL_STATE_MOCK_WITH_SEARCH_HISTORY = {
  experiments: [{ name: "exp-search-history", variant: "search-history" }],
  LPS_FE_EXPOSURE: { isActive: true },
};

const mockOpenBrowseBottomTile = async (initialMock = {}) => {
  const initialState = { date: "2009-10-10T18:44Z", ...initialMock };
  await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, initialState));
  await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
  await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_MOCK));

  await browser.url(routes.getEventViewUrl(EVENT_ID));
  await setCookie(VISITOR_ID_COOKIE.name, VISITOR_ID_COOKIE.value);
  await browser.refresh();

  await bottomBarPO.element.isDisplayed();
  expect(await browseBottomTile.isDisplayed()).toBe(true);
};

const openTheSearchBox = async (initialState = {}) => {
  await mockOpenBrowseBottomTile(initialState);
  await browseBottomTile.click();
  await browser.waitUntilDisplayed(browsePO.element);
  await searchBarPO.input.click();
  await browser.waitUntilDisplayed(searchBarPO.cancelButton);
};

describe("Open and Close Search tab", () => {
  beforeAll(async () => {
    await mockOpenBrowseBottomTile();
    await browseBottomTile.click();
  });

  it("[PRPI-6059] When there's a click on the browse bottom bar icon ,the browse tile is shown as active and section items are rendered with Football, Horse Racing, and Greyhound Racing links, and the search components are correctly displayed ", async () => {
    expect(await bottomBarPO.activeTileTitle.getText()).toBe("Browse");
    expect(await footballLink.element.getText()).toBe("Football");
    expect(await horseRacingLink.element.getText()).toBe("Horse Racing");
    expect(await greyhoundRacingLink.element.getText()).toBe("Greyhound Racing");
  });

  it("[PRPI-5169]When there's a click on the browse bottom bar icon , the search components are correctly displayed ", async () => {
    expect(await browsePO.title.getText()).toBe("Browse");
    expect(await searchBarPO.searchIcon.isDisplayed()).toBe(true);
    expect(await searchBarPO.input.isDisplayed()).toBe(true);
    expect(await searchBarPO.input.getAttribute("placeholder")).toBe("Search Teams or Events");
    expect(await searchBarPO.cleanButton.isDisplayed()).toBe(false);
    expect(await searchBarPO.cancelButton.isDisplayed()).toBe(false);
    expect(await tabsPO.tabs[0].getText()).toBe("Sports");
  });
});

describe("Searching with inputs in the search box", () => {
  beforeAll(async () => {
    await openTheSearchBox();
    await mockService.mockHttpRequest(getSearchResults({ query: "real", results: SEARCH_MOCK }));
    await searchBarPO.input.setValue("real");
    await browser.waitUntilDisplayed(searchResultsListPO.resultsList);
  });

  it("[PRPI-6060] the section items are dismissed when user clicks on search box ", async () => {
    expect(await sportQuickLinks.element.isExisting()).toBe(false);
  });

  it("[PRPI-6061] the clean 'x' becomes visible", async () => {
    await browser.waitUntilDisplayed(searchBarPO.cleanButton);

    expect(await searchBarPO.cleanButton.isClickable()).toBe(true);
  });

  it("[PRPI-6062] should show the number of results when user inputs real", async () => {
    expect(await searchResultsListPO.numberOfResultsLabel.getText()).toBe("4 results for ‘real’");
  });

  it("[PRPI-6063] should show 4 results when user inputs real", async () => {
    expect(await searchResultsListPO.results.length).toBe(4);
    expect(await firstSearchResult.name.getHTML(false)).toBe("<b>Real</b> Madrid v Atletico Madrid");
    expect(await secondSearchResult.name.getHTML(false)).toBe("San Fernando CD v <b>Real</b> Murcia");
    expect(await thirdSearchResult.name.getHTML(false)).toBe("Atletico Huila v <b>Real</b> Santander");
    expect(await fourthSearchResult.name.getHTML(false)).toBe("CF Rayo Majadahonda v <b>Real</b> Oviedo II");
  });

  it("[PRPI-6064] the section items shows up again and all other components are visible on clicking cancel button", async () => {
    await searchBarPO.cancelButton.click();
    await browser.waitUntilDisplayed(sportQuickLinks.element);

    expect(await browsePO.title.getText()).toBe("Browse");
    expect(await searchBarPO.searchIcon.isDisplayed()).toBe(true);
    expect(await searchBarPO.input.isDisplayed()).toBe(true);
    expect(await searchBarPO.input.getAttribute("placeholder")).toBe("Search Teams or Events");
    expect(await searchBarPO.cleanButton.isDisplayed()).toBe(false);
    expect(await searchBarPO.cancelButton.isDisplayed()).toBe(false);
    expect(await tabsPO.tabs[0].getText()).toBe("Sports");
    expect(await sportQuickLinks.element.isExisting()).toBe(true);
    expect(await footballLink.element.isDisplayed()).toBe(true);
    expect(await horseRacingLink.element.isDisplayed()).toBe(true);
  });
});

describe("Adding m to the search result for real", () => {
  beforeAll(async () => {
    await openTheSearchBox();
    await mockService.mockHttpRequest(getSearchResults({ query: "real", results: SEARCH_MOCK }));
    await searchBarPO.input.setValue("real");
    await browser.waitUntilDisplayed(searchResultsListPO.resultsList);
    await mockService.mockHttpRequest(getSearchResults({ query: "real m", results: [SEARCH_MOCK[0]] }));
    await searchBarPO.input.setValue(" m");
    await browser.waitUntilNotInDOM(searchResultsListPO.results[1]);
  });

  it("[PRPI-6065] should update the results on adding m to the search string", async () => {
    expect(await firstSearchResult.name.getHTML(false)).toBe("<b>Real M</b>adrid v Atletico Madrid");
  });
  it("[PRPI-6066] should have the correct date and competition for the search results", async () => {
    expect(await firstSearchResult.context.getText()).toBe("Spanish La Liga - Today, 23:00");
  });

  it("[PRPI-6067] should have the correct date and competition when the user clicks outside the input box", async () => {
    await browsePO.title.click();
    await browser.waitUntil(async () => (await searchBarPO.input.isFocused()) === false);

    expect(await firstSearchResult.context.getText()).toBe("Spanish La Liga - Today, 23:00");
  });

  it("[PRPI-6068] the input field is blank and the section items remain dismissed when clicking on the 'X' button", async () => {
    await searchBarPO.cleanButton.click();
    await browser.waitUntilNotDisplayed(searchBarPO.cleanButton);

    expect(await searchBarPO.input.getText()).toBe("");
    expect(await sportQuickLinks.element.isExisting()).toBe(false);
  });
});

describe("User searches by team in the search box", () => {
  beforeAll(async () => {
    await openTheSearchBox();
    await mockService.mockHttpRequest(getSearchResults({ query: "ita", results: SEARCH_MOCK1 }));
    await searchBarPO.input.setValue("ita");
    await browser.waitUntilDisplayed(searchResultsListPO.resultsList);
  });

  it("[PRPI-6069] search should return the label with number of results", async () => {
    expect(await searchResultsListPO.numberOfResultsLabel.getText()).toBe("2 results for ‘ita’");
  });

  it("[PRPI-6070] search should return 2\xA0suggested results", async () => {
    expect(await searchResultsListPO.results.length).toBe(2);
    expect(await firstSearchResult.name.getHTML(false)).toBe("<b>Ita</b>lian Serie A");
    expect(await secondSearchResult.name.getHTML(false)).toBe("<b>Ita</b>ly v Bosnia");
  });

  it("[PRPI-6071] search should return the correct date and competition for results with team 'ita'", async () => {
    expect(await firstSearchResult.context.getText()).toBe("Football");
    expect(await secondSearchResult.context.getText()).toBe("UEFA Nations League A - Sep 4, 20:45");
  });
});

describe("User searches with team 'ita' and competition ' uefa' in the search box", () => {
  beforeAll(async () => {
    await openTheSearchBox();
    await mockService.mockHttpRequest(getSearchResults({ query: "ita", results: SEARCH_MOCK1 }));
    await searchBarPO.input.setValue("ita");
    await browser.waitUntilDisplayed(searchResultsListPO.resultsList);
    await mockService.mockHttpRequest(getSearchResults({ query: "ita uefa", results: [SEARCH_MOCK1[1]] }));
    await searchBarPO.input.setValue(" uefa");
    await browser.waitUntilNotInDOM(searchResultsListPO.results[1]);
  });

  it("[PRPI-6072] search should return the label with number of results for team and competition", async () => {
    expect(await searchResultsListPO.numberOfResultsLabel.getText()).toBe("1 results for ‘ita uefa’");
  });

  it("[PRPI-6073] search should return 1\xA0suggested result for team and competition", async () => {
    expect(await searchResultsListPO.results.length).toBe(1);
    expect(await firstSearchResult.name.getHTML(false)).toBe("Italy v Bosnia");
  });

  it("[PRPI-6074] search should return the correct date and competition", async () => {
    expect(await firstSearchResult.context.getText()).toBe("UEFA Nations League A - Sep 4, 20:45");
  });
});

describe("Search with a typo and it returns did you mean with the closest suggestions", () => {
  beforeAll(async () => {
    await openTheSearchBox();
    await mockService.mockHttpRequest(getSearchResults({ query: "rial", results: SEARCH_MOCK, didYouMean: "Real" }));
    await searchBarPO.input.setValue("rial");
    await browser.waitUntilDisplayed(searchResultsListPO.resultsList);
  });

  it("[PRPI-6075] search should return 4 results", async () => {
    expect(await searchResultsListPO.results.length).toBe(4);
    expect(await firstSearchResult.name.getHTML(false)).toBe("Real Madrid v Atletico Madrid");
    expect(await secondSearchResult.name.getHTML(false)).toBe("San Fernando CD v Real Murcia");
    expect(await thirdSearchResult.name.getHTML(false)).toBe("Atletico Huila v Real Santander");
    expect(await fourthSearchResult.name.getHTML(false)).toBe("CF Rayo Majadahonda v Real Oviedo II");
  });

  it("[PRPI-6076] search should return did you mean label", async () => {
    expect(await searchResultsListPO.didYouMeanLabel.getText()).toBe("Did you mean ‘Real’?");
  });

  it("[PRPI-6077] search should return results label", async () => {
    expect(await searchResultsListPO.noResultsLabel.getText()).toBe(
      "Your search for ‘rial’ didn’t return any results.",
    );
  });

  it("[PRPI-6078] search should return the number of results", async () => {
    expect(await searchResultsListPO.numberOfResultsLabel.getText()).toBe("4 results for ‘Real’");
  });
});

describe("Search with a string for which there aren't results", () => {
  beforeAll(async () => {
    await openTheSearchBox();
    await mockService.mockHttpRequest(getSearchResults({ query: "wzk", results: [] }));
    await searchBarPO.input.setValue("wzk");
    await browser.waitUntilDisplayed(searchResultsListPO.numberOfResultsLabel);
  });

  it("[PRPI-6079] search should return no results label", async () => {
    expect(await searchResultsListPO.numberOfResultsLabel.getText()).toBe("0 results for ‘wzk’");
  });
});

describe("search and navigate", () => {
  describe("when user is on football view and opens search and clicks on the football link", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn, { date: "2009-10-10T18:44Z" }));
      await mockService.mockHttpRequest(getSportsLayout(BFF_SPORT_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(bottomBarPO.element);
      await browseBottomTile.click();
      await browser.waitUntilDisplayed(browsePO.element);
      await browser.waitUntilDisplayed(footballLink.element);
      await footballLink.element.click();
      await browser.waitUntilNotDisplayed(browsePO.element);
    });

    it("[PRPI-6080] the search should close", async () => {
      expect(await browsePO.element.isDisplayed()).toBe(false);
    });
  });
});

describe("search and delete search term", () => {
  beforeEach(async () => {
    await openTheSearchBox();
    await mockService.mockHttpRequest(getSearchResults({ query: "rea", results: SEARCH_MOCK }));
    await searchBarPO.input.setValue("rea");
    await browser.waitUntilDisplayed(searchResultsListPO.resultsList);
  });

  it("[PRPI-6081] should show 4 results", async () => {
    expect(await searchResultsListPO.results.length).toBe(4);
    expect(await firstSearchResult.name.getHTML(false)).toBe("<b>Rea</b>l Madrid v Atletico Madrid");
    expect(await secondSearchResult.name.getHTML(false)).toBe("San Fernando CD v <b>Rea</b>l Murcia");
    expect(await thirdSearchResult.name.getHTML(false)).toBe("Atletico Huila v <b>Rea</b>l Santander");
    expect(await fourthSearchResult.name.getHTML(false)).toBe("CF Rayo Majadahonda v <b>Rea</b>l Oviedo II");
  });

  it("[PRPI-6082] results are\xA0dismissed on deleting the 3rd character", async () => {
    await browser.keys("Backspace");
    await browser.waitUntilNotDisplayed(searchResultsListPO.element);

    expect(await searchResultsListPO.element.isDisplayed()).toBe(false);
  });

  it("[PRPI-6083] When user loses focus after deleting all the characters of the string in the search box , Section items and 'Search Teams or Events' Placeholder are displayed", async () => {
    await browser.keys(["Backspace", "Backspace", "Backspace"]);
    await browser.waitUntilEquals(searchBarPO.input, "");
    await browsePO.title.click();
    await browser.waitUntil(async () => (await searchBarPO.input.isFocused()) === false);

    expect(await searchBarPO.input.getAttribute("placeholder")).toBe("Search Teams or Events");
    expect(await sportQuickLinks.element.isDisplayed()).toBe(true);
  });
});

describe("search and navigate - when user is on football view and opens search and clicks on the football link", () => {
  beforeAll(async () => {
    await mockOpenBrowseBottomTile();
  });

  it("[PRPI-6084] the search should close on clicking on the football link", async () => {
    await browseBottomTile.click();
    await browser.waitUntilDisplayed(footballLink.element);
    await footballLink.element.click();
    await browser.waitUntilNotDisplayed(browsePO.element);

    expect(await browsePO.element.isDisplayed()).toBe(false);
  });
});

describe("search with sports filters", () => {
  beforeAll(async () => {
    await openTheSearchBox(INITIAL_STATE_MOCK_WITH_SEARCH_FILTER);
    await mockService.mockHttpRequest(
      getSearchResults({ query: "real", results: [...SEARCH_MOCK, SEARCH_MOCK_HORSE_RACING] }),
    );
    await searchBarPO.input.setValue("real");
    await browser.waitUntilDisplayed(sportsFilterPebbleListPO.element);
    await browser.waitUntilDisplayed(searchResultsListPO.resultsList);
  });

  it("[PRPI-4993] should show the sports filters", async () => {
    expect(await searchResultsListPO.results.length).toBe(5);
    expect(await sportsFilterPebbleListPO.element.isDisplayed()).toBe(true);
    expect(await sportsFilterPebbleListPO.pebbles.length).toBe(3);
    expect(await browser.containsClass(sportsFilterPebbleListPO.pebbles[0], PebbleListPO.states.active)).toBe(true);
    expect(await sportsFilterPebbleListPO.pebbles[0].getText()).toBe("All");
    expect(await sportsFilterPebbleListPO.pebbles[1].getText()).toBe("Football");
    expect(await sportsFilterPebbleListPO.pebbles[2].getText()).toBe("Horse Racing");
  });

  it("[PRPI-8727] should filter the search results on clicking on a sport filter and show the correct number of results for each filter", async () => {
    await sportsFilterPebbleListPO.pebbles[1].click();

    expect(await searchResultsListPO.numberOfResultsLabel.getText()).toBe("4 results for ‘real’");
    expect(await browser.containsClass(sportsFilterPebbleListPO.pebbles[0], PebbleListPO.states.active)).toBe(false);
    expect(await browser.containsClass(sportsFilterPebbleListPO.pebbles[1], PebbleListPO.states.active)).toBe(true);
    expect(await searchResultsListPO.results.length).toBe(4);
  });
});

describe("search history", () => {
  beforeEach(async () => {
    await mockService.mockHttpRequest(getSearchResults({ query: "real", results: SEARCH_MOCK }));
    await openTheSearchBox(INITIAL_STATE_MOCK_WITH_SEARCH_HISTORY);
    await browser.waitUntil(async () => (await searchBarPO.input.isFocused()) === true);
  });

  it("[PRPI-8728]should not display search history when no items on local storage", async () => {
    expect(await searchBarHistoryPO.element.isDisplayed()).toBe(false);
  });

  it("[PRPI-8729]should store a new history item for each search result click and display them in the search history", async () => {
    await searchBarPO.input.setValue("real");
    expect(await searchBarHistoryPO.element.isDisplayed()).toBe(false);
    await browser.waitUntilDisplayed(searchResultsListPO.resultsList);
    await firstSearchResult.element.click();
    await browser.waitUntilNotDisplayed(browsePO.element);

    await openTheSearchBox(INITIAL_STATE_MOCK_WITH_SEARCH_HISTORY);
    await mockService.mockHttpRequest(getSearchResults({ query: "san fernando", results: [SEARCH_MOCK[1]] }));

    await searchBarPO.input.setValue("san fernando");
    expect(await searchBarHistoryPO.element.isDisplayed()).toBe(false);
    await browser.waitUntilDisplayed(searchResultsListPO.resultsList);
    await firstSearchResult.element.click();
    await browser.waitUntilNotDisplayed(browsePO.element);

    await openTheSearchBox(INITIAL_STATE_MOCK_WITH_SEARCH_HISTORY);

    await browser.waitUntilDisplayed(searchBarHistoryPO.element);
    expect(await searchBarHistoryPO.historyItems.length).toBe(2);
    expect(await searchBarHistoryPO.historyItems[0].getText()).toBe("san fernando");
    expect(await searchBarHistoryPO.historyItems[1].getText()).toBe("real");
  });
  it("[PRPI-8730]should move item to the top of the list when user clicks on an existing search history item", async () => {
    await browser.waitUntilDisplayed(searchBarHistoryPO.element);
    expect(await searchBarHistoryPO.historyItems.length).toBe(2);
    await searchBarHistoryPO.historyItems[1].click();
    await browser.waitUntilDisplayed(searchBarPO.cleanButton);
    await searchBarPO.cleanButton.click();
    expect(await searchBarHistoryPO.historyItems[0].getText()).toBe("real");
    expect(await searchBarHistoryPO.historyItems[1].getText()).toBe("san fernando");
  });
});
