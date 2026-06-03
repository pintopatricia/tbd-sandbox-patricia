import { render } from "@testing-library/react";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import ObbCreatedBetsCardGroupPlaceholder from "./ObbCreatedBetsCardGroupPlaceholder.web";
import ObbCreatedBetsCardPlaceholder from "../../ObbCreatedBetsCard/placeholder/ObbCreatedBetsCardPlaceholder.web";
import { ConfigContext } from "../../Config/ConfigContext";

jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: jest.fn(({ children, ...props }) => (
    <scrollable-swimlane-mock {...props}>{children}</scrollable-swimlane-mock>
  )),
}));

jest.mock("../../ObbCreatedBetsCard/placeholder/ObbCreatedBetsCardPlaceholder.web", () =>
  jest.fn(() => <obb-created-bets-card-placeholder-mock />),
);

const renderComponent = (isDesktopLayout = false) =>
  render(
    <ConfigContext.Provider value={{ isDesktopLayout }}>
      <ObbCreatedBetsCardGroupPlaceholder />
    </ConfigContext.Provider>,
  );

describe("ObbCreatedBetsCardGroupPlaceholder - Web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when component renders", () => {
    it("should render ScrollableSwimlane with empty title and snap enabled", () => {
      renderComponent();

      expect(ScrollableSwimlane).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "",
          snap: true,
        }),
        undefined,
      );
    });

    it("should pass isDesktopLayout to ScrollableSwimlane when in desktop mode", () => {
      renderComponent(true);

      expect(ScrollableSwimlane).toHaveBeenCalledWith(
        expect.objectContaining({
          isDesktopLayout: true,
        }),
        undefined,
      );
    });

    it("should pass isDesktopLayout as false when in mobile mode", () => {
      renderComponent(false);

      expect(ScrollableSwimlane).toHaveBeenCalledWith(
        expect.objectContaining({
          isDesktopLayout: false,
        }),
        undefined,
      );
    });

    it("should render 3 placeholder cards", () => {
      renderComponent();

      expect(ObbCreatedBetsCardPlaceholder).toHaveBeenCalledTimes(3);
    });

    it("should render the correct structure", () => {
      const { container } = renderComponent();

      expect(container.querySelector("scrollable-swimlane-mock")).toBeTruthy();
    });
  });
});
