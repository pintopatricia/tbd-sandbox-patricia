import { createCardByURNSelector } from "../cards-selectors";
import { createCardGroupByURNSelector } from "../../cardgroups/cardgroups-selectors";
import {
  createObbCardByURNSelector,
  createObbSquadBetCardWithModalFieldsByURNSelector,
  createObbCardPositionSelector,
} from "./obb-card-selectors";

jest.mock("../cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("../../cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(),
}));

const legId = "r6i5hui5dr6bb72h";

const obbCardGroup = {
  urn: "ppb:obb:cardgroup:aCH6URAAACAAyoQD/e/34136457",
  typename: "ObbCardGroup",
  title: "Match Ups",
  event: {
    urn: "ppb:event:34136457",
    name: "Al Ahly Cairo v Inter Miami CF",
    openDate: "2025-06-15T00:00:00.000Z",
    __typename: "SportsEvent",
  },
  moreInfoLabel: "More Info",
  moreInfoDetails: [],
  bettingWindowOffset: 90,
  sections: [
    {
      urn: "ppb:obb:section:section1/e/34136457",
      typename: "ObbSection",
      title: "Shots on target",
      icon: null,
      isExpanded: false,
      layouts: [
        {
          urn: "ppb:obb:cardslayout:stacked:section1/obb_cards_layout$85d29ab6-fb30-42ab-92af-9db946c48bd2/e/34136457",
          typename: "ObbCardsStackedLayout",
          items: [
            {
              urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/34136457",
              typename: "ObbPvpCard",
            },
            {
              urn: "ppb:obb:card:pvp:aD1_rhAAACEAZm70/e/34136457",
              typename: "ObbPvpCard",
            },
          ],
        },
        {
          urn: "ppb:obb:cardslayout:swimlane:section1/obb_cards_layout$c3f179a7-5e29-43e0-902f-91b7e389385f/e/34136457",
          typename: "ObbCardsSwimlaneLayout",
          title: "Race To X Points",
          items: [
            {
              urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/34136457",
              typename: "ObbPvpCard",
            },
            {
              urn: "ppb:obb:card:pvp:aD1_rhAAACEAZm70/e/34136457",
              typename: "ObbPvpCard",
            },
            {
              urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/34136457",
              typename: "ObbPvpCard",
            },
          ],
        },
      ],
    },
    {
      urn: "ppb:obb:section:section2/e/34136457",
      typename: "ObbSection",
      title: "Fouls won",
      icon: null,
      isExpanded: false,
      layouts: [],
    },
    {
      urn: "ppb:obb:section:section3/e/34136457",
      typename: "ObbSection",
      title: "Assists",
      icon: null,
      isExpanded: false,
      layouts: [
        {
          urn: "ppb:obb:cardslayout:stacked:section3/obb_cards_layout$85d29ab6-fb30-42ab-92af-9db946c48bd2/e/34136457",
          typename: "ObbCardsStackedLayout",
          items: [
            {
              urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/34136457",
              typename: "ObbPvpCard",
            },
            {
              urn: "ppb:obb:card:pvp:aD1_rhAAACEAZm70/e/34136457",
              typename: "ObbPvpCard",
            },
          ],
        },
        {
          urn: "ppb:obb:cardslayout:swimlane:section3/obb_cards_layout$c3f179a7-5e29-43e0-902f-91b7e389385f/e/34136457",
          typename: "ObbCardsSwimlaneLayout",
          title: "Race To X Points",
          items: [
            {
              urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/34136457",
              typename: "ObbPvpCard",
            },
            {
              urn: "ppb:obb:card:pvp:aD1_rhAAACEAZm70/e/34136457",
              typename: "ObbPvpCard",
            },
            {
              urn: "ppb:obb:card:pvp:ZypHBBIAACAAKdvU/e/34136457",
              typename: "ObbPvpCard",
            },
          ],
        },
      ],
    },
  ],
};

const obbPvpCard = {
  urn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
  typename: "ObbPvpCard",
  incidentType: "GOALS",
  aggregators: ["PARTICPANT_1_TO_WIN"],
  operators: ["MORE"],
  participants: ["ppb:obb:footballPlayer:4404/e/33956657", "ppb:obb:footballPlayer:4405/e/33956657"],
  teams: {
    home: {
      id: "1",
      name: "Burnley",
      color: "00000",
    },
    away: {
      id: "2",
      name: "Chelsea",
      color: "11111",
    },
  },
  periods: ["HALF1", "MATCH"],
  title: "Title",
  defaultLegs: [legId],
  selectedLegs: [legId],
};

