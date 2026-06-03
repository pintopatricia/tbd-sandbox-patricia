import { render } from "@testing-library/react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import SportsbookBetLegCardGroupPlaceholder from "./SportsbookBetLegCardGroupPlaceholder.web";

jest.mock("@ppb/the-wall-web/components/bricks/Placeholder/Placeholder", () => ({
  Placeholder: jest.fn(() => <sportsbook-bet-leg-card-group-placeholder />),
}));

describe("SportsbookBetLegCardGroupPlaceholder", () => {
  it("should render a placeholder", () => {
    render(<SportsbookBetLegCardGroupPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
