import useStatsSupportingContentButtonsCardGroupVM from "./StatsSupportingContentButtonsCardGroup.viewmodel";
import { useStatsSupportingContentButtonsCardGroupQuery } from "../model/StatsSupportingContentButtonsCardGroup.graphql";
import emitEvent from "../../../event-broker/event-emitter";
import { OthersIconName, SupportingContentIconName } from "@ppb/the-wall-icons";

jest.mock("../model/StatsSupportingContentButtonsCardGroup.graphql", () => ({
  useStatsSupportingContentButtonsCardGroupQuery: jest.fn(),
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

const CARD_MY_BETS_DATA = {
  card: {
    urn: "ppb:tbd:stats:cardgroup:supportingContentButtons:1",
    full: {
      edges: [
        {
          displayName: {
            translationKey: "I18N.INPLAY.COUPON.MATCH.STATS.PEBBLE",
          },
          node: {
            urn: "ppb:tbd:stats:card:matchStats:1",
          },
        },
      ],
    },
    partials: {
      edges: [
        {
          displayName: {
            translationKey: "I18N.INPLAY.COUPON.MATCH.STATS.PEBBLE",
          },
          node: {
            urn: "ppb:tbd:stats:card:matchStats:1",
            __typename: "StatsMatchStatsCard",
          },
        },
        {
          displayName: {
            translationKey: "I18N.STATS.EVENTS_PEBBLE",
          },
          node: {
            urn: "ppb:tbd:stats:card:incidents:1|pebble",
            __typename: "IncidentsCard",
          },
        },
        {
          displayName: {
            translationKey: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
          },
          node: {
            urn: "ppb:tbd:stats:card:broadcasts:1|1|livevideo",
            __typename: "StatsBroadcastsCard",
          },
        },
        {
          displayName: {
            translationKey: "I18N.MYBETS_RESULTS_BUTTON",
          },
          node: {
            urn: "ppb:tbd:stats:card:raceResults:1.1?=selectionId=1",
            __typename: "StatsRaceResultsCard",
          },
        },
      ],
    },
  },
};

const CARD_MY_BETS_DATA_EMPTY_ARRAY = {
  card: {
    urn: "ppb:tbd:stats:cardgroup:supportingContentButtons:1",
    full: {
      edges: [],
    },
    partials: {
      edges: [],
    },
  },
};

describe("useStatsSupportingContentButtonsCardGroupVM", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useStatsSupportingContentButtonsCardGroupQuery.mockReturnValue({
      request: requestMock,
      data: {
        card: undefined,
      },
    });
  });

  describe("when 'card' is undefined", () => {
    it("should resolve the VM as null", () => {
      useStatsSupportingContentButtonsCardGroupQuery.mockReturnValue({
        request: requestMock,
        data: {
          card: undefined,
        },
      });

      const result = useStatsSupportingContentButtonsCardGroupVM("urn");

      expect(result.vm.data).toEqual(null);
      expect(result.vm.events).toEqual({
        onButtonsStatsPress: expect.any(Function),
      });
    });
  });

  describe("when 'card' is defined", () => {
    beforeEach(() => {
      useStatsSupportingContentButtonsCardGroupQuery.mockReturnValue({
        request: requestMock,
        data: CARD_MY_BETS_DATA,
      });
    });

    it("should resolve the VM properly", () => {
      const result = useStatsSupportingContentButtonsCardGroupVM("ppb:tbd:stats:cardgroup:supportingContentButtons:1");

      expect(result.vm.data).toEqual({
        items: [
          {
            urn: "ppb:tbd:stats:card:matchStats:1",
            label: "I18N.INPLAY.COUPON.MATCH.STATS.PEBBLE",
            typename: "StatsMatchStatsCard",
            icon: SupportingContentIconName.MATCH_STATS,
            applyContentStyles: true,
          },
          {
            urn: "ppb:tbd:stats:card:incidents:1|pebble",
            label: "I18N.STATS.EVENTS_PEBBLE",
            typename: "IncidentsCard",
            icon: SupportingContentIconName.PITCH,
            applyContentStyles: true,
          },
          {
            urn: "ppb:tbd:stats:card:broadcasts:1|1|livevideo",
            label: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
            typename: "StatsBroadcastsCard",
            icon: SupportingContentIconName.LIVE_VIDEO,
            applyContentStyles: false,
          },
          {
            urn: "ppb:tbd:stats:card:raceResults:1.1?=selectionId=1",
            label: "I18N.MYBETS_RESULTS_BUTTON",
            typename: "StatsRaceResultsCard",
            icon: OthersIconName.WINNER_RIBBON,
            applyContentStyles: false,
          },
        ],
      });
    });

    it("should set the events callbacks properly and it should call `emitEvent`", () => {
      const result = useStatsSupportingContentButtonsCardGroupVM("urn");

      expect(result.vm.events).toEqual({
        onButtonsStatsPress: expect.any(Function),
      });

      result.vm.events.onButtonsStatsPress("urn", 1, true);

      expect(emitEvent).toHaveBeenCalledWith("@@UI/SUPPORTING_CONTENT_BUTTON_STATS_CLICK", {
        urn: "urn",
        isSelected: true,
        buttonId: 1,
      });
    });
  });

  describe("when the card group has an empty array", () => {
    beforeEach(() => {
      useStatsSupportingContentButtonsCardGroupQuery.mockReturnValue({
        request: requestMock,
        data: CARD_MY_BETS_DATA_EMPTY_ARRAY,
      });
    });

    it("should resolve the VM properly", () => {
      const result = useStatsSupportingContentButtonsCardGroupVM("ppb:tbd:stats:cardgroup:supportingContentButtons:1");

      expect(result.vm.data).toEqual({
        items: null,
      });
    });
  });
});
