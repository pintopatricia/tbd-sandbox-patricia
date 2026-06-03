import { fireEvent, render } from "@testing-library/react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { Feedback } from "./Feedback.native";
import { FEEDBACK_BUTTON } from "./Feedback.native.selectors";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

function renderFeedback({ onFeedbackTap = () => {} }) {
  return render(<Feedback onFeedbackTap={onFeedbackTap} />);
}

describe("Feedback", () => {
  beforeEach(jest.clearAllMocks);

  it("should call the components with correct props", () => {
    renderFeedback({});

    expect(GenericIcon).toHaveBeenCalledWith({ name: AssetsIconName.FEEDBACK }, undefined);
  });

  describe("when the feedback button is clicked", () => {
    it("should call the onFeedbackTap callback", () => {
      const onFeedbackTap = jest.fn();

      const { queryByTestId } = renderFeedback({ onFeedbackTap });
      const button = queryByTestId(FEEDBACK_BUTTON);

      fireEvent.press(button);

      expect(onFeedbackTap).toHaveBeenCalledTimes(1);
    });
  });
});
