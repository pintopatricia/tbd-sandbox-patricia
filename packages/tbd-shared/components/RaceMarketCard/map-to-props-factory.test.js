import { UI__NAVIGATE_TO_VIEW } from "@ppb/tbd-store/actions/navigation";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { SUBSCRIBE_RACE_UPDATES, UNSUBSCRIBE_RACE_UPDATES } from "@ppb/tbd-store/actions/race";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { raceDistance } from "../../formatters/distance-formatters";
import { formatTime } from "../../helpers/dates";
import { isRaceRunningStatus } from "../../helpers/race";

let raceViewLink = {
  viewUrn: "ppb:tbd:view:race:1.14.1200228.1",
  viewUrl: "hr/race/1.14.1200228.1",
};

const getRaceMarketCardByURN = jest.fn(() => ({
  urn: "ppb:tbd:card:racemarket:1.14.1200228.1",
  typename: "RaceMarketCard",
  race: "ppb:race:1.14.1200228.1",
  title: "Win",
  displayRunners: {
    exchange: {
      market: "ppb:excMarket:1.1704485001",
      runners: ["runner1Urn", "runner2Urn"],
    },
    sportsbook: {
      market: "ppb:sbkMarket:924.230553342",
      runners: ["runner1Urn", "runner2Urn"],
    },
  },
  marketViewLinks: ["1", "2"],
  runnerViewLinks: {
    24550116: {
      viewUrn: "runner_view_urn",
      viewUrl: "...",
    },
  },
  numberOfRunners: 6,
  raceViewLink,
  isRunnerExpandable: true,
  marketPromo: {
    title: "market title",
    description: "market description",
    signposting: "EXTRA_PLACES",
  },
}));

