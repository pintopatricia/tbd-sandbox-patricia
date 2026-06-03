import { render } from "@testing-library/react-native";
import { SectionElements } from "../../../UserProfile/snowflakes/SectionElements/SectionElements.native";
import { Footer } from "./Footer.native";

jest.mock("../../../UserProfile/snowflakes/SectionElements/SectionElements.native", () => ({
  SectionElements: jest.fn(({ props }) => <section-elements-mock {...props} />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: { FooterVerticalGapPrimary: {} },
}));

const sectionsMock = [
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
const labelsMock = {
  firstLabel: "Label One",
  secondLabel: "Label Two",
};

const mockOnSectionPressFunction = jest.fn();

function renderFooter({ sections, labels }) {
  return render(<Footer sections={sections} labels={labels} onSectionPress={mockOnSectionPressFunction} />);
}

describe("Footer", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the correct sections", () => {
    renderFooter({ sections: sectionsMock, labels: labelsMock });

    expect(SectionElements).toHaveBeenCalledTimes(1);
    expect(SectionElements).toHaveBeenNthCalledWith(
      1,
      {
        section: sectionsMock[0],
        onSectionPress: expect.any(Function),
        labels: labelsMock,
      },
      undefined,
    );
  });

  describe("when sections are not defined", () => {
    it("should not render sections", () => {
      renderFooter({ sections: undefined, labels: labelsMock });

      expect(SectionElements).toHaveBeenCalledTimes(0);
    });
  });
});
