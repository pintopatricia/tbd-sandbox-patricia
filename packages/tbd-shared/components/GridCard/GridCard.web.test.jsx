import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Alert, useOnIntersect } from "@ppb/the-wall-web";
import { AlertType } from "@ppb/the-wall-common/types";

import useShowMore from "../../hooks/useShowMore";
import useAlphabeticalSort from "../../hooks/useAlphabeticalSort";
import ConnectedMarketBlurb from "../MarketBlurb";
import MarketBlurb from "../MarketBlurb/MarketBlurb.web";
import ShowMore from "../ShowMore/ShowMore.web";

import GridCardRunner from "./GridCardRunner/GridCardRunner.web";
import GridCard from "./GridCard.web";

jest.mock("@ppb/the-wall-web", () => ({
  useOnIntersect: jest.fn(() => ({ isIntersecting: false, ref: null })),
  Alert: jest.fn(() => null),
}));

const lineMock = {
  label: "Runner 1",
  items: [
    {
      label: "Market 1",
      marketUrn: "ppb:tbd:sbkMarket:924.111",
      selectionId: 12345,
    },
  ],
};

jest.mock("../../hooks/useShowMore", () =>
  jest.fn(() => ({
    itemsToDisplay: [lineMock],
    isShowMoreAvailable: false,
    isItemsListCollapsed: false,
    onShowMoreChange: jest.fn(),
  })),
);

jest.mock("../../hooks/useAlphabeticalSort", () =>
  jest.fn(() => ({
    azSwitcherLabel: "A - Z",
    isSorted: false,
    itemsToDisplay: [lineMock],
    onSwitch: jest.fn(),
  })),
);

jest.mock("../MarketBlurb", () => jest.fn(() => <connected-market-blurb-mock />));

jest.mock("../MarketBlurb/MarketBlurb.web", () => jest.fn(() => <market-blurb-mock />));

jest.mock("../ShowMore/ShowMore.web", () => jest.fn(() => <show-more-mock />));

jest.mock("./GridCardRunner/GridCardRunner.web", () => jest.fn(() => <grid-card-runner-mock />));

const DEFAULT_PROPS = {
  urn: "ppb:tbd:card:grid:12345",
  lines: [lineMock],
  numberOfItemsToDisplay: undefined,
  marketUrn: "ppb:tbd:sbkMarket:924.111",
  layout: "HORIZONTAL_MARKETS",
  dispatchRefreshCard: jest.fn(),
  dispatchToggleShowMoreRunners: jest.fn(),
  dispatchAzSwitchClick: jest.fn(),
};

const renderGridCard = (props = {}) => render(<GridCard {...DEFAULT_PROPS} {...props} />);

