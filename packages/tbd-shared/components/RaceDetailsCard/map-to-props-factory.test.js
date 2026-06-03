import { SUBSCRIBE_RACE_UPDATES, UNSUBSCRIBE_RACE_UPDATES } from "@ppb/tbd-store/actions/race";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { EntityType } from "@ppb/tbd-urn-codecs";

import { CountryCode } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { formatDateWithToday, formatTime } from "../../helpers/dates";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { isRaceRunningStatus } from "../../helpers/race";

const getRaceDetailsCardByURN = jest.fn(() => ({
  typename: "RaceDetailsCard",
  urn: "ppb:tbd:card:racedetailscard:1.14.1200228.1",
  race: "ppb:race:1.14.1200228.1",
  numberOfRunners: 6,
  showMeetingInfo: true,
  availableToSubscribe: true,
  raceClass: 2,
}));

const userDetailsMock = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
  CountryCode: CountryCode.UNITED_KINGDOM,
  jurisdiction: {
    jurisdiction: Jurisdiction.INTERNATIONAL,
  },
};

const raceMock = {
  urn: "ppb:race:1.14.1200228.1",
  meeting: "ppb:meeting:12290316",
  startTime: "2020-02-28T14:00:00Z",
  name: "888SPORT NOVICES' HANDICAP CHASE (4)",
  raceViewLink: "viewLinkMock",
  details: {
    distance: {
      miles: 4,
      furlongs: 4,
      yards: 19,
    },
    raceDetailsTitle: "race 22",
    scheduledTime: new Date("2020-02-28T14:00:00Z"),
    going: "TRACK_GOING",
    status: "GOING_DOWN",
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

const DATE_MOCK = "28 Feb";
const DATE_TIME_MOCK = new Date(raceMock.startTime);

const getRaceByURN = jest.fn(() => raceMock);

const getMeetingByURN = jest.fn(() => ({
  urn: "ppb:meeting:12290316",
  date: "2020-02-28T14:00:00Z",
  country: "FRA",
  countryFlag: { small: "countryFlagURL" },
  venue: "Ayr",
}));

const getUserDetails = jest.fn(() => userDetailsMock);

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/UserDetailsState", () => ({
  CountryCode: jest.fn(() => getUserDetails),
}));

jest.mock("@ppb/tbd-store/state/entities/races/race-selectors", () => ({
  createRaceByURNSelector: jest.fn(() => getRaceByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/meetings/meeting-selectors", () => ({
  createMeetingByURNSelector: jest.fn(() => getMeetingByURN),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getRaceDetailsCardByURN),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../helpers/dates", () => ({
  formatDateWithToday: jest.fn(() => DATE_MOCK),
  formatTime: jest.fn(() => "17:15"),
}));

jest.mock("../../helpers/race", () => ({
  isRaceRunningStatus: jest.fn(),
}));

const state = {
  layouts: {
    cards: {
      racerdetailscard: ["ppb:card"],
    },
  },
  entities: { races: {}, meetings: {} },
  router: {
    currentView: "SomeView",
  },
};

