import { render } from "@testing-library/react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import RegulatoryCardPlaceholder from "./RegulatoryCardPlaceholder.web";

jest.mock("@ppb/the-wall-web/components/bricks/Placeholder/Placeholder", () => ({
  Placeholder: jest.fn(() => <regulatory-card-placeholder />),
}));

describe("RegulatoryCardPlaceholder", () => {
  it("should render a placeholder", () => {
    render(<RegulatoryCardPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
