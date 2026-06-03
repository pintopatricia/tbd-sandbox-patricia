const { getCardResults, getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const { FilterDrawerPO, RadioListPO, GenericSwitcherCardPO } = require("../../../../../page-objects");
const { getMockFonts } = require("../../../../../mock-essentials/controllers/fonts/fonts-controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const switcherCardPO = new GenericSwitcherCardPO();
const filterDrawerPO = new FilterDrawerPO();
const radioListPO = new RadioListPO(filterDrawerPO.element);

const mockService = new MockService();
const MODULE_NAME = "generic_switcher_card";

const BFF_VIEW_MOCK = {
  urn: "ppb:tbd:view:sport:7",
  url: "horse-racing/s-7",
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:7",
    name: "Horse Racing",
    sportId: 7,
  },
  edges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:7",
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "GenericSwitcherCard",
        urn: "ppb:tbd:card:genericswitcher:sport:7",
      },
    },
  ],
};

const BFF_GENERIC_SWITCHER_MOCK = {
  cards: [
    {
      __typename: "GenericSwitcherCard",
      urn: "ppb:tbd:card:genericswitcher:sport:7",
    },
  ],
};

describe("Generic Switcher Card - sports", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_VIEW_MOCK.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_GENERIC_SWITCHER_MOCK));
    await browser.url(routes.getRacingViewUrl());

    await browser.waitUntilDisplayed(switcherCardPO.element);
    await switcherCardPO.element.click();
    await browser.waitUntilDisplayed(radioListPO.element);

    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4784]_should_display_sports`);
  });

  it("[PRPI-4784]_should_display_sports", async () => {
    expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-4784]_should_display_sports`)).toEqual(0);
  });
});
