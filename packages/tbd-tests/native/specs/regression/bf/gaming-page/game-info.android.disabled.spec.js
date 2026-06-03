const { getGamingLayout, getGameLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { swipeUp } = require("../../utils/gestures");
const { startApp } = require("../../utils/urls");

const MockService = require("../../../helpers/mocking-service");

const {
  GenericScreenSO,
  GamesCardGroupSO,
  BottomBarSO,
  ActionButtonSO,
  GameTileSO,
  GameInfoSO,
} = require("../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const gamesCardGroupSO = new GamesCardGroupSO();
const gameinfoSO = new GameInfoSO();
const actionButtonSO = new ActionButtonSO();
const firstGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[0]);

const FIRST_GAME_TITLE = "Age of Gods";
const SHORT_COPYRIGHT_TEXT = "Entertainment Inc. and Ted Wolf. (s18)";
const FIRST_GAME_BADGE_JACKPOT = 250472.64;
const FIRST_GAME_DESCRIPTION_HEADLINE = "Betfair Live Roulette";

const LONG_GAME_TITLE = "Deal or No Deal: Whats in Your Box Scratchcard";
const LONG_COPYRIGHT_TEXT =
  "THUNDERCATS and all related characters and elements are trademarks of Warner Bros. Entertainment Inc. and © of Warner Bros. Entertainment Inc. and Ted Wolf. (s18)";
const SECOND_GAME_DESCRIPTION_HEADLINE = "Betfair Live Roulette - Betfair Bonus Roulette";

const FIRST_RTP_VALUE = "97.30%";
const SECOND_RTP_VALUE = "93.32% + Jackpot King Promotional Pot RTP";

const REGULAR_BADGE_TEXT = "EXCLUSIVE";
const SEATS_BADGE_FULL = "TABLE FULL - BET BEHIND NOW";
const PLAY_NOW_BUTTON_TITLE = "Play now";

const FIRST_RTP_TEXT = `RTP ${FIRST_RTP_VALUE}`;
const SECOND_RTP_TEXT = `RTP ${SECOND_RTP_VALUE}`;

const BFF_REGULATORY_SECTION = {
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

const BFF_GAMING_VIEW_GRID = {
  __typename: "GamingView",
  urn: `ppb:tbd:view:gaming:1`,
  title: "",
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:curated/3",
        cardGroupTitle: null,
        defaultLayout: "GRID_TWO_COLUMNS",
        layouts: ["GRID_TWO_COLUMNS"],
        viewAll: null,
        full: {
          edges: [
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
                game: {
                  urn: "ppb:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
                    viewUrl: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
                  },
                  name: "Placeholder",
                  launchId: "age-of-the-gods-god-of-storms-cptn",
                  rgsCodeMobile: "aeolus",
                  jackpotLogo: null,
                  feedData: null,
                  copyrightText: null,
                  customBackgroundColor: "#744943",
                  backgroundColor: null,
                  label: null,
                  provider: {
                    name: "Playtech - NGM",
                    uid: "pt-ngm",
                  },
                  mainProduct: "casino",
                  flattened: {
                    small: {
                      url: null,
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: null,
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },

                  rtp: "95.15%",
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/age-of-the-gods-god-of-storms-cptn" },
            },
          ],
        },
      },
    },
  ],
};

