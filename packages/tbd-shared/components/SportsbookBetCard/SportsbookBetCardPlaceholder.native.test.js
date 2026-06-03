import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import SportsbookBetCardPlaceholder from "./SportsbookBetCardPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <sportsbook-bet-card-placeholder />),
}));

describe("SportsbookBetCardPlaceholder", () => {
  it("should render a Placeholder", () => {
    render(<SportsbookBetCardPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
