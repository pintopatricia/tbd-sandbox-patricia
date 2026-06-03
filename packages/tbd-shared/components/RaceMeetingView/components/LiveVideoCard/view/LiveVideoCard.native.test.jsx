import { act, fireEvent, render } from "@testing-library/react-native";
import { LiveStream, SupportingContentButton } from "@ppb/the-wall-native";
import { TimeformCard } from "../../../../TimeFormBroadCastsCard/snowflakes/TimeformCard/TimeformCard.native";
import LiveVideoCard from "./LiveVideoCard.native";

jest.mock("../../../../../helpers/i18n", () => ({
  i18n: ({ key }) => `t(${key})`,
}));

jest.mock("@ppb/the-wall-native", () => ({
  LiveStream: jest.fn(() => <live-stream-mock />),
  SupportingContentButton: jest.fn(({ title, onPress, isOpen }) => (
    <pressable testID={`scb-${title}`} onPress={onPress} accessibilityState={{ expanded: isOpen }}>
      <text-mock>{title}</text-mock>
    </pressable>
  )),
}));

jest.mock("../../../../TimeFormBroadCastsCard/snowflakes/TimeformCard/TimeformCard.native", () => ({
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

const renderComponent = ({ race = { broadcasts, expertView }, isHighlighted = false } = {}) =>
  render(<LiveVideoCard race={race} isHighlighted={isHighlighted} />);

describe("LiveVideoCard.native", () => {
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
    const { toJSON } = renderComponent({ race: { broadcasts: null, expertView: null } });
    expect(toJSON()).toBeNull();
  });

  it("toggles open and renders LiveStream when the live video button is pressed", () => {
    const { getByTestId } = renderComponent();
    expect(LiveStream).not.toHaveBeenCalled();

    act(() => {
      fireEvent.press(getByTestId("scb-t(I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO)"));
    });

    expect(LiveStream).toHaveBeenCalledWith(
      expect.objectContaining({
        liveVideoUrl: broadcasts.liveVideoUrl,
        dataVizUrl: null,
      }),
      undefined,
    );
  });

  it("renders TimeformCard with verdict when the expert view button is pressed", () => {
    const { getByTestId } = renderComponent();

    act(() => {
      fireEvent.press(getByTestId("scb-t(I18N.RACE.TIMEFORM_TITLE)"));
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

  it("collapses the open section when the same button is pressed again", () => {
    const { getByTestId } = renderComponent();
    act(() => fireEvent.press(getByTestId("scb-t(I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO)")));
    expect(LiveStream).toHaveBeenCalled();

    LiveStream.mockClear();
    act(() => fireEvent.press(getByTestId("scb-t(I18N.LIVE_VIDEO_STATUS.LIVE_VIDEO)")));

    // After collapse, LiveStream is no longer rendered (re-render does not call mock again).
    expect(LiveStream).not.toHaveBeenCalled();
  });

  it("forwards isHighlighted to the buttons", () => {
    renderComponent({ isHighlighted: true });
    expect(SupportingContentButton).toHaveBeenCalledWith(expect.objectContaining({ isHighlighted: true }), undefined);
  });
});
