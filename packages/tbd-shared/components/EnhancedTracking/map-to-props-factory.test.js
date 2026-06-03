import { SUBSCRIBE_FIXTURE_UPDATES, UNSUBSCRIBE_FIXTURE_UPDATES } from "@ppb/tbd-store/actions/fixture";

import { getEnhancedTrackingData } from "./enhanced-tracking-helper";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getFixtureBySportEventURN = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createFixtureBySportEventURNSelector: jest.fn(() => getFixtureBySportEventURN),
}));

jest.mock("./enhanced-tracking-helper", () => ({
  getEnhancedTrackingData: jest.fn(() => []),
}));

const OUTCOME_DEFINITION_EXP = {
  outcomeDefinitionEntries: [
    {
      outcomeDefinitionType: "OPERAND",
      outcomeDefinition: {
        query: {
          outcome: "goals",
          participant: {
            side: "home",
            type: "TEAM",
          },
          periodDefinition: {
            period: undefined,
            periodStatus: "FULL",
          },
          sport: "football",
        },
        statsThresholdDef: {
          threshold: 3.5,
          comparison: "GREATER_THAN",
        },
      },
    },
  ],
};

const SBK_BET_LEG_URN = "ppb:sbkBetLeg:batatas";
const EVENT_URN = "ppb:event:123456";
const RESULT = "PLACED";
const FIXTURE_URN = "ppb:fixture:123456";
const INCLUDE_SUBSTITUTIONS = false;

const GENERIC_STATE = {
  entities: {
    footballfixtures: {
      [FIXTURE_URN]: {
        urn: FIXTURE_URN,
        typename: "FootballFixture",
      },
    },
    sportevents: {
      [EVENT_URN]: {
        eventId: 123456,
      },
    },
    sportsbookbetlegs: {
      [SBK_BET_LEG_URN]: {
        urn: SBK_BET_LEG_URN,
        parts: [
          {
            eventUrn: EVENT_URN,
            outcomeDefinition: OUTCOME_DEFINITION_EXP,
          },
        ],
      },
    },
  },
};

