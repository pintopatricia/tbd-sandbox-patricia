import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE,
  UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED,
} from "@ppb/tbd-store/actions/media";
import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { UI__STATISTICS_MODAL_TOGGLE } from "@ppb/tbd-store/actions/interface";
import { DELETE_VIEW, FETCH_CATALOGUE } from "@ppb/tbd-store/actions/catalogue";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createFindViewByURNSelector: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-urn-codecs", () => ({
  codecs: {
    card: {
      raceBroadcasts: {
        isValid: jest.fn(),
      },
    },
    parse: jest.fn(() => "URN"),
  },
}));

const stateMock = {
  layouts: {
    cards: {
      broadcastsandstatistics: {
        "ppb:tbd:broadcastsandstatistics:1": {
          urn: "ppb:tbd:broadcastsandstatistics:1",
        },
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should create the selectors", () => {
    makeMapStateToProps();
    expect(createCardByURNSelector).toHaveBeenCalledTimes(1);
    expect(createCardByURNSelector).toHaveBeenCalledWith();
  });

  it("should return the mapStateToProps function", () => {
    const mapStateToProps = makeMapStateToProps();
    expect(mapStateToProps).toEqual(expect.any(Function));
  });

  describe("mapStateToProps", () => {
    it("should get the broadcast and statistics card by its URN", () => {
      const getBroadcastsAndStatisticsCard = jest.fn();
      createCardByURNSelector.mockReturnValue(getBroadcastsAndStatisticsCard);
      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(stateMock, { urn: "ppb:tbd:broadcastsandstatistics:1" });
      expect(getBroadcastsAndStatisticsCard).toHaveBeenCalledTimes(1);
      expect(getBroadcastsAndStatisticsCard).toHaveBeenCalledWith(
        {
          "ppb:tbd:broadcastsandstatistics:1": {
            urn: "ppb:tbd:broadcastsandstatistics:1",
          },
        },
        "ppb:tbd:broadcastsandstatistics:1",
      );
    });

    describe("when broadcasts and statistics card is undefined", () => {
      it("should return empty object", () => {
        createCardByURNSelector.mockReturnValue(() => undefined);

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:broadcastsandstatistics:1" });

        expect(props).toEqual({});
      });
    });

    describe("when broadcast and statistics card is defined", () => {
      it("should return props correctly", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: "ppb:tbd:broadcastsandstatistics:1",
          broadcasts: {
            liveVideoUrl: "liveVideoUrl",
            dataVizUrl: "dataVizUrl",
          },
          statisticsViewLink: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
          isCollapsed: true,
        }));

        createFindViewByURNSelector.mockReturnValue(() => ({
          title: "ViewTitle",
        }));

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:broadcastsandstatistics:1" });

        expect(props).toEqual({
          urn: "ppb:tbd:broadcastsandstatistics:1",
          liveVideoUrl: "liveVideoUrl",
          dataVizUrl: "dataVizUrl",
          statusTitle: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
          broadcastsIsCollapsedByDefault: true,
          statisticsViewLink: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
          statisticsButtonLabel: "I18N.STATISTICS",
          statisticsViewTitle: "ViewTitle",
        });
      });

      it("should return statusTitle correctly when only dataVizUrl available", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: "ppb:tbd:broadcastsandstatistics:1",
          broadcasts: {
            liveVideoUrl: undefined,
            dataVizUrl: "dataVizUrl",
          },
          statisticsViewLink: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
          isCollapsed: true,
        }));

        createFindViewByURNSelector.mockReturnValue(() => ({
          title: "ViewTitle",
        }));

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:broadcastsandstatistics:1" });

        expect(props).toEqual({
          urn: "ppb:tbd:broadcastsandstatistics:1",
          liveVideoUrl: null,
          dataVizUrl: "dataVizUrl",
          statusTitle: "I18N.LIVE_VIDEO_STATUS.MATCH_VIEW",
          broadcastsIsCollapsedByDefault: true,
          statisticsViewLink: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
          statisticsButtonLabel: "I18N.STATISTICS",
          statisticsViewTitle: "ViewTitle",
        });
      });

      it("should return statistics title undefined when view does not exist", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: "ppb:tbd:broadcastsandstatistics:1",
          broadcasts: {
            liveVideoUrl: "liveVideoUrl",
            dataVizUrl: "dataVizUrl",
          },
          statisticsViewLink: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
          isCollapsed: true,
        }));

        createFindViewByURNSelector.mockReturnValue(() => undefined);

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:broadcastsandstatistics:1" });

        expect(props).toEqual({
          urn: "ppb:tbd:broadcastsandstatistics:1",
          liveVideoUrl: "liveVideoUrl",
          dataVizUrl: "dataVizUrl",
          statusTitle: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
          broadcastsIsCollapsedByDefault: true,
          statisticsViewLink: {
            viewUrn: "viewUrn",
            viewUrl: "viewUrl",
          },
          statisticsButtonLabel: "I18N.STATISTICS",
          statisticsViewTitle: undefined,
        });
      });

      it("should return statistics title undefined when viewLink is undefined", () => {
        createCardByURNSelector.mockReturnValue(() => ({
          urn: "ppb:tbd:broadcastsandstatistics:1",
          broadcasts: {
            liveVideoUrl: "liveVideoUrl",
            dataVizUrl: "dataVizUrl",
          },
          isCollapsed: true,
        }));

        createFindViewByURNSelector.mockReturnValue(() => ({
          title: "ViewTitle",
        }));

        const mapStateToProps = makeMapStateToProps();

        const props = mapStateToProps(stateMock, { urn: "ppb:tbd:broadcastsandstatistics:1" });

        expect(props).toEqual({
          urn: "ppb:tbd:broadcastsandstatistics:1",
          liveVideoUrl: "liveVideoUrl",
          dataVizUrl: "dataVizUrl",
          statusTitle: "I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO",
          broadcastsIsCollapsedByDefault: true,
          statisticsViewLink: undefined,
          statisticsButtonLabel: "I18N.STATISTICS",
          statisticsViewTitle: undefined,
        });
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("dispatchBroadcastsCardToggle", () => {
      it("should dispatch broadcasts card toggle", () => {
        const { dispatchBroadcastsCardToggle } = mapDispatchToProps;
        const isExpanded = true;
        const cardUrn = "URN";

        expect(dispatchBroadcastsCardToggle(isExpanded, cardUrn)).toEqual({
          type: UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE,
          payload: { isExpanded, cardUrn },
        });
      });
    });

    describe("dispatchMediaPlayerLoaded", () => {
      it("should dispatch media player loaded event", () => {
        const { dispatchMediaPlayerLoaded } = mapDispatchToProps;
        const label = "label";
        const cardUrn = "URN";

        expect(dispatchMediaPlayerLoaded(label, cardUrn)).toEqual({
          type: UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED,
          payload: {
            label,
            cardUrn,
          },
        });
      });
    });

    describe("dispatchFetchCatalogue", () => {
      it("should dispatch fetch catalogue event", () => {
        const { dispatchFetchCatalogue } = mapDispatchToProps;

        expect(dispatchFetchCatalogue("urn")).toEqual({
          type: FETCH_CATALOGUE,
          payload: {
            urn: "urn",
          },
        });
      });
    });

    describe("dispatchToggleStatisticsView", () => {
      it("should dispatch toggle statistics view event", () => {
        const { dispatchToggleStatisticsView } = mapDispatchToProps;
        const label = "label";
        const cardUrn = "URN";
        const isOpen = true;

        expect(dispatchToggleStatisticsView(label, cardUrn, isOpen)).toEqual({
          type: UI__STATISTICS_MODAL_TOGGLE,
          payload: {
            label,
            cardUrn,
            isOpen,
          },
        });
      });
    });

    describe("dispatchDeleteView", () => {
      it("should dispatch delete view event", () => {
        const { dispatchDeleteView } = mapDispatchToProps;

        expect(dispatchDeleteView("urn")).toEqual({
          type: DELETE_VIEW,
          payload: "urn",
        });
      });
    });
  });
});
