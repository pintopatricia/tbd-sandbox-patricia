import { PUSH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

let getRaceViewLinkCardbyURN = jest.fn(() => ({
  urn: "ppb:tbd:card:raceviewlink:1",
  typename: "RaceViewLinkCard",
  viewLink: {
    viewUrn: "ppb:tbd:view:race:7|30089529.1910",
    viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.1910",
  },
  race: "ppb:race:30089529.1910",
}));

const RACE_BY_URN_MOCK = {
  urn: "ppb:tbd:view:race:7|30089529.1910",
  meeting: "ppb:meeting:12290316",
  startTime: new Date("2020-02-28T14:00:00Z"),
  name: "888SPORT NOVICES' HANDICAP CHASE (4)",
  details: {
    distance: {
      miles: 4,
      furlongs: 4,
      yards: 19,
    },
    scheduledTime: new Date("2020-02-28T14:00:00Z"),
    going: "TRACK_GOING",
    status: "GOING_DOWN",
    numberOfRunners: 6,
  },
  runners: {
    24550116: {
      urn: "ppb:XPTO:24550116",
      selectionId: 24550116,
      rating: 5,
      form: "1-15026",
      comments:
        "25/1, creditable fourth of 10 in handicap at this C&D 8 days ago on first run after a breathing op. Still low mileage so he must enter calculations off same mark.",
      details: {
        jockeyName: "Brian Hughes",
        trainerName: "Michael Appleby",
        saddleCloth: 8,
        silk: "http://tbdui.qa.internal/images/silk.png",
        draw: 0,
        equipmentDescription: "Visor and tongue strap",
      },
      horse: {
        name: "VOLT FACE (FR)",
        sireName: "DECLARATION OF WAR (USA)",
        damName: "FLAMINGO SEA (USA)",
        damSireName: "WOODMAN (USA)",
        age: 5,
        color: "CHESTNUT",
        sex: "GELDING",
        bred: "IRE",
      },
    },
  },
};

const getRaceByURN = jest.fn(() => RACE_BY_URN_MOCK);

const getMeetingByURN = jest.fn(() => ({
  urn: "ppb:meeting:12290316",
  date: new Date("2020-02-28T14:00:00Z"),
  country: "FRA",
  countryFlag: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
  venue: "Ayr",
}));

jest.mock("@ppb/tbd-store/state/entities/races/race-selectors", () => ({
  createRaceByURNSelector: jest.fn(() => getRaceByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/meetings/meeting-selectors", () => ({
  createMeetingByURNSelector: jest.fn(() => getMeetingByURN),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getRaceViewLinkCardbyURN),
}));

const state = {
  layouts: {
    views: {
      race: {
        "ppb:tbd:view:race:7|30089529.1910": {
          urn: "ppb:tbd:view:race:7|30089529.1910",
          url: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.1910",
          type: "RACE_VIEW",
          items: [],
        },
      },
    },
    cards: {
      raceviewlink: ["ppb:card"],
    },
  },
  entities: { races: {} },
};

const setupMapStateToProps = (urn) => {
  const containerProps = {
    urn,
  };
  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  let stateProps;
  beforeEach(jest.clearAllMocks);

  it("should get data from state and build correct view model", () => {
    stateProps = setupMapStateToProps("fakeRaceViewLinkCardUrn");

    expect(getRaceViewLinkCardbyURN).toHaveBeenCalledWith(state.layouts.cards.raceviewlink, "fakeRaceViewLinkCardUrn");
    expect(getRaceByURN).toHaveBeenCalledWith(state.entities.races, "ppb:race:30089529.1910");
    expect(getMeetingByURN).toHaveBeenCalledWith(state.entities.meetings, "ppb:meeting:12290316");
    expect(stateProps).toEqual({
      venue: "Ayr",
      countryFlag: "https://upload.wikimedia.org/wikipedia/en/a/ae/Flag_of_the_United_Kingdom.svg",
      viewLink: {
        viewUrn: "ppb:tbd:view:race:7|30089529.1910",
        viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.1910",
      },
    });
  });

  it("should return an emtpy object when the raceViewLinkCard is not found", () => {
    getRaceViewLinkCardbyURN = jest.fn(() => undefined);
    stateProps = setupMapStateToProps("fakeRaceViewLinkCardUrn");
    expect(stateProps).toEqual({});
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchPush", () => {
    it("should dispatch push action", () => {
      const { dispatchPushAction } = mapDispatchToProps;
      const raceViewLinkMock = {
        viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.1910",
        viewUrn: "ppb:tbd:view:race:7|30089529.1910",
      };

      expect(dispatchPushAction(raceViewLinkMock)).toEqual({
        payload: raceViewLinkMock,
        type: PUSH,
      });
    });
  });
});