const obbSquadBetCard = {
  urn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
  typename: "ObbSquadBetCard",
  title: "Squad Bet Card Title",
  outcomesLabel: "Squad Bet Card Subtitle",
  sportevent: {
    typename: "SportsEvent",
    urn: "ppb:event:34278006",
    name: "Man Utd v Athletic Bilbao",
  },
  eventParticipants: [
    "ppb:obb:footballPlayer:35716/e/34278006",
    "ppb:obb:footballPlayer:35716/e/34278006",
    "ppb:obb:footballPlayer:35716/e/34278006",
    "ppb:obb:footballPlayer:35716/e/34278006",
    "ppb:obb:footballPlayer:35716/e/34278006",
    "ppb:obb:footballPlayer:35716/e/34278006",
  ],
  squadParticipants: ["ppb:obb:footballPlayer:35716/e/34278006", "ppb:obb:footballPlayer:35716/e/34278006"],
  defaultLegs: ["b6139aa8a3cf3e98", "57bfff3876bd2e68"],
  incidentType: "GOALS",
  defaultOutcomeIndex: 2,
  statsLabel: "statsLabel",
  modalDefaultOutcomeIndex: 2,
  modalError: null,
  modalLegs: ["b6139aa8a3cf3e98", "57bfff3876bd2e68"],
  modalParticipants: ["ppb:obb:footballPlayer:35716/e/34278006", "ppb:obb:footballPlayer:35716/e/34278006"],
};

const obbParticipants = {
  "ppb:obb:footballPlayer:4404/e/33956657": {
    urn: "ppb:obb:footballPlayer:4404/e/33956657",
    player: {
      id: "4404",
      name: "Ashley Barnes",
    },
    team: {
      id: "1",
      name: "Burnley",
      color: "00000",
    },
  },
  "ppb:obb:footballPlayer:4405/e/33956657": {
    urn: "ppb:obb:footballPlayer:4405/e/33956657",
    player: {
      id: "4405",
      name: "Carl Barnes",
    },
    team: {
      id: "1",
      name: "Burnley",
      color: "00000",
    },
  },
  "ppb:obb:footballPlayer:35716/e/34278006": {
    urn: "ppb:obb:footballPlayer:35716/e/34278006",
    player: {
      id: "35716",
      name: "Carl Barnes",
    },
    team: {
      id: "1",
      name: "Burnley",
      color: "00000",
    },
  },
};

const obbLegs = {
  [legId]: {
    urn: legId,
    aggregator: "PARTICPANT_1_TO_WIN",
    incidentType: "GOALS",
    operator: "MORE",
    participants: ["ppb:obb:footballPlayer:4404/e/33956657", "ppb:obb:footballPlayer:4405/e/33956657"],
    period: "MATCH",
  },
};

const stateMock = {
  layouts: {
    cards: {
      obbcards: {
        [obbPvpCard.urn]: obbPvpCard,
        [obbSquadBetCard.urn]: obbSquadBetCard,
      },
    },
    cardgroups: {
      obbcardgroups: {
        ["ppb:obb:cardgroup:ABCDE/e/34136457"]: obbCardGroup,
        ["ppb:obb:cardgroup:EDCBA/e/34136457"]: obbCardGroup,
      },
    },
  },
  entities: {
    obbParticipants,
    obbLegs,
  },
};

