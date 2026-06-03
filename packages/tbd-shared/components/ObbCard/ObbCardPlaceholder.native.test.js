import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import ObbCardPlaceholder from "./ObbCardPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <placeholder-mock />),
}));

describe("Obb Card Placeholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the obb card placeholder", () => {
    render(<ObbCardPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
