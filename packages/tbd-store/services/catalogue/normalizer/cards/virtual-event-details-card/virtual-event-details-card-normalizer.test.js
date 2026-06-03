import normalizeVirtualEventDetailsCardFragmentIntoVirtualEventDetailsCard from "./virtual-event-details-card-normalizer";

const BFF_RESPONSE = {
  __typename: "VirtualEventDetailsCard",
  urn: "ppb:tbd:card:virtualEventDetails:112233",
  virtualEvent: {
    __typename: "VirtualEvent",
    eventId: 1,
    name: "Event Name",
    openDate: "2020-07-08T10:20:00.000Z",
    sport: {
      __typename: "VirtualSport",
      urn: "ppb:virtualSport:1",
    },
    venue: "some venue",
    duration: 111,
    distance: 222,
    urn: "ppb:virtualEvent:1",
  },
};

describe("Virtual event details card normalizer", () => {
  describe("normalizeVirtualEventDetailsCardFragmentIntoVirtualEventDetailsCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = normalizeVirtualEventDetailsCardFragmentIntoVirtualEventDetailsCard(BFF_RESPONSE);

      expect(data).toEqual({
        typename: "VirtualEventDetailsCard",
        urn: "ppb:tbd:card:virtualEventDetails:112233",
        virtualEvent: "ppb:virtualEvent:1",
      });
    });
  });
});
