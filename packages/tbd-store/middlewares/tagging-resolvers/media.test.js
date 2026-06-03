import {
  getBroadcastsToggleEvent,
  getMediaPlayerLoadedEvent,
  getTimeFormBroadCastsMediaPlayerEvent,
  getTimeFormBroadCastsToggleEvent,
  getBroadcastsAndStatisticsToggleEvent,
  getBroadcastsAndStatisticsCardMediaPlayerEvent,
  getRaceReplaysMediaPlayerEvent,
} from "./media";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { createRaceByURNSelector } from "../../state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "../../state/entities/meetings/meeting-selectors";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import { createSportsbookMarketByURNSelector } from "../../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { isRaceHierarchy } from "../../helpers/markets";

jest.mock("../../state/layout/cards/cards-selectors");
jest.mock("../../state/entities/sports/sport-selectors");
jest.mock("../../state/entities/races/race-selectors");
jest.mock("../../state/entities/meetings/meeting-selectors");
jest.mock("../../state/entities/sport-events/sport-event-selectors");
jest.mock("../../state/entities/competitions/competition-selectors");
jest.mock("../../state/entities/sportsbook-markets/sportsbook-market-selectors");
jest.mock("../../state/entities/exchange-markets/exchange-market-selectors");
jest.mock("../../helpers/markets");

