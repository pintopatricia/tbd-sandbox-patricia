import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import ObbCardGroupPlaceholder from "./ObbCardGroupPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  Placeholder: jest.fn(() => <placeholder-mock />),
}));

describe("ObbCardGroupPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call Placeholder component 3 times", () => {
    render(<ObbCardGroupPlaceholder />);
    expect(Placeholder).toHaveBeenCalledTimes(6);
  });
});