describe("GridCard Web", () => {
  beforeEach(jest.clearAllMocks);

  describe("Info blurbs", () => {
    it("should render the Alert component when infoBlurb is defined", () => {
      renderGridCard({ infoBlurb: "Some info" });

      expect(Alert).toHaveBeenCalledWith({ type: AlertType.Info, detail: "Some info" }, undefined);
    });

    it("should not render the Alert component when infoBlurb is not defined", () => {
      renderGridCard();

      expect(Alert).not.toHaveBeenCalled();
    });
  });

  describe("Market blurbs", () => {
    beforeEach(() =>
      renderGridCard({
        marketBlurb: {
          titleKey: "TITLE_KEY",
          descriptionKey: "DESCRIPTION_KEY",
          signposting: IconsList.NINETY_MINUTE_PAYOUT,
          externalLinkType: "NINETY_MINUTE_RULE",
        },
      }),
    );

    it("should render the MarketBlurb component when marketBlurb is defined", () => {
      expect(ConnectedMarketBlurb).toHaveBeenCalledTimes(2);
      expect(ConnectedMarketBlurb).toHaveBeenCalledWith(
        {
          component: MarketBlurb,
          variant: "super sub",
          titleKey: "TITLE_KEY",
          descriptionKey: "DESCRIPTION_KEY",
          signposting: IconsList.NINETY_MINUTE_PAYOUT,
          externalLinkType: "NINETY_MINUTE_RULE",
        },
        undefined,
      );
    });
  });

  describe("when GridCardLayout is HORIZONTAL_MARKETS", () => {
    it("should render the GridCardRunner component with correct layout", () => {
      renderGridCard();

      expect(GridCardRunner).toHaveBeenCalledTimes(2);
      expect(GridCardRunner).toHaveBeenCalledWith(
        {
          azSwitcherProps: undefined,
          items: [{ label: "Market 1", marketUrn: "ppb:tbd:sbkMarket:924.111", selectionId: 12345 }],
          jersey: undefined,
          hasJerseys: false,
          hasStats: false,
          lineIndex: 0,
          lineLabel: "Runner 1",
          urn: "ppb:tbd:card:grid:12345",
        },
        undefined,
      );
    });
  });

  describe("when GridCardLayout is VERTICAL_MARKETS", () => {
    it("should render the GridCardRunner component with correct layout", () => {
      renderGridCard({ layout: "VERTICAL_MARKETS" });

      expect(GridCardRunner).toHaveBeenCalledTimes(2);
      expect(GridCardRunner).toHaveBeenCalledWith(
        {
          azSwitcherProps: undefined,
          items: [{ label: "Market 1", marketUrn: "ppb:tbd:sbkMarket:924.111", selectionId: 12345 }],
          jersey: undefined,
          hasJerseys: false,
          hasStats: false,
          lineIndex: 0,
          lineLabel: "Runner 1",
          urn: "ppb:tbd:card:grid:12345",
        },
        undefined,
      );
    });

    describe("and isShowMoreAvailable is true", () => {
      it("should render the GridCardRunner component with azSwitcherProps defined", () => {
        useShowMore.mockReturnValueOnce({
          itemsToDisplay: [lineMock],
          isShowMoreAvailable: true,
          isItemsListCollapsed: false,
          onShowMoreChange: expect.any(Function),
        });

        renderGridCard({ layout: "VERTICAL_MARKETS", isShowMoreAvailable: true });

        expect(GridCardRunner).toHaveBeenCalledTimes(2);
        expect(GridCardRunner).toHaveBeenCalledWith(
          {
            azSwitcherProps: {
              callback: expect.any(Function),
              checkboxId: expect.stringMatching(/^ppb:tbd:sbkMarket:924.111-.+$/),
              checkboxName: expect.stringMatching(/^ppb:tbd:sbkMarket:924.111-.+$/),
              isChecked: false,
              isLeftPosition: true,
              text: "A - Z",
            },
            items: [{ label: "Market 1", marketUrn: "ppb:tbd:sbkMarket:924.111", selectionId: 12345 }],
            jersey: undefined,
            hasJerseys: false,
            hasStats: false,
            lineIndex: 0,
            lineLabel: "Runner 1",
            urn: "ppb:tbd:card:grid:12345",
          },
          undefined,
        );
      });
    });
  });

  it("should render showMore button when hiding some lines", () => {
    useShowMore.mockReturnValueOnce({
      itemsToDisplay: [lineMock],
      isShowMoreAvailable: true,
      isItemsListCollapsed: true,
      onShowMoreChange: expect.any(Function),
    });

    renderGridCard({
      numberOfItemsToDisplay: 2,
      lines: [lineMock, lineMock, lineMock],
    });

    expect(ShowMore).toHaveBeenCalledTimes(2);
    expect(ShowMore).toHaveBeenCalledWith(
      {
        cardRef: null,
        numberOfItemsToDisplay: 2,
        numberOfLines: 3,
        setShowMore: expect.any(Function),
        showMore: true,
        onToggleShowMoreRunners: expect.any(Function),
      },
      undefined,
    );
  });

  describe("when ShowMore is toggled", () => {
    it("should call dispatchToggleShowMoreRunners", () => {
      useShowMore.mockReturnValueOnce({
        itemsToDisplay: [lineMock],
        isShowMoreAvailable: true,
        isItemsListCollapsed: true,
        onShowMoreChange: expect.any(Function),
      });

      renderGridCard({
        numberOfItemsToDisplay: 2,
        lines: [lineMock, lineMock, lineMock],
      });

      ShowMore.mock.calls[0][0].onToggleShowMoreRunners(false);

      expect(DEFAULT_PROPS.dispatchToggleShowMoreRunners).toHaveBeenCalledTimes(1);
      expect(DEFAULT_PROPS.dispatchToggleShowMoreRunners).toHaveBeenCalledWith(DEFAULT_PROPS.urn, false, undefined);
    });
  });

  it("should call dispatchRefreshCard on mount", () => {
    useOnIntersect.mockReturnValueOnce({ isIntersecting: true });

    renderGridCard({
      numberOfItemsToDisplay: 2,
      lines: [],
    });

    expect(DEFAULT_PROPS.dispatchRefreshCard).toHaveBeenCalledTimes(2);
    expect(DEFAULT_PROPS.dispatchRefreshCard).toHaveBeenCalledWith("ppb:tbd:card:grid:12345", true);
  });

  it("should call useAlphabeticalSort on mount", () => {
    useShowMore.mockReturnValueOnce({
      itemsToDisplay: [lineMock],
      isShowMoreAvailable: true,
      isItemsListCollapsed: false,
      onShowMoreChange: expect.any(Function),
    });

    renderGridCard({
      layout: "VERTICAL_MARKETS",
      isShowMoreAvailable: true,
      numberOfItemsToDisplay: 2,
    });

    expect(useAlphabeticalSort).toHaveBeenCalledTimes(2);
    expect(useAlphabeticalSort).toHaveBeenCalledWith({
      items: [lineMock],
      sortKey: "label",
      isItemsListCollapsed: false,
      numberOfItemsToDisplay: 2,
      dispatchAzSwitchClick: expect.any(Function),
    });
  });

  describe("Rapid pebble switching", () => {
    it("should handle rapid URN changes without tremor", () => {
      const { rerender } = renderGridCard({
        urn: "pebble-1",
        lines: [lineMock],
      });

      rerender(<GridCard {...DEFAULT_PROPS} urn="pebble-2" lines={[]} />);
      rerender(<GridCard {...DEFAULT_PROPS} urn="pebble-3" lines={[]} />);
      rerender(<GridCard {...DEFAULT_PROPS} urn="pebble-3" lines={[lineMock]} />);

      expect(DEFAULT_PROPS.dispatchRefreshCard).toHaveBeenCalled();
    });
  });

  describe("Show More state consistency", () => {
    it("should maintain Show More state across pebble changes", () => {
      useShowMore.mockReturnValueOnce({
        itemsToDisplay: [lineMock],
        isShowMoreAvailable: true,
        isItemsListCollapsed: true,
        onShowMoreChange: jest.fn(),
      });

      const { rerender } = renderGridCard({
        numberOfItemsToDisplay: 2,
        lines: [lineMock, lineMock, lineMock],
      });

      useShowMore.mockReturnValueOnce({
        itemsToDisplay: [lineMock],
        isShowMoreAvailable: true,
        isItemsListCollapsed: true,
        onShowMoreChange: jest.fn(),
      });

      rerender(<GridCard {...DEFAULT_PROPS} urn="different-pebble" lines={[lineMock, lineMock, lineMock]} />);

      expect(useShowMore).toHaveBeenCalled();
    });
  });
});
