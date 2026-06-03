import { Text } from "react-native";

import { render } from "@testing-library/react-native";

import { CounterColor } from "@ppb/the-wall-common/types";

import { Counter } from "@ppb/the-wall-native";
import { Minimized } from "./Minimized.native";
import { MINIMIZED, MINIMIZED_TITLE } from "./Minimized.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  Counter: jest.fn(() => <counter-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    MinimizedPadding: {},
    MinimizedHorizontalGapPrimary: {},
  },
}));

function renderMinimized({ counter = 1, title = "title", color = CounterColor.Black } = {}) {
  return render(
    <Minimized counter={counter} color={color}>
      <Text>{title}</Text>
    </Minimized>,
  );
}

describe("Minimized", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the component", () => {
    const selectors = renderMinimized();
    const component = selectors.queryByTestId(MINIMIZED);

    expect(component).toBeDefined();
  });

  it("should render the Counter component with proper values", () => {
    renderMinimized();

    expect(Counter).toHaveBeenCalledWith(
      {
        color: CounterColor.Black,
        value: 1,
      },
      undefined,
    );
  });

  it("should render the title", () => {
    const selectors = renderMinimized();
    const title = selectors.queryByTestId(MINIMIZED_TITLE);

    expect(title).toHaveTextContent("title");
  });

  describe("color", () => {
    it("should use provided color", () => {
      renderMinimized({ color: CounterColor.BlackAlternative });

      expect(Counter).toHaveBeenCalledWith(
        {
          color: CounterColor.BlackAlternative,
          value: 1,
        },
        undefined,
      );
    });
  });

  describe("counter", () => {
    it("should call Counter with the provided counter value", () => {
      renderMinimized({ counter: 3 });

      expect(Counter).toHaveBeenCalledWith(
        {
          color: CounterColor.Black,
          value: 3,
        },
        undefined,
      );
    });
  });
});
