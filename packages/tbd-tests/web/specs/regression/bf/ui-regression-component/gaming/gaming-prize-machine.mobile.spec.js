const { PrizeMachinePO } = require("../../../../../page-objects");
const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const prizeMachinePO = new PrizeMachinePO();
const mockService = new MockService();

const BFF_PRIZE_MACHINE_MOCK = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPrizeMachineCard",
        urn: "ppb:tbd:gaming:masterConfigElement:minigame/0",
        placementId: "gaming_cpp_promotion_prize_machine_placement_1",
        completed: false,
        redirectUrl: "https://www.betfair.com/prize-pinball",
        jackpotState: "REGULAR",
        activeTitle: "Daily prizes up for grabs",
        ctaLabel: "Play For Free",
        displayJackpotWinnersPostPlayWidget: false,
        guaranteedPrize: false,
        themeImages: {
          topLeftImage: {
            url: "urlTopLeft",
            alt: "alt",
            dimensions: {
              width: 150,
              height: 50,
            },
          },
          bottomRightImage: {
            url: "urlBottomRight",
            alt: "alt",
            dimensions: {
              width: 150,
              height: 50,
            },
          },
          bottomLeftImage: {
            url: "urlBottomLeft",
            alt: "alt",
            dimensions: {
              width: 150,
              height: 50,
            },
          },
        },
      },
    },
  ],

  partials: {
    edges: [{ node: { urn: "ppb:tbd:gaming:masterConfigElement:minigame/0", __typename: "GamingPrizeMachineCard" } }],
  },
};

const BFF_PRIZE_MACHINE_WITH_AMOUNT_MOCK = {
  ...BFF_PRIZE_MACHINE_MOCK,
  edges: BFF_PRIZE_MACHINE_MOCK.edges.map((edge) => ({
    ...edge,
    node: {
      ...edge.node,
      jackpotAmount: 1800,
    },
  })),
};

const BFF_JACKPOT_WINNERS_POST_PLAY_WIDGET = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPrizeMachineCard",
        urn: "ppb:tbd:gaming:masterConfigElement:minigame/0",
        placementId: "gaming_cpp_promotion_prize_machine_placement_1",
        completed: true,
        redirectUrl: "https://www.betfair.com/prize-pinball",
        jackpotAmount: 1800,
        jackpotState: "REGULAR",
        activeTitle: "Daily prizes up for grabs",
        ctaLabel: "Play For Free",
        displayJackpotWinnersPostPlayWidget: true,
        guaranteedPrize: false,
        themeImages: null,
      },
    },
  ],

  partials: {
    edges: [{ node: { urn: "ppb:tbd:gaming:masterConfigElement:minigame/0", __typename: "GamingPrizeMachineCard" } }],
  },
};

describe("When user lands on a gaming view that has a Prize Machine", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_PRIZE_MACHINE_MOCK.urn));
    await mockService.mockHttpRequest(getGamingLayout(BFF_PRIZE_MACHINE_MOCK));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.flushFakeClockTimers();
    await browser.waitUntilDisplayed(prizeMachinePO.element);
    await browser.waitUntilDisplayed(prizeMachinePO.pmLogo);
  });

  it("[PRPI-5127]Then the widget is displayed", async () => {
    expect(await prizeMachinePO.element.isDisplayed()).toBe(true);
  });

  it("[PRPI-5128]And it has a title of 'Daily prizes up for grabs'", async () => {
    expect(await prizeMachinePO.pmTitle.getText()).toBe("Daily prizes up for grabs");
  });

  it("[PRPI-5129]And the prize machine logo is displayed'", async () => {
    expect(await prizeMachinePO.pmLogo.isDisplayed()).toBe(true);
  });

  it("[PRPI-5130]And the play button has a text of 'Play For Free'", async () => {
    expect(await prizeMachinePO.pmCTA.getText()).toBe("Play For Free");
  });

  it("[PRPI-5131]And the play button is clickable", async () => {
    expect(await prizeMachinePO.pmCTA.isClickable()).toBe(true);
  });

  it("[PRPI-5132]And the play button has an action that contains /prize-pinball", async () => {
    expect(await prizeMachinePO.pmCTA.getAttribute("href")).toContain("/prize-pinball");
  });

  it("[PRPI-5133]And the T&C button has a text of 'T&Cs Apply'", async () => {
    expect(await prizeMachinePO.pmCTALabel.getText()).toBe("T&Cs Apply");
  });

  it("[PRPI-5134]And the T&C button is clickable", async () => {
    expect(await prizeMachinePO.pmCTALabel.isClickable()).toBe(true);
  });

  it("[PRPI-5135]And the T&C button has an action that contains /prize-pinball", async () => {
    expect(await prizeMachinePO.pmCTALabel.getAttribute("href")).toContain("/prize-pinball");
  });

  it("[PRPI-5136]And the Top Left image should be visible", async () => {
    expect(await prizeMachinePO.topLeftImage.isDisplayed()).toBe(true);
  });

  it("[PRPI-5137]And the Bottom Left image should be visible", async () => {
    expect(await prizeMachinePO.bottomLeftImage.isDisplayed()).toBe(true);
  });

  it("[PRPI-5138]And the Bottom Right image should be visible", async () => {
    expect(await prizeMachinePO.bottomRightImage.isDisplayed()).toBe(true);
  });

  describe("when has a Jackpot Amount", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(await getIndexHTML(BFF_PRIZE_MACHINE_WITH_AMOUNT_MOCK.urn));
      await mockService.mockHttpRequest(getGamingLayout(BFF_PRIZE_MACHINE_WITH_AMOUNT_MOCK));
      await browser.url(`${routes.getGamingViewUrl("1")}`);
      await browser.flushFakeClockTimers();
      await browser.waitUntilDisplayed(prizeMachinePO.element);
      await browser.waitUntilDisplayed(prizeMachinePO.pmCTALabel);
    });

    it("[PRPI-5139]And the T&C button has a text of 'T&Cs Apply'", async () => {
      expect(await prizeMachinePO.pmCTALabel.getText()).toBe("Full T&Cs apply.");
    });
  });
});

describe("When user lands on a gaming view that has a Jackpot Winners Post Play Widget", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_JACKPOT_WINNERS_POST_PLAY_WIDGET.urn, {
        currencyCode: "EUR",
        localeCodeBcp47: "en-GB",
      }),
    );
    await mockService.mockHttpRequest(getGamingLayout(BFF_JACKPOT_WINNERS_POST_PLAY_WIDGET));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.flushFakeClockTimers();
    await browser.waitUntilDisplayed(prizeMachinePO.element);
    await browser.waitUntilDisplayed(prizeMachinePO.postPlayWidget);
    await browser.waitUntilDisplayed(prizeMachinePO.postPlayWidgetLink);
  });

  it("[PRPI-5140]And post play jackpot winners widget is displayed", async () => {
    expect(await prizeMachinePO.postPlayWidget.isDisplayed()).toBe(true);
  });

  it("[PRPI-5141]And the widget is clickable", async () => {
    expect(await prizeMachinePO.postPlayWidget.isClickable()).toBe(true);
  });

  it("[PRPI-5142]And the widget has an action that contains /showJackpotWinners=true", async () => {
    expect(await prizeMachinePO.postPlayWidgetLink.getAttribute("href")).toContain("?showJackpotWinners=true");
  });
});
