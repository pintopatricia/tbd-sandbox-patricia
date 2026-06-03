import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import usePlayerMarketsCardGroupVM from "../viewmodel/PlayerMarketsCardGroup.viewmodel";
import { PLAYER_MARKETS_CONTAINER } from "./PlayerMarketsCardGroup.web.selectors";
import PlayerMarketsCardGroup from "./PlayerMarketsCardGroup.web";
import { Placeholder } from "@ppb/the-wall-web";

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

jest.mock("../viewmodel/PlayerMarketsCardGroup.viewmodel", () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock("../../../../FixtureCard", () => jest.fn(() => <connected-fixture-card-mock />));
jest.mock("../../../../FixtureCard/FixtureCard.web", () => jest.fn(() => <fixture-card-mock />));
jest.mock("../../../../FixtureCard/FixtureCardPlaceholder.web", () => jest.fn(() => <fixture-card-placeholder-mock />));

jest.mock("../../../../PebbleCardGroup", () => jest.fn(() => <connected-pebble-card-group-mock />));
jest.mock("../../../../PebbleCardGroup/PebbleCardGroup.web", () => jest.fn(() => <pebble-card-group-mock />));
jest.mock("../../../../PebbleCardGroup/PebbleCardGroupPlaceholder.web", () =>
  jest.fn(() => <pebble-card-group-placeholder-mock />),
);

jest.mock("@ppb/the-wall-web", () => ({
  Placeholder: jest.fn(({ props }) => <placeholder-mock {...props} />),
}));

const observe = jest.fn((target) => {
  onIntersectCb([{ isIntersecting: true, target }]);
});
const unobserve = jest.fn();
const disconnect = jest.fn();
const takeRecords = jest.fn();
let onIntersectCb;

window.IntersectionObserver = jest.fn((callback) => {
  onIntersectCb = callback;

  return {
    observe,
    unobserve,
    disconnect,
    takeRecords,
  };
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
  describe("when rendering the PlayerMarketsCardGroup", () => {
    beforeEach(jest.clearAllMocks);
    describe("and request is still not called", () => {
      it("should call 'usePlayerMarketsCardGroupVM' with the card URN", () => {
        renderComponent({ notCalled: true });

        expect(usePlayerMarketsCardGroupVM).toHaveBeenCalledWith(URN_MOCK, true);
      });
    });

    describe("when it's loading", () => {
      it("should render placeholder", () => {
        const { queryByTestId } = renderComponent({ loading: true });

        const container = queryByTestId(PLAYER_MARKETS_CONTAINER);

        expect(Placeholder).toHaveBeenCalledTimes(1);
        expect(container).toBeNull();
      });
    });

    describe("when it's not loading and there is no data", () => {
      it("should render nothing", () => {
        const { queryByTestId } = renderComponent({});

        const container = queryByTestId(PLAYER_MARKETS_CONTAINER);

        expect(Placeholder).not.toHaveBeenCalled();
        expect(container).toBeNull();
      });
    });

    describe("and 'usePlayerMarketsCardGroupVM' returns data", () => {
      it("should render the PlayerView container", () => {
        const { queryByTestId } = renderComponent({});

        const container = queryByTestId(PLAYER_MARKETS_CONTAINER);

        expect(container).toBeDefined();
      });

      it("should call 'fetchCards' event with the fixture and items URNs", async () => {
        renderComponent({});

        act(() => {
          onIntersectCb([{ isIntersecting: true, target: DATA_MOCK.fixtureCard }]);
          onIntersectCb([{ isIntersecting: true, target: DATA_MOCK.items[0] }]);
          onIntersectCb([{ isIntersecting: true, target: DATA_MOCK.items[1] }]);
        });

        expect(fetchCardsMock).toHaveBeenCalledWith([DATA_MOCK.fixtureCard.urn]);
        expect(fetchCardsMock).toHaveBeenCalledWith([DATA_MOCK.items[0].urn]);
        expect(fetchCardsMock).toHaveBeenCalledWith([DATA_MOCK.items[1].urn]);
      });
    });
  });
});
