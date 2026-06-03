import { render } from "@testing-library/react-native";
import { Runner } from "@ppb/the-wall-native";
import RunnerListHeader from "../RunnerListHeader/RunnerListHeader.native";
import GridCardRunner from "./GridCardRunner.native";
import FootballRunner from "../../FootballRunner/FootballRunner.native";

jest.mock("../RunnerListHeader/RunnerListHeader.native", () => jest.fn(() => <runner-list-header-mock />));
jest.mock("@ppb/the-wall-native", () => ({ Runner: jest.fn(() => <runner-mock />) }));
jest.mock("../GridCardItem/GridCardItem.native", () => jest.fn(() => <connected-grid-card-item />));
jest.mock("../GridCardItem", () => jest.fn(() => <grid-card-item-mock />));
jest.mock("../../FootballRunner/FootballRunner.native", () => jest.fn(() => <football-runner-mock />));

function renderGridCardRunner(props) {
  return render(<GridCardRunner {...props} />);
}

const DEFAULT_PROPS = {
  lineIndex: 0,
  lineLabel: "label",
  items: [{ label: "1", selectionId: 123456789, marketUrn: "1.123456789" }],
  linesSize: 1,
  urn: "some urn",
};

describe("GridCardRunner", () => {
  beforeEach(jest.clearAllMocks);

  it("should no call RunnerListHeader when lineIndex is not zero", () => {
    renderGridCardRunner({
      ...DEFAULT_PROPS,
      lineIndex: 1,
      azSwitcherProps: {
        text: "az",
        checkboxId: "string",
        checkboxName: "string",
        isChecked: false,
        isLeftPosition: false,
        callback: () => {},
      },
    });

    expect(RunnerListHeader).toHaveBeenCalledTimes(0);
  });

  it("should call RunnerListHeader component with proper props", () => {
    renderGridCardRunner({
      ...DEFAULT_PROPS,
      azSwitcherProps: {
        text: "az",
        checkboxId: "string",
        checkboxName: "string",
        isChecked: false,
        isLeftPosition: false,
      },
    });

    expect(RunnerListHeader).toHaveBeenCalledTimes(1);
    expect(RunnerListHeader).toHaveBeenCalledWith(
      {
        azSwitcherProps: {
          checkboxId: "string",
          checkboxName: "string",
          isChecked: false,
          isLeftPosition: false,
          text: "az",
        },
        items: [{ label: "1", marketUrn: "1.123456789", selectionId: 123456789 }],
      },
      undefined,
    );
  });

  describe("hasJerseys and hasStats", () => {
    it("should render Runner when hasJerseys and hasStats is false", () => {
      renderGridCardRunner({ ...DEFAULT_PROPS, hasJerseys: false, hasStats: false });

      expect(Runner).toHaveBeenCalledTimes(1);
      expect(Runner).toHaveBeenCalledWith(expect.objectContaining({ name: "label" }), undefined);
      expect(FootballRunner).not.toHaveBeenCalled();
    });

    it("should render FootballRunner instead of Runner when hasJerseys is true", () => {
      renderGridCardRunner({ ...DEFAULT_PROPS, hasJerseys: true, jersey: "home" });

      expect(FootballRunner).toHaveBeenCalledTimes(1);
      expect(FootballRunner).toHaveBeenCalledWith(
        expect.objectContaining({ runnerName: "label", jersey: "home" }),
        undefined,
      );
      expect(Runner).not.toHaveBeenCalled();
    });

    it("should render FootballRunner instead of Runner when hasStats is true", () => {
      renderGridCardRunner({ ...DEFAULT_PROPS, hasStats: true });

      expect(FootballRunner).toHaveBeenCalledTimes(1);
      expect(FootballRunner).toHaveBeenCalledWith(expect.objectContaining({ runnerName: "label" }), undefined);
      expect(Runner).not.toHaveBeenCalled();
    });

    it("should render FootballRunner instead of Runner when both hasJerseys and hasStats are true", () => {
      renderGridCardRunner({ ...DEFAULT_PROPS, hasStats: true, hasJerseys: true, jersey: "home" });

      expect(FootballRunner).toHaveBeenCalledTimes(1);
      expect(FootballRunner).toHaveBeenCalledWith(
        expect.objectContaining({ runnerName: "label", jersey: "home" }),
        undefined,
      );
      expect(Runner).not.toHaveBeenCalled();
    });
  });

  describe("jersey", () => {
    it("should pass jersey prop to FootballRunner when hasJerseys is true", () => {
      renderGridCardRunner({ ...DEFAULT_PROPS, hasJerseys: true, jersey: "away" });

      expect(FootballRunner).toHaveBeenCalledWith(expect.objectContaining({ jersey: "away" }), undefined);
    });

    it("should pass undefined jersey to FootballRunner when jersey is not provided", () => {
      renderGridCardRunner({ ...DEFAULT_PROPS, hasJerseys: true });

      expect(FootballRunner).toHaveBeenCalledWith(expect.objectContaining({ jersey: undefined }), undefined);
    });
  });

  describe("statValue", () => {
    it("should pass statValue to FootballRunner when hasStats is true", () => {
      renderGridCardRunner({ ...DEFAULT_PROPS, hasStats: true, statValue: "2.5" });

      expect(FootballRunner).toHaveBeenCalledWith(expect.objectContaining({ statValue: "2.5" }), undefined);
    });

    it("should pass undefined statValue to FootballRunner when statValue is not provided", () => {
      renderGridCardRunner({ ...DEFAULT_PROPS, hasStats: true });

      expect(FootballRunner).toHaveBeenCalledWith(expect.objectContaining({ statValue: undefined }), undefined);
    });
  });

  describe("statLabel", () => {
    it("should pass statLabel to FootballRunner when hasStats is true", () => {
      renderGridCardRunner({ ...DEFAULT_PROPS, hasStats: true, statLabel: "I18N.IN_LINE_STATS_TOTAL_CARDS" });

      expect(FootballRunner).toHaveBeenCalledWith(
        expect.objectContaining({ statLabel: "I18N.IN_LINE_STATS_TOTAL_CARDS" }),
        undefined,
      );
    });

    it("should pass undefined statLabel to FootballRunner when statLabel is not provided", () => {
      renderGridCardRunner({ ...DEFAULT_PROPS, hasStats: true });

      expect(FootballRunner).toHaveBeenCalledWith(expect.objectContaining({ statLabel: undefined }), undefined);
    });
  });

  describe("statValueInterpolation", () => {
    it("should pass statValueInterpolation to FootballRunner when hasStats is true", () => {
      renderGridCardRunner({
        ...DEFAULT_PROPS,
        hasStats: true,
        statValue: "I18N.IN_LINE_STATS_X_CARDS_IN_Y_MATCHES",
        statValueInterpolation: { cards: 34, matches: 20 },
      });

      expect(FootballRunner).toHaveBeenCalledWith(
        expect.objectContaining({ statValueInterpolation: { cards: 34, matches: 20 } }),
        undefined,
      );
    });

    it("should pass undefined statValueInterpolation to FootballRunner when not provided", () => {
      renderGridCardRunner({ ...DEFAULT_PROPS, hasStats: true });

      expect(FootballRunner).toHaveBeenCalledWith(
        expect.objectContaining({ statValueInterpolation: undefined }),
        undefined,
      );
    });
  });
});
