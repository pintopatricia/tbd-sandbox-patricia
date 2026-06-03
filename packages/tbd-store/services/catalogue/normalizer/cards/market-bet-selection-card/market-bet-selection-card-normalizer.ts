import { MarketBetSelectionCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { MarketBetSelectionCard } from "../../../../../state/layout/cards/Card.types";

const normalizeMarketBetSelectionCardFragmentIntoMarketBetSelectionCard = (
  marketBetSelectionCard: MarketBetSelectionCardFragment,
): TransformedFragment<MarketBetSelectionCard> => {
  const {
    urn,
    __typename,
    id,
    handicap,
    placedDate,
    settledDate,
    matchedDate,
    price,
    runnerDesc,
    side,
    isCashout,
    size,
    profit,
    result,
    isFreeBet,
    freeBetSize,
    priceMatched,
    selectionId,
    deviceId,
    isUnmatched,
    isBsp,
    bspLiability,
    liability,
    editViewLink,
    marketBetURN,
    runnerURN,
    marketURN,
    marketBetCardGroupURN,
  } = marketBetSelectionCard;

  return {
    data: {
      typename: __typename,
      urn,
      id,
      handicap,
      placedDate,
      settledDate: settledDate ?? undefined,
      matchedDate: matchedDate ?? undefined,
      price,
      runnerDesc,
      side: side ?? undefined,
      isCashout: isCashout ?? false,
      size: size ?? undefined,
      profit: profit ?? undefined,
      result: result ?? undefined,
      isFreeBet,
      freeBetSize,
      priceMatched,
      isBsp: isBsp ?? undefined,
      bspLiability: bspLiability ?? undefined,
      liability: liability ?? undefined,
      selectionId,
      isUnmatched,
      deviceId: deviceId ?? undefined,
      editViewLink: editViewLink ?? undefined,
      marketBetURN,
      runnerURN,
      marketURN,
      marketBetCardGroupURN,
    },
  };
};

export default normalizeMarketBetSelectionCardFragmentIntoMarketBetSelectionCard;
