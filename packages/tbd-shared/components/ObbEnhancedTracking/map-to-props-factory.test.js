import { SUBSCRIBE_FIXTURE_UPDATES, UNSUBSCRIBE_FIXTURE_UPDATES } from "@ppb/tbd-store/actions/fixture";
import { FixtureStatus, Result } from "@ppb/tbd-store/state/constants";
import { TrackingBarStatus } from "@ppb/the-wall-common/types";

import { mapDispatchToProps, makeMapStateToProps } from "./map-to-props-factory";
import { getEnhancedTrackingData } from "./obb-enhanced-tracking-helper";

const getFixtureBySportEventURN = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createFixtureBySportEventURNSelector: jest.fn(() => getFixtureBySportEventURN),
}));

jest.mock("./obb-enhanced-tracking-helper", () => ({
  getEnhancedTrackingData: jest.fn(() => []),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const EXPRESSION_COMPONENTS = {
  leftOperand: [
    {
      outcomeId: "GOALS",
      timePeriodId: "MATCH",
      participantId: "112471",
      __typename: "Outcome",
    },
    {
      operator: "+",
      __typename: "Operator",
    },
    {
      outcomeId: "GOALS",
      timePeriodId: "MATCH",
      participantId: "107738",
      __typename: "Outcome",
    },
  ],
  operator: ">",
  rightOperand: [
    {
      decimal: 2,
      __typename: "Literal",
    },
  ],
};
const EXPRESSION_METADATA = {
  participants: [
    {
      id: "6354321",
      name: "Joao",
    },
    {
      id: "6354322",
      name: "Mota",
    },
  ],
  __typename: "ExpressionMetadata",
};

const OUTCOME_BASE_DETAILS = {
  outcomeBasedDetails: {
    expressionInfo: {
      templateId: "xOfN",
      templateVersion: 1,
      params: {
        x: 2,
      },
      expressionComponents: null,
      expressionMetadata: EXPRESSION_METADATA,
      subExpressionInfos: [
        {
          templateId: "participantsCombined",
          templateVersion: 1,
          params: {
            outcomeIds: ["GOALS"],
            timePeriodId: "MATCH",
            participantIds: ["112471", "107738"],
            value: 2,
            quantifier: "AT_LEAST",
            __typename: "ObbSquadBetTemplateParams",
          },
          expressionComponents: {
            leftOperand: [
              {
                outcomeId: "GOALS",
                timePeriodId: "MATCH",
                participantId: "112471",
                __typename: "Outcome",
              },
              {
                operator: "+",
                __typename: "Operator",
              },
              {
                outcomeId: "GOALS",
                timePeriodId: "MATCH",
                participantId: "107738",
                __typename: "Outcome",
              },
            ],
            operator: ">",
            rightOperand: [
              {
                decimal: 2,
                __typename: "Literal",
              },
            ],
          },
        },
        {
          templateId: "participantsCombined",
          templateVersion: 1,
          params: {
            outcomeIds: ["GOALS"],
            timePeriodId: "MATCH",
            participantIds: ["112471", "21978", "107738"],
            value: 3,
            quantifier: "AT_LEAST",
          },
          expressionComponents: {
            leftOperand: [
              {
                outcomeId: "GOALS",
                timePeriodId: "MATCH",
                participantId: "21978",
                __typename: "Outcome",
              },
              {
                operator: "+",
                __typename: "Operator",
              },
              {
                outcomeId: "GOALS",
                timePeriodId: "MATCH",
                participantId: "107738",
                __typename: "Outcome",
              },
            ],
            operator: ">",
            rightOperand: [
              {
                decimal: 3,
                __typename: "Literal",
              },
            ],
          },
        },
      ],
    },
  },
};

const SBK_BET_LEG_URN = "ppb:sbkBetLeg:batatas";
const EVENT_URN = "ppb:event:123456";
const RESULT = Result.PLACED;
const FIXTURE_URN = "ppb:fixture:123456";

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
            outcomeBaseDetails: OUTCOME_BASE_DETAILS,
          },
        ],
      },
    },
  },
};

const outcomeDefinitions = [
  {
    outcome: "GOALS",
    participantId: "6354321",
    periodStatus: "FULL",
  },
  {
    outcome: "GOALS",
    participantId: "6354322",
    periodStatus: "FULL",
  },
];

const individualTrackingData = [
  {
    outcome: "GOALS",
    playerName: "Nuno Gomes",
    stat: 1,
  },
  {
    outcome: "GOALS",
    playerName: "João Moutinho",
    stat: 2,
  },
];

