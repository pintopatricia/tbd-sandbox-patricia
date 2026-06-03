import "jest-dom/extend-expect";
import { render } from "@testing-library/react-native";
import usePlayerViewVM from "../viewmodel/PlayerView.viewmodel";
import PlayerView from "./PlayerView.native";
import {
  PLAYER_VIEW_CONTAINER,
  PLAYER_VIEW_LOADING_LABEL,
  PLAYER_VIEW_HEADER,
  PLAYER_VIEW_HEADER_NAME,
  PLAYER_VIEW_HEADER_POSITION,
  PLAYER_VIEW_HEADER_SHIRT_NUMBER,
} from "./PlayerView.native.selectors";
import { FlatList } from "../../FlatList.native";

const fetchCardsMock = jest.fn();
const fetchBarsMock = jest.fn();

const URN_MOCK = "tbd:view:player:1234";

const DATA_MOCK = {
  urn: URN_MOCK,
  viewHeader: {
    name: "Christophe Ronaldo",
    position: "Forward",
    shirtNumber: 7,
  },
  items: [
    {
      __typename: "FootballPlayerCompetitionStatsCard",
      urn: "ppb:tbd:card:footballplayercompetitionstats:1|2",
    },
    {
      __typename: "PlayerMarketsCardGroup",
      urn: "ppb:tbd:cardgroup:playermarkets:1|2",
    },
    {
      __typename: "RegulatoryCard",
      urn: "ppb:tbd:card:regulatory:footer",
    },
  ],
};

jest.mock("../viewmodel/PlayerView.viewmodel", () => ({
  __esModule: true,
  default: jest.fn(),
  PlayerViewHeader: jest.fn(() => <player-view-header-mock />),
}));

jest.mock("../../FlatList.native", () => ({
  FlatList: jest.fn(() => <flatlist-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {},
  spacings: {},
}));

jest.mock("../../RegulatoryCard", (props) => jest.fn(() => <connected-regulatory-card-mock {...props} />));
jest.mock("../../RegulatoryCard/RegulatoryCard.native", () => jest.fn(() => <regulatory-card-mock />));
jest.mock("../../RegulatoryCard/RegulatoryCardPlaceholder.native", () =>
  jest.fn(() => <regulatory-card-placeholder-mock />),
);
jest.mock("../components/PlayerMarketsCardGroup/view/PlayerMarketsCardGroup.native", () =>
  jest.fn(() => <player-markets-card-group-mock />),
);
jest.mock("@ppb/the-wall-native", () => ({
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("react-native/Libraries/Interaction/InteractionManager", () => ({
  runAfterInteractions: jest.fn((cb) => setTimeout(cb, 0)), // Simulate async behavior
}));

const renderComponent = ({ notCalled = false, loading = false, noData = false }) => {
  usePlayerViewVM.mockReturnValueOnce({
    vm: {
      data: notCalled || loading || noData ? null : DATA_MOCK,
      events:
        notCalled || loading || noData
          ? null
          : {
              fetchCards: fetchCardsMock,
              fetchBars: fetchBarsMock,
            },
    },
    loading,
  });

  return render(<PlayerView urn={URN_MOCK} />);
};

describe("PlayerView", () => {
  beforeEach(jest.clearAllMocks);

  describe("when rendering the PlayerView", () => {
    describe("and request is still not called", () => {
      it("should call 'usePlayerViewVM' with the card URN", () => {
        renderComponent({ notCalled: true });

        expect(usePlayerViewVM).toHaveBeenCalledWith(URN_MOCK);
      });
    });

    describe("and the request is called but still loading", () => {
      it("should show the loading state", () => {
        const { queryByTestId } = renderComponent({ loading: true });

        const loadingLabelContainer = queryByTestId(PLAYER_VIEW_LOADING_LABEL);

        expect(loadingLabelContainer).toBeDefined();
      });
    });

    describe("when it's not loading and there is no data", () => {
      it("should render nothing", () => {
        const { queryByTestId } = renderComponent({ noData: true });

        const container = queryByTestId(PLAYER_VIEW_CONTAINER);

        expect(container).toBeNull();
      });
    });

    describe("and 'usePlayerViewVM' returns data", () => {
      it("should render the PlayerView container", () => {
        const { queryByTestId } = renderComponent({});

        const container = queryByTestId(PLAYER_VIEW_CONTAINER);

        expect(container).toBeDefined();
      });

      it("should render the PlayerView header", () => {
        renderComponent({});

        const { queryByTestId } = render(FlatList.mock.calls[0][0].ListHeaderComponent);

        const header = queryByTestId(PLAYER_VIEW_HEADER);
        const playerName = queryByTestId(PLAYER_VIEW_HEADER_NAME);
        const playerPosition = queryByTestId(PLAYER_VIEW_HEADER_POSITION);
        const playerShirtNumber = queryByTestId(PLAYER_VIEW_HEADER_SHIRT_NUMBER);

        expect(header).toBeDefined();
        expect(playerName.props.children).toBe("Christophe Ronaldo");
        expect(playerPosition.props.children).toBe("Forward");
        expect(playerShirtNumber.props.children).toBe(7);
      });

      it("should send the PlayerView items to FlatList", async () => {
        renderComponent({});

        expect(FlatList).toHaveBeenCalledWith(
          expect.objectContaining({
            data: DATA_MOCK.items,
          }),
          undefined,
        );
      });
    });
  });
});
