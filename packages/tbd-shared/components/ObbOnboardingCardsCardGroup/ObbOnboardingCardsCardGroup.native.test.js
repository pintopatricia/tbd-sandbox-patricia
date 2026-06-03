import "jest-dom/extend-expect";
import { render } from "@testing-library/react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import ObbOnboardingCardsCardGroup from "./ObbOnboardingCardsCardGroup.native";
import ObbOnboardingCard from "../ObbOnboardingCard/ObbOnboardingCard.native";
import { CARD_WIDTH, CARD_GAP } from "./ObbOnboardingCardsCardGroup.native.styles";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/the-wall-native", () => ({
  ScrollableSwimlane: jest.fn(({ children, ...props }) => (
    <scrollable-swimlane-mock {...props}>{children}</scrollable-swimlane-mock>
  )),
  StatusLabel: jest.fn(({ props }) => <status-label-component {...props}></status-label-component>),
}));

jest.mock("../ObbOnboardingCard/ObbOnboardingCard.native", () =>
  jest.fn(() => <obb-onboarding-card-mock data-testid="obb-onboarding-card-mock" />),
);

const makeCard = (participantUrn) => ({
  participants: [{ typename: "ObbFootballPlayer", urn: participantUrn }],
  legs: [{ templateId: "t1", templateParams: {}, quote: {} }],
});

const card1 = makeCard("participant:1");
const card2 = makeCard("participant:2");
const card3 = makeCard("participant:3");

const dispatchOnboardingCardGroupDisplayed = jest.fn();
const dispatchOnboardingCardGroupScrollEvent = jest.fn();
const dispatchObbEventSelection = jest.fn();
const dispatchDeleteObbOnboardingCardsCardGroup = jest.fn();

const defaultEvent = {
  urn: "event:1",
  name: "Man City vs Liverpool",
  eventId: "12345",
  openDate: "2099-01-01T00:00:00Z",
};

const defaultProps = {
  urn: "onboardingCardsCardGroup:1",
  title: "Popular Picks",
  badgeLabel: "New",
  event: defaultEvent,
  clearCardGroupView: false,
  onboardingCards: [card1, card2, card3],
  dispatchOnboardingCardGroupDisplayed,
  dispatchOnboardingCardGroupScrollEvent,
  dispatchObbEventSelection,
  dispatchDeleteObbOnboardingCardsCardGroup,
};

function renderObbOnboardingCardsCardGroup(props = {}) {
  const componentProps = { ...defaultProps, ...props };
  return render(<ObbOnboardingCardsCardGroup {...componentProps} />);
}

function getFlatListProps() {
  const swimlaneCall = ScrollableSwimlane.mock.calls[0][0];
  return swimlaneCall.children.props;
}

describe("ObbOnboardingCardsCardGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when all the data is provided", () => {
    it("should render the swimlane with title, badge icon and cards", () => {
      renderObbOnboardingCardsCardGroup();

      expect(ScrollableSwimlane).toHaveBeenCalledTimes(1);
      expect(ScrollableSwimlane).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Popular Picks",
          iconPosition: "after",
          icon: expect.any(Object),
          children: expect.any(Object),
        }),
        undefined,
      );

      const flatListProps = getFlatListProps();

      expect(flatListProps.data).toEqual([card1, card2, card3]);
      expect(flatListProps.horizontal).toBe(true);
      expect(flatListProps.scrollEnabled).toBe(true);
      expect(flatListProps.showsHorizontalScrollIndicator).toBe(false);
      expect(flatListProps.pagingEnabled).toBe(false);
      expect(flatListProps.snapToInterval).toBeDefined();
      expect(flatListProps.decelerationRate).toBe(0.98);
    });

    it("should render a card through the ObbOnboardingCard component", () => {
      renderObbOnboardingCardsCardGroup();

      const { renderItem } = getFlatListProps();
      render(renderItem({ item: card2 }));

      expect(ObbOnboardingCard).toHaveBeenCalledWith(
        expect.objectContaining({ card: card2, event: defaultEvent }),
        undefined,
      );
    });

    it("keyExtractor should return a stable key per index", () => {
      renderObbOnboardingCardsCardGroup();

      const { keyExtractor } = getFlatListProps();

      expect(keyExtractor(card1, 0)).toBe("onboarding-card-0");
      expect(keyExtractor(card1, 2)).toBe("onboarding-card-2");
    });
  });

  describe("when no badge label is provided", () => {
    it("should not render an icon in the swimlane header", () => {
      renderObbOnboardingCardsCardGroup({ badgeLabel: undefined });

      expect(ScrollableSwimlane).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: undefined,
        }),
        undefined,
      );
    });
  });

  describe("when there is only one card", () => {
    it("should disable scroll and snap", () => {
      renderObbOnboardingCardsCardGroup({ onboardingCards: [card1] });

      const flatListProps = getFlatListProps();

      expect(flatListProps.scrollEnabled).toBe(false);
      expect(flatListProps.getItemLayout).toBeUndefined();
      expect(flatListProps.pagingEnabled).toBeUndefined();
      expect(flatListProps.snapToInterval).toBeUndefined();
      expect(flatListProps.decelerationRate).toBeUndefined();
    });
  });

  describe("when there are no cards", () => {
    it("should render an empty flatlist without snap behaviour", () => {
      renderObbOnboardingCardsCardGroup({ onboardingCards: [] });

      const flatListProps = getFlatListProps();

      expect(flatListProps.data).toEqual([]);
      expect(flatListProps.scrollEnabled).toBe(false);
      expect(flatListProps.getItemLayout).toBeUndefined();
      expect(flatListProps.snapToInterval).toBeUndefined();
    });
  });

  describe("displayed event", () => {
    it("should dispatch the displayed event on mount", () => {
      renderObbOnboardingCardsCardGroup();

      expect(dispatchOnboardingCardGroupDisplayed).toHaveBeenCalledWith(defaultEvent.name, 3);
    });
  });

  describe("when clearCardGroupView is true", () => {
    it("should dispatch the delete action and skip the displayed event", () => {
      renderObbOnboardingCardsCardGroup({ clearCardGroupView: true });

      expect(dispatchDeleteObbOnboardingCardsCardGroup).toHaveBeenCalledTimes(1);
      expect(dispatchOnboardingCardGroupDisplayed).not.toHaveBeenCalled();
    });

    it("should dispatch the delete action when the event starts after mount without redispatching displayed", () => {
      const { rerender } = renderObbOnboardingCardsCardGroup();

      expect(dispatchOnboardingCardGroupDisplayed).toHaveBeenCalledTimes(1);
      expect(dispatchDeleteObbOnboardingCardsCardGroup).not.toHaveBeenCalled();

      rerender(<ObbOnboardingCardsCardGroup {...defaultProps} clearCardGroupView={true} />);

      expect(dispatchDeleteObbOnboardingCardsCardGroup).toHaveBeenCalledTimes(1);
      expect(dispatchOnboardingCardGroupDisplayed).toHaveBeenCalledTimes(1);
    });
  });

  describe("scroll direction detection", () => {
    it("should pass onMomentumScrollEnd to the FlatList", () => {
      renderObbOnboardingCardsCardGroup();

      expect(getFlatListProps().onMomentumScrollEnd).toBeInstanceOf(Function);
    });

    it("should dispatch swiped right when scrolling forward to a new card", () => {
      renderObbOnboardingCardsCardGroup();
      const { onMomentumScrollEnd } = getFlatListProps();

      onMomentumScrollEnd({ nativeEvent: { contentOffset: { x: CARD_WIDTH + CARD_GAP } } });

      expect(dispatchOnboardingCardGroupScrollEvent).toHaveBeenCalledWith(defaultEvent.name, "right");
    });

    it("should dispatch swiped left when scrolling back to a previous card", () => {
      renderObbOnboardingCardsCardGroup();
      const { onMomentumScrollEnd } = getFlatListProps();

      onMomentumScrollEnd({ nativeEvent: { contentOffset: { x: 2 * (CARD_WIDTH + CARD_GAP) } } });
      onMomentumScrollEnd({ nativeEvent: { contentOffset: { x: CARD_WIDTH + CARD_GAP } } });

      expect(dispatchOnboardingCardGroupScrollEvent).toHaveBeenLastCalledWith(defaultEvent.name, "left");
    });

    it("should not dispatch when scroll ends on the same card", () => {
      renderObbOnboardingCardsCardGroup();
      const { onMomentumScrollEnd } = getFlatListProps();

      onMomentumScrollEnd({ nativeEvent: { contentOffset: { x: 0 } } });

      expect(dispatchOnboardingCardGroupScrollEvent).not.toHaveBeenCalled();
    });
  });
});
