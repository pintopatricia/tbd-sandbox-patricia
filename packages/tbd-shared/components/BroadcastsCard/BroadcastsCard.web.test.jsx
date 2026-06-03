import "jest-dom/extend-expect";
import { render, act } from "@testing-library/react";
import { SupportingContentButton, LiveStream } from "@ppb/the-wall-web";
import { SupportingContentIconName } from "@ppb/the-wall-icons";
import { ConfigContext } from "../Config/ConfigContext";
import BroadcastsCard from "./BroadcastsCard.web";

jest.mock("@ppb/the-wall-web", () => ({
  SupportingContentButton: jest.fn((props) => <supporting-content-button-mock {...props} />),
  LiveStream: jest.fn(() => <livestream-mock />),
}));

const ConfigContextProviderMock = ({ isDesktopLayout, children }) => (
  <ConfigContext.Provider value={{ isDesktopLayout }}>{children}</ConfigContext.Provider>
);

const dispatchBroadcastsCardToggleMock = jest.fn();
const dispatchMediaPlayerLoadedMock = jest.fn();

const BroadcastsCardProps = {
  dataVizUrl: "dataVizUrl",
  liveVideoUrl: "liveVideoUrl",
  statusTitle: "Status",
  isCollapsed: true,
  aspectRatio: 0.73,
  urn: "CARD_URN",
  isDesktopLayout: false,
  dispatchBroadcastsCardToggle: dispatchBroadcastsCardToggleMock,
  dispatchMediaPlayerLoaded: dispatchMediaPlayerLoadedMock,
};

function renderComponent(props) {
  return render(
    <ConfigContextProviderMock isDesktopLayout={props.isDesktopLayout}>
      <BroadcastsCard {...props} />
    </ConfigContextProviderMock>,
  );
}

describe("BroadcastsCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the SupportingContentButton with the correct parameters", () => {
    renderComponent({ ...BroadcastsCardProps });

    expect(SupportingContentButton).toHaveBeenCalledWith(
      expect.objectContaining({
        icon: SupportingContentIconName.LIVE_VIDEO,
        title: "Status",
        showExpandIcon: true,
        isOpen: false,
        onPress: expect.any(Function),
      }),
      undefined,
    );
  });

  describe("when press SupportingContentButton", () => {
    it("should call dispatchBroadcastsCardToggle with the correct parameters", () => {
      renderComponent({ ...BroadcastsCardProps });

      act(() => {
        SupportingContentButton.mock.calls[0][0].onPress(true);
      });

      expect(dispatchBroadcastsCardToggleMock).toHaveBeenCalledWith(true, "CARD_URN");
    });
  });

  describe("onBroadcastChangeCallback", () => {
    describe("for data viz", () => {
      it("should call dispatchMediaPlayerLoaded with the correct parameters", () => {
        renderComponent({ ...BroadcastsCardProps, isCollapsed: false });

        act(() => {
          LiveStream.mock.calls[0][0].onBroadcastChangeCallback("data viz");
        });

        expect(dispatchMediaPlayerLoadedMock).toHaveBeenCalledWith("data viz", "CARD_URN");
      });
    });

    describe("for live video", () => {
      it("should call dispatchMediaPlayerLoaded with the correct parameters", () => {
        renderComponent({ ...BroadcastsCardProps, isCollapsed: false });

        act(() => {
          LiveStream.mock.calls[0][0].onBroadcastChangeCallback("live video");
        });

        expect(dispatchMediaPlayerLoadedMock).toHaveBeenCalledWith("live video", "CARD_URN");
      });
    });

    describe("displayed on mobile web", () => {
      it("should call the livestream component with the correct parameters", () => {
        renderComponent({ ...BroadcastsCardProps, isCollapsed: false });

        act(() => {
          LiveStream.mock.calls[0][0].onBroadcastChangeCallback("data viz");
        });

        expect(LiveStream).toHaveBeenCalledWith(
          {
            aspectRatio: BroadcastsCardProps.aspectRatio,
            liveVideoUrl: BroadcastsCardProps.liveVideoUrl,
            dataVizUrl: BroadcastsCardProps.dataVizUrl,
            onBroadcastChangeCallback: expect.any(Function),
            isDesktop: false,
          },
          undefined,
        );
      });
    });

    describe("displayed on desktop", () => {
      it("should call the livestream component with the correct parameters", () => {
        renderComponent({ ...BroadcastsCardProps, isCollapsed: false, isDesktopLayout: true });

        act(() => {
          LiveStream.mock.calls[0][0].onBroadcastChangeCallback("data viz");
        });

        expect(LiveStream).toHaveBeenCalledWith(
          {
            aspectRatio: BroadcastsCardProps.aspectRatio,
            liveVideoUrl: BroadcastsCardProps.liveVideoUrl,
            dataVizUrl: BroadcastsCardProps.dataVizUrl,
            onBroadcastChangeCallback: expect.any(Function),
            isDesktop: true,
          },
          undefined,
        );
      });
    });

    describe("when calling with the same broadcasts multiple times", () => {
      it("should just send the event one time", () => {
        renderComponent({ ...BroadcastsCardProps, isCollapsed: false });

        act(() => {
          LiveStream.mock.calls[0][0].onBroadcastChangeCallback("live video");
          LiveStream.mock.calls[0][0].onBroadcastChangeCallback("live video");
        });

        expect(dispatchMediaPlayerLoadedMock).toHaveBeenCalledWith("live video", "CARD_URN");
        expect(dispatchMediaPlayerLoadedMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
