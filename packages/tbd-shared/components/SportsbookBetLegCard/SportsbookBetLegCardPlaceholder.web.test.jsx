import { render } from "@testing-library/react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import SportsbookBetLegCardPlaceholder from "./SportsbookBetLegCardPlaceholder.web";

jest.mock("@ppb/the-wall-web/components/bricks/Placeholder/Placeholder", () => ({
  Placeholder: jest.fn(() => <sportsbook-bet-leg-card-placeholder />),
}));

describe("SportsbookBetLegCardPlaceholder", () => {
  it("should render a placeholder", () => {
    render(<SportsbookBetLegCardPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
