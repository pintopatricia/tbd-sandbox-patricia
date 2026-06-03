import { render, screen } from "@testing-library/react-native";
import FilteredRacesByTimeRangeList from "./FilteredRacesByTimeRangeList.native";
import ConnectedSwimlaneCardGroup from "../../SwimlaneCardGroup";
import SwimlaneCardGroup from "../../SwimlaneCardGroup/SwimlaneCardGroup.native";
import { Card } from "@ppb/the-wall-native";
import { CardTheme } from "@ppb/the-wall-common/types";

jest.mock("@ppb/the-wall-native", () => ({
  withStyle: jest.fn(() => "some-placeholder"),
  Card: jest.fn(({ children }) => <card-mock data-testid="filtered-races-card-container">{children}</card-mock>),
}));

jest.useFakeTimers();

jest.mock("../../SwimlaneCardGroup", () => jest.fn((props) => <connected-swimlane-card-group-mock {...props} />));
jest.mock("../../SwimlaneCardGroup/SwimlaneCardGroup.native", () =>
  jest.fn((props) => <swimlane-card-group-mock {...props} />),
);
jest.mock("../../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.native", () =>
  jest.fn((props) => <swimlane-card-group-placeholder-mock {...props} />),
);

jest.mock("../../ByTimeRangeMeetingCardGroup", () =>
  jest.fn((props) => <connected-by-time-range-meeting-card-group-mock {...props} />),
);
jest.mock("../../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroup.native", () =>
  jest.fn((props) => <by-time-range-meeting-card-group-mock {...props} />),
);
jest.mock("../../ByTimeRangeMeetingCardGroup/ByTimeRangeMeetingCardGroupPlaceholder.native", () =>
  jest.fn((props) => <by-time-range-meeting-card-group-placeholder-mock {...props} />),
);

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

const itemsMock = [
  {
    urn: "ppb:fakeCardGroup:1",
    visible: false,
  },
  {
    urn: "ppb:fakeCardGroup:2",
    visible: false,
  },
];

function renderFilteredCouponCardGroup({ items = itemsMock, dispatchFetchCards = () => {} }) {
  return render(<FilteredRacesByTimeRangeList items={items} dispatchFetchCards={dispatchFetchCards} />);
}

describe("FilteredRacesByTimeRangeList component", () => {
  afterEach(jest.clearAllMocks);

  it("should call ConnectedSwimlaneCardGroup twice", () => {
    renderFilteredCouponCardGroup({});

    expect(ConnectedSwimlaneCardGroup).toHaveBeenCalledTimes(2);
    expect(ConnectedSwimlaneCardGroup).toHaveBeenCalledWith(
      {
        urn: "ppb:fakeCardGroup:1",
        component: SwimlaneCardGroup,
        placeholder: "some-placeholder",
        visible: false,
      },
      undefined,
    );
    expect(ConnectedSwimlaneCardGroup).toHaveBeenCalledWith(
      {
        urn: "ppb:fakeCardGroup:2",
        component: SwimlaneCardGroup,
        placeholder: "some-placeholder",
        visible: false,
      },
      undefined,
    );
  });

  it("should render the Card component with the correct properties", () => {
    renderFilteredCouponCardGroup({});

    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        showShadow: true,
        fullWidthContent: true,
        theme: CardTheme.TRANSPARENT,
      }),
      undefined,
    );
  });
});
