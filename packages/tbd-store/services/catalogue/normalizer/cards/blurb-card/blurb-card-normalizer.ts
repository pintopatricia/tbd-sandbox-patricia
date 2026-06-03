import { BlurbCardFragment, InformativeBlurbFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { BlurbCard, MarketBlurbInfo } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";

export const normalizeBlurbFragment = (fragment: InformativeBlurbFragment): MarketBlurbInfo => {
  const { title, description, supplementaryInfo, isCollapsed = true } = fragment;

  return {
    isExpanded: !isCollapsed,
    title: normalizeDisplayNameFragmentIntoDisplayName(title),
    description: description ? normalizeDisplayNameFragmentIntoDisplayName(description) : undefined,
    link: supplementaryInfo?.viewLink
      ? {
          text: normalizeDisplayNameFragmentIntoDisplayName(supplementaryInfo.label),
          url: supplementaryInfo.viewLink.viewUrl,
          displayMode: supplementaryInfo.viewLink.viewDisplayMode,
        }
      : undefined,
    signposting: "MARKET_RULES",
  };
};

const normalizeBlurbCardFragmentIntoBlurbCard = (blurbCard: BlurbCardFragment): TransformedFragment<BlurbCard> => {
  const { urn, __typename, blurb } = blurbCard;

  return {
    data: {
      urn,
      typename: __typename,
      blurb: normalizeBlurbFragment(blurb),
    },
  };
};

export default normalizeBlurbCardFragmentIntoBlurbCard;
