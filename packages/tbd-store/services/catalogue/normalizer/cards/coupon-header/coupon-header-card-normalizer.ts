/* eslint-disable no-underscore-dangle */
import { CouponHeaderCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { CouponHeaderCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeCouponHeaderCardFragmentIntoCouponHeaderCard = (
  couponHeaderCard: CouponHeaderCardFragment,
): TransformedFragment<CouponHeaderCard> => {
  const { __typename: typename, urn, columns, competition, competitionViewLink, hasStats } = couponHeaderCard;
  return {
    data: {
      typename,
      urn,
      columns: columns || [],
      competition: competition.urn,
      competitionViewLink,
      hasStats,
    },
  };
};

export default normalizeCouponHeaderCardFragmentIntoCouponHeaderCard;
