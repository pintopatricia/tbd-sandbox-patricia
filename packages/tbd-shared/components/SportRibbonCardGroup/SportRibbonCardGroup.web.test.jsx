import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { IconButton, ScrollableSwimlane } from "@ppb/the-wall-web";
import SportRibbonCardGroup from "./SportRibbonCardGroup.web";

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

const dispatchRouterPushAction = jest.fn();
const dispatchNavigationViewFromFavourites = jest.fn();
const getIconMock = jest.fn(() => "MockedIcon");

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-web", () => ({
  ScrollableSwimlane: jest.fn(({ children, ...props }) => (
    <scrollable-swimlane-mock {...props}>{children}</scrollable-swimlane-mock>
  )),
  IconButton: jest.fn(() => <icon-button-mock />),
}));

function renderSportRibbonCardGroup(withoutLabel = false) {
  return render(
    <SportRibbonCardGroup
      items={withoutLabel ? itemsMock : itemsMockWithLabel}
      isSportsRibbonHighlighted={true}
      getIcon={getIconMock}
      dispatchRouterPushAction={dispatchRouterPushAction}
      dispatchNavigationViewFromFavourites={dispatchNavigationViewFromFavourites}
    />,
  );
}

describe("SportRibbonCardGroup", () => {
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
      const eventMock = {
        preventDefault: jest.fn(),
      };

      const validateDispatchCalls = (itemMock) => {
        expect(eventMock.preventDefault).toHaveBeenCalled();
        expect(dispatchRouterPushAction).toHaveBeenCalledWith(itemMock.viewLink);
        expect(dispatchNavigationViewFromFavourites).toHaveBeenCalledWith(
          itemMock.title,
          itemMock.viewLink.viewUrl,
          undefined,
        );
      };

      renderSportRibbonCardGroup();

      IconButton.mock.calls[0][0].onPress(eventMock);

      validateDispatchCalls(item1Mock);

      IconButton.mock.calls[1][0].onPress(eventMock);

      validateDispatchCalls(item2Mock);

      IconButton.mock.calls[2][0].onPress(eventMock);

      validateDispatchCalls(item3Mock);
    });
  });
});
