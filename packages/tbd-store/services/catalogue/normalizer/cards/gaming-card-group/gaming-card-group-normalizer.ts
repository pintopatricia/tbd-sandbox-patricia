import { TransformedFragment } from "../../Normalizer.types";
import { getCardIcon } from "../../../gql-entities-mapper";
import { GamingCardGroupFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { GamingCardGroup } from "../../../../../state/layout/cardgroups/CardGroup.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { CardGroupLayout, GameCardTileSize, GamingCardGroupType } from "../../../../../state/constants";

const normalizeGamingCardGroupFragmentIntoGamingCardGroup = (
  cardGroup: GamingCardGroupFragment,
): TransformedFragment<GamingCardGroup> => {
  const {
    urn,
    cardGroupTitle: title,
    decoration,
    type,
    displayName,
    defaultLayout,
    layouts,
    partials,
    full,
    viewAll,
    gameTileSize,
    __typename,
  } = cardGroup;

  return {
    data: {
      typename: __typename,
      urn,
      title: title ?? undefined,
      decoration: decoration ?? undefined,
      gameTileSize: gameTileSize ? GameCardTileSize[gameTileSize] : undefined,
      displayMode: "SCROLLABLE",
      displayName: displayName ?? undefined,
      defaultLayout: CardGroupLayout[defaultLayout],
      layouts: layouts.map((layout) => CardGroupLayout[layout]),
      cardGroupType: GamingCardGroupType[type],
      viewAll: viewAll?.label
        ? {
            label: viewAll.label,
            icon: viewAll.icon ? getCardIcon(viewAll.icon) : undefined,
            viewLink: viewAll.viewLink,
          }
        : undefined,
      items: partials.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && full.edges[index] !== null && "urn" in item.node) {
          return [
            ...acc,
            {
              // eslint-disable-next-line no-underscore-dangle
              typename: item.node.__typename,
              urn: item.node.urn,
            },
          ];
        }
        return acc;
      }, []),
    },
  };
};

export default normalizeGamingCardGroupFragmentIntoGamingCardGroup;
