import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { FullScreenModal, LiveStream, SupportingContentButton } from "@ppb/the-wall-web";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { ConfigContext } from "../Config/ConfigContext";
import { TEST_ID, LIVE_VIDEO_SECTION } from "./BroadcastsAndStatisticsCard.web.selectors";
import BroadcastsAndStatisticsCard from "./BroadcastsAndStatisticsCard.web";
import styles from "./BroadcastsAndStatisticsCard.web.css";

jest.mock("@ppb/the-wall-web", () => ({
  LiveStream: jest.fn(() => <livestream-mock />),
  FullScreenModal: jest.fn(() => <full-screen-modal data-testid="full-screen-modal" />),
  SupportingContentButton: jest.fn((props) => <supporting-content-button-mock {...props} />),
}));

const ConfigContextProviderMock = ({ isDesktopLayout, children }) => (
  <ConfigContext.Provider value={{ isDesktopLayout }}>{children}</ConfigContext.Provider>
);

const renderBroadcastsAndStatisticsCard = (props) =>
  render(
    <ConfigContextProviderMock isDesktopLayout={props.isDesktopLayout}>
      <BroadcastsAndStatisticsCard {...props} />
    </ConfigContextProviderMock>,
  );

describe("BroadcastsAndStatisticsCard", () => {
  beforeEach(jest.clearAllMocks);

  const dispatchBroadcastsCardToggle = jest.fn();
  const dispatchMediaPlayerLoaded = jest.fn();
  const dispatchFetchCatalogue = jest.fn();
  const dispatchToggleStatisticsView = jest.fn();
  const dispatchDeleteView = jest.fn();
  const SETUP_VALUES = {
    urn: "URN",
    dataVizUrl: "DATA_VIZ_URL",
    liveVideoUrl: "LIVE_VIDEO_URL",
    statusTitle: "STATUS_TITLE",
    broadcastsIsCollapsedByDefault: false,
    statisticsButtonLabel: "STATISTICS_BUTTON",
    statisticsViewLink: {
      viewUrn: "VIEW_URN",
      viewUrl: "VIEW_URL",
    },
    isDesktopLayout: false,
    dispatchBroadcastsCardToggle,
    dispatchMediaPlayerLoaded,
    dispatchFetchCatalogue,
    dispatchToggleStatisticsView,
    dispatchDeleteView,
  };

  it("should draw the broadcasts and statistics card container", () => {
    const { container } = renderBroadcastsAndStatisticsCard(SETUP_VALUES);
    const cardContainer = container.querySelector(TEST_ID);

    expect(cardContainer).not.toBe(null);
  });

  it("should draw the livestream container with the correct styling", () => {
    const { container } = renderBroadcastsAndStatisticsCard(SETUP_VALUES);
    const liveStreamContainer = container.querySelector(LIVE_VIDEO_SECTION);

    expect(liveStreamContainer.className).toContain(styles.liveStreamContainer);
  });

  describe("when is displayed on mobile web", () => {
    it("should call the livestream component with the correct parameters", () => {
      renderBroadcastsAndStatisticsCard(SETUP_VALUES);

      expect(LiveStream).toHaveBeenCalledWith(
        {
          liveVideoUrl: SETUP_VALUES.liveVideoUrl,
          dataVizUrl: SETUP_VALUES.dataVizUrl,
          onBroadcastChangeCallback: expect.any(Function),
          isDesktop: false,
        },
        undefined,
      );
    });
  });

  describe("when is displayed on desktop", () => {
    it("should call the livestream component with the correct parameters", () => {
      renderBroadcastsAndStatisticsCard({ ...SETUP_VALUES, isDesktopLayout: true });

      expect(LiveStream).toHaveBeenCalledWith(
        {
          liveVideoUrl: SETUP_VALUES.liveVideoUrl,
          dataVizUrl: SETUP_VALUES.dataVizUrl,
          onBroadcastChangeCallback: expect.any(Function),
          isDesktop: true,
        },
        undefined,
      );
    });
  });

  describe("broadcast container", () => {
    beforeEach(() => renderBroadcastsAndStatisticsCard(SETUP_VALUES));

    it("should draw the SupportingContentButton component with the correct props", () => {
      expect(SupportingContentButton).toHaveBeenCalledTimes(2);
      expect(SupportingContentButton.mock.calls[0][0]).toEqual({
        icon: SupportingContentIconName.LIVE_VIDEO,
        isOpen: true,
        onPress: expect.any(Function),
        showExpandIcon: true,
        title: "STATUS_TITLE",
        isHighlighted: true,
      });
      expect(SupportingContentButton.mock.calls[1][0]).toEqual({
        icon: SupportingContentIconName.TEAM_FORM,
        onPress: expect.any(Function),
        title: "STATISTICS_BUTTON",
        isHighlighted: true,
      });
    });

    describe("when dataVizUrl and liveVideoUrl is not defined", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        renderBroadcastsAndStatisticsCard({ ...SETUP_VALUES, liveVideoUrl: undefined, dataVizUrl: undefined });
      });

      it("live video component should not be rendered", () => {
        expect(SupportingContentButton).toHaveBeenCalledTimes(1);
        expect(SupportingContentButton.mock.calls[0][0]).toEqual({
          icon: SupportingContentIconName.TEAM_FORM,
          onPress: expect.any(Function),
          title: "STATISTICS_BUTTON",
          isHighlighted: true,
        });
      });
    });
  });

  describe("Statistics View Container", () => {
    describe("when statistics view link is defined", () => {
      beforeEach(() => renderBroadcastsAndStatisticsCard(SETUP_VALUES));

      describe("when the statistics view is open", () => {
        beforeEach(async () => {
          act(() => {
            SupportingContentButton.mock.calls[1][0].onPress();
          });
        });

        it("should call dispatchFetchCatalogue", async () => {
          expect(dispatchFetchCatalogue).toHaveBeenCalledWith("VIEW_URN");
        });

        it("should call dispatchToggleStatisticsView", async () => {
          expect(dispatchToggleStatisticsView).toHaveBeenCalledWith("STATISTICS_BUTTON", "URN", true);
        });

        describe("when the statistics view is dismissed", () => {
          beforeEach(async () => {
            act(() => {
              FullScreenModal.mock.calls[0][0].onDismiss();
            });
          });

          it("should dispatch an action to clean the view", async () => {
            expect(dispatchDeleteView).toHaveBeenCalledWith("VIEW_URN");
          });

          it("should call dispatchToggleStatisticsView", async () => {
            expect(dispatchToggleStatisticsView).toHaveBeenCalledWith("STATISTICS_BUTTON", "URN", false);
          });
        });
      });
    });

    describe("when statistics view link is not defined", () => {
      beforeEach(() => {
        renderBroadcastsAndStatisticsCard({ ...SETUP_VALUES, statisticsViewLink: undefined });
      });

      it("statistics component should not be rendered", () => {
        expect(SupportingContentButton).toHaveBeenCalledTimes(1);
        expect(SupportingContentButton.mock.calls[0][0]).toEqual({
          icon: SupportingContentIconName.LIVE_VIDEO,
          isOpen: true,
          onPress: expect.any(Function),
          showExpandIcon: true,
          title: "STATUS_TITLE",
          isHighlighted: true,
        });
      });
    });

    describe("dispatchBroadcastsCardToggle", () => {
      let dispatchToggleByTestId;

      beforeEach(() => {
        const { container } = renderBroadcastsAndStatisticsCard(SETUP_VALUES);
        dispatchToggleByTestId = container;

        act(() => {
          SupportingContentButton.mock.calls[0][0].onPress();
        });
      });

      it("should call dispatchBroadcastsCardToggle with the correct parameters when Collapse onToggle is triggered", () => {
        expect(dispatchBroadcastsCardToggle).toHaveBeenCalled();
      });

      it("live stream component should not be rendered", () => {
        const liveStreamContainer = dispatchToggleByTestId.querySelector(LIVE_VIDEO_SECTION);
        expect(liveStreamContainer).toBe(null);
      });
    });

    describe("dispatchMediaPlayerLoaded", () => {
      const CURRENT_BROADCAST = "CURRENT_BROADCAST";

      beforeEach(() => {
        renderBroadcastsAndStatisticsCard(SETUP_VALUES);

        act(() => {
          LiveStream.mock.calls[0][0].onBroadcastChangeCallback(CURRENT_BROADCAST);
        });
      });

      it("should call dispatchMediaPlayerLoaded with the correct parameters when LiveStream onBroadcastChangeCallback is triggered", () => {
        expect(dispatchMediaPlayerLoaded).toHaveBeenCalledWith(CURRENT_BROADCAST, SETUP_VALUES.urn);
      });

      it("should not call dispatchMediaPlayerLoaded if it is triggered again with the same currentBroadcast", () => {
        act(() => {
          LiveStream.mock.calls[0][0].onBroadcastChangeCallback(CURRENT_BROADCAST);
        });

        expect(dispatchMediaPlayerLoaded).toHaveBeenCalledTimes(1);
      });
    });

    describe("when default collapsed is true", () => {
      const { container } = renderBroadcastsAndStatisticsCard({
        ...SETUP_VALUES,
        broadcastsIsCollapsedByDefault: true,
      });
      const liveStreamContainer = container.querySelector(LIVE_VIDEO_SECTION);

      it("should not render the live stream component", () => {
        expect(liveStreamContainer).toBe(null);
      });
    });
  });
});
