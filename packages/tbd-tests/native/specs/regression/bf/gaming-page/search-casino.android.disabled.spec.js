const { getBrowseLayout, getCardResults } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getSearchGamesResponse } = require("@ppb/tbd-shared/mocks/search-games/search-games.controller");
const { getMockedImage } = require("@ppb/tbd-shared/mocks/image/image.controller");
const { hideKeyboard } = require("../../../utils/gestures");
const { startApp } = require("../../../utils/urls");

const MockService = require("../../../helpers/mocking-service");

const { GenericScreenSO, BrowseScreenSO, BottomBarSO, SearchBarSO } = require("../../../../screen-objects");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const browseScreenSO = new BrowseScreenSO();
const searchBarSO = new SearchBarSO();

const DEFAULT_SEARCH_FIELD_TEXT = "Search games, providers, live tables";
const DEFAULT_TEXT_UNDER_SEARCH_FIELD = "Out of ideas? Try one of our recommended games:";
const VALID_SEARCH_QUERY = "Mega";
const INVALID_SEARCH_QUERY = "Test1234";
const NUMBER_OF_RESULTS = 3;
const SEARCH_MESSAGE_RESULT = `${NUMBER_OF_RESULTS} results for ‘${VALID_SEARCH_QUERY}’`;
const SEARCH_MESSAGE_NO_RESULT = `No results for '${INVALID_SEARCH_QUERY}', but not to worry, you can always try some of our recommended games:`;

const BFF_BROWSE_VIEW = {
  __typename: "BrowseView",
  urn: `ppb:tbd:view:browse:sports`,
  title: "",
  edges: [
    {
      node: {
        __typename: "QuickLinksCard",
        urn: "ppb:tbd:card:quickLinks:azMenu:sports",
        quickLinksTitle: null,
        links: [
          {
            label: "Football",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:1",
              viewUrl: "football/s-1",
            },
            target: null,
            icon: null,
          },
          {
            label: "Greyhound Racing",
            viewLink: {
              viewUrn: "ppb:tbd:view:sport:4339",
              viewUrl: "greyhound-racing/s-4339",
            },
            target: null,
            icon: null,
          },
        ],

        iconName: null,
      },
    },
  ],

  pageInfo: null,
};

