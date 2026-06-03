const { PlayNewPO } = require("../../../../../page-objects");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const playNewPO = new PlayNewPO();
const mockService = new MockService();

const BFF_PLAY_NEW_MOCK_ACTIVE = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPlayNewCard",
        urn: "ppb:tbd:gaming:masterConfigElement:styw/0",
        title: "SPIN ‘TIL YOU WIN ON FREE FIGHTER",
        subtitle: "NOW LIVE. JOIN FUN!",
        optInState: "NOT_OPTED_IN",
        endDate: "2022-05-30T14:05:09.515Z",
        tags: ["styw"],
        backgroundImage: [
          {
            url: "http://example.test.com/mockedImage/image.png",
            width: 900,
            height: 900,
          },
        ],

        logoImage: [
          {
            url: "http://example.test.com/mockedImage/image.png",
            width: 563,
            height: 563,
          },
        ],
      },
    },
  ],

  partials: {
    edges: [{ node: { urn: "ppb:tbd:gaming:masterConfigElement:styw/0", __typename: "GamingPlayNewCard" } }],
  },
};

const BFF_PLAY_NEW_MOCK_PRE_CAMPAIGN = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPlayNewCard",
        urn: "ppb:tbd:gaming:masterConfigElement:styw/0",
        title: "SPIN ‘TIL YOU PROMO",
        subtitle: "NOW LIVE. JOIN FUN!",
        optInState: "NOT_OPTED_IN",
        endDate: "2022-05-30T14:05:09.515Z",
        tags: ["styw-static"],
        logoImage: [
          {
            url: "http://example.test.com/mockedImage/image.png",
            width: 1200,
            height: 563,
          },
        ],
      },
    },
  ],

  partials: {
    edges: [{ node: { urn: "ppb:tbd:gaming:masterConfigElement:styw/0", __typename: "GamingPlayNewCard" } }],
  },
};

describe("When user lands on a gaming view that has a play new widget in active state", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_PLAY_NEW_MOCK_ACTIVE.urn));
    await mockService.mockHttpRequest(getGamingLayout(BFF_PLAY_NEW_MOCK_ACTIVE));
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await browser.url(routes.getGamingViewUrl("1"));

    await browser.waitUntilDisplayed(playNewPO.element);
  });

  it("[PRPI-5862] Then the widget is displayed", async () => {
    expect(await playNewPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-5863] Then the title is displayed", async () => {
    expect(await playNewPO.title.isDisplayed()).toBe(true);
  });

  it("[PRPI-5864] Then the subtitle is displayed", async () => {
    expect(await playNewPO.subtitle.isDisplayed()).toBe(true);
  });

  it("[PRPI-5865] Then the Play New button is displayed", async () => {
    expect(await playNewPO.button.isDisplayed()).toBe(true);
  });

  it("[PRPI-5866] Then the Play New button is clickable", async () => {
    expect(await playNewPO.button.isClickable()).toBe(true);
  });

  it("[PRPI-5867] Then the Play New button has an action that contains /promos", async () => {
    expect(await playNewPO.button.getAttribute("href")).toContain("/promos");
  });

  it("[PRPI-5868] Then the Play New button has an action that contains a returnURL", async () => {
    expect(await playNewPO.button.getAttribute("href")).toContain("&returnURL=");
  });

  it("[PRPI-5869] Then the T&Cs apply link is displayed", async () => {
    expect(await playNewPO.moreInfoLink.isDisplayed()).toBe(true);
  });

  it("[PRPI-5870] Then the T&Cs apply link text is 'T&Cs Apply'", async () => {
    expect(await playNewPO.moreInfoLink.getText()).toBe("T&Cs Apply");
  });

  it("[PRPI-5871] Then the T&Cs apply link has an action that contains /promos", async () => {
    expect(await playNewPO.moreInfoLink.getAttribute("href")).toContain("/promos");
  });

  it("[PRPI-5872] Then the T&Cs apply link has an action that contains a returnURL", async () => {
    expect(await playNewPO.moreInfoLink.getAttribute("href")).toContain("&returnURL=");
  });

  it("[PRPI-5873] Then the New badge is displayed", async () => {
    expect(await playNewPO.newBadge.isDisplayed()).toBe(true);
  });

  it("[PRPI-5874] Then the New badge text is 'NEW'", async () => {
    expect(await playNewPO.newBadge.getText()).toBe("NEW");
  });
});

describe("When user lands on a gaming view that has a play new widget in pre-campaign state", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_PLAY_NEW_MOCK_PRE_CAMPAIGN.urn, { date: "2022-05-26T13:44Z" }),
    );
    await mockService.mockHttpRequest(getGamingLayout(BFF_PLAY_NEW_MOCK_PRE_CAMPAIGN));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilDisplayed(playNewPO.element);
  });

  it("[PRPI-5875] Then the widget is displayed", async () => {
    expect(await playNewPO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-5876] Then the timer is displayed", async () => {
    expect(await playNewPO.timer.isDisplayed()).toBe(true);
  });

  it("[PRPI-5877] Then the timer label contain 'HOURS'", async () => {
    expect(await playNewPO.timerUnitLabelList[0].getText()).toBe("HOURS");
  });

  it("[PRPI-5878] Then the timer value of 'HOURS' contain the Hours value", async () => {
    expect(await playNewPO.timerUnitValueList[0].getText()).toBe("9");
    expect(await playNewPO.timerUnitValueList[1].getText()).toBe("6");
  });

  it("[PRPI-5879] Then the timer label contain 'MINUTES'", async () => {
    expect(await playNewPO.timerUnitLabelList[1].getText()).toBe("MINUTES");
  });

  it("[PRPI-5880] When the timer value of 'MINUTES' contain the MINUTES value", async () => {
    expect(await playNewPO.timerUnitValueList[2].getText()).toBe("2");
    expect(await playNewPO.timerUnitValueList[3].getText()).toBe("1");
  });

  it("[PRPI-5881] Then the T&Cs apply link is displayed", async () => {
    expect(await playNewPO.moreInfoLink.isDisplayed()).toBe(true);
  });

  it("[PRPI-5882] Then the T&Cs apply link text is 'T&Cs Apply'", async () => {
    expect(await playNewPO.moreInfoLink.getText()).toBe("T&Cs Apply");
  });

  it("[PRPI-5883] Then the T&Cs apply link has an action that contains /promos", async () => {
    expect(await playNewPO.moreInfoLink.getAttribute("href")).toContain("/promos");
  });

  it("[PRPI-5884] Then the T&Cs apply link has an action that contains a returnURL", async () => {
    expect(await playNewPO.moreInfoLink.getAttribute("href")).toContain("&returnURL=");
  });
});
