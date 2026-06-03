const QuickLinksCardSO = require("@ppb/tbd-shared/components/QuickLinksCard/QuickLinksCard.native.so");
const {
  getGenericLayout,
  getFilteredCardResults,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const FilteredCouponCardGroupSO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.so");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const {
  GenericScreenSO,
  FilterBySO,
  CardSO,
  OptionListSO,
  PrimaryButtonSO,
  ActionLinkSO,
  QuickLinkSO,
  FilterCriteriaSO,
  PebbleSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const filteredCouponCardGroupSO = new FilteredCouponCardGroupSO();
const filterBySO = new FilterBySO();
const firstFilterPebble = new PebbleSO(filterBySO.filters[0]);
const secondFilterPebble = new PebbleSO(filterBySO.filters[1]);
const resetButton = new ActionLinkSO(filterBySO.resetButton);
const resetAllFiltersButton = new ActionLinkSO(filteredCouponCardGroupSO.actionLink);
const firstQuickLinksCard = new QuickLinksCardSO(filteredCouponCardGroupSO.quicklinks[0]);
const secondQuickLinksCard = new QuickLinksCardSO(filteredCouponCardGroupSO.quicklinks[1]);
const firstQuickLink = new QuickLinkSO(firstQuickLinksCard.links[0]);
const secondQuickLink = new QuickLinkSO(firstQuickLinksCard.links[1]);
const thirdQuickLink = new QuickLinkSO(secondQuickLinksCard.links[0]);
const firstCardSO = new CardSO(filteredCouponCardGroupSO.quicklinks[0]);
const secondCardSO = new CardSO(filteredCouponCardGroupSO.quicklinks[1]);
const filterCriteriaSO = new FilterCriteriaSO();
const optionListSO = new OptionListSO();
const primaryButtonSO = new PrimaryButtonSO();

const FUTURE_RACING_CARD_MOCK = {
  __typename: "FutureRacingCardGroup",
  urn: "ppb:tbd:cardgroup:futureRacing:YIFBxxMAACEAQXKm/s/7",
  filterOptions: {
    monthFilter: {
      urn: "ppb:tbd:cardfilter:month:7",
      defaultOptions: null,
      availableOptions: [
        {
          urn: "ppb:tbd:cardfilter:monthoption:1622505600000",
          date: "2021-06-01T00:00:00.000Z",
        },
        {
          urn: "ppb:tbd:cardfilter:monthoption:1625097600000",
          date: "2021-07-01T00:00:00.000Z",
        },
        {
          urn: "ppb:tbd:cardfilter:monthoption:1630454400000",
          date: "2021-09-01T00:00:00.000Z",
        },
      ],
    },
    countriesFilter: {
      urn: "ppb:tbd:cardfilter:countries:YIFBxxMAACEAQXKm/s/7",
      defaultOptions: null,
      availableOptions: [
        {
          urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW",
          name: "USA",
        },
      ],
    },
  },
  full: {
    edges: [
      {
        date: "2021-06-18T00:00:00.000Z",
        node: {
          __typename: "QuickLinksCard",
          urn: "ppb:tbd:card:quickLinks:futureRacing:30466961|1.183875338;1.183875367;1.182705281;1.183874270",
          quickLinksTitle: null,
          accordionTitle: "Ascot 18th Jun",
          accordionExpanded: true,
          links: [
            {
              label: "Albany Stakes",
              viewLink: {
                viewUrn: "ppb:tbd:view:market:1.183875338",
                viewUrl: "horse-racing/ascot-18th-jun/albany-stakes/rc-1.183875338",
              },
            },
            {
              label: "Commonwealth Cup",
              viewLink: {
                viewUrn: "ppb:tbd:view:market:1.182705281",
                viewUrl: "horse-racing/ascot-18th-jun/commonwealth-cup/rc-1.182705281",
              },
            },
          ],

          iconName: "GB",
        },
      },
      {
        date: "2021-06-19T00:00:00.000Z",
        node: {
          __typename: "QuickLinksCard",
          urn: "ppb:tbd:card:quickLinks:futureRacing:27088631|1.184403054",
          quickLinksTitle: null,
          accordionTitle: "Specials",
          accordionExpanded: false,
          links: [
            {
              label: "Royal Ascot Top Jockey",
              viewLink: {
                viewUrn: "ppb:tbd:view:market:1.184403054",
                viewUrl: "horse-racing/specials/royal-ascot-top-jockey/rc-1.184403054",
              },
            },
          ],

          iconName: "GB",
        },
      },
    ],
  },
  partials: {
    partialEdges: [
      {
        date: "2021-06-18T00:00:00.000Z",
        node: {
          __typename: "QuickLinksCard",
          urn: "ppb:tbd:card:quickLinks:futureRacing:30466961|1.183875338;1.183875367;1.182705281;1.183874270",
        },
      },
      {
        date: "2021-06-19T00:00:00.000Z",
        node: {
          __typename: "QuickLinksCard",
          urn: "ppb:tbd:card:quickLinks:futureRacing:27088631|1.184403054",
        },
      },
    ],
  },
};

const BFF_MOCK = {
  __typename: "GenericView",
  urn: "ppb:tbd:view:generic:allmatchesraces:7",
  url: "view/amc-7",
  edges: [
    {
      node: FUTURE_RACING_CARD_MOCK,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: FUTURE_RACING_CARD_MOCK.__typename,
        urn: FUTURE_RACING_CARD_MOCK.urn,
      },
    },
  ],
};

