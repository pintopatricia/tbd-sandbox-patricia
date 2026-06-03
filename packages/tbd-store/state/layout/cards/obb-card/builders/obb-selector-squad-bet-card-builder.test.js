import {
  buildObbSquadBetCardSelector,
  buildObbSquadBetCardWithModalFieldsSelector,
} from "./obb-selector-squad-bet-card-builder";

describe("buildObbSquadBetCardSelector", () => {
  const participants = {
    player1: { id: "player1", name: "Player One" },
    player2: { id: "player2", name: "Player Two" },
  };

  const obbCard = {
    urn: "urn:match:1234",
    typename: "ObbSquadBetCard",
    title: "Card Title",
    outcomesLabel: "Card Subtitle",
    sportevent: { id: "sportevent1", name: "Match 1" },
    squadParticipants: ["player1", "player2"],
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

  it("should transform obbCard into SelectorObbSquadBetCard", () => {
    const result = buildObbSquadBetCardSelector(obbCard, participants, incidentTypes);

    expect(result).toEqual({
      urn: "urn:match:1234",
      typename: "ObbSquadBetCard",
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
      squadParticipants: [
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
      legs: [],
      outcomesLabel: "Card Subtitle",
      defaultOutcomeIndex: 2,
      statsLabel: "statsLabel",
      showModalEntryPoint: true,
      entryPointLabel: "Entry Point Label",
      participantInfo: "Participant Info",
      filterTags: [{ type: "TAG", label: "Tag1" }],
    });
  });

  it("should transform obbCard into SelectorObbSquadBetCardWithModalFields", () => {
    const result = buildObbSquadBetCardWithModalFieldsSelector(obbCard, participants, incidentTypes);

    expect(result).toEqual({
      urn: "urn:match:1234",
      typename: "ObbSquadBetCard",
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
      squadParticipants: [
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
      legs: [],
      outcomesLabel: "Card Subtitle",
      defaultOutcomeIndex: 2,
      statsLabel: "statsLabel",
      showModalEntryPoint: true,
      entryPointLabel: "Entry Point Label",
      participantInfo: "Participant Info",
      filterTags: [{ type: "TAG", label: "Tag1" }],
      modalLegs: [],
      modalParticipants: [
        {
          id: "player1",
          name: "Player One",
        },
        {
          id: "player2",
          name: "Player Two",
        },
      ],
      modalError: null,
      modalDefaultOutcomeIndex: 2,
      modalIsLoadingQuotes: false,
    });
  });
});
