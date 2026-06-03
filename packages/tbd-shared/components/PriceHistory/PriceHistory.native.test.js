import { render } from "@testing-library/react-native";
import PriceHistory from "./PriceHistory.native";
import { PRICE_HISTORY } from "./PriceHistory.native.selectors";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderPriceHistory({ previousOdds }) {
  return render(<PriceHistory previousOdds={previousOdds} />);
}

describe("PriceHistory", () => {
  beforeEach(jest.clearAllMocks);

  it("should render correctly", () => {
    const component = renderPriceHistory({
      previousOdds: "1.33 ▸ 1.3 ▸ 1.29",
    });

    expect(component.getByTestId(PRICE_HISTORY)).toHaveTextContent("1.33 ▸ 1.3 ▸ 1.29");
  });
});
