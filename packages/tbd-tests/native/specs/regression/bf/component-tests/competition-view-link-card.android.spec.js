const { getWallets } = require("@flutter-global/uki-channels-http-clients/mock-index").WALLET;

const {
  getSportsLayout,
  getGenericLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getConnectivityCheck } = require("@ppb/tbd-shared/mocks/connectivity-check/connectivity-check.controller");
const MockService = require("../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");

const mockService = new MockService();
const mockServerPort = mockService.getMockServerPort();
const mockServerHost = mockService.getMockServerHost();

const { PageHeaderSO, CompetitionViewLinkCardSO } = require("../../../../screen-objects");

const pageHeaderSO = new PageHeaderSO();

const competitionViewLinkCard = new CompetitionViewLinkCardSO();

const EVENT_TYPE_ID = 1;
const COMPETITION_ID = 10932509;

const COMPETITION_VIEW_LINK_CARD_MOCK = {
  __typename: "CompetitionViewLinkCard",
  urn: `ppb:tbd:card:competitionViewLink:${COMPETITION_ID}`,
  viewLink: {
    viewUrn: `ppb:tbd:view:competition:${COMPETITION_ID}`,
    viewUrl: `/football/english-premier-league/c-${COMPETITION_ID}`,
  },
  competition: {
    __typename: "Competition",
    urn: `ppb:competition:${COMPETITION_ID}`,
    name: "English Premier League",
    competitionId: COMPETITION_ID,
    sport: {
      __typename: "Sport",
      urn: "ppb:eventType:1",
      name: "Football",
      sportId: 1,
    },
    logo: {
      vector: null,
      small: null,
      medium: null,
      large: `http://${mockServerHost}:${mockServerPort}/mockedImage/image.png`,
    },
  },
};

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: COMPETITION_VIEW_LINK_CARD_MOCK,
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "CompetitionViewLinkCard",
        urn: `ppb:tbd:card:competitionViewLink:${COMPETITION_ID}`,
      },
    },
  ],
};

const DESTINATION_VIEW_MOCK = {
  __typename: "CompetitionView",
  urn: `ppb:tbd:view:competition:${COMPETITION_ID}`,
  url: `/football/english-premier-league/c-${COMPETITION_ID}`,
  title: "English Premier League Page",
  canonicalUrl: `/sport/football/english-premier-league/${COMPETITION_ID}`,
  competition: {
    __typename: "Competition",
    urn: `ppb:competition:${COMPETITION_ID}`,
    name: "English Premier League Page",
    competitionId: COMPETITION_ID,
    sport: {
      __typename: "Sport",
      urn: "ppb:eventType:1",
      name: "Football",
      sportId: 1,
    },
  },
  edges: [],
  partialEdges: [],
};

const WALLET_MOCK = [
  { amount: "25.00", walletName: "MAIN" },
  { amount: "2.00", walletName: "BOOST_TOKENS" },
];

describe("CompetitionViewLinkCard", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(getConnectivityCheck({}));
    await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await mockService.mockHttpRequest(getWallets(WALLET_MOCK));
    const url = "football/s-1";
    const HOME_VIEW_LINK = getStartViewLink(url);
    await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

    await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });
    await browser.waitUntilEquals(competitionViewLinkCard.label, "English Premier League");
  });

  describe("When the user lands in a page with CompetitionViewLinkCard", () => {
    it("[PRPI-1914] The CompetitionViewLinkCard should display an icon", async () => {
      expect(await competitionViewLinkCard.icon.isDisplayed()).toBe(true);
    });

    it("[PRPI-1915] The CompetitionViewLinkCard should display the competition name", async () => {
      expect(await competitionViewLinkCard.label.getText()).toBe("English Premier League");
    });

    describe("And when the user clicks on the CompetitionViewLinkCard", () => {
      beforeAll(async () => {
        await mockService.mockHttpRequest(getGenericLayout(DESTINATION_VIEW_MOCK));
        await browser.waitUntilClickableNative(competitionViewLinkCard.element);
        await competitionViewLinkCard.element.click();
        await browser.waitUntilEquals(pageHeaderSO.pageHeaderTitle, "English Premier League Page");
      });

      it("[PRPI-1916] The competition view should be displayed", async () => {
        expect(await pageHeaderSO.pageHeaderTitle.getText()).toBe("English Premier League Page");
      });
    });
  });
});
