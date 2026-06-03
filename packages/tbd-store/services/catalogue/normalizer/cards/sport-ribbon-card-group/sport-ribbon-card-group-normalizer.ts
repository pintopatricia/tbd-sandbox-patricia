/* eslint-disable no-underscore-dangle */

import { SportRibbonCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { SportRibbonCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeDisplayNameFragment from "../display-name/display-name-normalizer";

const normalizeViewLinkCard = (fragment: SportRibbonCardGroupFragment["full"]["edges"][number]) => {
  const node = fragment?.node;

  if (node?.__typename === "GenericViewLinkCard") {
    return {
      urn: node.urn,
      typename: node.__typename,
      viewLink: node.viewLink,
      badge: node.badge,
      icon: node.icon,
      label: fragment?.label,
      title: normalizeDisplayNameFragment(node.genericViewLinkTitle),
    };
  }

  if (node?.__typename === "SportViewLinkCard") {
    return {
      urn: node.urn,
      typename: node.__typename,
      viewLink: node.viewLink,
      sportId: node.sport.sportId,
      title: node.sport.shortName || node.sport.name,
    };
  }

  return null;
};

const normalizeSportRibbonCardGroupFragmentIntoSportRibbonCardGroup = (
  sportRibbonCardGroupFragment: SportRibbonCardGroupFragment,
): TransformedFragment<SportRibbonCardGroup> => {
  const { urn, __typename, full } = sportRibbonCardGroupFragment;

  return {
    data: {
      urn,
      typename: __typename,
      items: full.edges.reduce((acc: SportRibbonCardGroup["items"], item, index) => {
        if (item && full.edges[index] !== null && "urn" in item.node) {
          const viewLink = normalizeViewLinkCard(item);

          if (viewLink) {
            return [...acc, viewLink];
          }

          return acc;
        }
        return acc;
      }, []),
    },
  };
};

export default normalizeSportRibbonCardGroupFragmentIntoSportRibbonCardGroup;
