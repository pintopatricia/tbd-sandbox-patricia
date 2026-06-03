import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { QuickLink } from "@ppb/the-wall-web";
import ConnectedCard from "../../Card";
import DefaultGamingBrowse from "./DefaultGamingBrowse.web";
import { SUBTITLE } from "./DefaultGamingBrowse.web.selectors";

jest.mock("@ppb/the-wall-web", () => ({
  QuickLink: jest.fn((props) => <quick-link-mock {...props} />),
}));
jest.mock("../../Card", () => jest.fn(() => <connected-card />));

const mocki18n = {
  i18n: {
    title: "I18N.CATEGORY.CASINO_ESSENTIALS",
    subtitle: "I18N.CATEGORY.MORE_CASINO_GAMES",
  },
};

const mockCategoryLinks = [
  {
    text: "I18N.CATEGORY.SLOTS",
    viewLink: {
      viewUrl: "casino/c/gaming-slots/gamingCategory:gaming-slots",
      viewUrn: "ppb:tbd:view:gamingCategory:gaming-slots",
    },
    target: "_self",
  },
];

function renderDefaultGamingBrowse({
  urn = "fake-urn",
  defaultGamingi18n = mocki18n,
  typename = "ViewZone",
  categoryLinks = mockCategoryLinks,
  dispatchRouterPushAction = jest.fn(),
  dispatchExternalRouterPushAction = jest.fn(),
}) {
  return render(
    <DefaultGamingBrowse
      urn={urn}
      defaultGamingi18n={defaultGamingi18n}
      typename={typename}
      categoryLinks={categoryLinks}
      dispatchRouterPushAction={dispatchRouterPushAction}
      dispatchExternalRouterPushAction={dispatchExternalRouterPushAction}
    />,
  );
}

describe("DefaultGamingBrowse component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when initializing the component", () => {
    it("should render ConnectedCard component", () => {
      renderDefaultGamingBrowse({});
      expect(ConnectedCard).toHaveBeenCalledTimes(1);
    });

    it("should render subtitle", () => {
      const { container } = renderDefaultGamingBrowse({});
      const subtitleLabel = container.querySelector(SUBTITLE);

      expect(subtitleLabel).toHaveTextContent("I18N.CATEGORY.MORE_CASINO_GAMES");
    });

    it("should initialize QuickLink component with the correct props", () => {
      renderDefaultGamingBrowse({});
      expect(QuickLink).toHaveBeenCalledTimes(1);
      expect(QuickLink).toHaveBeenCalledWith(
        {
          item: {
            target: "_self",
            text: "I18N.CATEGORY.SLOTS",
            viewLink: {
              viewUrl: "casino/c/gaming-slots/gamingCategory:gaming-slots",
              viewUrn: "ppb:tbd:view:gamingCategory:gaming-slots",
            },
          },
          onLinkClick: expect.any(Function),
          roundCorners: { topLeft: true, topRight: true, bottomLeft: true, bottomRight: true },
        },
        undefined,
      );
    });
  });
  describe("when clicking quick link", () => {
    it("should execute dispatch router push action callback", () => {
      const dispatchRouterPushAction = jest.fn();
      renderDefaultGamingBrowse({ dispatchRouterPushAction });
      const browserEventMock = { preventDefault: jest.fn() };
      const { onLinkClick } = QuickLink.mock.calls[0][0];

      onLinkClick(browserEventMock);

      expect(browserEventMock.preventDefault).toHaveBeenCalled();
      expect(dispatchRouterPushAction).toHaveBeenCalledWith({
        viewUrl: "casino/c/gaming-slots/gamingCategory:gaming-slots",
        viewUrn: "ppb:tbd:view:gamingCategory:gaming-slots",
      });
    });

    it("should execute dispatch external router push action callback", () => {
      const dispatchExternalRouterPushAction = jest.fn();
      const categoryLinks = [
        {
          text: "I18N.CATEGORY.SLOTS",
          viewLink: {
            viewUrl: "casino/c/gaming-slots/gamingCategory:gaming-slots",
            viewUrn: "ppb:tbd:view:gamingCategory:gaming-slots",
            viewDisplayMode: "SELF_INAPP",
          },
          target: "_self",
        },
      ];

      renderDefaultGamingBrowse({ dispatchExternalRouterPushAction, categoryLinks });
      const browserEventMock = { preventDefault: jest.fn() };
      const { onLinkClick } = QuickLink.mock.calls[0][0];

      onLinkClick(browserEventMock);

      expect(browserEventMock.preventDefault).toHaveBeenCalled();
      expect(dispatchExternalRouterPushAction).toHaveBeenCalledWith(categoryLinks[0].viewLink);
    });
  });
});