const BFF_FIRST_GAME_VIEW = {
  __typename: "GameView",
  urn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
  url: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
  edges: [
    {
      node: {
        __typename: "GameInfoCard",
        urn: "ppb:tbd:card:gaming:gameInfo:uid/age-of-the-gods-god-of-storms-cptn",
        game: {
          urn: "ppb:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
          viewLink: {
            viewUrn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
            viewUrl: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
          },
          name: FIRST_GAME_TITLE,
          launchId: "age-of-the-gods-god-of-storms-cptn",
          rgsCodeMobile: "rol",
          jackpotLogo: null,
          feedData: {
            jackpot: FIRST_GAME_BADGE_JACKPOT,
            availableSeats: null,
            lastNumbers: null,
            physicalTableId: "104677",
            aliasTableNames: null,
          },
          copyrightText: SHORT_COPYRIGHT_TEXT,
          customBackgroundColor: null,
          backgroundColor: "goldenrod - brown",
          label: "JACKPOT",
          provider: {
            name: "Playtech - Live",
            uid: "pt-live",
          },
          mainProduct: "casino",
          flattened: {
            small: {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 225,
                height: 225,
              },
            },
            medium: {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 450,
                height: 450,
              },
            },
          },
          description: {
            headline: FIRST_GAME_DESCRIPTION_HEADLINE,
            content: [
              {
                type: "paragraph",
                text: "Play Live Roulette online for real money on Betfair Casino",
                spans: [],
              },
              {
                type: "paragraph",
                text: "For the smallest possible house edge in Roulette, be sure to try out Playtech's Live Single Zero Roulette and French Roulette tables. With only a single green zero on the wheel rather than two zeros like American Roulette, you're reducing the edge in favour of you, the player.",
                spans: [],
              },
              {
                type: "paragraph",
                text: "Better still, thanks to Playtech's hugely engaging live streaming technology, you can enjoy a bricks-and-mortar casino experience with real-time Live Roulette action streamed directly to your device. You'll be able to interact with your professionally trained dealer and see and hear the action unfold, just like you would in an actual casino.",
                spans: [],
              },
              {
                type: "heading2",
                text: "Live Roulette game features",
                spans: [],
              },
              {
                type: "list-item",
                text: "Real-time live roulette      action",
                spans: [],
              },
              {
                type: "list-item",
                text: "Autoplay function      available",
                spans: [],
              },
              {
                type: "list-item",
                text: "La Partage rule included      on French Roulette tables",
                spans: [],
              },
              {
                type: "list-item",
                text: "RTP: 97.30% (Live Single      Zero Roulette) & 98.65% (Live French Roulette)",
                spans: [],
              },
              {
                type: "list-item",
                text: "Software provider:      Playtech",
                spans: [],
              },
              {
                type: "heading2",
                text: "How to play Live Roulette",
                spans: [],
              },
              {
                type: "paragraph",
                text: "Whenever you log in for a game of Live Roulette, you'll be given a timeframe with which to bet on the next spin of the wheel. You will have access to a Racetrack panel and Special bets panel, allowing you to make bets on wheel numbers, side bet positions as well as any neighbours bets.",
                spans: [],
              },
              {
                type: "paragraph",
                text: "If you want to bet consistently on the same numbers for each spin, you can always set up the Autoplay function. Hit the 'Start' button on the Autoplay button and select how many rounds you wish to automatically play.",
                spans: [],
              },
              {
                type: "paragraph",
                text: "Remember, if you choose to play a Live French Roulette table, you get the chance to receive half of your stake back in the event in which the ball lands on the green zero pocket, providing you did not bet on it. This is commonly known as the La Partage rule.",
                spans: [],
              },
              {
                type: "heading2",
                text: "Live Roulette return to player (RTP)",
                spans: [],
              },
              {
                type: "paragraph",
                text: "Give yourself the best possible chance of winning by playing at our Live Single Zero Roulette tables today. With RTPs starting from 97.30% and going up to 98.65% for Live French Roulette, you can get way more bang for your buck with Betfair Casino.",
                spans: [],
              },
              {
                type: "paragraph",
                text: "If you enjoy the thrill of live dealer casino games, be sure to check out the all-new Live Quantum Roulette tables too!",
                spans: [],
              },
            ],
          },
          rtp: FIRST_RTP_VALUE,
        },
      },
    },
    BFF_REGULATORY_SECTION,
  ],

  pageInfo: null,
};

const BFF_SECOND_GAME_VIEW = {
  __typename: "GameView",
  urn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
  url: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
  edges: [
    {
      node: {
        __typename: "GameInfoCard",
        urn: "ppb:tbd:card:gaming:gameInfo:uid/betfair-live-roulette-cptl",
        game: {
          urn: "ppb:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
          viewLink: {
            viewUrn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
            viewUrl: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
          },
          name: LONG_GAME_TITLE,
          launchId: "betfair-live-roulette-cptl",
          rgsCodeMobile: "rol",
          jackpotLogo: null,
          feedData: {
            jackpot: null,
            availableSeats: "0",
            lastNumbers: null,
            physicalTableId: "104677",
            aliasTableNames: null,
          },
          copyrightText: LONG_COPYRIGHT_TEXT,
          customBackgroundColor: null,
          backgroundColor: "goldenrod - brown",
          label: null,
          provider: {
            name: "Playtech - Live",
            uid: "pt-live",
          },
          mainProduct: "casino",
          flattened: {
            small: {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 225,
                height: 225,
              },
            },
            medium: {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 450,
                height: 450,
              },
            },
          },
          description: {
            headline: SECOND_GAME_DESCRIPTION_HEADLINE,
            content: [
              {
                type: "paragraph",
                text: "",
                spans: [],
              },
            ],
          },
          rtp: SECOND_RTP_VALUE,
        },
      },
    },
    BFF_REGULATORY_SECTION,
  ],

  pageInfo: null,
};

