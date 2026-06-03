import { SportsbookBetInfoCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { SportsbookBetInfoCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeSportsbookBetInfoCardFragmentIntoSportsbookBetInfoCard = ({
  __typename,
  urn,
  placedDate,
  settledDate,
  betReceiptId,
  regulatorBetId,
  deviceId,
  selections,
  product,
}: SportsbookBetInfoCardFragment): TransformedFragment<SportsbookBetInfoCard> => ({
  data: {
    typename: __typename,
    urn,
    placedDate,
    settledDate: settledDate || undefined,
    betReceiptId,
    regulatorBetId: regulatorBetId || undefined,
    deviceId: deviceId ?? undefined,
    betSelections: selections || undefined,
    product: product || undefined,
  },
});

export default normalizeSportsbookBetInfoCardFragmentIntoSportsbookBetInfoCard;
