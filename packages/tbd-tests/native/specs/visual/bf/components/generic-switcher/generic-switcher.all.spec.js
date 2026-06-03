const {
  getCardResults,
  getSportsLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");

const { FilterDrawerSO, RadioListSO, GenericSwitcherCardSO } = require("../../../../../screen-objects");

const switcherCardSO = new GenericSwitcherCardSO();
const filterDrawerSO = new FilterDrawerSO();
const radioListSO = new RadioListSO(filterDrawerSO.element);

const mockService = new MockService();

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

const MODULE_NAME = "generic_switcher_card";

describe("Generic Switcher Card - sports", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getScaResponse({}));
    await mockService.mockHttpRequest(getSportsLayout(BFF_VIEW_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_GENERIC_SWITCHER_MOCK));

    const HOME_VIEW_LINK = getStartViewLink("horse-racing/s-7");
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

    await browser.waitUntilDisplayed(switcherCardSO.element);
    await switcherCardSO.element.click();
    await browser.waitUntilDisplayed(radioListSO.element);

    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4784]_should_display_sports`);
  });

  it("[PRPI-4784]_should_display_sports", async () => {
    expect(
      (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4784]_should_display_sports`)).misMatchPercentage,
    ).toEqual(0);
  });
});