const RACE_BY_URN_MOCK = {
  urn: "ppb:race:1.14.1200228.1",
  meeting: "ppb:meeting:12290316",
  startTime: new Date("2020-02-28T14:00:00Z"),
  name: "888SPORT NOVICES' HANDICAP CHASE (4)",
  details: {
    distance: {
      miles: 4,
      furlongs: 4,
      yards: 19,
    },
    raceType: "FLAT",
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

const RACE_BY_URN_EMPTY_DISTANCE_MOCK = {
  urn: "ppb:race:1.14.1200228.1",
  meeting: "ppb:meeting:12290316",
  startTime: new Date("2020-02-28T14:00:00Z"),
  name: "888SPORT NOVICES' HANDICAP CHASE (4)",
  details: {
    scheduledTime: new Date("2020-02-28T14:00:00Z"),
    going: "TRACK_GOING",
    status: "GOING_DOWN",
    numberOfRunners: 6,
    raceType: "FLAT",
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
  countryFlag: { small: "countryFlagURL" },
  venue: "Ayr",
}));

const userDetailsMock = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

const getUserDetails = jest.fn(() => userDetailsMock);

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("@ppb/tbd-store/state/entities/races/race-selectors", () => ({
  createRaceByURNSelector: jest.fn(() => getRaceByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/meetings/meeting-selectors", () => ({
  createMeetingByURNSelector: jest.fn(() => getMeetingByURN),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getRaceMarketCardByURN),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../formatters/distance-formatters", () => ({
  raceDistance: jest.fn(),
}));

jest.mock("../../helpers/race", () => ({
  isRaceRunningStatus: jest.fn(),
}));

jest.mock("../../helpers/dates", () => ({
  formatTime: jest.fn(() => "17:15"),
}));

const state = {
  layouts: {
    cards: {
      racermarkets: ["ppb:card"],
    },
  },
  entities: { races: {}, meetings: {} },
};

const setupMapStateToProps = (urn) => {
  const containerProps = {
    urn,
  };
  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  afterEach(() => {
    raceDistance.mockClear();
    getRaceMarketCardByURN.mockClear();
    getRaceByURN.mockClear();
    getMeetingByURN.mockClear();
  });

  it("should get data from state and build correct view model", () => {
    raceDistance.mockReturnValueOnce("4m 4f 19y");
    isRaceRunningStatus.mockReturnValueOnce(false);
    const stateProps = setupMapStateToProps("fakeRaceMarketCardUrn");

    expect(getRaceMarketCardByURN).toHaveBeenCalledWith(state.layouts.cards.racemarkets, "fakeRaceMarketCardUrn");
    expect(getRaceByURN).toHaveBeenCalledWith(state.entities.races, "ppb:race:1.14.1200228.1");
    expect(getMeetingByURN).toHaveBeenCalledWith(state.entities.meetings, "ppb:meeting:12290316");
    expect(getUserDetails).toHaveBeenCalledWith(state);
    expect(isRaceRunningStatus).toHaveBeenCalledTimes(1);
    expect(isRaceRunningStatus).toHaveBeenCalledWith("GOING_DOWN");
    expect(formatTime).toHaveBeenCalledWith(expect.any(Date), "locale", "timezone");

    expect(stateProps).toEqual({
      countryFlag: { small: "countryFlagURL" },
      meetingName: "Ayr",
      numberOfRunners: 6,
      raceName: "888SPORT NOVICES' HANDICAP CHASE (4)",
      raceStatus: "GOING_DOWN",
      raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
      raceTime: "17:15",
      isRaceRunningStatus: false,
      raceURN: "ppb:race:1.14.1200228.1",
      raceViewLink: {
        viewUrl: "hr/race/1.14.1200228.1",
        viewUrn: "ppb:tbd:view:race:1.14.1200228.1",
      },
      runnerViewLinks: {
        24550116: {
          viewUrl: "...",
          viewUrn: "runner_view_urn",
        },
      },
      runnersLabel: "I18N.LABELS.RUNNERS",
      title: "Win",
      trackGoing: "I18N.RACE_GOING.TRACK_GOING",
      urn: "fakeRaceMarketCardUrn",
      displayRunners: {
        exchange: {
          market: "ppb:excMarket:1.1704485001",
          runners: ["runner1Urn", "runner2Urn"],
        },
        sportsbook: {
          market: "ppb:sbkMarket:924.230553342",
          runners: ["runner1Urn", "runner2Urn"],
        },
      },
      showMeetingInfo: true,
      isRunnerExpandable: true,
      marketPromo: {
        title: "market title",
        description: "market description",
        signposting: "EXTRA_PLACES",
      },
    });
  });

  it("should default to empty race view link", () => {
    raceViewLink = null;
    getRaceByURN.mockReturnValueOnce(RACE_BY_URN_EMPTY_DISTANCE_MOCK);
    const stateProps = setupMapStateToProps("fakeRaceMarketCardUrn");

    expect(raceDistance).not.toHaveBeenCalled();
    expect(stateProps).toEqual({
      countryFlag: { small: "countryFlagURL" },
      meetingName: "Ayr",
      numberOfRunners: 6,
      raceName: "888SPORT NOVICES' HANDICAP CHASE (4)",
      raceStatus: "GOING_DOWN",
      raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
      raceTime: "17:15",
      raceURN: "ppb:race:1.14.1200228.1",
      raceViewLink: null,
      runnerViewLinks: {
        24550116: {
          viewUrl: "...",
          viewUrn: "runner_view_urn",
        },
      },
      runnersLabel: "I18N.LABELS.RUNNERS",
      title: "Win",
      trackGoing: "I18N.RACE_GOING.TRACK_GOING",
      urn: "fakeRaceMarketCardUrn",
      displayRunners: {
        exchange: {
          market: "ppb:excMarket:1.1704485001",
          runners: ["runner1Urn", "runner2Urn"],
        },
        sportsbook: {
          market: "ppb:sbkMarket:924.230553342",
          runners: ["runner1Urn", "runner2Urn"],
        },
      },
      showMeetingInfo: true,
      isRunnerExpandable: true,
      marketPromo: {
        title: "market title",
        description: "market description",
        signposting: "EXTRA_PLACES",
      },
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchPush", () => {
    it("should dispatch push action", () => {
      const { dispatchPush } = mapDispatchToProps;
      const raceViewLinkMock = {
        viewUrl: "horse-racing/ripon-1st-sep/r-7#29988272.1200",
        viewUrn: "ppb:tbd:view:race:7#29988272.1200",
      };

      expect(dispatchPush(raceViewLinkMock)).toEqual({
        payload: raceViewLinkMock,
        type: PUSH,
      });
    });
  });

  describe("dispatchSubscribeRaceUpdates", () => {
    it("should dispatch SUBSCRIBE_RACE_UPDATES action", () => {
      const { dispatchSubscribeRaceUpdates } = mapDispatchToProps;
      const urn = "urn:fake:race:1";

      expect(dispatchSubscribeRaceUpdates(urn)).toEqual({
        payload: { urn },
        type: SUBSCRIBE_RACE_UPDATES,
      });
    });
  });

  describe("dispatchNavigateToRaceFromRaceDetails", () => {
    it("should dispatch UI__NAVIGATE_TO_VIEW action", () => {
      const { dispatchNavigateToRaceFromRaceDetails } = mapDispatchToProps;

      expect(dispatchNavigateToRaceFromRaceDetails("destination", "cardURN", "meetingName")).toEqual({
        payload: {
          url: "destination",
          cardURN: "cardURN",
          label: "meetingName",
          module: "primary swimlane",
        },
        type: UI__NAVIGATE_TO_VIEW,
      });
    });
  });

  describe("dispatchUnsubscribeRaceUpdates", () => {
    it("should dispatch UNSUBSCRIBE_RACE_UPDATES action", () => {
      const { dispatchUnsubscribeRaceUpdates } = mapDispatchToProps;
      const urn = "urn:fake:race:1";

      expect(dispatchUnsubscribeRaceUpdates(urn)).toEqual({
        payload: { urn },
        type: UNSUBSCRIBE_RACE_UPDATES,
      });
    });
  });
});
