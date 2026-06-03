const { getMarketPrices } = require("@flutter-global/uki-channels-http-clients/mock-index").SMP;
const {
  getAppContext,
  getMarketLayout,
  getHomeLayoutWithViewLink,
} = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const MockService = require("../../../../../mock-essentials/mocking-service");
const { startApp } = require("../../../../../helpers/urls");
const { getStartViewLink } = require("../../../../../helpers/view-link-start");
const { swipeToBottom } = require("../../../../../helpers/gestures");

const { CardSO, AvBFixtureSO } = require("../../../../../screen-objects");

const mockService = new MockService();
const firstCardSO = new CardSO();
const SPORTSBOOK_MARKET_ID = "924.222615412";
const URN = `ppb:tbd:view:market:${SPORTSBOOK_MARKET_ID}`;
const avbFixtureSO = new AvBFixtureSO();

const SMP_MOCK = {
  markets: [
    {
      marketId: SPORTSBOOK_MARKET_ID,
      runnerDetails: [
        {
          selectionId: 3,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 5.0 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 2,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 2.4 },
          },
          runnerStatus: "ACTIVE",
        },
        {
          selectionId: 1,
          runnerOdds: {
            decimalDisplayOdds: { decimalOdds: 1.4 },
          },
          runnerStatus: "ACTIVE",
        },
      ],
    },
  ],
};

const FIXTURE_CARD = {
  node: {
    __typename: "FixtureCard",
    urn: "ppb:tbd:card:fixture:2022802",
    away: "Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
    home: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed",
    sportevent: {
      name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
      openDate: "2010-10-14T18:45Z",
      urn: "ppb:event:2022802",
      __typename: "SportsEvent",
      competition: {
        urn: "ppb:competition:12345",
        name: "English Premier League",
      },
    },
    fixture: {
      __typename: "BaseFixture",
      sportevent: {
        name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
        openDate: "2010-10-14T18:45Z",
        urn: "ppb:event:2022802",
        __typename: "SportsEvent",
        competition: {
          urn: "ppb:competition:12345",
          name: "English Premier League",
        },
      },
      mainMarket: {},
    },
  },
};

