import { render } from "@testing-library/react-native";
import { useLogin } from "@flutter-global/react-native-cet-framework";
import { PrimaryButton } from "@ppb/the-wall-native";
import { navigateWithThirdPartyScreenName, ScreenName } from "@ppb/tbd-router/native";
import ConnectedGameInfoPage from "./GameInfoPage.native";
import ConnectedCard from "../Card";
import ConnectedBackNavigationItem from "../BackNavigationItem/index";
import Card from "../Card/Card.native";
import { GAME_INFO_PLAY_NOW_BUTTON_CONTAINER, GAME_INFO_PLAY_NOW_BUTTON_LINK } from "./GameInfoPage.native.selectors";
import styles from "./GameInfoPage.native.styles";
import { updateGamingSearchHistory } from "../../helpers/search-history-helper.native";

jest.useFakeTimers();

jest.mock("@flutter-global/react-native-cet-framework", () => {
  const loginCET = jest.fn();
  return { useLogin: jest.fn(() => loginCET) };
});

jest.mock("../Card", () => jest.fn((props) => <connected-card {...props} />));

jest.mock("../Card/Card.native", () => jest.fn(() => <card-mock />));

jest.mock("../BackNavigationItem", () => jest.fn(() => <mock-back-nav-item data-testid="navigation-item" />));

jest.mock("@ppb/the-wall-native", () => ({
  PrimaryButton: jest.fn(() => <primary-button-mock />),
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigateWithThirdPartyScreenName: jest.fn(() => {}),
  ScreenName: jest.fn(() => {}),
  navigateMyAccount: jest.fn(),
}));

jest.mock("../../view-model-factories/game", () => ({
  getLaunchUrl: jest.fn(() => "http://www.example.com/launchGameUrl"),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {},
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../hooks/useAppBrand", () => ({
  useAppBrand: () => "betfair",
}));

jest.mock("../../helpers/storage.native", () => ({
  getItem: jest.fn(() => Promise.resolve(undefined)),
  setItem: jest.fn(),
}));

jest.mock("../../helpers/search-history-helper.native", () => ({
  updateGamingSearchHistory: jest.fn(),
}));

function renderGameInfoPage(props) {
  return render(<ConnectedGameInfoPage {...props} />);
}

