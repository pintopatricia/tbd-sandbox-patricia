import { render } from "@testing-library/react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import SportsbookBetCardPlaceholder from "./SportsbookBetCardPlaceholder.web";

jest.mock("@ppb/the-wall-web/components/bricks/Placeholder/Placeholder", () => ({
  Placeholder: jest.fn(() => <sportsbook-bet-card-placeholder />),
}));

describe("SportsbookBetCardPlaceholder", () => {
  it("should render a Placeholder", () => {
    render(<SportsbookBetCardPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
