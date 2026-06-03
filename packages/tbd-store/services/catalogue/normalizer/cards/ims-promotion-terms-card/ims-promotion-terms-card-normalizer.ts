import {
  ImsPromotionTermsAndConditionsCardFragment,
  RichText as GQLRichText,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { transformGQLRichTextToRichText } from "../../../gql-entities-mapper";
import { ImsPromotionTermsAndConditionsCard } from "../../../../../state/layout/cards/Card.types";

const normalizeImsPromotionTermsCardFragmentIntoImsPromotionTermsCard = (
  imsPromoTermsCard: ImsPromotionTermsAndConditionsCardFragment,
): TransformedFragment<ImsPromotionTermsAndConditionsCard> => {
  const { urn, promotion, __typename } = imsPromoTermsCard;

  return {
    data: {
      typename: __typename,
      urn,
      termsAndConditions: promotion.termsAndConditions
        ? transformGQLRichTextToRichText(promotion.termsAndConditions as GQLRichText[])
        : [],
    },
  };
};

export default normalizeImsPromotionTermsCardFragmentIntoImsPromotionTermsCard;
