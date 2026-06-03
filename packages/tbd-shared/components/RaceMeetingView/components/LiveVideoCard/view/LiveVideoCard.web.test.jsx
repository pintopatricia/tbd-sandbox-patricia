import { act, fireEvent, render } from "@testing-library/react";
import { LiveStream, SupportingContentButton } from "@ppb/the-wall-web";
import { TimeformCard } from "../../../../TimeFormBroadCastsCard/snowflakes/TimeformCard/TimeformCard.web";
import { ConfigContext } from "../../../../Config/ConfigContext";
import LiveVideoCard from "./LiveVideoCard.web";

jest.mock("../../../../../helpers/i18n", () => ({
  i18n: ({ key }) => `t(${key})`,
}));

jest.mock("@ppb/the-wall-web", () => ({
  LiveStream: jest.fn(() => <live-stream-mock />),
  SupportingContentButton: jest.fn(({ title, onPress, isOpen }) => (
    <button data-testid={`scb-${title}`} data-open={isOpen} onClick={onPress}>
      {title}
    </button>
  )),
}));

jest.mock("../../../../TimeFormBroadCastsCard/snowflakes/TimeformCard/TimeformCard.web", () => ({
  TimeformCard: jest.fn(() => <timeform-card-mock />),
}));

const broadcasts = {
  liveVideoUrl: "https://example.com/live.m3u8",
  dataVizUrl: null,
};

const expertView = {
  runnerRatings: [{ runnerUrn: "ppb:runner:1", rating: "1" }],
  verdict: "Looks strong",
};

const renderComponent = ({ race = { broadcasts, expertView }, isHighlighted = false, isDesktopLayout = true } = {}) =>
  render(
    <ConfigContext.Provider value={{ isDesktopLayout }}>
      <LiveVideoCard race={race} isHighlighted={isHighlighted} />
    </ConfigContext.Provider>,
  );

describe("LiveVideoCard.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders both buttons when broadcasts and expertView are present", () => {
    renderComponent();
    expect(SupportingContentButton).toHaveBeenCalledWith(
      expect.objectContaining({ title: "t(I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO)" }),
      undefined,
    );
    expect(SupportingContentButton).toHaveBeenCalledWith(
      expect.objectContaining({ title: "t(I18N.RACE.TIMEFORM_TITLE)" }),
      undefined,
    );
  });

  it("uses MATCH_VIEW title when only dataVizUrl is present", () => {
    renderComponent({ race: { broadcasts: { liveVideoUrl: null, dataVizUrl: "data" }, expertView: null } });
    expect(SupportingContentButton).toHaveBeenCalledWith(
      expect.objectContaining({ title: "t(I18N.LIVE_VIDEO_STATUS.MATCH_VIEW)" }),
      undefined,
    );
  });

  it("renders nothing when there is no live video and no expert view", () => {
    const { container } = renderComponent({ race: { broadcasts: null, expertView: null } });
    expect(container.firstChild).toBeNull();
  });

  it("renders nothing when expertView has no runner ratings and no broadcasts", () => {
    const { container } = renderComponent({
      race: { broadcasts: null, expertView: { runnerRatings: [], verdict: null } },
    });
    expect(container.firstChild).toBeNull();
  });

  it("toggles open and renders LiveStream when the live video button is pressed", () => {
    const { getByTestId } = renderComponent();
    expect(LiveStream).not.toHaveBeenCalled();

    act(() => {
      fireEvent.click(getByTestId("scb-t(I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO)"));
    });

    expect(LiveStream).toHaveBeenCalledWith(
      expect.objectContaining({
        liveVideoUrl: broadcasts.liveVideoUrl,
        dataVizUrl: null,
        isDesktop: true,
      }),
      undefined,
    );
  });

  it("renders TimeformCard with verdict when the expert view button is pressed", () => {
    const { getByTestId } = renderComponent();

    act(() => {
      fireEvent.click(getByTestId("scb-t(I18N.RACE.TIMEFORM_TITLE)"));
    });

    expect(TimeformCard).toHaveBeenCalledWith(
      expect.objectContaining({
        runnerRatings: expertView.runnerRatings,
        verdict: expertView.verdict,
        verdictLabel: "t(I18N.RACE.TIMEFORM_VIEW)",
      }),
      undefined,
    );
  });

  it("omits verdictLabel when expertView.verdict is null", () => {
    const { getByTestId } = renderComponent({
      race: {
        broadcasts: null,
        expertView: { runnerRatings: [{ runnerUrn: "ppb:runner:1", rating: "1" }], verdict: null },
      },
    });
    act(() => {
      fireEvent.click(getByTestId("scb-t(I18N.RACE.TIMEFORM_TITLE)"));
    });
    expect(TimeformCard).toHaveBeenCalledWith(
      expect.objectContaining({ verdictLabel: undefined, verdict: undefined }),
      undefined,
    );
  });

  it("collapses the open section when the same button is pressed again", () => {
    const { getByTestId } = renderComponent();
    act(() => fireEvent.click(getByTestId("scb-t(I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO)")));
    expect(LiveStream).toHaveBeenCalled();

    act(() => fireEvent.click(getByTestId("scb-t(I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO)")));

    // Button is now closed, content is unmounted
    expect(getByTestId("scb-t(I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO)").getAttribute("data-open")).toBe("false");
  });

  it("only one section is open at a time when switching between buttons", () => {
    const { getByTestId } = renderComponent();

    act(() => fireEvent.click(getByTestId("scb-t(I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO)")));
    act(() => fireEvent.click(getByTestId("scb-t(I18N.RACE.TIMEFORM_TITLE)")));

    expect(getByTestId("scb-t(I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO)").getAttribute("data-open")).toBe("false");
    expect(getByTestId("scb-t(I18N.RACE.TIMEFORM_TITLE)").getAttribute("data-open")).toBe("true");
  });

  it("forwards isHighlighted to the buttons", () => {
    renderComponent({ isHighlighted: true });
    expect(SupportingContentButton).toHaveBeenCalledWith(expect.objectContaining({ isHighlighted: true }), undefined);
  });
});
