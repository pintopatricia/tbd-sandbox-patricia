import "jest-dom/extend-expect";
import { render } from "@testing-library/react-native";
import {
  GenericTable,
  GenericTableBody,
  GenericTableCell,
  GenericTableHead,
  GenericTableHeader,
  GenericTableRow,
  ShowMore,
} from "@ppb/the-wall-native";
import { HorizontalAlign, VerticalAlign } from "@ppb/the-wall-common/types";
import styles from "./StatsTable.native.styles";
import StatsTable from "./StatsTable.native";

jest.mock("@ppb/the-wall-common/types", () => ({
  HorizontalAlign: {
    Left: "LEFT",
    Right: "RIGHT",
  },
  VerticalAlign: {
    Stretch: "STRETCH",
  },
}));

jest.mock("@ppb/the-wall-native", () => ({
  GenericTable: jest.fn(({ children }) => <generic-table-mock>{children}</generic-table-mock>),
  GenericTableBody: jest.fn(({ children }) => <generic-table-body-mock>{children}</generic-table-body-mock>),
  GenericTableCell: jest.fn(({ children }) => <generic-table-cell-mock>{children}</generic-table-cell-mock>),
  GenericTableHead: jest.fn(({ children }) => <generic-table-head-mock>{children}</generic-table-head-mock>),
  GenericTableHeader: jest.fn(({ children }) => <generic-table-header-mock>{children}</generic-table-header-mock>),
  GenericTableRow: jest.fn(({ children }) => <generic-table-row-mock>{children}</generic-table-row-mock>),
  ShowMore: jest.fn(() => <show-more-mock />),
  Text: jest.requireActual("react-native").Text,
}));

const TRANSLATIONS = {
  emptyStateMessageGeneral: "I18N.STATS.NO_STATS_AVAILABLE",
  emptyStateMessageSingleStat: "I18N.STATS.IP_PLAYER_NO_PLAYER_WITH_STATS",
  emptyStateTitle: "I18N.STATS.STATS_UNAVAILABLE",
  lastUpdated: "I18N.STATS.IP_PLAYER_LABEL_UPDATED",
  player: "I18N.STATS.PLAYER",
  showLess: "I18N.SHOW_LESS",
  showMore: "I18N.SHOW_MORE",
  termsConditions: "I18N.STATS.IP_PLAYER_HELP_SUPPORT",
  total: "I18N.STATS.TOTAL",
  viewLess: "I18N.MARKET_PROMO.VIEW_LESS",
  viewMore: "I18N.MARKET_PROMO.VIEW_MORE",
};
const onShowMoreMockFn = jest.fn();

const renderComponent = ({ bodyEntries = [], hasShowMore = false, isShowMoreOpen = false }) =>
  render(
    <StatsTable
      translations={TRANSLATIONS}
      bodyEntries={bodyEntries}
      onShowMore={onShowMoreMockFn}
      hasShowMore={hasShowMore}
      isShowMoreOpen={isShowMoreOpen}
    />,
  );

