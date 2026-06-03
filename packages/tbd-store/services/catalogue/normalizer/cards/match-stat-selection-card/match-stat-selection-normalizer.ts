import { TransformedFragment } from "../../Normalizer.types";
import { MatchStatSelectionCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MatchStatSelectionCard } from "../../../../../state/layout/cards/Card.types";

const normalizeMatchStatSelectionCardFragmentIntoMatchStatSelectionCard = (
  matchStatSelection: MatchStatSelectionCardFragment,
): TransformedFragment<MatchStatSelectionCard> => {
  const { urn, __typename, matchStatTitle, matchStatSubtitle, market, runner, statsDescription, incidentType } =
    matchStatSelection;

  return {
    data: {
      typename: __typename,
      matchStatTitle: {
        playerNames: matchStatTitle.playerNames,
        combiner: matchStatTitle.combiner ?? "",
      },
      matchStatSubtitle: matchStatSubtitle ?? undefined,
      market: market?.urn,
      runner: runner?.runnerURN,
      urn,
      statsDescription: statsDescription ?? undefined,
      incidentType: incidentType ?? undefined,
    },
  };
};

export default normalizeMatchStatSelectionCardFragmentIntoMatchStatSelectionCard;
