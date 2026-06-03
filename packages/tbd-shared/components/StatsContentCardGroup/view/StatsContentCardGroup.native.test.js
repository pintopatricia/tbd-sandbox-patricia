import { render, fireEvent } from "@testing-library/react-native";
import { SupportingContentButton } from "@ppb/the-wall-native";

import StatsContentCardGroup from "./StatsContentCardGroup.native";
import useStatsContentCardGroupVM from "../viewmodel/StatsContentCardGroup.viewmodel";

jest.mock("@ppb/tbd-store/state/layout-snapshot", () => ({
  generateLayoutSnapshot: jest.fn((string) => string),
}));
jest.mock("../viewmodel/StatsContentCardGroup.viewmodel");
jest.mock("./placeholder/StatsContentCardGroupPlaceholder.native", () => {
  const StatsContentCardGroupPlaceholder = () => (
    <text-mock testID="stats-content-cardgroup-placeholder">StatsContentCardGroupPlaceholder</text-mock>
  );
  return StatsContentCardGroupPlaceholder;
});

jest.mock("@ppb/the-wall-native", () => ({
  Divider: jest.fn((props) => <view-mock {...props} />),
  ScrollableSwimlane: ({ children }) => <view-mock>{children}</view-mock>,
  SupportingContentButton: jest.fn(({ title, onPress }) => (
    <touchableOpacity-mock onPress={onPress} testID={`${title}-supporting-button`}>
      <text-mock>{title}</text-mock>
    </touchableOpacity-mock>
  )),
}));
jest.mock("../../ViewItem/ViewItem.native", () => ({
  ViewItem: jest.fn(() => <view-mock testID="viewItem">ViewItem</view-mock>),
}));

jest.mock("../model/StatsContentCardGroup.graphql.ts", () => ({
  writeStatsContentCardGroupFragment: jest.fn(),
}));

const urn = "ppb:tbd:stats:cardgroup:statsContent:1";
const onTabPress = jest.fn();

const mockViewModel = (data = null, loading = false) => {
  useStatsContentCardGroupVM.mockReturnValueOnce({
    loading,
    vm: {
      data,
      events: { onTabPress },
    },
  });
};

function renderComponent() {
  return render(<StatsContentCardGroup urn={urn} />);
}

describe("StatsContentCardGroup", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when request is loading", () => {
    it("should render StatsContentCardGroupPlaceholder", () => {
      mockViewModel(null, true);

      const { getByTestId } = renderComponent();

      expect(getByTestId("stats-content-cardgroup-placeholder")).not.toBeEmpty();
    });
  });

  describe("when data is loaded", () => {
    describe("when data.items is undefined", () => {
      it("should render null", () => {
        mockViewModel(null, false);

        const { toJSON } = renderComponent();

        expect(toJSON()).toBeNull();
      });
    });

    describe("when data.items is defined", () => {
      it("should render items", () => {
        const items = [
          {
            icon: "team_form_icon",
            urn: "urn:1",
            label: "Form",
            typename: "StatsPebbleCardGroup",
          },
          {
            icon: "team_form_icon",
            urn: "urn:2",
            label: "Form button",
            typename: "StatsFormCard",
          },
        ];

        mockViewModel({ items });
        renderComponent();

        expect(SupportingContentButton).toHaveBeenCalledWith(
          {
            title: items[0].label,
            icon: items[0].icon,
            isOpen: false,
            onPress: expect.any(Function),
            isHighlighted: true,
          },

          undefined,
        );
        expect(SupportingContentButton).toHaveBeenCalledWith(
          {
            title: items[1].label,
            icon: items[1].icon,
            isOpen: false,
            onPress: expect.any(Function),
            isHighlighted: true,
          },
          undefined,
        );
        expect(SupportingContentButton).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe("when openStats is defined", () => {
    describe("when supportingContentButton is clicked", () => {
      it("should toggle openStats and should show the ViewItem component once clicked", () => {
        const items = [
          {
            icon: "team_form_icon",
            urn: "urn:1",
            label: "Form",
            typename: "StatsPebbleCardGroup",
          },
          {
            icon: "team_form_icon",
            urn: "urn:2",
            label: "Form button",
            typename: "StatsFormCard",
          },
        ];

        const local = {
          selectedTab: {
            urn: "urn:1",
            typename: "StatsPebbleCardGroup",
          },
        };

        mockViewModel({ items });
        const { queryByTestId, rerender } = renderComponent();

        const button = queryByTestId(`${items[0].label}-supporting-button`);
        expect(button).toBeTruthy();

        expect(queryByTestId("viewItem")).toBeNull();

        fireEvent.press(button);
        mockViewModel({ items, local });
        rerender(<StatsContentCardGroup urn={urn} />);
        expect(onTabPress).toHaveBeenNthCalledWith(1, urn, items[0].urn, true);

        expect(queryByTestId("viewItem")).toBeTruthy();

        fireEvent.press(button);
        expect(onTabPress).toHaveBeenNthCalledWith(2, urn, items[0].urn, false);
        mockViewModel({ items });
        rerender(<StatsContentCardGroup urn={urn} />);
        expect(queryByTestId("viewItem")).toBeNull();
      });
    });
  });
});
