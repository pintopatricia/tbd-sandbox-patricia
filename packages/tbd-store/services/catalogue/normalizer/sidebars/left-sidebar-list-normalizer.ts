import { LeftSidebarFragment } from "../../../../clients/catalogue/catalogue-response-types";
import { LeftSidebar } from "../../../../state/layout/left-side-bar/LeftSideBar.types";
import { PartialItem } from "../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../Normalizer.types";

const normalizeLeftSidebarFragmentIntoLeftSidebar = (
  sideBar: LeftSidebarFragment,
): TransformedFragment<LeftSidebar> => {
  const { __typename, items: leftSidebar } = sideBar;

  return {
    data: {
      typename: __typename,
      items: leftSidebar.edges.reduce((acc: PartialItem[], item) => {
        if (item?.node && "urn" in item.node) {
          // eslint-disable-next-line no-underscore-dangle
          return [...acc, { urn: item.node.urn, typename: item.node.__typename }];
        }

        return acc;
      }, []),
    },
  };
};

export default normalizeLeftSidebarFragmentIntoLeftSidebar;
