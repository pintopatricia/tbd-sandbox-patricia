import { buildVideoSawEvent } from "tagging-library";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import {
  getMediaPlayerLoadedEvent,
  getTimeFormBroadCastsMediaPlayerEvent,
  getBroadcastsAndStatisticsCardMediaPlayerEvent,
  getRaceReplaysMediaPlayerEvent,
} from "./video-saw";
import { isRaceHierarchy } from "../../helpers/markets";
import { getSportByURN } from "../../state/entities/sports/sport-selectors";
import { createSportsbookMarketByURNSelector } from "../../state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "../../state/entities/exchange-markets/exchange-market-selectors";
import { createRaceByURNSelector } from "../../state/entities/races/race-selectors";
import { createMeetingByURNSelector } from "../../state/entities/meetings/meeting-selectors";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { getSportEventByURN } from "../../state/entities/sport-events/sport-event-selectors";
import { getCompetitionByURN } from "../../state/entities/competitions/competition-selectors";

jest.mock("tagging-library", () => ({
  buildVideoSawEvent: jest.fn().mockReturnValue("video saw event"),
}));
jest.mock("../../state/layout/cards/cards-selectors");
jest.mock("../../state/entities/sports/sport-selectors");
jest.mock("../../state/entities/races/race-selectors");
jest.mock("../../state/entities/meetings/meeting-selectors");
jest.mock("../../state/entities/sport-events/sport-event-selectors");
jest.mock("../../state/entities/competitions/competition-selectors");
jest.mock("../../state/entities/sportsbook-markets/sportsbook-market-selectors");
jest.mock("../../state/entities/exchange-markets/exchange-market-selectors");
jest.mock("../../helpers/markets");

