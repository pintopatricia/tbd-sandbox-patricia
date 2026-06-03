import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";

import { LiveStream, SupportingContentButton } from "@ppb/the-wall-web";
import { AssetsIconName, SupportingContentIconName } from "@ppb/the-wall-icons";
import { ConfigContext } from "../Config/ConfigContext";
import { TimeformCard as TimeFormCardComponent } from "./snowflakes/TimeformCard/TimeformCard.web";
import TimeFormBroadCastsCard from "./TimeFormBroadCastsCard.web";

const dispatchUpdateTimeFormCollapsePreference = jest.fn();
const dispatchToggleTimeForm = jest.fn();
const dispatchTimeFormBroadCastsCardToggle = jest.fn();
const dispatchMediaPlayerLoaded = jest.fn();

jest.mock("@ppb/the-wall-web", () => ({
  LiveStream: jest.fn(() => <live-stream-mock />),
  SupportingContentButton: jest.fn((props) => <supporting-content-button-mock {...props} />),
}));

const ConfigContextProviderMock = ({ isDesktopLayout, children }) => (
  <ConfigContext.Provider value={{ isDesktopLayout }}>{children}</ConfigContext.Provider>
);

function renderTimeFormBroadCastsCard(timeFormBroadCastsCardProps) {
  return render(
    <ConfigContextProviderMock isDesktopLayout={timeFormBroadCastsCardProps.isDesktopLayout}>
      <TimeFormBroadCastsCard {...timeFormBroadCastsCardProps} />
    </ConfigContextProviderMock>,
  );
}

jest.mock("./snowflakes/TimeformCard/TimeformCard.web", () => ({
  TimeformCard: jest.fn(() => <timeform-card-mock />),
}));

