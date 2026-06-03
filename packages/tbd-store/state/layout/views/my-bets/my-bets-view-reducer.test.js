import myBetsViewReducer from "./my-bets-view-reducer";

const urn = "ppb:tbd:view:myBetsView:90";

const stateMock = [
  {
    urn,
    items: [
      { urn: "urn:tbd:card:1", typename: "Card" },
      { urn: "urn:tbd:card:2", typename: "Card" },
    ],
  },
];

const secondUpdateMock = [
  {
    urn,
    items: [
      { urn: "urn:tbd:card:3", typename: "Card" },
      { urn: "urn:tbd:card:4", typename: "Card" },
    ],
  },
];

const withDuplicatedCardMock = [
  {
    urn,
    items: [
      { urn: "urn:tbd:card:3", typename: "Card" },
      { urn: "urn:tbd:card:4", typename: "Card" },
      { urn: "urn:tbd:card:2", typename: "Card" },
    ],
  },
];

describe("`my bets view` reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = myBetsViewReducer(undefined, {
        type: "OTHER_ACTION",
      });

      expect(state).toEqual({});
    });
  });

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      const state = myBetsViewReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    describe("when views are not provided", () => {
      it("should return initial state", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {},
          },
        };

        const state = myBetsViewReducer(undefined, action);
        expect(state).toEqual({});
      });
    });

    describe("when views are provided", () => {
      it("should return the previous state merged with the new one", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { MyBetsView: stateMock },
          },
        };
        const secondFetchAction = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { MyBetsView: secondUpdateMock },
            withPagination: true,
          },
        };

        const state = myBetsViewReducer(undefined, action);
        expect(state).toEqual({
          [urn]: {
            urn,
            items: [
              {
                typename: "Card",
                urn: "urn:tbd:card:1",
              },
              {
                typename: "Card",
                urn: "urn:tbd:card:2",
              },
            ],
          },
        });

        const newState = myBetsViewReducer(state, secondFetchAction);
        expect(newState).toEqual({
          [urn]: {
            urn,
            items: [
              {
                typename: "Card",
                urn: "urn:tbd:card:1",
              },
              {
                typename: "Card",
                urn: "urn:tbd:card:2",
              },
              {
                typename: "Card",
                urn: "urn:tbd:card:3",
              },
              {
                typename: "Card",
                urn: "urn:tbd:card:4",
              },
            ],
          },
        });
      });

      it("should return the previous state merged with the new one, with unique items", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { MyBetsView: stateMock },
          },
        };
        const secondFetchAction = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: { MyBetsView: withDuplicatedCardMock },
            withPagination: true,
          },
        };

        const state = myBetsViewReducer(undefined, action);
        expect(state).toEqual({
          [urn]: {
            urn,
            items: [
              { urn: "urn:tbd:card:1", typename: "Card" },
              { urn: "urn:tbd:card:2", typename: "Card" },
            ],
          },
        });

        const newState = myBetsViewReducer(state, secondFetchAction);
        expect(newState).toEqual({
          [urn]: {
            urn,
            items: [
              { urn: "urn:tbd:card:1", typename: "Card" },
              { urn: "urn:tbd:card:2", typename: "Card" },
              { urn: "urn:tbd:card:3", typename: "Card" },
              { urn: "urn:tbd:card:4", typename: "Card" },
            ],
          },
        });
      });

      describe("when view comes without items", () => {
        it("should return the previous state merged with the new one", () => {
          const action = {
            type: "FETCH_CATALOGUE_SUCCESS",
            payload: {
              data: { MyBetsView: stateMock },
            },
          };
          const secondFetchAction = {
            type: "FETCH_CATALOGUE_SUCCESS",
            payload: {
              data: { MyBetsView: [{ urn }] },
              withPagination: true,
            },
          };

          const state = myBetsViewReducer(undefined, action);
          expect(state).toEqual({
            [urn]: {
              urn,
              items: [
                {
                  typename: "Card",
                  urn: "urn:tbd:card:1",
                },
                {
                  typename: "Card",
                  urn: "urn:tbd:card:2",
                },
              ],
            },
          });

          const newState = myBetsViewReducer(state, secondFetchAction);
          expect(newState).toEqual({
            [urn]: {
              urn,
              items: [
                {
                  typename: "Card",
                  urn: "urn:tbd:card:1",
                },
                {
                  typename: "Card",
                  urn: "urn:tbd:card:2",
                },
              ],
            },
          });
        });
      });
    });
  });

  describe('when action type is "MY_BETS_UPDATE_VIEW_CURSOR"', () => {
    it("should return the previous state merged with the new one", () => {
      const action = {
        type: "MY_BETS_UPDATE_VIEW_CURSOR",
        payload: {
          viewURN: "viewURN",
          cursor: "newCursor",
        },
      };

      const state = myBetsViewReducer(
        {
          viewURN: {
            pageInfo: {
              endCursor: "oldCursor",
            },
          },
          anotherUrn: {
            pageInfo: {
              endCursor: "anotherCursor",
            },
          },
        },
        action,
      );
      expect(state).toEqual({
        viewURN: {
          pageInfo: {
            endCursor: "newCursor",
          },
        },
        anotherUrn: {
          pageInfo: {
            endCursor: "anotherCursor",
          },
        },
      });
    });
  });

  describe("when action type is DELETE_LAYOUT", () => {
    it("should return an empty object", () => {
      const state = myBetsViewReducer(
        { layout: {} },
        {
          type: "DELETE_LAYOUT",
        },
      );

      expect(state).toEqual({});
    });
  });
});
