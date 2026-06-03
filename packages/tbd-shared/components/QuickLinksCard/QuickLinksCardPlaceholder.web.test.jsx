import { render } from "@testing-library/react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import QuickLinksCardPlaceholder from "./QuickLinksCardPlaceholder.web";

jest.mock("@ppb/the-wall-web/components/bricks/Placeholder/Placeholder", () => ({
  Placeholder: jest.fn(() => <quick-links-card-placeholder />),
}));

describe("QuickLinksCardPlaceholder", () => {
  it("should render a Placeholder", () => {
    render(<QuickLinksCardPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
