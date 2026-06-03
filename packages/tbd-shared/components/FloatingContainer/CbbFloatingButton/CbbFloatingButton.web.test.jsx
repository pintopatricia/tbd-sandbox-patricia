import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import CbbFloatingButton from "./CbbFloatingButton.web";
import styles from "./CbbFloatingButton.web.css";

let inputStateChangedCallback;
jest.mock("../../../event-broker/event-subscriber", () =>
  jest.fn((event, callback) => {
    if (event === "@@UI/SPORTSBOOK_CHATBOT_INPUT_STATE_CHANGED") {
      inputStateChangedCallback = callback;
    }
  }),
);

jest.mock(
  "@ppb/tbd-components-sports-betting/components/SportsbookChatbotInput/view/SportsbookChatbotInput.web",
  // eslint-disable-next-line react/display-name
  () => () => <div data-testid="sportsbook-chatbot-input" />,
);

function renderCbbFloatingButton(props = {}) {
  return render(<CbbFloatingButton betslipHasSelections={false} urn="urn:test:cbb:123" {...props} />);
}

describe("CbbFloatingButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    inputStateChangedCallback = undefined;
  });

  it("should render the CBB content", () => {
    const { getByTestId } = renderCbbFloatingButton();

    expect(getByTestId("sportsbook-chatbot-input")).toBeInTheDocument();
  });

  it("should not apply the betslip offset class when betslipHasSelections is false", () => {
    const { container } = renderCbbFloatingButton({ betslipHasSelections: false });

    expect(container.firstChild).not.toHaveClass(styles.withBetslipSelections);
  });

  it("should apply the betslip offset class when betslipHasSelections is true", () => {
    const { container } = renderCbbFloatingButton({ betslipHasSelections: true });

    expect(container.firstChild).toHaveClass(styles.withBetslipSelections);
  });

  describe("gradient background", () => {
    it("should not render the gradient when chatbot input is inactive", () => {
      const { container } = renderCbbFloatingButton();

      expect(container.firstChild).not.toHaveClass(styles.withGradient);
    });

    it("should render the gradient when chatbot input becomes active", () => {
      const { container } = renderCbbFloatingButton();

      act(() => {
        inputStateChangedCallback({ state: "active" });
      });

      expect(container.firstChild).toHaveClass(styles.withGradient);
    });

    it("should hide the gradient when chatbot input becomes inactive again", () => {
      const { container } = renderCbbFloatingButton();

      act(() => {
        inputStateChangedCallback({ state: "active" });
      });
      act(() => {
        inputStateChangedCallback({ state: "inactive" });
      });

      expect(container.firstChild).not.toHaveClass(styles.withGradient);
    });
  });
});
