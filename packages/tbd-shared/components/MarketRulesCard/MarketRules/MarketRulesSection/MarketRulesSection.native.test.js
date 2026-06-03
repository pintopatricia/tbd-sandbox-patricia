import { render } from "@testing-library/react-native";
import { MarketRulesSection } from "./MarketRulesSection.native";
import { MARKET_RULES_SECTION, TITLE } from "./MarketRulesSection.native.selectors";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

function renderMarketRulesSection(props) {
  return render(<MarketRulesSection {...props} />);
}

describe("MarketRulesSection", () => {
  describe("when the component is rendered", () => {
    let container;
    let title;

    beforeEach(() => {
      const { getByTestId } = renderMarketRulesSection({ name: "Name" });
      container = getByTestId(MARKET_RULES_SECTION);
      title = getByTestId(TITLE);
    });

    it("should render the container", () => {
      expect(container).toBeDefined();
    });

    it("should render the title correctly", () => {
      expect(title).not.toBeNull();
      expect(title).toHaveTextContent("Name");
    });
  });
});
