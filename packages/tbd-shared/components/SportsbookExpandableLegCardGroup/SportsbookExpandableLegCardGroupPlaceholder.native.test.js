import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import SportsbookExpandableLegCardGroupPlaceholder from "./SportsbookExpandableLegCardGroupPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <sportsbook-expandable-leg-card-group-placeholder />),
}));

describe("SportsbookExpandableLegCardGroupPlaceholder", () => {
  it("should render a placeholder", () => {
    render(<SportsbookExpandableLegCardGroupPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
