import normalizeRaceViewFragmentIntoRaceView from "./race-view-normalizer";

const BFF_RESPONSE = {
  __typename: "RaceView",
  urn: "ppb:tbd:view:race:7|30116381.1110",
  canonicalUrl:
    "/sport/horse-racing/meeting?eventId=30147459&raceTime=1606415820&dayToSearch=20201126&marketId=924.246331809",
  url: "horse-racing/kenil-(rsa)-10th-nov/r-7%7C30116381.1110",
  race: {
    urn: "ppb:tbd:race:7|30116381.1110",
    meeting: {
      urn: "ppb:tbd:meeting:7|30116381",
    },
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:allRacesByMeeting:30116381.1110",
        },
        theme: "THEME",
      },
      {
        node: {
          __typename: "RaceDetailsCard",
          urn: "ppb:tbd:card:raceDetails:30116381.1110",
        },
        theme: "THEME",
      },
      {
        node: {
          __typename: "MarketCard",
          urn: "ppb:tbd:card:market:1.175350760|15",
        },
        theme: null,
      },
      {
        node: {
          __typename: "PebbleCardGroup",
          urn: "ppb:tbd:card:pebbleCard:30116381.1110|PLACES",
        },
        theme: null,
      },
    ],
    pageInfo: null,
  },
  bottomBar: {
    tiles: [],
  },
  regulatoryData: {
    sections: [],
  },
};

const BFF_RESPONSE_NO_NODE = {
  __typename: "RaceView",
  urn: "ppb:tbd:view:race:7|30116381.1110",
  url: "horse-racing/kenil-(rsa)-10th-nov/r-7%7C30116381.1110",
  race: {
    urn: "ppb:tbd:race:7|30116381.1110",
    meeting: {
      urn: "ppb:tbd:meeting:7|30116381",
    },
  },
  partialItems: {
    edges: [
      {
        node: {
          __typename: "SwimlaneCardGroup",
          urn: "ppb:tbd:card:group:allRacesByMeeting:30116381.1110",
        },
        theme: "THEME",
      },
      { test: {} },
    ],
    pageInfo: null,
  },
};

describe("Race view normalizer", () => {
  describe("normalizeRaceViewFragmentIntoRaceView", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeRaceViewFragmentIntoRaceView(BFF_RESPONSE);

      expect(data).toEqual({
        race: "ppb:tbd:race:7|30116381.1110",
        items: [
          {
            typename: "SwimlaneCardGroup",
            urn: "ppb:tbd:card:group:allRacesByMeeting:30116381.1110",
            theme: "THEME",
          },
          {
            typename: "RaceDetailsCard",
            urn: "ppb:tbd:card:raceDetails:30116381.1110",
            theme: "THEME",
          },
          {
            typename: "MarketCard",
            urn: "ppb:tbd:card:market:1.175350760|15",
            theme: null,
          },
          {
            typename: "PebbleCardGroup",
            urn: "ppb:tbd:card:pebbleCard:30116381.1110|PLACES",
            theme: null,
          },
        ],
        typename: "RaceView",
        canonicalUrl:
          "/sport/horse-racing/meeting?eventId=30147459&raceTime=1606415820&dayToSearch=20201126&marketId=924.246331809",
        url: "horse-racing/kenil-(rsa)-10th-nov/r-7%7C30116381.1110",
        urn: "ppb:tbd:view:race:7|30116381.1110",
      });
    });

    // eslint-disable-next-line jest/no-identical-title
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeRaceViewFragmentIntoRaceView(BFF_RESPONSE_NO_NODE);

      expect(data).toEqual({
        race: "ppb:tbd:race:7|30116381.1110",
        items: [
          { urn: "ppb:tbd:card:group:allRacesByMeeting:30116381.1110", typename: "SwimlaneCardGroup", theme: "THEME" },
        ],
        typename: "RaceView",
        url: "horse-racing/kenil-(rsa)-10th-nov/r-7%7C30116381.1110",
        urn: "ppb:tbd:view:race:7|30116381.1110",
      });
    });

    // eslint-disable-next-line jest/no-identical-title
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeRaceViewFragmentIntoRaceView({
        ...BFF_RESPONSE_NO_NODE,
        partialItems: { edges: [null, null] },
      });

      expect(data).toEqual({
        race: "ppb:tbd:race:7|30116381.1110",
        items: [],
        typename: "RaceView",
        url: "horse-racing/kenil-(rsa)-10th-nov/r-7%7C30116381.1110",
        urn: "ppb:tbd:view:race:7|30116381.1110",
      });
    });
  });
});
