import normalizeRacingSwimlaneCardGroupFragmentIntoRacingSwimlaneCardGroup from "./racing-swimlane-card-group-normalizer";

const BFF_RESPONSE = {
  __typename: "RacingSwimlaneCardGroup",
  urn: "ppb:tbd:cardgroup:racingSwimlane:2manybees/s/7",
  racingSwimlaneCardGroupTitle: "Bee Racing Championship",
  displayName: "translation",
  viewAll: {
    label: "View more",
    icon: "Slots",
    viewLink: {
      viewUrl: "url",
      viewUrn: "urn",
    },
  },
  fullItems: {
    edges: [
      {
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:111",
        },
      },
    ],
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:111",
        },
      },
      {
        node: {
          __typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:222",
        },
      },
    ],
  },
};

describe("Racing Swimlane Card group normalizer", () => {
  it("should correctly transform and return the data object", () => {
    const { data } = normalizeRacingSwimlaneCardGroupFragmentIntoRacingSwimlaneCardGroup(BFF_RESPONSE);

    expect(data).toEqual({
      items: [
        {
          typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:111",
        },
        {
          typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:222",
        },
      ],
      title: "Bee Racing Championship",
      displayName: "translation",
      typename: "RacingSwimlaneCardGroup",
      urn: "ppb:tbd:cardgroup:racingSwimlane:2manybees/s/7",
      viewAll: {
        icon: "SLOTS",
        label: "View more",
        viewLink: {
          viewUrl: "url",
          viewUrn: "urn",
        },
      },
    });
  });

  describe("when a partial item is null", () => {
    it("should correctly transform and return the data object", () => {
      const BFF_RESPONSE_NULL_ITEM = {
        ...BFF_RESPONSE,
        partialItems: {
          edges: [
            null,
            {
              node: {
                __typename: "RaceMarketCard",
                urn: "ppb:tbd:card:raceMarket:222",
              },
            },
          ],
        },
      };

      const { data } = normalizeRacingSwimlaneCardGroupFragmentIntoRacingSwimlaneCardGroup(BFF_RESPONSE_NULL_ITEM);

      expect(data).toEqual({
        items: [{ urn: "ppb:tbd:card:raceMarket:222", typename: "RaceMarketCard" }],
        title: "Bee Racing Championship",
        displayName: "translation",
        typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:2manybees/s/7",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
      });
    });
  });

  describe("when no partial items are defined", () => {
    it("should correctly transform and return the data object", () => {
      const BFF_RESPONSE_NO_EDGES = {
        ...BFF_RESPONSE,
        partialItems: { edges: [] },
      };
      const { data } = normalizeRacingSwimlaneCardGroupFragmentIntoRacingSwimlaneCardGroup(BFF_RESPONSE_NO_EDGES);

      expect(data).toEqual({
        items: [],
        title: "Bee Racing Championship",
        displayName: "translation",
        typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:2manybees/s/7",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
      });
    });
  });

  describe("when the title is null", () => {
    it("should correctly transform and return the data object", () => {
      const BFF_RESPONSE_NO_TITLE = {
        ...BFF_RESPONSE,
        racingSwimlaneCardGroupTitle: null,
      };

      const { data } = normalizeRacingSwimlaneCardGroupFragmentIntoRacingSwimlaneCardGroup(BFF_RESPONSE_NO_TITLE);

      expect(data).toEqual({
        items: [
          {
            urn: "ppb:tbd:card:raceMarket:111",
            typename: "RaceMarketCard",
          },
          {
            urn: "ppb:tbd:card:raceMarket:222",
            typename: "RaceMarketCard",
          },
        ],
        title: undefined,
        displayName: "translation",
        typename: "RacingSwimlaneCardGroup",
        urn: "ppb:tbd:cardgroup:racingSwimlane:2manybees/s/7",
        viewAll: {
          icon: "SLOTS",
          label: "View more",
          viewLink: {
            viewUrl: "url",
            viewUrn: "urn",
          },
        },
      });
    });
  });

  it("should correctly transform and return the data object when the displayName is null", () => {
    const BFF_RESPONSE_NO_DISPLAY_NAME = {
      ...BFF_RESPONSE,
      displayName: null,
    };

    const { data } = normalizeRacingSwimlaneCardGroupFragmentIntoRacingSwimlaneCardGroup(BFF_RESPONSE_NO_DISPLAY_NAME);

    expect(data).toEqual({
      items: [
        {
          typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:111",
        },
        {
          typename: "RaceMarketCard",
          urn: "ppb:tbd:card:raceMarket:222",
        },
      ],
      title: "Bee Racing Championship",
      displayName: undefined,
      typename: "RacingSwimlaneCardGroup",
      urn: "ppb:tbd:cardgroup:racingSwimlane:2manybees/s/7",
      viewAll: {
        icon: "SLOTS",
        label: "View more",
        viewLink: {
          viewUrl: "url",
          viewUrn: "urn",
        },
      },
    });
  });
});
