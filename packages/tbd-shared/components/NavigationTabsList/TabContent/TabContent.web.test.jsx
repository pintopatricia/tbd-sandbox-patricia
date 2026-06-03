import { act, render } from "@testing-library/react";

import { Tooltip } from "@ppb/the-wall-web";

import { useVisibilityObserver } from "../../../hooks/useVisibilityObserver.web";

import { NavigationTabItem } from "../../NavigationTabItem/NavigationTabItem.web";

import { TabContent } from "./TabContent.web";
import cssModules from "./TabContent.web.modules.json";

jest.mock("@ppb/the-wall-web", () => ({ Tooltip: jest.fn(() => <tooltip-mock />) }));

jest.mock("../../../hooks/useVisibilityObserver.web", () => ({
  useVisibilityObserver: jest.fn(() => ({
    observe: jest.fn(),
    visibility: {},
  })),
}));

jest.mock("../../NavigationTabItem/NavigationTabItem.web", () => ({
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
          onCloseClick: expect.any(Function),
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
          visible: false,
        },
        undefined,
      );
    });

    it("should call useVisibilityObserver with onFirstShow", () => {
      setup();

      expect(useVisibilityObserver).toHaveBeenCalledWith({ onFirstShow: expect.any(Function) });
      expect(useVisibilityObserver).toHaveBeenCalledTimes(1);

      useVisibilityObserver.mock.calls[0][0].onFirstShow("randomUrn");

      expect(DEFAULT_PROPS.dispatchFetchCardsFromList).toHaveBeenCalledTimes(1);
    });

    describe("when isFavouriteMarketsTab is true", () => {
      it("should call useVisibilityObserver with onShow", () => {
        setup({ isFavouriteMarketsTab: true });

        expect(useVisibilityObserver).toHaveBeenCalledWith({ onShow: expect.any(Function) });
        expect(useVisibilityObserver).toHaveBeenCalledTimes(1);

        useVisibilityObserver.mock.calls[0][0].onShow("randomUrn");

        expect(DEFAULT_PROPS.dispatchFetchCardsFromList).toHaveBeenCalledTimes(1);
      });
    });

    describe("when the Tooltip close button is clicked", () => {
      it("should close the tooltip", () => {
        const onTooltipCloseSpy = jest.fn();

        setup({
          tooltip: { title: "Tooltip Title", description: "Tooltip description", onClose: onTooltipCloseSpy },
        });

        act(() => {
          Tooltip.mock.calls[0][0].onCloseClick();
        });

        expect(onTooltipCloseSpy).toHaveBeenCalledTimes(1);
        expect(onTooltipCloseSpy).toHaveBeenCalledWith();
      });
    });

    describe("when the groups/cards have side padding", () => {
      it("should apply the correct styles for the items", () => {
        const { container } = setup({
          items: [cardGroupMock, { ...cardGroupMock, urn: `${cardGroupMock.urn}-2` }],
        });

        expect(container.querySelectorAll(cssModules.cardItem).length).toBe(0);
      });
    });

    describe("when the groups/cards don't have side padding", () => {
      it("should apply the correct styles for the items", () => {
        const { container } = setup({
          items: [expandedMarketCardMock, { ...expandedMarketCardMock, urn: `${expandedMarketCardMock.urn}-2` }],
        });

        expect(container.querySelectorAll(cssModules.cardItem).length).toBe(2);
      });
    });
  });
});
