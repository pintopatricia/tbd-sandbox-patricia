import { ComponentTheme, ActionLinkTypography } from "@ppb/the-wall-common/types";
import { ActionLink } from "@ppb/the-wall-web";
import { render } from "@testing-library/react/dist/pure";
import ForbiddenContentCard from "./ForbiddenContentCard.web";
import { ForbiddenContent } from "./snowflakes/ForbiddenContent/ForbiddenContent.web";
import { ForbiddenCardSize } from "./snowflakes/ForbiddenContent/ForbiddenContent.types";

jest.mock("@ppb/the-wall-web", () => ({
  ActionLink: jest.fn(({ props }) => <div {...props}></div>),
}));

jest.mock("./snowflakes/ForbiddenContent/ForbiddenContent.web", () => ({
  ForbiddenContent: jest.fn(({ props, children }) => <div {...props}>{children}</div>),
}));

const dispatchExternalPushActionMock = jest.fn();
const dispatchSawCardActionMock = jest.fn();

global.window = Object.create(window);
Object.defineProperty(window, "location", {
  value: {
    href: "https://www.betfair.com/betting/football/sport:1",
  },
});

function renderForbiddenContentCard({
  message = "|LOG_IN| or |JOIN_NOW| to see My Bets",
  theme = ComponentTheme.Dark,
  size = ForbiddenCardSize.Default,
  labels = {
    logIn: "Log In",
    joinNow: "Join Now",
  },
  authData = {
    SSO_URL: "SSO_URL",
    JOIN_DATA: { joinNowLink: "JOIN_URL" },
  },
  anchorTextGTM = "anchorTextGTM",
  dispatchExternalPushAction = dispatchExternalPushActionMock,
  dispatchSawCardAction = dispatchSawCardActionMock,
} = {}) {
  return render(
    <ForbiddenContentCard
      message={message}
      theme={theme}
      size={size}
      labels={labels}
      authData={authData}
      anchorTextGTM={anchorTextGTM}
      dispatchExternalPushAction={dispatchExternalPushAction}
      dispatchSawCardAction={dispatchSawCardAction}
    />,
  );
}

afterEach(() => {
  jest.clearAllMocks();
});

describe("ForbiddenContentCard Component", () => {
  it("should render the Forbidden Content card with the correct props", () => {
    renderForbiddenContentCard();

    expect(ActionLink).toHaveBeenCalledTimes(2);
    expect(ActionLink).toHaveBeenNthCalledWith(
      1,
      {
        noPadding: true,
        onClick: expect.any(Function),
        text: "Log In",
        typography: ActionLinkTypography.Regular,
      },
      undefined,
    );
    expect(ActionLink).toHaveBeenNthCalledWith(
      2,
      {
        noPadding: true,
        onClick: expect.any(Function),
        text: "Join Now",
        typography: ActionLinkTypography.Regular,
      },
      undefined,
    );

    expect(ForbiddenContent).toHaveBeenCalledTimes(1);
    expect(ForbiddenContent).toHaveBeenCalledWith(
      {
        theme: ComponentTheme.Dark,
        size: ForbiddenCardSize.Default,
        children: expect.any(Array),
      },
      undefined,
    );

    const [args] = ForbiddenContent.mock.calls[0];

    expect(args.children.length).toBe(4);
    expect(args.children[0].props).toMatchObject({ text: "Log In" });
    expect(args.children[1].props).toMatchObject({ children: " or " });
    expect(args.children[2].props).toMatchObject({ text: "Join Now" });
    expect(args.children[3].props).toMatchObject({ children: " to see My Bets" });
  });

  it("should call dispatchSawCardAction", () => {
    renderForbiddenContentCard();

    expect(dispatchSawCardActionMock).toHaveBeenCalledTimes(1);
    expect(dispatchSawCardActionMock).toHaveBeenCalledWith("anchorTextGTM");
  });

  describe("and onLoginButtonClick trigger", () => {
    it("should dispatchExternalPushAction", () => {
      renderForbiddenContentCard();

      const { onClick } = ActionLink.mock.calls[0][0];
      onClick();

      expect(dispatchExternalPushActionMock).toHaveBeenCalledTimes(1);
      expect(dispatchExternalPushActionMock).toHaveBeenCalledWith(
        "login",
        "anchorTextGTM",
        "SSO_URL&url=https%3A%2F%2Fwww.betfair.com%2Fbetting%2Ffootball%2Fsport%3A1",
      );
    });
  });

  describe("and onJoinNowButtonClick trigger", () => {
    it("should dispatchExternalPushAction", () => {
      renderForbiddenContentCard();

      const { onClick } = ActionLink.mock.calls[1][0];
      onClick();

      expect(dispatchExternalPushActionMock).toHaveBeenCalledTimes(1);
      expect(dispatchExternalPushActionMock).toHaveBeenCalledWith("join now", "anchorTextGTM", "JOIN_URL");
    });
  });
});
