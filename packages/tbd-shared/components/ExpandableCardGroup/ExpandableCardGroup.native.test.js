import { act, render } from "@testing-library/react-native";
import { FlatList } from "react-native";
import { Card } from "@ppb/the-wall-native";
import ConnectedCard from "../Card";
import TBDCard from "../Card/Card.native";
import ExpandableCardGroup from "./ExpandableCardGroup.native";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";

jest.useFakeTimers();

jest.mock("../Card/", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.native", () => jest.fn(() => <card-mock />));
jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn(({ props, children }) => <card-mock {...props}>{children}</card-mock>),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  heights: {
    "card-width-percentage": 1,
  },
  spacings: {},
  typography: {},
}));

const mockLazyLoading = jest.fn();
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => ({
    current: mockLazyLoading,
  })),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const dispatchFetchCards = jest.fn();
const dispatchExpandableCardGroupToggle = jest.fn();

const itemsMock = [
  { urn: "urn1", typename: "CardA" },
  { urn: "urn2", typename: "CardB" },
  { urn: "urn3", typename: "CardC" },
];

function renderExpandableCardGroup(props) {
  return render(<ExpandableCardGroup {...props} />);
}

describe("ExpandableCardGroup", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the Card component when isExpandable prop is true", () => {
    renderExpandableCardGroup({
      title: "title",
      items: itemsMock,
      isExpanded: true,
      isExpandable: true,
      dispatchFetchCards,
    });

    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        title: "title",
        startOpen: true,
        onTitleClick: expect.any(Function),
        children: expect.anything(),
      }),
      undefined,
    );
  });

  it("should not render the Card component when it is not expandable", () => {
    renderExpandableCardGroup({
      title: "title",
      items: itemsMock,
      isExpanded: true,
      isExpandable: false,
      dispatchFetchCards,
    });

    expect(Card).not.toHaveBeenCalled();
  });

  it("shouldn't call dispatchExpandableCardGroupToggle with the correct parameters", () => {
    renderExpandableCardGroup({
      title: "title",
      items: itemsMock,
      isExpanded: false,
      isExpandable: true,
      dispatchFetchCards,
    });

    expect(Card).toHaveBeenCalledWith(expect.objectContaining({}), undefined);
  });

  it("should render the first card with renderItem", () => {
    renderExpandableCardGroup({
      title: "title",
      items: itemsMock,
      dispatchFetchCards,
    });

    const { UNSAFE_getByType } = render(Card.mock.calls[0][0].children);

    // https://callstack.github.io/react-native-testing-library/docs/api-queries#unsafe_bytype
    const flatList = UNSAFE_getByType(FlatList);
    const { renderItem } = flatList.props;

    // first card
    const firstItemComponent = renderItem({ item: { urn: "urn", typename: "HighlightedSelectionCard" }, index: 0 });
    render(firstItemComponent);

    // when we render the item it should call ConnectedCard
    expect(ConnectedCard).toHaveBeenCalledWith(
      { urn: "urn", typename: "HighlightedSelectionCard", component: TBDCard },
      undefined,
    );
  });

  it("should define lazy loading callback", () => {
    renderExpandableCardGroup({
      title: "title",
      isExpanded: true,
      isExpandable: true,
      items: [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      dispatchFetchCards,
    });

    expect(useNativeLazyLoading).toHaveBeenCalledWith(
      [
        { urn: "1", typename: "typename" },
        { urn: "2", typename: "typename" },
        { urn: "3", typename: "typename" },
      ],
      dispatchFetchCards,
    );
  });

  describe("when there are no items", () => {
    it("should render empty component", () => {
      renderExpandableCardGroup({
        title: "title",
        isExpanded: true,
        isExpandable: true,
        items: [],
        dispatchFetchCards,
      });

      expect(ConnectedCard).not.toHaveBeenCalled();
      expect(Card).not.toHaveBeenCalled();
    });
  });

  describe("when toggling Card", () => {
    it("should call dispatchExpandableCardGroupToggle with the correct parameters", () => {
      renderExpandableCardGroup({
        urn: "ExpandableCardGroupURN",
        title: "jockey OddsBoost",
        items: itemsMock,
        isExpanded: true,
        isExpandable: true,
        dispatchFetchCards,
        dispatchExpandableCardGroupToggle,
      });

      act(() => {
        Card.mock.calls[0][0].onTitleClick(true);
      });

      expect(dispatchExpandableCardGroupToggle).toHaveBeenCalledWith(
        true,
        "ExpandableCardGroupURN",
        "jockey OddsBoost",
      );
    });
  });
});
