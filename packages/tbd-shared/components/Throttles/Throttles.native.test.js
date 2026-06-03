import { DevSettings } from "react-native";
import mockComponent from "react-native/jest/mockComponent";
import { render, fireEvent } from "@testing-library/react-native";

import { Throttles } from "./Throttles.native";

jest.mock("@ppb/the-wall-native", () => ({
  Header: jest.fn(() => <></>),
  Text: jest.requireActual("react-native").Text,
}));

// Suppresses warning with an upstream issue of react-native for a Switch component
// https://github.com/callstack/react-native-testing-library/issues/329
// https://jestjs.io/docs/tutorial-react-native#mock-native-modules-using-jestmock
jest.mock("react-native/Libraries/Components/Switch/Switch", () =>
  mockComponent("react-native/Libraries/Components/Switch/Switch"),
);
jest.mock("react-native/Libraries/Utilities/DevSettings", () => ({
  reload: jest.fn(),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
}));

jest.spyOn(global.console, "error").mockReturnValue(1);

const dispatchSetThrottlesActionMock = jest.fn();
const dispatchResetThrottlesActionMock = jest.fn();

function renderThrottles({
  throttles,
  dispatchSetThrottlesAction = dispatchSetThrottlesActionMock,
  dispatchResetThrottlesAction = dispatchResetThrottlesActionMock,
}) {
  return render(
    <Throttles
      throttles={throttles}
      storageKey={"storageKey"}
      dispatchSetThrottlesAction={dispatchSetThrottlesAction}
      dispatchResetThrottlesAction={dispatchResetThrottlesAction}
    />,
  );
}

describe("Throttles component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when rendering", () => {
    it("should have a static title", () => {
      const component = renderThrottles({ throttles: [{ id: "THROTTLE", isActive: false }] });

      expect(component.getByTestId("throttles-title")).toHaveTextContent("Throttles");
    });

    it("should have a reset button", () => {
      const component = renderThrottles({ throttles: [{ id: "THROTTLE", isActive: false }] });

      expect(component.getByTestId("throttles-reset")).not.toBeNull();
    });

    it("should create ids for each throttle", () => {
      const component = renderThrottles({
        throttles: [
          { id: "THROTTLE", isActive: false },
          { id: "THROTTLE_2", isActive: false },
        ],
      });

      expect(component.queryAllByTestId("throttles-id").length).toEqual(2);
      expect(component.queryAllByTestId("throttles-id")[0]).toHaveTextContent("THROTTLE");
      expect(component.queryAllByTestId("throttles-id")[1]).toHaveTextContent("THROTTLE_2");
    });

    it("should create switches for each throttle", () => {
      const component = renderThrottles({
        throttles: [
          { id: "THROTTLE", isActive: false },
          { id: "THROTTLE_2", isActive: false },
        ],
      });

      expect(component.queryAllByTestId("throttles-switch").length).toEqual(2);
    });
  });

  describe("when interacting with controls", () => {
    describe("when clicking on a switch", () => {
      it("should call setItem from AsyncStorage with the stringified overriden throttles", () => {
        const component = renderThrottles({
          throttles: [{ id: "THROTTLE", isActive: false }],
        });
        const throttleSwitch = component.getByTestId("throttles-switch");

        fireEvent(throttleSwitch, "onValueChange", true);

        expect(dispatchSetThrottlesActionMock).toHaveBeenCalledWith({
          THROTTLE: { isActive: true, isOverriden: true },
        });
      });
    });

    describe("when clicking on reset", () => {
      it("should call setItem from AsyncStorage with stringified empty object", () => {
        const component = renderThrottles({
          throttles: [{ id: "THROTTLE", isActive: false }],
        });
        const resetButton = component.getByTestId("throttles-reset");

        fireEvent.press(resetButton);

        expect(dispatchResetThrottlesActionMock).toHaveBeenCalled();
      });

      it("should call reload", () => {
        const component = renderThrottles({
          throttles: [{ id: "THROTTLE", isActive: false }],
        });
        const resetButton = component.getByTestId("throttles-reset");

        fireEvent.press(resetButton);

        expect(DevSettings.reload).toHaveBeenCalled();
      });
    });

    describe("when clicking on reload", () => {
      it("should call reload", () => {
        const component = renderThrottles({
          throttles: [{ id: "THROTTLE", isActive: false }],
        });
        const resetButton = component.getByTestId("throttles-reload");

        fireEvent.press(resetButton);

        expect(DevSettings.reload).toHaveBeenCalled();
      });
    });
  });
});
