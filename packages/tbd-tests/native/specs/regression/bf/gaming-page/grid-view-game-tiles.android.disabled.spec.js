const { getGamingLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { GenericScreenSO, GamesCardGroupSO, BottomBarSO, GameTileSO } = require("../../../../screen-objects");
const { startApp } = require("../../../utils/urls");

const MockService = require("../../../helpers/mocking-service");

const mockService = new MockService();
const genericScreenSO = new GenericScreenSO();
const gamesCardGroupSO = new GamesCardGroupSO();
const firstGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[0]);
const secondGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[1]);
const thirdGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[2]);
const fourthGameTileSO = new GameTileSO(gamesCardGroupSO.gamesCardGroupGamesList[3]);

const SECTION_TITLE = "Live Casino";
const FIRST_GAME_TITLE = "Age";
const FIRST_GAME_BADGE_JACKPOT = 250472.64;
const FIRST_GAME_COPYRIGHT_TEXT =
  "THUNDERCATS and all related characters and elements are trademarks of Warner Bros. Entertainment Inc. and © of Warner Bros. Entertainment Inc. and Ted Wolf. (s18)";
const SECOND_GAME_TITLE = "DragonFire";
const SECOND_GAME_BADGE_REGULAR = "EXCLUSIVE";
const THIRD_GAME_TITLE = "Roulette";
const THIRD_GAME_SEATS = 1;
const FOURTH_GAME_TITLE = "Wild Wild Riches";
const FIFTH_GAME_TITLE = "Deal or No Deal: Box Scratchcard";
const FIFTH_GAME_SEATS = 2;
const SIXTH_GAME_TITLE = "Roulette2";

const SEAT_AVAILABLE_BADGE = `${THIRD_GAME_SEATS} SEAT AVAILABLE`;
const SEATS_AVAILABLE_BADGE = `${FIFTH_GAME_SEATS} SEATS AVAILABLE`;

const DAILY_JACKPOT_LOGO = "DAILY_JACKPOT";
const JACKPOT_KING_LOGO = "JACKPOT_KING";

