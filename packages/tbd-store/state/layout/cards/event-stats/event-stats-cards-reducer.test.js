import victim from "./event-stats-cards-reducer";

const cardMock = {
  urn: "ppb:tbd:card:eventStats:31815473",
  typename: "EventStatsCard",
  matchStatsUrl:
    "https://videoplayer.betfair.com/GetPlayer.do?eID=31815473&contentType=VIZ&aspectRatio=0.85&maxWidthPixel=1080&tr=1036&contentView=mstats",
};

const stateMock = {
  "ppb:tbd:card:eventStats:31815473": cardMock,
};

describe('"event stats card" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("must return the initial state", () => {
      const state = victim(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe('when action type is "FETCH_CATALOGUE_SUCCESS"', () => {
    it('must return the new state with "EventStatsCard"', () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            EventStatsCard: [cardMock],
          },
        },
      };
      const state = victim(undefined, action);
      expect(state).toEqual(stateMock);
    });
  });
});
