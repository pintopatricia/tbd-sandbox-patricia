import { render, fireEvent } from "@testing-library/react-native";
import { CompetitionHeader } from "./CompetitionHeader.native";
import {
  COMPETITION_HEADER_CONTAINER,
  TITLE,
  TITLE_LINK,
  COLUMN_CONTENT,
  COLUMN_LABEL,
} from "./CompetitionHeader.native.selectors";
import styles from "./CompetitionHeader.native.styles";

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    CompetitionHeaderContainerSizing: {},
    CompetitionHeaderPadding: {},
    CompetitionHeaderDefaultBackgroundColour: {},
    CompetitionHeaderDefaultTextTitleColour: {},
    CompetitionHeaderDefaultTitleTypography: {},
    CompetitionHeaderHorizontalGapPrimary: {},
    CompetitionHeaderColumnSizing: {},
    CompetitionHeaderColumnBorder: {},
    CompetitionHeaderDefaultTextContentTextColour: {},
    CompetitionHeaderContentTextTypography: {},
  },
}));

function renderCompetitionHeader({ title, columns, onTitleClick, hasStats = false }) {
  return render(<CompetitionHeader title={title} columns={columns} onTitleClick={onTitleClick} hasStats={hasStats} />);
}

const defaultProps = {
  title: "Fake-title",
  columns: ["fake-column"],
};

describe("Competition Header", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render component title", () => {
    const { queryByTestId } = renderCompetitionHeader(defaultProps);
    const container = queryByTestId(COMPETITION_HEADER_CONTAINER);
    const title = queryByTestId(TITLE);

    expect(container).toBeDefined();
    expect(title).toHaveTextContent("Fake-title");
  });

  describe("Columns", () => {
    let columnsContainer;
    let columnsLabel;

    describe("when columns array is undefined", () => {
      beforeEach(() => {
        const { queryAllByTestId } = renderCompetitionHeader({ ...defaultProps, columns: undefined });
        columnsContainer = queryAllByTestId(COLUMN_CONTENT);
        columnsLabel = queryAllByTestId(COLUMN_LABEL);
      });

      it("should not render any column item", () => {
        expect(columnsContainer.length).toBe(0);
      });
    });

    describe("when columns array is empty", () => {
      beforeEach(() => {
        const { queryAllByTestId } = renderCompetitionHeader({ ...defaultProps, columns: [] });
        columnsContainer = queryAllByTestId(COLUMN_CONTENT);
        columnsLabel = queryAllByTestId(COLUMN_LABEL);
      });

      it("should not render any column item", () => {
        expect(columnsContainer.length).toBe(0);
      });
    });
    describe("when has three columns", () => {
      beforeEach(() => {
        const { queryAllByTestId } = renderCompetitionHeader({ ...defaultProps, columns: ["1", "x", "2"] });
        columnsContainer = queryAllByTestId(COLUMN_CONTENT);
        columnsLabel = queryAllByTestId(COLUMN_LABEL);
      });

      it("should render three column items", () => {
        expect(columnsContainer.length).toBe(3);
      });

      it("should have firstColumn style in the first one", () => {
        expect(columnsContainer[0]).toHaveStyle(styles.firstColumn);
      });

      it("should render label with correct content", () => {
        expect(columnsLabel[0]).toHaveTextContent("1");
        expect(columnsLabel[1]).toHaveTextContent("x");
        expect(columnsLabel[2]).toHaveTextContent("2");
      });
    });

    describe("when has two columns", () => {
      beforeEach(() => {
        const { queryAllByTestId } = renderCompetitionHeader({ ...defaultProps, columns: ["yes", "no"] });
        columnsContainer = queryAllByTestId(COLUMN_CONTENT);
        columnsLabel = queryAllByTestId(COLUMN_LABEL);
      });

      it("should have firstColumn styles in the first one", () => {
        expect(columnsContainer[0]).toHaveStyle(styles.firstColumn);
      });

      it("should render two column items", () => {
        expect(columnsLabel.length).toBe(2);
      });

      it("should render label with correct content", () => {
        expect(columnsLabel[0]).toHaveTextContent("yes");
        expect(columnsLabel[1]).toHaveTextContent("no");
      });
    });

    describe("when it has stats and 4 columns", () => {
      beforeEach(() => {
        const { queryAllByTestId } = renderCompetitionHeader({
          ...defaultProps,
          columns: ["1", "x", "2", "Stats"],
          hasStats: true,
        });
        columnsContainer = queryAllByTestId(COLUMN_CONTENT);
        columnsLabel = queryAllByTestId(COLUMN_LABEL);
      });

      it("should have firstColumn styles in the first one", () => {
        expect(columnsContainer[0]).toHaveStyle(styles.firstColumn);
      });

      it("should have lastColumn styles in the last one", () => {
        expect(columnsContainer[3]).toHaveStyle(styles.lastColumn);
      });

      it("should render four column items", () => {
        expect(columnsLabel.length).toBe(4);
      });

      it("should render labels with correct content", () => {
        expect(columnsLabel[0]).toHaveTextContent("1");
        expect(columnsLabel[1]).toHaveTextContent("x");
        expect(columnsLabel[2]).toHaveTextContent("2");
        expect(columnsLabel[3]).toHaveTextContent("Stats");
      });
    });
  });

  describe("when onTitleClick is provided", () => {
    let titleLink;
    const onTitleClickMock = jest.fn();

    beforeEach(() => {
      const { queryByTestId } = renderCompetitionHeader({
        ...defaultProps,
        onTitleClick: onTitleClickMock,
      });

      titleLink = queryByTestId(TITLE_LINK);
    });

    it("should render the title link", () => {
      expect(titleLink).toHaveTextContent("Fake-title");
    });

    describe("and the title is pressed", () => {
      beforeEach(() => {
        fireEvent.press(titleLink);
      });

      it("should call onTitleClick callback", () => {
        expect(onTitleClickMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
