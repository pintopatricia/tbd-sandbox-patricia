import { buildObbPvpCard } from "./obb-pvp-card-builder";

describe("buildObbPvpCard", () => {
  it("should correctly map all fields from the normalized Pvp Card to the Pvp Card", () => {
    const normalizedCard = {
      urn: "card:urn",
      typename: "ObbPvpCard",
      title: "Title",
      sportevent: { urn: "eventUrn", name: "eventName" },
      participants: [{ urn: "participant1" }, { urn: "participant2" }],
      incidentType: "GOALS",
      participantInfo: { name: "participantInfo" },
      filterTags: [{ type: "TAG", label: { name: "Tag1" } }],
      defaultLegs: [{ id: "defaultLegId" }],
      teams: {
        home: { id: "team1", name: "team1", color: "#0000" },
        away: { id: "team2", name: "team2", color: "#00345" },
      },
    };

    const expectedCard = {
      urn: "card:urn",
      typename: "ObbPvpCard",
      title: "Title",
      sportevent: { urn: "eventUrn", name: "eventName" },
      participantInfo: { name: "participantInfo" },
      filterTags: [{ type: "TAG", label: { name: "Tag1" } }],
      incidentType: "GOALS",
      teams: {
        home: { id: "team1", name: "team1", color: "#0000" },
        away: { id: "team2", name: "team2", color: "#00345" },
      },
      participants: ["participant1", "participant2"],
      selectedLegs: ["defaultLegId"],
      legs: [],
    };

    const result = buildObbPvpCard(normalizedCard);
    expect(result).toEqual(expectedCard);
  });
});
