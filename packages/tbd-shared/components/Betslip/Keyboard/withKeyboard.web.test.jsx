import { render, act, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";

import { KeyboardKeysMap, KeyboardSeparator } from "@ppb/the-wall-common/types";
import { Keyboard } from "@ppb/the-wall-web";
import { useInputDisabledListener } from "@ppb/the-wall-web/hooks/useInputDisabledListener";

import { KeyboardProvider } from "./KeyboardContext";
import { withKeyboard } from "./withKeyboard.web";
import { useWindowScrollIntoView } from "../../../hooks/useScrollIntoView.web";

jest.mock("@ppb/the-wall-web", () => ({
  Keyboard: jest.fn(({ props }) => <keyboard-mock {...props} />),
}));

jest.mock("./keyboard-mapper", () => ({
  updateInputValue: jest.fn(() => "mappedValue"),
}));

jest.mock("../../../hooks/useScrollIntoView.web", () => ({
  useWindowScrollIntoView: jest.fn(() => () => {}),
}));

jest.mock("@ppb/the-wall-web/hooks/useInputDisabledListener", () => ({
  useInputDisabledListener: jest.fn(() => false),
}));

function WrappedComponent() {
  return (
    <div id="wrapped-component">
      <span id="non-input-element"></span>
      <input id="interactable-input" inputMode="none" />
      <input id="readonly-input" readOnly />
    </div>
  );
}

function LayoutComponent({ component, keyboard }) {
  return (
    <>
      {component}
      {keyboard}
    </>
  );
}

function renderWithKeyboard({ keyboardPrefix } = {}) {
  const WrappedComponentWithKeyboard = withKeyboard(WrappedComponent, LayoutComponent);

  const { container } = render(
    <KeyboardProvider>
      <WrappedComponentWithKeyboard keyboardPrefix={keyboardPrefix} />
    </KeyboardProvider>,
  );

  return {
    nonInputElement: container.querySelector("#non-input-element"),
    interactableInput: container.querySelector("#interactable-input"),
    readOnlyInput: container.querySelector("#readonly-input"),
    container,
  };
}

jest.useFakeTimers("modern");

describe("withKeyboard", () => {
  beforeEach(jest.clearAllMocks);

  it("should call useWindowScrollIntoView", () => {
    renderWithKeyboard();

    expect(useWindowScrollIntoView).toHaveBeenCalledWith({ offset: 0 });
    expect(useWindowScrollIntoView).toHaveBeenCalledTimes(1);
  });

  it("should call useInputDisabledListener", () => {
    useInputDisabledListener.mockReturnValueOnce(true);

    renderWithKeyboard();

    expect(useInputDisabledListener).toHaveBeenCalledTimes(1);
  });

  describe("when an interactable input element is clicked", () => {
    it("should call the returned callback of useWindowScrollIntoView", () => {
      const callbackMock = jest.fn();
      useWindowScrollIntoView.mockImplementation(() => callbackMock);

      const { interactableInput } = renderWithKeyboard();
      act(() => {
        interactableInput.focus();
        fireEvent.mouseDown(interactableInput);
      });

      expect(callbackMock).toHaveBeenCalledTimes(1);
    });

    it("should call Keyboard", () => {
      const { interactableInput } = renderWithKeyboard();

      act(() => {
        interactableInput.focus();
        fireEvent.mouseDown(interactableInput);
      });

      expect(Keyboard).toHaveBeenCalledWith(
        {
          isDisabled: false,
          onKeyPress: expect.any(Function),
          separator: KeyboardSeparator.Dot,
        },
        undefined,
      );
      expect(Keyboard).toHaveBeenCalledTimes(1);
    });

    describe("when keyboardPrefix is provided", () => {
      it("should add the prefix before the keyboard", () => {
        const keyboardPrefix = <p id="keyboard-prefix">Test</p>;
        const { interactableInput, container } = renderWithKeyboard({ keyboardPrefix });

        act(() => {
          interactableInput.focus();
          fireEvent.mouseDown(interactableInput);
        });

        expect(container.querySelector("#keyboard-prefix")).toContainHTML('<p id="keyboard-prefix">Test</p>');
      });
    });

    describe("and a keyboard key is pressed", () => {
      it("should not dismiss the Keyboard", () => {
        const { interactableInput } = renderWithKeyboard();

        act(() => {
          interactableInput.focus();
          fireEvent.mouseDown(interactableInput);
        });

        Keyboard.mock.calls[0][0].onKeyPress(KeyboardKeysMap.ONE);

        expect(Keyboard).toHaveBeenCalledTimes(1);
      });

      it("should dispatch a 'change' Event", () => {
        const { interactableInput } = renderWithKeyboard();
        jest.spyOn(interactableInput, "dispatchEvent").mockImplementation(jest.fn);

        act(() => {
          interactableInput.focus();
          fireEvent.mouseDown(interactableInput);
        });

        Keyboard.mock.calls[0][0].onKeyPress(KeyboardKeysMap.ONE);

        expect(interactableInput.dispatchEvent).toHaveBeenCalled();
      });
    });

    describe("and the delete key is pressed", () => {
      it("should dispatch a 'change' Event", () => {
        const { interactableInput } = renderWithKeyboard();
        jest.spyOn(interactableInput, "dispatchEvent").mockImplementation(jest.fn);

        act(() => {
          interactableInput.focus();
          fireEvent.mouseDown(interactableInput);
        });

        expect(interactableInput.dispatchEvent).toHaveBeenCalled();
      });

      describe("when any other element than keyboard and input is pressed", () => {
        it("should dismiss Keyboard", () => {
          const { interactableInput, nonInputElement } = renderWithKeyboard();

          act(() => {
            interactableInput.focus();
            fireEvent.mouseDown(interactableInput);
            fireEvent.mouseDown(nonInputElement);
          });

          expect(Keyboard).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("when the same input element is clicked", () => {
      it("should not rerender Keyboard", () => {
        const { interactableInput } = renderWithKeyboard();

        act(() => {
          interactableInput.focus();
          fireEvent.mouseDown(interactableInput);
        });

        expect(Keyboard).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when a non-interactable input element is clicked", () => {
    it("should not call Keyboard", () => {
      const { readOnlyInput } = renderWithKeyboard();

      act(() => {
        readOnlyInput.focus();
        fireEvent.mouseDown(readOnlyInput);
      });

      expect(Keyboard).not.toHaveBeenCalled();
    });
  });

  describe("when any other non-interactable element is clicked", () => {
    it("should not call Keyboard", () => {
      const { nonInputElement } = renderWithKeyboard();

      act(() => {
        nonInputElement.focus();
        fireEvent.mouseDown(nonInputElement);
      });

      expect(Keyboard).not.toHaveBeenCalled();
    });
  });
});
