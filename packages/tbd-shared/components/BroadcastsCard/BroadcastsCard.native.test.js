import { render, act } from "@testing-library/react-native";
import { SupportingContentButton, LiveStream } from "@ppb/the-wall-native";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { BROADCASTS_CARD } from "./BroadcastsCard.native.selectors";
import BroadcastsCard from "./BroadcastsCard.native";

jest.mock("@ppb/the-wall-native", () => ({
  SupportingContentButton: jest.fn((props) => <supporting-content-button-mock {...props} />),
  LiveStream: jest.fn(() => <live-stream-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
}));

const renderBroadcastsCard = (props) => render(<BroadcastsCard {...props} />);

const dispatchBroadcastsCardToggleMock = jest.fn();
const dispatchMediaPlayerLoadedMock = jest.fn();

describe("BroadcastsCard", () => {
  const SETUP_VALUES = {
    dataVizUrl: "DATA_VIZ_URL",
    liveVideoUrl: "LIVE_VIDEO_URL",
    statusTitle: "STATUS_TITLE",
    isCollapsed: true,
    aspectRatio: "ASPECT_RATIO",
    urn: "URN",
    dispatchBroadcastsCardToggle: dispatchBroadcastsCardToggleMock,
    dispatchMediaPlayerLoaded: dispatchMediaPlayerLoadedMock,
  };

  afterEach(jest.clearAllMocks);

  it("should draw the broadcasts card container", () => {
    const { queryByTestId } = renderBroadcastsCard(SETUP_VALUES);
    const cardContainer = queryByTestId(BROADCASTS_CARD);

    expect(cardContainer).not.toBe(null);
  });

  it("should render the SupportingContentButton with the correct parameters", () => {
    renderBroadcastsCard(SETUP_VALUES);

    expect(SupportingContentButton).toHaveBeenCalledWith(
      {
        icon: SupportingContentIconName.LIVE_VIDEO,
        title: "STATUS_TITLE",
        showExpandIcon: true,
        isOpen: false,
        onPress: expect.any(Function),
      },
      undefined,
    );
  });

  describe("when press SupportingContentButton", () => {
    it("should call dispatchBroadcastsCardToggle with the correct parameters", () => {
      const IS_EXPANDED = "IS_EXPANDED";

      renderBroadcastsCard(SETUP_VALUES);

      act(() => {
        SupportingContentButton.mock.calls[0][0].onPress(IS_EXPANDED);
      });

      expect(dispatchBroadcastsCardToggleMock).toHaveBeenCalledWith(IS_EXPANDED, SETUP_VALUES.urn);
    });
  });

  describe("dispatchMediaPlayerLoaded", () => {
    const CURRENT_BROADCAST = "CURRENT_BROADCAST";

    beforeEach(() => {
      renderBroadcastsCard({ ...SETUP_VALUES, isCollapsed: false });

      act(() => {
        LiveStream.mock.calls[0][0].onBroadcastChangeCallback(CURRENT_BROADCAST);
      });
    });

    it("should call dispatchMediaPlayerLoaded with the correct parameters when LiveStream onBroadcastChangeCallback is triggered", () => {
      expect(dispatchMediaPlayerLoadedMock).toHaveBeenCalledWith(CURRENT_BROADCAST, SETUP_VALUES.urn);
    });

    it("should not call dispatchMediaPlayerLoaded if it is triggered again with the same currentBroadcast", () => {
      act(() => {
        LiveStream.mock.calls[0][0].onBroadcastChangeCallback(CURRENT_BROADCAST);
      });

      expect(dispatchMediaPlayerLoadedMock).toHaveBeenCalledTimes(1);
    });
  });
});
