import { render } from "@testing-library/react";
import TableRow from "./TableRow.web";
import styles from "./TableRow.web.css";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: ({ name }) => <div data-testid="icon">{name}</div>,
}));

describe("TableRow component", () => {
  const defaultProps = {
    icon: "System--calendar",
    label: "Game Type",
    value: "Slot",
  };

  it("renders label and value correctly when no href is provided", () => {
    const { getByText } = render(<TableRow {...defaultProps} />);
    expect(getByText("Game Type")).not.toBeNull();
    expect(getByText("Slot")).not.toBeNull();
  });

  it("renders an anchor link when href is provided", () => {
    const href = "https://example.com";
    const { getByRole, queryByText } = render(
      <TableRow icon="System--calendar" label="Game Type" value="Slot" href={href} />,
    );

    const link = getByRole("link");
    expect(link.tagName).toBe("A");
    expect(link.getAttribute("href")).toBe(href);
    expect(link.textContent).toBe("Game Type");

    expect(queryByText("Slot")).toBeNull();
  });

  it("renders the icon when provided", () => {
    const { getByTestId } = render(<TableRow {...defaultProps} />);
    expect(getByTestId("icon").textContent).toBe("System--calendar");
  });

  it("renders fallback icon when none is provided", () => {
    const { getByTestId } = render(<TableRow label="Theme" value="Jungle" />);
    expect(getByTestId("icon").textContent).toBe("System--notification-help");
  });

  it("applies correct CSS classes", () => {
    const { container } = render(<TableRow {...defaultProps} />);
    const root = container.firstChild;
    expect(root.className).toContain(styles.tableRow);

    const icon = root.querySelector(`.${styles.rowIcon}`);
    const label = root.querySelector(`.${styles.rowTitle}`);
    const value = root.querySelector(`.${styles.rowValue}`);

    expect(icon).not.toBeNull();
    expect(label).not.toBeNull();
    expect(value).not.toBeNull();
  });

  it("applies correct CSS classes when href is used", () => {
    const { container } = render(<TableRow {...defaultProps} href="https://example.com" />);
    const root = container.firstChild;
    expect(root.className).toContain(styles.tableRow);

    const icon = root.querySelector(`.${styles.rowIcon}`);
    const labelLink = root.querySelector(`.${styles.rowTitle}`);

    expect(icon).not.toBeNull();
    expect(labelLink).not.toBeNull();
    expect(labelLink?.tagName).toBe("A");
  });
});
