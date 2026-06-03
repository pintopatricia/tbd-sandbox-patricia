import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { CounterColor, CounterSize } from "@ppb/the-wall-common/types";
import { Counter, ActionLink } from "@ppb/the-wall-web";
import { CounterAggregator } from "./CounterAggregator.web";

jest.mock("@ppb/the-wall-web", () => ({
  Counter: jest.fn(() => <counter-mock />),
  ActionLink: jest.fn(() => <action-link-mock />),
}));

function renderCounterAggregator({ count, title, subtitle, defaultExpanded, buttonText, onButtonTap, children } = {}) {
  return render(
    <CounterAggregator
      count={count}
      title={title}
      subtitle={subtitle}
      defaultExpanded={defaultExpanded}
      buttonText={buttonText}
      onButtonTap={onButtonTap}
    >
      {children}
    </CounterAggregator>,
  );
}

describe("CounterAggregator", () => {
  beforeEach(jest.clearAllMocks);

  describe("count", () => {
    it("Collapse header should call Counter", () => {
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
    it("Collapse header should have title", () => {
      const title = "AMAZING TITLE";
      const { queryByText } = renderCounterAggregator({ title });

      expect(queryByText(title)).not.toBeNull();
    });
  });

  describe("subtitle", () => {
    it("Collapse header should have subtitle", () => {
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
              stopPropagate: true,
            },
            undefined,
          );
        });
      });
    });
  });
});
