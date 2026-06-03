import { render, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";
import Feedback from "./Feedback.web";
import { TEST_ID } from "./Feedback.web.selectors.js";

jest.mock("@ppb/the-wall-icons", () => ({
  AssetsIconName: {
    FEEDBACK: "FEEDBACK_ICON",
  },
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(({ name }) => <span data-testid="mock-icon">{name}</span>),
}));

function renderFeedbackButton({ onFeedbackTap = jest.fn() } = {}) {
  return render(<Feedback onFeedbackTap={onFeedbackTap} />);
}

describe("Feedback Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the button with the correct selector", () => {
    const { getByTestId } = renderFeedbackButton();
    const button = getByTestId(TEST_ID);

    expect(button).toBeInTheDocument();
  });

  it("should render the feedback icon inside the button", () => {
    const { getByTestId } = renderFeedbackButton();
    const icon = getByTestId("mock-icon");

    expect(icon).toHaveTextContent("FEEDBACK_ICON");
  });

  it("should trigger onFeedbackTap when clicked", () => {
    const mockOnFeedbackTap = jest.fn();
    const { getByTestId } = renderFeedbackButton({ onFeedbackTap: mockOnFeedbackTap });
    const button = getByTestId(TEST_ID);
    fireEvent.click(button);

    expect(mockOnFeedbackTap).toHaveBeenCalledTimes(1);
  });
});
