import "jest-dom/extend-expect";
import { render, act } from "@testing-library/react";
import DesktopHeader from "./DesktopHeader.web";
import cssModules from "./DestkopHeader.web.modules.json";
import styles from "./DestkopHeader.web.css";
import { loadHeader, loadScripts, startSSC } from "./DesktopHeader.helper";

jest.mock("./DesktopHeader.helper", () => ({
  loadScripts: jest.fn(),
  loadHeader: jest.fn(),
  startSSC: jest.fn(() =>
    Promise.resolve({
      cssFiles: [],
      jsFiles: [],
    }),
  ),
}));

describe("HeadToHeadCard - WEB", () => {
  const AUTH_CONFIG = "AUTH_CONFIG";
  const CLIENT_CONFIGURATION = "CLIENT_CONFIGURATION";
  const CONTENT_CONFIGURATION = "CONTENT_CONFIGURATION";
  const JURISDICTION = "JURISDICTION";
  const LANGUAGE = "LANGUAGE";
  const REGION = "REGION";
  const PRODUCT_DOMAIN = "PRODUCT_DOMAIN";
  const SSC_CONTENT_URL = "SSC_CONTENT_URL";
  const SSOID_COOKIE = "SSOID_COOKIE";
  const CURRENT_URL = "CURRENT_URL";
  const ACCOUNT_BALANCE = "ACCOUNT_BALANCE";
  const dispatchFetchGenerosityWalletCardGroupActionMock = jest.fn();
  const DEFAULT_PROPS = {
    authenticationConfiguration: AUTH_CONFIG,
    clientConfiguration: CLIENT_CONFIGURATION,
    contentConfiguration: CONTENT_CONFIGURATION,
    jurisdiction: JURISDICTION,
    language: LANGUAGE,
    region: REGION,
    productDomain: PRODUCT_DOMAIN,
    sscContentUrl: SSC_CONTENT_URL,
    currentUrl: CURRENT_URL,
    accountBalance: ACCOUNT_BALANCE,
    ssoidCookie: SSOID_COOKIE,
    dispatchFetchGenerosityWalletCardGroupAction: dispatchFetchGenerosityWalletCardGroupActionMock,
  };
  const CHANGED_PROPS = {
    sscConfig: { config: "NEW_CONFIG" },
    sscContentUrl: "NEW_CONTENT_URL",
    currentUrl: "NEW_CURRENT_URL",
    accountBalance: "NEW_ACCOUNT_BALANCE",
  };

  const refreshWalletsFnMock = jest.fn();
  const updateLoginLogoutReturnUrlFnMock = jest.fn();

  const renderDesktopHeader = (props) => render(<DesktopHeader {...props} />);

  Object.defineProperty(window, "location", {
    configurable: true,
    writable: true,
    value: {
      origin: "http://testurl.com",
    },
  });

  beforeEach(() => {
    global.ssc = {
      modules: {
        login: {
          refreshWallets: refreshWalletsFnMock,
          updateLoginLogoutReturnUrl: updateLoginLogoutReturnUrlFnMock,
        },
      },
    };
    global.console.error = jest.fn();
  });

  afterEach(jest.clearAllMocks);

  describe("when it is rendered", () => {
    describe("header container", () => {
      it("should render the header container with the correct styling", () => {
        const { container } = renderDesktopHeader(DEFAULT_PROPS);
        const HEADER_CONTAINER = container.querySelector(cssModules.headerContainer);

        expect(HEADER_CONTAINER).not.toBeNull();
        expect(HEADER_CONTAINER).toHaveClass(styles.headerContainer);
      });
    });

    describe("ssc header container", () => {
      it("should render the ssc header container", () => {
        const { container } = renderDesktopHeader(DEFAULT_PROPS);
        const SSC_HEADER_CONTAINER = container.querySelector(`${cssModules.headerContainer} > div`);

        expect(SSC_HEADER_CONTAINER).not.toBeNull();
      });

      describe("when the htmlContent is an empty string", () => {
        it("the innerHTML should be an empty string", () => {
          const { container } = renderDesktopHeader(DEFAULT_PROPS);
          const SSC_HEADER_CONTAINER = container.querySelector(`${cssModules.headerContainer} > div`);

          expect(SSC_HEADER_CONTAINER.innerHTML).toBe("");
        });
      });

      describe("when the htmlContent is defined", () => {
        const HEADER_CONTENT = "<div>HEADER CONTENT</div>";

        it("the innerHTML should be the htmlContent", async () => {
          startSSC.mockReturnValue(Promise.resolve({ cssFiles: ["x.css"], jsFiles: [] }));
          const { container } = await act(() => renderDesktopHeader(DEFAULT_PROPS));
          const setHtmlContentCallback = loadHeader.mock.calls[0][2];
          const SSC_HEADER_CONTAINER = container.querySelector(`${cssModules.headerContainer} > div`);

          act(() => {
            setHtmlContentCallback(HEADER_CONTENT);
          });

          expect(SSC_HEADER_CONTAINER.innerHTML).toBe(HEADER_CONTENT);
        });
      });
    });

    describe("first useEffect - startSSC", () => {
      it("should call startSSC with the correct parameters", () => {
        renderDesktopHeader(DEFAULT_PROPS);

        expect(startSSC).toHaveBeenCalledWith(
          {
            authenticationConfiguration: "AUTH_CONFIG",
            clientConfiguration: "CLIENT_CONFIGURATION",
            contentConfiguration: "CONTENT_CONFIGURATION",
            dimension: {
              jurisdiction: "JURISDICTION",
              language: "LANGUAGE",
              productDomain: "PRODUCT_DOMAIN",
              region: "REGION",
            },
          },
          SSC_CONTENT_URL,
          SSOID_COOKIE,
        );
      });

      it("should not call again on rerender", () => {
        const { rerender } = renderDesktopHeader(DEFAULT_PROPS);

        rerender(<DesktopHeader {...CHANGED_PROPS} />);

        expect(startSSC).toHaveBeenCalledTimes(1);
      });
    });

    describe("second useEffect - refreshWallets", () => {
      it("should not call refreshWallets if window.ssc is undefined", () => {
        global.ssc = undefined;

        renderDesktopHeader(DEFAULT_PROPS);

        expect(refreshWalletsFnMock).not.toHaveBeenCalled();
      });

      it("should not call refreshWallets if window.ssc.modules is undefined", () => {
        global.ssc.modules = undefined;

        renderDesktopHeader(DEFAULT_PROPS);

        expect(refreshWalletsFnMock).not.toHaveBeenCalled();
      });

      it("should not call refreshWallets if accountBalance is undefined", () => {
        renderDesktopHeader({ ...DEFAULT_PROPS, accountBalance: undefined });

        expect(refreshWalletsFnMock).not.toHaveBeenCalled();
      });

      it("should call refreshWallets again on rerender only if accountBalance changes", () => {
        const { rerender } = renderDesktopHeader(DEFAULT_PROPS);

        expect(refreshWalletsFnMock).toHaveBeenCalledTimes(1);

        rerender(<DesktopHeader {...CHANGED_PROPS} accountBalance={ACCOUNT_BALANCE} />);

        expect(refreshWalletsFnMock).toHaveBeenCalledTimes(1);

        rerender(<DesktopHeader {...CHANGED_PROPS} />);

        expect(refreshWalletsFnMock).toHaveBeenCalledTimes(2);
      });

      it("should log the error on console if the call to refreshWalelts fails", () => {
        const THE_ERROR = new Error("ERROR");

        refreshWalletsFnMock.mockImplementationOnce(() => {
          throw THE_ERROR;
        });

        renderDesktopHeader(DEFAULT_PROPS);

        expect(refreshWalletsFnMock).toHaveBeenCalledTimes(1);

        expect(console.error).toHaveBeenCalledWith("Could not refresh wallets on SSC Header", THE_ERROR);
      });
    });

    describe("third useEffect - updateLoginLogoutReturnUrl", () => {
      it("should not call updateLoginLogoutReturnUrl if window.ssc is undefined", () => {
        global.ssc = undefined;

        renderDesktopHeader(DEFAULT_PROPS);

        expect(updateLoginLogoutReturnUrlFnMock).not.toHaveBeenCalled();
      });

      it("should not call updateLoginLogoutReturnUrl if window.ssc.modules is undefined", () => {
        global.ssc.modules = undefined;

        renderDesktopHeader(DEFAULT_PROPS);

        expect(updateLoginLogoutReturnUrlFnMock).not.toHaveBeenCalled();
      });

      it("should not call updateLoginLogoutReturnUrl if accountBalance is undefined", () => {
        renderDesktopHeader({ ...DEFAULT_PROPS, currentUrl: undefined });

        expect(updateLoginLogoutReturnUrlFnMock).not.toHaveBeenCalled();
      });

      it("should call updateLoginLogoutReturnUrl again on rerender only if currentUrl changes", () => {
        const { rerender } = renderDesktopHeader(DEFAULT_PROPS);

        expect(updateLoginLogoutReturnUrlFnMock).toHaveBeenCalledTimes(1);

        rerender(<DesktopHeader {...CHANGED_PROPS} currentUrl={CURRENT_URL} />);

        expect(updateLoginLogoutReturnUrlFnMock).toHaveBeenCalledTimes(1);

        rerender(<DesktopHeader {...CHANGED_PROPS} />);

        expect(updateLoginLogoutReturnUrlFnMock).toHaveBeenCalledTimes(2);
      });

      it("should log the error on console if the call to updateLoginLogoutReturnUrl fails", () => {
        const THE_ERROR = new Error("ERROR");

        updateLoginLogoutReturnUrlFnMock.mockImplementationOnce(() => {
          throw THE_ERROR;
        });

        renderDesktopHeader(DEFAULT_PROPS);

        expect(refreshWalletsFnMock).toHaveBeenCalledTimes(1);

        expect(console.error).toHaveBeenCalledWith("Could not update login/logout URL on SSC Header", THE_ERROR);
      });
    });

    describe("fourth useEffect - loadScripts", () => {
      const HEADER_CONTENT = "<div>HEADER CONTENT</div>";

      it("should not call loadScripts if htmlContent is an empty string (default value)", async () => {
        startSSC.mockReturnValue(Promise.resolve({ cssFiles: [], jsFiles: ["x.js"] }));
        await act(() => renderDesktopHeader(DEFAULT_PROPS));

        expect(loadScripts).not.toHaveBeenCalled();
      });

      it("should not call loadScripts if jsFiles is an empty array (default value)", async () => {
        startSSC.mockReturnValue(Promise.resolve({ cssFiles: ["x.css"], jsFiles: [] }));
        await act(() => renderDesktopHeader(DEFAULT_PROPS));
        const setHtmlContentCallback = loadHeader.mock.calls[0][2];

        act(() => {
          setHtmlContentCallback(HEADER_CONTENT);
        });

        expect(loadScripts).not.toHaveBeenCalled();
      });

      it("should call loadScripts if jsFiles is not an empty array and htmlContent is not an empty string", async () => {
        startSSC.mockReturnValue(Promise.resolve({ cssFiles: ["x.css"], jsFiles: ["x.js"] }));
        await act(() => renderDesktopHeader(DEFAULT_PROPS));
        const setHtmlContentCallback = loadHeader.mock.calls[0][2];

        act(() => {
          setHtmlContentCallback(HEADER_CONTENT);
        });

        expect(loadScripts).toHaveBeenCalledWith(["x.js"]);
      });
    });
  });
  describe("post messages", () => {
    describe("when from 'FREEBETS_OPEN_MODAL' type and allowed origin", () => {
      it("should call the dispatchFetchGenerosityWalletCardGroupAction", () => {
        renderDesktopHeader(DEFAULT_PROPS);

        global.dispatchEvent(
          new MessageEvent("message", {
            data: { type: "FREEBETS_OPEN_MODAL" },
            origin: "http://testurl.com",
          }),
        );

        expect(dispatchFetchGenerosityWalletCardGroupActionMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("when from different type", () => {
      it("should not call the dispatchFetchGenerosityWalletCardGroupAction", () => {
        renderDesktopHeader(DEFAULT_PROPS);

        global.dispatchEvent(
          new MessageEvent("message", {
            data: { type: "WRONG_TYPE" },
            origin: "http://testurl.com",
          }),
        );

        expect(dispatchFetchGenerosityWalletCardGroupActionMock).not.toHaveBeenCalled();
      });
    });

    describe("when from a not allowed origin", () => {
      it("should not call the dispatchFetchGenerosityWalletCardGroupAction", () => {
        renderDesktopHeader(DEFAULT_PROPS);

        Object.defineProperty(window, "location", {
          value: {
            origin: "http://testurl1.com",
          },
        });

        global.dispatchEvent(
          new MessageEvent("message", {
            data: { type: "FREEBETS_OPEN_MODAL" },
            origin: "http://testurl.com",
          }),
        );

        expect(dispatchFetchGenerosityWalletCardGroupActionMock).not.toHaveBeenCalled();
      });
    });
  });
});
