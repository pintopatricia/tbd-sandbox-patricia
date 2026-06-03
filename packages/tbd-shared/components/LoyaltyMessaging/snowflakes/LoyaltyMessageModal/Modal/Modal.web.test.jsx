import { render, fireEvent, within } from "@testing-library/react";
import "jest-dom/extend-expect";

import { ModalWeb } from "./Modal.web";

jest.mock("@ppb/the-wall-web/hooks/useDisableBodyScroll", () => ({
  useDisableBodyScroll: jest.fn(),
}));

const ESC_KEYCODE = 27;

describe("Modal component", () => {
  beforeEach(jest.clearAllMocks);

  const onDismissCb = jest.fn();

  const renderModal = ({ provideContainerId = true, dismissOnOutsideTap } = {}) => {
    const container = render(<div id="container"></div>);
    render(
      <ModalWeb
        title="Some random title"
        onDismiss={onDismissCb}
        dismissOnOutsideTap={dismissOnOutsideTap}
        containerId={provideContainerId ? "container" : undefined}
      >
        <p>Lorem ipsum dolor sit amet</p>
      </ModalWeb>,
    );

    return container;
  };

  it("should render the modal inside the containerId element", () => {
    const { container } = renderModal();

    expect(container.firstChild).toHaveAttribute("id", "container");
  });

  describe("when the containerId isn't provided", () => {
    it("should have the document body as container", () => {
      const { baseElement } = renderModal({ provideContainerId: false });

      expect(baseElement.tagName).toBe("BODY");
    });
  });

  describe('when clicking on the "close" button', () => {
    it("must call the onDismiss callback", () => {
      const { getByTestId } = renderModal();
      const actionLink = getByTestId("actionLink");
      const dismissButton = within(actionLink).getByRole("button");
      fireEvent.click(dismissButton);
      expect(onDismissCb).toHaveBeenCalledTimes(1);
    });
  });

  describe("when clicking outside of the Modal", () => {
    describe("and dismissOnOutsideTap prop is true", () => {
      it("must call the onDismiss callback", () => {
        const { getByTestId } = renderModal();
        const overlay = getByTestId("overlay");

        fireEvent.click(overlay);

        expect(onDismissCb).toHaveBeenCalledTimes(1);
      });
    });

    describe("and dismissOnOutsideTap prop is false", () => {
      it("must not call the onDismiss callback", () => {
        const { getByTestId } = renderModal({ dismissOnOutsideTap: false });
        const overlay = getByTestId("overlay");
        fireEvent.click(overlay);

        expect(onDismissCb).toHaveBeenCalledTimes(0);
      });
    });
  });

  describe('when pressing the "ESC" key', () => {
    it('must call the "onDismiss" callback', () => {
      const { getByTestId } = renderModal();
      const overlay = getByTestId("overlay");
      fireEvent.keyUp(overlay, { key: "Escape", keyCode: ESC_KEYCODE });
      expect(onDismissCb).toHaveBeenCalledTimes(1);
    });
  });

  describe('when providing an "onDismiss" callback', () => {
    it('must call the "onDismiss" callback', () => {
      const { getByTestId } = renderModal();
      const actionLink = getByTestId("actionLink");
      const dismissButton = within(actionLink).getByRole("button");
      fireEvent.click(dismissButton);

      expect(onDismissCb).toHaveBeenCalledTimes(1);
    });
  });
});
