import { buildObbSquadVsSquadCard } from "./obb-squad-vs-squad-card-builder";

describe("buildObbSquadVsSquadCard", () => {
  it("should transform NormalizedObbSquadVsSquadCard into ObbSquadVsSquadCard", () => {
    const normalizedCard = {
      urn: "urn:match:5678",
      typename: "ObbSquadVsSquadCard",
      title: "Team Showdown",
      sportevent: { id: "event1", name: "Team A vs Team B" },
      firstSquadParticipants: [
        { urn: "player:1", name: "Player 1" },
        { urn: "player:2", name: "Player 2" },
      ],
      secondSquadParticipants: [
        { urn: "player:1", name: "Player 1" },
        { urn: "player:2", name: "Player 2" },
      ],
      eventParticipants: [
        { urn: "player:1", name: "Player 1" },
        { urn: "player:2", name: "Player 2" },
      ],
      incidentType: "GOALS",
      defaultLegs: [{ id: "leg1" }],
      outcomesLabel: "First Half Goals",
      statsLabel: "statsLabel",
      showModalEntryPoint: true,
      participantInfo: "Participant Info",
      filterTags: [{ type: "TAG", label: "Tag1" }],
    };

    const expected = {
      urn: "urn:match:5678",
      typename: "ObbSquadVsSquadCard",
      title: "Team Showdown",
      sportevent: { id: "event1", name: "Team A vs Team B" },
      firstSquadParticipants: ["player:1", "player:2"],
      secondSquadParticipants: ["player:1", "player:2"],
      eventParticipants: ["player:1", "player:2"],
      incidentType: "GOALS",
      defaultLegs: ["leg1"],
      outcomesLabel: "First Half Goals",
      statsLabel: "statsLabel",
      showModalEntryPoint: true,
      participantInfo: "Participant Info",
      filterTags: [{ type: "TAG", label: "Tag1" }],
      modalError: null,
      modalLegs: [],
      firstSquadModalParticipants: [],
      secondSquadModalParticipants: [],
      modalIsLoadingQuotes: false,
    };

    const result = buildObbSquadVsSquadCard(normalizedCard);
    expect(result).toEqual(expected);
  });

  it("should set title to undefined if null", () => {
    const normalizedCard = {
      urn: "urn:match:5678",
      typename: "ObbSquadVsSquadCard",
      title: null,
      subtitle: "First Half Goals",
      sportevent: { id: "event1", name: "Team A vs Team B" },
      firstSquadParticipants: [{ urn: "player:1", name: "Player 1" }],
      secondSquadParticipants: [{ urn: "player:1", name: "Player 1" }],
      eventParticipants: [{ urn: "player:1", name: "Player 1" }],
      incidentType: "GOALS",
      defaultLegs: [],
    };

    const result = buildObbSquadVsSquadCard(normalizedCard);
    expect(result.title).toBeUndefined();
  });
});
