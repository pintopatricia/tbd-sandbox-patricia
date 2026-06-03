import { GreyhoundRaceRunnerFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { GreyhoundRaceRunner } from "../../../../../state/entities";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeGreyhoundRaceRunnerFragmentIntoGreyhoundRaceRunner = (
  racingRunner: GreyhoundRaceRunnerFragment,
): TransformedFragment<GreyhoundRaceRunner> => {
  const { urn, __typename, trap, raceURN, selectionId } = racingRunner;

  return {
    data: {
      urn,
      typename: __typename,
      trap: trap ?? undefined,
      raceURN,
      selectionId,
    },
  };
};

export default normalizeGreyhoundRaceRunnerFragmentIntoGreyhoundRaceRunner;
