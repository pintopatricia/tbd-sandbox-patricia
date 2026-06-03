const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImagePuppeteer } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const routes = require("../../../../../utils/routes");

const mockService = new MockService();
const MODULE_NAME = "gaming_prize_machine";

const BFF_PRIZE_MACHINE_MOCK_NOT_COMPLETED = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPrizeMachineCard",
        urn: "ppb:tbd:gaming:masterConfigElement:minigame/0",
        activeTitle: "Daily prizes up for grabs",
        jackpotState: "REGULAR",
        ctaLabel: "Play For Free",
      },
    },
  ],
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
        activeTitle: "Daily prizes up for grabs",
        ctaLabel: "Play For Free",
        displayJackpotWinnersPostPlayWidget: true,
        completed: true,
      },
    },
  ],
};

const BFF_PRIZE_MACHINE_MOCK_JACKPOT_REGULAR = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPrizeMachineCard",
        urn: "ppb:tbd:gaming:masterConfigElement:minigame/0",
        jackpotAmount: 10000,
        activeTitle: "Daily prizes up for grabs",
        ctaLabel: "Play For Free",
        jackpotState: "REGULAR",
      },
    },
  ],
};

const BFF_PRIZE_MACHINE_MOCK_JACKPOT_HOT = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPrizeMachineCard",
        urn: "ppb:tbd:gaming:masterConfigElement:minigame/0",
        jackpotAmount: 10000,
        jackpotState: "HOT",
        activeTitle: "Daily prizes up for grabs",
        ctaLabel: "Play For Free",
      },
    },
  ],
};

const BFF_PRIZE_MACHINE_MOCK_JACKPOT_EXTRA_HOT = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPrizeMachineCard",
        urn: "ppb:tbd:gaming:masterConfigElement:minigame/0",
        jackpotAmount: 10000,
        jackpotState: "EXTRA_HOT",
        activeTitle: "Daily prizes up for grabs",
        ctaLabel: "Play For Free",
      },
    },
  ],
};

const BFF_PRIZE_MACHINE_MOCK_JACKPOT_MEGA = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPrizeMachineCard",
        urn: "ppb:tbd:gaming:masterConfigElement:minigame/0",
        jackpotAmount: 10000,
        jackpotState: "MEGA",
        activeTitle: "Daily prizes up for grabs",
        ctaLabel: "Play For Free",
      },
    },
  ],
};

const BFF_PRIZE_MACHINE_MOCK_JACKPOT_MEGA_PLUS = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPrizeMachineCard",
        urn: "ppb:tbd:gaming:masterConfigElement:minigame/0",
        guaranteedPrize: true,
        jackpotAmount: 10000,
        jackpotState: "MEGA",
        activeTitle: "Daily prizes up for grabs",
        ctaLabel: "Play For Free",
      },
    },
  ],
};

const BFF_PRIZE_MACHINE_MOCK_JACKPOT_PLUS_NO_JACKPOT = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPrizeMachineCard",
        urn: "ppb:tbd:gaming:masterConfigElement:minigame/0",
        guaranteedPrize: true,
        jackpotState: "REGULAR",
        activeTitle: "Daily prizes up for grabs",
        ctaLabel: "Play For Free",
      },
    },
  ],
};

const BFF_PRIZE_MACHINE_MOCK_THEME_IMAGES = {
  __typename: "GamingView",
  urn: "ppb:tbd:view:gaming:1",
  url: routes.getGamingViewUrl("1"),
  edges: [
    {
      node: {
        __typename: "GamingPrizeMachineCard",
        urn: "ppb:tbd:gaming:masterConfigElement:minigame/0",
        activeTitle: "Daily prizes up for grabs",
        jackpotAmount: 10000,
        jackpotState: "EXTRA_HOT",
        ctaLabel: "Play For Free",
        themeImages: {
          topLeftImage: {
            url: "http://example.test.com/mockedImage/image.png",
            dimensions: {
              width: 150,
              height: 50,
            },
          },
          bottomLeftImage: {
            url: "http://example.test.com/mockedImage/image.png",
            dimensions: {
              width: 150,
              height: 50,
            },
          },
          bottomRightImage: {
            url: "http://example.test.com/mockedImage/image.png",
            dimensions: {
              width: 150,
              height: 50,
            },
          },
        },
      },
    },
  ],
};

describe("When user lands on a gaming view that has a Prize Machine not completed", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_PRIZE_MACHINE_MOCK_NOT_COMPLETED.urn, { disableCSSAnimations: true }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_PRIZE_MACHINE_MOCK_NOT_COMPLETED));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1335]_it_should_display_prize_machine_not_completed`);
  });

  it("[PRPI-1335]_it_should_display_prize_machine_not_completed", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1335]_it_should_display_prize_machine_not_completed`),
    ).toEqual(0);
  });
});