const BFF_BROWSE_VIEW_CASINO = {
  __typename: "BrowseView",
  urn: "ppb:tbd:view:browse:gaming",
  url: "browse/b-gaming",
  edges: [
    {
      node: {
        __typename: "ViewZone",
        urn: "ppb:tbd:gaming:masterConfigElement:multifunctional_module/0",
        title: "Casino Selection",
        viewZoneItems: {
          edges: [
            {
              node: {
                __typename: "GamingCardGroup",
                urn: "ppb:tbd:card:group:gaming:recentlyPlayed:uid/gaming-recently-played",
                cardGroupTitle: "Recently played",
                defaultLayout: "GRID_FOUR_COLUMNS",
                layouts: ["GRID_FOUR_COLUMNS"],
                viewAll: null,
                full: {
                  edges: [
                    {
                      node: {
                        __typename: "GameCard",
                        urn: "ppb:tbd:card:gaming:game:uid/roulette-original-art",
                        game: {
                          urn: "ppb:gaming:game:uid/roulette-original-art",
                          viewLink: {
                            viewUrn: "ppb:tbd:view:game:roulette-original-art",
                            viewUrl: "casino/game/roulette-original-art/game:roulette-original-art",
                          },
                          name: "Roulette Original",
                          launchId: "BF_RTCay_ROPremiumPlus",
                          rgsCodeMobile: "RoulettePremiumPlus",
                          jackpotLogo: null,
                          feedData: null,
                          copyrightText: null,
                          customBackgroundColor: null,
                          backgroundColor: "darkslategray - gray",
                          label: "EXCLUSIVE",
                          provider: {
                            name: "Gaming Platform - Red Tiger",
                            uid: "gp-rt",
                          },
                          mainProduct: "arcade",
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
                            headline: "Roulette Original",
                            content: [],
                          },
                          rtp: "97.3%",
                        },
                      },
                    },
                    {
                      node: {
                        __typename: "GameCard",
                        urn: "ppb:tbd:card:gaming:game:uid/the-goonies-jpk-abp",
                        game: {
                          urn: "ppb:gaming:game:uid/the-goonies-jpk-abp",
                          viewLink: {
                            viewUrn: "ppb:tbd:view:game:the-goonies-jpk-abp",
                            viewUrl: "casino/game/the-goonies-jpk-abp/game:the-goonies-jpk-abp",
                          },
                          name: "The Goonies Jackpot King",
                          launchId: "the-goonies-jpk-abp",
                          rgsCodeMobile: "BP_TheGooniesJK",
                          jackpotLogo: "JACKPOT_KING",
                          feedData: {
                            jackpot: 2618258.43,
                            availableSeats: null,
                            lastNumbers: null,
                            physicalTableId: null,
                            aliasTableNames: null,
                          },
                          copyrightText: "TM & © WBEI (s18)",
                          customBackgroundColor: "#126291",
                          backgroundColor: null,
                          label: "JACKPOT",
                          provider: {
                            name: "Gaming Platform - Blueprint",
                            uid: "gp-bp",
                          },
                          mainProduct: "arcade",
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
                            headline: "The Goonies Jackpot King",
                            content: [],
                          },
                          rtp: "93.06% + Jackpot King Promotional Pot",
                        },
                      },
                    },
                    {
                      node: {
                        __typename: "GameCard",
                        urn: "ppb:tbd:card:gaming:game:uid/ted-abp",
                        game: {
                          urn: "ppb:gaming:game:uid/ted-abp",
                          viewLink: {
                            viewUrn: "ppb:tbd:view:game:ted-abp",
                            viewUrl: "casino/game/ted-abp/game:ted-abp",
                          },
                          name: "Ted",
                          launchId: "BP_Ted",
                          rgsCodeMobile: "BP_Ted",
                          jackpotLogo: null,
                          feedData: null,
                          copyrightText: "TM & © MRC II Distribution Company L.P. All rights reserved.",
                          customBackgroundColor: null,
                          backgroundColor: "mediumpurple - purple",
                          label: null,
                          provider: {
                            name: "Gaming Platform - Blueprint",
                            uid: "gp-bp",
                          },
                          mainProduct: "arcade",
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
                            headline: "Ted",
                            content: [],
                          },
                          rtp: "95.8%",
                        },
                      },
                    },
                    {
                      node: {
                        __typename: "GameCard",
                        urn: "ppb:tbd:card:gaming:game:uid/the-goonies-card-abp",
                        game: {
                          urn: "ppb:gaming:game:uid/the-goonies-card-abp",
                          viewLink: {
                            viewUrn: "ppb:tbd:view:game:the-goonies-card-abp",
                            viewUrl: "casino/game/the-goonies-card-abp/game:the-goonies-card-abp",
                          },
                          name: "The Goonies Scratchcard",
                          launchId: "the-goonies-card-abp",
                          rgsCodeMobile: "BP_TheGooniesScratchcard",
                          jackpotLogo: null,
                          feedData: null,
                          copyrightText: "TM & © WBEI (s18)",
                          customBackgroundColor: "#03080c",
                          backgroundColor: null,
                          label: null,
                          provider: {
                            name: "Gaming Platform - Blueprint",
                            uid: "gp-bp",
                          },
                          mainProduct: "arcade",
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
                            headline: "The Goonies Scratchcard",
                            content: [],
                          },
                          rtp: "80%",
                        },
                      },
                    },
                  ],
                },
                partials: {
                  edges: [
                    {
                      node: {
                        __typename: "GameCard",
                        urn: "ppb:tbd:card:gaming:game:uid/roulette-original-art",
                      },
                    },
                    {
                      node: {
                        __typename: "GameCard",
                        urn: "ppb:tbd:card:gaming:game:uid/the-goonies-jpk-abp",
                      },
                    },
                    {
                      node: {
                        __typename: "GameCard",
                        urn: "ppb:tbd:card:gaming:game:uid/ted-abp",
                      },
                    },
                    {
                      node: {
                        __typename: "GameCard",
                        urn: "ppb:tbd:card:gaming:game:uid/the-goonies-card-abp",
                      },
                    },
                  ],
                },
              },
            },
            {
              node: {
                __typename: "SegmentedCardGroup",
                urn: "ppb:tbd:segmented:card:group:ppb|tbd|card|group|gaming|curated|uid/bfrb-featured-swimlane;ppb|tbd|card|group|gaming|curated|uid/bfrb-new-swimlane;ppb|tbd|card|group|gaming|curated|uid/bfrb-live-casino-swimlane;ppb|tbd|card|group|gaming|curated|uid/bfrb-popular-swimlane;ppb|tbd|card|group|gaming|recommended|uid/gaming-because-you-played",
                full: {
                  edges: [
                    {
                      node: {
                        __typename: "GamingCardGroup",
                        urn: "ppb:tbd:card:group:gaming:curated:uid/bfrb-featured-swimlane",
                        cardGroupTitle: "Featured",
                        defaultLayout: "CARD_LIST",
                        layouts: ["CARD_LIST"],
                        viewAll: null,
                        full: {
                          edges: [
                            {
                              node: {
                                __typename: "GameCard",
                                urn: "ppb:tbd:card:gaming:game:uid/roulette-original-art",
                                game: {
                                  urn: "ppb:gaming:game:uid/roulette-original-art",
                                  viewLink: {
                                    viewUrn: "ppb:tbd:view:game:roulette-original-art",
                                    viewUrl: "casino/game/roulette-original-art/game:roulette-original-art",
                                  },
                                  name: "Roulette Original",
                                  launchId: "BF_RTCay_ROPremiumPlus",
                                  rgsCodeMobile: "RoulettePremiumPlus",
                                  jackpotLogo: null,
                                  feedData: null,
                                  copyrightText: null,
                                  customBackgroundColor: null,
                                  backgroundColor: "darkslategray - gray",
                                  label: "EXCLUSIVE",
                                  provider: {
                                    name: "Gaming Platform - Red Tiger",
                                    uid: "gp-rt",
                                  },
                                  mainProduct: "arcade",
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
                                    headline: "Roulette Original",
                                    content: [],
                                  },
                                  rtp: "97.3%",
                                },
                              },
                            },
                            {
                              node: {
                                __typename: "GameCard",
                                urn: "ppb:tbd:card:gaming:game:uid/ted-jpk-abp",
                                game: {
                                  urn: "ppb:gaming:game:uid/ted-jpk-abp",
                                  viewLink: {
                                    viewUrn: "ppb:tbd:view:game:ted-jpk-abp",
                                    viewUrl: "casino/game/ted-jpk-abp/game:ted-jpk-abp",
                                  },
                                  name: "Ted Jackpot King",
                                  launchId: "ted-jpk-abp",
                                  rgsCodeMobile: "BP_TedJK",
                                  jackpotLogo: "JACKPOT_KING",
                                  feedData: {
                                    jackpot: 2618258.43,
                                    availableSeats: null,
                                    lastNumbers: null,
                                    physicalTableId: null,
                                    aliasTableNames: null,
                                  },
                                  copyrightText: "TM & © MRC II Distribution Company L.P. All rights reserved.",
                                  customBackgroundColor: "#240e50",
                                  backgroundColor: null,
                                  label: "JACKPOT",
                                  provider: {
                                    name: "Gaming Platform - Blueprint",
                                    uid: "gp-bp",
                                  },
                                  mainProduct: "",
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
                                    headline: "Ted™ Jackpot King",
                                    content: [],
                                  },
                                  rtp: "93.02% + Jackpot King Promotional Pot",
                                },
                              },
                            },
                          ],
                        },
                        partials: {
                          edges: [
                            {
                              node: {
                                __typename: "GameCard",
                                urn: "ppb:tbd:card:gaming:game:uid/roulette-original-art",
                              },
                            },
                            {
                              node: {
                                __typename: "GameCard",
                                urn: "ppb:tbd:card:gaming:game:uid/ted-jpk-abp",
                              },
                            },
                            {
                              node: {
                                __typename: "GameCard",
                                urn: "ppb:tbd:card:gaming:game:uid/dond-megaways-abp",
                              },
                            },
                          ],
                        },
                      },
                    },
                    {
                      node: {
                        __typename: "GamingCardGroup",
                        urn: "ppb:tbd:card:group:gaming:curated:uid/bfrb-new-swimlane",
                        cardGroupTitle: "New",
                        defaultLayout: "CARD_LIST",
                        layouts: ["CARD_LIST"],
                        viewAll: {
                          label: "New    ",
                          icon: "New",
                          viewLink: {
                            viewUrn: "ppb:tbd:view:gamingCategory:gaming-new",
                            viewUrl: "casino/c/gaming-new/gamingCategory:gaming-new",
                          },
                        },
                        full: {
                          edges: [
                            {
                              node: {
                                __typename: "GameCard",
                                urn: "ppb:tbd:card:gaming:game:uid/cat-wilde-the-eclipse-apg",
                                game: {
                                  urn: "ppb:gaming:game:uid/cat-wilde-the-eclipse-apg",
                                  viewLink: {
                                    viewUrn: "ppb:tbd:view:game:cat-wilde-the-eclipse-apg",
                                    viewUrl: "casino/game/cat-wilde-the-eclipse-apg/game:cat-wilde-the-eclipse-apg",
                                  },
                                  name: "Cat Wilde in the Eclipse of the Sun God",
                                  launchId: "cat-wilde-the-eclipse-apg",
                                  rgsCodeMobile: "460",
                                  jackpotLogo: null,
                                  feedData: null,
                                  copyrightText: null,
                                  customBackgroundColor: "#3b6faa",
                                  backgroundColor: null,
                                  label: null,
                                  provider: {
                                    name: "Gaming Platform - PlayNGo",
                                    uid: "gp-pg",
                                  },
                                  mainProduct: "arcade",
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
                                    headline: "Cat Wilde in the Eclipse of the Sun God",
                                    content: [],
                                  },
                                  rtp: "96.22%",
                                },
                              },
                            },
                            {
                              node: {
                                __typename: "GameCard",
                                urn: "ppb:tbd:card:gaming:game:uid/dragons-fire-infini-art",
                                game: {
                                  urn: "ppb:gaming:game:uid/dragons-fire-infini-art",
                                  viewLink: {
                                    viewUrn: "ppb:tbd:view:game:dragons-fire-infini-art",
                                    viewUrl: "casino/game/dragons-fire-infini-art/game:dragons-fire-infini-art",
                                  },
                                  name: "Dragon's Fire Infinireels",
                                  launchId: "dragons-fire-infini-art",
                                  rgsCodeMobile: "DragonsFireInfiniReels",
                                  jackpotLogo: null,
                                  feedData: null,
                                  copyrightText: null,
                                  customBackgroundColor: "#27171c",
                                  backgroundColor: null,
                                  label: null,
                                  provider: {
                                    name: "Gaming Platform - Red Tiger",
                                    uid: "gp-rt",
                                  },
                                  mainProduct: "",
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
                                    headline: "Dragon's Fire Infinireels",
                                    content: [],
                                  },
                                  rtp: "94.68%",
                                },
                              },
                            },
                          ],
                        },
                        partials: {
                          edges: [
                            {
                              node: {
                                __typename: "GameCard",
                                urn: "ppb:tbd:card:gaming:game:uid/cat-wilde-the-eclipse-apg",
                              },
                            },
                            {
                              node: {
                                __typename: "GameCard",
                                urn: "ppb:tbd:card:gaming:game:uid/dragons-fire-infini-art",
                              },
                            },
                            {
                              node: {
                                __typename: "GameCard",
                                urn: "ppb:tbd:card:gaming:game:uid/age-of-the-gods-book-of-oracle-cptn",
                              },
                            },
                          ],
                        },
                      },
                    },
                  ],
                },
                partials: {
                  edges: [
                    {
                      node: {
                        __typename: "GamingCardGroup",
                        urn: "ppb:tbd:card:group:gaming:curated:uid/bfrb-featured-swimlane",
                      },
                    },
                    {
                      node: {
                        __typename: "GamingCardGroup",
                        urn: "ppb:tbd:card:group:gaming:curated:uid/bfrb-new-swimlane",
                      },
                    },
                    {
                      node: {
                        __typename: "GamingCardGroup",
                        urn: "ppb:tbd:card:group:gaming:curated:uid/bfrb-live-casino-swimlane",
                      },
                    },
                    {
                      node: {
                        __typename: "GamingCardGroup",
                        urn: "ppb:tbd:card:group:gaming:curated:uid/bfrb-popular-swimlane",
                      },
                    },
                    {
                      node: {
                        __typename: "GamingCardGroup",
                        urn: "ppb:tbd:card:group:gaming:recommended:uid/gaming-because-you-played",
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:curated/0",
        cardGroupTitle: "Recommended Games",
        defaultLayout: "CARD_LIST",
        layouts: ["CARD_LIST"],
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
                  name: "Age of the Gods: God of Storms",
                  launchId: "age-of-the-gods-god-of-storms-cptn",
                  rgsCodeMobile: "aeolus",
                  jackpotLogo: null,
                  feedData: {
                    jackpot: 785900.03,
                    availableSeats: null,
                    lastNumbers: null,
                    physicalTableId: null,
                    aliasTableNames: null,
                  },
                  copyrightText: null,
                  customBackgroundColor: "#744943",
                  backgroundColor: null,
                  label: "JACKPOT",
                  provider: {
                    name: "Playtech - NGM",
                    uid: "pt-ngm",
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
                    headline: "Age of the Gods: God of Storms",
                    content: [],
                  },
                  rtp: "95.15%",
                },
              },
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/the-goonies-jpk-abp",
                game: {
                  urn: "ppb:gaming:game:uid/the-goonies-jpk-abp",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:the-goonies-jpk-abp",
                    viewUrl: "casino/game/the-goonies-jpk-abp/game:the-goonies-jpk-abp",
                  },
                  name: "The Goonies Jackpot King",
                  launchId: "the-goonies-jpk-abp",
                  rgsCodeMobile: "BP_TheGooniesJK",
                  jackpotLogo: "JACKPOT_KING",
                  feedData: {
                    jackpot: 2618258.43,
                    availableSeats: null,
                    lastNumbers: null,
                    physicalTableId: null,
                    aliasTableNames: null,
                  },
                  copyrightText: "TM & © WBEI (s18)",
                  customBackgroundColor: "#126291",
                  backgroundColor: null,
                  label: "JACKPOT",
                  provider: {
                    name: "Gaming Platform - Blueprint",
                    uid: "gp-bp",
                  },
                  mainProduct: "arcade",
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
                    headline: "The Goonies Jackpot King",
                    content: [],
                  },
                  rtp: "93.06% + Jackpot King Promotional Pot",
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
              },
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/the-goonies-jpk-abp",
              },
            },
          ],
        },
      },
    },
  ],

  pageInfo: null,
};

