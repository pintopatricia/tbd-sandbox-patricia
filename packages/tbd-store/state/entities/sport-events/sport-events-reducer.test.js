import sportsEventReducer from "./sport-events-reducer";

const stateMock = {
  "ppb:event:32315538": {
    typename: "SportsEvent",
    urn: "ppb:event:32315538",
    eventId: 32315538,
    name: "Arouca v Porto",
    openDate: "2023-05-08T20:15:00.000Z",
    competition: "ppb:competition:99",
  },
};

describe("`sportsevents` reducer", () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the current state", () => {
      const state = sportsEventReducer(stateMock, {});
      expect(state).toEqual(stateMock);
    });
  });

  describe("when no state is provided", () => {
    it("should return initial state", () => {
      const state = sportsEventReducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe.each(["FETCH_CATALOGUE_SUCCESS", "NETWORK/SBK_MARKETS_SUCCESS"])(
    'when action type is "%s"',
    (actionName) => {
      describe("when payload does not have a sportevent", () => {
        it("must return the same state", () => {
          const action = {
            type: actionName,
            payload: {
              data: {
                Bajouras: [
                  {
                    typename: "SportsEvent",
                    urn: "ppb:event:32315539",
                    eventId: 32315539,
                    name: "Benfica v Braga",
                    openDate: "2023-05-06T20:30:00.000Z",
                    competition: "ppb:competition:99",
                  },
                ],
              },
            },
          };
          const state = sportsEventReducer(stateMock, action);
          expect(state).toEqual({
            "ppb:event:32315538": {
              competition: "ppb:competition:99",
              eventId: 32315538,
              name: "Arouca v Porto",
              openDate: "2023-05-08T20:15:00.000Z",
              typename: "SportsEvent",
              urn: "ppb:event:32315538",
            },
          });
        });
      });

      describe("when payload has a sportevent", () => {
        it('must return the new state with "sportsevents"', () => {
          const action = {
            type: actionName,
            payload: {
              data: {
                SportsEvent: [
                  {
                    typename: "SportsEvent",
                    urn: "ppb:event:32315539",
                    eventId: 32315539,
                    name: "Benfica v Braga",
                    openDate: "2023-05-06T20:30:00.000Z",
                    competition: "ppb:competition:99",
                  },
                ],
              },
            },
          };
          const state = sportsEventReducer(stateMock, action);
          expect(state).toEqual({
            "ppb:event:32315538": {
              competition: "ppb:competition:99",
              eventId: 32315538,
              name: "Arouca v Porto",
              openDate: "2023-05-08T20:15:00.000Z",
              typename: "SportsEvent",
              urn: "ppb:event:32315538",
            },
            "ppb:event:32315539": {
              typename: "SportsEvent",
              urn: "ppb:event:32315539",
              eventId: 32315539,
              name: "Benfica v Braga",
              openDate: "2023-05-06T20:30:00.000Z",
              competition: "ppb:competition:99",
            },
          });
        });
      });

      describe("when action does not have all the mandatory fields", () => {
        it('must return the new state with "sportsevents"', () => {
          const action = {
            type: actionName,
            payload: {
              data: {
                SportsEvent: [
                  {
                    name: "Arouca v Porto",
                    typename: "SportsEvent",
                    urn: "ppb:event:32315538",
                  },
                ],
              },
            },
          };
          const state = sportsEventReducer(stateMock, action);
          expect(state).toEqual({
            "ppb:event:32315538": {
              competition: "ppb:competition:99",
              eventId: 32315538,
              name: "Arouca v Porto",
              openDate: "2023-05-08T20:15:00.000Z",
              typename: "SportsEvent",
              urn: "ppb:event:32315538",
            },
          });
        });
      });
    },
  );
});
