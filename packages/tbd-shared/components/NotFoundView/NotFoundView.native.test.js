import { render, act } from "@testing-library/react-native";
import { Pressable } from "react-native";
import { EmptyState } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router/native";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import NotFoundView from "./NotFoundView.native";

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.native", () => jest.fn(() => <card-mock />));

jest.mock("@ppb/the-wall-native", () => ({
  EmptyState: jest.fn(() => <empty-state-mock></empty-state-mock>),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  heights: {},
  spacings: {},
  colors: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

jest.mock("react-native", () => {
  const { StyleSheet } = jest.requireActual("react-native");

  return {
    Text: jest.fn((props) => <text-mock {...props} />),
    View: jest.fn((props) => <view-mock {...props} />),
    ScrollView: jest.fn((props) => <scroll-view-mock {...props} />),
    Pressable: jest.fn((props) => <pressable-mock {...props} />),
    StyleSheet,
    Platform: {
      OS: "ios",
    },
  };
});

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(() => {}),
}));

const messageMock = {
  message: "Unfortunately this page either doesn’t exist or has been moved.",
  title: "Oops, sorry about that",
};

const linksMock = [
  {
    label: "I18N.NAVIGATION_BAR.HOME",
    viewLink: {
      viewUrl: "",
      viewUrn: "ppb:tbd:generic:home",
    },
    icon: "HOME",
  },
  {
    label: "I18N.NAVIGATION_BAR.MY_BETS",
    viewLink: {
      viewUrl: "mybets/myBets:sbk/open",
      viewUrn: "ppb:tbd:view:myBets:sbk/open",
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

const viewWithoutItemsMock = {
  typename: "NotFoundView",
  url: "notfound/notfound:notfound",
  urn: "ppb:tbd:view:notfound:notfound",
  items: [],
};

const hasErrorViewImageMock = true;

function renderNotFoundPage(message, links, items, hasErrorViewImage) {
  return render(<NotFoundView messages={message} links={links} items={items} hasErrorViewImage={hasErrorViewImage} />);
}

describe("NotFoundView", () => {
  beforeEach(jest.clearAllMocks);

  describe("when view is rendered", () => {
    beforeEach(() => {
      renderNotFoundPage(messageMock, linksMock, itemsMock, hasErrorViewImageMock);
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
        { component: Card, typename: "RegulatoryCard", urn: "ppb:tbd:card:regulatory:footer", visible: true },
        undefined,
      );
    });
  });

  describe("When user clicks on link", () => {
    beforeEach(() => {
      renderNotFoundPage(messageMock, linksMock, itemsMock, hasErrorViewImageMock);
    });

    it("should call navigate", async () => {
      act(() => {
        Pressable.mock.calls[0][0].onPress();
      });
      expect(navigate).toHaveBeenCalledWith(linksMock[0].viewLink);
    });
  });

  describe("When view has no items", () => {
    it("should not call ConnectedCard", () => {
      renderNotFoundPage(messageMock, linksMock, viewWithoutItemsMock, hasErrorViewImageMock);
      expect(ConnectedCard).not.toHaveBeenCalled();
    });
  });
});
