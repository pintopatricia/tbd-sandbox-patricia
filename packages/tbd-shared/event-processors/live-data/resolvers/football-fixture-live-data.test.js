import { updateFootballFixture } from "./football-fixture-live-data";
import { getApolloClient } from "../../../apollo-client/client";

jest.mock("../../../apollo-client/client");

describe("football-fixture-live-data", () => {
  describe("updateFootballFixture", () => {
    const setup = ({ payload }) => {
      updateFootballFixture(payload);
    };

    const mockCacheModify = jest.fn();

    beforeEach(() => {
      getApolloClient.mockReturnValue({
        cache: {
          modify: mockCacheModify,
          identify: jest.fn((ref) => ref.urn),
        },
      });
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe("when the payload is empty", () => {
      beforeEach(() => {
        setup({ payload: {} });
      });

      it("should not call cache.modify", () => {
        expect(mockCacheModify).not.toHaveBeenCalled();
      });
    });

    describe("when the payload has something new", () => {
      describe("when only have one URN", () => {
        beforeEach(() => {
          const payload = {
            "urn:fixture:1": {
              duration: {
                clock: { minute: 45, second: 0 },
                period: "REGULAR",
                status: "INPLAY_FIRST_HALF",
              },
            },
          };

          setup({ payload });
        });

        it("should call cache.modify with every fields", () => {
          expect(mockCacheModify).toHaveBeenCalledWith({
            id: "urn:fixture:1",
            fields: {
              duration: expect.any(Function),
              incidents: expect.any(Function),
              score: expect.any(Function),
              stats: expect.any(Function),
              home: expect.any(Function),
              away: expect.any(Function),
            },
          });
        });
      });

      describe("when have more than one URN", () => {
        beforeEach(() => {
          const payload = {
            "urn:fixture:1": {
              duration: {
                clock: { minute: 45, second: 0 },
                period: "REGULAR",
                status: "INPLAY_FIRST_HALF",
              },
            },
            "urn:fixture:2": {
              duration: {
                clock: { minute: 45, second: 0 },
                period: "REGULAR",
                status: "INPLAY_FIRST_HALF",
              },
            },
          };

          setup({ payload });
        });

        it("should call cache.modify with every fields", () => {
          expect(mockCacheModify).toHaveBeenCalledWith({
            id: "urn:fixture:1",
            fields: {
              duration: expect.any(Function),
              incidents: expect.any(Function),
              score: expect.any(Function),
              stats: expect.any(Function),
              home: expect.any(Function),
              away: expect.any(Function),
            },
          });

          expect(mockCacheModify).toHaveBeenCalledWith({
            id: "urn:fixture:2",
            fields: {
              duration: expect.any(Function),
              incidents: expect.any(Function),
              score: expect.any(Function),
              stats: expect.any(Function),
              home: expect.any(Function),
              away: expect.any(Function),
            },
          });
        });
      });
    });

    describe("when is an update on the duration field", () => {
      beforeEach(() => {
        const payload = {
          "urn:fixture:1": {
            duration: {
              clock: { minute: 45, second: 0 },
              period: "REGULAR",
              status: "INPLAY_FIRST_HALF",
            },
          },
        };

        setup({ payload });
      });

      it("should update the duration field in the cache", () => {
        const durationModifier = mockCacheModify.mock.calls[0][0].fields.duration;
        const cachedValue = { clock: { minute: 30, second: 0 } };
        const result = durationModifier(cachedValue);

        expect(result).toEqual({
          clock: { minute: 45, second: 0 },
          period: "REGULAR",
          status: "INPLAY_FIRST_HALF",
        });
      });
    });

    describe("when is an update on the home field", () => {
      beforeEach(() => {
        const payload = {
          "urn:fixture:1": {
            home: {
              formation: "433",
            },
          },
        };

        setup({ payload });
      });

      it("should update the home field in the cache", () => {
        const homeModifier = mockCacheModify.mock.calls[0][0].fields.home;
        const cachedValue = { formation: "442", name: "Home Team" };
        const result = homeModifier(cachedValue);

        expect(result).toEqual({
          formation: "433",
          name: "Home Team",
        });
      });
    });

    describe("when is an update on the away field", () => {
      beforeEach(() => {
        const payload = {
          "urn:fixture:1": {
            away: {
              formation: "433",
            },
          },
        };

        setup({ payload });
      });

      it("should update the away field in the cache", () => {
        const awayModifier = mockCacheModify.mock.calls[0][0].fields.away;
        const cachedValue = { formation: "442", name: "Away Team" };
        const result = awayModifier(cachedValue);

        expect(result).toEqual({
          formation: "433",
          name: "Away Team",
        });
      });
    });

    describe("when is an update on the score field", () => {
      beforeEach(() => {
        const payload = {
          "urn:fixture:1": {
            score: { home: 1, away: 0 },
          },
        };

        setup({ payload });
      });

      it("should update the score field in the cache", () => {
        const scoreModifier = mockCacheModify.mock.calls[0][0].fields.score;
        const cachedValue = { home: 0, away: 0 };
        const result = scoreModifier(cachedValue);

        expect(result).toEqual({
          home: 1,
          away: 0,
        });
      });
    });

    describe("when is an update on the stats field", () => {
      beforeEach(() => {
        const payload = {
          "urn:fixture:1": {
            stats: [
              { __typename: "StatType", periodStatus: "INPLAY_FIRST_HALF", period: "REGULAR" },
              { __typename: "StatType", periodStatus: "INPLAY_SECOND_HALF", period: "REGULAR" },
            ],
          },
        };

        setup({ payload });
      });

      it("should update the stats field in the cache", () => {
        const statsModifier = mockCacheModify.mock.calls[0][0].fields.stats;
        const cachedValue = [{ __typename: "StatType", periodStatus: "INPLAY_FIRST_HALF", period: "REGULAR" }];
        const result = statsModifier(cachedValue);

        expect(result).toEqual([
          { __typename: "StatType", periodStatus: "INPLAY_FIRST_HALF", period: "REGULAR" },
          { __typename: "StatType", periodStatus: "INPLAY_SECOND_HALF", period: "REGULAR" },
        ]);
      });
    });

    describe("when is an update on the incidents field", () => {
      beforeEach(() => {
        const payload = {
          "urn:fixture:1": {
            incidents: [
              {
                period: "REGULAR",
                periodStatus: "INPLAY_FIRST_HALF",
                clock: { minute: 45, second: 0 },
                type: "GoalIncident",
                details: { __typename: "GoalIncident", goalType: "NORMAL", side: "HOME" },
              },
            ],
          },
        };

        setup({ payload });
      });

      it("should update the incidents field in the cache", () => {
        const incidentsModifier = mockCacheModify.mock.calls[0][0].fields.incidents;
        const cachedValue = [];
        const result = incidentsModifier(cachedValue);

        expect(result).toEqual([
          {
            period: "REGULAR",
            periodStatus: "INPLAY_FIRST_HALF",
            clock: { minute: 45, second: 0 },
            type: "GoalIncident",
            details: { __typename: "GoalIncident", goalType: "NORMAL", side: "HOME" },
          },
        ]);
      });
    });
  });
});
