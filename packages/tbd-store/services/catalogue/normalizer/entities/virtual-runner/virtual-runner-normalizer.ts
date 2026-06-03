import { VirtualRunner } from "../../../../../state/entities";
import { SportsbookOdds } from "../../../../../state/entities/SportsbookOdds.types";
import { VirtualRunnerFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const transformGQLSportsbookOddsToSportsbookOdds = ({
  decimal,
  fractional,
}: VirtualRunnerFragment["odds"]): SportsbookOdds => ({
  decimal,
  fractional: fractional || undefined,
});

const normalizeVirtualRunnerFragmentIntoVirtualRunner = (
  virtualRunner: VirtualRunnerFragment,
): TransformedFragment<VirtualRunner> => {
  const { name, humanName, racerIndex, odds, runnerURN, selectionId, humanTexture, selectionTexture, __typename } =
    virtualRunner;

  return {
    data: {
      typename: __typename,
      name,
      humanName: humanName ?? undefined,
      racerIndex: racerIndex ?? undefined,
      odds: odds && transformGQLSportsbookOddsToSportsbookOdds(odds),
      urn: runnerURN,
      selectionId,
      humanTexture: humanTexture ?? "",
      selectionTexture: selectionTexture ?? "",
    },
  };
};

export default normalizeVirtualRunnerFragmentIntoVirtualRunner;