const BFF_NO_ITEMS_MOCK = {
  cards: [
    {
      __typename: "FutureRacingCardGroup",
      urn: "ppb:tbd:cardgroup:futureRacing:YIFBxxMAACEAQXKm/s/7",
      full: {
        edges: [],
      },
      partials: {
        partialEdges: [],
      },
    },
  ],
};

const RESET_FILTERED_CARD_MOCK = {
  cards: [FUTURE_RACING_CARD_MOCK],
};

describe("FutureRacingCardGroup", () => {
  describe("When the user is on a Generic View with future racing cards", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
      const url = "view/amc-7";
      const HOME_VIEW_LINK = getStartViewLink(url);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
      await browser.waitUntilDisplayed(genericScreenSO.element);
    });

    it("[PRPI-2940] the two future racing cards should be displayed", async () => {
      expect(await filteredCouponCardGroupSO.quicklinks.length).toBe(2);
    });

    it("[PRPI-2941] the filters countries, month and the reset button should be displayed", async () => {
      expect(await firstFilterPebble.title.getText()).toBe("Months");
      expect(await secondFilterPebble.title.getText()).toBe("Countries");
      expect(await resetButton.text.getText()).toBe("Reset");
    });

    it("[PRPI-2942] the two future racing cards should have the correct title", async () => {
      expect(await filteredCouponCardGroupSO.futureRacingTitle[0].getText()).toBe("June 18");
      expect(await filteredCouponCardGroupSO.futureRacingTitle[1].getText()).toBe("June 19");
    });

    it("[PRPI-2943] the first card's collapse should be expanded and the second card's collapse collapsed", async () => {
      expect(await firstCardSO.content.isDisplayed()).toBe(true);
      expect(await secondCardSO.content.isDisplayed()).toBe(false);
    });

    it("[PRPI-2944] the first card should display two quicklinks", async () => {
      expect(await firstQuickLinksCard.links.length).toBe(2);
    });

    it("[PRPI-2945] the second card should not display any quicklink", async () => {
      expect(await secondQuickLinksCard.links.length).toBe(0);
    });

    it("[PRPI-2946] the first card's collapse and quicklinks should have the correct labels", async () => {
      expect(await firstQuickLinksCard.collapseTitle.getText()).toBe("Ascot 18th Jun");
      expect(await firstQuickLink.label.getText()).toBe("Albany Stakes");
      expect(await secondQuickLink.label.getText()).toBe("Commonwealth Cup");
    });

    it("[PRPI-2947] the second card's collapse title should be 'Specials'", async () => {
      expect(await secondQuickLinksCard.collapseTitle.getText()).toBe("Specials");
    });
  });

  describe("When the user clicks on the second card's collapse", () => {
    beforeAll(async () => {
      await secondCardSO.header.click();
      await browser.waitUntilDisplayed(secondCardSO.content);
    });

    it("[PRPI-2948] the second card's collapse should be expanded", async () => {
      expect(await secondCardSO.content.isDisplayed()).toBe(true);
    });

    it("[PRPI-2949] the second card should display one quicklink", async () => {
      expect(await secondQuickLinksCard.links.length).toBe(1);
    });

    it("[PRPI-2950] the second card's quicklink should have the correct label", async () => {
      expect(await thirdQuickLink.label.getText()).toBe("Royal Ascot Top Jockey");
    });
  });

  describe("When the user clicks Month filter", () => {
    beforeAll(async () => {
      await filterBySO.filters[0].click();
      await browser.waitUntilDisplayed(filterCriteriaSO.element);
    });

    it("[PRPI-2951] The pop-up should be displayed", async () => {
      expect(await filterCriteriaSO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-2952] The title 'Month' should be displayed.", async () => {
      expect(await filterCriteriaSO.headerTitle.getText()).toEqual("Months");
    });

    it("[PRPI-2953] Should have months options", async () => {
      expect(await optionListSO.optionsText.length).toEqual(3);
      expect(await optionListSO.optionsText[0].getText()).toEqual("June");
      expect(await optionListSO.optionsText[1].getText()).toEqual("July");
      expect(await optionListSO.optionsText[2].getText()).toEqual("September");
    });

    describe("When user selects a month option", () => {
      beforeAll(async () => {
        await optionListSO.options[1].click();
        await mockService.mockHttpRequest(getFilteredCardResults(BFF_NO_ITEMS_MOCK));
        await primaryButtonSO.element.click();

        await browser.waitUntilNotDisplayed(filterCriteriaSO.element);
        await browser.waitUntilDisplayed(filteredCouponCardGroupSO.noResults);
      });

      it("[PRPI-2954] the pop-up should be closed", async () => {
        expect(await filterCriteriaSO.element.isDisplayed()).toEqual(false);
      });

      it("[PRPI-2955] the action link label should be displayed", async () => {
        expect(await resetAllFiltersButton.text.getText()).toBe("Reset All Filters");
      });

      it("[PRPI-2956] the no results message should be displayed", async () => {
        expect(await filteredCouponCardGroupSO.noResultsText.getText()).toBe("No results");
      });
    });

    describe("When the user clicks on reset all filters option", () => {
      beforeEach(async () => {
        await mockService.mockHttpRequest(getFilteredCardResults(RESET_FILTERED_CARD_MOCK));
        await filteredCouponCardGroupSO.actionLink.click();
        await browser.waitUntil(async () => {
          const numQuickLinks = await filteredCouponCardGroupSO.quicklinks.length;
          return numQuickLinks === 2;
        });
      });

      it("[PRPI-2957] the two future racing cards should be displayed", async () => {
        expect(await filteredCouponCardGroupSO.quicklinks.length).toBe(2);
      });
    });
  });
});
