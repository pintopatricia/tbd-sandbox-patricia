import { render } from "@testing-library/react-native";
import { RunnerInfo } from "./snowflakes/RunnerInfo/RunnerInfo.native";
import RunnerInfoCard from "./RunnerInfoCard.native";

jest.mock("./snowflakes/RunnerInfo/RunnerInfo.native", () => ({
  RunnerInfo: jest.fn(() => <></>),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
}));

function renderRunnerInfoCard(RunnerInfoCardProps) {
  return render(<RunnerInfoCard {...RunnerInfoCardProps} />);
}

describe("RunnerInfoCard component", () => {
  describe("when RunnerInfoCard is defined", () => {
    let stateProps;

    beforeEach(() => {
      stateProps = {
        silkURL: "silkURL",
        silkAlt: "silk alt",
        runnerNumber: 1,
        runnerName: "Pegasus",
        jockeyLabel: "Jockey",
        jockey: "Hercules",
        trainerLabel: "Trainer",
        trainer: "Ferguson",
      };
    });

    it("must render the RunnerInfoCard component with the correct props", () => {
      renderRunnerInfoCard(stateProps);

      expect(RunnerInfo).toHaveBeenCalledWith(
        {
          silkURL: "silkURL",
          runnerNumber: 1,
          runnerName: "Pegasus",
          jockeyLabel: "Jockey",
          jockey: "Hercules",
          trainerLabel: "Trainer",
          trainer: "Ferguson",
        },
        undefined,
      );
      expect(RunnerInfo).toHaveBeenCalledTimes(1);
    });
  });
});
