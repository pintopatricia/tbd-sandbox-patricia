const { getRaceLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { SelectorPO, FilterDrawerPO, RadioListPO, RaceSwitcherCardPO } = require("../../../../../page-objects");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const mockService = new MockService();

const RACE_ID = "34220053.1230";

const raceSwitcherCardPO = new RaceSwitcherCardPO();
const raceSwitcherCardSelectorPO = new SelectorPO(raceSwitcherCardPO.details);
const filterDrawerPO = new FilterDrawerPO();
const radioListPO = new RadioListPO(filterDrawerPO.element);

const BFF_VIEW_MOCK_FIRST_SELECT = {
  __typename: "RaceView",
  urn: `ppb:tbd:view:race:${RACE_ID}`,
  url: "horse-racing/chelmc-10th-dec/r-7%7C30174778.1630",
  race: {
    urn: `ppb:tbd:view:race:${RACE_ID}`,
    meeting: {
      urn: "123",
    },
  },
  edges: [
    {
      node: {
        __typename: "RaceSwitcherCard",
        urn: "ppb:tbd:card:raceswitcher:30184830.1205",
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "RaceSwitcherCard",
        urn: "ppb:tbd:card:raceswitcher:30184830.1205",
      },
    },
  ],
};

const BFF_VIEW_MOCK_FIRST_SELECT_WITH_SIBLINGS = {
  cards: [
    {
      __typename: "RaceSwitcherCard",
      urn: "ppb:tbd:card:raceswitcher:30184830.1205",
    },
  ],
};

const BFF_VIEW_MOCK_SECOND_SELECT = {
  __typename: "RaceView",
  urn: "ppb:tbd:view:race:7|34220026.1240",
  url: "horse-racing/beverley-16th-apr/r-7%7C34220026.1240",
};

describe('When the user is on "14:40 Aintree" race card page', () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK_FIRST_SELECT.urn));
    await mockService.mockHttpRequest(getRaceLayout(BFF_VIEW_MOCK_FIRST_SELECT));
    await mockService.mockHttpRequest(getCardResults(BFF_VIEW_MOCK_FIRST_SELECT_WITH_SIBLINGS));
    await mockService.mockHttpRequest(getRaceLayout(BFF_VIEW_MOCK_SECOND_SELECT));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getRaceViewUrl("7", RACE_ID));

    await browser.waitUntilDisplayed(raceSwitcherCardSelectorPO.element);
  });

  it("[PRPI-6216] The meeting name visible on the meeting selector should be 'Aintree'", async () => {
    expect(await raceSwitcherCardSelectorPO.selectedValue.getText()).toEqual("Aintree");
  });

  describe('When the user taps the meeting selector and picks "Beverley" meeting', () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(raceSwitcherCardSelectorPO.element);
      await raceSwitcherCardSelectorPO.element.click();
      await radioListPO.itemInput[1].click();
      await browser.waitUntilNotDisplayed(filterDrawerPO.element);
    });

    it("[PRPI-6217] the app should change page to the correct race page", async () => {
      expect(await browser.getUrl()).toContain("horse-racing/beverley-16th-apr/r-7%7C34220026.1240");
    });
  });
});
