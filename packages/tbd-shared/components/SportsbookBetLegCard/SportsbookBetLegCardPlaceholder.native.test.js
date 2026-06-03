import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import SportsbookBetLegCardPlaceholder from "./SportsbookBetLegCardPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <sportsbook-bet-leg-card-placeholder />),
}));

describe("SportsbookBetLegCardPlaceholder", () => {
  it("should render a placeholder", () => {
    render(<SportsbookBetLegCardPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