const SEARCH_MOCK_WITH_3_GAMES = {
  cards: [
    {
      __typename: "GameCard",
      urn: "ppb:tbd:card:gaming:game:uid/mega-masks-arx",
      game: {
        urn: "ppb:gaming:game:uid/mega-masks-arx",
        viewLink: {
          viewUrn: "ppb:tbd:view:game:mega-masks-arx",
          viewUrl: "casino/game/mega-masks-arx/game:mega-masks-arx",
        },
        name: "Mega Masks",
        launchId: "mega-masks-arx",
        rgsCodeMobile: "megamasks",
        jackpotLogo: null,
        feedData: null,
        copyrightText: null,
        customBackgroundColor: "#0b2028",
        backgroundColor: null,
        label: null,
        provider: {
          name: "Gaming Platform - Relax",
          uid: "gp-rx",
        },
        mainProduct: "arcade",
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
          headline: "Mega Masks",
          content: [],
        },
        rtp: "96.21% - 96.41%",
      },
    },
    {
      __typename: "GameCard",
      urn: "ppb:tbd:card:gaming:game:uid/mfb-khonsu-god-of-moon-cptn",
      game: {
        urn: "ppb:gaming:game:uid/mfb-khonsu-god-of-moon-cptn",
        viewLink: {
          viewUrn: "ppb:tbd:view:game:mfb-khonsu-god-of-moon-cptn",
          viewUrl: "casino/game/mfb-khonsu-god-of-moon-cptn/game:mfb-khonsu-god-of-moon-cptn",
        },
        name: "Mega Fire Blaze Khonsu God of Moon™",
        launchId: "mfb-khonsu-god-of-moon-cptn",
        rgsCodeMobile: "gpas_kgomoon_pop",
        jackpotLogo: null,
        feedData: null,
        copyrightText: null,
        customBackgroundColor: "#f27a61",
        backgroundColor: null,
        label: null,
        provider: {
          name: "Playtech - NGM",
          uid: "pt-ngm",
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
          headline: "Mega Fire Blaze Khonsu God of Moon™",
          content: [],
        },
        rtp: "96.49%",
      },
    },
    {
      __typename: "GameCard",
      urn: "ppb:tbd:card:gaming:game:uid/cave-mega-blast-art",
      game: {
        urn: "ppb:gaming:game:uid/cave-mega-blast-art",
        viewLink: {
          viewUrn: "ppb:tbd:view:game:cave-mega-blast-art",
          viewUrl: "casino/game/cave-mega-blast-art/game:cave-mega-blast-art",
        },
        name: "Cave Mega Blast",
        launchId: "cave-mega-blast-art",
        rgsCodeMobile: "CaveMegaBlast",
        jackpotLogo: null,
        feedData: null,
        copyrightText: null,
        customBackgroundColor: "#95c341",
        backgroundColor: null,
        label: "EXCLUSIVE",
        provider: {
          name: "Gaming Platform - Red Tiger",
          uid: "gp-rt",
        },
        mainProduct: "arcade",
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
          headline: "Cave Mega Blast",
          content: [],
        },
        rtp: "94.87%",
      },
    },
  ],
};