const BFF_GAMING_VIEW_GRID_WITH_4_GAMES = {
  __typename: "GamingView",
  urn: `ppb:tbd:view:gaming:1`,
  title: "",
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:curated/3",
        cardGroupTitle: SECTION_TITLE,
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
                  name: FIRST_GAME_TITLE,
                  launchId: "age-of-the-gods-god-of-storms-cptn",
                  rgsCodeMobile: "aeolus",
                  jackpotLogo: DAILY_JACKPOT_LOGO,
                  feedData: {
                    jackpot: FIRST_GAME_BADGE_JACKPOT,
                    availableSeats: null,
                    lastNumbers: null,
                    physicalTableId: null,
                  },
                  copyrightText: FIRST_GAME_COPYRIGHT_TEXT,
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
                      url: "https://images.prismic.io/betfair-com%2Fb544f00b-244c-4f0c-961e-a1499134f404_ageofthegodsgodofstorms.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2Fb544f00b-244c-4f0c-961e-a1499134f404_ageofthegodsgodofstorms.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
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
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/dragons-fire-art",
                game: {
                  urn: "ppb:gaming:game:uid/dragons-fire-art",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:dragons-fire-art",
                    viewUrl: "casino/game/dragons-fire-art/game:dragons-fire-art",
                  },
                  name: SECOND_GAME_TITLE,
                  launchId: "BF_RT_DragonsFire",
                  rgsCodeMobile: "DragonsFire",
                  jackpotLogo: JACKPOT_KING_LOGO,
                  feedData: null,
                  copyrightText: null,
                  customBackgroundColor: null,
                  backgroundColor: "saddlebrown - brown",
                  label: SECOND_GAME_BADGE_REGULAR,
                  provider: {
                    name: "Gaming Platform - Red Tiger",
                    uid: "gp-rt",
                  },
                  mainProduct: "arcade",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com%2F8ce2e0b3-c238-457c-8e19-bf7a32b6c3a5_dragonsfire.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2F8ce2e0b3-c238-457c-8e19-bf7a32b6c3a5_dragonsfire.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },
                  description: {
                    headline: "Dragon's Fire ",
                    content: [],
                  },
                  rtp: "95.25%",
                },
              },
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/betfair-bonus-roulette-cptn",
                game: {
                  urn: "ppb:gaming:game:uid/betfair-bonus-roulette-cptn",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:betfair-bonus-roulette-cptn",
                    viewUrl: "casino/game/betfair-bonus-roulette-cptn/game:betfair-bonus-roulette-cptn",
                  },
                  name: THIRD_GAME_TITLE,
                  launchId: "betfair-bonus-roulette-cptn",
                  rgsCodeMobile: "bfro",
                  jackpotLogo: null,
                  feedData: {
                    jackpot: null,
                    availableSeats: THIRD_GAME_SEATS,
                    lastNumbers: null,
                    physicalTableId: "103131",
                  },
                  copyrightText: null,
                  customBackgroundColor: null,
                  backgroundColor: "brown - brown",
                  label: null,
                  provider: {
                    name: "Playtech - NGM",
                    uid: "pt-ngm",
                  },
                  mainProduct: "casino",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com%2F505dbfda-66a5-426b-8e5f-436d9b2f4172_designs-51682_bf-casino_bonus_round_roulette.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2F505dbfda-66a5-426b-8e5f-436d9b2f4172_designs-51682_bf-casino_bonus_round_roulette.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },
                  description: {
                    headline: "Betfair Bonus Roulette",
                    content: [
                      {
                        type: "paragraph",
                        text: "",
                        spans: [],
                      },
                    ],
                  },
                  rtp: "98.30%",
                },
              },
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/wild-wild-riches-apr",
                game: {
                  urn: "ppb:gaming:game:uid/wild-wild-riches-apr",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:wild-wild-riches-apr",
                    viewUrl: "casino/game/wild-wild-riches-apr/game:wild-wild-riches-apr",
                  },
                  name: FOURTH_GAME_TITLE,
                  launchId: "wild-wild-riches-apr",
                  rgsCodeMobile: "vs576treasures",
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

                    physicalTableId: "1386",
                  },
                  copyrightText: null,
                  customBackgroundColor: "#1b7e0f",
                  backgroundColor: null,
                  label: null,
                  provider: {
                    name: "Gaming Platform - Pragmatic",
                    uid: "gp-pr",
                  },
                  mainProduct: "arcade",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com/b41c8668-c52e-4369-b836-4329af8b69b6_DESIGNS-72759_BF-ArcadeBingo_Wild_Wild_Riches_flat.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com/b41c8668-c52e-4369-b836-4329af8b69b6_DESIGNS-72759_BF-ArcadeBingo_Wild_Wild_Riches_flat.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },
                  description: {
                    headline: "Wild Wild Riches",
                    content: [],
                  },
                  rtp: "96.77%",
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
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/dragons-fire-art" } },
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/betfair-bonus-roulette-cptn" } },
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/wild-wild-riches-apr" } },
          ],
        },
      },
    },
  ],
};

