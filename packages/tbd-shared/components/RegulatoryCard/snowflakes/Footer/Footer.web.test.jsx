import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { SectionElements } from "../../../UserProfile/snowflakes/SectionElements/SectionElements.web";
import { Footer } from "./Footer.web";

jest.mock("../../../UserProfile/snowflakes/SectionElements/SectionElements.web", () => ({
  SectionElements: jest.fn(({ props }) => <section-elements-mock {...props} />),
}));

const mockOnSectionClickFunction = jest.fn();

function renderFooter({ sections, labels, onSectionClick = mockOnSectionClickFunction } = {}) {
  return render(<Footer sections={sections} onSectionClick={onSectionClick} labels={labels} />);
}

describe("Footer", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render the correct sections", () => {
    const sections = [
      {
        sectionType: "GENERIC",
        bgColor: "",
        textColor: "",
        title: "About Betfair",
        items: [
          {
            type: "TEXT",
            alignment: "left",
            text: "Online Betting",
          },
        ],
      },
    ];
    const labels = {
      firstLabel: "Label One",
      secondLabel: "Label Two",
    };

    renderFooter({ sections, labels });

    expect(SectionElements).toHaveBeenCalledTimes(1);
    expect(SectionElements).toHaveBeenNthCalledWith(
      1,
      {
        section: sections[0],
        onSectionClick: expect.any(Function),
        labels,
      },
      undefined,
    );
  });
});
