const { ScrollableTabsPO, SelectableItemsPO, RaceTimePO } = require("../../../../page-objects");
const { getRaceLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSSCv1Content, getSSCHeaderCSS } = require("@ppb/tbd-shared/mocks/ssc/ssc.controller");

const { getIndexHTML } = require("../../../../mock-essentials/controllers/webserver/webserver-controller");
const { getMockFonts } = require("../../../../mock-essentials/controllers/fonts/fonts-controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { getHomeViewUrl } = require("../../../../../utils/routes");

const MODULE_NAME = "race_view_links";
const mockService = new MockService();
const scrollableTabsPO = new ScrollableTabsPO();
const selectableItemsPO = new SelectableItemsPO();
const firstRaceTimePO = new RaceTimePO(selectableItemsPO.races[0]);
const NUMBER_OF_RACES = 16;

const createQuicklinksCard = (id) => ({
  __typename: "QuickLinksCard",
  urn: `ppb:tbd:card:quickLinks:${id}`,
  links: [
    {
      label: `Random Link ${id}`,
      viewLink: {
        viewUrn: `ppb:tbd:view:market:924.${id}`,
        viewUrl: `market/924.${id}`,
      },
    },
  ],
});

const createRace = (id) => ({
  race: {
    __typename: "Race",
    urn: `ppb:race:1.${id}`,
    raceId: `1.${id}`,
    startTime: `2024-12-12T10:${id < 10 ? `0${id}` : id}:00.000Z`,
    name: `Race ${id}`,
    meeting: {
      __typename: "Meeting",
      urn: "ppb:meeting:1",
      name: "Metting",
      country: "GB",
      sport: {
        urn: "ppb:eventType:7",
        name: "Horse Racing",
        sportId: 7,
      },
      venue: "Venue",
      date: `2024-12-12T10:00:00.000Z`,
    },
  },
  viewLink: {
    viewUrn: `ppb:tbd:view:race:7|1.${id}`,
    viewUrl: `horse-racing/meeting/r-1.${id}`,
  },
  ...(id % 2 === 0 && {
    marketPromo: {
      signposting: "MONEY_BACK",
    },
  }),
  blurbs: [],
});

const createBFFMock = (id) => ({
  urn: `ppb:tbd:view:race:7|1.${id}`,
  edges: [
    {
      node: {
        __typename: "RaceViewLinksCard",
        urn: "ppb:tbd:card:raceViewLinks:7|1.1",
        ...createRace(id),
        raceViewLinks: [...Array(NUMBER_OF_RACES).keys()].map((key) => createRace(key + 1)),
      },
    },
    {
      node: createQuicklinksCard(id),
    },
  ],

  partialEdges: [
    {
      node: {
        urn: "ppb:tbd:card:raceViewLinks:7|1.1",
        __typename: "RaceViewLinksCard",
      },
    },
    {
      node: {
        __typename: "QuickLinksCard",
        urn: `ppb:tbd:card:quickLinks:${id}`,
      },
    },
  ],

  race: createRace(id),
});

const BFF_MOCK = createBFFMock(1);
const BFF_LAST_RACE_MOCK = createBFFMock(16);

describe("Race View Links", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getRaceLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getSSCHeaderCSS());
    await mockService.mockHttpRequest(getSSCv1Content());
    await mockService.mockFonts(getMockFonts());
    await browser.url(getHomeViewUrl());
  });

  describe("when BFF returns race view links", () => {
    beforeAll(async () => {
      await browser.waitUntilDisplayed(scrollableTabsPO.element);
      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1522]_should_correctly_display_race_view_links`);
    });

    it("[PRPI-1522]_should_correctly_display_race_view_links", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1522]_should_correctly_display_race_view_links`)).toBe(0);
    });
  });

  describe("when a race tab is hovered", () => {
    beforeAll(async () => {
      await firstRaceTimePO.element.moveTo();
      await browser.waitUntilDisplayed(scrollableTabsPO.rightButton);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1523]_should_display_right_arrow`);
    });

    it("[PRPI-1523]_should_display_right_arrow", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1523]_should_display_right_arrow`)).toBe(0);
    });
  });

  describe("when a the right arrow is clicked", () => {
    beforeAll(async () => {
      await scrollableTabsPO.rightButton.waitForClickable();
      await scrollableTabsPO.rightButton.click();
      await browser.waitUntilDisplayed(scrollableTabsPO.leftButton);

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1524]_should_show_left_arrow`);
    });

    it("[PRPI-1524]_should_show_left_arrow", async () => {
      expect(await browser.checkScreen(`${MODULE_NAME}_[PRPI-1524]_should_show_left_arrow`)).toBe(0);
    });
  });

  describe("when the user selects the last race", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getRaceLayout(BFF_LAST_RACE_MOCK));

      const racesLength = await selectableItemsPO.races.length;
      const lastRacePO = new RaceTimePO(selectableItemsPO.races[racesLength - 1]);

      await lastRacePO.element.waitForClickable();
      await lastRacePO.element.click();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-1525]_should_select_race_and_see_the_last_race_content`);
    });

    it("[PRPI-1525]_should_select_race_and_see_the_last_race_content", async () => {
      expect(
        await browser.checkScreen(`${MODULE_NAME}_[PRPI-1525]_should_select_race_and_see_the_last_race_content`),
      ).toBe(0);
    });
  });
});
