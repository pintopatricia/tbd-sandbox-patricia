import { render, waitFor } from "@testing-library/react-native";
import { LoyaltyMessageModal } from "./LoyaltyMessageModal.native";
import { ModalNative } from "./Modal/Modal.native";

jest.mock("./Modal/Modal.native", () => ({
  ModalNative: jest.fn((props) => <modal-native-mock {...props} />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const title = "Some title";
const message = "Some message";
const onDismiss = jest.fn();
const buttonText = "Some text";
const onTap = jest.fn();
const onInit = jest.fn();
const tcText = "T&C Apply";
const tcUrl = "https://promotions.betfair.com";
const onTcClick = jest.fn();
const imageSrc = "some src";
const imageAlt = "some alt";

const defaultModalProps = {
  title,
  onDismiss,
  dismissOnOutsideTap: false,
  children: expect.any(Object),
};

const withOptionalModalProps = {
  title,
  onDismiss,
  dismissOnOutsideTap: false,
  children: expect.any(Object),
  imageSrc,
  imageAlt,
  buttonText,
  onTap,
};

describe("LoyaltyMessageModal", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the default props are provided", () => {
    it("should render ModalNative", () => {
      render(<LoyaltyMessageModal title={title} message={message} onDismiss={onDismiss} />);

      expect(ModalNative).toHaveBeenCalledWith(defaultModalProps, undefined);
      expect(ModalNative).toHaveBeenCalledTimes(1);
    });
  });

  describe("when all props are provided", () => {
    it("should render ModalNative with all the content", () => {
      const optionalProps = {
        buttonText,
        onTap,
        tcText,
        tcUrl,
        onTcClick,
        imageSrc,
        imageAlt,
      };
      render(<LoyaltyMessageModal title={title} message={message} onDismiss={onDismiss} {...optionalProps} />);

      expect(ModalNative).toHaveBeenCalledWith(withOptionalModalProps, undefined);
      expect(ModalNative).toHaveBeenCalledTimes(1);
    });
  });

  describe("onInit", () => {
    describe("when onInit prop is provided", () => {
      it("should execute the callback function", async () => {
        render(<LoyaltyMessageModal title={title} message={message} onDismiss={onDismiss} onInit={onInit} />);
        await waitFor(() => expect(onInit).toHaveBeenCalledTimes(1));
      });
    });

    describe("when onInit prop is not provided", () => {
      it("should not execute the callback function", () => {
        render(<LoyaltyMessageModal title={title} message={message} onDismiss={onDismiss} />);
        expect(onInit).toHaveBeenCalledTimes(0);
      });
    });
  });
});
