const {
  getBrowseLayout,
  getSearchResults,
  getEventLayout,
  getAppContext,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { BottomBarSO, BrowseScreenSO, SearchBarSO, SearchResultsListSO, TeamSO } = require("../../../../screen-objects");
const MockService = require("../../../../mock-essentials/mocking-service");
const { hideKeyboard } = require("../../../../helpers/gestures");
const { startApp } = require("../../../../helpers/urls");

const mockService = new MockService();

const browseScreenSO = new BrowseScreenSO();
const searchBarSO = new SearchBarSO();
const searchResultsListSO = new SearchResultsListSO();
const teamSO = new TeamSO();

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
              viewUrl: "football/s-1",
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
        ],
      },
    },
  ],
};

const SEARCH_MOCK = [
  {
    __typename: "EventView",
    urn: "ppb:tbd:view:event:30186279",
    sportevent: {
      name: "Porto v Juventus",
      openDate: "2009-10-10T22:00Z",
      competition: {
        name: "UEFA Champions League",
      },
    },
  },
  {
    __typename: "EventView",
    urn: "ppb:tbd:view:event:30244331",
    sportevent: {
      name: "Farense v Porto",
      openDate: "2020-02-18T16:00Z",
      competition: {
        name: "Portuguese Primeira Liga",
      },
    },
  },
];

