import { buildObbSquadVsSquadCardSelector } from "./obb-selector-squad-vs-squad-card-builder";

describe("buildObbSquadVsSquadCardSelector", () => {
  const participants = {
    player1: { id: "player1", name: "Player One" },
    player2: { id: "player2", name: "Player Two" },
  };

  const obbCard = {
    urn: "urn:match:1234",
    typename: "ObbSquadVsSquadCard",
    title: "Card Title",
    outcomesLabel: "Card Subtitle",
    sportevent: { id: "sportevent1", name: "Match 1" },
    firstSquadParticipants: ["player1", "player2"],
    secondSquadParticipants: ["player1", "player2"],
    eventParticipants: ["player1", "player2"],
    incidentType: "GOALS",
    defaultLegs: ["leg1", "leg2"],
    legs: [],
    defaultOutcomeIndex: 2,
    statsLabel: "statsLabel",
    showModalEntryPoint: true,
    entryPointLabel: "Entry Point Label",
    participantInfo: "Participant Info",
    filterTags: [{ type: "TAG", label: "Tag1" }],
    modalDefaultOutcomeIndex: 2,
    modalError: null,
    modalLegs: [],
    modalParticipants: ["player1", "player2"],
    modalIsLoadingQuotes: false,
  };

  const incidentTypes = {
    GOALS: {
      id: "GOALS",
    },
  };

  it("should transform obbCard into SelectorObbSquadVsSquadCard", () => {
    const result = buildObbSquadVsSquadCardSelector(obbCard, participants, incidentTypes);

    expect(result).toEqual({
      urn: "urn:match:1234",
      typename: "ObbSquadVsSquadCard",
      title: "Card Title",
      sportevent: { id: "sportevent1", name: "Match 1" },
      eventParticipants: [
        {
          id: "player1",
          name: "Player One",
        },
        {
          id: "player2",
          name: "Player Two",
        },
      ],
      firstSquadParticipants: [
        {
          id: "player1",
          name: "Player One",
        },
        {
          id: "player2",
          name: "Player Two",
        },
      ],
      secondSquadParticipants: [
        {
          id: "player1",
          name: "Player One",
        },
        {
          id: "player2",
          name: "Player Two",
        },
      ],
      incidentType: "GOALS",
      defaultLegs: ["leg1", "leg2"],
      outcomesLabel: "Card Subtitle",
      statsLabel: "statsLabel",
      showModalEntryPoint: true,
      participantInfo: "Participant Info",
      filterTags: [{ type: "TAG", label: "Tag1" }],
    });
  });
});
