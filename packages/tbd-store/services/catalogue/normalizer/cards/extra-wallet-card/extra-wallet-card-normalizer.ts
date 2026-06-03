import { ExtraWalletCard } from "../../../../../state/layout/cards/Card.types";
import { ExtraWalletCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeExtraWalletCardFragmentIntoExtraWalletCard = (
  extraWalletCard: ExtraWalletCardFragment,
): TransformedFragment<ExtraWalletCard> => {
  const { urn, __typename, badges, extraWallet, restrictions } = extraWalletCard;

  return {
    data: {
      urn,
      typename: __typename,
      badges: badges.filter((badge) => badge !== null) as string[],
      extraWalletURN: extraWallet.urn,
      restrictions: {
        single: !!restrictions?.single,
        acca: !!restrictions?.acca,
        sameGameMulti: !!restrictions?.sameGameMulti,
      },
    },
  };
};

export default normalizeExtraWalletCardFragmentIntoExtraWalletCard;
