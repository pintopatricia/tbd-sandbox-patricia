import { act, render } from "@testing-library/react-native";

import { Tooltip } from "@ppb/the-wall-native";

import { useNativeLazyLoading } from "../../../hooks/useNativeLazyLoading.native";
import { FlatList } from "../../FlatList.native";
import { NavigationTabItem } from "../../NavigationTabItem/NavigationTabItem.native";

import { TabContent } from "./TabContent.native";
import styles from "./TabContent.native.styles";
import { NAVIGATION_TAB_ITEM_VIEW } from "./TabContent.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({ Tooltip: jest.fn(() => <tooltip-mock />) }));

const mockLazyLoading = jest.fn();

jest.mock("../../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => ({
    current: mockLazyLoading,
  })),
}));

jest.mock("../../FlatList.native", () => ({
  FlatList: jest.fn((props) => (
    <flatlist-mock {...props}>
      {props.data.map((item) => (
        <item-mock key={`${item.urn}-item`}>{props.renderItem({ item })}</item-mock>
      ))}
    </flatlist-mock>
  )),
}));

jest.mock("../../NavigationTabItem/NavigationTabItem.native", () => ({
  NavigationTabItem: jest.fn(() => <navigation-tab-item-mock />),
}));

const cardGroupMock = {
  urn: "ppb:tbd:card:someCardGroupMock",
  typename: "SwimlaneCardGroup",
};

const expandedMarketCardMock = {
  urn: "ppb:tbd:card:expandedMarketCard",
  typename: "ExpandedMarketCard",
};

const DEFAULT_PROPS = {
  items: [cardGroupMock, expandedMarketCardMock],
  dispatchFetchCardsFromList: jest.fn(),
};

const setup = (props = {}) => render(<TabContent {...DEFAULT_PROPS} {...props} />);

describe("Tab Content", () => {
  beforeEach(jest.clearAllMocks);

  describe("when rendering tab content", () => {
    it("should call Tooltip with correct props", () => {
      setup({ tooltip: { title: "Tooltip Title", description: "Tooltip description" } });

      expect(Tooltip).toHaveBeenCalledWith(
        {
          title: "Tooltip Title",
          description: "Tooltip description",
          onClosePress: expect.any(Function),
        },
        undefined,
      );
    });

    it("should call NavigationTabItem with correct props", () => {
      setup();

      expect(NavigationTabItem).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:card:someCardGroupMock",
          typename: "SwimlaneCardGroup",
        },
        undefined,
      );
    });

    it("should call useNativeLazyLoading", () => {
      setup();

      expect(useNativeLazyLoading).toHaveBeenCalledWith(DEFAULT_PROPS.items, DEFAULT_PROPS.dispatchFetchCardsFromList);
    });

    it("should call FlatList with correct initialNumToRender", () => {
      setup();

      expect(FlatList.mock.calls[0][0].initialNumToRender).toEqual(10);
    });

    describe("when the Tooltip close button is pressed", () => {
      it("should close the tooltip", () => {
        const onTooltipCloseSpy = jest.fn();

        setup({
          tooltip: { title: "Tooltip Title", description: "Tooltip description", onClose: onTooltipCloseSpy },
        });

        act(() => {
          Tooltip.mock.calls[0][0].onClosePress();
        });

        expect(onTooltipCloseSpy).toHaveBeenCalledTimes(1);
        expect(onTooltipCloseSpy).toHaveBeenCalledWith();
      });
    });

    describe("when the groups/cards have side padding", () => {
      it("should apply the correct styles for the items", () => {
        const { queryAllByTestId } = setup({
          items: [cardGroupMock, { ...cardGroupMock, urn: `${cardGroupMock.urn}-2` }],
        });

        expect(queryAllByTestId(NAVIGATION_TAB_ITEM_VIEW)[0]).not.toHaveStyle(styles.cardItem);
        expect(queryAllByTestId(NAVIGATION_TAB_ITEM_VIEW)[1]).not.toHaveStyle(styles.cardItem);
      });
    });

    describe("when the groups/cards don't have side padding", () => {
      it("should apply the correct styles for the items", () => {
        const { queryAllByTestId } = setup({
          items: [expandedMarketCardMock, { ...expandedMarketCardMock, urn: `${expandedMarketCardMock.urn}-2` }],
        });

        expect(queryAllByTestId(NAVIGATION_TAB_ITEM_VIEW)[0]).toHaveStyle(styles.cardItem);
        expect(queryAllByTestId(NAVIGATION_TAB_ITEM_VIEW)[1]).toHaveStyle(styles.cardItem);
      });
    });
  });
});
