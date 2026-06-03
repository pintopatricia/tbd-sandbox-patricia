import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { NavigationIconName } from "@ppb/the-wall-icons";
import { Link } from "@ppb/the-wall-web";
import { OpenBets } from "./OpenBets.web";

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("@ppb/the-wall-web", () => ({
  Link: jest.fn(({ children }) => children),
}));

jest.mock("@ppb/the-wall-icons/icons");

function renderOpenBets({ viewLink, dispatchOpenBetsNavigation }) {
  return render(<OpenBets viewLink={viewLink} dispatchOpenBetsNavigation={dispatchOpenBetsNavigation} />);
}

describe("OpenBets", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("When there is no viewLink", () => {
    it("should not render", () => {
      const result = renderOpenBets({ viewLink: null });

      expect(result.container).toBeEmpty();
    });
  });

  describe("When there is a viewLink", () => {
    it("should render an icon", () => {
      renderOpenBets({ viewLink: { viewUrn: "ppb:urn" } });

      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: NavigationIconName.MY_BETS,
        },
        undefined,
      );
    });

    describe("when icon is pressed", () => {
      it("should call dispatchOpenBetsNavigation while preventing default link navigation", () => {
        const dispatchOpenBetsNavigation = jest.fn();
        const preventDefault = jest.fn();
        const eventMock = { preventDefault };

        renderOpenBets({ viewLink: { viewUrn: "ppb:urn" }, dispatchOpenBetsNavigation });

        const [[{ onClick: onLinkClick }]] = Link.mock.calls;

        act(() => onLinkClick(eventMock));

        expect(preventDefault).toHaveBeenCalled();
        expect(dispatchOpenBetsNavigation).toHaveBeenCalledWith({ viewUrn: "ppb:urn" });
        expect(dispatchOpenBetsNavigation).toHaveBeenCalledTimes(1);
      });
    });
  });
});
