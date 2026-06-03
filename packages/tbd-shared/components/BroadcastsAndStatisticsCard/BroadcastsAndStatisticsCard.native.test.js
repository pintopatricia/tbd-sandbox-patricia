import { render, act } from "@testing-library/react-native";
import { LiveStream, SupportingContentButton } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router/native";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { BROADCASTS_AND_STATISTICS, LIVE_VIDEO_SECTION } from "./BroadcastsAndStatisticsCard.native.selectors";
import BroadcastsAndStatisticsCard from "./BroadcastsAndStatisticsCard.native";
import styles from "./BroadcastsAndStatisticsCard.native.styles";

jest.mock("@ppb/the-wall-native", () => ({
  LiveStream: jest.fn(() => <live-stream-mock />),
  SupportingContentButton: jest.fn((props) => <supporting-content-button-mock {...props} />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));

const renderBroadcastsAndStatisticsCard = (props) => render(<BroadcastsAndStatisticsCard {...props} />);

describe("BroadcastsAndStatisticsCard", () => {
  beforeEach(jest.clearAllMocks);

  const dispatchBroadcastsCardToggle = jest.fn();
  const dispatchMediaPlayerLoaded = jest.fn();
  const dispatchToggleStatisticsView = jest.fn();
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
    dispatchBroadcastsCardToggle,
    dispatchMediaPlayerLoaded,
    dispatchToggleStatisticsView,
  };

  it("should draw the broadcasts and statistics card container", () => {
    const { queryByTestId } = renderBroadcastsAndStatisticsCard(SETUP_VALUES);
    const cardContainer = queryByTestId(BROADCASTS_AND_STATISTICS);

    expect(cardContainer).not.toBe(null);
  });

  it("should draw the livestream container with the correct styling", () => {
    const { queryByTestId } = renderBroadcastsAndStatisticsCard(SETUP_VALUES);
    const liveStreamContainer = queryByTestId(LIVE_VIDEO_SECTION);

    expect(liveStreamContainer).toHaveStyle(styles.liveStreamContainer);
  });

  it("should call the livestream component with the correct parameters", () => {
    renderBroadcastsAndStatisticsCard(SETUP_VALUES);

    expect(LiveStream).toHaveBeenCalledWith(
      {
        liveVideoUrl: SETUP_VALUES.liveVideoUrl,
        dataVizUrl: SETUP_VALUES.dataVizUrl,
        onBroadcastChangeCallback: expect.any(Function),
      },
      undefined,
    );
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

        it("should call dispatchToggleStatisticsView", () => {
          expect(dispatchToggleStatisticsView).toHaveBeenCalledWith("STATISTICS_BUTTON", "URN", true);
        });
        it("should call navigate", () => {
          expect(navigate).toHaveBeenCalledWith({ viewUrn: "VIEW_URN" });
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
        const { queryByTestId } = renderBroadcastsAndStatisticsCard(SETUP_VALUES);
        dispatchToggleByTestId = queryByTestId;

        act(() => {
          SupportingContentButton.mock.calls[0][0].onPress();
        });
      });

      it("should call dispatchBroadcastsCardToggle with the correct parameters when Collapse onToggle is triggered", () => {
        expect(dispatchBroadcastsCardToggle).toHaveBeenCalled();
      });

      it("live stream component should not be rendered", () => {
        const liveStreamContainer = dispatchToggleByTestId(LIVE_VIDEO_SECTION);
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
      const { queryByTestId } = renderBroadcastsAndStatisticsCard({
        ...SETUP_VALUES,
        broadcastsIsCollapsedByDefault: true,
      });
      const liveStreamContainer = queryByTestId(LIVE_VIDEO_SECTION);

      it("should not render the live stream component", () => {
        expect(liveStreamContainer).toBe(null);
      });
    });
  });
});
