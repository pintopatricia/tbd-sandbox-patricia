import { ExtraWalletFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { ExtraWallet } from "../../../../../state/entities/extra-wallet/ExtraWallet.types";

const normalizeExtraWalletFragmentIntoExtraWallet = (
  extraWallet: ExtraWalletFragment,
): TransformedFragment<ExtraWallet> => {
  const {
    __typename,
    urn,
    walletId,
    indexedId,
    amount,
    expirationDate,
    walletType,
    lostLegs,
    maxReturn,
    maxFinPos,
    ghostLegs,
    fixedOdds,
  } = extraWallet;

  return {
    data: {
      typename: __typename,
      urn,
      walletId,
      indexedId: indexedId ?? undefined,
      amount,
      expirationDate: expirationDate ?? undefined,
      walletType: walletType ?? undefined,
      lostLegs: lostLegs ?? undefined,
      maxReturn: maxReturn ?? undefined,
      maxFinPos: maxFinPos ?? undefined,
      ghostLegs: ghostLegs ?? undefined,
      fixedOdds: fixedOdds ?? undefined,
    },
  };
};

export default normalizeExtraWalletFragmentIntoExtraWallet;
