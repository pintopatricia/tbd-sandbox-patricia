const { getGenericLayout, getFilteredCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const FutureRacingCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FutureRacingCardGroup/FutureRacingCardGroup.web.po");
const {
  CardPO,
  FilterByPO,
  OptionListPO,
  AlertPO,
  FilterCriteriaPO,
  PebblePO,
  ActionLinkPO,
} = require("../../../../../page-objects");
const FilteredCouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();
const alertPO = new AlertPO();
const futureRacingCardGroupPO = new FutureRacingCardGroupPO();
const firstAccordionPO = new FutureRacingCardGroupPO(futureRacingCardGroupPO.quickLinksContainers[0]);
const firstAccordionCardPO = new CardPO(futureRacingCardGroupPO.quickLinksContainers[0]);
const secondAccordionCardPO = new CardPO(futureRacingCardGroupPO.quickLinksContainers[1]);
const filterByPO = new FilterByPO();
const filterCriteriaPO = new FilterCriteriaPO();
const optionListPO = new OptionListPO(filterCriteriaPO.element);
const filteredCouponCardGroupPO = new FilteredCouponCardGroupPO();
const actionLinkPO = new ActionLinkPO(filteredCouponCardGroupPO.resetActionLink);
const EVENT_TYPE_ID = "7";

const FUTURE_RACING_CARD_MOCK = {
  __typename: "FutureRacingCardGroup",
  urn: "ppb:tbd:cardgroup:futureRacing:YIFBxxMAACEAQXKm/s/7",
  filterOptions: {
    countriesFilter: {
      urn: "ppb:tbd:cardfilter:countries:YIFBxxMAACEAQXKm/s/7",
      defaultOptions: [
        { urn: "ppb:tbd:cardfilter:countriesoption:YNNVLhAAACIA7mKi", name: "Chile" },
        { urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW", name: "USA" },
      ],

      availableOptions: [
        { urn: "ppb:tbd:cardfilter:countriesoption:YC1ObRUAACYA2q-j", name: "Argentina" },
        { urn: "ppb:tbd:cardfilter:countriesoption:YC5pxRUAACYA352_", name: "Australia" },
        { urn: "ppb:tbd:cardfilter:countriesoption:YNNVLhAAACIA7mKi", name: "Chile" },
        { urn: "ppb:tbd:cardfilter:countriesoption:YC0o0hEAACoA4QLW", name: "USA" },
      ],
    },
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
  urn: "ppb:tbd:view:generic:allmatchesraces/7",
  url: "view/generic:allmatchesraces/7",
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

const MONTHS_FILTERED_CARD_MOCK = {
  cards: [
    {
      __typename: "FutureRacingCardGroup",
      urn: "ppb:tbd:cardgroup:futureRacing:YIFBxxMAACEAQXKm/s/7",
      full: {
        edges: [
          {
            date: "2021-06-19T00:00:00.000Z",
            node: {
              __typename: "QuickLinksCard",
              urn: "ppb:tbd:card:quickLinks:futureRacing:27088631|1.184403054",
              quickLinksTitle: null,
              accordionTitle: "Specials",
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
            date: "2021-06-19T00:00:00.000Z",
            node: {
              __typename: "QuickLinksCard",
              urn: "ppb:tbd:card:quickLinks:futureRacing:27088631|1.184403054",
            },
          },
        ],
      },
    },
  ],
};

const BFF_MOCK_NO_RESULTS = {
  ...BFF_MOCK,
  edges: [
    {
      node: { ...FUTURE_RACING_CARD_MOCK, full: { edges: [] }, partials: { partialEdges: [] } },
    },
  ],
};

describe("When the user is on a Generic View with all races", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK));
    await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
    await browser.waitUntilDisplayed(futureRacingCardGroupPO.quickLinksContainers[0]);
  });

  it("[PRPI-7268] \u200BThe view should be displayed with the countries filter highlighted", async () => {
    expect(await filterByPO.filters[0].getText()).toBe("Countries");
    expect(await browser.containsClass(filterByPO.filters[0], PebblePO.states.active)).toBe(true);
  });

  it("[PRPI-7269] \u200BThe view should be displayed with Quicklinks", async () => {
    expect(await futureRacingCardGroupPO.quickLinksContainers.length).toBe(2);
    expect(await futureRacingCardGroupPO.titles.length).toBe(2);
    expect(await futureRacingCardGroupPO.titles[0].getText()).toBe("June 18");
    expect(await futureRacingCardGroupPO.collapseTitles[0].getText()).toBe("Ascot 18th Jun");
  });

  it("[PRPI-7270] the notification info should not be displayed", async () => {
    expect(await alertPO.element.isExisting()).toBe(false);
  });

  it("[PRPI-7271] The first accordion should have the chevron expanded", async () => {
    expect(await firstAccordionCardPO.content.isDisplayed()).toBe(true);
  });

  it("[PRPI-7272] The second accordion should have the chevron collapsed", async () => {
    expect(await secondAccordionCardPO.content.isDisplayed()).toBe(false);
  });

  describe("When the user clicks on the first accordion", () => {
    beforeAll(async () => {
      await firstAccordionCardPO.headerWrapper.waitForClickable();
      await firstAccordionCardPO.headerWrapper.click();
    });

    it("[PRPI-7273] the chevron should be collapsed", async () => {
      expect(await firstAccordionCardPO.content.isDisplayed()).toBe(false);
    });

    it("[PRPI-7274] the quicklinks should not be displayed", async () => {
      expect(await firstAccordionPO.quicklinks.length).toBe(0);
    });

    describe("When the user clicks again on the first accordion", () => {
      beforeAll(async () => {
        await firstAccordionCardPO.headerWrapper.waitForClickable();
        await firstAccordionCardPO.headerWrapper.click();
        await browser.waitUntilDisplayed(firstAccordionCardPO.content);
      });

      it("[PRPI-7275] the chevron should be expanded", async () => {
        expect(await firstAccordionCardPO.content.isDisplayed()).toBe(true);
      });

      it("[PRPI-7276] the container should display 2 quicklinks", async () => {
        expect(await firstAccordionPO.quicklinks.length).toBe(2);
      });
    });
  });

  describe("when the user clicks on Month filter", () => {
    beforeAll(async () => {
      await filterByPO.filters[1].click();
      await browser.waitUntilDisplayed(filterCriteriaPO.element);
    });

    it("[PRPI-7277] \u200Bthe pop-up should be displayed", async () => {
      expect(await filterCriteriaPO.element.isDisplayed()).toEqual(true);
    });

    it("[PRPI-7278] \u200B\u200Bthe title 'Month' should be displayed", async () => {
      expect(await filterCriteriaPO.headerTitle.getText()).toEqual("Months");
    });
  });

  describe("when the user selects some months and click on apply", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getFilteredCardResults(MONTHS_FILTERED_CARD_MOCK));
      await optionListPO.itemInput[1].click();
      await optionListPO.itemInput[2].click();
      await filterCriteriaPO.applyButton.click();
      await browser.waitUntilNotDisplayed(filterCriteriaPO.element);
      await browser.waitUntilEquals(futureRacingCardGroupPO.titles[0], "June 19");
    });

    it("[PRPI-7279] \u200B\u200Bthe pop-up should be closed", async () => {
      expect(await filterCriteriaPO.element.isDisplayed()).toBe(false);
    });

    it("[PRPI-7280] \u200B\u200Bthe events list should be updated", async () => {
      expect(await futureRacingCardGroupPO.quickLinksContainers.length).toBe(1);
      expect(await futureRacingCardGroupPO.collapseTitles[0].getText()).toEqual("Specials");
    });
  });

  describe("when there are no results to be show", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK_NO_RESULTS.urn));
      await mockService.mockHttpRequest(getGenericLayout(BFF_MOCK_NO_RESULTS));
      await browser.url(routes.getGenericViewUrl(`allmatchesraces/${EVENT_TYPE_ID}`));
      await browser.waitUntilDisplayed(filteredCouponCardGroupPO.element);
    });

    it("[PRPI-7281] should render filters", async () => {
      expect(await filterByPO.filters[0].getText()).toBe("Countries");
      expect(await filterByPO.filters[1].getText()).toBe("Months");
    });

    it("[PRPI-7282] should render no results page label", async () => {
      expect(await filteredCouponCardGroupPO.noResultsLabel.getText()).toEqual("No results");
    });

    it("[PRPI-7283] should render suggestion message", async () => {
      expect(await filteredCouponCardGroupPO.noResultsSuggestion.getText()).toEqual("Try removing one or two filters");
    });

    it("[PRPI-7284] should render action link to reset", async () => {
      expect(await actionLinkPO.element.getText()).toEqual("Reset All Filters");
    });
  });
});
