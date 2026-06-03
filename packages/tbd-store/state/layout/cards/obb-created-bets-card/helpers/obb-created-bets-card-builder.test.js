import { buildObbCreatedBetsCard } from "./obb-created-bets-card-builder";

describe("buildObbCreatedBetsCard", () => {
  it("should transform NormalizedObbCreatedBetsCard into ObbCreatedBetsCard", () => {
    const normalizedCard = {
      urn: "card:urn:123",
      typename: "ObbCreatedBetsCard",
      fixture: "fixture:urn:456",
      eventViewLink: {
        viewUrl: "/eventUrl",
        viewUrn: "view:urn:event",
      },
      footerViewLink: {
        viewUrl: "/footerUrl",
        viewUrn: "view:urn:footer",
      },
      bettingOpportunities: [
        {
          participants: [
            { urn: "participant:1", name: "Participant 1" },
            { urn: "participant:2", name: "Participant 2" },
          ],
          leg: { id: "leg1" },
        },
      ],
    };

    const expected = {
      typename: "ObbCreatedBetsCard",
      urn: "card:urn:123",
      fixture: "fixture:urn:456",
      eventViewLink: {
        viewUrl: "/eventUrl",
        viewUrn: "view:urn:event",
      },
      footerViewLink: {
        viewUrl: "/footerUrl",
        viewUrn: "view:urn:footer",
      },
      bettingOpportunities: [
        {
          participants: ["participant:1", "participant:2"],
          legId: "leg1",
        },
      ],
    };

    const result = buildObbCreatedBetsCard(normalizedCard);
    expect(result).toEqual(expected);
  });
});
