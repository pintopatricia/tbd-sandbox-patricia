import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import BackNavigationItem from "./BackNavigationItem.web";

describe("BackNavigationItem", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should not render the category title on large screens", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 1000 });
    window.dispatchEvent(new Event("resize"));

    const { queryByRole } = render(<BackNavigationItem title="Back Navigation Title" />);

    expect(queryByRole("heading")).toBeNull();
  });

  it("should render the category title on small screens", () => {
    Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: 800 });
    window.dispatchEvent(new Event("resize"));

    const { getAllByRole } = render(<BackNavigationItem title="Back Navigation Title" />);

    expect(getAllByRole("heading")[0]).toBeInTheDocument();
  });
});