describe("TimeformCard component", () => {
  let stateProps;

  beforeEach(() => {
    jest.clearAllMocks();

    stateProps = {
      raceUrn: "raceUrn",
      runnerRatings: [
        { name: "runner1", stars: 4 },
        { name: "runner2", stars: 3 },
      ],
      verdictLabel: "verdictLabel",
      verdict: "verdict",
      collapsed: false,
      dataVizUrl: "DATA_VIZ_URL",
      liveVideoUrl: "LIVE_VIDEO_URL",
      statusTitle: "Live Video Title",
      timeFormTitle: "Timeform Title",
      isDesktopLayout: false,
      dispatchUpdateTimeFormCollapsePreference,
      dispatchToggleTimeForm,
      dispatchTimeFormBroadCastsCardToggle,
      dispatchMediaPlayerLoaded,
    };
  });

  describe("when the runnerRatings and broadcasts are defined", () => {
    it("must render the TimeFormBroadCastsCard component with the correct props", () => {
      renderTimeFormBroadCastsCard(stateProps);

      expect(TimeFormCardComponent).toHaveBeenCalledWith(
        {
          runnerRatings: [
            { name: "runner1", stars: 4 },
            { name: "runner2", stars: 3 },
          ],
          verdictLabel: "verdictLabel",
          verdict: "verdict",
        },
        undefined,
      );
      expect(TimeFormCardComponent).toHaveBeenCalledTimes(1);
      expect(SupportingContentButton).toHaveBeenCalledTimes(2);
      expect(SupportingContentButton.mock.calls[0][0]).toEqual({
        icon: SupportingContentIconName.LIVE_VIDEO,
        isOpen: false,
        onPress: expect.any(Function),
        showExpandIcon: true,
        title: "Live Video Title",
        isHighlighted: true,
      });
      expect(SupportingContentButton.mock.calls[1][0]).toEqual({
        icon: AssetsIconName.TIMEFORM,
        isOpen: true,
        onPress: expect.any(Function),
        showExpandIcon: true,
        title: "Timeform Title",
        isHighlighted: true,
      });
    });
  });

  describe("when the live video option is selected", () => {
    describe("when has raceUrn", () => {
      describe("and is not on desktop", () => {
        it("must render the live video section", () => {
          renderTimeFormBroadCastsCard(stateProps);

          act(() => {
            SupportingContentButton.mock.calls[0][0].onPress("LIVE_VIDEO");
          });

          expect(LiveStream).toHaveBeenCalledWith(
            {
              aspectRatio: 0.73,
              dataVizUrl: "DATA_VIZ_URL",
              liveVideoUrl: "LIVE_VIDEO_URL",
              onBroadcastChangeCallback: expect.any(Function),
              isDesktop: false,
            },
            undefined,
          );
          expect(LiveStream).toHaveBeenCalledTimes(1);
          expect(dispatchTimeFormBroadCastsCardToggle).toHaveBeenCalledTimes(1);
        });
      });

      describe("and is on desktop", () => {
        it("must render the live video section with isDesktop as true", () => {
          renderTimeFormBroadCastsCard({ ...stateProps, isDesktopLayout: true });

          act(() => {
            SupportingContentButton.mock.calls[0][0].onPress("LIVE_VIDEO");
          });

          expect(LiveStream).toHaveBeenCalledWith(
            {
              aspectRatio: 0.73,
              dataVizUrl: "DATA_VIZ_URL",
              liveVideoUrl: "LIVE_VIDEO_URL",
              onBroadcastChangeCallback: expect.any(Function),
              isDesktop: true,
            },
            undefined,
          );
          expect(LiveStream).toHaveBeenCalledTimes(1);
          expect(dispatchTimeFormBroadCastsCardToggle).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("when does not have raceUrn", () => {
      it("should not call dispatchTimeFormBroadCastsCardToggle", () => {
        renderTimeFormBroadCastsCard({ ...stateProps, raceUrn: null });

        act(() => {
          SupportingContentButton.mock.calls[0][0].onPress("LIVE_VIDEO");
        });

        expect(dispatchTimeFormBroadCastsCardToggle).not.toHaveBeenCalled();
      });
    });

    describe("on broadcastChangeCallback", () => {
      describe("when lastSentBroadcast is the same as current broadcast and has raceUrn", () => {
        it("should not call dispatchMediaPlayerLoaded", () => {
          const dispatchMediaPlayerLoadedMock = jest.fn();
          renderTimeFormBroadCastsCard({ ...stateProps, dispatchMediaPlayerLoaded: dispatchMediaPlayerLoadedMock });

          act(() => {
            SupportingContentButton.mock.calls[0][0].onPress("LIVE_VIDEO");
          });

          LiveStream.mock.calls[0][0].onBroadcastChangeCallback("expanded");
          expect(dispatchMediaPlayerLoadedMock).toHaveBeenCalledTimes(1);
          expect(dispatchMediaPlayerLoadedMock).toHaveBeenCalledWith("expanded", "raceUrn");
        });
      });

      describe("when lastSentBroadcast is the same as current broadcast and does not have raceUrn", () => {
        it("should not call dispatchMediaPlayerLoaded", () => {
          const dispatchMediaPlayerLoadedMock = jest.fn();
          renderTimeFormBroadCastsCard({
            ...stateProps,
            raceUrn: null,
            dispatchMediaPlayerLoaded: dispatchMediaPlayerLoadedMock,
          });

          act(() => {
            SupportingContentButton.mock.calls[0][0].onPress("LIVE_VIDEO");
          });

          LiveStream.mock.calls[0][0].onBroadcastChangeCallback("expanded");
          expect(dispatchMediaPlayerLoadedMock).not.toHaveBeenCalled();
        });
      });
    });
  });

  describe("when the timeform option is selected", () => {
    describe("when has raceUrn", () => {
      it("must render the timeform section", () => {
        renderTimeFormBroadCastsCard(stateProps);

        act(() => {
          SupportingContentButton.mock.calls[1][0].onPress("TIMEFORM");
        });

        expect(TimeFormCardComponent).toHaveBeenCalledWith(
          {
            runnerRatings: [
              { name: "runner1", stars: 4 },
              { name: "runner2", stars: 3 },
            ],
            verdictLabel: "verdictLabel",
            verdict: "verdict",
          },
          undefined,
        );
        expect(TimeFormCardComponent).toHaveBeenCalledTimes(1);
        expect(dispatchUpdateTimeFormCollapsePreference).toHaveBeenCalledTimes(1);
        expect(dispatchToggleTimeForm).toHaveBeenCalledTimes(1);
      });
    });

    describe("when does not have raceUrn", () => {
      it("should not call dispatchToggleTimeForm", () => {
        renderTimeFormBroadCastsCard({ ...stateProps, raceUrn: null });
        act(() => {
          SupportingContentButton.mock.calls[1][0].onPress("TIMEFORM");
        });

        expect(dispatchToggleTimeForm).not.toHaveBeenCalled();
      });
    });
  });

  describe("when only the liveVideoUrl is defined", () => {
    describe("and is not on desktop version", () => {
      it("must render the live video section", () => {
        renderTimeFormBroadCastsCard({ ...stateProps, dataVizUrl: null, runnerRatings: [] });

        act(() => {
          SupportingContentButton.mock.calls[0][0].onPress("LIVEVIDEO");
        });

        expect(LiveStream).toHaveBeenCalledWith(
          {
            aspectRatio: 0.73,
            dataVizUrl: null,
            liveVideoUrl: "LIVE_VIDEO_URL",
            onBroadcastChangeCallback: expect.any(Function),
            isDesktop: false,
          },
          undefined,
        );
        expect(LiveStream).toHaveBeenCalledTimes(1);
        expect(dispatchTimeFormBroadCastsCardToggle).toHaveBeenCalledTimes(1);
      });
    });

    describe("and is on desktop version", () => {
      it("must render the live video section with isDesktop prop", () => {
        renderTimeFormBroadCastsCard({ ...stateProps, dataVizUrl: null, runnerRatings: [], isDesktopLayout: true });

        act(() => {
          SupportingContentButton.mock.calls[0][0].onPress("LIVEVIDEO");
        });

        expect(LiveStream).toHaveBeenCalledWith(
          {
            aspectRatio: 0.73,
            dataVizUrl: null,
            liveVideoUrl: "LIVE_VIDEO_URL",
            onBroadcastChangeCallback: expect.any(Function),
            isDesktop: true,
          },
          undefined,
        );
        expect(LiveStream).toHaveBeenCalledTimes(1);
        expect(dispatchTimeFormBroadCastsCardToggle).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when the timeform preference is disabled", () => {
    it("must render the TimeFormBroadCastsCard component without the sections", () => {
      renderTimeFormBroadCastsCard({ ...stateProps, collapsed: true });

      expect(TimeFormCardComponent).not.toHaveBeenCalled();
      expect(LiveStream).not.toHaveBeenCalled();
      expect(SupportingContentButton).toHaveBeenCalledTimes(2);
      expect(SupportingContentButton.mock.calls[0][0]).toEqual({
        icon: SupportingContentIconName.LIVE_VIDEO,
        isOpen: false,
        onPress: expect.any(Function),
        showExpandIcon: true,
        title: "Live Video Title",
        isHighlighted: true,
      });
      expect(SupportingContentButton.mock.calls[1][0]).toEqual({
        icon: AssetsIconName.TIMEFORM,
        isOpen: false,
        onPress: expect.any(Function),
        showExpandIcon: true,
        title: "Timeform Title",
        isHighlighted: true,
      });
    });
  });
});
