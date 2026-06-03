const { SportsbookChatbotInputPO } = require("../../../../../page-objects");
const NavigationTabsListPO = require("@ppb/tbd-shared/components/NavigationTabsList/NavigationTabsList.po");

const {
  getEventLayout,
  getCardResults,
  getSportsbookChatbotHistory,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const chatbotInputPO = new SportsbookChatbotInputPO();
const navigationTabsListPO = new NavigationTabsListPO();
const firstTabPO = navigationTabsListPO.tabs[0];
const secondTabPO = navigationTabsListPO.tabs[1];

const mockService = new MockService();

const EVENT_ID = "33755137";
const EVENT_URN = `ppb:tbd:view:event:${EVENT_ID}`;
const EVENT_URL = "football/uefa-nations-league/north-macedonia-v-latvia/e-33755137";

const sportevent = {
  __typename: "SportsEvent",
  urn: `ppb:event:${EVENT_ID}`,
  eventId: Number(EVENT_ID),
  name: "North Macedonia v Latvia",
  openDate: "2024-11-14T19:45:00.000Z",
  competition: {
    __typename: "Competition",
    urn: "ppb:competition:11984200",
    name: "UEFA Nations League",
    competitionId: 11984200,
    sport: {
      __typename: "Sport",
      urn: "ppb:eventType:1",
      name: "Football",
      shortName: null,
      sportId: 1,
    },
    logo: {},
    country: { urn: "", code: "", flag: { vector: "" } },
  },
};

const SPORTSBOOK_CHATBOT_CARD = {
  __typename: "SportsbookChatbotCard",
  urn: `ppb:tbd:card:sportsbook-chatbot:${EVENT_ID}`,
  chatId: "test-chat-id",
  startDate: "2020-01-01T00:00:00.000Z",
  endDate: "2099-01-01T00:00:00.000Z",
  displayWindowOffset: 24,
  chatContext: {
    eventId: EVENT_ID,
    eventName: sportevent.name,
  },
  startingPrompts: ["Top Goalscorer", "Home Team to Win"],
};

const SPORTSBOOK_CHATBOT_CARD_PARTIAL = {
  node: {
    __typename: "SportsbookChatbotCard",
    urn: SPORTSBOOK_CHATBOT_CARD.urn,
  },
};

const NAVIGATION_TABS_LIST_PARTIAL = {
  node: {
    __typename: "NavigationTabsList",
    urn: "ppb:tbd:card:navigationTabsList:chatbot-test",
  },
};

const NAVIGATION_TABS_LIST_MOCK = {
  node: {
    __typename: "NavigationTabsList",
    urn: "ppb:tbd:card:navigationTabsList:chatbot-test",
    full: {
      edges: [
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:overview",
            tabTitle: { translate: { key: "I18N.TABS.OVERVIEW" } },
            full: {
              edges: [{ node: SPORTSBOOK_CHATBOT_CARD }],
            },
            partials: {
              partialEdges: [SPORTSBOOK_CHATBOT_CARD_PARTIAL],
            },
          },
        },
      ],
    },
    partials: {
      edges: [
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:overview",
            tabTitle: { translate: { key: "I18N.TABS.OVERVIEW" } },
          },
        },
        {
          node: {
            __typename: "NavigationTab",
            urn: "ppb:tbd:view:navigationTab:stats",
            tabTitle: { translate: { key: "I18N.TABS.STATS" } },
          },
        },
      ],
    },
  },
};

const BFF_STATS_TAB_MOCK = {
  cards: [
    {
      __typename: "NavigationTab",
      urn: "ppb:tbd:view:navigationTab:stats",
      tabTitle: { translate: { key: "I18N.TABS.STATS" } },
      full: {
        edges: [null],
      },
      partials: {
        partialEdges: [],
      },
    },
  ],
};