const BFF_GAMING_VIEW_GRID_WITH_2_GAMES = {
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
                urn: "ppb:tbd:card:gaming:game:uid/betfair-bonus-roulette1-cptn",
                game: {
                  urn: "ppb:gaming:game:uid/betfair-bonus-roulette1-cptn",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:betfair-bonus-roulette1-cptn",
                    viewUrl: "casino/game/betfair-bonus-roulette1-cptn/game:betfair-bonus-roulette1-cptn",
                  },
                  name: FIFTH_GAME_TITLE,
                  launchId: "betfair-bonus-roulette1-cptn",
                  rgsCodeMobile: "bfro",
                  jackpotLogo: DAILY_JACKPOT_LOGO,
                  feedData: {
                    jackpot: null,
                    availableSeats: FIFTH_GAME_SEATS,
                    lastNumbers: null,
                    physicalTableId: "103131",
                  },
                  copyrightText: null,
                  customBackgroundColor: null,
                  backgroundColor: "brown - brown",
                  label: null,
                  provider: {
                    name: "Playtech - NGM",
                    uid: "pt-ngm",
                  },
                  mainProduct: "casino",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com%2F505dbfda-66a5-426b-8e5f-436d9b2f4172_designs-51682_bf-casino_bonus_round_roulette.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2F505dbfda-66a5-426b-8e5f-436d9b2f4172_designs-51682_bf-casino_bonus_round_roulette.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },
                  description: {
                    headline: "Betfair Bonus Roulette",
                    content: [
                      {
                        type: "paragraph",
                        text: "",
                        spans: [],
                      },
                    ],
                  },
                  rtp: "98.30%",
                },
              },
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/betfair-bonus-roulette2-cptn",
                game: {
                  urn: "ppb:gaming:game:uid/betfair-bonus-roulette2-cptn",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:betfair-bonus-roulette2-cptn",
                    viewUrl: "casino/game/betfair-bonus-roulette2-cptn/game:betfair-bonus-roulette2-cptn",
                  },
                  name: SIXTH_GAME_TITLE,
                  launchId: "betfair-bonus-roulette2-cptn",
                  rgsCodeMobile: "bfro",
                  jackpotLogo: null,
                  feedData: {
                    jackpot: null,
                    availableSeats: "0",
                    lastNumbers: null,
                    physicalTableId: "103131",
                  },
                  copyrightText: null,
                  customBackgroundColor: null,
                  backgroundColor: "brown - brown",
                  label: null,
                  provider: {
                    name: "Playtech - NGM",
                    uid: "pt-ngm",
                  },
                  mainProduct: "casino",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com%2F505dbfda-66a5-426b-8e5f-436d9b2f4172_designs-51682_bf-casino_bonus_round_roulette.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2F505dbfda-66a5-426b-8e5f-436d9b2f4172_designs-51682_bf-casino_bonus_round_roulette.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },
                  description: {
                    headline: "Betfair Bonus Roulette",
                    content: [
                      {
                        type: "paragraph",
                        text: "",
                        spans: [],
                      },
                    ],
                  },
                  rtp: "98.30%",
                },
              },
            },
          ],
        },
        partials: {
          edges: [
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/betfair-bonus-roulette1-cptn" } },
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/betfair-bonus-roulette2-cptn" } },
          ],
        },
      },
    },
  ],
};

const BFF_GAMING_VIEW_GRID_WITHOUT_GAMES = {
  __typename: "GamingView",
  urn: `ppb:tbd:view:gaming:1`,
  title: "",
  edges: [
    {
      node: {
        __typename: "GamingCardGroup",
        urn: "ppb:tbd:gaming:masterConfigElement:curated/3",
        cardGroupTitle: SECTION_TITLE,
        defaultLayout: "GRID_TWO_COLUMNS",
        layouts: ["GRID_TWO_COLUMNS"],
        viewAll: null,
        full: {
          edges: [],
        },
        partials: {
          edges: [],
        },
      },
    },
  ],
};

