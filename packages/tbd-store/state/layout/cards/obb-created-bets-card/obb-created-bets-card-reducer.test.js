import obbCreatedBetsCard from "./obb-created-bets-card-reducer";

const obbCreatedBetsCardMock = {
  typename: "ObbCreatedBetsCard",
  urn: "createdBetsCard:urn2",
  fixture: "fixture:urn:5678",
  eventViewLink: {
    viewUrl: "/event2",
    viewUrn: "view:urn:event2",
  },
  footerViewLink: {
    viewUrl: "/footer2",
    viewUrn: "view:urn:footer2",
  },
  bettingOpportunities: [
    {
      participants: [{ urn: "participant3" }, { urn: "participant4" }],
      leg: { id: "legId2" },
    },
  ],
};

const stateMock = {
  "createdBetsCard:urn1": {
    typename: "ObbCreatedBetsCard",
    urn: "createdBetsCard:urn1",
    fixture: "fixture:urn:1234",
    eventViewLink: {
      viewUrl: "/event1",
      viewUrn: "view:urn:event1",
    },
    footerViewLink: {
      viewUrl: "/footer1",
      viewUrn: "view:urn:footer1",
    },
    bettingOpportunities: [
      {
        participants: ["participant1", "participant2"],
        legId: "legId1",
      },
    ],
  },
};

describe('"obbCreatedBetsCard" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = obbCreatedBetsCard(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it("must return the new state with the new Obb Created Bets Card", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ObbCreatedBetsCard: [obbCreatedBetsCardMock],
          },
        },
      };
      const state = obbCreatedBetsCard(undefined, action);
      expect(state).toEqual({
        "createdBetsCard:urn2": {
          ...obbCreatedBetsCardMock,
          bettingOpportunities: [
            {
              legId: "legId2",
              participants: ["participant3", "participant4"],
            },
          ],
        },
      });
    });

    it("must return current state merged with the new Obb Created Bets Card", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            ObbCreatedBetsCard: [obbCreatedBetsCardMock],
          },
        },
      };

      const state = obbCreatedBetsCard(stateMock, action);
      expect(state).toEqual({
        ...stateMock,
        "createdBetsCard:urn2": {
          bettingOpportunities: [
            {
              legId: "legId2",
              participants: ["participant3", "participant4"],
            },
          ],
          eventViewLink: {
            viewUrl: "/event2",
            viewUrn: "view:urn:event2",
          },
          fixture: "fixture:urn:5678",
          footerViewLink: {
            viewUrl: "/footer2",
            viewUrn: "view:urn:footer2",
          },
          typename: "ObbCreatedBetsCard",
          urn: "createdBetsCard:urn2",
        },
      });
    });

    it("must not overwrite existing cards if no new cards are provided", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            obbCreatedBetsCard: [],
          },
        },
      };
      const state = obbCreatedBetsCard(stateMock, action);
      expect(state).toEqual(stateMock);
    });
  });
});
