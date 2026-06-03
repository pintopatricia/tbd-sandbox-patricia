import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import SportsbookBetLegCardGroupPlaceholder from "./SportsbookBetLegCardGroupPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <sportsbook-bet-leg-card-group-placeholder />),
}));

describe("SportsbookBetLegCardGroupPlaceholder", () => {
  it("should render a placeholder", () => {
    render(<SportsbookBetLegCardGroupPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
