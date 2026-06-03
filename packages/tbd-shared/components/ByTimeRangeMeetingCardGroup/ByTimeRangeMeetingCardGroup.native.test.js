import "jest-extended";
import { render } from "@testing-library/react-native";
import { TBDImage } from "@ppb/the-wall-native";
import ConnectedCard from "../Card";
import ByTimeRangeMeetingCardGroup from "./ByTimeRangeMeetingCardGroup.native";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import { FlatList } from "../FlatList.native";

jest.mock("../Card/", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.native", () => ({
  __esModule: true,
  default: jest.fn(() => <card-mock />),
  isCardImplemented: jest.fn(() => true),
}));

jest.mock("@ppb/the-wall-native", () => ({
  TBDImage: jest.fn(() => <image-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("../FlatList.native", () => ({
  FlatList: jest.fn(() => <flatlist-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  tokens: {
    ByTimeRangeMeetingCardGroupVerticalGap: "40",
  },
  widths: {},
  heights: {},
  spacings: {},
  typography: {},
  gutters: {},
}));

const mockLazyLoading = jest.fn();
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => ({
    current: mockLazyLoading,
  })),
}));

function renderByTimeRangeMeetingCardGroup(props) {
  return render(<ByTimeRangeMeetingCardGroup {...props} />);
}

describe("ByTimeRangeMeetingCardGroup", () => {
  beforeEach(jest.clearAllMocks);

  it("should render by timerange meeting card group", () => {
    const itemsMock = [
      { urn: "1", typename: "typename" },
      { urn: "2", typename: "typename" },
      { urn: "3", typename: "typename" },
    ];

    renderByTimeRangeMeetingCardGroup({
      title: "Today",
      items: itemsMock,
      icon: { vector: "someVector" },
    });

    expect(TBDImage).toHaveBeenCalledWith(
      {
        source: "someVector",
      },
      undefined,
    );

    expect(ConnectedCard).toHaveBeenCalledTimes(3);

    expect(ConnectedCard).toHaveBeenCalledWith(
      {
        component: expect.any(Function),
        typename: "typename",
        urn: "1",
      },
      undefined,
    );

    expect(ConnectedCard).toHaveBeenCalledWith(
      {
        component: expect.any(Function),
        typename: "typename",
        urn: "2",
      },
      undefined,
    );

    expect(ConnectedCard).toHaveBeenCalledWith(
      {
        component: expect.any(Function),
        typename: "typename",
        urn: "3",
      },
      undefined,
    );
  });

  it("should define lazy loading callback", () => {
    const dispatchFetchCards = jest.fn();
    const itemsMock = [
      { urn: "1", typename: "typename" },
      { urn: "2", typename: "typename" },
      { urn: "3", typename: "typename" },
    ];

    renderByTimeRangeMeetingCardGroup({
      title: "Today",
      items: itemsMock,
      dispatchFetchCards,
    });

    expect(useNativeLazyLoading).toHaveBeenCalledWith(itemsMock, dispatchFetchCards);
  });

  describe("when there are no urns", () => {
    it("should render empty component", () => {
      renderByTimeRangeMeetingCardGroup({
        title: "Today",
        items: [],
      });

      expect(ConnectedCard).not.toHaveBeenCalled();
      expect(FlatList).not.toHaveBeenCalled();
    });
  });
});
