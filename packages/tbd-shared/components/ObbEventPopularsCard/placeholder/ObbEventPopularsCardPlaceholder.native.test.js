import React from "react";
import { render } from "@testing-library/react-native";
import { Placeholder, Divider, ScrollableSwimlane } from "@ppb/the-wall-native";
import ObbEventPopularsCardPlaceholder from "./ObbEventPopularsCardPlaceholder.native";

jest.mock("@ppb/the-wall-native", () => ({
  ScrollableSwimlane: jest.fn(({ children }) => (
    <scrollable-swimlane-mock testID="scrollable-swimlane">{children}</scrollable-swimlane-mock>
  )),
  Divider: jest.fn(() => <divider-mock />),
  Placeholder: jest.fn(() => <placeholder-mock />),
}));

describe("ObbEventPopularsCardPlaceholder", () => {
  it("should render the obb event populars card placeholder", () => {
    render(<ObbEventPopularsCardPlaceholder />);

    expect(Placeholder).toHaveBeenCalledTimes(9);
    expect(Divider).toHaveBeenCalledTimes(2);
  });
});