const BFF_THIRD_GAME_VIEW = {
  __typename: "GameView",
  urn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
  url: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
  edges: [
    {
      node: {
        __typename: "GameInfoCard",
        urn: "ppb:tbd:card:gaming:gameInfo:uid/betfair-live-roulette-cptl",
        game: {
          urn: "ppb:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
          viewLink: {
            viewUrn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
            viewUrl: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
          },
          name: LONG_GAME_TITLE,
          launchId: "betfair-live-roulette-cptl",
          rgsCodeMobile: "rol",
          jackpotLogo: null,
          feedData: {
            jackpot: null,
            availableSeats: null,
            lastNumbers: [
              {
                number: 1,
                color: "RED",
              },
              {
                number: 2,
                color: "BLACK",
              },
              {
                number: 0,
                color: "GREEN",
              },
              {
                number: 35,
                color: "BLACK",
              },
              {
                number: 36,
                color: "RED",
              },
              {
                number: 30,
                color: "RED",
              },
              {
                number: 28,
                color: "BLACK",
              },
              {
                number: 29,
                color: "BLACK",
              },
            ],

            physicalTableId: "104677",
            aliasTableNames: null,
          },
          copyrightText: null,
          customBackgroundColor: null,
          backgroundColor: "goldenrod - brown",
          label: null,
          provider: {
            name: "Playtech - Live",
            uid: "pt-live",
          },
          mainProduct: "casino",
          flattened: {
            small: {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 225,
                height: 225,
              },
            },
            medium: {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 450,
                height: 450,
              },
            },
          },
          description: {
            headline: SECOND_GAME_DESCRIPTION_HEADLINE,
            content: [
              {
                type: "paragraph",
                text: "",
                spans: [],
              },
            ],
          },
          rtp: SECOND_RTP_VALUE,
        },
      },
    },
    BFF_REGULATORY_SECTION,
  ],

  pageInfo: null,
};

const BFF_FOURTH_GAME_VIEW = {
  __typename: "GameView",
  urn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
  url: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
  edges: [
    {
      node: {
        __typename: "GameInfoCard",
        urn: "ppb:tbd:card:gaming:gameInfo:uid/betfair-live-roulette-cptl",
        game: {
          urn: "ppb:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
          viewLink: {
            viewUrn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
            viewUrl: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
          },
          name: LONG_GAME_TITLE,
          launchId: "betfair-live-roulette-cptl",
          rgsCodeMobile: "rol",
          jackpotLogo: null,
          feedData: null,
          copyrightText: SHORT_COPYRIGHT_TEXT,
          customBackgroundColor: null,
          backgroundColor: "goldenrod - brown",
          label: REGULAR_BADGE_TEXT,
          provider: {
            name: "Playtech - Live",
            uid: "pt-live",
          },
          mainProduct: "casino",
          flattened: {
            small: {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 225,
                height: 225,
              },
            },
            medium: {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 450,
                height: 450,
              },
            },
          },
          description: {
            headline: SECOND_GAME_DESCRIPTION_HEADLINE,
            content: [
              {
                type: "paragraph",
                text: "",
                spans: [],
              },
            ],
          },
          rtp: SECOND_RTP_VALUE,
        },
      },
    },
    BFF_REGULATORY_SECTION,
  ],

  pageInfo: null,
};

