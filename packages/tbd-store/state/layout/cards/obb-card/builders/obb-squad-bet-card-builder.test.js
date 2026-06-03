import { buildObbSquadBetCard } from "./obb-squad-bet-card-builder";

describe("buildObbSquadBetCard", () => {
  it("should transform NormalizedObbSquadBetCard into ObbSquadBetCard", () => {
    const normalizedCard = {
      urn: "urn:match:5678",
      typename: "ObbSquadBetCard",
      title: "Team Showdown",
      sportevent: { id: "event1", name: "Team A vs Team B" },
      squadParticipants: [
        { urn: "player:1", name: "Player 1" },
        { urn: "player:2", name: "Player 2" },
      ],
      eventParticipants: [
        { urn: "player:1", name: "Player 1" },
        { urn: "player:2", name: "Player 2" },
      ],
      incidentType: "GOALS",
      legs: [{ id: "leg1" }, { id: "leg2" }],
      defaultLegs: [{ id: "leg1" }],
      outcomesLabel: "First Half Goals",
      defaultOutcomeIndex: 2,
      statsLabel: "statsLabel",
      showModalEntryPoint: true,
      entryPointLabel: "Entry Point Label",
      participantInfo: "Participant Info",
      filterTags: [{ type: "TAG", label: "Tag1" }],
    };

    const expected = {
      urn: "urn:match:5678",
      typename: "ObbSquadBetCard",
      title: "Team Showdown",
      sportevent: { id: "event1", name: "Team A vs Team B" },
      squadParticipants: ["player:1", "player:2"],
      eventParticipants: ["player:1", "player:2"],
      incidentType: "GOALS",
      legs: [{ id: "leg1" }, { id: "leg2" }],
      defaultLegs: ["leg1"],
      outcomesLabel: "First Half Goals",
      defaultOutcomeIndex: 2,
      statsLabel: "statsLabel",
      showModalEntryPoint: true,
      entryPointLabel: "Entry Point Label",
      participantInfo: "Participant Info",
      filterTags: [{ type: "TAG", label: "Tag1" }],
      modalDefaultOutcomeIndex: 0,
      modalError: null,
      modalLegs: [],
      modalParticipants: [],
      modalIsLoadingQuotes: false,
    };

    const result = buildObbSquadBetCard(normalizedCard);
    expect(result).toEqual(expected);
  });

  it("should set title to undefined if null", () => {
    const normalizedCard = {
      urn: "urn:match:5678",
      typename: "ObbSquadBetCard",
      title: null,
      subtitle: "First Half Goals",
      sportevent: { id: "event1", name: "Team A vs Team B" },
      squadParticipants: [{ urn: "player:1", name: "Player 1" }],
      eventParticipants: [{ urn: "player:1", name: "Player 1" }],
      incidentType: "GOALS",
      legs: [],
      defaultLegs: [],
    };

    const result = buildObbSquadBetCard(normalizedCard);
    expect(result.title).toBeUndefined();
  });
});
