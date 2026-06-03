import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";

import Predicts from "./Predicts.web";
import { PREDICTS_URL } from "./Predicts.types";

const predictsLoadingMock = jest.fn();
jest.mock("./PredictsLoading/PredictsLoading.web", () => ({
  __esModule: true,
  default: (props) => {
    predictsLoadingMock(props);
    return <div data-testid="predicts-loading-mock" />;
  },
}));

describe("Predicts.web", () => {
  const originalAssign = window.location.assign;
  let assignSpy;

  beforeEach(() => {
    predictsLoadingMock.mockClear();
    document.body.style.overflow = "";
    assignSpy = jest.fn();
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, assign: assignSpy },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, "location", {
      configurable: true,
      value: { ...window.location, assign: originalAssign },
    });
  });

  it("should render nothing when isOpen is false", () => {
    const { container } = render(<Predicts isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it("should render the PredictsLoading screen with isLoading=false when open", () => {
    const { getByTestId } = render(<Predicts isOpen />);
    expect(getByTestId("predicts-loading-mock")).toBeInTheDocument();
    expect(predictsLoadingMock).toHaveBeenLastCalledWith(expect.objectContaining({ isLoading: false }));
  });

  it("should redirect to PREDICTS_URL with the current location as returnUrl", () => {
    render(<Predicts isOpen />);

    const { onDismiss } = predictsLoadingMock.mock.calls[0][0];
    act(() => {
      onDismiss();
    });

    expect(assignSpy).toHaveBeenCalledTimes(1);
    const targetUrl = new URL(assignSpy.mock.calls[0][0]);
    expect(targetUrl.origin + targetUrl.pathname).toBe(`${PREDICTS_URL}/`);
    expect(targetUrl.searchParams.get("returnUrl")).toBe(window.location.href);
  });

  it("should lock body scroll while open and restore it on unmount", () => {
    document.body.style.overflow = "auto";

    const { unmount } = render(<Predicts isOpen />);
    expect(document.body.style.overflow).toBe("hidden");

    unmount();
    expect(document.body.style.overflow).toBe("auto");
  });

  it("should not lock body scroll when closed", () => {
    document.body.style.overflow = "auto";
    render(<Predicts isOpen={false} />);
    expect(document.body.style.overflow).toBe("auto");
  });
});
