import { act, render } from "@testing-library/react";
import "jest-dom/extend-expect";
import ConnectedRegulatoryCard from "../../RegulatoryCard";
import RegulatoryCard from "../../RegulatoryCard/RegulatoryCard.web";
import RegulatoryCardPlaceholder from "../../RegulatoryCard/RegulatoryCardPlaceholder.web";
import PlayerMarketsCardGroup from "../components/PlayerMarketsCardGroup/view/PlayerMarketsCardGroup.web";
import usePlayerViewVM from "../viewmodel/PlayerView.viewmodel";
import PlayerView from "./PlayerView.web";
import {
  PLAYER_VIEW_CONTAINER,
  PLAYER_VIEW_LOADING_LABEL,
  PLAYER_VIEW_HEADER,
  PLAYER_VIEW_HEADER_NAME,
  PLAYER_VIEW_HEADER_POSITION,
  PLAYER_VIEW_HEADER_SHIRT_NUMBER,
} from "./PlayerView.web.selectors";
import FootballPlayerCompetitionStatsCard from "../components/FootballPlayerCompetitionStatsCard/view/FootballPlayerCompetitionStatsCard.web";

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
}));

jest.mock("../../RegulatoryCard", (props) => jest.fn(() => <connected-regulatory-card-mock {...props} />));
jest.mock("../../RegulatoryCard/RegulatoryCard.web", () => jest.fn(() => <regulatory-card-mock />));
jest.mock("../../RegulatoryCard/RegulatoryCardPlaceholder.web", () =>
  jest.fn(() => <regulatory-card-placeholder-mock />),
);

jest.mock("../components/PlayerMarketsCardGroup/view/PlayerMarketsCardGroup.web", () =>
  jest.fn(() => <player-markets-card-group-mock />),
);

jest.mock("../components/FootballPlayerCompetitionStatsCard/view/FootballPlayerCompetitionStatsCard.web", () =>
  jest.fn(() => <football-player-competition-stats-card-mock />),
);

const observe = jest.fn();
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

const renderComponent = ({ notCalled = false, loading = false, noData = false }) => {
  usePlayerViewVM.mockReturnValue({
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
      it("should render the 'loading' label", () => {
        const { container } = renderComponent({ loading: true });

        const loadingLabelContainer = container.querySelector(PLAYER_VIEW_LOADING_LABEL);

        expect(loadingLabelContainer).toBeInTheDocument();
      });
    });

    describe("when it's not loading and there is no data", () => {
      it("should not render the PlayerView component", () => {
        const { container } = renderComponent({ noData: true });

        const playerViewContainer = container.querySelector(PLAYER_VIEW_CONTAINER);

        expect(playerViewContainer).not.toBeInTheDocument();
      });

      describe("when 'usePlayerViewVM' returns data", () => {
        it("should render the PlayerView container", () => {
          const { container } = renderComponent({});
          const playerViewContainer = container.querySelector(PLAYER_VIEW_CONTAINER);

          expect(playerViewContainer).toBeInTheDocument();
        });

        it("should render the PlayerView header", () => {
          const { container } = renderComponent({});

          const viewHeader = container.querySelector(PLAYER_VIEW_HEADER);
          const playerName = container.querySelector(PLAYER_VIEW_HEADER_NAME);
          const playerPosition = container.querySelector(PLAYER_VIEW_HEADER_POSITION);
          const playerShirtNumber = container.querySelector(PLAYER_VIEW_HEADER_SHIRT_NUMBER);

          expect(viewHeader).toBeInTheDocument();
          expect(playerName).toHaveTextContent("Christophe Ronaldo");
          expect(playerPosition).toHaveTextContent("Forward");
          expect(playerShirtNumber).toHaveTextContent("7");
        });

        it("should render the PlayerView items", () => {
          renderComponent({});

          expect(FootballPlayerCompetitionStatsCard).toHaveBeenCalledWith(
            { urn: DATA_MOCK.items[0].urn, visible: false },
            undefined,
          );

          expect(PlayerMarketsCardGroup).toHaveBeenCalledWith(
            { urn: DATA_MOCK.items[1].urn, visible: false },
            undefined,
          );

          expect(ConnectedRegulatoryCard).toHaveBeenCalledWith(
            {
              urn: "ppb:tbd:card:regulatory:footer",
              component: RegulatoryCard,
              placeholder: RegulatoryCardPlaceholder,
            },
            undefined,
          );
        });

        it("should call 'fetchBars' event", async () => {
          renderComponent({});

          expect(fetchBarsMock).toHaveBeenCalledWith(URN_MOCK);
        });
        it("should call 'fetchCards' event with only the non apollo items URNs", async () => {
          renderComponent({});

          act(() => {
            onIntersectCb([{ isIntersecting: true, target: DATA_MOCK.items[0] }]);
            onIntersectCb([{ isIntersecting: true, target: DATA_MOCK.items[1] }]);
            onIntersectCb([{ isIntersecting: true, target: DATA_MOCK.items[2] }]); // Only Non-Apollo component
          });

          expect(fetchCardsMock).toHaveBeenCalledWith([DATA_MOCK.items[2].urn]);
        });
      });
    });
  });
});
