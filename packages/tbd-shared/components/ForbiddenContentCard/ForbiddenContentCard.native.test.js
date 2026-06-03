import { useLogin, useJoinNow } from "@flutter-global/react-native-cet-framework";
import { render } from "@testing-library/react-native";

import { ComponentTheme } from "@ppb/the-wall-common/types";
import { ForbiddenContent } from "./snowflakes/ForbiddenContent/ForbiddenContent.native";
import { ForbiddenCardSize } from "./snowflakes/ForbiddenContent/ForbiddenContent.types";
import ForbiddenContentCard from "./ForbiddenContentCard.native";

jest.mock("@flutter-global/react-native-cet-framework", () => {
  const loginCET = jest.fn();
  const joinNowCET = jest.fn();

  return { useLogin: jest.fn(() => loginCET), useJoinNow: jest.fn(() => joinNowCET) };
});

jest.mock("@ppb/the-wall-native", () => ({
  ActionLink: jest.fn(({ props }) => <action-link-mock {...props}></action-link-mock>),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("./snowflakes/ForbiddenContent/ForbiddenContent.native", () => ({
  ForbiddenContent: jest.fn(({ props, children }) => <forbidden-mock {...props}>{children}</forbidden-mock>),
}));

function renderForbiddenContentCard({
  message = "|LOG_IN| or |JOIN_NOW| to see My Bets",
  theme = ComponentTheme.Dark,
  size = ForbiddenCardSize.Default,
  labels = {
    logIn: "Log In",
    joinNow: "Join Now",
  },
} = {}) {
  return render(<ForbiddenContentCard message={message} theme={theme} size={size} labels={labels} />);
}

afterEach(() => {
  jest.clearAllMocks();
});

describe("ForbiddenContentCard Component", () => {
  it("should render the Forbidden Content card with the correct props", () => {
    renderForbiddenContentCard();

    expect(ForbiddenContent).toHaveBeenCalledTimes(1);
    expect(ForbiddenContent).toHaveBeenCalledWith(
      {
        theme: ComponentTheme.Dark,
        size: ForbiddenCardSize.Default,
        content: expect.any(Function),
      },
      undefined,
    );

    // Forces the content load
    const contentLoad = ForbiddenContent.mock.calls[0][0].content();

    expect(contentLoad.props.children.length).toBe(4);
    expect(contentLoad.props.children[0].props).toMatchObject({ text: "Log In" });
    expect(contentLoad.props.children[1].props).toMatchObject({ children: " or " });
    expect(contentLoad.props.children[2].props).toMatchObject({ text: "Join Now" });
    expect(contentLoad.props.children[3].props).toMatchObject({ children: " to see My Bets" });
  });

  describe("and onLoginButtonTap trigger", () => {
    it("should call CET login", () => {
      renderForbiddenContentCard();
      // Forces the content load
      const contentLoad = ForbiddenContent.mock.calls[0][0].content();

      const firstChildren = contentLoad.props.children[0].props;
      const { onClick } = firstChildren;
      onClick();

      expect(useLogin()).toHaveBeenCalledTimes(1);
    });
  });

  describe("and onJoinNowButtonTap trigger", () => {
    it("should call CET AuthPage", () => {
      renderForbiddenContentCard();
      // Forces the content load
      const contentLoad = ForbiddenContent.mock.calls[0][0].content();

      const thirdChildren = contentLoad.props.children[2].props;
      const { onClick } = thirdChildren;
      onClick();

      expect(useJoinNow()).toHaveBeenCalledTimes(1);
    });
  });
});