const BFF_EVENT_VIEW_MOCK = {
  __typename: "EventView",
  urn: "ppb:tbd:view:event:30186279",
  sportevent: {
    eventId: 30186279,
    name: "Porto v Juventus",
  },
  edges: [
    {
      node: {
        __typename: "FixtureCard",
        away: "Porto",
        home: "Juventus",
        sportevent: {
          eventName: "Porto v Juventus",
          urn: "ppb:event:30186279",
          __typename: "SportsEvent",
        },
        urn: "ppb:tbd:card:fixture##30186279",
        fixture: {
          urn: "ppb:fixture:30186279",
          home: {
            name: "Porto",
            color: "f9f9fa",
          },
          away: {
            name: "Juventus",
            color: "050b5c",
          },
          scheduledAt: "2021-02-17T20:00Z",
          duration: {},
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "FixtureCard",
        urn: "ppb:tbd:card:fixture##30186279",
      },
    },
  ],

  bottomBar: {
    tiles: [
      {
        tileType: "HOME",
        viewLink: {
          viewUrn: "ppb:tbd:view:generic:home",
          viewUrl: "",
        },
      },
      {
        tileType: "BROWSE",
        viewLink: {
          viewUrn: "ppb:tbd:view:browse:sports",
          viewUrl: "browse/b-sports",
        },
      },
      {
        tileType: "MY_BETS",
        viewLink: {
          viewUrn: "ppb:tbd:view:myBets:open",
          viewUrl: "mybets/myBets-open",
        },
      },
      {
        tileType: "GAMING",
        viewLink: {
          viewUrn: "ppb:tbd:view:gaming:1",
          viewUrl: "casino/gm-1",
        },
      },
    ],
  },
};

describe("Browse Screen", () => {
  describe("When the user is at the Browse screen and 2 quickLinksCard are retrieved", () => {
    describe("And throttle browseCasinoThrottles is OFF", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(
          getAppContext({
            throttles: {
              BROWSE_CASINO_ANDROID: {
                isActive: false,
              },
              BROWSE_CASINO_IOS: {
                isActive: false,
              },
            },
          }),
        );
        await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_MOCK));
        await startApp("home");
        await browser.waitUntilDisplayed(BottomBarSO.browse);
        await BottomBarSO.browse.click();
        await browser.waitUntilDisplayed(browseScreenSO.title);
        await browser.waitUntilArrayLength(browseScreenSO.tabTitlesList, (length) => length === 1);
      });

      it("[PRPI-3891] The screen title should be shown: 'Browse'", async () => {
        expect(await browseScreenSO.title.getText()).toBe("Browse");
      });

      it("[PRPI-3892] The 'Sports' tab should be visible", async () => {
        expect(await browseScreenSO.tabTitlesList[0].getText()).toBe("Sports");
      });

      it("[PRPI-3893] The 'Casino' tab should be hidden", async () => {
        expect(await browseScreenSO.tabTitlesList.length).toBe(1);
      });

      it("[PRPI-3894] The search box should be visible with a search icon", async () => {
        expect(await searchBarSO.element.isDisplayed()).toBe(true);
        expect(await searchBarSO.searchIcon.isDisplayed()).toBe(true);
      });

      it("[PRPI-3895] The 'Search Teams or Events' default text should be visible", async () => {
        expect(await searchBarSO.searchInput.getText()).toBe("Search Teams or Events");
      });

      it("[PRPI-3896] The AZ-Menu should be visible with 2 links: 'Football' and 'Horse Racing'", async () => {
        expect(await browseScreenSO.quickLinksLabel[0].getText()).toBe("Football");
        expect(await browseScreenSO.quickLinksLabel[1].getText()).toBe("Horse Racing");
      });

      describe("When the user searches for 'Porto'", () => {
        beforeAll(async () => {
          await mockService.mockHttpRequest(getSearchResults({ query: "Porto", results: SEARCH_MOCK }));
          await searchBarSO.searchInput.setValue("Porto");
          await browser.waitUntilDisplayed(searchResultsListSO.resultsList);
        });

        it("[PRPI-3897] The search box should be visible with a search icon", async () => {
          expect(await searchBarSO.element.isDisplayed()).toBe(true);
          expect(await searchBarSO.searchIcon.isDisplayed()).toBe(true);
        });

        it("[PRPI-3898] The word 'Porto' should be visible on the search box", async () => {
          expect(await searchBarSO.searchInput.getText()).toBe("Porto");
        });

        it("[PRPI-3899] The 'Cancel' button should be shown", async () => {
          expect(await searchBarSO.searchCancel.isDisplayed()).toBe(true);
        });

        it("[PRPI-3900] The 'X' icon should be shown", async () => {
          expect(await searchBarSO.searchClean.isDisplayed()).toBe(true);
        });

        it("[PRPI-3901] The '2 RESULTS FOR 'PORTO'' label should be shown", async () => {
          expect(await searchResultsListSO.numberOfResults.getText()).toBe("2 RESULTS FOR ‘PORTO’");
        });

        it("[PRPI-3902] The search results should be visible", async () => {
          expect(await searchResultsListSO.resultItems.length).toBe(2);
        });

        describe("And then taps the 'X' button", () => {
          beforeAll(async () => {
            await searchBarSO.searchClean.click();
            await browser.waitUntilNotDisplayed(searchBarSO.searchClean);
          });

          it("[PRPI-3903] The search box should be visible with a search icon", async () => {
            expect(await searchBarSO.element.isDisplayed()).toBe(true);
            expect(await searchBarSO.searchIcon.isDisplayed()).toBe(true);
          });

          it("[PRPI-3904] The word 'Porto' should not be visible on the search box", async () => {
            expect(await searchBarSO.searchInput.getText()).not.toBe("Porto");
          });

          it("[PRPI-3905] The 'Search Teams or Events' placeholder should be visible", async () => {
            expect(await searchBarSO.searchInput.getText()).toBe("Search Teams or Events");
          });

          it("[PRPI-3906] The 'Cancel' button should be shown", async () => {
            expect(await searchBarSO.searchCancel.isDisplayed()).toBe(true);
          });

          it("[PRPI-3907] The 'X' icon should not be shown", async () => {
            expect(await searchBarSO.searchClean.isDisplayed()).toBe(false);
          });

          it("[PRPI-3908] The AZ-Menu should not be visible", async () => {
            expect(await browseScreenSO.quickLinksContainer.isDisplayed()).toBe(false);
          });

          describe("And the user taps the 'Cancel' button", () => {
            beforeAll(async () => {
              await searchBarSO.searchCancel.click();
              await browser.waitUntilNotDisplayed(searchBarSO.searchCancel);
            });

            it("[PRPI-3909] The search box should be visible with a search icon", async () => {
              expect(await searchBarSO.element.isDisplayed()).toBe(true);
              expect(await searchBarSO.searchIcon.isDisplayed()).toBe(true);
            });

            it("[PRPI-3909] The word 'Porto' should not be visible on the search box", async () => {
              expect(await searchBarSO.searchInput.getText()).not.toBe("Porto");
            });

            it("[PRPI-3909] The 'Search Teams or Events' placeholder be visible", async () => {
              expect(await searchBarSO.searchInput.getText()).toBe("Search Teams or Events");
            });

            it("[PRPI-3909] The 'Cancel' button should not be shown", async () => {
              expect(await searchBarSO.searchCancel.isDisplayed()).toBe(false);
            });

            it("[PRPI-3909] The 'X' icon should not be shown", async () => {
              expect(await searchBarSO.searchClean.isDisplayed()).toBe(false);
            });

            it("[PRPI-3909] The AZ-Menu should be visible", async () => {
              expect(await browseScreenSO.quickLinksContainer.isDisplayed()).toBe(true);
            });
          });
        });

        describe("When the user searches again 'Porto' and taps the first search result (Porto v Juventus - Event View", () => {
          beforeAll(async () => {
            await mockService.mockHttpRequest(getSearchResults({ query: "Porto", results: SEARCH_MOCK }));
            await searchBarSO.searchInput.setValue("Porto");
            await browser.waitUntilDisplayed(searchResultsListSO.resultsList);
            await mockService.mockHttpRequest(getEventLayout(BFF_EVENT_VIEW_MOCK));
            await searchResultsListSO.resultItems[0].click();
          });

          it("[PRPI-3910] The Porto v Juventus event screen should be visible", async () => {
            expect(await teamSO.name.getText()).toBe("Porto");
          });

          describe("And then taps Browse tab bar", () => {
            beforeAll(async () => {
              await BottomBarSO.browse.click();
              await hideKeyboard();
              await browser.waitUntilNotDisplayed(searchBarSO.searchCancel);
            });

            it("[PRPI-3910] The screen title should be shown: 'Browse'", async () => {
              expect(await browseScreenSO.title.getText()).toBe("Browse");
            });

            it("[PRPI-3910] The search box should be visible with a search icon", async () => {
              expect(await searchBarSO.element.isDisplayed()).toBe(true);
              expect(await searchBarSO.searchIcon.isDisplayed()).toBe(true);
            });

            it("[PRPI-3910] The 'Search Teams or Events' placeholder should be visible", async () => {
              expect(await searchBarSO.searchInput.getText()).toBe("Search Teams or Events");
            });

            it("[PRPI-3910] The AZ-Menu should be visible with 2 links: 'Football' and 'Horse Racing'", async () => {
              expect(await browseScreenSO.quickLinksLabel[0].getText()).toBe("Football");
              expect(await browseScreenSO.quickLinksLabel[1].getText()).toBe("Horse Racing");
            });
          });
        });
      });
    });
  });
});
