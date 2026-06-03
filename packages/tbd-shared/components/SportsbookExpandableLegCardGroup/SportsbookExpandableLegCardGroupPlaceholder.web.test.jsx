import { render } from "@testing-library/react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import SportsbookExpandableLegCardGroupPlaceholder from "./SportsbookExpandableLegCardGroupPlaceholder.web";

jest.mock("@ppb/the-wall-web/components/bricks/Placeholder/Placeholder", () => ({
  Placeholder: jest.fn(() => <sportsbook-expandable-leg-card-group-placeholder />),
}));

describe("SportsbookExpandableLegCardGroupPlaceholder", () => {
  it("should render a placeholder", () => {
    render(<SportsbookExpandableLegCardGroupPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
