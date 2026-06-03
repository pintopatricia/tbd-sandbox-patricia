import { PebbleList } from "@ppb/the-wall-web";
import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import SettingsPage from "./SettingsPage.web";

jest.mock("@ppb/the-wall-web", () => ({
  PebbleList: jest.fn(({ props }) => <pebble-list-mock {...props} />),
}));

const userDispatchMock = jest.fn();
const dispatchFetchCatalogueActionMock = jest.fn();

jest.mock("react-redux", () => ({
  useDispatch: () => userDispatchMock,
}));

const VIEW_TITLE = "I18N.SETTINGS_AND_DETAILS";

const settings = [
  {
    id: "details",
    text: "details",
    url: "http://www.betfair.com",
  },
];

const VIEW_MOCK = {
  view: { settings },
  title: VIEW_TITLE,
  urn: "urn",
  jurisdiction: "INTERNATIONAL",
  dispatchClickSettingsTab: jest.fn(),
};

function renderSettingsPage(props) {
  return render(
    <SettingsPage
      tabUrl={props.tabUrl}
      view={props.view}
      title={props.title}
      urn={props.urn}
      jurisdiction={props.jurisdiction}
      dispatchFetchCatalogueAction={dispatchFetchCatalogueActionMock}
      dispatchClickSettingsTab={props.dispatchClickSettingsTab}
    />,
  );
}

