import { render } from "@testing-library/react";
import { LoyaltyMessageModal } from "./LoyaltyMessageModal.web";
import { ModalWeb } from "./Modal/Modal.web";

jest.mock("./Modal/Modal.web", () => ({
  ModalWeb: jest.fn((props) => <modal-mock {...props} />),
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
  dismissOnOutsideTap: expect.any(Boolean),
  children: expect.any(Object),
};

const withOptionalModalProps = {
  title,
  onDismiss,
  dismissOnOutsideTap: expect.any(Boolean),
  children: expect.any(Object),
  imageSrc,
  imageAlt,
  buttonText,
  onTap,
};

describe("LoyaltyMessageModal", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the default props are provided", () => {
    it("should render Modal", () => {
      render(<LoyaltyMessageModal title={title} message={message} onDismiss={onDismiss} />);

      expect(ModalWeb).toHaveBeenCalledWith(defaultModalProps, undefined);
      expect(ModalWeb).toHaveBeenCalledTimes(1);
    });
  });

  describe("when all props are provided", () => {
    it("should render Modal with all the content", () => {
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

      expect(ModalWeb).toHaveBeenCalledWith(withOptionalModalProps, undefined);
      expect(ModalWeb).toHaveBeenCalledTimes(1);
    });
  });

  describe("onInit", () => {
    describe("when onInit prop is provided", () => {
      it("should execute the callback function", () => {
        render(<LoyaltyMessageModal title={title} message={message} onDismiss={onDismiss} onInit={onInit} />);
        expect(onInit).toHaveBeenCalledTimes(1);
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
