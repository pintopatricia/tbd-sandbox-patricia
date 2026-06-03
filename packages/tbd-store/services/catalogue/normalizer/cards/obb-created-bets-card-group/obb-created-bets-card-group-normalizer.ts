import { ObbCreatedBetsCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { ObbCreatedBetsCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";

const normalizeObbCreatedBetsCardGroupFragmentIntoObbCreatedBetsCardGroup = (
  obbCreatedBetsCardGroup: ObbCreatedBetsCardGroupFragment,
): TransformedFragment<ObbCreatedBetsCardGroup> => {
  const { __typename, urn, obbCreatedBetsCardGroupTitle, headerBadgeLabel, headerViewLink, cards } =
    obbCreatedBetsCardGroup;

  return {
    data: {
      typename: __typename,
      urn,
      title: normalizeDisplayNameFragmentIntoDisplayName(obbCreatedBetsCardGroupTitle),
      headerBadgeLabel: headerBadgeLabel ? normalizeDisplayNameFragmentIntoDisplayName(headerBadgeLabel) : undefined,
      headerViewLink: headerViewLink
        ? {
            viewUrl: headerViewLink.viewUrl,
            viewUrn: headerViewLink.viewUrn,
          }
        : undefined,
      items: cards.edges.reduce<PartialItem[]>((acc, card) => {
        // We do not want to store cards without betting opportunities
        if (card && card !== null && "urn" in card.node && card.node.bettingOpportunities.length > 0) {
          acc.push({
            urn: card.node.urn,
            // eslint-disable-next-line no-underscore-dangle
            typename: card.node.__typename,
          });
        }
        return acc;
      }, []),
    },
  };
};

export default normalizeObbCreatedBetsCardGroupFragmentIntoObbCreatedBetsCardGroup;
