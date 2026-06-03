import { render } from "@testing-library/react-native";
import { navigate } from "@ppb/tbd-router/native";
import { ScrollableSwimlane, IconButton } from "@ppb/the-wall-native";
import SportRibbonCardGroup from "./SportRibbonCardGroup.native";

jest.mock("@ppb/the-wall-native", () => ({
  ScrollableSwimlane: jest.fn(({ children }) => <scrollable-mock>{children}</scrollable-mock>),
  IconButton: jest.fn(() => <icon-button-mock />),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("@ppb/tbd-router/native", () => ({ navigate: jest.fn() }));

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

const item1Mock = {
  title: "Football",
  sportId: 1,
  viewLink: {
    viewUrl: "/football/s-1",
    viewUrn: "ppb:tbd:view:generic:football",
  },
};

const item2Mock = {
  label: null,
  title: "Inplay",
  badge: "INPLAY",
  viewLink: {
    viewUrl: "/inplay/d-inplay",
    viewUrn: "ppb:tbd:view:generic:inplay",
  },
  icon: null,
};

const item3Mock = {
  title: "SuperSpins",
  badge: null,
  viewLink: {
    viewUrl: "https://www.google.com",
    viewUrn: "ppb:tbd:view:external:external",
  },
  icon: {
    category: "icon-category",
    id: "icon-id",
  },
};

const item3MockWithLabel = {
  ...item3Mock,
  label: "NEW",
};

const itemsMock = [item1Mock, item2Mock, item3Mock];
const itemsMockWithLabel = [item1Mock, item2Mock, item3MockWithLabel];

const getIconMock = jest.fn(() => "MockedIcon");
const dispatchNavigationViewFromFavourites = jest.fn();

const renderSportRibbonCardGroup = (withoutLabel = false) =>
  render(
    <SportRibbonCardGroup
      items={withoutLabel ? itemsMock : itemsMockWithLabel}
      isSportsRibbonHighlighted={true}
      getIcon={getIconMock}
      dispatchNavigationViewFromFavourites={dispatchNavigationViewFromFavourites}
    />,
  );

describe("Sport Ribbon Card Group", () => {
  beforeEach(jest.clearAllMocks);
  describe("when there are items to render", () => {
    const baseIconButtonProps = {
      isLargeIcon: true,
      isHighlighted: true,
      icon: "MockedIcon",
      onPress: expect.any(Function),
      tag: undefined,
    };

    const runIconButtonsExpects = (itemMock, baseProps, props) => {
      expect(getIconMock).toHaveBeenCalledWith(itemMock.icon, itemMock.badge, itemMock.sportId);
      expect(IconButton).toHaveBeenCalledWith({ ...baseProps, ...props }, undefined);
    };

    describe("when any item has a label", () => {
      it("should render Swimlane correctly", () => {
        renderSportRibbonCardGroup();
        expect(ScrollableSwimlane).toHaveBeenCalledWith(
          {
            children: expect.any(Object),
            isHighlighted: true,
          },
          undefined,
        );
      });

      it("should render IconButtons correctly", () => {
        renderSportRibbonCardGroup();
        runIconButtonsExpects(item1Mock, baseIconButtonProps, {
          text: item1Mock.title,
          tag: "",
        });

        runIconButtonsExpects(item2Mock, baseIconButtonProps, {
          text: item2Mock.title,
          tag: "",
        });

        runIconButtonsExpects(item3MockWithLabel, baseIconButtonProps, {
          text: item3MockWithLabel.title,
          tag: item3MockWithLabel.label,
        });
      });
    });

    describe("when no item has a label", () => {
      it("should render Swimlane correctly", () => {
        renderSportRibbonCardGroup(true);
        expect(ScrollableSwimlane).toHaveBeenCalledWith(
          {
            children: expect.any(Object),
            isHighlighted: true,
          },
          undefined,
        );
      });

      it("should render IconButtons correctly", () => {
        renderSportRibbonCardGroup(true);
        const withoutLabelBaseProps = {
          ...baseIconButtonProps,
        };

        runIconButtonsExpects(item1Mock, withoutLabelBaseProps, {
          text: item1Mock.title,
        });

        runIconButtonsExpects(item2Mock, withoutLabelBaseProps, {
          text: item2Mock.title,
        });

        runIconButtonsExpects(item3Mock, withoutLabelBaseProps, {
          text: item3Mock.title,
        });
      });
    });

    it("should handle click events", () => {
      const validateDispatchCalls = (itemMock) => {
        expect(navigate).toHaveBeenCalledWith(itemMock.viewLink);
        expect(dispatchNavigationViewFromFavourites).toHaveBeenCalledWith(
          itemMock.title,
          itemMock.viewLink.viewUrl,
          undefined,
        );
      };

      renderSportRibbonCardGroup();

      IconButton.mock.calls[0][0].onPress();

      validateDispatchCalls(item1Mock);

      IconButton.mock.calls[1][0].onPress();

      validateDispatchCalls(item2Mock);

      IconButton.mock.calls[2][0].onPress();

      validateDispatchCalls(item3Mock);
    });
  });
});
