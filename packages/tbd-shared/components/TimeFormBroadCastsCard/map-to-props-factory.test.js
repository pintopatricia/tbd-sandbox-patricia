import { UI__TOGGLE_TIMEFORM_CARD } from "@ppb/tbd-store/actions/interface";
import {
  UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT,
  UI__TIME_FORM_BROADCASTS_CARD_TOGGLE,
} from "@ppb/tbd-store/actions/media";
import { UPDATE_TIME_FORM_COLLAPSE } from "@ppb/tbd-store/actions/preferences";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getTimeFormBroadCastsCardByURN = jest.fn(() => ({
  typename: "TimeFormBroadCastsCard",
  urn: "ppb:tbd:card:timeFormBroadCasts:1.14.1200228.1",
  race: "ppb:race:1.14.1200228.1",
  broadcasts: {
    liveVideoUrl: "LIVE_VIDEO_URL",
    dataVizUrl: "DATA_VIZ_URL",
  },
}));

const getTimeFormCollapseState = jest.fn(() => true);

const raceMock = {
  urn: "ppb:race:1.14.1200228.1",
  meeting: "ppb:meeting:12290316",
  startTime: new Date("2020-02-28T14:00:00Z"),
  name: "888SPORT NOVICES' HANDICAP CHASE (4)",
  verdict: "dummy Verdict",
  runners: [
    "ppb:tbd:raceRunner:1.14.1200228.1/24550116",
    "ppb:tbd:raceRunner:1.14.1200228.1/24550117",
    "ppb:tbd:raceRunner:1.14.1200228.1/24550118",
    "ppb:tbd:raceRunner:1.14.1200228.1/24550119",
    "ppb:tbd:raceRunner:1.14.1200228.1/24550120",
  ],
};
const raceRunnersMock = {
  "ppb:tbd:raceRunner:1.14.1200228.1/24550116": {
    urn: "ppb:tbd:raceRunner:1.14.1200228.1/24550116",
    selectionId: 24550116,
    rating: 5,
    rating123: 2,
    ratingStars: 3,
    details: {
      saddleCloth: 8,
    },
    horse: {
      name: "VOLT FACE (FR)",
      sireName: "DECLARATION OF WAR (USA)",
      damName: "FLAMINGO SEA (USA)",
      age: 5,
      color: "CHESTNUT",
      sex: "GELDING",
    },
  },
  "ppb:tbd:raceRunner:1.14.1200228.1/24550117": {
    urn: "ppb:tbd:raceRunner:1.14.1200228.1/24550117",
    selectionId: 24550117,
    rating: 5,
    rating123: 1,
    ratingStars: 5,
    details: {
      saddleCloth: 8,
      draw: 0,
      equipmentDescription: "Visor and tongue strap",
    },
    horse: {
      name: "SKULK (FR)",
      sireName: "SKULK DECLARATION OF WAR (USA)",
      damName: "SKULK FLAMINGO SEA (USA)",
      age: 5,
      color: "CHESTNUT",
      sex: "GELDING",
    },
  },
  "ppb:tbd:raceRunner:1.14.1200228.1/24550118": {
    urn: "ppb:tbd:raceRunner:1.14.1200228.1/24550118",
    selectionId: 24550118,
    rating: 5,
    rating123: 0,
    ratingStars: 1,
    details: {
      saddleCloth: 8,
    },
    horse: {
      name: "SKULK 2 (FR)",
      sireName: "SKULK 2 DECLARATION OF WAR (USA)",
      damName: "SKULK 2 FLAMINGO SEA (USA)",
      age: 5,
      color: "CHESTNUT",
      sex: "GELDING",
    },
  },
  "ppb:tbd:raceRunner:1.14.1200228.1/24550119": {
    urn: "ppb:tbd:raceRunner:1.14.1200228.1/24550119",
    selectionId: 24550119,
    rating: 5,
    rating123: 3,
    details: {
      saddleCloth: 8,
    },
    horse: {
      name: "SKULK 3 (FR)",
      sireName: "SKULK 3 DECLARATION OF WAR (USA)",
      damName: "SKULK 3 FLAMINGO SEA (USA)",
      age: 5,
      color: "CHESTNUT",
      sex: "GELDING",
    },
  },
  "ppb:tbd:raceRunner:1.14.1200228.1/24550120": {
    urn: "ppb:tbd:raceRunner:1.14.1200228.1/24550120",
    selectionId: 24550120,
    rating: 5,
    details: {
      saddleCloth: 8,
    },
    horse: {
      name: "SKULK 4 (FR)",
      sireName: "SKULK 4 DECLARATION OF WAR (USA)",
      damName: "SKULK 4 FLAMINGO SEA (USA)",
      age: 5,
      color: "CHESTNUT",
      sex: "GELDING",
    },
  },
};
const getRaceWithRunnersByURN = jest.fn(() => ({ race: raceMock, raceRunners: raceRunnersMock }));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(() => "TRANSLATED_LABEL"),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createRaceWithRunnersByURNSelector: jest.fn(() => getRaceWithRunnersByURN),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getTimeFormBroadCastsCardByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors", () => ({
  createTimeFormCollapsePreferenceSelector: jest.fn(() => getTimeFormCollapseState),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const state = {
  layouts: {
    cards: {
      timeformbroadcasts: ["ppb:card"],
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
  let stateProps;
  beforeEach(jest.clearAllMocks);

  it("should get data from state and build correct view model", () => {
    stateProps = setupMapStateToProps("fakeTimeformCardUrn");

    expect(getTimeFormBroadCastsCardByURN).toHaveBeenCalledWith(
      state.layouts.cards.timeformbroadcasts,
      "fakeTimeformCardUrn",
    );
    expect(getRaceWithRunnersByURN).toHaveBeenCalledWith(state.entities, "ppb:race:1.14.1200228.1");

    expect(stateProps).toEqual({
      statusTitle: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
      timeFormTitle: "I18N.RACE.TIMEFORM_TITLE",
      dataVizUrl: "DATA_VIZ_URL",
      liveVideoUrl: "LIVE_VIDEO_URL",
      runnerRatings: [
        {
          name: "SKULK (FR)",
          stars: 5,
        },
        {
          name: "VOLT FACE (FR)",
          stars: 3,
        },
        {
          name: "SKULK 3 (FR)",
          stars: 0,
        },
      ],
      verdict: "dummy Verdict",
      verdictLabel: "I18N.RACE.TIMEFORM_VIEW",
      collapsed: true,
      cardUrn: "ppb:tbd:card:timeFormBroadCasts:1.14.1200228.1",
      raceUrn: "ppb:race:1.14.1200228.1",
    });
  });

  it("should return empty object if the card doesn't exist", () => {
    getTimeFormBroadCastsCardByURN.mockReturnValueOnce(undefined);
    stateProps = setupMapStateToProps("fakeTimeformCardUrn");

    expect(getTimeFormBroadCastsCardByURN).toHaveBeenCalledWith(
      state.layouts.cards.timeformbroadcasts,
      "fakeTimeformCardUrn",
    );

    expect(stateProps).toEqual({});
  });

  it("should return only broadcasts info if the race is not defined", () => {
    getTimeFormBroadCastsCardByURN.mockReturnValueOnce({
      race: undefined,
      broadcasts: {
        liveVideoUrl: "LIVE_VIDEO_URL",
        dataVizUrl: "DATA_VIZ_URL",
      },
    });
    stateProps = setupMapStateToProps("fakeTimeformCardUrn");

    expect(getTimeFormBroadCastsCardByURN).toHaveBeenCalledWith(
      state.layouts.cards.timeformbroadcasts,
      "fakeTimeformCardUrn",
    );

    expect(stateProps).toEqual({
      collapsed: true,
      statusTitle: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
      timeFormTitle: "I18N.RACE.TIMEFORM_TITLE",
      dataVizUrl: "DATA_VIZ_URL",
      liveVideoUrl: "LIVE_VIDEO_URL",
      runnerRatings: [],
    });
  });

  it("should return only race info if the broadcasts is not defined", () => {
    getTimeFormBroadCastsCardByURN.mockReturnValueOnce({
      urn: "ppb:tbd:card:timeFormBroadCasts:1.14.1200228.1",
      broadcasts: undefined,
      race: "ppb:race:1.14.1200228.1",
    });
    stateProps = setupMapStateToProps("fakeTimeformCardUrn");

    expect(getTimeFormBroadCastsCardByURN).toHaveBeenCalledWith(
      state.layouts.cards.timeformbroadcasts,
      "fakeTimeformCardUrn",
    );

    expect(stateProps).toEqual({
      statusTitle: "I18N.LIVE_VIDEO_STATUS.MATCH_VIEW",
      timeFormTitle: "I18N.RACE.TIMEFORM_TITLE",
      runnerRatings: [
        {
          name: "SKULK (FR)",
          stars: 5,
        },
        {
          name: "VOLT FACE (FR)",
          stars: 3,
        },
        {
          name: "SKULK 3 (FR)",
          stars: 0,
        },
      ],
      verdict: "dummy Verdict",
      verdictLabel: "I18N.RACE.TIMEFORM_VIEW",
      collapsed: true,
      dataVizUrl: null,
      liveVideoUrl: null,
      cardUrn: "ppb:tbd:card:timeFormBroadCasts:1.14.1200228.1",
      raceUrn: "ppb:race:1.14.1200228.1",
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchUpdateTimeFormCollapsePreference", () => {
    it("should dispatch UPDATE_TIME_FORM_COLLAPSE", () => {
      const { dispatchUpdateTimeFormCollapsePreference } = mapDispatchToProps;
      const isExpanded = false;

      expect(dispatchUpdateTimeFormCollapsePreference(isExpanded)).toEqual({
        payload: { isCollapsed: true },
        type: UPDATE_TIME_FORM_COLLAPSE,
      });
    });
  });

  describe("dispatchToggleTimeForm", () => {
    it("should dispatch UI__TOGGLE_TIMEFORM_CARD action", () => {
      const { dispatchToggleTimeForm } = mapDispatchToProps;
      const isExpanded = false;
      const raceUrn = "urn:fake:race:1";

      expect(dispatchToggleTimeForm(isExpanded, raceUrn)).toEqual({
        payload: { isExpanded, raceUrn },
        type: UI__TOGGLE_TIMEFORM_CARD,
      });
    });
  });

  describe("dispatchTimeFormBroadCastsCardToggle", () => {
    it("should dispatch UI__TIME_FORM_BROADCASTS_CARD_TOGGLE action", () => {
      const { dispatchTimeFormBroadCastsCardToggle } = mapDispatchToProps;
      const isExpanded = false;
      const raceUrn = "urn:fake:race:1";
      const cardUrn = "urn:fake:card:1";

      expect(dispatchTimeFormBroadCastsCardToggle(isExpanded, cardUrn, raceUrn)).toEqual({
        payload: { isExpanded, raceUrn, cardUrn },
        type: UI__TIME_FORM_BROADCASTS_CARD_TOGGLE,
      });
    });
  });

  describe("dispatchMediaPlayerLoaded", () => {
    it("should dispatch UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT action", () => {
      const { dispatchMediaPlayerLoaded } = mapDispatchToProps;
      const label = "live video";
      const raceUrn = "urn:fake:race:1";

      expect(dispatchMediaPlayerLoaded(label, raceUrn)).toEqual({
        payload: { label, raceUrn },
        type: UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT,
      });
    });
  });
});
