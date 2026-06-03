import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import QuickLinksCardPlaceholder from "./QuickLinksCardPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <quick-links-card-placeholder />),
}));

describe("QuickLinksCardPlaceholder", () => {
  it("should render a Placeholder", () => {
    render(<QuickLinksCardPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
