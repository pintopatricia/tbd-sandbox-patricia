import { render } from "@testing-library/react-native";
import { TBDImage } from "@ppb/the-wall-native/components/TBDImage/TBDImage";
import { RunnerInfo } from "./RunnerInfo.native";
import styles from "./RunnerInfo.native.styles";
import {
  RUNNER_INFO,
  RUNNER_INFO_SILK,
  RUNNER_INFO_SILK_DEFAULT,
  RUNNER_INFO_NAME,
  RUNNER_INFO_JOCKEY_LABEL,
  RUNNER_INFO_JOCKEY_NAME,
  RUNNER_INFO_TRAINER_LABEL,
  RUNNER_INFO_TRAINER_NAME,
} from "./RunnerInfo.native.selectors";

jest.mock("@ppb/the-wall-native/components/TBDImage/TBDImage", () => ({
  TBDImage: jest.fn(() => <silk-image />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

function renderRunnerInfo({ silkURL, runnerNumber, runnerName, jockeyLabel, jockey, trainerLabel, trainer }) {
  return render(
    <RunnerInfo
      silkURL={silkURL}
      runnerNumber={runnerNumber}
      runnerName={runnerName}
      jockeyLabel={jockeyLabel}
      jockey={jockey}
      trainerLabel={trainerLabel}
      trainer={trainer}
    />,
  );
}

describe("RunnerInfo", () => {
  let runnerInfo;
  let silk;
  let runner;
  let jockeyLabel;
  let jockey;
  let trainerLabel;
  let trainer;

  describe("when component is rendered", () => {
    describe("When all the props are provided", () => {
      beforeEach(() => {
        const { queryByTestId } = renderRunnerInfo({
          silkURL: "silk",
          runnerNumber: "1",
          runnerName: "Pegasus",
          jockeyLabel: "Jockey",
          jockey: "Hercules",
          trainerLabel: "Trainer",
          trainer: "Ferguson",
        });

        runnerInfo = queryByTestId(RUNNER_INFO);
        silk = queryByTestId(RUNNER_INFO_SILK);
        runner = queryByTestId(RUNNER_INFO_NAME);
        jockeyLabel = queryByTestId(RUNNER_INFO_JOCKEY_LABEL);
        jockey = queryByTestId(RUNNER_INFO_JOCKEY_NAME);
        trainerLabel = queryByTestId(RUNNER_INFO_TRAINER_LABEL);
        trainer = queryByTestId(RUNNER_INFO_TRAINER_NAME);
      });

      it("should render the runner info component", () => {
        expect(runnerInfo).not.toBeNull();
      });

      it("should render the silk", () => {
        expect(TBDImage.mock.calls.length).toEqual(2);
        expect(TBDImage.mock.calls[0][0]).toEqual({
          source: "silk",
          style: styles.silk,
          fallbackTestID: RUNNER_INFO_SILK_DEFAULT,
          accessible: false,
          fallbackSource: "svg",
          testID: RUNNER_INFO_SILK,
        });
      });

      it("should render the runner with '1. Pegasus' value", () => {
        expect(runner).toHaveTextContent("1. Pegasus");
      });

      it("should render the jockey label with 'Jockey' value", () => {
        expect(jockeyLabel).toHaveTextContent("Jockey");
      });

      it("should render the jockey with 'Hercules' value", () => {
        expect(jockey).toHaveTextContent("Hercules");
      });

      it("should render the trainer label with 'Trainer' label", () => {
        expect(trainerLabel).toHaveTextContent("Trainer");
      });

      it("should render the trainer with 'Ferguson' value", () => {
        expect(trainer).toHaveTextContent("Ferguson");
      });
    });

    describe("when props `silk`, `jockey`, `trainer` are not provided", () => {
      beforeEach(() => {
        const { queryByTestId } = renderRunnerInfo({
          silkURL: undefined,
          runnerNumber: undefined,
          runnerName: "Pegasus",
          jockeyLabel: "Jockey",
          jockey: undefined,
          trainerLabel: "Trainer",
          trainer: undefined,
        });

        silk = queryByTestId(RUNNER_INFO_SILK);
        runner = queryByTestId(RUNNER_INFO_NAME);
        jockey = queryByTestId(RUNNER_INFO_JOCKEY_NAME);
        trainer = queryByTestId(RUNNER_INFO_TRAINER_NAME);
      });

      it("should not render the silk", () => {
        expect(silk).toBe(null);
      });

      it("should not render the runner", () => {
        expect(runner).toBe(null);
      });

      it("should render the jockey", () => {
        expect(jockey).toBe(null);
      });

      it("should render the trainer", () => {
        expect(trainer).toBe(null);
      });
    });
  });
});
