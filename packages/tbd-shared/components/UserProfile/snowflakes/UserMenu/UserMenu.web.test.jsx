import { fireEvent, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { UserMenu } from "./UserMenu.web";
import { MENU_ITEM } from "./UserMenu.web.selectors";

describe("UserMenu", () => {
  beforeEach(jest.clearAllMocks);

  const onDismissCb = jest.fn();
  const onClickCb = jest.fn();

  const renderUserMenu = () =>
    render(
      <>
        <div className="outsideElement">DUMMY</div>
        <UserMenu items={[{ label: "item", onClick: onClickCb }]} onDismiss={onDismissCb} />
      </>,
    );

  describe('when clicking on the "Log Out" option', () => {
    it("must call the onDismiss callback", () => {
      const { container } = renderUserMenu();

      container.querySelector(MENU_ITEM).click();
      expect(onClickCb).toHaveBeenCalledTimes(1);
    });
  });

  describe("when clicking outside of the UserMenu", () => {
    it("must call the onDismiss callback", () => {
      const { container } = renderUserMenu();

      container.querySelector(".outsideElement").click();
      expect(onDismissCb).toHaveBeenCalledTimes(1);
    });
  });

  describe('when pressing the "ESC" key', () => {
    it('must call the "onDismiss" callback', () => {
      const { container } = renderUserMenu();
      const $userMenu = container.querySelector(MENU_ITEM);
      fireEvent.keyUp($userMenu, { key: "Escape", keyCode: 27 });
      expect(onDismissCb).toHaveBeenCalledTimes(1);
    });
  });
});
