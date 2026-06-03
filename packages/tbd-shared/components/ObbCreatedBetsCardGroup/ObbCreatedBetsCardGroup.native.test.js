 
import "jest-dom/extend-expect";
import { render } from "@testing-library/react-native";
import { ScrollableSwimlane } from "@ppb/the-wall-native";
import { navigate } from "@ppb/tbd-router";
import ConnectedObbCreatedBetsCard from "../ObbCreatedBetsCard";
import ObbCreatedBetsCardGroup from "./ObbCreatedBetsCardGroup.native";
import { FlatList } from "../FlatList.native";
import ObbCreatedBetsCard from "../ObbCreatedBetsCard/ObbCreatedBetsCard.native";

jest.mock("react", () => ({
  ...jest.requireActual("react"),
  useContext: jest.fn(() => ({
    isDesktopLayout: false,
  })),
}));

jest.mock("../FlatList.native", () => ({
  FlatList: jest.fn(() => <flatlist-mock />),
}));

jest.mock("@ppb/tbd-router/native", () => ({ navigate: jest.fn() }));

jest.mock("@ppb/the-wall-native", () => ({
  ScrollableSwimlane: jest.fn(({ children, ...props }) => (
    <scrollable-swimlane-mock {...props}>{children}</scrollable-swimlane-mock>
  )),
  StatusLabel: jest.fn(({ props }) => <status-label-component {...props}></status-label-component>),
}));

jest.mock("../ObbCreatedBetsCard", () =>
  jest.fn(() => <connected-obb-created-bets-card data-testid="connected-obb-created-bets-card" />),
);

jest.mock("../ObbCreatedBetsCard/ObbCreatedBetsCard.native", () =>
  jest.fn(() => <obb-created-bets-card-mock data-testid="obb-created-bets-card-mock" />),
);

const dispatchPushActionSpy = jest.fn();
const dispatchLinkClickSpy = jest.fn();

const defaultProps = {
  urn: "createdBetsCardGroup:1",
  title: "Obb Created Bets Card Group Title",
  headerBadgeLabel: "New",
  headerViewLink: {
    viewUrl: "header Url",
    viewUrn: "header Urn",
  },
  headerViewLinkLabel: "Header View Link Label",
  cards: [{ urn: "createdBetsCard:1" }, { urn: "createdBetsCard:2" }, { urn: "createdBetsCard:3" }],
  dispatchPushAction: dispatchPushActionSpy,
  dispatchLinkClick: dispatchLinkClickSpy,
};

function renderObbCreatedBetsCardGroup(props = {}) {
  const componentProps = { ...defaultProps, ...props };
  return render(<ObbCreatedBetsCardGroup {...componentProps} />);
}

describe("ObbCreatedBetsCardGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when all the data is provided", () => {
    it("should render the card group correctly", () => {
      renderObbCreatedBetsCardGroup();

      expect(ScrollableSwimlane).toHaveBeenCalledTimes(1);
      expect(ScrollableSwimlane).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Obb Created Bets Card Group Title",
          iconPosition: "after",
          icon: expect.any(Object),
          navLink: {
            label: "Header View Link Label",
            viewLink: {
              viewUrl: "header Url",
              viewUrn: "header Urn",
            },
          },
          onNavLinkPress: expect.any(Function),
          children: expect.any(Object),
        }),
        undefined,
      );

      expect(FlatList).toHaveBeenCalledTimes(1);

      expect(FlatList).toHaveBeenCalledWith(
        expect.objectContaining({
          data: [{ urn: "createdBetsCard:1" }, { urn: "createdBetsCard:2" }, { urn: "createdBetsCard:3" }],
          horizontal: true,
          scrollEnabled: true,
          renderItem: expect.any(Function),
          keyExtractor: expect.any(Function),
          showsHorizontalScrollIndicator: false,
          getItemLayout: expect.any(Function),
          contentContainerStyle: expect.any(Object),
          pagingEnabled: false,
          snapToInterval: expect.any(Number),
          decelerationRate: expect.any(Number),
        }),
        undefined,
      );

      const { renderItem } = FlatList.mock.calls[0][0];

      const firstCard = renderItem({ item: { urn: "urn", typename: "Card" }, index: 0 });

      render(firstCard);

      expect(ConnectedObbCreatedBetsCard).toHaveBeenCalledWith(
        { urn: "urn", fullWidth: false, component: ObbCreatedBetsCard, cardIndex: 0 },
        undefined,
      );
    });
  });

  describe("when no header badge label is provided", () => {
    it("should not render a status label in the header", () => {
      renderObbCreatedBetsCardGroup({ headerBadgeLabel: null });

      expect(ScrollableSwimlane).toHaveBeenCalledWith(
        expect.objectContaining({
          icon: null,
        }),
        undefined,
      );
    });
  });

  describe("when no header view link is provided", () => {
    it("should not render a nav link in the header", () => {
      renderObbCreatedBetsCardGroup({ headerViewLink: null });

      expect(ScrollableSwimlane).toHaveBeenCalledWith(
        expect.objectContaining({
          navLink: undefined,
        }),
        undefined,
      );
    });
  });

  describe("when the header link is clicked", () => {
    it("should dispatch a push action with the header view link", () => {
      renderObbCreatedBetsCardGroup();

      const { onNavLinkPress } = ScrollableSwimlane.mock.calls[0][0];
      onNavLinkPress();

      expect(navigate).toHaveBeenCalledTimes(1);
      expect(navigate).toHaveBeenCalledWith({
        viewUrl: "header Url",
        viewUrn: "header Urn",
      });
    });
  });

  describe("layouts", () => {
    describe("one card", () => {
      it("should apply the correct layout", () => {
        renderObbCreatedBetsCardGroup({
          cards: [{ urn: "createdBetsCard:1" }],
        });

        expect(FlatList).toHaveBeenCalledWith(
          expect.objectContaining({
            scrollEnabled: false,
            getItemLayout: undefined,
          }),
          undefined,
        );

        expect(FlatList).toHaveBeenCalledWith(
          expect.not.objectContaining({
            pagingEnabled: false,
            snapToInterval: expect.any(Number),
            decelerationRate: expect.any(Number),
          }),
          undefined,
        );

        const { renderItem } = FlatList.mock.calls[0][0];

        const firstCard = renderItem({ item: { urn: "urn", typename: "Card" }, index: 0 });

        render(firstCard);

        expect(ConnectedObbCreatedBetsCard).toHaveBeenCalledWith(
          { urn: "urn", fullWidth: true, component: ObbCreatedBetsCard, cardIndex: 0 },
          undefined,
        );
      });
    });
  });

  it("key extractor should return the card urn", () => {
     
    const { UNSAFE_getByType } = renderObbCreatedBetsCardGroup({});

    const flatList = UNSAFE_getByType(FlatList);

    const { keyExtractor } = flatList.props;

    expect(keyExtractor({ urn: "urn" })).toBe("urn");
  });
});