describe("StatsTable.native", () => {
  afterEach(jest.clearAllMocks);

  describe("when there are no bodyEntries", () => {
    beforeEach(() => {
      renderComponent({});
    });

    it("should call GenericTable with the correct properties", () => {
      expect(GenericTable).toHaveBeenCalledWith(
        {
          scrollEnabled: false,
          children: expect.any(Object),
          style: styles.genericTableContainer,
        },
        undefined,
      );
    });

    it("should call GenericTableHeader with the correct properties", () => {
      expect(GenericTableHeader).toHaveBeenCalledWith(
        {
          hasBackground: false,
          hasBorderRadius: false,
          children: expect.any(Object),
        },
        undefined,
      );
    });

    it("should call GenericTableRow with the correct properties", () => {
      expect(GenericTableRow).toHaveBeenCalledWith(
        {
          children: expect.any(Object),
        },
        undefined,
      );
    });

    it("should call GenericTableHead with the correct properties", () => {
      expect(GenericTableHead).toHaveBeenCalledTimes(2);

      expect(GenericTableHead).toHaveBeenCalledWith(
        {
          textStyle: styles.tableHeaderText,
          horizontalAlign: HorizontalAlign.Left,
          cellPosition: "first",
          hasBackground: true,
          children: TRANSLATIONS.player,
        },
        undefined,
      );

      expect(GenericTableHead).toHaveBeenCalledWith(
        {
          textStyle: styles.tableHeaderText,
          horizontalAlign: HorizontalAlign.Right,
          cellPosition: "last",
          hasBackground: true,
          children: TRANSLATIONS.total,
        },
        undefined,
      );
    });
  });

  describe("when there are bodyEntries", () => {
    const BODY_ENTRIES = [
      {
        id: 1,
        playerName: "Player 1",
        teamName: "Team 1",
        quantity: 1,
      },
      {
        id: 2,
        playerName: "Player 2",
        teamName: "Team 2",
        quantity: 2,
      },
    ];

    beforeEach(() => {
      renderComponent({ bodyEntries: BODY_ENTRIES });
    });

    it("should call GenericTableBody with the correct properties", () => {
      expect(GenericTableBody).toHaveBeenCalledTimes(2);

      expect(GenericTableBody.mock.calls[0][0]).toEqual({
        children: expect.any(Object),
      });

      expect(GenericTableBody.mock.calls[1][0]).toEqual({
        children: expect.any(Object),
      });
    });

    it("should call GenericTableRow with the correct properties", () => {
      // First is from the header tested above
      expect(GenericTableRow).toHaveBeenCalledTimes(4);

      expect(GenericTableRow.mock.calls[1][0]).toEqual({
        verticalAlign: VerticalAlign.Stretch,
        children: expect.any(Object),
      });

      expect(GenericTableRow.mock.calls[2][0]).toEqual({
        style: styles.tableRowSpacing,
      });

      expect(GenericTableRow.mock.calls[3][0]).toEqual({
        verticalAlign: VerticalAlign.Stretch,
        children: expect.any(Object),
      });
    });

    it("should call GenericTableCell with the correct properties", () => {
      expect(GenericTableCell).toHaveBeenCalledTimes(4);

      expect(GenericTableCell.mock.calls[0][0]).toEqual({
        style: [styles.tableCell, styles.tableCellFirstChild],
        cellPosition: "first",
        children: expect.any(Object),
      });

      expect(GenericTableCell.mock.calls[1][0]).toEqual({
        textStyle: styles.total,
        style: styles.tableCell,
        cellPosition: "last",
        children: BODY_ENTRIES[0].quantity,
      });

      expect(GenericTableCell.mock.calls[2][0]).toEqual({
        style: [styles.tableCell, styles.tableCellFirstChild],
        cellPosition: "first",
        children: expect.any(Object),
      });

      expect(GenericTableCell.mock.calls[3][0]).toEqual({
        textStyle: styles.total,
        style: styles.tableCell,
        cellPosition: "last",
        children: BODY_ENTRIES[1].quantity,
      });
    });
  });

  describe("when hasShowMore is true", () => {
    it("should call `ShowMore` with the showMore translation when it's not open", () => {
      renderComponent({
        hasShowMore: true,
        isShowMoreOpen: false,
      });

      expect(ShowMore).toHaveBeenCalledWith(
        {
          onClick: onShowMoreMockFn,
          opened: false,
          text: TRANSLATIONS.showMore,
          isHighlighted: true,
        },
        undefined,
      );
    });

    it("should call `ShowMore` with the showLess translation when it's open", () => {
      renderComponent({
        hasShowMore: true,
        isShowMoreOpen: true,
      });

      expect(ShowMore).toHaveBeenCalledWith(
        {
          onClick: onShowMoreMockFn,
          opened: true,
          text: TRANSLATIONS.showLess,
          isHighlighted: true,
        },
        undefined,
      );
    });
  });
});
