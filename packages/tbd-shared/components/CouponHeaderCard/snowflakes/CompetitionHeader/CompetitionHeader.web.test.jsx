import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { CompetitionHeader } from "./CompetitionHeader.web";
import { TITLE, COLUMNS, TITLE_LINK, STATS_COLUMN } from "./CompetitionHeader.web.selectors";

function renderCompetitionHeader({ title, titleLink, columns, onTitleClick }) {
  return render(
    <CompetitionHeader title={title} titleLink={titleLink} columns={columns} onTitleClick={onTitleClick} />,
  );
}

const defaultProps = {
  title: "Fake-title",
  columns: ["fake-column"],
};

describe("Competition Header", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render the component", () => {
    const { container } = renderCompetitionHeader(defaultProps);
    const title = container.querySelector(TITLE);
    const columns = container.querySelector(COLUMNS);

    expect(title).toHaveTextContent("Fake-title");
    expect(columns).toBeDefined();
  });

  describe("Columns", () => {
    let columnsContainer;
    let columnStats;
    let firstColumn;
    let secondColumn;
    let thirdColumn;
    let fourthColumn;

    describe("when columns array is undefined", () => {
      beforeEach(() => {
        const { container } = renderCompetitionHeader({ ...defaultProps, columns: undefined });
        columnsContainer = container.querySelectorAll(COLUMNS);
      });

      it("should not render any column item", () => {
        expect(columnsContainer.length).toBe(0);
      });
    });

    describe("when columns array is empty", () => {
      beforeEach(() => {
        const { container } = renderCompetitionHeader({ ...defaultProps, columns: [] });
        columnsContainer = container.querySelectorAll(COLUMNS);
      });

      it("should not render any column item", () => {
        expect(columnsContainer.length).toBe(0);
      });
    });
    describe("when has three columns", () => {
      beforeEach(() => {
        const { container } = renderCompetitionHeader({ ...defaultProps, columns: ["1", "x", "2"] });
        columnsContainer = container.querySelectorAll(COLUMNS);
        [firstColumn, secondColumn, thirdColumn] = columnsContainer;
      });

      it("should render three column items", () => {
        expect(columnsContainer.length).toBe(3);
      });

      it("should render column with correct content", () => {
        expect(firstColumn).toHaveTextContent("1");
        expect(secondColumn).toHaveTextContent("x");
        expect(thirdColumn).toHaveTextContent("2");
      });
    });

    describe("when has two columns", () => {
      beforeEach(() => {
        const { container } = renderCompetitionHeader({ ...defaultProps, columns: ["yes", "no"] });
        columnsContainer = container.querySelectorAll(COLUMNS);
        [firstColumn, secondColumn] = columnsContainer;
      });

      it("should render two column items", () => {
        expect(columnsContainer.length).toBe(2);
      });

      it("should render label with correct content", () => {
        expect(firstColumn).toHaveTextContent("yes");
        expect(secondColumn).toHaveTextContent("no");
      });

      it("should not render label with column stats", () => {
        expect(columnStats).not.toBeDefined();
      });
    });

    describe("when hasStats is true", () => {
      beforeEach(() => {
        const { container } = renderCompetitionHeader({
          ...defaultProps,
          columns: ["1", "X", "2", "STATS"],
          hasStats: true,
        });
        columnsContainer = container.querySelectorAll(COLUMNS);
        [firstColumn, secondColumn, thirdColumn, fourthColumn] = columnsContainer;

        columnStats = container.querySelector(STATS_COLUMN);
      });

      it("should render two column items", () => {
        expect(columnsContainer.length).toBe(4);
      });

      it("should render label with correct content", () => {
        expect(firstColumn).toHaveTextContent("1");
        expect(secondColumn).toHaveTextContent("X");
        expect(thirdColumn).toHaveTextContent("2");
        expect(fourthColumn).toHaveTextContent("STATS");
      });

      it("should render label with column stats", () => {
        expect(columnStats).toBeDefined();
      });
    });
  });

  describe("when the title has a link", () => {
    let titleLink;
    const onTitleClickMock = jest.fn();

    beforeEach(() => {
      const { container } = renderCompetitionHeader({
        ...defaultProps,
        titleLink: { viewUrl: "football/uefa-champions-league/c-12345", viewUrn: "tbd:competition:12345" },
        onTitleClick: onTitleClickMock,
      });

      titleLink = container.querySelector(TITLE_LINK);
    });

    it("should render the title link", () => {
      expect(titleLink).toHaveTextContent("Fake-title");
    });

    it("should add the correct href attribute to the link", () => {
      expect(titleLink.getAttribute("href")).toBe("football/uefa-champions-league/c-12345");
    });

    describe("and the title is clicked", () => {
      beforeEach(() => {
        titleLink.click();
      });

      it("should call onTitleClick callback", () => {
        expect(onTitleClickMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
