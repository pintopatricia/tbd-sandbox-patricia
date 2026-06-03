import { QuickLink, QuickLinksCard } from "../../../../../state/layout/cards/Card.types";
import { QuickLinksCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeQuickLinksCardFragmentIntoQuickLinksCard = (
  quickLinks: QuickLinksCardFragment,
): TransformedFragment<QuickLinksCard> => {
  const {
    urn,
    links,
    quickLinksTitle,
    __typename,
    accordionTitle,
    accordionExpanded,
    label: displayNameLabel,
  } = quickLinks;

  return {
    data: {
      urn,
      typename: __typename,
      accordionTitle,
      accordionExpanded,
      title: quickLinksTitle,
      label: displayNameLabel,
      links: links.map<QuickLink>(({ label, target, icon, viewLink }) => ({
        label,
        target,
        icon,
        viewLink,
      })),
    },
  };
};

export default normalizeQuickLinksCardFragmentIntoQuickLinksCard;
