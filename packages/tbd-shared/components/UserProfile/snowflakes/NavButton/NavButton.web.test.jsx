import { fireEvent, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { ButtonAlign } from "@ppb/the-wall-web/components/Buttons/button";

import { NavButton } from "./NavButton.web";
import { TEST_ID } from "./NavButton.web.selectors";
import styles from "./NavButton.web.css";

function renderNavButton({ contentAlign, hasOutline, children = "", onClick = () => {} }) {
  const { container } = render(
    <NavButton url="/sport" contentAlign={contentAlign} onClick={onClick} hasOutline={hasOutline}>
      {children}
    </NavButton>,
  );
  const navButton = container.querySelector(TEST_ID);
  return navButton;
}

describe("NavButton", () => {
  describe("`contentAlign` attribute", () => {
    describe("when `left`", () => {
      it("should set `alignLeft` class", () => {
        const navButton = renderNavButton({ contentAlign: ButtonAlign.Left });
        expect(navButton).toHaveClass(styles.alignLeft);
      });
    });
    describe("when `right`", () => {
      it("should set `alignRight` class", () => {
        const navButton = renderNavButton({ contentAlign: ButtonAlign.Right });
        expect(navButton).toHaveClass(styles.alignRight);
      });
    });
    describe("when undefined", () => {
      it("should not set `alignRight` neither `alignLeft` classes", () => {
        const navButton = renderNavButton({});
        expect(navButton).not.toHaveClass(styles.alignRight);
        expect(navButton).not.toHaveClass(styles.alignRight);
      });
    });
  });

  describe("`withoutOutline` attribute", () => {
    describe("when `true`", () => {
      it("should not set `withoutOutline` class", () => {
        const navButton = renderNavButton({ hasOutline: true });
        expect(navButton).not.toHaveClass(styles.withoutOutline);
      });
    });
    describe("when `false`", () => {
      it("should  set `withoutOutline` class", () => {
        const navButton = renderNavButton({ hasOutline: false });
        expect(navButton).toHaveClass(styles.withoutOutline);
      });
    });
    describe("when undefined", () => {
      it("should set `withoutOutline` class", () => {
        const navButton = renderNavButton({});
        expect(navButton).not.toHaveClass(styles.withoutOutline);
      });
    });
  });

  describe("`onClick` attribute", () => {
    it("should call onClick handler on click event", () => {
      const onClickMock = jest.fn().mockImplementation((ev) => ev.preventDefault());
      const navButton = renderNavButton({ onClick: onClickMock });

      fireEvent.click(navButton);

      expect(onClickMock).toHaveBeenCalledTimes(1);
    });
  });

  describe("`children`", () => {
    it("should have text prop displayed", () => {
      const navButton = renderNavButton({ children: "dummy Text" });
      expect(navButton).toHaveTextContent("dummy Text");
    });
  });
});