const BFF_GAMING_VIEW_GRID_WITH_3_GAMES = {
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
                  name: FIRST_GAME_TITLE,
                  launchId: "age-of-the-gods-god-of-storms-cptn",
                  rgsCodeMobile: "aeolus",
                  jackpotLogo: JACKPOT_KING_LOGO,
                  feedData: {
                    jackpot: null,
                    availableSeats: null,
                    lastNumbers: [
                      {
                        number: 25,
                        color: "RED",
                      },
                    ],

                    physicalTableId: "1386",
                  },
                  copyrightText: FIRST_GAME_COPYRIGHT_TEXT,
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
                      url: "https://images.prismic.io/betfair-com%2Fb544f00b-244c-4f0c-961e-a1499134f404_ageofthegodsgodofstorms.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2Fb544f00b-244c-4f0c-961e-a1499134f404_ageofthegodsgodofstorms.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
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
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/dragons-fire-art",
                game: {
                  urn: "ppb:gaming:game:uid/dragons-fire-art",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:dragons-fire-art",
                    viewUrl: "casino/game/dragons-fire-art/game:dragons-fire-art",
                  },
                  name: SECOND_GAME_TITLE,
                  launchId: "BF_RT_DragonsFire",
                  rgsCodeMobile: "DragonsFire",
                  jackpotLogo: null,
                  feedData: {
                    jackpot: null,
                    availableSeats: null,
                    lastNumbers: [],
                    physicalTableId: "1386",
                  },
                  copyrightText: null,
                  customBackgroundColor: null,
                  backgroundColor: "saddlebrown - brown",
                  label: null,
                  provider: {
                    name: "Gaming Platform - Red Tiger",
                    uid: "gp-rt",
                  },
                  mainProduct: "arcade",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com%2F8ce2e0b3-c238-457c-8e19-bf7a32b6c3a5_dragonsfire.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2F8ce2e0b3-c238-457c-8e19-bf7a32b6c3a5_dragonsfire.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },
                  description: {
                    headline: "Dragon's Fire ",
                    content: [],
                  },
                  rtp: "95.25%",
                },
              },
            },
            {
              node: {
                __typename: "GameCard",
                urn: "ppb:tbd:card:gaming:game:uid/betfair-bonus-roulette-cptn",
                game: {
                  urn: "ppb:gaming:game:uid/betfair-bonus-roulette-cptn",
                  viewLink: {
                    viewUrn: "ppb:tbd:view:game:betfair-bonus-roulette-cptn",
                    viewUrl: "casino/game/betfair-bonus-roulette-cptn/game:betfair-bonus-roulette-cptn",
                  },
                  name: THIRD_GAME_TITLE,
                  launchId: "betfair-bonus-roulette-cptn",
                  rgsCodeMobile: "bfro",
                  jackpotLogo: null,
                  feedData: null,
                  copyrightText: null,
                  customBackgroundColor: null,
                  backgroundColor: "brown - brown",
                  label: null,
                  provider: {
                    name: "Playtech - NGM",
                    uid: "pt-ngm",
                  },
                  mainProduct: "casino",
                  flattened: {
                    small: {
                      url: "https://images.prismic.io/betfair-com%2F505dbfda-66a5-426b-8e5f-436d9b2f4172_designs-51682_bf-casino_bonus_round_roulette.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;225&amp;h&#x3D;225",
                      alt: null,
                      dimensions: {
                        width: 225,
                        height: 225,
                      },
                    },
                    medium: {
                      url: "https://images.prismic.io/betfair-com%2F505dbfda-66a5-426b-8e5f-436d9b2f4172_designs-51682_bf-casino_bonus_round_roulette.jpg?auto&#x3D;compress,format&amp;rect&#x3D;0,0,900,900&amp;w&#x3D;450&amp;h&#x3D;450",
                      alt: null,
                      dimensions: {
                        width: 450,
                        height: 450,
                      },
                    },
                  },
                  description: {
                    headline: "Betfair Bonus Roulette",
                    content: [
                      {
                        type: "paragraph",
                        text: "",
                        spans: [],
                      },
                    ],
                  },
                  rtp: "98.30%",
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
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/dragons-fire-art" } },
            { node: { __typename: "GameCard", urn: "ppb:tbd:card:gaming:game:uid/betfair-bonus-roulette-cptn" } },
          ],
        },
      },
    },
  ],
};

