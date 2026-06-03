const {
  FootballScoreboardSO,
  FooterSO,
  MyBetsScreenSO,
  MyBetsHeaderSO,
  SegmentedControlSO,
  TabsGroupSO,
  TeamSO,
  TeamsSO,
} = require("../../../../screen-objects");
const BetCardGroupSO = require("@ppb/tbd-shared/components/BetCardGroup/BetCardGroup.web.po");
const RaceDetailsSO = require("@ppb/tbd-shared/components/RaceDetailsCard/RaceDetailsCard.native.so");

const {
  getAppContext,
  getHomeLayoutWithViewLink,
  getMyBetsLayout,
  getCardResults,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { getScaResponse } = require("@ppb/tbd-shared/mocks/sca/sca.controller");
const { getMyBetsEXCViewMock } = require("@ppb/tbd-shared/mocks/utils/my-bets-mock-generator");

const { startApp } = require("../../../../helpers/urls");
const { getStartViewLink } = require("../../../../helpers/view-link-start");
const { swipeUp } = require("../../../../helpers/gestures");

const routes = require("../../../../../utils/routes");
const MockService = require("../../../../mock-essentials/mocking-service");
const { GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK } = require("../../../../helpers/mybets.util");

const mockService = new MockService();

const myBetsScreenSO = new MyBetsScreenSO();
const myBetsHeaderSO = new MyBetsHeaderSO(myBetsScreenSO.header);
const tabsGroupSO = new TabsGroupSO(myBetsHeaderSO.orderTypeFilter);
const segmentedControlSO = new SegmentedControlSO();
const footerSO = new FooterSO(myBetsScreenSO.footer);

const firstBetCardGroupSO = new BetCardGroupSO(myBetsScreenSO.betCardGroups[0]);
const firstBetCardHeaderSO = new FootballScoreboardSO(firstBetCardGroupSO.element);

const secondBetCardGroupSO = new BetCardGroupSO(myBetsScreenSO.betCardGroups[1]);
const secondBetCardHeaderSO = new RaceDetailsSO(secondBetCardGroupSO.element);

const thirdBetCardGroupSO = new BetCardGroupSO(myBetsScreenSO.betCardGroups[2]);
const thirdBetCardHeaderSO = new TeamsSO(thirdBetCardGroupSO.element);

const getBFFMock = ({ isUnmatched = false, matchedStatus } = {}) => {
  const BASE_MOCK = [
    {
      urn: `ppb:tbd:card:bet:group:35286822|exc?=matchedStatus=${matchedStatus}`,
      aggregatorId: "35286822",
      aggregatorDesc: "Stuttgart v Celtic",
      edges: [
        {
          __typename: "FixtureCard",
          urn: "ppb:tbd:card:fixture:35286822|viewLink|0",
          homeName: "Stuttgart",
          awayName: "Celtic",
          scheduledAt: "2026-02-26T17:45:00Z",
        },
        {
          __typename: "MarketBetCardGroup",
          urn: `ppb:tbd:cardgroup:marketBetCard:1.254275931?=orderType=OPEN&matchedStatus=${matchedStatus}`,
          edges: [
            {
              __typename: "MarketBetCard",
              description: "Match Odds",
              urn: `ppb:tbd:card:marketBet:1.254275931?=orderType=OPEN&matchedStatus=${matchedStatus}`,
              betCardGroupURN: `ppb:tbd:card:bet:group:35286822|exc?=matchedStatus=${matchedStatus}`,
              marketBetCardGroupURN: `ppb:tbd:cardgroup:marketBetCard:1.254275931?=orderType=OPEN&matchedStatus=${matchedStatus}`,
              numOfOrders: 1,
              numOfUnmatched: isUnmatched ? 1 : 0,
            },
            {
              __typename: "MarketBetExpandableCardGroup",
              urn: `ppb:tbd:cardgroup:marketBetExpandableCard:1.254275931?=orderType=OPEN&matchedStatus=${matchedStatus}`,
              marketBetCardGroupURN: `ppb:tbd:cardgroup:marketBetCard:1.254275931?=orderType=OPEN&matchedStatus=${matchedStatus}`,
              edges: [
                {
                  __typename: "MarketBetSelectionCardGroup",
                  urn: `ppb:tbd:cardgroup:marketBetSelectionCard:1.254275931?=orderType=OPEN&matchedStatus=${matchedStatus}`,
                  betCardGroupURN: `ppb:tbd:card:bet:group:35286822|exc?=matchedStatus=${matchedStatus}`,
                  marketBetCardURN: `ppb:tbd:card:marketBet:1.254275931?=orderType=OPEN&matchedStatus=${matchedStatus}`,
                  marketBetCardGroupURN: `ppb:tbd:cardgroup:marketBetCard:1.254275931?=orderType=OPEN&matchedStatus=${matchedStatus}`,
                  edges: [
                    {
                      __typename: "MarketBetSelectionCard",
                      urn: `ppb:tbd:card:marketBetSelection:419809571369-U?=orderType=OPEN&matchedStatus=${matchedStatus}`,
                      id: "419809571369",
                      price: 21,
                      runnerDesc: "Stuttgart",
                      side: "BACK",
                      size: 1,
                      profit: 20,
                      priceMatched: 21,
                      isUnmatched: isUnmatched ? "true" : "false",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    {
      aggregatorDesc: "14:40 Aintree",
      aggregatorId: "35307461.1653",
      urn: `ppb:tbd:card:bet:group:35307461.1653|exc?=matchedStatus=${matchedStatus}`,
      edges: [
        {
          __typename: "RaceDetailsCard",
          urn: "ppb:tbd:card:raceDetails:35307461.1653|true|true|false",
          raceDetailsTitle: "Betmgm Awc Mile Trial Handicap",
          numberOfRunners: 10,
          raceClass: 2,
          showMeetingInfo: true,
          race: {
            __typename: "Race",
            urn: "ppb:race:35307461.1653",
            raceId: "35307461.1653",
            name: "1m Hcap",
            startTime: "2026-02-27T14:40:00.000Z",
            details: {
              __typename: "RaceDetails",
              distance: { miles: 1, furlongs: 0, yards: 1 },
              going: "GOOD_FIRM",
              type: "FLAT",
              numberOfRunners: 10,
              numberOfNonRunners: 0,
              numberOfParticipants: 10,
              title: "Betmgm Awc Mile Trial Handicap",
            },
            meeting: {
              __typename: "Meeting",
              urn: "ppb:meeting:35307461",
              meetingId: "35307461",
              name: "Aintree 27th Feb",
              country: "GB",
              countryFlag: {
                small: "http://example.test.com/mockedImage/image.png",
                medium: "http://example.test.com/mockedImage/image.png",
                large: "http://example.test.com/mockedImage/image.png",
              },
              venue: "Aintree",
            },
          },
        },
        {
          __typename: "MarketBetCardGroup",
          edges: [
            {
              __typename: "MarketBetCard",
              urn: `ppb:tbd:card:marketBet:1.254504381?=orderType=OPEN&matchedStatus=${matchedStatus}`,
              betCardGroupURN: `ppb:tbd:card:bet:group:35307461.1653|exc?=matchedStatus=${matchedStatus}`,
              description: "1m Hcap",
              numOfOrders: 1,
              numOfUnmatched: isUnmatched ? 1 : 0,
            },
            {
              __typename: "MarketBetExpandableCardGroup",
              urn: `ppb:tbd:cardgroup:marketBetExpandableCard:1.254504381?=orderType=OPEN&matchedStatus=${matchedStatus}`,
              marketBetCardGroupURN: `ppb:tbd:cardgroup:marketBetCard:1.254504381?=orderType=OPEN&matchedStatus=${matchedStatus}`,
              edges: [
                {
                  __typename: "MarketBetSelectionCardGroup",
                  urn: `ppb:tbd:cardgroup:marketBetSelectionCard:1.254504381?=orderType=OPEN&matchedStatus=${matchedStatus}`,
                  betCardGroupURN: `ppb:tbd:card:bet:group:35307461.1653|exc?=matchedStatus=${matchedStatus}`,
                  marketBetCardURN: `ppb:tbd:card:marketBet:1.254504381?=orderType=OPEN&matchedStatus=${matchedStatus}`,
                  marketBetCardGroupURN: `ppb:tbd:cardgroup:marketBetCard:1.254504381?=orderType=OPEN&matchedStatus=${matchedStatus}`,
                  edges: [
                    {
                      __typename: "MarketBetSelectionCard",
                      id: "419750134595",
                      price: 21,
                      runnerDesc: "Popmaster",
                      side: "BACK",
                      size: 1,
                      profit: 20,
                      priceMatched: 21,
                      isUnmatched: isUnmatched ? "true" : "false",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },

    {
      urn: `ppb:tbd:card:bet:group:1908053|exc?=matchedStatus=${matchedStatus}`,
      aggregatorId: "1908053",
      aggregatorDesc: "English Sky Bet Championship",
      edges: [
        {
          __typename: "EventHeaderCard",
          urn: "ppb:tbd:card:eventHeader:1908053/0",
          title: "English Sky Bet Championship",
          sportId: "1",
          subtitle: "",
          tertiaryTitle: "",
          scheduledAt: "2021-08-06T18:45:00.000Z",
        },
        {
          __typename: "MarketBetCardGroup",
          urn: `ppb:tbd:cardgroup:marketBetCard:1.244322205?=orderType=OPEN&matchedStatus=${matchedStatus}`,
          edges: [
            {
              __typename: "MarketBetCard",
              urn: `ppb:tbd:card:marketBet:1.244322205?=orderType=OPEN&matchedStatus=${matchedStatus}`,
              betCardGroupURN: `ppb:tbd:card:bet:group:1908053|exc?=matchedStatus=${matchedStatus}`,
              marketBetCardGroupURN: `ppb:tbd:cardgroup:marketBetCard:1.244322205?=orderType=OPEN&matchedStatus=${matchedStatus}`,
              description: "Winner 2025/26",
              numOfOrders: 1,
              numOfUnmatched: isUnmatched ? 1 : 0,
            },
            {
              __typename: "MarketBetExpandableCardGroup",
              edges: [
                {
                  __typename: "MarketBetSelectionCardGroup",
                  edges: [
                    {
                      __typename: "MarketBetSelectionCard",
                      urn: `ppb:tbd:cardgroup:marketBetSelectionCard:1.244322205?=orderType=OPEN&matchedStatus=${matchedStatus}`,
                      betCardGroupURN: `ppb:tbd:card:bet:group:1908053|exc?=matchedStatus=${matchedStatus}`,
                      marketBetCardGroupURN: `ppb:tbd:cardgroup:marketBetCard:1.244322205?=orderType=OPEN&matchedStatus=${matchedStatus}`,
                      marketBetCardURN: `ppb:tbd:card:marketBet:1.244322205?=orderType=OPEN&matchedStatus=${matchedStatus}`,
                      id: "419739570547",
                      price: 21,
                      runnerDesc: "Coventry",
                      side: "BACK",
                      size: 1,
                      profit: 20,
                      priceMatched: 21,
                      isUnmatched: isUnmatched ? "true" : "false",
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ];

  return getMyBetsEXCViewMock(BASE_MOCK, {
    hasFooter: true,
    isOpenMatched: !isUnmatched,
    isOpenUnmatched: isUnmatched,
  });
};

const setup = async ({ isUnmatched = false, shouldTerminateAppBeforeStart = false } = {}) => {
  const matchedStatus = isUnmatched ? "unmatched" : "matched";

  const BFF_MOCK = getBFFMock({ isUnmatched, matchedStatus });
  await mockService.mockHttpRequest(getAppContext({}));
  await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }, 404));
  await mockService.mockHttpRequest(getScaResponse({}));
  await mockService.mockHttpRequest(getMyBetsLayout(BFF_MOCK));
  await mockService.mockHttpRequest(getCardResults({ cards: [GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK] }));

  const HOME_VIEW_LINK = getStartViewLink(routes.getMyBetsViewUrl("open", { matchedStatus }));
  await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));
  await startApp("home", {
    isViewLinkStartPage: !!HOME_VIEW_LINK,
    shouldTerminateAppBeforeStart,
  });

  await browser.waitUntilDisplayed(myBetsScreenSO.element, "My Bets screen not visible");
  await browser.waitUntilEquals(tabsGroupSO.selectedTab, "Open");
};

describe("My Bets - Scoreboards", () => {
  describe("when navigating to the matched tab of my bets page with 3 markets", () => {
    beforeAll(async () => {
      await setup({ isUnmatched: false });
      await browser.waitUntilEquals(segmentedControlSO.selectedOptionText, "Matched");
    });

    it("[PRPI-3615] the match odds market should display the scoreboard with home/away selections", async () => {
      expect(await firstBetCardHeaderSO.element.isDisplayed()).toBe(true);

      const homeTeam = new TeamSO(firstBetCardHeaderSO.homeTeam);
      expect(await homeTeam.name.getText()).toBe("Stuttgart");

      const awayTeam = new TeamSO(firstBetCardHeaderSO.awayTeam);
      expect(await awayTeam.name.getText()).toBe("Celtic");
    });

    it("[PRPI-3616] the horse racing market should display the scoreboard with the race and venue name", async () => {
      expect(await secondBetCardHeaderSO.element.isDisplayed()).toBe(true);
      expect(await secondBetCardHeaderSO.meetingTime.getText()).toBe("13:40");
      expect(await secondBetCardHeaderSO.meetingName.getText()).toBe("Aintree");
    });

    describe("when the user scrolls to the outright market", () => {
      beforeAll(async () => {
        await swipeUp();
        await browser.waitUntilDisplayed(thirdBetCardHeaderSO.element, "Outrights market header not visible");
        await browser.waitUntilDisplayed(footerSO.element, "Footer not visible");
      });

      it("[PRPI-3617] the outright market should display the scoreboard with event name", async () => {
        expect(await thirdBetCardHeaderSO.element.isDisplayed()).toBe(true);

        const teamSO = new TeamSO(thirdBetCardHeaderSO.element);
        expect(await teamSO.name.getText()).toBe("English Sky Bet Championship");
      });
    });
  });

  describe("when navigating to the unmatched tab of my bets page with 3 markets", () => {
    beforeAll(async () => {
      await setup({ isUnmatched: true, shouldTerminateAppBeforeStart: true });
      await browser.waitUntilEquals(segmentedControlSO.selectedOptionText, "Unmatched");
    });

    it("[PRPI-3618] the match odds market should display the scoreboard with home/away selections", async () => {
      expect(await firstBetCardHeaderSO.element.isDisplayed()).toBe(true);

      const homeTeam = new TeamSO(firstBetCardHeaderSO.homeTeam);
      expect(await homeTeam.name.getText()).toBe("Stuttgart");

      const awayTeam = new TeamSO(firstBetCardHeaderSO.awayTeam);
      expect(await awayTeam.name.getText()).toBe("Celtic");
    });

    it("[PRPI-3619] the horse racing market should display the scoreboard with the race and venue name", async () => {
      expect(await secondBetCardHeaderSO.element.isDisplayed()).toBe(true);
      expect(await secondBetCardHeaderSO.meetingTime.getText()).toBe("13:40");
      expect(await secondBetCardHeaderSO.meetingName.getText()).toBe("Aintree");
    });

    describe("when the user scrolls to the outright market", () => {
      beforeAll(async () => {
        await swipeUp();
        await browser.waitUntilDisplayed(thirdBetCardHeaderSO.element, "Outrights market header not visible");
        await browser.waitUntilDisplayed(footerSO.element, "Footer not visible");
      });

      it("[PRPI-3620] the outright market should display the scoreboard with event name", async () => {
        expect(await thirdBetCardHeaderSO.element.isDisplayed()).toBe(true);

        const teamSO = new TeamSO(thirdBetCardHeaderSO.element);
        expect(await teamSO.name.getText()).toBe("English Sky Bet Championship");
      });
    });
  });
});
