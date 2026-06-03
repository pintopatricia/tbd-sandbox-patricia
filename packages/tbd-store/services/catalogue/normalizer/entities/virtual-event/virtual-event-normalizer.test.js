import normalizeVirtualEventFragmentIntoVirtualEvent from "./virtual-event-normalizer";

const BFF_RESPONSE = {
  __typename: "VirtualEvent",
  eventId: 1,
  name: "Event Name",
  openDate: "2022-05-05T14:50:00.000Z",
  sport: {
    __typename: "VirtualSport",
    urn: "ppb:virtualSport:1",
  },
  venue: "some venue",
  duration: 111,
  distance: 222,
  urn: "ppb:virtualEvent:1",
};

const PAST_EVENT_RESPONSE = {
  ...BFF_RESPONSE,
  openDate: "2022-05-05T14:46:00.000Z",
};

const FUTURE_EVENT_RESPONSE = {
  ...BFF_RESPONSE,
  openDate: "2022-05-05T14:52:00.000Z",
};

jest.useFakeTimers("modern").setSystemTime(new Date("2022-05-05T14:48:00.000Z"));

describe("VirtualEvent normalizer", () => {
  describe("normalizeVirtualEventFragmentIntoVirtualEvent", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeVirtualEventFragmentIntoVirtualEvent(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "VirtualEvent",
        eventId: 1,
        name: "Event Name",
        openDate: "2022-05-05T14:50:00.000Z",
        sport: "ppb:virtualSport:1",
        venue: "some venue",
        isExpired: false,
        duration: 111,
        distance: 222,
        urn: "ppb:virtualEvent:1",
      });
    });

    describe("when the openDate is in the past", () => {
      it("should mark the event as expired", () => {
        const { data } = normalizeVirtualEventFragmentIntoVirtualEvent(PAST_EVENT_RESPONSE);

        expect(data.isExpired).toEqual(true);
      });
    });

    describe("when the openDate is in the future", () => {
      it("should mark the event as not expired", () => {
        const { data } = normalizeVirtualEventFragmentIntoVirtualEvent(FUTURE_EVENT_RESPONSE);

        expect(data.isExpired).toEqual(false);
      });
    });
  });
});
