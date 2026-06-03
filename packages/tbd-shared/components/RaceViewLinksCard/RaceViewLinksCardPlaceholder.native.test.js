import { render } from "@testing-library/react-native";
import RaceViewLinksCardPlaceholder from "./RaceViewLinksCardPlaceholder.native";

describe("RaceViewLinksCardPlaceholder", () => {
  it("should render correctly", () => {
    const { root } = render(<RaceViewLinksCardPlaceholder />);
    expect(root).not.toBeNull();
  });
});
