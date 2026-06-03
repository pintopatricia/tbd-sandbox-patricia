import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { RunnerInfo } from "./snowflakes/RunnerInfo/RunnerInfo.web";
import RunnerInfoCard from "./RunnerInfoCard.web";

jest.mock("./snowflakes/RunnerInfo/RunnerInfo.web", () => ({
  RunnerInfo: jest.fn(() => <></>),
}));

function renderRunnerInfoCard(RunnerInfoCardProps) {
  return render(<RunnerInfoCard {...RunnerInfoCardProps} />);
}

beforeEach(jest.clearAllMocks);

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
          silkAlt: "silk alt",
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