describe("When user lands on a gaming view that has Jackpot Winners Post Play Widget Displayed", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_JACKPOT_WINNERS_POST_PLAY_WIDGET.urn, {
        disableCSSAnimations: true,
        localeCodeBcp47: "en-GB",
      }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_JACKPOT_WINNERS_POST_PLAY_WIDGET));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1336]_it_should_display_jackpot_winners_post_play_widget`);
  });

  it("[PRPI-1336]_it_should_display_jackpot_winners_post_play_widget", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1336]_it_should_display_jackpot_winners_post_play_widget`),
    ).toEqual(0);
  });
});

describe("When user lands on a gaming view that has a Prize Machine Jackpot Regular State", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_PRIZE_MACHINE_MOCK_JACKPOT_REGULAR.urn, { disableCSSAnimations: true }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_PRIZE_MACHINE_MOCK_JACKPOT_REGULAR));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1337]_it_should_display_prize_machine_jackpot_regular_state`,
    );
  });

  it("[PRPI-1337]_it_should_display_prize_machine_jackpot_regular_state", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1337]_it_should_display_prize_machine_jackpot_regular_state`),
    ).toEqual(0);
  });
});

describe("When user lands on a gaming view that has a Prize Machine Jackpot Hot State", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_PRIZE_MACHINE_MOCK_JACKPOT_HOT.urn, { disableCSSAnimations: true }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_PRIZE_MACHINE_MOCK_JACKPOT_HOT));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1338]_it_should_display_prize_machine_jackpot_hot_state`);
  });

  it("[PRPI-1338]_it_should_display_prize_machine_jackpot_hot_state", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1338]_it_should_display_prize_machine_jackpot_hot_state`),
    ).toEqual(0);
  });
});

describe("When user lands on a gaming view that has a Prize Machine Jackpot Extra Hot State", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_PRIZE_MACHINE_MOCK_JACKPOT_EXTRA_HOT.urn, { disableCSSAnimations: true }),
    );
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_PRIZE_MACHINE_MOCK_JACKPOT_EXTRA_HOT));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1339]_it_should_display_prize_machine_jackpot_extra_hot_state`,
    );
  });

  it("[PRPI-1339]_it_should_display_prize_machine_jackpot_extra_hot_state", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1339]_it_should_display_prize_machine_jackpot_extra_hot_state`),
    ).toEqual(0);
  });
});

describe("When user lands on a gaming view that has a Prize Machine Jackpot Mega State", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_PRIZE_MACHINE_MOCK_JACKPOT_MEGA.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_PRIZE_MACHINE_MOCK_JACKPOT_MEGA));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1340]_it_should_display_prize_machine_jackpot_mega_state`);
  });

  it("[PRPI-1340]_it_should_display_prize_machine_jackpot_mega_state", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1340]_it_should_display_prize_machine_jackpot_mega_state`),
    ).toEqual(0);
  });
});

describe("When user lands on a gaming view that has a Prize Machine Jackpot Mega Plus State", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_PRIZE_MACHINE_MOCK_JACKPOT_MEGA_PLUS.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_PRIZE_MACHINE_MOCK_JACKPOT_MEGA_PLUS));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1341]_it_should_display_prize_machine_jackpot_mega_plus_state`,
    );
  });

  it("[PRPI-1341]_it_should_display_prize_machine_jackpot_mega_plus_state", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1341]_it_should_display_prize_machine_jackpot_mega_plus_state`),
    ).toEqual(0);
  });
});

describe("When user lands on a gaming view that has a Prize Machine Plus State without jackpot", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_PRIZE_MACHINE_MOCK_JACKPOT_PLUS_NO_JACKPOT.urn));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_PRIZE_MACHINE_MOCK_JACKPOT_PLUS_NO_JACKPOT));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilImageEquals(
      `${MODULE_NAME}_[PRPI-1342]_it_should_display_prize_machine_plus_state_without_jackpot`,
    );
  });

  it("[PRPI-1342]_it_should_display_prize_machine_plus_state_without_jackpot", async () => {
    expect(
      await browser.checkScreen(
        `${MODULE_NAME}_[PRPI-1342]_it_should_display_prize_machine_plus_state_without_jackpot`,
      ),
    ).toEqual(0);
  });
});

describe("When user lands on a gaming view that has a Prize Machine with Theme Images", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_PRIZE_MACHINE_MOCK_THEME_IMAGES.urn, { disableCSSAnimations: true }),
    );
    await mockService.mockHttpRequest(getMockedImagePuppeteer({ path: ".*mockedImage.*" }));
    await mockService.mockFonts(getMockFonts());
    await mockService.mockHttpRequest(getGamingLayout(BFF_PRIZE_MACHINE_MOCK_THEME_IMAGES));
    await browser.url(`${routes.getGamingViewUrl("1")}`);
    await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1343]_it_should_display_prize_machine_with_theme_images`);
  });

  it("[PRPI-1343]_it_should_display_prize_machine_with_theme_images", async () => {
    expect(
      await browser.checkScreen(`${MODULE_NAME}_[PRPI-1343]_it_should_display_prize_machine_with_theme_images`),
    ).toEqual(0);
  });
});