describe("Media gtm resolvers", () => {
  const params = {
    state: {
      layouts: {
        cards: {},
      },
      entities: {},
    },
    isExpanded: true,
    raceCardUrn: "ppb:tbd:card:raceBroadcasts:30289926.2020",
    eventCardUrn: "ppb:tbd:card:eventBroadcasts:37737646",
    timeFormBroadCastsUrn: "ppb:tbd:card:timeFormBroadCasts:30289926.2020",
    broadcastsAndStatisticsUrn: "ppb:tbd:card:broadcastsAndStatistics:YIA-BhEAACIAMO7n/e/31879952",
    raceURN: "ppb:race:30289926.2020",
    label: "label",
    exchangeMarketUrn: "ppb:excMarket:1.166528788",
    sportsbookMarketUrn: "ppb:sbkMarket:1.166528788",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    createCardByURNSelector.mockReturnValue(() => ({
      urn: params.raceCardUrn,
      broadcasts: {
        liveVideoUrl: "liveVideoUrl",
      },
    }));
    createRaceByURNSelector.mockReturnValue(() => ({
      name: "Race Name",
      meeting: "urn",
    }));
    createMeetingByURNSelector.mockReturnValue(() => ({
      urn: "ppb:meeting:30289926",
      entityName: "Meeting Name",
      sportUrn: "sportUrn",
      meetingId: "30289926",
    }));
    getSportByURN.mockReturnValue({
      name: "Sport Name",
      sportId: 7,
    });
  });

  describe("getBroadcastsToggleEvent", () => {
    const { state, isExpanded, raceCardUrn, eventCardUrn } = params;

    it("should return null when cardUrn doesn't match any broadcastsCard in state", () => {
      createCardByURNSelector.mockReturnValue(() => undefined);
      expect(getBroadcastsToggleEvent(state, isExpanded, raceCardUrn)).toBeNull();
    });

    it("should return null when broadcastsCard urn is not a valid urn", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        urn: "invalid-urn",
      }));
      expect(getBroadcastsToggleEvent(state, isExpanded, raceCardUrn)).toBeNull();
    });

    it("should return 'show' action when broadcastsCard is expanded", () => {
      expect(getBroadcastsToggleEvent(state, isExpanded, raceCardUrn)).toMatchObject({
        action: "show",
      });
    });

    it("should return 'hide' action when broadcastsCard is collapsed", () => {
      expect(getBroadcastsToggleEvent(state, !isExpanded, raceCardUrn)).toMatchObject({
        action: "hide",
      });
    });

    it("should return 'live video' label when broadcastsCard has live video url", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        urn: params.raceCardUrn,
        broadcasts: {
          liveVideoUrl: "liveVideoUrl",
        },
      }));
      expect(getBroadcastsToggleEvent(state, isExpanded, raceCardUrn)).toMatchObject({
        label: "live video",
      });
    });

    it("should return 'data viz' label when broadcastsCard has only data viz url", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        urn: params.raceCardUrn,
        broadcasts: {
          liveVideoUrl: undefined,
          dataVizUrl: "dataVizUrl",
        },
      }));
      expect(getBroadcastsToggleEvent(state, isExpanded, raceCardUrn)).toMatchObject({
        label: "data viz",
      });
    });

    describe("when is a race BroadCastCard", () => {
      it("should return the correct gtm event payload", () => {
        expect(getBroadcastsToggleEvent(state, isExpanded, raceCardUrn)).toEqual({
          event: "ga_event",
          action: "show",
          category: "media",
          cd3: "media player",
          label: "live video",
          cd14: 7,
          cd5: "Sport Name",
          cd7: "Meeting Name - Race Name",
          cd84: 30289926,
        });
      });

      it("should return the gtm event payload when broadcastsCard race has no corresponding race in state", () => {
        createRaceByURNSelector.mockReturnValue(() => undefined);
        expect(getBroadcastsToggleEvent(state, isExpanded, raceCardUrn)).toEqual({
          action: "show",
          category: "media",
          cd14: 7,
          cd3: "media player",
          cd5: "Sport Name",
          cd7: null,
          cd84: 30289926,
          event: "ga_event",
          label: "live video",
        });
      });

      it("should return the gtm event payload when race meeting has no corresponding meeting in state", () => {
        createMeetingByURNSelector.mockReturnValue(() => undefined);
        expect(getBroadcastsToggleEvent(state, isExpanded, raceCardUrn)).toEqual({
          action: "show",
          category: "media",
          cd14: 7,
          cd3: "media player",
          cd5: "Sport Name",
          cd7: null,
          cd84: null,
          event: "ga_event",
          label: "live video",
        });
      });

      it("should return the gtm event payload when meeting sport has no corresponding sport in state", () => {
        getSportByURN.mockReturnValue(undefined);
        expect(getBroadcastsToggleEvent(state, isExpanded, raceCardUrn)).toEqual({
          action: "show",
          category: "media",
          cd14: null,
          cd3: "media player",
          cd5: null,
          cd7: "Meeting Name - Race Name",
          cd84: 30289926,
          event: "ga_event",
          label: "live video",
        });
      });

      it("should return the gtm event payload when race meeting urn is invalid", () => {
        createMeetingByURNSelector.mockReturnValue(() => ({
          urn: "invalid-urn",
        }));
        expect(getBroadcastsToggleEvent(state, isExpanded, raceCardUrn)).toEqual({
          action: "show",
          category: "media",
          cd14: 7,
          cd3: "media player",
          cd5: "Sport Name",
          cd7: "undefined - Race Name",
          cd84: null,
          event: "ga_event",
          label: "live video",
        });
      });
    });

    describe("when is a event BroadCastCard", () => {
      beforeEach(() => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: eventCardUrn,
          broadcasts: {
            liveVideoUrl: "liveVideoUrl",
          },
        }));
        getSportEventByURN.mockReturnValue({
          eventId: "eventId",
          name: "Event Name",
        });
        getCompetitionByURN.mockReturnValue(() => ({
          competition: "competition",
        }));
        getSportByURN.mockReturnValue({
          name: "Sport Name",
          sportId: 1,
        });
      });

      it("should return the correct gtm event payload", () => {
        expect(getBroadcastsToggleEvent(state, isExpanded, eventCardUrn)).toEqual({
          event: "ga_event",
          action: "show",
          category: "media",
          cd3: "media player",
          label: "live video",
          cd14: 1,
          cd5: "Sport Name",
          cd7: "Event Name",
          cd84: "eventId",
        });
      });

      it("should return the gtm event payload when broadcastsCard event has no corresponding event in state", () => {
        getSportEventByURN.mockReturnValue(() => undefined);
        expect(getBroadcastsToggleEvent(state, isExpanded, eventCardUrn)).toEqual({
          action: "show",
          category: "media",
          cd14: 1,
          cd3: "media player",
          cd5: "Sport Name",
          cd7: "",
          cd84: null,
          event: "ga_event",
          label: "live video",
        });
      });

      it("should return the gtm event payload when the corresponding event in state has no eventId", () => {
        getSportEventByURN.mockReturnValue({
          eventId: undefined,
        });
        expect(getBroadcastsToggleEvent(state, isExpanded, eventCardUrn)).toEqual({
          action: "show",
          category: "media",
          cd14: 1,
          cd3: "media player",
          cd5: "Sport Name",
          cd7: undefined,
          cd84: null,
          event: "ga_event",
          label: "live video",
        });
      });

      it("should return the gtm event payload when event competition has no corresponding competition in state", () => {
        getCompetitionByURN.mockReturnValue(undefined);
        expect(getBroadcastsToggleEvent(state, isExpanded, eventCardUrn)).toEqual({
          action: "show",
          category: "media",
          cd14: null,
          cd3: "media player",
          cd5: null,
          cd7: "Event Name",
          cd84: "eventId",
          event: "ga_event",
          label: "live video",
        });
      });

      it("should return the gtm event payload when meeting sport has no corresponding sport in state", () => {
        getSportByURN.mockReturnValue(undefined);
        expect(getBroadcastsToggleEvent(state, isExpanded, eventCardUrn)).toEqual({
          action: "show",
          category: "media",
          cd14: null,
          cd3: "media player",
          cd5: null,
          cd7: "Event Name",
          cd84: "eventId",
          event: "ga_event",
          label: "live video",
        });
      });
    });

    describe("when it's an unknown card", () => {
      it("should return null", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: "ppb:sbkMarket:1.1",
          broadcasts: {
            liveVideoUrl: "liveVideoUrl",
          },
        }));
        expect(getBroadcastsToggleEvent(state, isExpanded, "ppb:tbd:card:unknownCard:-1")).toEqual(null);
      });
    });
  });

  describe("getMediaPlayerLoadedEvent", () => {
    const { label, state, raceCardUrn } = params;

    it("should return null when cardUrn doesn't match any broadcastsCard in state", () => {
      createCardByURNSelector.mockReturnValue(() => undefined);
      expect(getMediaPlayerLoadedEvent(state, label, raceCardUrn)).toBeNull();
    });

    it("should return null when broadcastsCard urn is not a valid urn", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        urn: "invalid-urn",
      }));
      expect(getMediaPlayerLoadedEvent(state, label, raceCardUrn)).toBeNull();
    });

    it("should return the correct event", () => {
      expect(getMediaPlayerLoadedEvent(state, label, raceCardUrn)).toEqual({
        event: "ga_event",
        category: "media",
        action: "saw video",
        label,
        cd3: "media player",
        cd14: 7,
        cd5: "Sport Name",
        cd7: "Meeting Name - Race Name",
        cd84: 30289926,
      });
    });

    it("should return null when the urn isn't of supported type", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        urn: "ppb:sbkMarket:1.1",
        broadcasts: {
          liveVideoUrl: "liveVideoUrl",
        },
      }));

      expect(getMediaPlayerLoadedEvent(state, label, "ppb:sbkMarket:1.1")).toBeNull();
    });
  });

  describe("getTimeFormBroadCastsToggleEvent", () => {
    const { state, isExpanded, timeFormBroadCastsUrn, raceUrn } = params;

    it("should return null when cardUrn doesn't match any timeFormBroadCastsCard in state", () => {
      createCardByURNSelector.mockReturnValue(() => undefined);
      expect(getTimeFormBroadCastsToggleEvent(state, isExpanded, timeFormBroadCastsUrn, raceUrn)).toBeNull();
    });

    it("should return 'show' action when timeFormBroadCastsCard is expanded", () => {
      expect(getTimeFormBroadCastsToggleEvent(state, isExpanded, timeFormBroadCastsUrn, raceUrn)).toMatchObject({
        action: "show",
      });
    });

    it("should return 'hide' action when timeFormBroadCastsCard is collapsed", () => {
      expect(getTimeFormBroadCastsToggleEvent(state, !isExpanded, timeFormBroadCastsUrn, raceUrn)).toMatchObject({
        action: "hide",
      });
    });

    it("should return 'live video' label when timeFormBroadCastsCard has live video url", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        urn: params.raceCardUrn,
        broadcasts: {
          liveVideoUrl: "liveVideoUrl",
        },
      }));
      expect(getTimeFormBroadCastsToggleEvent(state, isExpanded, timeFormBroadCastsUrn, raceUrn)).toMatchObject({
        label: "live video",
      });
    });

    it("should return 'data viz' label when timeFormBroadCastsCard has only data viz url", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        urn: params.raceCardUrn,
        broadcasts: {
          liveVideoUrl: undefined,
          dataVizUrl: "dataVizUrl",
        },
      }));
      expect(getTimeFormBroadCastsToggleEvent(state, isExpanded, timeFormBroadCastsUrn, raceUrn)).toMatchObject({
        label: "data viz",
      });
    });

    it("should return the correct gtm event payload", () => {
      expect(getTimeFormBroadCastsToggleEvent(state, isExpanded, timeFormBroadCastsUrn, raceUrn)).toEqual({
        event: "ga_event",
        action: "show",
        category: "media",
        cd3: "media player",
        label: "live video",
        cd14: 7,
        cd5: "Sport Name",
        cd7: "Meeting Name - Race Name",
        cd84: 30289926,
      });
    });

    it("should return the gtm event payload when broadcastsCard race has no corresponding race in state", () => {
      createRaceByURNSelector.mockReturnValue(() => undefined);
      expect(getTimeFormBroadCastsToggleEvent(state, isExpanded, timeFormBroadCastsUrn, raceUrn)).toEqual({
        action: "show",
        category: "media",
        cd14: 7,
        cd3: "media player",
        cd5: "Sport Name",
        cd7: null,
        cd84: 30289926,
        event: "ga_event",
        label: "live video",
      });
    });

    it("should return the gtm event payload when race meeting has no corresponding meeting in state", () => {
      createMeetingByURNSelector.mockReturnValue(() => undefined);
      expect(getTimeFormBroadCastsToggleEvent(state, isExpanded, timeFormBroadCastsUrn, raceUrn)).toEqual({
        action: "show",
        category: "media",
        cd14: 7,
        cd3: "media player",
        cd5: "Sport Name",
        cd7: null,
        cd84: null,
        event: "ga_event",
        label: "live video",
      });
    });

    it("should return the gtm event payload when meeting sport has no corresponding sport in state", () => {
      getSportByURN.mockReturnValue(undefined);
      expect(getTimeFormBroadCastsToggleEvent(state, isExpanded, timeFormBroadCastsUrn, raceUrn)).toEqual({
        action: "show",
        category: "media",
        cd14: null,
        cd3: "media player",
        cd5: null,
        cd7: "Meeting Name - Race Name",
        cd84: 30289926,
        event: "ga_event",
        label: "live video",
      });
    });
  });

  describe("getTimeFormBroadCastsMediaPlayerEvent", () => {
    const { label, state, raceUrn } = params;

    it("should return the correct event", () => {
      expect(getTimeFormBroadCastsMediaPlayerEvent(state, label, raceUrn)).toEqual({
        event: "ga_event",
        category: "media",
        action: "saw video",
        label,
        cd3: "media player",
        cd14: 7,
        cd5: "Sport Name",
        cd7: "Meeting Name - Race Name",
        cd84: 30289926,
      });
    });
  });

  describe("getBroadcastsAndStatisticsToggleEvent", () => {
    const { state, isExpanded, broadcastsAndStatisticsUrn } = params;

    it("should return null when cardUrn doesn't match any BroadcastsAndStatisticsCard in state", () => {
      createCardByURNSelector.mockReturnValue(() => undefined);
      expect(getBroadcastsAndStatisticsToggleEvent(state, isExpanded, broadcastsAndStatisticsUrn)).toBeNull();
    });

    it("should return 'show' action when BroadcastsAndStatisticsCard is expanded", () => {
      expect(getBroadcastsAndStatisticsToggleEvent(state, isExpanded, broadcastsAndStatisticsUrn)).toMatchObject({
        action: "show",
      });
    });

    it("should return 'hide' action when BroadcastsAndStatisticsCard is collapsed", () => {
      expect(getBroadcastsAndStatisticsToggleEvent(state, !isExpanded, broadcastsAndStatisticsUrn)).toMatchObject({
        action: "hide",
      });
    });

    it("should return 'live video' label when BroadcastsAndStatisticsCard has live video url", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        urn: params.raceCardUrn,
        broadcasts: {
          liveVideoUrl: "liveVideoUrl",
        },
      }));
      expect(getBroadcastsAndStatisticsToggleEvent(state, isExpanded, broadcastsAndStatisticsUrn)).toMatchObject({
        label: "live video",
      });
    });

    it("should return 'data viz' label when BroadcastsAndStatisticsCard has only data viz url", () => {
      createCardByURNSelector.mockReturnValue(() => ({
        urn: params.raceCardUrn,
        broadcasts: {
          liveVideoUrl: undefined,
          dataVizUrl: "dataVizUrl",
        },
      }));
      expect(getBroadcastsAndStatisticsToggleEvent(state, isExpanded, broadcastsAndStatisticsUrn)).toMatchObject({
        label: "data viz",
      });
    });
  });

  describe("getBroadcastsAndStatisticsCardMediaPlayerEvent", () => {
    const { label, state, broadcastsAndStatisticsUrn } = params;

    it("should return null when cardUrn doesn't match any BroadcastsAndStatisticsCard in state", () => {
      createCardByURNSelector.mockReturnValue(() => undefined);
      expect(getBroadcastsAndStatisticsCardMediaPlayerEvent(state, label, broadcastsAndStatisticsUrn)).toBeNull();
    });

    it("should return the correct event", () => {
      getSportEventByURN.mockReturnValue({
        eventId: "eventId",
        name: "Event Name",
      });
      getCompetitionByURN.mockReturnValue(() => ({
        competition: "competition",
      }));
      getSportByURN.mockReturnValue({
        name: "Sport Name",
        sportId: 1,
      });

      expect(getBroadcastsAndStatisticsCardMediaPlayerEvent(state, label, broadcastsAndStatisticsUrn)).toEqual({
        event: "ga_event",
        category: "media",
        action: "saw video",
        label,
        cd3: "media player",
        cd14: 1,
        cd5: "Sport Name",
        cd7: "Event Name",
        cd84: "eventId",
      });
    });
  });

  describe("getRaceReplaysMediaPlayerEvent", () => {
    const { label, state, sportsbookMarketUrn, exchangeMarketUrn, raceUrn } = params;

    describe("when the market is exchangeMarket", () => {
      it("should return the correct event", () => {
        createSportsbookMarketByURNSelector.mockReturnValue(() => undefined);
        createExchangeMarketSelector.mockReturnValue(() => ({ hierarchy: { race: raceUrn } }));
        isRaceHierarchy.mockReturnValue(true);
        expect(getRaceReplaysMediaPlayerEvent(state, label, exchangeMarketUrn)).toEqual({
          event: "ga_event",
          category: "media",
          action: "saw video",
          label,
          cd3: "media player",
          cd14: 7,
          cd5: "Sport Name",
          cd7: "Meeting Name - Race Name",
          cd84: 30289926,
        });
      });
    });

    describe("when the market is sportsbookMarket", () => {
      it("should return the correct event", () => {
        createSportsbookMarketByURNSelector.mockReturnValue(() => ({ hierarchy: { race: raceUrn } }));
        createExchangeMarketSelector.mockReturnValue(() => undefined);
        isRaceHierarchy.mockReturnValue(true);
        expect(getRaceReplaysMediaPlayerEvent(state, label, sportsbookMarketUrn)).toEqual({
          event: "ga_event",
          category: "media",
          action: "saw video",
          label,
          cd3: "media player",
          cd14: 7,
          cd5: "Sport Name",
          cd7: "Meeting Name - Race Name",
          cd84: 30289926,
        });
      });
    });

    describe("when the market is not found", () => {
      it("should return null when marketUrn doesn't match any sportsbook or exchange market in state", () => {
        createSportsbookMarketByURNSelector.mockReturnValue(() => undefined);
        createExchangeMarketSelector.mockReturnValue(() => undefined);
        expect(getRaceReplaysMediaPlayerEvent(state, label, sportsbookMarketUrn)).toBeNull();
      });
    });

    describe("when the market hierarchy is not a raceHierarchy", () => {
      it("should return null", () => {
        createSportsbookMarketByURNSelector.mockReturnValue(() => ({ hierarchy: { race: raceUrn } }));
        createExchangeMarketSelector.mockReturnValue(() => undefined);
        isRaceHierarchy.mockReturnValue(false);
        expect(getRaceReplaysMediaPlayerEvent(state, label, sportsbookMarketUrn)).toBeNull();
      });
    });
  });
});
