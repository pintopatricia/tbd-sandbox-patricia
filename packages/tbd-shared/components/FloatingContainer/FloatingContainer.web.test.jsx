import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import FloatingContainer from "./FloatingContainer.web";
import useFloatingContainerFeature from "./useFloatingContainerFeature";

jest.mock("./CbbFloatingButton/CbbFloatingButton.web", () => {
  // eslint-disable-next-line react/display-name
  return () => <div data-testid="cbb-floating-button" />;
});

jest.mock("./useFloatingContainerFeature");

function renderFloatingContainer(props = {}) {
  return render(<FloatingContainer betslipHasSelections={false} {...props} />);
}

describe("FloatingContainer", () => {
  describe("when feature is null", () => {
    it("should render nothing", () => {
      useFloatingContainerFeature.mockReturnValue(null);

      const { container } = renderFloatingContainer();

      expect(container).toBeEmpty();
    });
  });

  describe("when feature is CBB", () => {
    beforeEach(() => {
      useFloatingContainerFeature.mockReturnValue({ feature: "CBB", urn: "urn:test:cbb:123" });
    });

    it("should render the floating container", () => {
      const { container } = renderFloatingContainer();

      expect(container.firstChild).toBeInTheDocument();
    });

    it("should render the CBB content", () => {
      const { getByTestId } = renderFloatingContainer();

      expect(getByTestId("cbb-floating-button")).toBeInTheDocument();
    });
  });

  describe("when feature changes from CBB to null", () => {
    it("should render nothing", () => {
      useFloatingContainerFeature.mockReturnValue({ feature: "CBB", urn: "urn:test:cbb:123" });
      const { container, rerender } = renderFloatingContainer();

      useFloatingContainerFeature.mockReturnValue(null);
      rerender(<FloatingContainer betslipHasSelections={false} />);

      expect(container).toBeEmpty();
    });
  });
});
