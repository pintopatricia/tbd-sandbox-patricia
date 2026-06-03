import { render } from "@testing-library/react-native";
import { SectionList } from "react-native";
import FutureRacingCardGroup from "./FutureRacingCardGroup.native";
import ConnectedCard from "../../Card";
import Card from "../../Card/Card.native";

jest.mock("../../Card", () => jest.fn((props) => <connected-card-mock {...props} />));
jest.mock("../../Card/Card.native", () => jest.fn((props) => <card-mock {...props} />));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  heights: {},
  spacings: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const mockLazyLoading = jest.fn();
jest.mock("../../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => ({
    current: mockLazyLoading,
  })),
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

const itemsMock = [
  {
    date: "25 June",
    items: [{ urn: "ppb:fakeCardGroup:1", typename: "FakeCard" }],
  },
  {
    date: "26 June",
    items: [{ urn: "ppb:fakeCardGroup:2", typename: "FakeCard" }],
  },
];

const urnListMock = ["ppb:fakeCardGroup:1", "ppb:fakeCardGroup:2"];

function renderFilteredCouponCardGroup({ items = itemsMock, urnList = urnListMock, dispatchFetchCards = () => {} }) {
  return render(<FutureRacingCardGroup items={items} urnList={urnList} dispatchFetchCards={dispatchFetchCards} />);
}

describe("FutureRacingCardGroup component", () => {
  afterEach(jest.clearAllMocks);

  it("should call ConnectedCard twice", () => {
    renderFilteredCouponCardGroup({});

    expect(ConnectedCard).toHaveBeenCalledTimes(2);

    expect(ConnectedCard).toHaveBeenCalledWith(
      {
        urn: "ppb:fakeCardGroup:1",
        typename: "FakeCard",
        component: Card,
      },
      undefined,
    );
    expect(ConnectedCard).toHaveBeenCalledWith(
      {
        urn: "ppb:fakeCardGroup:2",
        typename: "FakeCard",
        component: Card,
      },
      undefined,
    );
  });

  it("key extractor should combine urn and index to create unique key", () => {
    const { UNSAFE_getByType } = renderFilteredCouponCardGroup({});

    const sectionList = UNSAFE_getByType(SectionList);

    const { keyExtractor } = sectionList.props;

    expect(keyExtractor({ urn: "urn" }, 1)).toBe("future-racing-card-group-urn-1");
  });
});