describe("obb card selectors", () => {
  describe("createObbCardByURNSelector", () => {
    describe("when selecting an ObbPvpCard", () => {
      it("should return the card", () => {
        createCardByURNSelector.mockReturnValueOnce(() => obbPvpCard);

        const selectedCard = createObbCardByURNSelector()(stateMock, obbPvpCard.urn);

        expect(selectedCard).toEqual({
          incidentType: "GOALS",
          legs: undefined,
          participantInfo: undefined,
          participants: [
            {
              player: { id: "4404", name: "Ashley Barnes" },
              team: { id: "1", name: "Burnley", color: "00000" },
              urn: "ppb:obb:footballPlayer:4404/e/33956657",
            },
            {
              player: { id: "4405", name: "Carl Barnes" },
              team: { id: "1", name: "Burnley", color: "00000" },
              urn: "ppb:obb:footballPlayer:4405/e/33956657",
            },
          ],
          teams: {
            home: { color: "00000", id: "1", name: "Burnley" },
            away: { color: "11111", id: "2", name: "Chelsea" },
          },
          selectedLegs: [legId],
          sportevent: undefined,
          title: "Title",
          typename: "ObbPvpCard",
          urn: "ppb:obb:card:pvp:ZypGlBIAAB8AKdsj/e/33956657",
        });
      });
    });

    describe("when selecting an ObbSquadBetCard", () => {
      it("should return the card", () => {
        createCardByURNSelector.mockReturnValueOnce(() => obbSquadBetCard);

        const selectedCard = createObbCardByURNSelector()(stateMock, obbSquadBetCard.urn);

        expect(selectedCard).toEqual({
          defaultLegs: ["b6139aa8a3cf3e98", "57bfff3876bd2e68"],
          incidentType: "GOALS",
          legs: undefined,
          eventParticipants: [
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
          ],
          squadParticipants: [
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
          ],
          sportevent: {
            name: "Man Utd v Athletic Bilbao",
            typename: "SportsEvent",
            urn: "ppb:event:34278006",
          },
          outcomesLabel: "Squad Bet Card Subtitle",
          title: "Squad Bet Card Title",
          typename: "ObbSquadBetCard",
          urn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
          statsLabel: "statsLabel",
          defaultOutcomeIndex: 2,
        });
      });
    });

    describe("when the card doesn't exist", () => {
      it("should return undefined", () => {
        createCardByURNSelector.mockReturnValueOnce(() => null);

        expect(createObbCardByURNSelector()(stateMock, obbPvpCard.urn)).toEqual(undefined);
      });
    });
  });

  describe("createObbSquadBetCardWithModalFieldsByURNSelector", () => {
    describe("when card is not of type ObbSquadBetCard", () => {
      it("should return undefined", () => {
        createCardByURNSelector.mockReturnValueOnce(() => obbPvpCard);

        expect(createObbSquadBetCardWithModalFieldsByURNSelector()(stateMock, obbPvpCard.urn)).toEqual(undefined);
      });
    });

    describe("when card is of type ObbSquadBetCard", () => {
      it("should return undefined", () => {
        createCardByURNSelector.mockReturnValueOnce(() => obbSquadBetCard);

        expect(createObbSquadBetCardWithModalFieldsByURNSelector()(stateMock, obbSquadBetCard.urn)).toEqual({
          defaultLegs: ["b6139aa8a3cf3e98", "57bfff3876bd2e68"],
          incidentType: "GOALS",
          legs: undefined,
          eventParticipants: [
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
          ],
          squadParticipants: [
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
          ],
          sportevent: {
            name: "Man Utd v Athletic Bilbao",
            typename: "SportsEvent",
            urn: "ppb:event:34278006",
          },
          outcomesLabel: "Squad Bet Card Subtitle",
          title: "Squad Bet Card Title",
          typename: "ObbSquadBetCard",
          urn: "ppb:obb:card:squadBet:aAZWeREAACAAel7O/e/34270943",
          statsLabel: "statsLabel",
          defaultOutcomeIndex: 2,
          modalDefaultOutcomeIndex: 2,
          modalError: null,
          modalLegs: ["b6139aa8a3cf3e98", "57bfff3876bd2e68"],
          modalParticipants: [
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
            {
              player: {
                id: "35716",
                name: "Carl Barnes",
              },
              team: {
                color: "00000",
                id: "1",
                name: "Burnley",
              },
              urn: "ppb:obb:footballPlayer:35716/e/34278006",
            },
          ],
          modalIsLoadingQuotes: false,
        });
      });
    });
  });

  describe("createObbCardPositionSelector", () => {
    describe("when the card group is not found", () => {
      it("should return undefined", () => {
        createCardGroupByURNSelector.mockReturnValueOnce(() => undefined);

        const obbCardPositionSelector = createObbCardPositionSelector();
        const position = obbCardPositionSelector(stateMock, "nonexistentUrn", "layoutUrn", 0);

        expect(position).toEqual(undefined);
      });
    });

    describe("when the card group has no sections", () => {
      it("should return undefined", () => {
        createCardGroupByURNSelector.mockReturnValueOnce(() => ({
          sections: [],
        }));

        const obbCardPositionSelector = createObbCardPositionSelector();
        const position = obbCardPositionSelector(stateMock, "nonexistentUrn", "layoutUrn", 0);

        expect(position).toEqual(undefined);
      });
    });

    describe("when the layout does not exist in any section", () => {
      it("should return undefined", () => {
        createCardGroupByURNSelector.mockReturnValueOnce(() => obbCardGroup);

        const obbCardPositionSelector = createObbCardPositionSelector();
        const position = obbCardPositionSelector(stateMock, "aCH6URAAACAAyoQD", "nonexistentLayoutUrn", 0);

        expect(position).toEqual(undefined);
      });
    });

    describe("when the layout is ObbCardsStackedLayout", () => {
      it("should return the position of the card in the stacked layout", () => {
        createCardGroupByURNSelector.mockReturnValueOnce(() => obbCardGroup);

        const obbCardPositionSelector = createObbCardPositionSelector();
        const position = obbCardPositionSelector(
          stateMock,
          "ppb:obb:cardgroup:aCH6URAAACAAyoQD/e/34136457",
          "ppb:obb:cardslayout:stacked:section3/obb_cards_layout$85d29ab6-fb30-42ab-92af-9db946c48bd2/e/34136457",
          0,
        );

        expect(position).toEqual({ horizontalPosition: 1, verticalPosition: 1 });
      });
    });

    describe("when the layout is ObbCardsSwimlaneLayout", () => {
      it("should return the position of the card in the swimlane layout", () => {
        createCardGroupByURNSelector.mockReturnValueOnce(() => obbCardGroup);

        const obbCardPositionSelector = createObbCardPositionSelector();
        const position = obbCardPositionSelector(
          stateMock,
          "ppb:obb:cardgroup:aCH6URAAACAAyoQD/e/34136457",
          "ppb:obb:cardslayout:swimlane:section3/obb_cards_layout$c3f179a7-5e29-43e0-902f-91b7e389385f/e/34136457",
          1,
        );

        expect(position).toEqual({ horizontalPosition: 2, verticalPosition: 3 });
      });
    });
  });
});
