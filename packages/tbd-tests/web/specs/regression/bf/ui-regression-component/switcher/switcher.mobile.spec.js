const { getCardResults, getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { FilterDrawerPO, RadioListPO, GenericSwitcherCardPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const switcherCardPO = new GenericSwitcherCardPO();
const filterDrawerPO = new FilterDrawerPO();
const radioListPO = new RadioListPO(filterDrawerPO.element);

const EVENT_TYPE_ID = 1;

const BFF_VIEW_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:1",
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:1",
      },
    },
  ],
};

const CARDS_MOCK = {
  cards: [
    {
      __typename: "GenericSwitcherCard",
      urn: "ppb:tbd:card:genericswitcher:sport:1",
    },
  ],
};

describe("Generic Switcher Card", () => {
  describe("when I'm on a sports page and open the tappable header", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
      await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
      await mockService.mockHttpRequest(getCardResults(CARDS_MOCK));
      await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
      await browser.waitUntilDisplayed(switcherCardPO.element);
      await switcherCardPO.element.click();
      await browser.waitUntilDisplayed(radioListPO.element);
    });

    it("[PRPI-7603] 'Virtuals' should be available", async () => {
      expect(await radioListPO.itemText[2].getText()).toBe("Virtuals");
    });

    describe("when 'Virtuals' is selected", () => {
      beforeAll(async () => {
        await radioListPO.itemInput[2].click();
        await browser.waitUntilBrowserUrlContains("view/d-virtuals");
      });

      it("[PRPI-7604] the app should change page to 'Virtuals' sports page", async () => {
        expect(await browser.getUrl()).toContain("view/d-virtuals");
      });
    });
  });
});