const setupMapStateToProps = ({
  eventUrn = EVENT_URN,
  includeSubstitutions = INCLUDE_SUBSTITUTIONS,
  outcomeDefinitionExp = OUTCOME_DEFINITION_EXP,
  result = RESULT,
} = {}) => makeMapStateToProps()(GENERIC_STATE, { eventUrn, includeSubstitutions, outcomeDefinitionExp, result });

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("when fixture is undefined", () => {
    beforeEach(() => {
      getFixtureBySportEventURN.mockReturnValueOnce(undefined);
    });

    it("should return an empty object", () => {
      const stateProps = setupMapStateToProps();

      expect(getFixtureBySportEventURN).toHaveBeenCalledTimes(1);
      expect(getFixtureBySportEventURN).toHaveBeenCalledWith(GENERIC_STATE.entities, EVENT_URN);

      expect(getEnhancedTrackingData).not.toHaveBeenCalled();

      expect(stateProps).toEqual({});
    });
  });

  describe("when fixture is FootballFixture and is Preplay", () => {
    const FOOTBALL_FIXTURE = {
      urn: FIXTURE_URN,
      typename: "FootballFixture",
      fixtureStatus: "PRE_MATCH",
    };

    beforeEach(() => {
      getFixtureBySportEventURN.mockReturnValueOnce(FOOTBALL_FIXTURE);
      getEnhancedTrackingData.mockReturnValueOnce([{ status: "PENDING", currentValue: 0, goal: 4 }]);
    });

    it("should get data from state and build correct view model", () => {
      const stateProps = setupMapStateToProps();

      expect(getFixtureBySportEventURN).toHaveBeenCalledTimes(1);
      expect(getFixtureBySportEventURN).toHaveBeenCalledWith(GENERIC_STATE.entities, EVENT_URN);

      expect(getEnhancedTrackingData).toHaveBeenCalledTimes(1);
      expect(getEnhancedTrackingData).toHaveBeenCalledWith(
        FOOTBALL_FIXTURE,
        OUTCOME_DEFINITION_EXP,
        INCLUDE_SUBSTITUTIONS,
        RESULT,
      );

      expect(stateProps).toEqual({
        urn: FIXTURE_URN,
        typename: "FootballFixture",
        enhancedTrackingData: [
          {
            currentValue: 0,
            goal: 4,
            status: "PENDING",
          },
        ],
        subscribeTeamStats: false,
        footballPlayerIds: [],
      });
    });
  });

  describe("when fixture is FootballFixture and is Inplay", () => {
    const FOOTBALL_FIXTURE = {
      urn: FIXTURE_URN,
      typename: "FootballFixture",
      fixtureStatus: "IN_PLAY",
    };

    beforeEach(() => {
      getFixtureBySportEventURN.mockReturnValueOnce(FOOTBALL_FIXTURE);
      getEnhancedTrackingData.mockReturnValueOnce([
        { status: "ACTIVE", currentValue: 2, goal: 4, participantType: "TEAM" },
      ]);
    });

    it("should get data from state and build correct view model", () => {
      const stateProps = setupMapStateToProps();

      expect(getFixtureBySportEventURN).toHaveBeenCalledTimes(1);
      expect(getFixtureBySportEventURN).toHaveBeenCalledWith(GENERIC_STATE.entities, EVENT_URN);

      expect(getEnhancedTrackingData).toHaveBeenCalledTimes(1);
      expect(getEnhancedTrackingData).toHaveBeenCalledWith(
        FOOTBALL_FIXTURE,
        OUTCOME_DEFINITION_EXP,
        INCLUDE_SUBSTITUTIONS,
        RESULT,
      );

      expect(stateProps).toEqual({
        urn: FIXTURE_URN,
        typename: "FootballFixture",
        enhancedTrackingData: [
          {
            currentValue: 2,
            goal: 4,
            status: "ACTIVE",
            participantType: "TEAM",
          },
        ],
        subscribeTeamStats: true,
        footballPlayerIds: [],
      });
    });
  });

  describe("when bet result is Void", () => {
    const FOOTBALL_FIXTURE = {
      urn: FIXTURE_URN,
      typename: "FootballFixture",
      fixtureStatus: "IN_PLAY",
    };

    beforeEach(() => {
      getFixtureBySportEventURN.mockReturnValueOnce(FOOTBALL_FIXTURE);
      getEnhancedTrackingData.mockReturnValueOnce([
        { status: "PENDING", currentValue: 0, goal: 4, participantId: "1234" },
      ]);
    });

    it("should get data from state and build correct view model", () => {
      const stateProps = setupMapStateToProps({ result: "VOID" });

      expect(getFixtureBySportEventURN).toHaveBeenCalledTimes(1);
      expect(getFixtureBySportEventURN).toHaveBeenCalledWith(GENERIC_STATE.entities, EVENT_URN);

      expect(getEnhancedTrackingData).toHaveBeenCalledTimes(1);
      expect(getEnhancedTrackingData).toHaveBeenCalledWith(
        FOOTBALL_FIXTURE,
        OUTCOME_DEFINITION_EXP,
        INCLUDE_SUBSTITUTIONS,
        "VOID",
      );

      expect(stateProps).toEqual({
        urn: FIXTURE_URN,
        typename: "FootballFixture",
        enhancedTrackingData: [
          {
            currentValue: 0,
            goal: 4,
            status: "PENDING",
            participantId: "1234",
          },
        ],
        subscribeTeamStats: false,
        footballPlayerIds: ["1234"],
      });
    });
  });

  describe("when the getEnhancedTrackingData has no participants", () => {
    const FOOTBALL_FIXTURE = {
      urn: FIXTURE_URN,
      typename: "FootballFixture",
      fixtureStatus: "IN_PLAY",
    };

    beforeEach(() => {
      getFixtureBySportEventURN.mockReturnValueOnce(FOOTBALL_FIXTURE);
      getEnhancedTrackingData.mockReturnValueOnce([{ status: "PENDING", currentValue: 0, goal: 4 }]);
    });

    it("should get data from state and build correct view model", () => {
      const stateProps = setupMapStateToProps();

      expect(getFixtureBySportEventURN).toHaveBeenCalledTimes(1);
      expect(getFixtureBySportEventURN).toHaveBeenCalledWith(GENERIC_STATE.entities, EVENT_URN);

      expect(getEnhancedTrackingData).toHaveBeenCalledTimes(1);
      expect(getEnhancedTrackingData).toHaveBeenCalledWith(
        FOOTBALL_FIXTURE,
        OUTCOME_DEFINITION_EXP,
        INCLUDE_SUBSTITUTIONS,
        "PLACED",
      );

      expect(stateProps).toEqual({
        urn: FIXTURE_URN,
        typename: "FootballFixture",
        enhancedTrackingData: [
          {
            currentValue: 0,
            goal: 4,
            status: "PENDING",
          },
        ],
        subscribeTeamStats: false,
        footballPlayerIds: [],
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchSubscribeFixtureUpdates", () => {
    it("should dispatch SUBSCRIBE_FIXTURE_UPDATES action with isLite and includeStats true", () => {
      const { dispatchSubscribeFixtureUpdates } = mapDispatchToProps;
      const urn = FIXTURE_URN;
      const typename = "SomeFixture";
      const includeStats = true;
      const footballPlayerIds = ["1234", "5678"];
      const includeSubstitutions = false;

      expect(
        dispatchSubscribeFixtureUpdates(urn, typename, includeStats, footballPlayerIds, includeSubstitutions),
      ).toEqual({
        type: SUBSCRIBE_FIXTURE_UPDATES,
        payload: {
          urn,
          typename,
          isLite: true,
          includeStats: true,
          includePlayers: true,
          footballPlayerIds: ["1234", "5678"],
          includePlayerStats: true,
          includeSubstitutions: false,
        },
      });
    });
  });

  describe("dispatchUnsubscribeFixtureUpdates", () => {
    it("should dispatch UNSUBSCRIBE_FIXTURE_UPDATES action", () => {
      const { dispatchUnsubscribeFixtureUpdates } = mapDispatchToProps;
      const urn = FIXTURE_URN;
      const typename = "SomeFixture";

      expect(dispatchUnsubscribeFixtureUpdates(urn, typename)).toEqual({
        type: UNSUBSCRIBE_FIXTURE_UPDATES,
        payload: { urn, typename },
      });
    });
  });
});