const BFF_FIFTH_GAME_VIEW = {
  __typename: "GameView",
  urn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
  url: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
  edges: [
    {
      node: {
        __typename: "GameInfoCard",
        urn: "ppb:tbd:card:gaming:gameInfo:uid/betfair-live-roulette-cptl",
        game: {
          urn: "ppb:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
          viewLink: {
            viewUrn: "ppb:tbd:view:game:age-of-the-gods-god-of-storms-cptn",
            viewUrl: "casino/game/age-of-the-gods-god-of-storms-cptn/game:age-of-the-gods-god-of-storms-cptn",
          },
          name: LONG_GAME_TITLE,
          launchId: "betfair-live-roulette-cptl",
          rgsCodeMobile: "rol",
          jackpotLogo: null,
          feedData: null,
          copyrightText: LONG_COPYRIGHT_TEXT,
          customBackgroundColor: null,
          backgroundColor: "goldenrod - brown",
          label: null,
          provider: {
            name: "Playtech - Live",
            uid: "pt-live",
          },
          mainProduct: "casino",
          flattened: {
            small: {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 225,
                height: 225,
              },
            },
            medium: {
              url: "http://example.test.com/mockedImage/image.png",
              alt: null,
              dimensions: {
                width: 450,
                height: 450,
              },
            },
          },
          description: {
            headline: SECOND_GAME_DESCRIPTION_HEADLINE,
            content: [
              {
                type: "paragraph",
                text: "",
                spans: [],
              },
            ],
          },
          rtp: SECOND_RTP_VALUE,
        },
      },
    },
    BFF_REGULATORY_SECTION,
  ],

  pageInfo: null,
};

