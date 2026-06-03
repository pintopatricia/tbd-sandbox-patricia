import normalizeEventMarketCardFragmentIntoEventMarketCard from "./event-market-card-normalizer";

describe("EventMarketCard normalizer", () => {
  describe("when there's supporting content (SCA fixture info)", () => {
    const BFF_RESPONSE = {
      __typename: "EventMarketCard",
      urn: "ppb:tbd:card:eventmarket:1.175591575;924.245489409|15",
      title: "Win",
      eventViewLink: [
        {
          viewUrn: "ppb:tbd:view:event:1.175591575",
          viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
        },
      ],
      fixture: {
        urn: "fixtureUrn",
        __typename: "fixtureTypename",
      },
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.175293571",
          },
          runners: [
            {
              runnerURN: "ppb:excRunner:1.175293571/36710835/0",
            },
            {
              runnerURN: "ppb:excRunner:1.175293571/36710836/0",
            },
          ],
        },
        sportsbook: {
          market: {
            __typename: "SportsbookMarket",
            urn: "ppb:sbkMarket:924.245489409",
          },
          runners: [
            {
              runnerURN: "ppb:sbkRunner:1.175293571/36710835",
            },
            {
              runnerURN: "ppb:sbkRunner:1.175293571/36710836",
            },
          ],
        },
      },
      runnerViewLinks: [
        {
          runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
          viewUrl: "Not Implemented",
          viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
        },
      ],
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:1",
      },
      videoAvailable: true,
      isSuperSubEligible: true,
      tabLink: {
        label: "BuildABet",
        icon: {
          id: "Bet-Builder",
          category: "Value",
        },
        tabViewLink: {
          viewUrn: "ppb:tbd:view:event:36906754?=tabId=ZkXyWxEAAB8AOXvr",
          viewUrl: "football/german-bundesliga/hoffenheim-v-dortmund/e-36906754?tabId=ZkXyWxEAAB8AOXvr#bet-builder",
        },
      },
      marketPromo: {
        title: "market title",
        description: "market description",
        signposting: "EXTRA_PLACES",
      },
    };

    it("should correctly transform and return the data object", () => {
      const { data } = normalizeEventMarketCardFragmentIntoEventMarketCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventmarket:1.175591575;924.245489409|15",
        title: "Win",
        runnerViewLinks: {
          "ppb:excRunner:1.175591575/19159752/0": {
            runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
          },
        },
        eventViewLink: [
          {
            viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
            viewUrn: "ppb:tbd:view:event:1.175591575",
          },
        ],
        displayRunners: {
          exchange: {
            market: "ppb:excMarket:1.175293571",
            runners: [{ urn: "ppb:excRunner:1.175293571/36710835/0" }, { urn: "ppb:excRunner:1.175293571/36710836/0" }],
          },
          sportsbook: {
            market: "ppb:sbkMarket:924.245489409",
            runners: [{ urn: "ppb:sbkRunner:1.175293571/36710835" }, { urn: "ppb:sbkRunner:1.175293571/36710836" }],
          },
        },
        fixture: "fixtureUrn",
        sportevent: "ppb:event:1",
        tabLink: {
          label: "BuildABet",
          icon: {
            id: "Bet-Builder",
            category: "Value",
          },
          tabViewLink: {
            viewUrn: "ppb:tbd:view:event:36906754?=tabId=ZkXyWxEAAB8AOXvr",
            viewUrl: "football/german-bundesliga/hoffenheim-v-dortmund/e-36906754?tabId=ZkXyWxEAAB8AOXvr#bet-builder",
          },
        },
        videoAvailable: true,
        isSuperSubEligible: true,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
      });
    });

    it("should correctly transform and return the data object with undefined variables", () => {
      const { data } = normalizeEventMarketCardFragmentIntoEventMarketCard({
        ...BFF_RESPONSE,
        displayRunners: {},
        marketsHierarchy: {},
      });

      expect(data).toEqual({
        typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventmarket:1.175591575;924.245489409|15",
        title: "Win",
        eventViewLink: [
          {
            viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
            viewUrn: "ppb:tbd:view:event:1.175591575",
          },
        ],
        displayRunners: {},
        runnerViewLinks: {
          "ppb:excRunner:1.175591575/19159752/0": {
            runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
          },
        },
        fixture: "fixtureUrn",
        sportevent: "ppb:event:1",
        tabLink: {
          label: "BuildABet",
          icon: {
            id: "Bet-Builder",
            category: "Value",
          },
          tabViewLink: {
            viewUrn: "ppb:tbd:view:event:36906754?=tabId=ZkXyWxEAAB8AOXvr",
            viewUrl: "football/german-bundesliga/hoffenheim-v-dortmund/e-36906754?tabId=ZkXyWxEAAB8AOXvr#bet-builder",
          },
        },
        videoAvailable: true,
        isSuperSubEligible: true,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
      });
    });

    it("should correctly transform and return the data object", () => {
      const { data } = normalizeEventMarketCardFragmentIntoEventMarketCard({
        ...BFF_RESPONSE,
        displayRunners: {
          exchange: {
            market: {
              urn: "ppb:excMarket:1.229209252",
            },
            runners: [],
          },
          sportsbook: {
            market: {
              urn: "ppb:sbkMarket:924.229209259",
            },
            runners: [],
          },
        },
      });

      expect(data).toEqual({
        typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventmarket:1.175591575;924.245489409|15",
        eventViewLink: [
          {
            viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
            viewUrn: "ppb:tbd:view:event:1.175591575",
          },
        ],
        title: "Win",
        runnerViewLinks: {
          "ppb:excRunner:1.175591575/19159752/0": {
            runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
          },
        },
        displayRunners: {
          exchange: {
            market: "ppb:excMarket:1.229209252",
            runners: [],
          },
          sportsbook: {
            market: "ppb:sbkMarket:924.229209259",
            runners: [],
          },
        },
        fixture: "fixtureUrn",
        sportevent: "ppb:event:1",
        tabLink: {
          label: "BuildABet",
          icon: {
            id: "Bet-Builder",
            category: "Value",
          },
          tabViewLink: {
            viewUrn: "ppb:tbd:view:event:36906754?=tabId=ZkXyWxEAAB8AOXvr",
            viewUrl: "football/german-bundesliga/hoffenheim-v-dortmund/e-36906754?tabId=ZkXyWxEAAB8AOXvr#bet-builder",
          },
        },
        videoAvailable: true,
        isSuperSubEligible: true,
        marketPromo: {
          title: "market title",
          description: "market description",
          signposting: "EXTRA_PLACES",
        },
      });
    });
  });

  describe("when there's no supporting content (fallback to FACET data)", () => {
    const BFF_RESPONSE = {
      __typename: "EventMarketCard",
      urn: "ppb:tbd:card:eventmarket:1.175591575;924.245489409|15",
      title: "Win",
      eventViewLink: [
        {
          viewUrn: "ppb:tbd:view:event:1.175591575",
          viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
        },
      ],
      fixture: {
        __typename: "BaseFixture",
        sportevent: {
          urn: "ppb:sportevent:fakeurn",
          name: "Fake sport event",
        },
        mainMarket: {
          exchange: { urn: "ppb:exc:fakemarketurn", name: "Fake exc market" },
          sportsbook: { urn: "ppb:sbk:fakemarketurn", name: "Fake sbk market" },
        },
      },
      displayRunners: {
        exchange: {
          market: {
            __typename: "ExchangeMarket",
            urn: "ppb:excMarket:1.175293571",
          },
          runners: [
            {
              runnerURN: "ppb:excRunner:1.175293571/36710835/0",
            },
            {
              runnerURN: "ppb:excRunner:1.175293571/36710836/0",
            },
          ],
        },
        sportsbook: {
          market: {
            __typename: "SportsbookMarket",
            urn: "ppb:sbkMarket:924.245489409",
          },
          runners: [
            {
              runnerURN: "ppb:sbkRunner:1.175293571/36710835",
            },
            {
              runnerURN: "ppb:sbkRunner:1.175293571/36710836",
            },
          ],
        },
      },
      runnerViewLinks: [
        {
          runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
          viewUrl: "Not Implemented",
          viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
        },
      ],
      sportevent: {
        __typename: "SportsEvent",
        urn: "ppb:event:1",
        competition: {
          urn: "ppb:competition:123",
        },
      },
      isSuperSubEligible: null,
    };

    it("should correctly transform and return the data object", () => {
      const { data } = normalizeEventMarketCardFragmentIntoEventMarketCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventmarket:1.175591575;924.245489409|15",
        title: "Win",
        runnerViewLinks: {
          "ppb:excRunner:1.175591575/19159752/0": {
            runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
          },
        },
        eventViewLink: [
          {
            viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
            viewUrn: "ppb:tbd:view:event:1.175591575",
          },
        ],
        displayRunners: {
          exchange: {
            market: "ppb:excMarket:1.175293571",
            runners: [{ urn: "ppb:excRunner:1.175293571/36710835/0" }, { urn: "ppb:excRunner:1.175293571/36710836/0" }],
          },
          sportsbook: {
            market: "ppb:sbkMarket:924.245489409",
            runners: [{ urn: "ppb:sbkRunner:1.175293571/36710835" }, { urn: "ppb:sbkRunner:1.175293571/36710836" }],
          },
        },
        fixture: {
          mainMarket: {
            exchange: "ppb:exc:fakemarketurn",
            sportsbook: "ppb:sbk:fakemarketurn",
          },
          sportevent: "ppb:sportevent:fakeurn",
          typename: "BaseFixture",
        },
        isSuperSubEligible: false,
        sportevent: "ppb:event:1",
        competition: "ppb:competition:123",
      });
    });

    it("should correctly transform and return the data object with undefined variables", () => {
      const { data } = normalizeEventMarketCardFragmentIntoEventMarketCard({
        ...BFF_RESPONSE,
        displayRunners: {},
        marketsHierarchy: {},
      });

      expect(data).toEqual({
        typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventmarket:1.175591575;924.245489409|15",
        title: "Win",
        eventViewLink: [
          {
            viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
            viewUrn: "ppb:tbd:view:event:1.175591575",
          },
        ],
        displayRunners: {},
        runnerViewLinks: {
          "ppb:excRunner:1.175591575/19159752/0": {
            runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
          },
        },
        fixture: {
          mainMarket: {
            exchange: "ppb:exc:fakemarketurn",
            sportsbook: "ppb:sbk:fakemarketurn",
          },
          sportevent: "ppb:sportevent:fakeurn",
          typename: "BaseFixture",
        },
        isSuperSubEligible: false,
        sportevent: "ppb:event:1",
        competition: "ppb:competition:123",
      });
    });

    it("should correctly transform and return the data object", () => {
      const { data } = normalizeEventMarketCardFragmentIntoEventMarketCard({
        ...BFF_RESPONSE,
        displayRunners: {
          exchange: {
            market: {
              urn: "ppb:excMarket:1.229209252",
            },
            runners: [],
          },
          sportsbook: {
            market: {
              urn: "ppb:sbkMarket:924.229209259",
            },
            runners: [],
          },
        },
      });

      expect(data).toEqual({
        typename: "EventMarketCard",
        urn: "ppb:tbd:card:eventmarket:1.175591575;924.245489409|15",
        eventViewLink: [
          {
            viewUrl: "horse-racing/sthl-17th-nov/5f-hcap/rc-1.175591575",
            viewUrn: "ppb:tbd:view:event:1.175591575",
          },
        ],
        title: "Win",
        runnerViewLinks: {
          "ppb:excRunner:1.175591575/19159752/0": {
            runnerUrn: "ppb:excRunner:1.175591575/19159752/0",
            viewUrl: "Not Implemented",
            viewUrn: "ppb:tbd:view:runner:1.175591575/19159752/0",
          },
        },
        displayRunners: {
          exchange: {
            market: "ppb:excMarket:1.229209252",
            runners: [],
          },
          sportsbook: {
            market: "ppb:sbkMarket:924.229209259",
            runners: [],
          },
        },
        fixture: {
          mainMarket: {
            exchange: "ppb:exc:fakemarketurn",
            sportsbook: "ppb:sbk:fakemarketurn",
          },
          sportevent: "ppb:sportevent:fakeurn",
          typename: "BaseFixture",
        },
        isSuperSubEligible: false,
        sportevent: "ppb:event:1",
        competition: "ppb:competition:123",
      });
    });
  });
});
