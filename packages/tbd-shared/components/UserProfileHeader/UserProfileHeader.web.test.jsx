import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { useContext } from "react";
import { UserProfileHeader as HeaderComponent } from "./snowflakes/UserProfileHeader/UserProfileHeader.web";
import UserProfileHeader from "./UserProfileHeader.web";

jest.mock("./snowflakes/UserProfileHeader/UserProfileHeader.web", () => ({
  UserProfileHeader: jest.fn(() => <></>),
}));

jest.mock("@ppb/the-wall-web/hooks/useDisableBodyScroll", () => ({
  useDisableBodyScroll: jest.fn(),
}));

jest.mock("@ppb/tbd-router/web/history", () => ({
  goBack: jest.fn(),
}));

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isDesktopLayout: false,
  })),
}));

const dispatchFetchUserMainWalletMock = jest.fn();
const dispatchChangeUrlMock = jest.fn();
const dispatchRefreshMock = jest.fn();
const onCloseMock = jest.fn();
const dispatchMyAccountClickActionMock = jest.fn();

const stateProps = {
  accountBalance: "€1",
  freeBetsBalance: "€10",
  showBalances: true,
  labels: {
    title: "header",
  },
  closeLocation: { urn: "run:test", url: "url:test" },
  showBack: true,
  backToMyAccount: true,
};

function renderHeader(
  { accountBalance, freeBetsBalance, showBalances, labels, closeLocation, showBack, backToMyAccount },
  dispatchFetchUserMainWallet = dispatchFetchUserMainWalletMock,
  dispatchChangeUrl = dispatchChangeUrlMock,
  dispatchRefresh = dispatchRefreshMock,
  onClose = onCloseMock,
  dispatchMyAccountClickAction = dispatchMyAccountClickActionMock,
) {
  return render(
    <UserProfileHeader
      accountBalance={accountBalance}
      freeBetsBalance={freeBetsBalance}
      freeBetsLabel={"Free Bets"}
      showBalances={showBalances}
      labels={labels}
      dispatchFetchUserMainWallet={dispatchFetchUserMainWallet}
      dispatchChangeUrl={dispatchChangeUrl}
      dispatchRefresh={dispatchRefresh}
      dispatchMyAccountClickAction={dispatchMyAccountClickAction}
      onClose={onClose}
      closeLocation={closeLocation}
      showBack={showBack}
      backToMyAccount={backToMyAccount}
    />,
  );
}

describe("Header component", () => {
  describe("when header is defined", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("must render the header component with the correct props", () => {
      renderHeader(stateProps);

      expect(HeaderComponent).toHaveBeenCalledWith(
        {
          showBack: true,
          accountBalance: "€1",
          freeBetsBalance: "€10",
          title: "header",
          onCloseClick: expect.any(Function),
          onBackClick: expect.any(Function),
          showBalances: true,
          freeBetsLabel: "Free Bets",
        },
        undefined,
      );
      expect(HeaderComponent).toHaveBeenCalledTimes(1);
    });

    it("should call the dispatchFetchUserMainWallet", () => {
      renderHeader(stateProps);

      expect(dispatchFetchUserMainWalletMock).toHaveBeenCalled();
    });

    jest.useFakeTimers();

    describe("when onClose is called", () => {
      it("should call onCloseClick", () => {
        renderHeader(stateProps);
        const { onCloseClick } = HeaderComponent.mock.calls[0][0];

        act(() => {
          onCloseClick();
        });
        expect(onCloseMock).toHaveBeenCalled();
      });

      it("should call the dispatchChangeUrl", () => {
        renderHeader(stateProps);
        jest.advanceTimersByTime(500);
        expect(dispatchChangeUrlMock).toHaveBeenCalledWith(stateProps.closeLocation.urn, stateProps.closeLocation.url);
      });

      it("should change header styles if `isDesktopLayout` is false", () => {
        renderHeader(stateProps);
        const getElementByIdSpy = jest.spyOn(document, "getElementById");
        const { onCloseClick } = HeaderComponent.mock.calls[0][0];

        act(() => {
          onCloseClick();
        });

        jest.advanceTimersByTime(500);

        expect(getElementByIdSpy).toHaveBeenCalledWith("header");
      });

      it("should not change header styles if `isDesktopLayout` is true", () => {
        useContext.mockReturnValue({
          isDesktopLayout: true,
        });
        renderHeader(stateProps);
        const getElementByIdSpy = jest.spyOn(document, "getElementById");
        const { onCloseClick } = HeaderComponent.mock.calls[0][0];

        act(() => {
          onCloseClick();
        });

        expect(getElementByIdSpy).not.toHaveBeenCalledWith("header");
      });
    });

    describe("when onBack is called", () => {
      beforeEach(() => {
        renderHeader(stateProps);
      });

      it("should call should call the dispatchChangeUrl", () => {
        const { onBackClick } = HeaderComponent.mock.calls[0][0];
        onBackClick();
        expect(dispatchChangeUrlMock).toHaveBeenCalled();
      });
    });

    describe("when dispatchMyAccountClickAction is called", () => {
      beforeEach(() => {
        renderHeader(stateProps);
      });

      it("should call dispatchMyAccountClickAction", () => {
        const { onCloseClick } = HeaderComponent.mock.calls[0][0];

        act(() => {
          onCloseClick();
        });

        expect(dispatchMyAccountClickActionMock).toHaveBeenCalledWith(false);
      });
    });
  });
});
