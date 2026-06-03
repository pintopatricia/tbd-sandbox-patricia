import { render } from "@testing-library/react-native";
import { Placeholder, Divider } from "@ppb/the-wall-native";
import ObbCreatedBetsCardPlaceholder from "./ObbCreatedBetsCardPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  Divider: jest.fn(() => <divider-mock />),
  Placeholder: jest.fn(() => <placeholder-mock />),
}));

describe("ObbCreatedBetsCardPlaceholder", () => {
  it("should render the obb created bets card placeholder", () => {
    render(<ObbCreatedBetsCardPlaceholder />);

    expect(Placeholder).toHaveBeenCalledTimes(11);
    expect(Divider).toHaveBeenCalledTimes(2);
  });
});
