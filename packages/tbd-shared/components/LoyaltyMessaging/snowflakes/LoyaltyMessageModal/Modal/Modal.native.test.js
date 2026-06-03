import { Text, TouchableOpacity } from "react-native";
import { render, fireEvent } from "@testing-library/react-native";
import { ModalNative } from "./Modal.native";
import { OVERLAY, ACTION_LINK, PRIMARY_BUTTON, MODAL } from "./Modal.native.selectors";

const touchableOpacity = ({ label, onTap }) => (
  <TouchableOpacity onPress={onTap}>
    <Text>{label}</Text>
  </TouchableOpacity>
);
jest.mock("@ppb/the-wall-native", () => ({
  PrimaryButton: touchableOpacity,
  Text: jest.requireActual("react-native").Text,
}));

describe("ModalNative component", () => {
  const onDismiss = jest.fn();
  const onTap = jest.fn();

  const renderModal = (props = {}) =>
    render(
      <ModalNative title="Modal Title" onDismiss={onDismiss} buttonText="Click Me" onTap={onTap} {...props}>
        <Text>Modal Content</Text>
      </ModalNative>,
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render the modal", () => {
    const { getByTestId } = renderModal();
    expect(getByTestId(MODAL)).toBeTruthy();
  });

  describe('when clicking on the "close" button', () => {
    it("must call the onDismiss callback", () => {
      const { getByTestId } = renderModal();
      const dismissLink = getByTestId(ACTION_LINK).children[0];
      fireEvent.press(dismissLink);
      expect(onDismiss).toHaveBeenCalledTimes(1);
    });
  });

  describe("when clicking outside of the Modal", () => {
    describe("and dismissOnOutsideTap prop is true", () => {
      it("must call the onDismiss callback", () => {
        const { getByTestId } = renderModal();
        const overlay = getByTestId(OVERLAY).children[0];
        fireEvent.press(overlay);
        expect(onDismiss).toHaveBeenCalledTimes(1);
      });
    });

    describe("and dismissOnOutsideTap prop is false", () => {
      it("must not call the onDismiss callback", () => {
        const { getByTestId } = renderModal({ dismissOnOutsideTap: false });
        const overlay = getByTestId(OVERLAY).children[0];
        fireEvent.press(overlay);
        expect(onDismiss).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe("when the primary button is clicked", () => {
    it("onTap should be called", () => {
      const { getByTestId } = renderModal();
      const primaryButton = getByTestId(PRIMARY_BUTTON).children[0].children[0];
      fireEvent.press(primaryButton);
      expect(onTap).toHaveBeenCalledTimes(1);
    });
  });
});
