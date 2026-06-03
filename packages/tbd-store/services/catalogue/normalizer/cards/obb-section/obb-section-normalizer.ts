import { ObbSectionFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { ObbCardsLayout, ObbSection } from "../../../../../state/layout/cardgroups/CardGroup.types";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";
import normalizeObbCardsStackedLayoutFragmentIntoObbCardsStackedLayout from "../obb-card-stacked-layout/obb-card-stacked-layout-normalizer";
import normalizeObbCardsSwimlaneLayoutFragmentIntoObbCardsSwimlaneLayout from "../obb-card-swimlane-layout/obb-card-swimlane-layout-normalizer";

const normalizeObbSectionFragmentIntoObbSection = (obbSection: ObbSectionFragment): ObbSection => {
  const { __typename, urn, obbSectionTitle, icon, isExpanded, layouts } = obbSection;

  return {
    typename: __typename,
    urn,
    title: normalizeDisplayNameFragmentIntoDisplayName(obbSectionTitle),
    icon,
    isExpanded,
    layouts: layouts.edges.reduce((items: ObbCardsLayout[], item, index) => {
      if (!item) {
        return items;
      }

      // eslint-disable-next-line no-underscore-dangle
      if (item.node.__typename === "ObbCardsStackedLayout") {
        items.push(normalizeObbCardsStackedLayoutFragmentIntoObbCardsStackedLayout(item.node, index));
      }

      // eslint-disable-next-line no-underscore-dangle
      if (item.node.__typename === "ObbCardsSwimlaneLayout") {
        items.push(normalizeObbCardsSwimlaneLayoutFragmentIntoObbCardsSwimlaneLayout(item.node, index));
      }

      return items;
    }, []),
  };
};

export default normalizeObbSectionFragmentIntoObbSection;
