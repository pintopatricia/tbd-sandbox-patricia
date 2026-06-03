import { render } from "@testing-library/react-native";
import FloatingContainer from "./FloatingContainer.native";
import useFloatingContainerFeature from "./useFloatingContainerFeature";

jest.mock("./CbbFloatingButton/CbbFloatingButton.native", () => {
  const { View } = require("react-native");
  // eslint-disable-next-line react/display-name
  return () => <View testID="cbb-floating-button" />;
});

jest.mock("./useFloatingContainerFeature");

function renderFloatingContainer(props = {}) {
  return render(<FloatingContainer betslipHasSelections={false} {...props} />);
}

describe("FloatingContainer", () => {
  describe("when feature is null", () => {
    it("should render nothing", () => {
      useFloatingContainerFeature.mockReturnValue(null);

      const { toJSON } = renderFloatingContainer();

      expect(toJSON()).toBeNull();
    });
  });

  describe("when feature is CBB", () => {
    beforeEach(() => {
      useFloatingContainerFeature.mockReturnValue({ feature: "CBB", urn: "urn:test:cbb:123" });
    });

    it("should render the floating container", () => {
      const { toJSON } = renderFloatingContainer();

      expect(toJSON()).not.toBeNull();
    });

    it("should render the CBB content", () => {
      const { getByTestId } = renderFloatingContainer();

      expect(getByTestId("cbb-floating-button")).toBeTruthy();
    });
  });

  describe("when feature changes from CBB to null", () => {
    it("should render nothing", () => {
      useFloatingContainerFeature.mockReturnValue({ feature: "CBB", urn: "urn:test:cbb:123" });
      const { toJSON, rerender } = renderFloatingContainer();

      useFloatingContainerFeature.mockReturnValue(null);
      rerender(<FloatingContainer betslipHasSelections={false} />);

      expect(toJSON()).toBeNull();
    });
  });
});
