import { fetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { fetchFixtureUpdatesSuccessAction } from "../../../actions/fixture";

import footballFixture from "./football-fixture-slice";

const footballFixtureData = {
  urn: "ppb:footballfixture:29605500",
  home: {
    name: "Crystal Palace",
    color: "#1B458F",
    crest: {
      vector: "http://sca.qa.internal/Assets/Logo",
      small: "logo@1x.png",
      medium: "logo@2x.png",
      large: "logo@3x.png",
    },
  },
  away: {
    name: "Bournemouth",
    color: "#DA291C",
    crest: {
      vector: "http://sca.qa.internal/Assets/Logo",
      small: "logo@1x.png",
      medium: "logo@2x.png",
      large: "logo@3x.png",
    },
    squad: {
      manager: "away manager",
      players: ["away player 1", "away player 2"],
    },
  },
  scheduledAt: "2019-12-23T12:00:00Z",
  startedAt: "2019-12-23T12:05:00Z",
  score: {
    home: 2,
    away: 1,
  },
  firstLegScore: {
    home: 0,
    away: 1,
  },
  duration: {
    period: "REGULAR",
    status: "PRE_MATCH",
    clock: {
      minute: 24,
      second: 48,
    },
    stoppageMinutes: 0,
  },
  recentForm: {},
  sportevent: "",
  competition: "",
};

const payload = {
  data: {
    FootballFixture: [footballFixtureData],
  },
};

const updatePayload = {
  football: {
    "ppb:footballfixture:29605500": footballFixtureData,
  },
};

describe('"footballFixtureSlice" reducer', () => {
  describe("when action type is not met by the reducer", () => {
    it("should return the initial state", () => {
      const state = footballFixture.reducer(undefined, {});
      expect(state).toEqual({});
    });
  });

  describe("when action type is FETCH_CATALOGUE_SUCCESS", () => {
    it("should return the new fixtures", () => {
      const action = { type: fetchCatalogueSuccessAction.type, payload };
      const state = footballFixture.reducer({}, action);

      expect(state).toEqual({
        "ppb:footballfixture:29605500": {
          urn: "ppb:footballfixture:29605500",
          fixtureStatus: "PRE_MATCH",
          home: {
            name: "Crystal Palace",
            color: "#1B458F",
            crest: {
              vector: "http://sca.qa.internal/Assets/Logo",
              small: "logo@1x.png",
              medium: "logo@2x.png",
              large: "logo@3x.png",
            },
          },
          away: {
            name: "Bournemouth",
            color: "#DA291C",
            crest: {
              vector: "http://sca.qa.internal/Assets/Logo",
              small: "logo@1x.png",
              medium: "logo@2x.png",
              large: "logo@3x.png",
            },
            squad: { manager: "away manager", players: ["away player 1", "away player 2"] },
          },
          scheduledAt: new Date("2019-12-23T12:00:00Z"),
          startedAt: new Date("2019-12-23T12:05:00Z"),
          score: { home: 2, away: 1 },
          firstLegScore: { home: 0, away: 1 },
          duration: {
            period: "REGULAR",
            status: "PRE_MATCH",
            clock: { minute: 24, second: 48 },
            stoppageMinutes: 0,
          },
          recentForm: {},
          sportevent: "",
          competition: "",
        },
      });
    });

    it("should flag unknown status if there is no fixtureStatus in store", () => {
      const action = {
        type: fetchCatalogueSuccessAction.type,
        payload: {
          data: {
            FootballFixture: [
              {
                urn: "ppb:footballfixture:29605500",
                duration: {},
              },
            ],
          },
        },
      };
      const state = footballFixture.reducer({}, action);

      expect(state).toEqual({
        "ppb:footballfixture:29605500": {
          duration: {},
          fixtureStatus: "UNKNOWN",
          scheduledAt: undefined,
          startedAt: undefined,
          urn: "ppb:footballfixture:29605500",
        },
      });
    });

    it("should not flag unknown status if there is a fixtureStatus already in store", () => {
      const action = {
        type: fetchCatalogueSuccessAction.type,
        payload: {
          data: {
            FootballFixture: [
              {
                urn: "ppb:footballfixture:29605500",
                duration: {},
              },
            ],
          },
        },
      };
      const state = footballFixture.reducer(
        {
          "ppb:footballfixture:29605500": {
            fixtureStatus: "IN_PLAY",
          },
        },
        action,
      );

      expect(state).toEqual({
        "ppb:footballfixture:29605500": {
          duration: {},
          fixtureStatus: "IN_PLAY",
          scheduledAt: undefined,
          startedAt: undefined,
          urn: "ppb:footballfixture:29605500",
        },
      });
    });

    it("should not update the scheduledAt prop if it comes undefined", () => {
      const action = {
        type: fetchCatalogueSuccessAction.type,
        payload: {
          data: {
            FootballFixture: [
              {
                urn: "ppb:footballfixture:29605500",
                scheduledAt: undefined,
              },
            ],
          },
        },
      };
      const state = footballFixture.reducer(
        {
          "ppb:footballfixture:29605500": {
            scheduledAt: "mock-scheduledAt",
          },
        },
        action,
      );

      expect(state).toEqual({
        "ppb:footballfixture:29605500": {
          fixtureStatus: "UNKNOWN",
          scheduledAt: "mock-scheduledAt",
          startedAt: undefined,
          urn: "ppb:footballfixture:29605500",
        },
      });
    });
  });

  describe("when action type is NETWORK__FETCH_FIXTURE_UPDATES_SUCCESS", () => {
    it("should return the new fixtures", () => {
      const action = { type: fetchFixtureUpdatesSuccessAction.type, payload: updatePayload };
      const state = footballFixture.reducer({}, action);

      expect(state).toEqual({
        "ppb:footballfixture:29605500": {
          urn: "ppb:footballfixture:29605500",
          fixtureStatus: "PRE_MATCH",
          home: {
            name: "Crystal Palace",
            color: "#1B458F",
            crest: {
              vector: "http://sca.qa.internal/Assets/Logo",
              small: "logo@1x.png",
              medium: "logo@2x.png",
              large: "logo@3x.png",
            },
          },
          away: {
            name: "Bournemouth",
            color: "#DA291C",
            crest: {
              vector: "http://sca.qa.internal/Assets/Logo",
              small: "logo@1x.png",
              medium: "logo@2x.png",
              large: "logo@3x.png",
            },
            squad: { manager: "away manager", players: ["away player 1", "away player 2"] },
          },
          scheduledAt: "2019-12-23T12:00:00Z",
          startedAt: "2019-12-23T12:05:00Z",
          score: { home: 2, away: 1 },
          firstLegScore: { home: 0, away: 1 },
          duration: {
            period: "REGULAR",
            status: "PRE_MATCH",
            clock: { minute: 24, second: 48 },
            stoppageMinutes: 0,
          },
          recentForm: {},
          sportevent: "",
          competition: "",
        },
      });
    });

    it("should always rewrite stats the new fixtures", () => {
      const action = { type: fetchFixtureUpdatesSuccessAction.type, payload: updatePayload };
      const state = footballFixture.reducer(
        {
          "ppb:footballfixture:29605500": {
            stats: [{ stat: "1" }],
          },
        },
        action,
      );

      expect(state).toEqual({
        "ppb:footballfixture:29605500": {
          urn: "ppb:footballfixture:29605500",
          fixtureStatus: "PRE_MATCH",
          home: {
            name: "Crystal Palace",
            color: "#1B458F",
            crest: {
              vector: "http://sca.qa.internal/Assets/Logo",
              small: "logo@1x.png",
              medium: "logo@2x.png",
              large: "logo@3x.png",
            },
          },
          away: {
            name: "Bournemouth",
            color: "#DA291C",
            crest: {
              vector: "http://sca.qa.internal/Assets/Logo",
              small: "logo@1x.png",
              medium: "logo@2x.png",
              large: "logo@3x.png",
            },
            squad: { manager: "away manager", players: ["away player 1", "away player 2"] },
          },
          scheduledAt: "2019-12-23T12:00:00Z",
          startedAt: "2019-12-23T12:05:00Z",
          score: { home: 2, away: 1 },
          firstLegScore: { home: 0, away: 1 },
          duration: {
            period: "REGULAR",
            status: "PRE_MATCH",
            clock: { minute: 24, second: 48 },
            stoppageMinutes: 0,
          },
          recentForm: {},
          sportevent: "",
          competition: "",
        },
      });
    });
  });
});