const SPORTSBOOK_MARKET = {
  __typename: "SportsbookMarket",
  urn: `ppb:sbkMarket:${SPORTSBOOK_MARKET_ID}`,
  name: "Premier League Winner 2022/23",
  marketType: "WINNER",
  bettingType: "ODDS",
  hierarchy: {
    __typename: "EventCompetitionHierarchy",
    sportevent: {
      name: "Arsenal Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed v Chelsea Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed consectetur adipiscing elit, sed",
      openDate: "2010-10-14T18:45Z",
      urn: "ppb:event:2022802",
      __typename: "SportsEvent",
      competition: {
        urn: "ppb:competition:12345",
        name: "English Premier League",
      },
    },
    competition: {
      urn: "ppb:competition:12345",
      name: "English Premier League",
    },
  },
  sport: {
    __typename: "Sport",
    urn: "ppb:eventType:1",
    name: "Football",
    sportId: 1,
  },
  runners: [
    {
      runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/1`,
      name: "Benfica",
      selectionId: 1,
    },
    {
      runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/2`,
      name: "Liverpool",
      selectionId: 2,
    },
    {
      runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/3`,
      name: "Petrol FC",
      selectionId: 3,
    },
  ],
};

const MARKET_EXTENDED_CARD = {
  node: {
    __typename: "MarketExtendedCard",
    urn: `ppb:tbd:card:marketExtended:${SPORTSBOOK_MARKET_ID}|false`,
    cardTitle: "Premier League Winner 2022/23",
    displayRunners: {
      sportsbook: {
        market: SPORTSBOOK_MARKET,
        runners: [
          { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/1` },
          { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/2` },
          { runnerURN: `ppb:sbkRunner:${SPORTSBOOK_MARKET_ID}/3` },
        ],
      },
    },
    runnerViewLinks: [],
  },
};

const FOOTER = {
  node: {
    urn: "ppb:tbd:card:regulatory:footer",
    __typename: "RegulatoryCard",
    sections: [
      {
        __typename: "RegulatorySectionGeneric",
        sectionType: "GENERIC",
        genericSectionTitle: null,
        items: [
          {
            __typename: "RegulatoryTextItem",
            alignment: "LEFT",
            text: "Warning: Live scores and other data on this site is sourced from third party feeds and may be subject to time delays and/or be innaccurate. Other customer may have access to faster or more accurate data. If you rely on this data to place bets, you do so at your own risk. Betfair does not accept responsibility for loss suffered as a result of reliance on this data.",
          },
        ],
      },
      {
        __typename: "RegulatorySectionGeneric",
        sectionType: "GENERIC",
        genericSectionTitle: "Safer Gambling",
        items: [
          {
            __typename: "RegulatoryImageItem",
            imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/over18.png",
            alignment: "LEFT",
            alt: null,
            target: "POPUP",
            link: "https://content.betfair.com/misc/?product=portal&sWhichKey=gamCare&locale=en_GB&region=GBR&brand=betfair&entrydomain=betfair.com",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl:
                "https://content.betfair.com/misc/?product=portal&sWhichKey=gamCare&locale=en_GB&region=GBR&brand=betfair&entrydomain=betfair.com",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/gamblingTherapy.png",
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.gamblingtherapy.org/en",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.gamblingtherapy.org/en",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/gamCareNew.png",
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.gamcare.org.uk/",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.gamcare.org.uk/",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/gamStop.png",
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.gamstop.co.uk/",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.gamstop.co.uk/",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL:
              "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/saferGamblingStandard.png",
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.safergamblingstandard.org.uk/accredited-businesses",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.safergamblingstandard.org.uk/accredited-businesses",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/beGambleAwareWhite.png",
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.begambleaware.org/",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.begambleaware.org/",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "Gambling can be addictive, please play responsibly. Find out more about safer gambling",
            url: "https://responsiblegambling.betfair.com/",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://responsiblegambling.betfair.com/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "Player Protection Tools",
            url: "https://myaccount.betfair.com/playerprotection",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://myaccount.betfair.com/playerprotection",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
        ],
      },
      {
        __typename: "RegulatorySectionGeneric",
        sectionType: "GENERIC",
        genericSectionTitle: "Licensing",
        items: [
          {
            __typename: "RegulatoryImageItem",
            imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/lgaMalta.png",
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.authorisation.mga.org.mt/verification.aspx?lang=en&company=4f2ce9bc-6584-440c-8643-9314defffd0e",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl:
                "https://www.authorisation.mga.org.mt/verification.aspx?lang=en&company=4f2ce9bc-6584-440c-8643-9314defffd0e",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryImageItem",
            imageURL: "https://assets.cdnppb.net/ssc/intl/ALL_REGIONS/en/ALL_TRUEVALUES/footer/gamblingCommission.png",
            alignment: "LEFT",
            alt: null,
            target: "BLANK",
            link: "https://www.gamblingcommission.gov.uk/",
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://www.gamblingcommission.gov.uk/",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryTextItem",
            alignment: "LEFT",
            text: "PPB Counterparty Services Limited, having its registered address at Triq il-Kappillan Mifsud, St. Venera, SVR 1851, MALTA, is licensed and regulated by the Malta Gaming Authority under Licence Number MGA/CRP/131/2006 (issued on 01 August 2018).",
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "Malta Gaming Authority",
            url: "https://www.mga.org.mt/",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://www.mga.org.mt/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryTextItem",
            alignment: "LEFT",
            text: "For customers in Great Britain, the entities below are licensed and regulated by the Gambling Comission.",
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "PPB Counterparty Services Limited (39439)",
            url: "https://registers.gamblingcommission.gov.uk/39439",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://registers.gamblingcommission.gov.uk/39439",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "Betfair Casino Limited (39435)",
            url: "https://registers.gamblingcommission.gov.uk/39435",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://registers.gamblingcommission.gov.uk/39435",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "PPB Entertainment Limited (39426)",
            url: "https://registers.gamblingcommission.gov.uk/39426",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://registers.gamblingcommission.gov.uk/39426",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "Further Regulatory Information",
            url: "https://www.betfair.com/aboutUs/Regulatory.Information/",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://www.betfair.com/aboutUs/Regulatory.Information/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
        ],
      },
      {
        __typename: "RegulatorySectionAccordion",
        sectionType: "ACCORDION",
        title: "Policies and Assistance",
        items: [
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "Help & Contact",
            url: "https://support.betfair.com/app/home/",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://support.betfair.com/app/home/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "Terms & Conditions",
            url: "https://www.betfair.com/en/aboutUs/Terms.and.Conditions/",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://www.betfair.com/en/aboutUs/Terms.and.Conditions/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "Privacy Policy",
            url: "https://www.betfair.com/en/aboutUs/Privacy.Policy/",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://www.betfair.com/en/aboutUs/Privacy.Policy/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "Cookie Policy",
            url: "https://www.betfair.com/aboutUs/Cookie.Policy/",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://www.betfair.com/aboutUs/Cookie.Policy/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "Resolve a Dispute",
            url: "https://www.betfair.com/en/aboutUs/Dispute.Resolution/",
            target: "POPUP",
            viewLink: {
              viewUrl: "https://www.betfair.com/en/aboutUs/Dispute.Resolution/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
          {
            __typename: "RegulatoryLinkItem",
            alignment: "LEFT",
            text: "Rules & Regulations",
            url: "https://www.betfair.com/en/aboutUs/Rules.and.Regulations/",
            target: "BLANK",
            viewLink: {
              viewUrl: "https://www.betfair.com/en/aboutUs/Rules.and.Regulations/",
              viewUrn: "ppb:tbd:view:external:external",
              viewDisplayMode: "BLANK_INAPP",
            },
          },
        ],
      },
    ],
  },
};

const BFF_MOCK = {
  urn: URN,
  mainMarket: SPORTSBOOK_MARKET,
  edges: [FIXTURE_CARD, MARKET_EXTENDED_CARD, FOOTER],
};

const MODULE_NAME = "base_fixture";

describe("Base Fixture", () => {
  describe("when the event name is longer than two lines", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getAppContext({}));
      await mockService.mockHttpRequest(getMarketLayout(SPORTSBOOK_MARKET_ID));
      await mockService.mockHttpRequest(getMarketPrices(SMP_MOCK));
      await mockService.mockHttpRequest(getMarketLayout(BFF_MOCK));

      const HOME_VIEW_LINK = getStartViewLink(`sport/competition/market/mwe-${SPORTSBOOK_MARKET_ID}`);
      await mockService.mockHttpRequest(getHomeLayoutWithViewLink(HOME_VIEW_LINK));

      await startApp("home", { isViewLinkStartPage: !!HOME_VIEW_LINK });

      await firstCardSO.element.waitForExist();

      await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4603]_should_display_full_event_name`);
    });

    it("[PRPI-4603]_should_display_full_event_name", async () => {
      expect(
        (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4603]_should_display_full_event_name`)).misMatchPercentage,
      ).toBe(0);
    });

    describe("and then when scrolling and the event header becomes sticky", () => {
      beforeAll(async () => {
        await swipeToBottom();
        await browser.waitUntilStopsMoving(avbFixtureSO.element);
        await browser.waitUntilImageEquals(`${MODULE_NAME}_[PRPI-4604]_should_display_event_name_with_ellipsis`);
      });

      it("[PRPI-4604]_should_display_event_name_with_ellipsis", async () => {
        expect(
          (await browser.compareScreen(`${MODULE_NAME}_[PRPI-4604]_should_display_event_name_with_ellipsis`))
            .misMatchPercentage,
        ).toBe(0);
      });
    });
  });
});
