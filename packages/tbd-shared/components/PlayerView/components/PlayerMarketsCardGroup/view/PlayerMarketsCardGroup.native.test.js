import { act, render } from "@testing-library/react-native";
import usePlayerMarketsCardGroupVM from "../viewmodel/PlayerMarketsCardGroup.viewmodel";
import { PLAYER_MARKETS_CONTAINER } from "./PlayerMarketsCardGroup.native.selectors";
import PlayerMarketsCardGroup from "./PlayerMarketsCardGroup.native";
import { Placeholder } from "@ppb/the-wall-native";
import { useNativeLazyLoading } from "../../../../../hooks/useNativeLazyLoading.native";

const fetchCardsMock = jest.fn();

const DATA_MOCK = {
  urn: "tbd:cardgroup:playermarkets:1234",
  fixtureCard: {
    __typename: "FixtureCard",
    urn: "tbd:fixture:5678",
  },
  items: [
    {
      __typename: "PebbleCardGroup",
      urn: "tbd:pebblecardgroup:91011",
    },
    {
      __typename: "PebbleCardGroup",
      urn: "tbd:pebblecardgroup:121314",
    },
  ],
  titles: {
    fixture: "Next Match",
    markets: "Betting Markets",
  },
};

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
  Placeholder: jest.fn(({ props }) => <placeholder-mock {...props} />),
}));

jest.mock("../viewmodel/PlayerMarketsCardGroup.viewmodel", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

jest.mock("../../../../FixtureCard", (props) => jest.fn(() => <connected-fixture-card-mock {...props} />));
jest.mock("../../../../FixtureCard/FixtureCard.native", (props) => jest.fn(() => <fixture-card-mock {...props} />));
jest.mock("../../../../FixtureCard/FixtureCardPlaceholder.native", () =>
  jest.fn(() => <fixture-card-placeholder-mock />),
);

jest.mock("../../../../PebbleCardGroup", (props) => jest.fn(() => <connected-pebble-card-group-mock {...props} />));
jest.mock("../../../../PebbleCardGroup/PebbleCardGroup.native", (props) =>
  jest.fn(() => <pebble-card-group-mock {...props} />),
);
jest.mock("../../../../PebbleCardGroup/PebbleCardGroupPlaceholder.native", () =>
  jest.fn(() => <pebble-card-group-placeholder-mock />),
);

const mockLazyLoading = jest.fn();
jest.mock("../../../../../hooks/useNativeLazyLoading.native", () => ({
  useNativeLazyLoading: jest.fn(() => ({
    current: mockLazyLoading,
  })),
}));

jest.mock("react-native/Libraries/Lists/FlatList", () => {
  const React = require("react");
  const { View } = require("react-native");
  const MockedFlatList = React.forwardRef((props, ref) => {
    return <View ref={ref} {...props} />;
  });
  MockedFlatList.displayName = "FlatList";
  return MockedFlatList;
});

const URN_MOCK = "tbd:cardgroup:playermarkets:1234";

const renderComponent = ({ notCalled, loading }) => {
  usePlayerMarketsCardGroupVM.mockReturnValue({
    called: !notCalled,
    loading: loading,
    vm: {
      data: notCalled || loading ? null : DATA_MOCK,
      events:
        notCalled || loading
          ? null
          : {
              fetchCards: fetchCardsMock,
            },
    },
  });

  return render(<PlayerMarketsCardGroup urn={URN_MOCK} visible />);
};

describe("PlayerMarketsCardGroup", () => {
  beforeEach(jest.clearAllMocks);

  describe("when rendering the PlayerMarketsCardGroup", () => {
    describe("and request is still not called", () => {
      it("should call 'usePlayerMarketsCardGroupVM' with the card URN", () => {
        renderComponent({ notCalled: true });

        expect(usePlayerMarketsCardGroupVM).toHaveBeenCalledWith(URN_MOCK, true);
      });
    });

    describe("when it's not loading and there is no data", () => {
      it("should render nothing", () => {
        const { queryByTestId } = renderComponent({ loading: true });

        const container = queryByTestId(PLAYER_MARKETS_CONTAINER);

        expect(Placeholder).toHaveBeenCalledTimes(1);
        expect(container).toBeNull();
      });
    });

    describe("and 'usePlayerMarketsCardGroupVM' returns data", () => {
      it("should render the PlayerMarkets container", () => {
        const { queryByTestId } = renderComponent({});

        const container = queryByTestId(PLAYER_MARKETS_CONTAINER);

        expect(Placeholder).not.toHaveBeenCalled();
        expect(container).toBeDefined();
      });

      it("should call 'useNativeLazyLoading' event with the fixture and items URNs", async () => {
        renderComponent({});
        act(() => {
          expect(useNativeLazyLoading).toHaveBeenCalledWith(
            [DATA_MOCK.fixtureCard, ...DATA_MOCK.items].map((card) => {
              return { ...card, typename: card.__typename, visible: false };
            }),
            expect.any(Function),
          );
        });
      });
    });
  });
});
