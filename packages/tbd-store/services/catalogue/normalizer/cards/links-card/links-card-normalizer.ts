/* eslint-disable no-underscore-dangle */
import { LinksCardFragment, RegulatoryItemAlignment } from "../../../../../clients/catalogue/catalogue-response-types";
import { LinksCard, MenuSection } from "../../../../../state/layout/cards/Card.types";
import { Alignment } from "../../../../../state/layout/cards/regulatory-sections/constants";
import { TransformedFragment } from "../../Normalizer.types";

const getAlignment = (regulatoryItemAlignament: RegulatoryItemAlignment): Alignment => {
  switch (regulatoryItemAlignament) {
    case RegulatoryItemAlignment.Right:
      return "right";
    case RegulatoryItemAlignment.Left:
      return "left";
    default:
      return "center";
  }
};

const normalizeLinksCardFragmentIntoLinksCard = (linksCard: LinksCardFragment): TransformedFragment<LinksCard> => {
  const menuSections: MenuSection[] = linksCard.section.map((menuSection) => ({
    title: menuSection.title ?? undefined,
    sectionType: menuSection.sectionType,
    sectionLabel: menuSection.sectionLabel,
    items: menuSection.items.map((item) => ({
      alignment: getAlignment(item.alignment),
      target: item.target ?? undefined,
      text: item.text,
      viewLink: {
        viewUrl: item.url,
        viewUrn: "ppb:tbd:view:external", // FIXME This should be retrieved by BFF
      },
    })),
  }));

  return {
    data: {
      typename: linksCard.__typename,
      sections: menuSections,
      urn: linksCard.urn,
    },
  };
};

export default normalizeLinksCardFragmentIntoLinksCard;