const SEARCH_MOCK_3_RESULTS = {
  content: [
    {
      uid: "mega-masks-arx",
    },
    {
      uid: "mfb-khonsu-god-of-moon-cptn",
    },
    {
      uid: "cave-mega-blast-art",
    },
  ],

  results: NUMBER_OF_RESULTS,
};

const SEARCH_MOCK_NO_RESULTS = {
  content: [],
  results: 0,
};

describe("Search in Casino tab", () => {
  describe("When user opens Casino from Browse tab", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_VIEW));
      await startApp("home");

      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.browse.click();
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_VIEW_CASINO));
      await browser.waitUntilDisplayed(browseScreenSO.title);
      await browseScreenSO.tabTitlesList[1].click();
      await browser.waitUntilDisplayed(browseScreenSO.multifunctionalModule);
    });

    it("[PRPI-2774] The 'Casino' tab should be visible", async () => {
      expect(await browseScreenSO.tabTitlesList[1].getText()).toBe("Casino");
    });

    it("[PRPI-2775] The search box should contain a search icon", async () => {
      expect(await searchBarSO.searchContainer.isDisplayed()).toBe(true);
      expect(await searchBarSO.searchIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-2776] The default text in the search box should be 'Search games, providers, live tables'", async () => {
      expect(await searchBarSO.searchInput.getText()).toBe(DEFAULT_SEARCH_FIELD_TEXT);
    });

    it("[PRPI-2777] The Multifunctional module should be displayed", async () => {
      expect(await browseScreenSO.multifunctionalModule.isDisplayed()).toBe(true);
    });

    it("[PRPI-2778] The QuickLinks list should be displayed", async () => {
      expect(await browseScreenSO.quickLinksSection.isDisplayed()).toBe(true);
    });
  });

  describe("When user taps on the Search box from Casino tab", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_VIEW));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.browse.click();
      await browser.waitUntilDisplayed(browseScreenSO.title);
      await browseScreenSO.tabTitlesList[1].click();
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_VIEW_CASINO));
      await browser.waitUntilDisplayed(browseScreenSO.multifunctionalModule);
      await searchBarSO.searchInput.click();
      await browser.waitUntilDisplayed(searchBarSO.searchCancel);
    });

    it("[PRPI-2779] The search box should contain a search icon", async () => {
      expect(await searchBarSO.searchIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-2780] The default text in the search box should be 'Search games, providers, live tables'", async () => {
      expect(await searchBarSO.searchInput.getText()).toBe(DEFAULT_SEARCH_FIELD_TEXT);
    });

    it("[PRPI-2781] The search box should contain 'Cancel' button", async () => {
      expect(await searchBarSO.searchCancel.isDisplayed()).toBe(true);
    });

    it("[PRPI-2782] The default text under the search field should be 'Out of ideas? Try one of our recommended games:'", async () => {
      expect(await browseScreenSO.outOfIdeasText.getText()).toBe(DEFAULT_TEXT_UNDER_SEARCH_FIELD);
    });

    it("[PRPI-2783] The Swimlane module should be displayed", async () => {
      expect(await browseScreenSO.swimlaneModule.isDisplayed()).toBe(true);
      await hideKeyboard();
      await searchBarSO.searchCancel.click();
    });
  });

  describe("When user searches for a game by the part of title", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_VIEW));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.browse.click();
      await browser.waitUntilDisplayed(browseScreenSO.title);
      await browseScreenSO.tabTitlesList[1].click();
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_VIEW_CASINO));
      await browser.waitUntilDisplayed(browseScreenSO.multifunctionalModule);
      await searchBarSO.searchInput.click();
      await browser.waitUntilDisplayed(searchBarSO.searchCancel);
      await searchBarSO.searchInput.setValue(VALID_SEARCH_QUERY);
      await mockService.mockHttpRequest(getSearchGamesResponse(SEARCH_MOCK_3_RESULTS));
      await mockService.mockHttpRequest(getCardResults(SEARCH_MOCK_WITH_3_GAMES));
      await browser.waitUntilDisplayed(browseScreenSO.gameCardsList[2]);
    });

    it("[PRPI-2784] The search box should contain a search icon", async () => {
      expect(await searchBarSO.searchIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-2785] The text in the search box should be 'Mega'", async () => {
      expect(await searchBarSO.searchInput.getText()).toBe(VALID_SEARCH_QUERY);
    });

    it("[PRPI-2786] The results should be displayed", async () => {
      expect(await browseScreenSO.searchResultsContainer.isDisplayed()).toBe(true);
    });

    it("[PRPI-2787] The message under the search box should be '3 results for 'mega''", async () => {
      expect(await browseScreenSO.numberOfResultsText.getText()).toBe(SEARCH_MESSAGE_RESULT);
    });

    it("[PRPI-2788] The result list should contain 3 game cards", async () => {
      expect(await browseScreenSO.gameCardsList.length).toBe(NUMBER_OF_RESULTS);
      await searchBarSO.searchClean.click();
      await hideKeyboard();
      await searchBarSO.searchCancel.click();
    });
  });

  describe("When user searches for some invalid text", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_VIEW));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.browse.click();
      await browser.waitUntilDisplayed(browseScreenSO.title);
      await browseScreenSO.tabTitlesList[1].click();
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_VIEW_CASINO));
      await browser.waitUntilDisplayed(browseScreenSO.multifunctionalModule);
      await searchBarSO.searchInput.click();
      await browser.waitUntilDisplayed(searchBarSO.searchCancel);
      await searchBarSO.searchInput.setValue(INVALID_SEARCH_QUERY);
      await mockService.mockHttpRequest(getSearchGamesResponse(SEARCH_MOCK_NO_RESULTS));
      await browser.waitUntilDisplayed(browseScreenSO.noResultsText);
    });

    it("[PRPI-2789] The clean button should be present", async () => {
      expect(await searchBarSO.searchClean.isDisplayed()).toBe(true);
    });

    it("[PRPI-2790] The message under the search box should be 'No results for'", async () => {
      expect(await browseScreenSO.noResultsText.getText()).toBe(SEARCH_MESSAGE_NO_RESULT);
    });

    it("[PRPI-2791] The Swimlane module should be displayed", async () => {
      expect(await browseScreenSO.swimlaneModule.isDisplayed()).toBe(true);
      await searchBarSO.searchClean.click();
      await hideKeyboard();
      await searchBarSO.searchCancel.click();
    });
  });

  describe("When user goes from Casino tab to Sports tab and back", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getMockedImage({ path: ".*mockedImage.*" }));
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_VIEW));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.browse.click();
      await browser.waitUntilDisplayed(browseScreenSO.title);
      await browseScreenSO.tabTitlesList[1].click();
      await mockService.mockHttpRequest(getBrowseLayout(BFF_BROWSE_VIEW_CASINO));
      await browser.waitUntilDisplayed(browseScreenSO.multifunctionalModule);
      await searchBarSO.searchInput.click();
      await browser.waitUntilDisplayed(searchBarSO.searchCancel);
      await searchBarSO.searchInput.setValue(INVALID_SEARCH_QUERY);
      await mockService.mockHttpRequest(getSearchGamesResponse(SEARCH_MOCK_NO_RESULTS));
      await browser.waitUntilDisplayed(browseScreenSO.noResultsText);
      await browseScreenSO.tabTitlesList[0].click();
      await browseScreenSO.tabTitlesList[0].click();
      await browser.waitUntilDisplayed(browseScreenSO.title);
      await browseScreenSO.tabTitlesList[1].click();
      await browser.waitUntilDisplayed(browseScreenSO.noResultsText);
    });

    it("[PRPI-2792] The search box should contain a search icon", async () => {
      expect(await searchBarSO.searchIcon.isDisplayed()).toBe(true);
    });

    it("[PRPI-2793] The text in the search box should be 'Test1234'", async () => {
      expect(await searchBarSO.searchInput.getText()).toBe(INVALID_SEARCH_QUERY);
    });

    it("[PRPI-2794] The search box should contain 'Cancel' button", async () => {
      expect(await searchBarSO.searchCancel.isDisplayed()).toBe(true);
    });

    it("[PRPI-2795] The message under the search box should be 'No results for'", async () => {
      expect(await browseScreenSO.noResultsText.getText()).toBe(SEARCH_MESSAGE_NO_RESULT);
    });

    it("[PRPI-2796] The Swimlane module should be displayed", async () => {
      expect(await browseScreenSO.swimlaneModule.isDisplayed()).toBe(true);
      await searchBarSO.searchCancel.click();
    });
  });
});
