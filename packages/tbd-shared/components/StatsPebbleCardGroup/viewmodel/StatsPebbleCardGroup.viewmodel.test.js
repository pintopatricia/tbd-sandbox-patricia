import useStatsPebbleCardGroupVM from "./StatsPebbleCardGroup.viewmodel";
import { useStatsPebbleCardGroupQuery } from "../model/StatsPebbleCardGroup.graphql";
import emitEvent from "../../../event-broker/event-emitter";

jest.mock("../model/StatsPebbleCardGroup.graphql", () => ({
  useStatsPebbleCardGroupQuery: jest.fn(),
}));
jest.mock("../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));
jest.mock("../../../event-broker/event-emitter", () => jest.fn());

const requestCallMockFn = jest.fn();
const requestMock = {
  call: requestCallMockFn,
  called: true,
  loading: false,
};

const emptyLabelsMock = {
  title: "I18N.STATS.STATS_UNAVAILABLE",
  message: "I18N.STATS.NO_STATS_AVAILABLE",
};

const emptyLabelsMyBetsMock = {
  title: "I18N.STATS.STATS_UNAVAILABLE",
  message: "I18N.STATS.NO_STATS_AVAILABLE_PM_MYBETS",
};

const CARD_MY_BETS_DATA = {
  card: {
    urn: "ppb:tbd:stats:cardgroup:pebble:1|my-bets",
    selectedItemUrn: "ppb:tbd:stats:card:form:1",
    status: "PRE_MATCH",
    selectedPebble: {
      urn: "ppb:tbd:stats:card:form:1",
      typename: "StatsFormCard",
    },
    full: {
      edges: [
        {
          displayName: {
            translationKey: "I18N.STATS.OVERALL_FORM",
          },
          node: {
            urn: "ppb:tbd:stats:card:form:1",
          },
        },
      ],
    },
    partials: {
      edges: [
        {
          displayName: {
            translationKey: "I18N.STATS.OVERALL_FORM",
          },
          node: {
            urn: "ppb:tbd:stats:card:form:1",
            __typename: "StatsFormCard",
          },
        },
        {
          displayName: {
            translationKey: "I18N.STATS.H2H_FORM",
          },
          node: {
            urn: "ppb:tbd:stats:card:h2h:1",
            __typename: "StatsHeadToHeadCard",
          },
        },
      ],
    },
  },
  baseCard: {
    urn: "ppb:tbd:stats:cardgroup:pebble:1|my-bets",
    typename: "StatsPebbleCardGroup",
    status: "PRE_MATCH",
  },
};

describe("useStatsPebbleCardGroupVM", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStatsPebbleCardGroupQuery.mockReturnValue({
      request: requestMock,
      data: {
        card: undefined,
      },
    });
  });

  describe("when 'card' is undefined", () => {
    it("should resolve the VM as null", () => {
      useStatsPebbleCardGroupQuery.mockReturnValue({
        request: requestMock,
        data: {
          card: undefined,
        },
      });

      const result = useStatsPebbleCardGroupVM("urn");

      expect(result.vm.data).toEqual(null);
      expect(result.vm.emptyLabels).toEqual(emptyLabelsMock);
      expect(result.vm.events).toEqual({
        onPebbleStatsPress: expect.any(Function),
      });
    });
  });

  describe("when 'card' is defined but context is my bets and status is PRE_MATCH", () => {
    beforeEach(() => {
      useStatsPebbleCardGroupQuery.mockReturnValue({
        request: requestMock,
        data: CARD_MY_BETS_DATA,
      });
    });

    it("should resolve the VM as null with my bets empty labels", () => {
      const result = useStatsPebbleCardGroupVM("ppb:tbd:stats:cardgroup:pebble:1|my-bets");

      expect(result.vm.data).toEqual(null);
      expect(result.vm.emptyLabels).toEqual(emptyLabelsMyBetsMock);
      expect(result.vm.events).toEqual({
        onPebbleStatsPress: expect.any(Function),
      });
    });
  });

  describe("when 'card' is defined", () => {
    beforeEach(() => {
      useStatsPebbleCardGroupQuery.mockReturnValue({
        request: requestMock,
        data: {
          status: "NOT_PRE_MATCH",
          ...CARD_MY_BETS_DATA,
        },
      });
    });

    it("should resolve the VM properly", () => {
      const result = useStatsPebbleCardGroupVM("ppb:tbd:stats:cardgroup:pebble:1|not-my-bets");

      expect(result.vm.emptyLabels).toEqual(emptyLabelsMock);
      expect(result.vm.data).toEqual({
        defaultSelectedPebble: {
          typename: "StatsFormCard",
          urn: "ppb:tbd:stats:card:form:1",
        },
        local: {
          selectedPebble: {
            urn: "ppb:tbd:stats:card:form:1",
            typename: "StatsFormCard",
          },
        },
        items: [
          {
            id: "ppb:tbd:stats:card:form:1",
            text: "I18N.STATS.OVERALL_FORM",
            typename: "StatsFormCard",
          },
          {
            id: "ppb:tbd:stats:card:h2h:1",
            text: "I18N.STATS.H2H_FORM",
            typename: "StatsHeadToHeadCard",
          },
        ],
      });
    });

    it("should set the events callbacks properly and it should call `emitEvent`", () => {
      const result = useStatsPebbleCardGroupVM("urn");

      expect(result.vm.events).toEqual({
        onPebbleStatsPress: expect.any(Function),
      });

      result.vm.events.onPebbleStatsPress("urn", 1);

      expect(emitEvent).toHaveBeenCalledWith("@@UI/PEBBLE_STATS_CLICK", {
        urn: "urn",
        pebbleId: 1,
      });
    });
  });

  describe("when 'card' is defined but not baseCard", () => {
    beforeEach(() => {
      useStatsPebbleCardGroupQuery.mockReturnValue({
        request: requestMock,
        data: {
          card: {
            urn: "ppb:tbd:stats:cardgroup:pebble:1|my-bets",
            selectedItemUrn: "ppb:tbd:stats:card:form:1",
            status: "PRE_MATCH",
            selectedPebble: {
              urn: "ppb:tbd:stats:card:form:1",
              typename: "StatsFormCard",
            },
            full: {
              edges: [
                {
                  displayName: {
                    translationKey: "I18N.STATS.OVERALL_FORM",
                  },
                  node: {
                    urn: "ppb:tbd:stats:card:form:1",
                  },
                },
              ],
            },
            partials: {
              edges: [
                {
                  displayName: {
                    translationKey: "I18N.STATS.OVERALL_FORM",
                  },
                  node: {
                    urn: "ppb:tbd:stats:card:form:1",
                    __typename: "StatsFormCard",
                  },
                },
                {
                  displayName: {
                    translationKey: "I18N.STATS.H2H_FORM",
                  },
                  node: {
                    urn: "ppb:tbd:stats:card:h2h:1",
                    __typename: "StatsHeadToHeadCard",
                  },
                },
              ],
            },
          },
          baseCard: null,
        },
      });
    });

    it("should have the correct emptyLabels", () => {
      const result = useStatsPebbleCardGroupVM("ppb:tbd:stats:cardgroup:pebble:1|my-bets");

      expect(result.vm.emptyLabels).toEqual(emptyLabelsMock);
    });
  });
});