const setupMapStateToProps = ({
  eventUrn = EVENT_URN,
  expressionComponents = EXPRESSION_COMPONENTS,
  expressionMetadata = EXPRESSION_METADATA,
  result = RESULT,
} = {}) => makeMapStateToProps()(GENERIC_STATE, { eventUrn, expressionComponents, expressionMetadata, result });

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
      fixtureStatus: FixtureStatus.PRE_MATCH,
      home: {
        name: "Aston Villa",
      },
      away: {
        name: "Liverpool",
      },
      score: {
        home: 4,
        away: 2,
      },
      isAmericanFormat: false,
    };

    beforeEach(() => {
      getFixtureBySportEventURN.mockReturnValueOnce(FOOTBALL_FIXTURE);
      getEnhancedTrackingData.mockReturnValueOnce([
        { status: TrackingBarStatus.PENDING, currentValue: 0, goal: 4, trackingType: "PROGRESS", outcomeDefinitions },
        {
          trackingType: "INDIVIDUAL_TRACKING",
          individualTrackingData,
        },
      ]);
    });

    it("should get data from state and build correct view model", () => {
      const stateProps = setupMapStateToProps();

      expect(getFixtureBySportEventURN).toHaveBeenCalledTimes(1);
      expect(getFixtureBySportEventURN).toHaveBeenCalledWith(GENERIC_STATE.entities, EVENT_URN);

      expect(getEnhancedTrackingData).toHaveBeenCalledTimes(1);
      expect(getEnhancedTrackingData).toHaveBeenCalledWith(
        FOOTBALL_FIXTURE,
        EXPRESSION_COMPONENTS,
        EXPRESSION_METADATA,
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
            trackingType: "PROGRESS",
            outcomeDefinitions,
          },
          {
            trackingType: "INDIVIDUAL_TRACKING",
            individualTrackingData: [
              {
                outcome: "GOALS",
                playerName: "Nuno Gomes",
                stat: 1,
              },
              {
                outcome: "GOALS",
                playerName: "João Moutinho",
                stat: 2,
              },
            ],
          },
        ],
        footballPlayerIds: ["6354321", "6354322"],
        i18nLabels: {
          hidePlayerProgressLabel: "I18N.ENHANCED_TRACKING.HIDE_PROGRESS",
          playerProgressTitleLabel: "I18N.ENHANCED_TRACKING.PROGRESS",
          showPlayerProgressLabel: "I18N.ENHANCED_TRACKING.SHOW_PROGRESS",
          hideSquadsProgressLabel: "I18N.ENHANCED_TRACKING.SQUADS.HIDE_PROGRESS",
          squadsProgressTitleLabel: "I18N.ENHANCED_TRACKING.SQUADS.PROGRESS",
          showSquadsProgressLabel: "I18N.ENHANCED_TRACKING.SQUADS.SHOW_PROGRESS",
        },
      });
    });
  });

  describe("when fixture is FootballFixture and is Inplay", () => {
    const FOOTBALL_FIXTURE = {
      urn: FIXTURE_URN,
      typename: "FootballFixture",
      fixtureStatus: FixtureStatus.IN_PLAY,
      home: {
        name: "Aston Villa",
      },
      away: {
        name: "Liverpool",
      },
      score: {
        home: 4,
        away: 2,
      },
      isAmericanFormat: false,
    };

    beforeEach(() => {
      getFixtureBySportEventURN.mockReturnValueOnce(FOOTBALL_FIXTURE);
      getEnhancedTrackingData.mockReturnValueOnce([
        { status: TrackingBarStatus.ACTIVE, currentValue: 2, goal: 4, trackingType: "PROGRESS", outcomeDefinitions },
        {
          trackingType: "INDIVIDUAL_TRACKING",
          individualTrackingData,
        },
      ]);
    });

    it("should get data from state and build correct view model", () => {
      const stateProps = setupMapStateToProps();

      expect(getFixtureBySportEventURN).toHaveBeenCalledTimes(1);
      expect(getFixtureBySportEventURN).toHaveBeenCalledWith(GENERIC_STATE.entities, EVENT_URN);

      expect(getEnhancedTrackingData).toHaveBeenCalledTimes(1);
      expect(getEnhancedTrackingData).toHaveBeenCalledWith(
        FOOTBALL_FIXTURE,
        EXPRESSION_COMPONENTS,
        EXPRESSION_METADATA,
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
            trackingType: "PROGRESS",
            outcomeDefinitions,
          },
          {
            trackingType: "INDIVIDUAL_TRACKING",
            individualTrackingData: [
              {
                outcome: "GOALS",
                playerName: "Nuno Gomes",
                stat: 1,
              },
              {
                outcome: "GOALS",
                playerName: "João Moutinho",
                stat: 2,
              },
            ],
          },
        ],
        footballPlayerIds: ["6354321", "6354322"],
        i18nLabels: {
          hidePlayerProgressLabel: "I18N.ENHANCED_TRACKING.HIDE_PROGRESS",
          playerProgressTitleLabel: "I18N.ENHANCED_TRACKING.PROGRESS",
          showPlayerProgressLabel: "I18N.ENHANCED_TRACKING.SHOW_PROGRESS",
          hideSquadsProgressLabel: "I18N.ENHANCED_TRACKING.SQUADS.HIDE_PROGRESS",
          squadsProgressTitleLabel: "I18N.ENHANCED_TRACKING.SQUADS.PROGRESS",
          showSquadsProgressLabel: "I18N.ENHANCED_TRACKING.SQUADS.SHOW_PROGRESS",
        },
      });
    });
  });

  describe("when bet result is Void", () => {
    const FOOTBALL_FIXTURE = {
      urn: FIXTURE_URN,
      typename: "FootballFixture",
      fixtureStatus: FixtureStatus.IN_PLAY,
      home: {
        name: "Aston Villa",
      },
      away: {
        name: "Liverpool",
      },
      score: {
        home: 4,
        away: 2,
      },
      isAmericanFormat: false,
    };

    beforeEach(() => {
      getFixtureBySportEventURN.mockReturnValueOnce(FOOTBALL_FIXTURE);
      getEnhancedTrackingData.mockReturnValueOnce([
        { status: TrackingBarStatus.PENDING, currentValue: 0, goal: 4, trackingType: "PROGRESS", outcomeDefinitions },
      ]);
    });

    it("should get data from state and build correct view model", () => {
      const stateProps = setupMapStateToProps({ result: Result.VOID });

      expect(getFixtureBySportEventURN).toHaveBeenCalledTimes(1);
      expect(getFixtureBySportEventURN).toHaveBeenCalledWith(GENERIC_STATE.entities, EVENT_URN);

      expect(getEnhancedTrackingData).toHaveBeenCalledTimes(1);
      expect(getEnhancedTrackingData).toHaveBeenCalledWith(
        FOOTBALL_FIXTURE,
        EXPRESSION_COMPONENTS,
        EXPRESSION_METADATA,
        Result.VOID,
      );

      expect(stateProps).toEqual({
        urn: FIXTURE_URN,
        typename: "FootballFixture",
        enhancedTrackingData: [
          {
            currentValue: 0,
            goal: 4,
            status: "PENDING",
            outcomeDefinitions,
            trackingType: "PROGRESS",
          },
        ],
        footballPlayerIds: ["6354321", "6354322"],
        i18nLabels: {
          hidePlayerProgressLabel: "I18N.ENHANCED_TRACKING.HIDE_PROGRESS",
          playerProgressTitleLabel: "I18N.ENHANCED_TRACKING.PROGRESS",
          showPlayerProgressLabel: "I18N.ENHANCED_TRACKING.SHOW_PROGRESS",
          hideSquadsProgressLabel: "I18N.ENHANCED_TRACKING.SQUADS.HIDE_PROGRESS",
          squadsProgressTitleLabel: "I18N.ENHANCED_TRACKING.SQUADS.PROGRESS",
          showSquadsProgressLabel: "I18N.ENHANCED_TRACKING.SQUADS.SHOW_PROGRESS",
        },
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
      const footballPlayerIds = ["1234", "5678"];

      expect(dispatchSubscribeFixtureUpdates(urn, typename, footballPlayerIds)).toEqual({
        type: SUBSCRIBE_FIXTURE_UPDATES,
        payload: {
          urn,
          typename,
          isLite: true,
          includeStats: true,
          includePlayers: true,
          footballPlayerIds: ["1234", "5678"],
          includePlayerStats: true,
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

  describe("dispatchObbEnhancedTrackingModalAction", () => {
    it("should dispatch UI__OBB_ENHANCED_TRACKING_PLAYER_COUNTER action with actionType", () => {
      const { dispatchObbEnhancedTrackingModalAction } = mapDispatchToProps;

      expect(dispatchObbEnhancedTrackingModalAction("opened", "eventName", "cardUrn", "betLegPartType")).toEqual({
        type: "UI/OBB_ENHANCED_TRACKING_PLAYER_COUNTER",
        payload: {
          actionType: "opened",
          eventName: "eventName",
          cardUrn: "cardUrn",
          betLegPartType: "betLegPartType",
        },
      });

      expect(dispatchObbEnhancedTrackingModalAction("closed", "eventName", "cardUrn", "betLegPartType")).toEqual({
        type: "UI/OBB_ENHANCED_TRACKING_PLAYER_COUNTER",
        payload: {
          actionType: "closed",
          eventName: "eventName",
          cardUrn: "cardUrn",
          betLegPartType: "betLegPartType",
        },
      });
    });
  });
});
