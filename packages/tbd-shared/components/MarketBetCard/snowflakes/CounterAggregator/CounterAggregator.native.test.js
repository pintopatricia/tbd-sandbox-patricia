import { render } from "@testing-library/react-native";
import { CounterColor, CounterSize } from "@ppb/the-wall-common/types";
import { Counter, ActionLink } from "@ppb/the-wall-native";
import { CounterAggregator } from "./CounterAggregator.native";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  gutters: {},
  spacings: {},
  typography: {},
  tokens: { CounterAggregatorVerticalGap: {}, CounterAggregatorHorizontalGapSecondary: {} },
}));

jest.mock("@ppb/the-wall-native", () => ({
  Counter: jest.fn(() => <counter-mock />),
  ActionLink: jest.fn(() => <action-link-mock />),
  Text: jest.requireActual("react-native").Text,
}));

function renderCounterAggregator({ count, title, subtitle, buttonText, onButtonTap } = {}) {
  return render(
    <CounterAggregator
      count={count}
      title={title}
      subtitle={subtitle}
      buttonText={buttonText}
      onButtonTap={onButtonTap}
    />,
  );
}

describe("CounterAggregator", () => {
  beforeEach(jest.clearAllMocks);

  describe("count", () => {
    it("should call Collapse header with Counter", () => {
      const count = 42;
      renderCounterAggregator({ count });

      expect(Counter).toHaveBeenCalledWith(
        {
          value: count,
          color: CounterColor.Yellow,
          size: CounterSize.Small,
        },
        undefined,
      );
      expect(Counter).toHaveBeenCalledTimes(1);
    });
  });

  describe("title", () => {
    it("should call Collapse header with title", () => {
      const title = "AMAZING TITLE";
      const { queryByText } = renderCounterAggregator({ title });

      expect(queryByText(title)).not.toBeNull();
    });
  });

  describe("subtitle", () => {
    it("should call Collapse header with subtitle", () => {
      const subtitle = "SUBTITLE";
      const { queryByText } = renderCounterAggregator({ subtitle });

      expect(queryByText(subtitle)).not.toBeNull();
    });
  });

  describe("button", () => {
    describe("when button text is not defined", () => {
      it("should not render ActionLink", () => {
        renderCounterAggregator({ title: "button" });

        expect(ActionLink).not.toHaveBeenCalled();
      });
    });

    describe("when button text is defined", () => {
      describe("when onButtonTap is not defined", () => {
        it("should not render ActionLink", () => {
          renderCounterAggregator({ buttonText: "button" });

          expect(ActionLink).not.toHaveBeenCalled();
        });
      });

      describe("when onButtonTap is defined", () => {
        it("should render ActionLink", () => {
          renderCounterAggregator({ buttonText: "button", onButtonTap: jest.fn() });

          expect(ActionLink).toHaveBeenCalledTimes(1);
          expect(ActionLink).toHaveBeenCalledWith(
            {
              text: "button",
              onClick: expect.any(Function),
              noPadding: true,
            },
            undefined,
          );
        });
      });
    });
  });
});
