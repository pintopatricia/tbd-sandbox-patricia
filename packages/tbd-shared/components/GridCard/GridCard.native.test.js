import { render } from "@testing-library/react-native";

import { Alert } from "@ppb/the-wall-native";
import { AlertType } from "@ppb/the-wall-common/types";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import useShowMore from "../../hooks/useShowMore";
import useAlphabeticalSort from "../../hooks/useAlphabeticalSort";
import ConnectedMarketBlurb from "../MarketBlurb";
import MarketBlurb from "../MarketBlurb/MarketBlurb.native";
import ShowMore from "../ShowMore/ShowMore.native";

import { TEST_ID } from "./GridCard.native.selectors";
import styles from "./GridCard.native.styles";
import GridCard from "./GridCard.native";
import GridCardRunner from "./GridCardRunner/GridCardRunner.native";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
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

jest.mock("../MarketBlurb/MarketBlurb.native", () => jest.fn(() => <market-blurb-mock />));

jest.mock("../ShowMore/ShowMore.native", () => jest.fn(() => <show-more-mock />));

jest.mock("./GridCardItem", () => jest.fn(() => <connected-grid-card-item />));

jest.mock("./GridCardRunner/GridCardRunner.native", () => jest.fn(() => <grid-card-runner />));

jest.mock("./GridCardItem/GridCardItem.native", () => jest.fn(() => <grid-card-item />));

const DEFAULT_PROPS = {
  urn: "ppb:tbd:card:grid:12345",
  i18nLabels: { showMore: "Show More", showLess: "Show Less" },
  lines: [lineMock],
  numberOfItemsToDisplay: 5,
  layout: "HORIZONTAL_MARKETS",
  visible: true,
  dispatchToggleShowMoreRunners: jest.fn(),
  dispatchRefreshCard: jest.fn(),
  dispatchAzSwitchClick: jest.fn(),
};

const renderGridCard = (props = {}) => render(<GridCard {...DEFAULT_PROPS} {...props} />);

describe("GridCard", () => {
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

    it("should render the MarketBlurb component when marketBlub is defined", () => {
      expect(ConnectedMarketBlurb).toHaveBeenCalledTimes(1);
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

  it("should draw the grid card container with the appropriate styling", () => {
    const { queryByTestId } = renderGridCard();

    expect(queryByTestId(TEST_ID)).toHaveStyle(styles.container);
  });

  it("should draw the grid card runners", () => {
    useAlphabeticalSort.mockReturnValueOnce({
      itemsToDisplay: [lineMock, { ...lineMock, label: "Runner 2" }],
      isShowMoreAvailable: true,
      isItemsListCollapsed: true,
      onShowMoreChange: expect.any(Function),
    });

    renderGridCard({ lines: [lineMock, { ...lineMock, label: "Runner 2" }] });

    expect(GridCardRunner.mock.calls[0][0]).toEqual({
      azSwitcherProps: undefined,
      items: [{ label: "Market 1", marketUrn: "ppb:tbd:sbkMarket:924.111", selectionId: 12345 }],
      lineIndex: 0,
      lineLabel: "Runner 1",
      linesSize: 2,
      urn: "ppb:tbd:card:grid:12345",
      visible: true,
      jersey: undefined,
      useFallbackJersey: undefined,
      hasJerseys: false,
      hasStats: false,
    });
    expect(GridCardRunner.mock.calls[1][0]).toEqual({
      azSwitcherProps: undefined,
      items: [{ label: "Market 1", marketUrn: "ppb:tbd:sbkMarket:924.111", selectionId: 12345 }],
      lineIndex: 1,
      lineLabel: "Runner 2",
      linesSize: 2,
      urn: "ppb:tbd:card:grid:12345",
      visible: true,
      jersey: undefined,
      useFallbackJersey: undefined,
      hasJerseys: false,
      hasStats: false,
    });
  });

  it("should render showMore button when hiding some lines", () => {
    useShowMore.mockReturnValueOnce({
      itemsToDisplay: [lineMock, lineMock, lineMock],
      isShowMoreAvailable: true,
      isItemsListCollapsed: true,
      onShowMoreChange: jest.fn(),
    });

    useAlphabeticalSort.mockReturnValueOnce({
      azSwitcherLabel: "A - Z",
      isSorted: false,
      itemsToDisplay: [lineMock, lineMock, lineMock],
      onSwitch: jest.fn(),
    });

    renderGridCard({
      numberOfItemsToDisplay: 2,
      lines: [lineMock, lineMock, lineMock],
    });

    expect(ShowMore).toHaveBeenCalledWith(
      {
        cardRef: expect.anything(),
        onToggleShowMoreRunners: expect.any(Function),
        numberOfItemsToDisplay: 2,
        numberOfLines: 3,
        setShowMore: expect.any(Function),
        showMore: true,
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
    const displayRefreshCardMock = jest.fn();

    renderGridCard({
      numberOfItemsToDisplay: 2,
      lines: [],
      dispatchRefreshCard: displayRefreshCardMock,
    });

    expect(displayRefreshCardMock).toHaveBeenCalledWith("ppb:tbd:card:grid:12345", true);
  });

  describe("when the layout type is 'VERTICAL_MARKETS' and the 'ShowMore' is being displayed", () => {
    beforeEach(jest.clearAllMocks);

    it("should call the GridCardRunner with the expected AZSwitcher props", () => {
      const lines = [
        { ...lineMock, label: "Runner C" },
        { ...lineMock, label: "Runner A" },
        { ...lineMock, label: "Runner B" },
      ];

      useShowMore.mockReturnValueOnce({
        itemsToDisplay: lines,
        isShowMoreAvailable: true,
        isItemsListCollapsed: true,
        onShowMoreChange: jest.fn(),
      });

      useAlphabeticalSort.mockReturnValueOnce({
        azSwitcherLabel: "A - Z",
        isSorted: false,
        itemsToDisplay: lines,
        onSwitch: jest.fn(),
      });

      renderGridCard({
        layout: "VERTICAL_MARKETS",
        numberOfItemsToDisplay: 2,
        lines,
      });

      expect(GridCardRunner.mock.calls[0][0].azSwitcherProps).toEqual({
        callback: expect.any(Function),
        isChecked: false,
        isLeftPosition: true,
        text: "A - Z",
      });
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
