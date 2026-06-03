import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import RegulatoryCardPlaceholder from "./RegulatoryCardPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <regulatory-card-placeholder />),
}));

describe("RegulatoryCardPlaceholder", () => {
  it("should render a placeholder", () => {
    render(<RegulatoryCardPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
