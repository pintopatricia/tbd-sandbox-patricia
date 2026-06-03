import {
  ImsPromotionDetailsCardFragment,
  RichText as GQLRichText,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { transformGQLRichTextToRichText } from "../../../gql-entities-mapper";
import { ImsPromotionDetailsCard } from "../../../../../state/layout/cards/Card.types";

const normalizeImsPromotionDetailsCardFragmentIntoImsPromotionDetailsCard = (
  imsPromoDetailsCard: ImsPromotionDetailsCardFragment,
): TransformedFragment<ImsPromotionDetailsCard> => {
  const { urn, promotion, __typename } = imsPromoDetailsCard;

  return {
    data: {
      typename: __typename,
      urn,
      details: promotion.details ? transformGQLRichTextToRichText(promotion.details as GQLRichText[]) : [],
    },
  };
};

export default normalizeImsPromotionDetailsCardFragmentIntoImsPromotionDetailsCard;
