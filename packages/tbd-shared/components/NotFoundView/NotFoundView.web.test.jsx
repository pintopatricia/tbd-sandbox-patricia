import { render, act, fireEvent } from "@testing-library/react";
import "jest-dom/extend-expect";
import { EmptyState } from "@ppb/the-wall-web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import NotFoundView from "./NotFoundView.web";
import { LINK } from "./NotFoundView.web.selectors";

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));

jest.mock("../Card/Card.web", () => jest.fn(() => <card-mock />));

jest.mock("@ppb/the-wall-web", () => ({
  EmptyState: jest.fn(() => <empty-state-mock></empty-state-mock>),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

const messagesMock = {
  message: "Unfortunately this page either doesn’t exist or has been moved.",
  title: "Oops, sorry about that",
};

const linksMock = [
  {
    label: "I18N.NAVIGATION_BAR.HOME",
    viewLink: {
      viewUrl: "",
      viewUrn: "ppb:tbd:view:generic:home",
    },
    icon: "HOME",
  },
  {
    label: "I18N.NAVIGATION_BAR.MY_BETS",
    viewLink: {
      viewUrl: "mybets/myBets-open",
      viewUrn: "ppb:tbd:view:myBets:open",
    },
    icon: "MY_BETS",
  },
  {
    label: "I18N.SPORT_EVENT.IN_PLAY",
    viewLink: {
      viewUrl: "view/generic:inplay",
      viewUrn: "ppb:tbd:view:generic:inplay",
    },
    icon: "IN_PLAY",
  },
];

const itemsMock = [
  {
    typename: "RegulatoryCard",
    urn: "ppb:tbd:card:regulatory:footer",
  },
];

const hasErrorViewImageMock = true;

const emptyItemsMock = [];

const dispatchNavigationNotFoundViewLoadedMock = jest.fn(() => {});
const dispatchNavigationFromNotFoundViewMock = jest.fn();
const dispatchRouterPushActionMock = jest.fn();

function renderNotFoundPage(
  messages,
  links,
  items,
  hasErrorViewImage,
  dispatchNavigationNotFoundViewLoaded,
  dispatchNavigationFromNotFoundView,
  dispatchRouterPushAction,
) {
  return render(
    <NotFoundView
      messages={messages}
      links={links}
      items={items}
      hasErrorViewImage={hasErrorViewImage}
      dispatchNavigationNotFoundViewLoaded={dispatchNavigationNotFoundViewLoaded}
      dispatchNavigationFromNotFoundView={dispatchNavigationFromNotFoundView}
      dispatchRouterPushAction={dispatchRouterPushAction}
    />,
  );
}

describe("NotFound View", () => {
  describe("when view is rendered", () => {
    beforeAll(() => {
      jest.clearAllMocks();
      renderNotFoundPage(
        messagesMock,
        linksMock,
        itemsMock,
        hasErrorViewImageMock,
        dispatchNavigationNotFoundViewLoadedMock,
        dispatchNavigationFromNotFoundViewMock,
        dispatchRouterPushActionMock,
      );
    });

    it("should call dispatchNavigationNotFoundViewLoaded", () => {
      expect(dispatchNavigationNotFoundViewLoadedMock).toHaveBeenCalled();
    });

    it("should call EmptyState with correct props", () => {
      expect(EmptyState).toHaveBeenCalledWith(
        {
          message: "Unfortunately this page either doesn’t exist or has been moved.",
          title: "Oops, sorry about that",
          hasImage: true,
        },
        undefined,
      );
    });

    it("should call ConnectedCard with correct props", () => {
      expect(ConnectedCard).toHaveBeenCalledWith(
        { component: Card, typename: "RegulatoryCard", urn: "ppb:tbd:card:regulatory:footer" },
        undefined,
      );
    });
  });

  describe("when view has links and first link is clicked", () => {
    let container;
    beforeAll(() => {
      jest.clearAllMocks();
      ({ container } = renderNotFoundPage(
        messagesMock,
        linksMock,
        itemsMock,
        hasErrorViewImageMock,
        dispatchNavigationNotFoundViewLoadedMock,
        dispatchNavigationFromNotFoundViewMock,
        dispatchRouterPushActionMock,
      ));

      act(() => {
        const link = container.querySelector(LINK);
        fireEvent.click(link);
      });
    });

    it("should call the dispatchNavigationFromNotFoundView with correct params", () => {
      expect(dispatchNavigationFromNotFoundViewMock).toHaveBeenCalledWith("I18N.NAVIGATION_BAR.HOME", "");
    });

    it("should call the dispatchRouterPushAction with correct params", () => {
      expect(dispatchRouterPushActionMock).toHaveBeenCalledWith({ viewUrn: "ppb:tbd:view:generic:home", viewUrl: "" });
    });
  });

  describe("When view has no items", () => {
    beforeAll(() => {
      jest.clearAllMocks();
      renderNotFoundPage(
        messagesMock,
        linksMock,
        emptyItemsMock,
        hasErrorViewImageMock,
        dispatchNavigationNotFoundViewLoadedMock,
        dispatchNavigationFromNotFoundViewMock,
        dispatchRouterPushActionMock,
      );
    });

    it("should not call ConnectedCard", () => {
      expect(ConnectedCard).not.toHaveBeenCalled();
    });
  });
});
