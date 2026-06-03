import type { PackagedCreatedBetsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import type { PackagedCreatedBetsCard, PackagedCreatedBetsItem } from "../../../../../state/layout/cards/Card.types";
import type { TransformedFragment } from "../../Normalizer.types";

const normalizePackagedCreatedBetsCardFragmentIntoPackagedCreatedBetsCard = ({
  __typename,
  urn,
  pcbTitle,
  pcbLayout,
  favouriteMarketsState,
  items,
}: PackagedCreatedBetsCardFragment): TransformedFragment<PackagedCreatedBetsCard> => ({
  data: {
    urn,
    typename: __typename,
    displayName: pcbTitle,
    layout: pcbLayout,
    favouriteMarketsStateURN: favouriteMarketsState?.urn,
    hasNextPage: !!items.pageInfo?.hasNextPage,
    endCursor: items.pageInfo?.endCursor || undefined,
    items: items.edges.reduce((acc: PackagedCreatedBetsItem[], item) => {
      if (item && "urn" in item.node) {
        const { __typename: typename } = item;

        return [...acc, { urn: item.node.urn, typename, cursor: item.cursor || undefined }];
      }
      return acc;
    }, []),
  },
});

export default normalizePackagedCreatedBetsCardFragmentIntoPackagedCreatedBetsCard;
