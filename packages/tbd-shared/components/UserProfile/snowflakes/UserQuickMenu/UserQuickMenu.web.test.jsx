import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { NavButton } from "../NavButton/NavButton.web";
import { UserQuickMenu } from "./UserQuickMenu.web";
import { MENU_ITEM, MENU_ITEM_ICON } from "./UserQuickMenu.web.selectors";

const quickMenuMock = {
  items: [
    { label: "Deposit", viewLink: { viewUrl: "deposit", viewUrn: "depositUrn" } },
    { label: "Withdraw", viewLink: { viewUrl: "withdraw", viewUrn: "withdrawUrn" } },
  ],
};

const onItemClickMock = jest.fn();

jest.mock("../NavButton/NavButton.web", () => ({
  NavButton: jest.fn(() => <nav-button-mock />),
}));

function renderQuickMenu(mockProps = {}) {
  return render(<UserQuickMenu {...mockProps} />);
}

describe("UserQuickMenu", () => {
  it("should render NavButton", () => {
    renderQuickMenu(quickMenuMock);

    expect(NavButton).toHaveBeenCalledTimes(2);
  });

  it("should render quick menu", () => {
    const { container } = renderQuickMenu(quickMenuMock);
    const quickMenu = container.querySelector(MENU_ITEM);

    expect(quickMenu).not.toBe(null);
  });

  it("renderIcon should return null", () => {
    const { container } = renderQuickMenu({
      items: [{ label: "Deposit", viewLink: { viewUrl: "deposit", viewUrn: "depositUrn" }, icon: "eye" }],
    });
    const quickMenu = container.querySelector(MENU_ITEM_ICON);

    expect(quickMenu).toBe(null);
  });

  it("should call onItemClick when quick menu is clicked", () => {
    renderQuickMenu({
      items: [{ label: "Deposit", viewLink: { viewUrl: "deposit", viewUrn: "depositUrn" }, icon: "eye" }],
      onItemClick: onItemClickMock,
    });

    expect(NavButton).toHaveBeenCalledWith(
      {
        children: expect.any(Object),
        onClick: expect.any(Function),
        url: "deposit",
      },
      undefined,
    );
  });
});
