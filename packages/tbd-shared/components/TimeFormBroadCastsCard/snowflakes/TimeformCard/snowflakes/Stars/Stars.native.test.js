import { render } from "@testing-library/react-native";
import { Stars } from "./Stars.native";
import { STAR_FILLED, STAR_OUTLINE, STARS } from "./Stars.native.selectors";

jest.mock("react-native-svg", () => ({ SvgCssUri: jest.fn(() => <svg-css-uri-mock />) }));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
  colors: {
    AgnosticSignpostingGenerosityIconDefault: "#FFB80C",
    AgnosticNeutralsIconDisabled: "#B4B4B8",
  },
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

function renderStars({ filled, outline }) {
  return render(<Stars filled={filled} outline={outline} />);
}

describe("Stars", () => {
  it("should render the Stars", () => {
    const { queryByTestId } = renderStars({ filled: 1, outline: 4 });
    const starsComponent = queryByTestId(STARS);

    expect(starsComponent).not.toBe(null);
  });

  it("should render one filled Star", () => {
    const { queryAllByTestId } = renderStars({ filled: 1, outline: 4 });
    const filledStars = queryAllByTestId(STAR_FILLED);

    expect(filledStars.length).toBe(1);
  });

  it("should render four outline Star", () => {
    const { queryAllByTestId } = renderStars({ filled: 1, outline: 4 });
    const outlineStars = queryAllByTestId(STAR_OUTLINE);

    expect(outlineStars.length).toBe(4);
  });

  describe("when the filled and outline stars are 0", () => {
    it("should not render any stars", () => {
      const { queryByTestId } = renderStars({ filled: 0, outline: 0 });
      const filledStar = queryByTestId(STAR_FILLED);
      const outlineStar = queryByTestId(STAR_FILLED);

      expect(filledStar).toBe(null);
      expect(outlineStar).toBe(null);
    });
  });
});