describe("VideoSaw GA4 resolvers", () => {
  const state = {
    layouts: {
      cards: {},
    },
    entities: {},
  };
  const cardUrn = "ppb:tbd:card:raceBroadcasts:30289926.2020";
  const label = "label";

  beforeEach(() => {
    jest.clearAllMocks();

    createRaceByURNSelector.mockReturnValue(() => ({
      name: "Race Name",
      meeting: "urn",
      startTime: "2024-01-01T18:00:00.000Z",
    }));
    createMeetingByURNSelector.mockReturnValue(() => ({
      urn: "ppb:meeting:30289926",
      entityName: "Meeting Name",
      sportUrn: "sportUrn",
      meetingId: "30289926",
      venue: "venue",
    }));
    getSportByURN.mockReturnValue({
      name: "Sport Name",
      sportId: 7,
    });
    getSportEventByURN.mockReturnValue({
      eventId: "37737646",
      name: "Event Name",
    });
    getCompetitionByURN.mockReturnValue(() => ({
      competition: "competition",
    }));
  });

  describe("getMediaPlayerLoadedEvent", () => {
    describe("when cardUrn matches a broadcastsCard in state", () => {
      it("should call buildVideoSawEvent with the correct params", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: cardUrn,
          broadcasts: {
            liveVideoUrl: "liveVideoUrl",
          },
        }));
        const result = getMediaPlayerLoadedEvent({ payload: { label } }, state);

        expect(buildVideoSawEvent).toHaveBeenCalledWith({
          action: TaggingAction.SAW_VIDEO,
          elementText: label,
          module: "media player",
          error: "null",
          videoProviderId: "null",
          videoStreamId: "null",
          videoStreamName: "null",
          sportId: "7",
          sport: "Sport Name",
          eventId: "30289926",
          eventName: "18:00 venue",
        });
        expect(result).toEqual("video saw event");
      });
    });

    describe("when cardUrn doesn't match any broadcastsCard in state", () => {
      it("shouldn't call buildVideoSawEvent", () => {
        createCardByURNSelector.mockReturnValue(() => undefined);
        const result = getMediaPlayerLoadedEvent({ payload: { label } }, state);
        expect(buildVideoSawEvent).not.toHaveBeenCalled();
        expect(result).toBeNull();
      });
    });

    describe("when the broadcastsCard urn is not valid", () => {
      it("shouldn't call buildVideoSawEvent", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: "invalid-urn",
        }));
        const result = getMediaPlayerLoadedEvent({ payload: { label } }, state);
        expect(buildVideoSawEvent).not.toHaveBeenCalled();
        expect(result).toBeNull();
      });
    });

    describe("when the urn isn't a supported type", () => {
      it("shouldn't call buildVideoSawEvent", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: "ppb:sbkMarket:1.1",
          broadcasts: {
            liveVideoUrl: "liveVideoUrl",
          },
        }));
        const result = getMediaPlayerLoadedEvent({ payload: { label } }, state);
        expect(buildVideoSawEvent).not.toHaveBeenCalled();
        expect(result).toBeNull();
      });
    });
  });

  describe("getTimeFormBroadCastsMediaPlayerEvent", () => {
    it("should call buildVideoSawEvent with the correct params", () => {
      const result = getTimeFormBroadCastsMediaPlayerEvent({ payload: { label } }, state);

      expect(buildVideoSawEvent).toHaveBeenCalledWith({
        action: TaggingAction.SAW_VIDEO,
        elementText: label,
        module: "media player",
        error: "null",
        videoProviderId: "null",
        videoStreamId: "null",
        videoStreamName: "null",
        sportId: "7",
        sport: "Sport Name",
        eventId: "30289926",
        eventName: "18:00 venue",
      });
      expect(result).toEqual("video saw event");
    });
  });

  describe("getBroadcastsAndStatisticsCardMediaPlayerEvent", () => {
    describe("when cardUrn matches a broadcastsCard in state", () => {
      it("should call buildVideoSawEvent with the correct params", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: cardUrn,
          broadcasts: {
            liveVideoUrl: "liveVideoUrl",
          },
        }));
        const result = getBroadcastsAndStatisticsCardMediaPlayerEvent({ payload: { label } }, state);
        expect(buildVideoSawEvent).toHaveBeenCalledWith({
          action: TaggingAction.SAW_VIDEO,
          elementText: label,
          module: "media player",
          error: "null",
          videoProviderId: "null",
          videoStreamId: "null",
          videoStreamName: "null",
          sportId: "7",
          sport: "Sport Name",
          eventId: "37737646",
          eventName: "Event Name",
        });
        expect(result).toEqual("video saw event");
      });
    });

    describe("when cardUrn doesn't match any BroadcastsAndStatisticsCard in state", () => {
      it("shouldn't call buildVideoSawEvent", () => {
        createCardByURNSelector.mockReturnValue(() => undefined);
        const result = getBroadcastsAndStatisticsCardMediaPlayerEvent({ payload: { label } }, state);
        expect(buildVideoSawEvent).not.toHaveBeenCalled();
        expect(result).toBeNull();
      });
    });
  });

  describe("getRaceReplaysMediaPlayerEvent", () => {
    const action = {
      payload: {
        marketUrn: "marketUrn",
      },
    };

    describe("when the market does not exist", () => {
      it("should return null", () => {
        createSportsbookMarketByURNSelector.mockReturnValueOnce(() => undefined);
        createExchangeMarketSelector.mockReturnValueOnce(() => undefined);

        const result = getRaceReplaysMediaPlayerEvent(action, state);

        expect(buildVideoSawEvent).not.toHaveBeenCalled();
        expect(result).toBe(null);
      });
    });

    describe("when the market exists", () => {
      describe("and is not race hierarchy", () => {
        it("should return null", () => {
          createSportsbookMarketByURNSelector.mockReturnValueOnce(() => undefined);
          createExchangeMarketSelector.mockReturnValueOnce(() => ({
            hierarchy: {
              race: "race",
            },
          }));

          isRaceHierarchy.mockReturnValue(false);

          const result = getRaceReplaysMediaPlayerEvent(action, state);

          expect(buildVideoSawEvent).not.toHaveBeenCalled();
          expect(result).toBe(null);
        });
      });

      describe("and is race hierarchy", () => {
        describe("and has no sport and no meeting", () => {
          it("should call buildVideoSawEvent with media event info as null", () => {
            createSportsbookMarketByURNSelector.mockReturnValueOnce(() => undefined);
            createExchangeMarketSelector.mockReturnValueOnce(() => ({
              hierarchy: {
                race: "race",
              },
            }));

            isRaceHierarchy.mockReturnValue(true);

            getSportByURN.mockReturnValue(undefined);
            createRaceByURNSelector.mockReturnValueOnce(() => undefined);
            createMeetingByURNSelector.mockReturnValueOnce(() => undefined);

            const result = getRaceReplaysMediaPlayerEvent(action, state);

            expect(buildVideoSawEvent).toHaveBeenCalledWith({
              action: "saw video",
              elementText: "race replay",
              module: "media player",
              error: "null",
              videoProviderId: "null",
              videoStreamId: "null",
              videoStreamName: "null",
              sportId: "null",
              sport: "null",
              eventId: "null",
              eventName: "null",
            });
            expect(result).toBe("video saw event");
          });
        });

        describe("and has sport and meeting", () => {
          it("should call buildVideoSawEvent with media event info values", () => {
            createSportsbookMarketByURNSelector.mockReturnValueOnce(() => undefined);
            createExchangeMarketSelector.mockReturnValueOnce(() => ({
              hierarchy: {
                race: "race",
              },
            }));

            isRaceHierarchy.mockReturnValue(true);

            getSportByURN.mockReturnValue({ sportId: "sportId", name: "sportName" });
            createRaceByURNSelector.mockReturnValueOnce(() => ({
              meeting: "meeting",
              startTime: "2024-01-01T18:00:00.000Z",
            }));
            createMeetingByURNSelector.mockReturnValueOnce(() => ({ meetingId: "meetingId", venue: "Venue" }));

            const result = getRaceReplaysMediaPlayerEvent(action, state);

            expect(buildVideoSawEvent).toHaveBeenCalledWith({
              action: "saw video",
              elementText: "race replay",
              module: "media player",
              error: "null",
              videoProviderId: "null",
              videoStreamId: "null",
              videoStreamName: "null",
              sportId: "sportId",
              sport: "sportName",
              eventId: "meetingId",
              eventName: "18:00 Venue",
            });
            expect(result).toBe("video saw event");
          });
        });
      });
    });
  });
});
