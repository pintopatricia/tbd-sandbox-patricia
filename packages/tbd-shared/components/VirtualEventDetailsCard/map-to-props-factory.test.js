import { getVirtualSportByURN } from "@ppb/tbd-store/state/entities/virtual-sport/virtual-sport-selectors";
import { makeMapStateToProps, VirtualEventKind } from "./map-to-props-factory";
import { formatTime } from "../../helpers/dates";

const getVirtualEventDetailsCardByURN = jest.fn(() => ({
  typename: "VirtualEventDetailsCard",
  urn: "ppb:tbd:card:virtualEventDetails:112233",
  virtualEvent: "ppb:virtualEvent:445566",
}));

const getVirtualEventByURN = jest.fn(() => ({
  typename: "VirtualEvent",
  urn: "ppb:virtualEvent:1",
  eventId: 1,
  name: "Sporting Lisabona v Benfica Lisabona",
  openDate: "2020-07-08T10:20:00.000Z",
  sport: "ppb:virtualSport:1",
  venue: "some venue",
  distance: "some distance",
  duration: 111,
}));

const getUserDetails = jest.fn(() => ({
  localeCodeBcp47: "locale",
  timezone: "timezone",
}));

jest.mock("@ppb/tbd-store/state/entities/virtual-event/virtual-event-selectors", () => ({
  createVirtualEventByURNSelector: jest.fn(() => getVirtualEventByURN),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getVirtualEventDetailsCardByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("@ppb/tbd-store/state/entities/virtual-sport/virtual-sport-selectors", () => ({
  getVirtualSportByURN: jest.fn(() => ({
    typename: "VirtualSport",
    urn: "ppb:virtualEvent:1",
    kind: "FOOTBALL",
  })),
}));

jest.mock("../../helpers/dates", () => ({
  formatTime: jest.fn((date) => `timefor:${date}`),
}));

const state = {
  layouts: { cards: { virtualeventdetails: ["ppb:card"] } },
  entities: { virtualevents: {}, virtualsports: {} },
};

const setupMapStateToProps = (urn) => {
  const containerProps = { urn };
  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  afterEach(jest.clearAllMocks);

  it("should return empty object if the VirtualEventDetailsCard doesn't exist", () => {
    getVirtualEventDetailsCardByURN.mockReturnValueOnce(undefined);
    const stateProps = setupMapStateToProps("some card urn");

    expect(stateProps).toEqual({});
  });

  it("should return empty object if the VirtualEvent doesn't exist", () => {
    getVirtualEventByURN.mockReturnValueOnce(undefined);
    const stateProps = setupMapStateToProps("some card urn");

    expect(stateProps).toEqual({});
  });

  it("should return empty object if the VirtualSport doesn't exist", () => {
    getVirtualSportByURN.mockReturnValueOnce(undefined);
    const stateProps = setupMapStateToProps("some card urn");

    expect(stateProps).toEqual({});
  });

  describe("when virtual sport is racing", () => {
    it("should get data from state and build correct view model", () => {
      getVirtualSportByURN.mockReturnValueOnce({
        typename: "VirtualSport",
        urn: "ppb:virtualEvent:1",
        kind: "RACING",
      });

      const stateProps = setupMapStateToProps("some card urn");

      expect(getVirtualEventDetailsCardByURN).toHaveBeenCalledTimes(1);
      expect(getVirtualEventDetailsCardByURN).toHaveBeenCalledWith(
        state.layouts.cards.virtualeventdetails,
        "some card urn",
      );

      expect(getVirtualEventByURN).toHaveBeenCalledTimes(1);
      expect(getVirtualEventByURN).toHaveBeenCalledWith(state.entities.virtualevents, "ppb:virtualEvent:445566");

      expect(stateProps).toEqual({
        kind: VirtualEventKind.Racing,
        name: "Sporting Lisabona v Benfica Lisabona",
        startTime: "timefor:2020-07-08T10:20:00.000Z",
        venue: "some venue",
        showMeetingInfo: true,
        distance: "some distance",
      });
    });
  });

  describe("when virtual sport is football", () => {
    it("should get data from state and build correct view model", () => {
      getVirtualSportByURN.mockReturnValueOnce({
        typename: "VirtualSport",
        urn: "ppb:virtualEvent:1",
        kind: "FOOTBALL",
      });

      const stateProps = setupMapStateToProps("some card urn");

      expect(getVirtualEventDetailsCardByURN).toHaveBeenCalledTimes(1);
      expect(getVirtualEventDetailsCardByURN).toHaveBeenCalledWith(
        state.layouts.cards.virtualeventdetails,
        "some card urn",
      );

      expect(getVirtualEventByURN).toHaveBeenCalledTimes(1);
      expect(getVirtualEventByURN).toHaveBeenCalledWith(state.entities.virtualevents, "ppb:virtualEvent:445566");

      expect(stateProps).toEqual({
        kind: VirtualEventKind.Football,
        home: "Sporting Lisabona",
        away: "Benfica Lisabona",
      });
    });
  });

  describe("when virtual sport is OTHER", () => {
    it("should return empty view model", () => {
      getVirtualSportByURN.mockReturnValueOnce({
        typename: "VirtualSport",
        urn: "ppb:virtualEvent:1",
        kind: "OTHER",
      });

      const stateProps = setupMapStateToProps("some card urn");

      expect(getVirtualEventDetailsCardByURN).toHaveBeenCalledTimes(1);
      expect(getVirtualEventDetailsCardByURN).toHaveBeenCalledWith(
        state.layouts.cards.virtualeventdetails,
        "some card urn",
      );

      expect(getVirtualEventByURN).toHaveBeenCalledTimes(1);
      expect(getVirtualEventByURN).toHaveBeenCalledWith(state.entities.virtualevents, "ppb:virtualEvent:445566");
      expect(getUserDetails).toHaveBeenCalledWith(state);
      expect(formatTime).toHaveBeenCalledWith("2020-07-08T10:20:00.000Z", "locale", "timezone");

      expect(stateProps).toEqual({});
    });
  });
});
