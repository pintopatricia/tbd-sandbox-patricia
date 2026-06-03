import { FETCH_CATALOGUE } from "@ppb/tbd-store";
import { SUBSCRIBE_RACE_UPDATES, UNSUBSCRIBE_RACE_UPDATES } from "@ppb/tbd-store/actions/race";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const viewUrn = "ppb:tbd:view:race:7|34365976.1245";

const raceUrn = "ppb:race:34365976.1245";

const raceViewMock = {
  typename: "RaceView",
  urn: viewUrn,
  canonicalUrl: "/horse-racing/carlisle-30th-may/r-7%7C34365976.1245",
  url: "horse-racing/carlisle-30th-may/r-7%7C34365976.1245",
  race: raceUrn,
  items: [
    {
      urn: "ppb:tbd:card:raceswitcher:34365976.1245",
      typename: "RaceSwitcherCard",
      theme: "HIGHLIGHTED",
    },
    {
      urn: "ppb:tbd:card:raceViewLinks:7|34365976.1245",
      typename: "RaceViewLinksCard",
      theme: "HIGHLIGHTED",
    },
    {
      urn: "ppb:tbd:card:raceDetails:34365976.1245|false|false|true",
      typename: "RaceDetailsCard",
      theme: "HIGHLIGHTED",
    },
    {
      urn: "ppb:tbd:card:timeFormBroadCasts:34365976.1245|true",
      typename: "TimeFormBroadCastsCard",
      theme: "HIGHLIGHTED",
    },
    {
      urn: "ppb:tbd:card:navigationTabsList:ZlBZ_hAAACQA196R/r/7|34365976.1245",
      typename: "NavigationTabsList",
      theme: "DEFAULT",
    },
    {
      urn: "ppb:tbd:card:contentSummary:race:7|34365976.1245",
      typename: "ContentSummaryCard",
      theme: "DEFAULT",
    },
    {
      urn: "ppb:tbd:card:preference:singleChoice:sportsbookOddsDisplay|SEGMENTED",
      typename: "PreferenceSingleChoiceCard",
      theme: "DEFAULT",
    },
    {
      urn: "ppb:tbd:card:regulatory:footer",
      typename: "RegulatoryCard",
      theme: "DEFAULT",
    },
  ],
  metadata: {
    cacheTimestamp: 1748598822900,
  },
};

const viewsMock = {
  viewUrn: raceViewMock,
};

const raceMock = {
  urn: "ppb:race:34365976.1245",
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
    scheduledTime: new Date("2020-02-28T14:00:00Z"),
    going: "TRACK_GOING",
    status: "GOING_DOWN",
    raceType: "FLAT",
  },
  runners: {},
};

const racesMock = {
  raceUrn: raceMock,
};

const getRaceViewByURN = jest.fn(() => raceViewMock);

const getThrottle = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/races/race-selectors", () => {
  const getRaceByURN = jest.fn().mockImplementation(() => raceMock);

  return {
    createRaceByURNSelector: jest.fn(() => getRaceByURN),
  };
});

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(() => getThrottle),
}));

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createFindViewByURNSelector: jest.fn(() => getRaceViewByURN),
}));

const state = {
  layouts: {
    views: {
      race: viewsMock,
    },
  },
  entities: { races: racesMock, meetings: {} },
  router: {
    currentView: "RaceView",
  },
};

const setupMapStateToProps = (urn) => {
  const containerProps = {
    urn,
  };

  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  let stateProps;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should get data from state and build correct data", () => {
    getThrottle.mockReturnValueOnce({ isActive: true });
    stateProps = setupMapStateToProps(viewUrn);

    expect(getRaceViewByURN).toHaveBeenCalledWith(state.layouts.views, viewUrn);

    expect(stateProps).toEqual({
      isRaceViewActive: true,
      raceStatus: "GOING_DOWN",
      raceURN: raceUrn,
      resultType: undefined,
      urn: "ppb:tbd:view:race:7|34365976.1245",
    });
  });

  it("should return urn only if no raceView is found", () => {
    getThrottle.mockReturnValueOnce({ isActive: true });
    getRaceViewByURN.mockReturnValueOnce(undefined);

    stateProps = setupMapStateToProps(viewUrn);

    expect(getRaceViewByURN).toHaveBeenCalledWith(state.layouts.views, viewUrn);
    expect(stateProps).toEqual({
      urn: viewUrn,
    });
  });

  it("should return isRaceViewActive as false if throttle is not active", () => {
    getThrottle.mockReturnValueOnce({ isActive: false });
    stateProps = setupMapStateToProps(viewUrn);

    expect(getThrottle).toHaveBeenCalledWith(state.entities.throttles, "RACE_VIEW_POLLING");
    expect(stateProps.isRaceViewActive).toBe(false);
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchSubscribeRaceUpdates", () => {
    it("should dispatch SUBSCRIBE_RACE_UPDATES action", () => {
      const { dispatchSubscribeRaceUpdates } = mapDispatchToProps;
      const raceURN = "urn:fake:race:1";

      expect(dispatchSubscribeRaceUpdates(raceURN)).toEqual({
        payload: { urn: raceURN },
        type: SUBSCRIBE_RACE_UPDATES,
      });
    });
  });

  describe("dispatchUnsubscribeRaceUpdates", () => {
    it("should dispatch UNSUBSCRIBE_RACE_UPDATES action", () => {
      const { dispatchUnsubscribeRaceUpdates } = mapDispatchToProps;
      const raceURN = "urn:fake:race:1";

      expect(dispatchUnsubscribeRaceUpdates(raceURN)).toEqual({
        payload: { urn: raceURN },
        type: UNSUBSCRIBE_RACE_UPDATES,
      });
    });
  });

  describe("dispatchFetchCatalogue", () => {
    it("should dispatch fetch action", () => {
      const { dispatchFetchCatalogue } = mapDispatchToProps;

      expect(dispatchFetchCatalogue(viewUrn)).toEqual({
        payload: { urn: viewUrn },
        type: FETCH_CATALOGUE,
      });
    });
  });
});
