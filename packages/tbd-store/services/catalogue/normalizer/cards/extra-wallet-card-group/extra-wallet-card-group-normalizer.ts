import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { ExtraWalletCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { ExtraWalletCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeExtraWalletCardGroupFragmentIntoExtraWalletCardGroup = (
  extraWalletCardGroup: ExtraWalletCardGroupFragment,
): TransformedFragment<ExtraWalletCardGroup> => {
  const { urn, __typename, amount, helpUrl, bonusPageUrl, full } = extraWalletCardGroup;

  return {
    data: {
      typename: __typename,
      urn,
      amount,
      helpUrl: helpUrl ?? undefined,
      bonusPageUrl: bonusPageUrl ?? undefined,
      items: full.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && full.edges[index] !== null) {
          return [
            ...acc,
            {
              typename: item.node.__typename,
              urn: item.node.urn,
            },
          ];
        }
        return acc;
      }, []),
    },
  };
};

export default normalizeExtraWalletCardGroupFragmentIntoExtraWalletCardGroup;