describe("SettingsPage component", () => {
  beforeEach(jest.clearAllMocks);

  it("should call log onPebbleClick and dispatch GA tags", () => {
    act(() => {
      renderSettingsPage(VIEW_MOCK);
    });
    const settingsPage = PebbleList.mock.calls[0][0];
    act(() => {
      settingsPage.onPebbleClick("details");
    });

    expect(VIEW_MOCK.dispatchClickSettingsTab).toHaveBeenCalledWith({
      menuText: "details - settings",
      moduleName: "my_account_international_mobile",
      destinationURL: "http://www.betfair.com",
    });
    expect(VIEW_MOCK.dispatchClickSettingsTab).toHaveBeenCalledTimes(1);
  });

  it("should not call log onPebbleClick and dispatch GA tags", () => {
    act(() => {
      renderSettingsPage(VIEW_MOCK);
    });
    const settingsPage = PebbleList.mock.calls[0][0];
    act(() => {
      settingsPage.onPebbleClick();
    });

    expect(userDispatchMock).not.toHaveBeenCalled();
  });

  it("should call dispatchFetchCatalogueAction", () => {
    act(() => {
      renderSettingsPage(VIEW_MOCK);
    });

    expect(dispatchFetchCatalogueActionMock).toHaveBeenCalledTimes(1);
  });

  it("should set tabUrl and call dispatchFetchCatalogueAction", () => {
    act(() => {
      renderSettingsPage({ ...VIEW_MOCK, tabUrl: "http://www.betfair.com" });
    });

    expect(dispatchFetchCatalogueActionMock).toHaveBeenCalledTimes(1);
  });

  describe("iframe src behavior", () => {
    const MULTI_SETTINGS = [
      { id: "details", text: "details", url: "http://www.betfair.com" },
      { id: "account", text: "account", url: "http://account.betfair.com" },
    ];

    function getIframeSrc(container) {
      return container.querySelector('iframe[name="user-profile-iframe"]').getAttribute("src");
    }

    it("should set iframe src to view.settings[0].url when tabUrl is undefined", () => {
      const { container } = renderSettingsPage({ ...VIEW_MOCK, view: { settings: MULTI_SETTINGS } });
      expect(getIframeSrc(container)).toBe("http://www.betfair.com");
    });

    it("should set iframe src to tabUrl when tabUrl is provided", () => {
      const { container } = renderSettingsPage({
        ...VIEW_MOCK,
        view: { settings: MULTI_SETTINGS },
        tabUrl: "http://account.betfair.com",
      });
      expect(getIframeSrc(container)).toBe("http://account.betfair.com");
    });

    it("should set iframe src to tab url after onPebbleClick", () => {
      const { container } = renderSettingsPage({ ...VIEW_MOCK, view: { settings: MULTI_SETTINGS } });
      const settingsPage = PebbleList.mock.calls[0][0];
      act(() => {
        settingsPage.onPebbleClick("account");
      });
      expect(getIframeSrc(container)).toBe("http://account.betfair.com");
    });

    it("should update iframe src when tabUrl prop changes", () => {
      const baseProps = {
        ...VIEW_MOCK,
        view: { settings: MULTI_SETTINGS },
        tabUrl: "http://www.betfair.com",
      };
      const { container, rerender } = render(
        <SettingsPage
          tabUrl={baseProps.tabUrl}
          view={baseProps.view}
          title={baseProps.title}
          urn={baseProps.urn}
          jurisdiction={baseProps.jurisdiction}
          dispatchFetchCatalogueAction={dispatchFetchCatalogueActionMock}
          dispatchClickSettingsTab={baseProps.dispatchClickSettingsTab}
        />,
      );
      expect(getIframeSrc(container)).toBe("http://www.betfair.com");

      act(() => {
        rerender(
          <SettingsPage
            tabUrl="http://account.betfair.com"
            view={baseProps.view}
            title={baseProps.title}
            urn={baseProps.urn}
            jurisdiction={baseProps.jurisdiction}
            dispatchFetchCatalogueAction={dispatchFetchCatalogueActionMock}
            dispatchClickSettingsTab={baseProps.dispatchClickSettingsTab}
          />,
        );
      });
      expect(getIframeSrc(container)).toBe("http://account.betfair.com");
    });

    it("should pass defaultSelectedPebble matching tabUrl when tabUrl includes tab.url", () => {
      renderSettingsPage({
        ...VIEW_MOCK,
        view: { settings: MULTI_SETTINGS },
        tabUrl: "http://account.betfair.com/extra",
      });
      const lastCall = PebbleList.mock.calls[PebbleList.mock.calls.length - 1][0];
      expect(lastCall.defaultSelectedPebble).toBe("account");
    });

    it("should not render PebbleList when view.settings is empty and no tabUrl", () => {
      renderSettingsPage({ ...VIEW_MOCK, view: { settings: [] } });
      expect(PebbleList).not.toHaveBeenCalled();
    });
  });

  it("should call PebbleList with correct props", () => {
    renderSettingsPage({
      view: { settings },
      title: "some title",
      urn: "some URN",
      jurisdiction: "some jurisdiction",
    });
    expect(PebbleList).toHaveBeenCalledWith(
      {
        defaultSelectedPebble: "details",
        items: [{ id: "details", text: "details" }],
        onPebbleClick: expect.any(Function),
      },
      undefined,
    );
  });

  describe("message event listener", () => {
    const { location } = window;

    beforeAll(() => {
      delete window.location;
      window.location = { reload: jest.fn() };
    });

    afterAll(() => {
      window.location = location;
    });

    it("should call `window.addEventListener` with correct args when mounting the component", () => {
      const addEventListenerSpy = jest.spyOn(window, "addEventListener");

      renderSettingsPage(VIEW_MOCK);

      expect(addEventListenerSpy).toHaveBeenCalledWith("message", expect.any(Function));
    });

    it("should call `window.removeEventListener` with correct args when unmounting the component", () => {
      const removeEventListenerSpy = jest.spyOn(window, "removeEventListener");
      const { unmount } = renderSettingsPage(VIEW_MOCK);

      expect(removeEventListenerSpy).not.toHaveBeenCalledWith("message", expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith("message", expect.any(Function));
    });

    describe("on LANGUAGE.UPDATED message event", () => {
      describe("if event origin matches iFrame url origin", () => {
        it("should reload page", () => {
          renderSettingsPage(VIEW_MOCK);

          act(() => {
            global.dispatchEvent(
              new MessageEvent("message", {
                data: { type: "LANGUAGE.UPDATED", message: "pt_BR" },
                origin: "http://www.betfair.com",
              }),
            );
          });

          expect(window.location.reload).toHaveBeenCalled();
        });
      });

      describe("if event origin doesn't match iFrame url origin", () => {
        it("shouldn't reload page", () => {
          renderSettingsPage(VIEW_MOCK);

          act(() => {
            global.dispatchEvent(
              new MessageEvent("message", {
                data: { type: "LANGUAGE.UPDATED", message: "pt_BR" },
                origin: "http://www.wrong-origin.com",
              }),
            );
          });

          expect(window.location.reload).not.toHaveBeenCalled();
        });
      });
    });
  });
});
