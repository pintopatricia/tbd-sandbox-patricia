import { act, render } from "@testing-library/react";

import { Modal, Styled } from "@ppb/the-wall-web";

import {
  MODAL_CONTENT,
  MODAL_CONTENT_HEADER_TITLE,
  WARNING_MESSAGE_TITLE,
} from "./RegulatoryWarningModal.web.selectors";
import RegulatoryWarningModal from "./RegulatoryWarningModal.web";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
  IconsList: {
    SAFER_GAMBLING: "SAFER_GAMBLING",
  },
}));

jest.mock("@ppb/the-wall-web", () => ({
  Modal: jest.fn(({ children }) => <modal-mock>{children}</modal-mock>),
  Styled: jest.fn((props) => <mock-styled {...props} />),
}));

const DEFAULT_PROPS = {
  labels: {
    modalTitle: "Safer Gambling",
    modalContentHeaderTitle: "Play responsibly",
    warningMessageTitle: "Gambling addiction is a risk of gambling.",
    warningMessageText: "Only for persons aged 18 and over.",
  },
  warningMessageLink: "https://www.juegoseguro.es/",
};

const renderRegulatoryWarningModal = (props = {}) => render(<RegulatoryWarningModal {...DEFAULT_PROPS} {...props} />);

describe("RegulatoryWarningModal", () => {
  beforeEach(jest.clearAllMocks);

  it("should render warning message content", () => {
    const { container } = renderRegulatoryWarningModal();

    expect(container.querySelector(MODAL_CONTENT)).not.toBeNull();
    expect(container.querySelector(MODAL_CONTENT_HEADER_TITLE).textContent).toBe(
      DEFAULT_PROPS.labels.modalContentHeaderTitle,
    );
    expect(container.querySelector(WARNING_MESSAGE_TITLE).textContent).toBe(DEFAULT_PROPS.labels.warningMessageTitle);
  });

  it("should style the warningMessageText translation link", () => {
    renderRegulatoryWarningModal();

    expect(Styled).toHaveBeenCalledWith(
      {
        translation: DEFAULT_PROPS.labels.warningMessageText,
        customRender: {
          link: expect.any(Function),
        },
      },
      undefined,
    );
  });

  it("should create a secure external link from the Styled custom render", () => {
    renderRegulatoryWarningModal();

    const linkElement = Styled.mock.calls[0][0].customRender.link(DEFAULT_PROPS.labels.warningMessageText);

    expect(linkElement.props.children).toBe(DEFAULT_PROPS.labels.warningMessageText);
    expect(linkElement.props.href).toBe(DEFAULT_PROPS.warningMessageLink);
    expect(linkElement.props.target).toBe("_blank");
    expect(linkElement.props.rel).toBe("noopener noreferrer");
  });

  it("should hide the modal when dismissed by the user", () => {
    const { container } = renderRegulatoryWarningModal();

    act(() => {
      Modal.mock.calls[0][0].onDismiss();
    });

    expect(container.querySelector(MODAL_CONTENT)).toBeNull();
  });

  describe("when 5 seconds pass", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should auto dismiss the modal", () => {
      const { container } = renderRegulatoryWarningModal();

      act(() => {
        jest.advanceTimersByTime(5000);
      });

      expect(container.querySelector(MODAL_CONTENT)).toBeNull();
    });
  });

  it("should not render when warning message text is missing", () => {
    const { container } = renderRegulatoryWarningModal({
      labels: {
        ...DEFAULT_PROPS.labels,
        warningMessageText: undefined,
      },
    });

    expect(container.querySelector(MODAL_CONTENT)).toBeNull();
  });

  it("should not render when warning message link is missing", () => {
    const { container } = renderRegulatoryWarningModal({ warningMessageLink: undefined });

    expect(container.querySelector(MODAL_CONTENT)).toBeNull();
  });
});
