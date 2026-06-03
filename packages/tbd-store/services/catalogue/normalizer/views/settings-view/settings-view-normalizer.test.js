import normalizeSettingsViewFragmentIntoSettingsView from "./settings-view-normalizer";

const SETTINGS_VIEW_URN = "ppb:tbd:view:settings:settings";
const URL = "/";

const BFF_RESPONSE = {
  __typename: "SettingsView",
  urn: SETTINGS_VIEW_URN,
  url: URL,
  settings: [
    {
      text: "Details",
      url: "details",
    },
    {
      text: "Betting preferences",
    },
  ],
  items: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:market:1",
        },
      },
      {
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:1.175350760|15",
        },
      },
      {
        node: {
          __typename: "PebbleCardGroup",
          urn: "ppb:tbd:card:pebbleCard:30116381.1110|PLACES",
        },
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:market:77",
        },
      },
      null,
    ],
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:market:1",
        },
      },
      {
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:1.175350760|15",
        },
      },
      {
        node: {
          __typename: "PebbleCardGroup",
          urn: "ppb:tbd:card:pebbleCard:30116381.1110|PLACES",
        },
      },
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:market:77",
        },
      },
      null,
    ],
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
};

describe("normalizeSettingsViewFragmentIntoSettingsView", () => {
  describe("and edges have valid nodes", () => {
    const { data } = normalizeSettingsViewFragmentIntoSettingsView(BFF_RESPONSE);

    it("should correctly transform and return the data object with the valid items", () => {
      expect(data).toEqual({
        typename: "SettingsView",
        url: URL,
        urn: SETTINGS_VIEW_URN,
        settings: [
          {
            id: "Details",
            text: "Details",
            url: "details",
          },
          {
            id: "Betting preferences",
            text: "Betting preferences",
          },
        ],
        items: [
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:card:group:market:1",
          },
          {
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.175350760|15",
          },
          {
            typename: "PebbleCardGroup",
            urn: "ppb:tbd:card:pebbleCard:30116381.1110|PLACES",
          },
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:card:group:market:77",
          },
        ],
      });
    });
  });

  describe("and edges has no valid nodes", () => {
    const { data } = normalizeSettingsViewFragmentIntoSettingsView({
      ...BFF_RESPONSE,
      items: { edges: [null, null] },
      partialItems: { edges: [null] },
    });

    it("should correctly transform and return the data object with an empty array of items", () => {
      expect(data).toEqual({
        settings: [
          {
            id: "Details",
            text: "Details",
            url: "details",
          },
          {
            id: "Betting preferences",
            text: "Betting preferences",
          },
        ],
        typename: "SettingsView",
        url: URL,
        urn: SETTINGS_VIEW_URN,
        items: [],
      });
    });
  });

  describe("and settings array is null", () => {
    const { data } = normalizeSettingsViewFragmentIntoSettingsView({
      ...BFF_RESPONSE,
      settings: null,
    });

    it("should correctly transform and return the data object settings with an empty array of items", () => {
      expect(data.settings).toEqual([]);
    });
  });
});
