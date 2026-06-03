import { fireEvent, getByAltText, getByText, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { SILK, DEFAULT_SILK } from "./RunnerInfo.web.selectors";
import { RunnerInfo } from "./RunnerInfo.web";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <mock-silk />),
}));

beforeEach(jest.clearAllMocks);

describe("RunnerInfo", () => {
  function renderRunnerInfo(props) {
    return render(<RunnerInfo {...props} />);
  }

  it("should render the runner info", () => {
    const { container } = renderRunnerInfo({
      silkURL: "silkURL",
      silkAlt: "silk alt",
      runnerNumber: 1,
      runnerName: "Pegasus",
      jockeyLabel: "Jockey",
      jockey: "Hercules",
      trainerLabel: "Trainer",
      trainer: "Ferguson",
    });

    expect(getByText(container, "1. Pegasus")).toBeTruthy();
    expect(getByText(container, "Jockey")).toBeTruthy();
    expect(getByText(container, "Hercules")).toBeTruthy();
    expect(getByText(container, "Trainer")).toBeTruthy();
    expect(getByText(container, "Ferguson")).toBeTruthy();
  });

  it("should render the runner silk without alt", () => {
    const { container } = renderRunnerInfo({
      silkURL: "silkURL",
      silkAlt: "",
      runnerNumber: 1,
      runnerName: "Pegasus",
      jockeyLabel: "Jockey",
      jockey: "Hercules",
      trainerLabel: "Trainer",
      trainer: "Ferguson",
    });

    expect(getByAltText(container, "")).toBeTruthy();
  });

  it("should render the runner silk with alt", () => {
    const { container } = renderRunnerInfo({
      silkURL: "silkURL",
      silkAlt: "silk alt",
      runnerNumber: 1,
      runnerName: "Pegasus",
      jockeyLabel: "Jockey",
      jockey: "Hercules",
      trainerLabel: "Trainer",
      trainer: "Ferguson",
    });

    expect(getByAltText(container, "silk alt")).toBeTruthy();
  });

  it("should render the default runner silk", () => {
    const { container } = renderRunnerInfo({
      silkURL: "silkURL",
      silkAlt: "silk alt",
      runnerNumber: 1,
      runnerName: "Pegasus",
      jockeyLabel: "Jockey",
      jockey: "Hercules",
      trainerLabel: "Trainer",
      trainer: "Ferguson",
    });

    const silkImage = container.querySelector(SILK);
    let defaultSilkImage = container.querySelector(DEFAULT_SILK);
    expect(defaultSilkImage).toBeNull();
    fireEvent.error(silkImage);
    defaultSilkImage = container.querySelector(DEFAULT_SILK);
    expect(defaultSilkImage).toBeDefined();
  });

  describe("when optional props `silk`, `jockey`, `trainer` are undefined", () => {
    it("should not render them", () => {
      const { queryByTestId } = renderRunnerInfo({
        silkURL: undefined,
        silkAlt: undefined,
        runnerNumber: 1,
        runnerName: "Pegasus",
        jockeyLabel: "Jockey",
        jockey: undefined,
        trainerLabel: "Trainer",
        trainer: undefined,
      });

      expect(queryByTestId("silk")).toBeNull();
      expect(queryByTestId("jockey")).toBeNull();
      expect(queryByTestId("trainer")).toBeNull();
    });
  });
});
