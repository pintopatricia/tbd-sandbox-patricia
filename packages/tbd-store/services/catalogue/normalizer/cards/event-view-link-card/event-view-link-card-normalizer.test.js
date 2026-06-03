import victim from "./event-view-link-card-normalizer";

const BFF_RESPONSE = {
  urn: "ppb:tbd:card:eventViewLink:12345",
  __typename: "EventViewLinkCard",
  eventViewLinkFixture: { __typename: "FootballFixture", urn: "ppb:fixture:12345" },
  sportevent: { __typename: "SportsEvent", urn: "ppb:event:12345" },
  viewLink: {
    viewUrn: "ppb:tbd:view:event:12345",
    viewUrl: "/",
  },
};

describe("EventViewLinkCard normalizer", () => {
  describe("normalizeEventViewLinkCardFragmentIntoEventViewLinkCard", () => {
    it("should correctly transform and return the data object", () => {
      const { data } = victim(BFF_RESPONSE);
      expect(data).toEqual({
        urn: "ppb:tbd:card:eventViewLink:12345",
        typename: "EventViewLinkCard",
        fixture: "ppb:fixture:12345",
        sportevent: "ppb:event:12345",
        viewLink: {
          viewUrl: "/",
          viewUrn: "ppb:tbd:view:event:12345",
        },
      });
    });

    describe("when no eventViewLinkFixture is present", () => {
      it("should correctly transform and return the data object without fixture", () => {
        const { data } = victim({
          ...BFF_RESPONSE,
          eventViewLinkFixture: undefined,
        });
        expect(data).toEqual({
          urn: "ppb:tbd:card:eventViewLink:12345",
          typename: "EventViewLinkCard",
          sportevent: "ppb:event:12345",
          viewLink: {
            viewUrl: "/",
            viewUrn: "ppb:tbd:view:event:12345",
          },
        });
      });
    });
  });
});