describe("GameInfo view", () => {
  describe("When user taps on GameInfo button on game with jackpot", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_GRID));
      await startApp("home");

      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(firstGameTileSO.gameTileInfo);
      await firstGameTileSO.gameTileInfo.click();
      await mockService.mockHttpRequest(getGameLayout(BFF_FIRST_GAME_VIEW));
      await browser.waitUntilDisplayed(gameinfoSO.element);
    });

    it("[PRPI-2682] GameInfo view should be displayed", async () => {
      expect(await gameinfoSO.element.isDisplayed()).toBe(true);
    });

    it("[PRPI-2683] GameInfo view should have game title 'Age of Gods'", async () => {
      expect(await gameinfoSO.gameInfoGameTitle.getText()).toBe(FIRST_GAME_TITLE.toUpperCase());
    });

    it("[PRPI-2684] GameInfo view should have RTP", async () => {
      expect(await gameinfoSO.gameInfoGameRtp.getText()).toBe(FIRST_RTP_TEXT);
    });

    it("[PRPI-2685] GameInfo view should have copyright text", async () => {
      expect(await gameinfoSO.gameInfoCopyrightText.isDisplayed()).toBe(true);
      expect(await gameinfoSO.gameInfoCopyrightText.getText()).toBe(SHORT_COPYRIGHT_TEXT);
    });

    it("[PRPI-2686] GameInfo view should have Jackpot badge", async () => {
      const gameInfoBadge = gameinfoSO.gameInfoJackpotBadgeValue;
      const gameInfoBadgeText = await gameInfoBadge.getText();

      expect(await gameInfoBadge.isDisplayed()).toBe(true);
      expect(gameInfoBadgeText.substring(1).replace(",", "")).toBeGreaterThanOrEqual(FIRST_GAME_BADGE_JACKPOT);
    });

    it("[PRPI-2687] GameInfo view should have description headline text", async () => {
      expect(await gameinfoSO.gameInfoDescriptionHeadline.isDisplayed()).toBe(true);
      expect(await gameinfoSO.gameInfoDescriptionHeadline.getText()).toBe(FIRST_GAME_DESCRIPTION_HEADLINE);
    });

    it("[PRPI-2688] GameInfo view should have description text", async () => {
      expect(await gameinfoSO.gameInfoDescriptionText.isDisplayed()).toBe(true);
    });

    it("[PRPI-2689] GameInfo view should have 'Play Now' button", async () => {
      expect(await actionButtonSO.element.isDisplayed()).toBe(true);
      expect(await actionButtonSO.label.getText()).toBe(PLAY_NOW_BUTTON_TITLE);
    });

    it("[PRPI-2690] GameInfo view should have bottom bar", async () => {
      expect(await BottomBarSO.home.isDisplayed()).toBe(true);
    });

    // TODO: add jackpot logo check when logo is implemented
  });

  describe("When user taps on GameInfo button on game with seats", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_GRID));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(firstGameTileSO.gameTileInfo);
      await firstGameTileSO.gameTileInfo.click();
      await mockService.mockHttpRequest(getGameLayout(BFF_SECOND_GAME_VIEW));
      await browser.waitUntilDisplayed(gameinfoSO.element);
    });

    it("[PRPI-2691] GameInfo view should have game title", async () => {
      expect(await gameinfoSO.gameInfoGameTitle.getText()).toBe(LONG_GAME_TITLE.toUpperCase());
    });

    it("[PRPI-2692] GameInfo view should have RTP", async () => {
      expect(await gameinfoSO.gameInfoGameRtp.getText()).toBe(SECOND_RTP_TEXT);
    });

    it("[PRPI-2693] GameInfo view should have copyright text", async () => {
      expect(await gameinfoSO.gameInfoCopyrightText.isDisplayed()).toBe(true);
      expect(await gameinfoSO.gameInfoCopyrightText.getText()).toBe(LONG_COPYRIGHT_TEXT);
    });

    it("[PRPI-2694] GameInfo view should have Seats badge", async () => {
      expect(await gameinfoSO.gameInfoBadgeContainer.isDisplayed()).toBe(true);
      expect(await gameinfoSO.gameInfoBadgeText.getText()).toBe(SEATS_BADGE_FULL);
    });

    it("[PRPI-2695] GameInfo view should have description headline text", async () => {
      expect(await gameinfoSO.gameInfoDescriptionHeadline.isDisplayed()).toBe(true);
      expect(await gameinfoSO.gameInfoDescriptionHeadline.getText()).toBe(SECOND_GAME_DESCRIPTION_HEADLINE);
    });

    it("[PRPI-2696] GameInfo view should have 'Play Now' button", async () => {
      expect(await actionButtonSO.element.isDisplayed()).toBe(true);
      expect(await actionButtonSO.label.getText()).toBe(PLAY_NOW_BUTTON_TITLE);
    });

    // TODO: add jackpot logo check when logo is implemented
  });

  describe("When user taps on GameInfo button on game with roulette numbers", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_GRID));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(firstGameTileSO.gameTileInfo);
      await firstGameTileSO.gameTileInfo.click();
      await mockService.mockHttpRequest(getGameLayout(BFF_THIRD_GAME_VIEW));
      await browser.waitUntilDisplayed(gameinfoSO.element);
    });

    it("[PRPI-2697] GameInfo view should have game title", async () => {
      expect(await gameinfoSO.gameInfoGameTitle.getText()).toBe(LONG_GAME_TITLE.toUpperCase());
    });

    it("[PRPI-2698] GameInfo view should have RTP", async () => {
      expect(await gameinfoSO.gameInfoGameRtp.getText()).toBe(SECOND_RTP_TEXT);
    });

    it("[PRPI-2699] GameInfo view should not have copyright text", async () => {
      expect(await gameinfoSO.gameInfoCopyrightText.isDisplayed()).toBe(false);
    });

    it("[PRPI-2700] GameInfo view should have Roulette badge with numbers: 1 2 0 35 36 30 28 29", async () => {
      expect(await gameinfoSO.gameInfoBadgeRouletteNumbersContainer.isDisplayed()).toBe(true);
      expect(await gameinfoSO.gameInfoBadgeRouletteNumbersList.length).toBe(8);
      expect(await gameinfoSO.gameInfoBadgeRouletteNumbersList[0].getText()).toEqual("1");
      expect(await gameinfoSO.gameInfoBadgeRouletteNumbersList[1].getText()).toEqual("2");
      expect(await gameinfoSO.gameInfoBadgeRouletteNumbersList[2].getText()).toEqual("0");
      expect(await gameinfoSO.gameInfoBadgeRouletteNumbersList[3].getText()).toEqual("35");
      expect(await gameinfoSO.gameInfoBadgeRouletteNumbersList[4].getText()).toEqual("36");
      expect(await gameinfoSO.gameInfoBadgeRouletteNumbersList[5].getText()).toEqual("30");
      expect(await gameinfoSO.gameInfoBadgeRouletteNumbersList[6].getText()).toEqual("28");
      expect(await gameinfoSO.gameInfoBadgeRouletteNumbersList[7].getText()).toEqual("29");
    });

    it("[PRPI-2701] GameInfo view should have 'Play Now' button", async () => {
      expect(await actionButtonSO.element.isDisplayed()).toBe(true);
      expect(await actionButtonSO.label.getText()).toBe(PLAY_NOW_BUTTON_TITLE);
    });
    // TODO: add jackpot logo check when logo is implemented
  });

  describe("When user taps on GameInfo button on game with regular badge", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_GRID));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(firstGameTileSO.gameTileInfo);
      await firstGameTileSO.gameTileInfo.click();
      await mockService.mockHttpRequest(getGameLayout(BFF_FOURTH_GAME_VIEW));
      await browser.waitUntilDisplayed(gameinfoSO.element);
    });

    it("[PRPI-2702] GameInfo view should have game title", async () => {
      expect(await gameinfoSO.gameInfoGameTitle.getText()).toBe(LONG_GAME_TITLE.toUpperCase());
    });

    it("[PRPI-2703] GameInfo view should have RTP", async () => {
      expect(await gameinfoSO.gameInfoGameRtp.getText()).toBe(SECOND_RTP_TEXT);
    });

    it("[PRPI-2704] GameInfo view should have copyright text", async () => {
      expect(await gameinfoSO.gameInfoCopyrightText.isDisplayed()).toBe(true);
      expect(await gameinfoSO.gameInfoCopyrightText.getText()).toBe(SHORT_COPYRIGHT_TEXT);
    });

    it("[PRPI-2705] GameInfo view should have regular badge", async () => {
      expect(await gameinfoSO.gameInfoBadgeContainer.isDisplayed()).toBe(true);
      expect(await gameinfoSO.gameInfoBadgeText.getText()).toBe(REGULAR_BADGE_TEXT);
    });

    it("[PRPI-2706] GameInfo view should have 'Play Now' button", async () => {
      expect(await actionButtonSO.element.isDisplayed()).toBe(true);
      expect(await actionButtonSO.label.getText()).toBe(PLAY_NOW_BUTTON_TITLE);
    });
    // TODO: add jackpot logo check when logo is implemented
  });

  describe("When user taps on GameInfo button on game without badge", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_GRID));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(firstGameTileSO.gameTileInfo);
      await firstGameTileSO.gameTileInfo.click();
      await mockService.mockHttpRequest(getGameLayout(BFF_FIFTH_GAME_VIEW));
      await browser.waitUntilDisplayed(gameinfoSO.element);
    });

    it("[PRPI-2707] GameInfo view should have game title", async () => {
      expect(await gameinfoSO.gameInfoGameTitle.getText()).toBe(LONG_GAME_TITLE.toUpperCase());
    });

    it("[PRPI-2708] GameInfo view should have RTP", async () => {
      expect(await gameinfoSO.gameInfoGameRtp.getText()).toBe(SECOND_RTP_TEXT);
    });

    it("[PRPI-2709] GameInfo view should have copyright text", async () => {
      expect(await gameinfoSO.gameInfoCopyrightText.isDisplayed()).toBe(true);
      expect(await gameinfoSO.gameInfoCopyrightText.getText()).toBe(LONG_COPYRIGHT_TEXT);
    });

    it("[PRPI-2710] GameInfo view should not have badge", async () => {
      expect(await gameinfoSO.gameInfoBadgeContainer.isDisplayed()).toBe(false);
    });

    it("[PRPI-2711] GameInfo view should have 'Play Now' button", async () => {
      expect(await actionButtonSO.element.isDisplayed()).toBe(true);
      expect(await actionButtonSO.label.getText()).toBe(PLAY_NOW_BUTTON_TITLE);
    });
    // TODO: add jackpot logo check when logo is implemented
  });

  describe("When user swipes up on GameInfo view", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_GRID));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(firstGameTileSO.gameTileInfo);
      await firstGameTileSO.gameTileInfo.click();
      await mockService.mockHttpRequest(getGameLayout(BFF_FIRST_GAME_VIEW));
      await browser.waitUntilDisplayed(gameinfoSO.element);
      await swipeUp(0.7);
    });

    it("[PRPI-2712] GameInfo view should still display 'Play Now' button", async () => {
      expect(await actionButtonSO.element.isDisplayed()).toBe(true);
      expect(await actionButtonSO.label.getText()).toBe(PLAY_NOW_BUTTON_TITLE);
    });
  });
});