const BFF_OVERVIEW_TAB_MOCK = {
  cards: [
    {
      __typename: "NavigationTab",
      urn: "ppb:tbd:view:navigationTab:overview",
      tabTitle: { translate: { key: "I18N.TABS.OVERVIEW" } },
      full: {
        edges: [{ node: SPORTSBOOK_CHATBOT_CARD }],
      },
      partials: {
        partialEdges: [SPORTSBOOK_CHATBOT_CARD_PARTIAL],
      },
    },
  ],
};

const BFF_MOCK = {
  urn: EVENT_URN,
  url: EVENT_URL,
  sportevent,
  edges: [NAVIGATION_TABS_LIST_MOCK],
  partialEdges: [NAVIGATION_TABS_LIST_PARTIAL],
};

const BFF_CHATBOT_CARDS_MOCK = {
  cards: [SPORTSBOOK_CHATBOT_CARD],
};

describe("Sportsbook Chatbot - Input visibility (mobile)", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(
      await getIndexHTML(BFF_MOCK.urn, { date: "2024-11-14T12:00:00.000Z", disableCSSAnimations: false }),
    );
    await mockService.mockHttpRequest(getEventLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getCardResults(BFF_CHATBOT_CARDS_MOCK));
    await mockService.mockHttpRequest(getSportsbookChatbotHistory({ chatId: SPORTSBOOK_CHATBOT_CARD.chatId }));
    await browser.url(routes.getEventViewUrl(EVENT_ID));
    await browser.waitUntilDisplayed(chatbotInputPO.element);
  });

  it("[PRPI-12751] renders the SportsbookChatbotInput when the tab contains the card", async () => {
    expect(await chatbotInputPO.element.isDisplayed()).toBe(true);
    expect(await chatbotInputPO.expandButton.isDisplayed()).toBe(true);
  });

  describe("When switching to a tab without a SportsbookChatbotCard", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_STATS_TAB_MOCK));
      await browser.tickFakeClock();
      await secondTabPO.scrollIntoView({ block: "end" });
      await browser.waitUntilInViewport(secondTabPO);
      await secondTabPO.click();
      await browser.containsClass(secondTabPO, NavigationTabsListPO.states.selected);
      await browser.waitUntil(async () => !(await chatbotInputPO.element.isDisplayed()));
    });

    it("[PRPI-12752] does not render the SportsbookChatbotInput", async () => {
      expect(await chatbotInputPO.element.isDisplayed()).toBe(false);
    });
  });

  describe("When switching back to the tab with the SportsbookChatbotCard", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getCardResults(BFF_OVERVIEW_TAB_MOCK));
      await mockService.mockHttpRequest(getSportsbookChatbotHistory({ chatId: SPORTSBOOK_CHATBOT_CARD.chatId }));
      await browser.tickFakeClock();
      await firstTabPO.scrollIntoView({ block: "end" });
      await browser.waitUntilInViewport(firstTabPO);
      await firstTabPO.click();
      await browser.containsClass(firstTabPO, NavigationTabsListPO.states.selected);
      await browser.waitUntilDisplayed(chatbotInputPO.element);
    });

    it("[PRPI-12753] renders the SportsbookChatbotInput again", async () => {
      expect(await chatbotInputPO.element.isDisplayed()).toBe(true);
      expect(await chatbotInputPO.expandButton.isDisplayed()).toBe(true);
    });
  });

  describe("When the expand button is clicked", () => {
    beforeAll(async () => {
      await chatbotInputPO.expandButton.waitForClickable();
      await chatbotInputPO.expandButton.click();
      await browser.waitUntilDisplayed(chatbotInputPO.textInput);
    });

    it("[PRPI-12754] renders the text input", async () => {
      expect(await chatbotInputPO.textInput.isDisplayed()).toBe(true);
    });

    it("[PRPI-12755] renders the send button", async () => {
      expect(await chatbotInputPO.sendButton.isDisplayed()).toBe(true);
    });
  });
});
