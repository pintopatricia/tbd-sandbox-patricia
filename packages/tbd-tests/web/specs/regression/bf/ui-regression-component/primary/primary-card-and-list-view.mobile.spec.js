const { SportPagePO, ScrollableSwimlanePO } = require("../../../../../page-objects");
const CouponCardGroupPO = require("@ppb/tbd-shared/components/FilteredCouponCardGroup/FilteredCouponCardGroup.web.po");

const { getSportsLayout } = require("@ppb/tbd-shared/mocks/bff/bff.controller");
const { getIndexHTML } = require("../../../../../mock-essentials/controllers/webserver/webserver-controller");

const MockService = require("../../../../../mock-essentials/mocking-service");
const routes = require("../../../../../../utils/routes");

const sportPagePO = new SportPagePO();
const eventMarketsCardCouponPO = new CouponCardGroupPO(sportPagePO.element);
const eventMarketsCardSwimlanePO = new ScrollableSwimlanePO(sportPagePO.scrollableSwimlanes[0]);

const mockService = new MockService();

const EVENT_TYPE_ID = 1;

const BFF_MOCK = {
  urn: `ppb:tbd:view:sport:${EVENT_TYPE_ID}`,
  edges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "First Card",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48044/0",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48351/0",
                          selectionId: 48351,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/58805/0",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 58805,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 48351,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48044/0",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48351/0",
                          selectionId: 48351,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/58805/0",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 58805,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 48351,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                    ],
                  },
                },
              },
            },
          ],
        },
        viewAll: {
          icon: null,
          label: "View All",
          viewLink: { viewUrn: "ppb:tbd:view:external:external", viewUrl: "https://betfair.com" },
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Second card group",
        urn: "ppb:tbd:card:group:topEventsByCompetition:10",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48044/0",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48351/0",
                          selectionId: 48351,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/58805/0",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 58805,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 48351,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48044/0",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48351/0",
                          selectionId: 48351,
                        },
                        {
                          unnerURN: "ppb:excRunner:1.160337355/58805/0",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 58805,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 48351,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        cardGroupTitle: "Third card group",
        urn: "ppb:tbd:card:group:topEventsByCompetition:1",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48044/0",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48351/0",
                          selectionId: 48351,
                        },
                        {
                          unnerURN: "ppb:excRunner:1.160337355/58805/0",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 58805,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 48351,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:2",
        partials: {
          title: "Fourth card group",
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48044/0",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48351/0",
                          selectionId: 48351,
                        },
                        {
                          unnerURN: "ppb:excRunner:1.160337355/58805/0",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 58805,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 48351,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48044/0",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48351/0",
                          selectionId: 48351,
                        },
                        {
                          unnerURN: "ppb:excRunner:1.160337355/58805/0",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 58805,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 48351,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:3",
        cardGroupTitle: "Fifth card group",
        partials: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
              },
            },
          ],
        },
        full: {
          edges: [
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48044/0",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48351/0",
                          selectionId: 48351,
                        },
                        {
                          unnerURN: "ppb:excRunner:1.160337355/58805/0",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 58805,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 48351,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                    ],
                  },
                },
              },
            },
            {
              node: {
                __typename: "EventMarketCard",
                urn: "ppb:tbd:card:eventPrimaryMarket:29359895",
                fixture: {
                  home: {
                    name: "Wolves",
                  },
                  away: {
                    name: "Man Utd",
                  },
                },
                sportevent: {
                  name: "Home Team vs Away Team",
                  urn: "ppb:event:12345",
                  __typename: "SportsEvent",
                  competition: {
                    urn: "ppb:competition:12191691",
                    name: "Competition Name",
                  },
                },
                displayRunners: {
                  exchange: {
                    market: {
                      __typename: "ExchangeMarket",
                      urn: "ppb:excMarket:1.160337355",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48044/0",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:excRunner:1.160337355/48351/0",
                          selectionId: 48351,
                        },
                        {
                          unnerURN: "ppb:excRunner:1.160337355/58805/0",
                          selectionId: 58805,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:excRunner:1.160337355/48044/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/48351/0" },
                      { runnerURN: "ppb:excRunner:1.160337355/58805/0" },
                    ],
                  },
                  sportsbook: {
                    market: {
                      __typename: "SportsbookMarket",
                      urn: "ppb:sbkMarket:924.193270252",
                      hierarchy: {
                        __typename: "EventHierarchy",
                        sportevent: {
                          urn: `ppb:event:29359895`,
                        },
                      },
                      runners: [
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48044",
                          selectionId: 48044,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/48351",
                          selectionId: 58805,
                        },
                        {
                          runnerURN: "ppb:sbkRunner:924.193270252/58805",
                          selectionId: 48351,
                        },
                      ],
                    },
                    runners: [
                      { runnerURN: "ppb:sbkRunner:924.193270252/48044" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/48351" },
                      { runnerURN: "ppb:sbkRunner:924.193270252/58805" },
                    ],
                  },
                },
              },
            },
          ],
        },
      },
    },
  ],

  partialEdges: [
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsInSport:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:10",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:1",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:2",
      },
    },
    {
      node: {
        __typename: "SwimlaneCardGroup",
        urn: "ppb:tbd:card:group:topEventsByCompetition:3",
      },
    },
  ],

  bottomBar: {},
};

describe("User navigates to the Sport page", () => {
  beforeAll(async () => {
    await mockService.mockHttpRequest(await getIndexHTML(BFF_MOCK.urn));
    await mockService.mockHttpRequest(getSportsLayout(BFF_MOCK));
    await browser.url(routes.getSportViewUrl(EVENT_TYPE_ID));
    await browser.waitUntilDisplayed(sportPagePO.actionLink[0]);
  });

  it("[PRPI-6279] The events are shown in list mode scrollable separated in each competitions card groups", async () => {
    expect(await eventMarketsCardCouponPO.element.isDisplayed()).toBe(true);
    expect(await eventMarketsCardSwimlanePO.element.isDisplayed()).toBe(true);
  });
});
