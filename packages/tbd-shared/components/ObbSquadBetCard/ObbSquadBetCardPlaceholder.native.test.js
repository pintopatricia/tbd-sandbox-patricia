import { render } from "@testing-library/react-native";
import { Placeholder } from "@ppb/the-wall-native";
import ObbSquadBetCardPlaceholder from "./ObbSquadBetCardPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn(({ children }) => <card-mock>{children}</card-mock>),
  Divider: jest.fn(() => <divider-mock />),
  Placeholder: jest.fn(() => <placeholder-mock />),
}));

describe("ObbSquadBetCardPlaceholder", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the obb card placeholder", () => {
    render(<ObbSquadBetCardPlaceholder />);
    expect(Placeholder).toHaveBeenCalled();
  });
});