describe("Game tiles in grid view", () => {
  describe("When user opens tab with grid view with 4 games", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_GRID_WITH_4_GAMES));
      await startApp("home");

      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(gamesCardGroupSO.gamesCardGroup);
    });

    it("[PRPI-2724] Grid view is displayed with title 'Live Casino'", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupHeaderText.getText()).toEqual(SECTION_TITLE);
    });

    it("[PRPI-2725] Should display 4 games", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupGamesList.length).toBe(4);
    });

    it("[PRPI-2726] The cards titles should be 'Age', 'DragonFire', 'Roulette', 'Wild Wild Riches'", async () => {
      expect(await firstGameTileSO.gameTileTitle.getText()).toEqual(FIRST_GAME_TITLE);
      expect(await secondGameTileSO.gameTileTitle.getText()).toEqual(SECOND_GAME_TITLE);
      expect(await thirdGameTileSO.gameTileTitle.getText()).toEqual(THIRD_GAME_TITLE);
      expect(await fourthGameTileSO.gameTileTitle.getText()).toEqual(FOURTH_GAME_TITLE);
    });

    it("[PRPI-2727] The first card should have Jackpot badge", async () => {
      expect(await firstGameTileSO.gameTileBadgeText.isDisplayed()).toBe(true);
      expect((await firstGameTileSO.gameTileBadgeText.getText()).substring(1).replace(",", "")).toBeGreaterThanOrEqual(
        FIRST_GAME_BADGE_JACKPOT,
      );
    });

    it("[PRPI-2728] The first card should have copyright text", async () => {
      expect(await firstGameTileSO.gameTileCopyright.isDisplayed()).toBe(true);
      expect(await firstGameTileSO.gameTileCopyright.getText()).toEqual(FIRST_GAME_COPYRIGHT_TEXT);
    });

    it("[PRPI-2729] The second card should have 'Exclusive' badge", async () => {
      expect(await secondGameTileSO.gameTileBadgeText.isDisplayed()).toBe(true);
      expect(await secondGameTileSO.gameTileBadgeText.getText()).toEqual(SECOND_GAME_BADGE_REGULAR);
    });

    it("[PRPI-2730] The third card should have '1 SEAT AVAILABLE' badge", async () => {
      expect(await thirdGameTileSO.gameTileBadgeText.isDisplayed()).toBe(true);
      expect(await thirdGameTileSO.gameTileBadgeText.getText()).toEqual(SEAT_AVAILABLE_BADGE);
    });

    it("[PRPI-2731] The fourth card should have Roulette badge with numbers: 1 2 0 35 36 30 28 29", async () => {
      expect(await fourthGameTileSO.gameTileBadgeRouletteNumbersContainer.isDisplayed()).toBe(true);
      expect(await fourthGameTileSO.gameTileBadgeRouletteNumbers.length).toBe(8);
      expect(await fourthGameTileSO.gameTileBadgeRouletteNumbers[0].getText()).toEqual("1");
      expect(await fourthGameTileSO.gameTileBadgeRouletteNumbers[1].getText()).toEqual("2");
      expect(await fourthGameTileSO.gameTileBadgeRouletteNumbers[2].getText()).toEqual("0");
      expect(await fourthGameTileSO.gameTileBadgeRouletteNumbers[3].getText()).toEqual("35");
      expect(await fourthGameTileSO.gameTileBadgeRouletteNumbers[4].getText()).toEqual("36");
      expect(await fourthGameTileSO.gameTileBadgeRouletteNumbers[5].getText()).toEqual("30");
      expect(await fourthGameTileSO.gameTileBadgeRouletteNumbers[6].getText()).toEqual("28");
      expect(await fourthGameTileSO.gameTileBadgeRouletteNumbers[7].getText()).toEqual("29");
    });

    it("[PRPI-2732] The first and the second cards should have Jackpot logo", async () => {
      expect(await firstGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(true);
      expect(await secondGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(true);
      expect(await thirdGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(false);
      expect(await fourthGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(false);
    });
  });

  describe("When user opens tab with grid view with 2 games", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_GRID_WITH_2_GAMES));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(gamesCardGroupSO.gamesCardGroup);
    });

    it("[PRPI-2733] Grid view should not have title", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupHeaderText.isDisplayed()).toBe(false);
    });

    it("[PRPI-2734] Should display 2 games", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupGamesList.length).toBe(2);
    });

    it("[PRPI-2735] The cards titles should be 'Deal or No Deal: Box Scratchcard', 'Roulette2'", async () => {
      expect(await firstGameTileSO.gameTileTitle.getText()).toEqual(FIFTH_GAME_TITLE);
      expect(await secondGameTileSO.gameTileTitle.getText()).toEqual(SIXTH_GAME_TITLE);
    });

    it("[PRPI-2736] The first card should have '2 SEATS AVAILABLE' badge", async () => {
      expect(await firstGameTileSO.gameTileBadgeText.isDisplayed()).toBe(true);
      expect(await firstGameTileSO.gameTileBadgeText.getText()).toEqual(SEATS_AVAILABLE_BADGE);
    });

    it("[PRPI-2737] The second card should have 'TABLE FULL - BET BEHIND NOW' badge", async () => {
      expect(await secondGameTileSO.gameTileBadgeText.isDisplayed()).toBe(true);
      expect(await secondGameTileSO.gameTileBadgeText.getText()).toEqual("TABLE FULL - BET BEHIND NOW");
    });

    it("[PRPI-2738] The first card should have Jackpot logo", async () => {
      expect(await firstGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(true);
      expect(await secondGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(false);
    });
  });

  describe("When user opens tab with grid view without games", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_GRID_WITHOUT_GAMES));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
    });

    it("[PRPI-2739] The grid view should not be displayed", async () => {
      expect(await gamesCardGroupSO.element.isDisplayed()).toBe(false);
    });
  });

  describe("When user opens tab with grid view with 3 games", () => {
    beforeAll(async () => {
      await mockService.mockHttpRequest(getGamingLayout(BFF_GAMING_VIEW_GRID_WITH_3_GAMES));
      await browser.waitUntilDisplayed(BottomBarSO.home);
      await BottomBarSO.home.click();
      await browser.waitUntilDisplayed(genericScreenSO.element);
      await BottomBarSO.gaming.click();
      await browser.waitUntilDisplayed(gamesCardGroupSO.gamesCardGroup);
    });

    it("[PRPI-2740] Grid view is displayed without title", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupHeaderText.isDisplayed()).toBe(false);
    });

    it("[PRPI-2741] Should display 3 games", async () => {
      expect(await gamesCardGroupSO.gamesCardGroupGamesList.length).toBe(3);
    });

    it("[PRPI-2742] The cards titles should be 'Age', 'DragonFire', 'Roulette'", async () => {
      expect(await firstGameTileSO.gameTileTitle.getText()).toEqual(FIRST_GAME_TITLE);
      expect(await secondGameTileSO.gameTileTitle.getText()).toEqual(SECOND_GAME_TITLE);
      expect(await thirdGameTileSO.gameTileTitle.getText()).toEqual(THIRD_GAME_TITLE);
    });

    it("[PRPI-2743] The first card should have Roulette badge with numbers: 25", async () => {
      expect(await firstGameTileSO.gameTileBadgeRouletteNumbersContainer.isDisplayed()).toBe(true);
      expect(await firstGameTileSO.gameTileBadgeRouletteNumbers.length).toBe(1);
      expect(await firstGameTileSO.gameTileBadgeRouletteNumbers[0].getText()).toEqual("25");
    });

    it("[PRPI-2744] The first card should have copyright text", async () => {
      expect(await firstGameTileSO.gameTileCopyright.isDisplayed()).toBe(true);
      expect(await firstGameTileSO.gameTileCopyright.getText()).toEqual(FIRST_GAME_COPYRIGHT_TEXT);
    });

    it("[PRPI-2745] The second card should not display Roulette badge without numbers", async () => {
      expect(await secondGameTileSO.gameTileBadgeRouletteNumbersContainer.isDisplayed()).toBe(false);
    });

    it("[PRPI-2746] The third card should not have any badge", async () => {
      expect(await thirdGameTileSO.gameTileBadgeText.isDisplayed()).toBe(false);
    });

    it("[PRPI-2747] The first card should have Jackpot logo", async () => {
      expect(await firstGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(true);
      expect(await secondGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(false);
      expect(await thirdGameTileSO.gameTileJackpotLogo.isDisplayed()).toBe(false);
    });
  });
});
