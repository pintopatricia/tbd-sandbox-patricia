import { fireEvent, render, screen } from "@testing-library/react";

import styles from "./MiniBanner.web.css";
import { MiniBanner } from "./MiniBanner.web";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(({ name }) => <span data-testid="generic-icon">{String(name)}</span>),
}));

const mockProps = {
  brandTitle: "Brand title",
  title: "Banner title",
  subText: "Banner sub text",
  onMiniBannerTap: jest.fn(),
};

describe("MiniBanner", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders text, default layout class, and icons", () => {
    render(<MiniBanner {...mockProps} />);

    expect(screen.getByText("Brand title")).toBeDefined();
    expect(screen.getByText("Banner title")).toBeDefined();
    expect(screen.getByText("Banner sub text")).toBeDefined();
    const banner = screen.getByRole("button");
    expect([...banner.classList]).toContain(styles.default);
    expect(screen.getAllByTestId("generic-icon").length).toBe(2);
  });

  it("exposes an accessible name from its lines", () => {
    render(<MiniBanner {...mockProps} />);
    expect(screen.getByRole("button", { name: /brand title.*banner title.*banner sub text/i })).toBeDefined();
  });

  it("renders only subText when optional lines are missing", () => {
    render(<MiniBanner subText="Only sub text" />);
    expect(screen.getByText("Only sub text")).toBeDefined();
    expect(screen.queryByText("Brand title")).toBeNull();
    expect(screen.queryByText("Banner title")).toBeNull();
  });

  it("calls onMiniBannerTap when the banner is clicked", () => {
    render(<MiniBanner {...mockProps} />);
    fireEvent.click(screen.getByRole("button"));
    expect(mockProps.onMiniBannerTap).toHaveBeenCalledTimes(1);
  });

  it("activates on Enter and Space", () => {
    render(<MiniBanner {...mockProps} />);
    const banner = screen.getByRole("button");
    fireEvent.keyDown(banner, { key: "Enter" });
    fireEvent.keyDown(banner, { key: " " });
    expect(mockProps.onMiniBannerTap).toHaveBeenCalledTimes(2);
  });

  it("works without onMiniBannerTap callback", () => {
    render(<MiniBanner brandTitle="X" subText="Y" onMiniBannerTap={undefined} />);
    expect(() => fireEvent.click(screen.getByRole("button"))).not.toThrow();
  });
});