const setupMapStateToProps = (urn, isMyBets) => {
  const containerProps = {
    urn,
    theme: "HIGHLIGHTED",
  };

  const newState = { ...state };

  if (isMyBets) {
    newState.router.currentView = EntityType.MyBetsView;
  }

  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  let stateProps;

  beforeEach(jest.clearAllMocks);

  it("should get data from state and build correct view model", () => {
    isRaceRunningStatus.mockReturnValueOnce(false);
    stateProps = setupMapStateToProps("fakeRaceDetailsCardUrn");

    expect(getRaceDetailsCardByURN).toHaveBeenCalledWith(state.layouts.cards.racedetails, "fakeRaceDetailsCardUrn");
    expect(getRaceByURN).toHaveBeenCalledWith(state.entities.races, "ppb:race:1.14.1200228.1");
    expect(getMeetingByURN).toHaveBeenCalledWith(state.entities.meetings, "ppb:meeting:12290316");
    expect(formatTime).toHaveBeenCalledWith(raceMock.startTime, "locale", "timezone");
    expect(formatDateWithToday).toHaveBeenCalledWith(DATE_TIME_MOCK, "locale", "timezone");

    expect(isRaceRunningStatus).toHaveBeenCalledTimes(1);
    expect(isRaceRunningStatus).toHaveBeenCalledWith("GOING_DOWN");

    expect(stateProps).toEqual({
      countryFlag: { small: "countryFlagURL" },
      raceTime: "17:15",
      meetingName: "Ayr",
      showDuration: false,
      date: DATE_MOCK,
      dateTime: DATE_TIME_MOCK,
      numberOfRunners: 6,
      showMeetingInfo: true,
      raceName: "888SPORT NOVICES' HANDICAP CHASE (4)",
      raceStatus: "GOING_DOWN",
      raceStatusLabel: "I18N.RACE_STATUS.GOING_DOWN",
      runnersLabel: "I18N.LABELS.RUNNERS",
      trackGoing: "I18N.RACE_GOING.TRACK_GOING",
      stickyOnScroll: true,
      raceURN: "ppb:race:1.14.1200228.1",
      availableToSubscribe: true,
      raceClass: "I18N.LABELS.CLASS 2",
      raceDetailsTitle: "race 22",
      isRaceRunningStatus: false,
      isHighlighted: true,
    });
  });

  it("should return showDuration as true when jurisdiction is BRAZIL", () => {
    getUserDetails.mockReturnValueOnce({
      ...userDetailsMock,
      jurisdiction: {
        jurisdiction: Jurisdiction.BRAZIL,
      },
    });

    expect(setupMapStateToProps().showDuration).toEqual(true);
  });

  it("should return undefined raceStatusLabel when raceDetails.status is DORMANT", () => {
    getRaceByURN.mockReturnValueOnce({
      ...raceMock,
      details: {
        ...raceMock.details,
        status: "DORMANT",
      },
    });
    stateProps = setupMapStateToProps("fakeRaceDetailsCardUrn");

    expect(stateProps.raceStatus).toEqual("DORMANT");
    expect(stateProps.raceStatusLabel).toEqual(undefined);
  });

  it("should return false isRaceRunningStatus when raceDetails.status not RESULT UNDER_ORDERS or OFF", () => {
    isRaceRunningStatus.mockReturnValueOnce(false);
    getRaceByURN.mockReturnValueOnce({
      ...raceMock,
      details: {
        ...raceMock.details,
        status: "WON",
      },
    });
    stateProps = setupMapStateToProps("fakeRaceDetailsCardUrn");

    expect(stateProps.isRaceRunningStatus).toBeFalsy();
  });

  it("should return true isRaceRunningStatus when raceDetails.status is RESULT UNDER_ORDERS or OFF", () => {
    isRaceRunningStatus.mockReturnValueOnce(true);
    getRaceByURN.mockReturnValueOnce({
      ...raceMock,
      details: {
        ...raceMock.details,
        status: "WON",
      },
    });
    stateProps = setupMapStateToProps("fakeRaceDetailsCardUrn");

    expect(stateProps.isRaceRunningStatus).toBeTruthy();
  });

  it("should get data from state and build correct view model, even without race details", () => {
    isRaceRunningStatus.mockReturnValueOnce(false);
    getRaceByURN.mockReturnValueOnce({
      details: undefined,
      meeting: "ppb:meeting:12290316",
      startTime: new Date("2020-02-28T14:00:00Z"),
      name: "888SPORT NOVICES' HANDICAP CHASE (4)",
    });

    getRaceDetailsCardByURN.mockReturnValueOnce({
      typename: "RaceDetailsCard",
      urn: "ppb:tbd:card:racedetailscard:1.14.1200228.1",
      race: "ppb:race:1.14.1200228.1",
      showMeetingInfo: true,
      raceViewLink: "raceViewLinkMock",
      availableToSubscribe: true,
    });

    stateProps = setupMapStateToProps("fakeRaceDetailsCardUrn");

    expect(getRaceDetailsCardByURN).toHaveBeenCalledWith(state.layouts.cards.racedetails, "fakeRaceDetailsCardUrn");
    expect(getRaceByURN).toHaveBeenCalledWith(state.entities.races, "ppb:race:1.14.1200228.1");
    expect(getMeetingByURN).toHaveBeenCalledWith(state.entities.meetings, "ppb:meeting:12290316");

    expect(stateProps).toEqual({
      countryFlag: { small: "countryFlagURL" },
      raceTime: "17:15",
      meetingName: "Ayr",
      showDuration: false,
      date: DATE_MOCK,
      dateTime: DATE_TIME_MOCK,
      numberOfRunners: undefined,
      showMeetingInfo: true,
      raceName: "888SPORT NOVICES' HANDICAP CHASE (4)",
      raceStatus: undefined,
      raceStatusLabel: undefined,
      runnersLabel: "I18N.LABELS.RUNNERS",
      trackGoing: undefined,
      stickyOnScroll: true,
      raceURN: "ppb:race:1.14.1200228.1",
      viewLink: "raceViewLinkMock",
      availableToSubscribe: true,
      raceDetailsTitle: undefined,
      isRaceRunningStatus: false,
      isHighlighted: true,
    });
  });

  it("should return empty object if the raceDetailsCard doesn't exist", () => {
    getRaceDetailsCardByURN.mockReturnValueOnce(undefined);
    stateProps = setupMapStateToProps("fakeRaceDetailsCardUrn");

    expect(stateProps).toEqual({});
  });
});

describe("mapDispatchToProps", () => {
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

  describe("dispatchPushAction", () => {
    it("should dispatch push action", () => {
      const { dispatchPushAction } = mapDispatchToProps;

      const viewLink = "viewLink";

      expect(dispatchPushAction(viewLink)).toEqual({
        payload: "viewLink",
        type: PUSH,
      });
    });
  });
});
