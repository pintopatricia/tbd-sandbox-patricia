import { PUSH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

let getRaceViewLinksCardHydratedByURN = jest.fn(() => ({
  urn: "ppb:tbd:card:raceviewlinks:1",
  typename: "RaceViewLinksCard",
  raceViewLinks: [
    {
      urn: "ppb:tbd:raceviewlinks:1",
      viewLink: {
        viewUrn: "ppb:tbd:view:race:7|30089529.1910",
        viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.1910",
      },
      race: "ppb:race:30089529.1910",
    },
    {
      urn: "ppb:tbd:raceviewlinks:2",
      viewLink: {
        viewUrn: "ppb:tbd:view:race:7|30089529.1937",
        viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.1937",
      },
      race: "ppb:race:30089529.1937",
    },
    {
      urn: "ppb:tbd:raceviewlinks:3",
      viewLink: {
        viewUrn: "ppb:tbd:view:race:7|30089529.2004",
        viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.2004",
      },
      race: "ppb:race:30089529.2004",
    },
  ],
  race: "ppb:race:30089529.1910",
}));

const getPropsForRaceViewLinksVm = jest.fn(() => ({
  raceItems: [
    {
      viewLink: {
        viewUrn: "ppb:tbd:view:race:7|30089529.1910",
        viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.1910",
      },
      startTime: "19:10",
    },
    {
      viewLink: {
        viewUrn: "ppb:tbd:view:race:7|30089529.1937",
        viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.1937",
      },
      startTime: "19:37",
    },
    {
      viewLink: {
        viewUrn: "ppb:tbd:view:race:7|30089529.2004",
        viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.2004",
      },
      startTime: "20:04",
    },
  ],
  defaultRaceIndex: 0,
}));

beforeEach(jest.clearAllMocks);

jest.mock("@ppb/tbd-store/state/layout/cards/race-viewlinks/race-viewlinks-selectors", () => ({
  createRaceViewLinksCardHydratedByURNSelector: jest.fn(() => getRaceViewLinksCardHydratedByURN),
}));

jest.mock("../../view-model-factories/race-viewlinks", () => ({
  createRaceViewLinksViewModel: jest.fn(() => getPropsForRaceViewLinksVm),
}));

const userDetailsMock = {
  localeCodeBcp47: "locale",
  timezone: "timezone",
};

const getUserDetails = jest.fn(() => userDetailsMock);

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
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
      raceviewlinks: ["ppb:card"],
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
  it("should get data from state and build correct view model", () => {
    const stateProps = setupMapStateToProps("fakeRaceViewLinksCardUrn");

    expect(getRaceViewLinksCardHydratedByURN).toHaveBeenCalledWith(state, "fakeRaceViewLinksCardUrn");
    expect(getUserDetails).toHaveBeenCalledWith(state);
    expect(stateProps).toEqual({
      urn: "fakeRaceViewLinksCardUrn",
      races: [
        {
          viewLink: {
            viewUrn: "ppb:tbd:view:race:7|30089529.1910",
            viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.1910",
          },
          startTime: "19:10",
        },
        {
          viewLink: {
            viewUrn: "ppb:tbd:view:race:7|30089529.1937",
            viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.1937",
          },
          startTime: "19:37",
        },
        {
          viewLink: {
            viewUrn: "ppb:tbd:view:race:7|30089529.2004",
            viewUrl: "horse-racing/fair-(rsa)-26th-oct/r-7%7C30089529.2004",
          },
          startTime: "20:04",
        },
      ],
      defaultRaceIndex: 0,
    });
  });

  it("should return default data when the raceViewLinksCard is not found", () => {
    getRaceViewLinksCardHydratedByURN = jest.fn(() => undefined);
    const stateProps = setupMapStateToProps("fakeRaceViewLinksCardUrn");

    expect(getRaceViewLinksCardHydratedByURN).toHaveBeenCalledWith(state, "fakeRaceViewLinksCardUrn");
    expect(stateProps).toEqual({
      urn: "fakeRaceViewLinksCardUrn",
      races: [],
      defaultRaceIndex: undefined,
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

  describe("dispatchRaceViewLinksLinkClick", () => {
    it("should dispatch UI__RACE_VIEW_LINKS_LINK_CLICK Action", () => {
      const { dispatchRaceViewLinksLinkClick } = mapDispatchToProps;
      expect(dispatchRaceViewLinksLinkClick("fakeRaceViewLinksCardUrn", "href.com", true)).toEqual({
        payload: { cardUrn: "fakeRaceViewLinksCardUrn", href: "href.com", isRaceClosed: true },
        type: "UI__RACE_VIEW_LINKS_LINK_CLICK",
      });
    });
  });
});
