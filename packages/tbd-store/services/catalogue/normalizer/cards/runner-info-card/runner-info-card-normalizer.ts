import { RunnerInfoCard } from "../../../../../state/layout/cards/Card.types";
import { RunnerInfoCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeRunnerInfoCardFragmentIntoRunnerInfoCard = (
  runnerInfoCard: RunnerInfoCardFragment,
): TransformedFragment<RunnerInfoCard> => {
  const { __typename, urn, raceRunner } = runnerInfoCard;

  return {
    data: {
      typename: __typename,
      urn,
      raceRunner: raceRunner.urn,
    },
  };
};

export default normalizeRunnerInfoCardFragmentIntoRunnerInfoCard;
