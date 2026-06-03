import bottomBarReducer from "./bottom-bar-card-reducer";

const stateMock = {
  typename: "BottomBar",
  tiles: [
    {
      tileType: "HOME",
      viewLink: {
        viewUrn: "ppb:tbd:view:generic:home",
        viewUrl: "",
      },
    },
    {
      tileType: "BROWSE",
      viewLink: {
        viewUrn: "ppb:tbd:view:browse:sports",
        viewUrl: "browse/browse:sports",
      },
    },
    {
      tileType: "MY_BETS",
      viewLink: {
        viewUrn: "ppb:tbd:view:myBets:open",
        viewUrl: "mybets/myBets-open",
      },
    },
    {
      tileType: "GAMING",
      viewLink: {
        viewUrn: "ppb:tbd:view:gaming:1",
        viewUrl: "casino/gm-1",
      },
    },
  ],
};

describe('"bottomBar" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = bottomBarReducer(undefined, {});
      expect(state).toEqual(null);
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    describe("when MyBetsView is present in payload", () => {
      describe("when bottom bar is present in payload", () => {
        it("should return the new state with MyBets tile updated", () => {
          const action = {
            type: "FETCH_CATALOGUE_SUCCESS",
            payload: {
              data: {
                MyBetsView: [
                  {
                    url: "mybets/myBets-open",
                    urn: "ppb:tbd:view:myBets:open",
                  },
                ],
                BottomBar: [stateMock],
              },
            },
          };
          const state = bottomBarReducer(undefined, action);

          const index = stateMock.tiles.findIndex((tile) => tile.tileType === "MY_BETS");

          expect(state.tiles[index].viewLink).toEqual({
            viewUrl: "mybets/myBets-open",
            viewUrn: "ppb:tbd:view:myBets:open",
          });
        });
      });

      describe("when bottom bar is not present in payload and state is defined", () => {
        it("should return the new state with MyBets tile updated", () => {
          const action = {
            type: "FETCH_CATALOGUE_SUCCESS",
            payload: {
              data: {
                MyBetsView: [
                  {
                    url: "mybets/myBets-open",
                    urn: "ppb:tbd:view:myBets:open",
                  },
                ],
              },
            },
          };
          const state = bottomBarReducer(stateMock, action);

          const index = stateMock.tiles.findIndex((tile) => tile.tileType === "MY_BETS");

          expect(state.tiles[index].viewLink).toEqual({
            viewUrl: "mybets/myBets-open",
            viewUrn: "ppb:tbd:view:myBets:open",
          });
        });
      });
    });

    describe("when MyBetsView is not present in payload", () => {
      it("should return previous state", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {},
          },
        };
        const state = bottomBarReducer({ state: "state" }, action);
        expect(state).toEqual({ state: "state" });
      });
    });

    describe("and bottom bar is present in payload", () => {
      it("must return the new state with the bottom bar section", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {
              BottomBar: [stateMock],
            },
          },
        };
        const state = bottomBarReducer(undefined, action);
        expect(state).toEqual(stateMock);
      });
    });

    describe("and bottom bar is not present in payload", () => {
      it("must return the state without bottom bar", () => {
        const action = {
          type: "FETCH_CATALOGUE_SUCCESS",
          payload: {
            data: {},
          },
        };
        const state = bottomBarReducer({ state: "state" }, action);
        expect(state).toEqual({ state: "state" });
      });
    });
  });
});