describe("GameInfoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render BackNavigationItem when backNavigationTitle exists", () => {
    render(
      <ConnectedGameInfoPage
        urn={"ppb:gameInfo"}
        view={{
          navigationItem: { title: "Back" },
          items: [],
        }}
      />,
    );

    expect(ConnectedBackNavigationItem).toHaveBeenCalledTimes(1);
  });

  it("should call connected card for the items", () => {
    render(
      <ConnectedGameInfoPage
        urn={"ppb:gameInfo"}
        view={{
          items: [
            { urn: "urn:fake:1", typename: "fake:1" },
            { urn: "urn:fake:2", typename: "fake:2" },
          ],
        }}
      />,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn:fake:1", typename: "fake:1", component: Card, visible: false },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn:fake:2", typename: "fake:2", component: Card, visible: false },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledTimes(2);
  });

  it("should not render the connected cards when there are no items", () => {
    render(<ConnectedGameInfoPage urn={"ppb:gameInfoPage"} view={{ items: [] }} />);
    expect(ConnectedCard).toHaveBeenCalledTimes(0);
  });

  it("should have button container and Play Now displayed", () => {
    const { queryByTestId } = renderGameInfoPage({ urn: "ppb:gameInfoPage", view: { items: [] } });
    const ctaButtonContainer = queryByTestId(GAME_INFO_PLAY_NOW_BUTTON_CONTAINER);
    expect(ctaButtonContainer).toHaveStyle(styles.buttonContainer);
    expect(PrimaryButton).toHaveBeenCalledTimes(1);
  });

  it("should have link container for Play Now button", () => {
    const { queryByTestId } = renderGameInfoPage({
      urn: "ppb:gameInfoPage",
      view: { items: [] },
    });
    const linkContainer = queryByTestId(GAME_INFO_PLAY_NOW_BUTTON_LINK);
    expect(linkContainer).toHaveStyle(styles.link);
  });

  describe("when tap item", () => {
    it("should trigger 'navigateWithThirdPartyScreenName'", () => {
      const spy = jest.fn();
      const viewLinkMock = { viewUrl: "", viewUrn: "" };
      const { queryByTestId } = renderGameInfoPage({
        urn: "ppb:gameInfoPage",
        view: {
          items: [{ urn: "urn:fake:1", typename: "fake:1" }],
        },
        isLoggedIn: true,
        dispatchLaunchGame: spy,
        dispatchGameLaunchRefresh: spy,
      });
      const linkContainer = queryByTestId(GAME_INFO_PLAY_NOW_BUTTON_LINK);
      const onTapCallback = linkContainer.children[0].props.onTap;
      onTapCallback();
      expect(spy).toHaveBeenCalledWith(viewLinkMock, "ppb:gameInfoPage", "native");
    });

    it("should not trigger 'navigateWithThirdPartyScreenName' when the prop dispatchLaunchGame is undefined", () => {
      const { queryByTestId } = renderGameInfoPage({
        urn: "ppb:gameInfoPage",
        view: {
          items: [{ urn: "urn:fake:1", typename: "fake:1" }],
        },
        isLoggedIn: true,
      });
      const linkContainer = queryByTestId(GAME_INFO_PLAY_NOW_BUTTON_LINK);
      const onTapCallback = linkContainer.children[0].props.onTap;
      onTapCallback();
      expect(navigateWithThirdPartyScreenName).not.toHaveBeenCalled();
    });
  });

  it("should render connected game info page with the correct viewUrn, viewUrl", () => {
    const spy = jest.fn();
    const { queryByTestId } = renderGameInfoPage({
      urn: "ppb:gameInfoPage",
      view: {
        items: [{ urn: "urn:fake:1", typename: "fake:1" }],
        urn: "urn:view:fake:1",
      },
      gameLaunchId: "gameLaunchId",
      providerUid: "providerUuid",
      mainProduct: "mainProduct",
      dispatchLaunchGame: spy,
      dispatchGameLaunchRefresh: spy,
      isLoggedIn: true,
    });
    const linkContainer = queryByTestId(GAME_INFO_PLAY_NOW_BUTTON_LINK);
    const onTapCallback = linkContainer.children[0].props.onTap;
    onTapCallback();
    expect(spy).toHaveBeenCalledWith(
      {
        viewUrl: "http://www.example.com/launchGameUrl",
        viewUrn: "urn:view:fake:1",
      },
      "ppb:gameInfoPage",
      "native",
    );
  });

  it("should navigate to login screen when the user is not loggedin", () => {
    const spy = jest.fn();
    const { queryByTestId } = renderGameInfoPage({
      isLoggedIn: false,
      dispatchLaunchGame: spy,
    });
    const linkContainer = queryByTestId(GAME_INFO_PLAY_NOW_BUTTON_LINK);
    const onTapCallback = linkContainer.children[0].props.onTap;
    onTapCallback();
    expect(useLogin).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledTimes(0);
  });

  describe("when a game is launched", () => {
    it("should dispatch GAME_LAUNCH action", () => {
      const spyOnDispatchLaunchGame = jest.fn();
      const spyOndispatchGameLaunchRefresh = jest.fn();
      const { queryByTestId } = renderGameInfoPage({
        urn: "ppb:gameInfoPage",
        view: {
          items: [{ urn: "urn:fake:1", typename: "fake:1" }],
        },
        dispatchGameLaunchRefresh: spyOndispatchGameLaunchRefresh,
        dispatchLaunchGame: spyOnDispatchLaunchGame,
        isLoggedIn: true,
      });
      const pressableContainer = queryByTestId(GAME_INFO_PLAY_NOW_BUTTON_LINK);
      const onTapCallback = pressableContainer.children[0].props.onTap;
      onTapCallback();
      expect(spyOndispatchGameLaunchRefresh).toHaveBeenCalledTimes(1);
    });
  });
  describe("when view is defined", () => {
    it("should use the view urn attribute", () => {
      const spy = jest.fn();
      const { queryByTestId } = renderGameInfoPage({
        urn: "urn:tbd:card:1",
        view: {
          urn: "urn:tbd:view:game:1",
        },
        gameLaunchId: "gameLaunchId",
        providerUid: "providerUuid",
        mainProduct: "mainProduct",
        isLoggedIn: true,
        dispatchLaunchGame: spy,
        dispatchGameLaunchRefresh: spy,
      });
      const mockViewLink = {
        viewUrl: "http://www.example.com/launchGameUrl",
        viewUrn: "urn:tbd:view:game:1",
      };
      const pressableContainer = queryByTestId(GAME_INFO_PLAY_NOW_BUTTON_LINK);
      const onTapCallback = pressableContainer.children[0].props.onTap;
      onTapCallback();
      expect(spy).toHaveBeenCalledWith(mockViewLink, "urn:tbd:card:1", "native");
      expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.GameLaunchScreen, {
        viewLink: mockViewLink,
      });
    });
  });

  describe("when view is not defined", () => {
    it("should use urn prop as fallback", () => {
      const spy = jest.fn();
      const { queryByTestId } = renderGameInfoPage({
        urn: "urn:tbd:card:1",
        isLoggedIn: true,
        gameLaunchId: "gameLaunchId",
        providerUid: "providerUuid",
        mainProduct: "mainProduct",
        dispatchLaunchGame: spy,
        dispatchGameLaunchRefresh: spy,
      });
      const mockViewLink = {
        viewUrl: "http://www.example.com/launchGameUrl",
        viewUrn: "urn:tbd:card:1",
      };
      const pressableContainer = queryByTestId(GAME_INFO_PLAY_NOW_BUTTON_LINK);
      const onTapCallback = pressableContainer.children[0].props.onTap;
      onTapCallback();
      expect(spy).toHaveBeenCalledWith(mockViewLink, "urn:tbd:card:1", "native");
      expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.GameLaunchScreen, {
        viewLink: mockViewLink,
      });
    });
  });

  describe("when tap Play button", () => {
    const renderAndTapPlay = (props) => {
      const spy = jest.fn();
      const { queryByTestId } = renderGameInfoPage({
        urn: "ppb:gameInfoPage",
        view: { items: [{ urn: "urn:fake:1", typename: "fake:1" }] },
        isLoggedIn: true,
        dispatchLaunchGame: spy,
        dispatchGameLaunchRefresh: spy,
        ...props,
      });
      const linkContainer = queryByTestId(GAME_INFO_PLAY_NOW_BUTTON_LINK);
      linkContainer.children[0].props.onTap();
    };

    it("should call updateGamingSearchHistory with the trimmed inputSearchTerm when Play is tapped", () => {
      renderAndTapPlay({ inputSearchTerm: "starburst" });
      expect(updateGamingSearchHistory).toHaveBeenCalledTimes(1);
      expect(updateGamingSearchHistory).toHaveBeenCalledWith("starburst");
    });

    it("should trim surrounding whitespace from the inputSearchTerm before updating history", () => {
      renderAndTapPlay({ inputSearchTerm: "  starburst  " });
      expect(updateGamingSearchHistory).toHaveBeenCalledTimes(1);
      expect(updateGamingSearchHistory).toHaveBeenCalledWith("starburst");
    });

    it("should not call updateGamingSearchHistory when inputSearchTerm is an empty string", () => {
      renderAndTapPlay({ inputSearchTerm: "" });
      expect(updateGamingSearchHistory).not.toHaveBeenCalled();
    });

    it("should not call updateGamingSearchHistory when inputSearchTerm is whitespace only", () => {
      renderAndTapPlay({ inputSearchTerm: "   " });
      expect(updateGamingSearchHistory).not.toHaveBeenCalled();
    });

    it("should not call updateGamingSearchHistory when inputSearchTerm is undefined", () => {
      renderAndTapPlay({ inputSearchTerm: undefined });
      expect(updateGamingSearchHistory).not.toHaveBeenCalled();
    });
  });
});
