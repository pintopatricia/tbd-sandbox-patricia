import { act, render } from "@testing-library/react-native";
import { ActionLink, Card } from "@ppb/the-wall-native";

import useCardGroupItems from "../../hooks/useCardGroupItems";
import ConnectedCard from "../Card";
import TBDCard from "../Card/Card.native";
import ConnectedFavouriteIcon from "../FavouriteIcon";
import FavouriteIcon from "../FavouriteIcon/FavouriteIcon.native";
import ConnectedOpenBets from "../OpenBets";
import { OpenBets } from "../OpenBets/OpenBets.native";

import { emitCollapseToggleEvent } from "./event-emitters";
import { PebbleMarketTemplate } from "./snowflakes/PebbleMarketTemplate/PebbleMarketTemplate.native";
import PebbleCardGroup from "./PebbleCardGroup.native";
import {
  PEBBLE_CARDGROUP,
  PEBBLE_CARDGROUP_HEADER_CONTAINER,
  PEBBLE_CARDGROUP_OUTER_TITLE_TEXT,
  PEBBLE_CARDGROUP_TITLE_CONTAINER,
  SHELL,
} from "./PebbleCardGroup.native.selectors";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
  tokens: {},
  typography: {},
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(({ props }) => <generic-icon-mock {...props} />),
}));

jest.mock("@ppb/the-wall-native", () => ({
  ActionLink: jest.fn(({ props }) => <action-link-mock {...props} />),
  Card: jest.fn(({ props, children }) => <card-mock {...props}>{children}</card-mock>),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("./snowflakes/PebbleMarketTemplate/PebbleMarketTemplate.native", () => ({
  PebbleMarketTemplate: jest.fn(({ children, props }) => (
    <pebble-market-template-mock {...props}>{children}</pebble-market-template-mock>
  )),
}));

jest.mock("../../hooks/useCardGroupItems", () => jest.fn((partials) => partials));

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock("../Card/Card.native", () => jest.fn(() => <card-mock />));
jest.mock("../FavouriteIcon", () => jest.fn(() => <connected-favourite-icon-mock />));
jest.mock("../FavouriteIcon/FavouriteIcon.native", () => jest.fn(() => <favourite-icon-mock />));
jest.mock("../OpenBets", () => jest.fn(() => <connected-open-bets-mock />));
jest.mock("../OpenBets/OpenBets.native", () => jest.fn(() => <open-bets-mock />));

jest.mock("./event-emitters", () => ({
  emitCollapseToggleEvent: jest.fn(),
}));

const DEFAULT_PROPS = {
  title: "Title",
  outerTitle: "Outer Title",
  viewAllLabel: "View All Label",
  pebbleExpanded: true,
  items: [],
  pebbleList: [],
  selectedCardURN: "",
  dispatchPebbleItemSelection: jest.fn(),
  dispatchPushAction: jest.fn(),
  dispatchFetchCardsAction: jest.fn(),
};

const renderComponent = (props = {}) => render(<PebbleCardGroup {...DEFAULT_PROPS} {...props} />);

describe("PebbleCardGroup Native", () => {
  beforeEach(jest.clearAllMocks);

  describe("when rendering a shell", () => {
    it("should render the PebbleCardGroup shell component", () => {
      const props = {
        title: "I'm such a good title",
        isShell: true,
      };

      const { queryByTestId } = renderComponent(props);

      expect(queryByTestId(SHELL)).toBeDefined();
    });

    it("should render the Card component with the correct props", () => {
      const props = {
        title: "I'm such a good title",
        isShell: true,
      };

      renderComponent(props);

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          children: expect.any(Object),
          title: props.title,
        }),
        undefined,
      );
    });

    it("should render the FavouriteIcon component with the correct props", () => {
      const props = {
        isShell: true,
        title: "I'm such a good title",
        favouriteMarketsStateURN: "favouriteMarketsStateURN",
      };

      renderComponent(props);

      render(Card.mock.calls[0][0].endElement);

      expect(ConnectedFavouriteIcon).toHaveBeenCalledWith(
        {
          component: FavouriteIcon,
          urn: props.favouriteMarketsStateURN,
          contentSectionURN: props.cardGroupURN,
        },
        undefined,
      );
    });
  });

  it("should not render the PebbleCardGroup container if useCardGroupItems hook returns an empty array", () => {
    const props = {
      title: undefined,
      items: [
        {
          id: "ppb:tbd:market:1",
          text: "0.5",
        },
      ],
      selectedCardURN: "ppb:tbd:market:1",
      cardGroupURN: "ppb:cardgroup:1",
    };

    useCardGroupItems.mockReturnValueOnce([]);

    const { queryByTestId } = renderComponent(props);

    expect(queryByTestId(PEBBLE_CARDGROUP)).toBeNull();
  });

  it("should render PebbleMarketTemplate component", () => {
    const props = {
      title: "Over/Under",
      items: [
        {
          id: "ppb:tbd:market:1",
          text: "0.5",
        },
      ],
      pebbleList: [
        {
          id: "ppb:tbd:market:1",
          text: "0.5",
        },
      ],
      selectedCardURN: "ppb:tbd:market:1",
      cardGroupURN: "ppb:cardgroup:1",
    };

    renderComponent(props);

    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        children: expect.any(Object),
        endElement: expect.any(Object),
        startOpen: true,
        title: "Over/Under",
        onTitleClick: expect.any(Function),
      }),
      undefined,
    );

    expect(PebbleMarketTemplate).toHaveBeenCalledWith(
      {
        children: expect.anything(),
        defaultSelectedPebble: "ppb:tbd:market:1",
        items: [
          {
            id: "ppb:tbd:market:1",
            text: "0.5",
          },
        ],
        onPebblePress: expect.any(Function),
      },
      undefined,
    );
  });

  it("should render the FavouriteIcon component with the correct props", () => {
    const props = {
      items: [{}],
      favouriteMarketsStateURN: "favouriteMarkets:state:1",
      cardGroupURN: "ppb:cardgroup:1",
    };

    renderComponent(props);

    render(Card.mock.calls[0][0].endElement);

    expect(ConnectedFavouriteIcon).toHaveBeenCalledWith(
      {
        component: FavouriteIcon,
        urn: props.favouriteMarketsStateURN,
        contentSectionURN: props.cardGroupURN,
      },
      undefined,
    );
  });

  it("should render the OpenBets component with the correct props", () => {
    const props = {
      title: "Over/Under",
      items: [
        {
          id: "ppb:tbd:market:1",
          text: "0.5",
        },
      ],
      selectedCardURN: "ppb:tbd:market:1",
      cardGroupURN: "ppb:cardgroup:1",
    };

    renderComponent(props);

    render(Card.mock.calls[0][0].endElement);

    expect(ConnectedOpenBets).toHaveBeenCalledWith(
      {
        cardURN: "ppb:cardgroup:1",
        component: OpenBets,
      },
      undefined,
    );
  });

  it("should render ConnectedPebbleCard component with correct props", () => {
    const props = {
      title: "Over/Under",
      items: [
        {
          id: "ppb:tbd:market:1",
          text: "0.5",
        },
      ],
      selectedCardURN: "ppb:tbd:market:1",
      selectedCardTypename: "MarketCard",
    };

    renderComponent(props);

    expect(ConnectedCard).toHaveBeenCalledWith(
      {
        urn: "ppb:tbd:market:1",
        component: TBDCard,
        typename: "MarketCard",
      },
      undefined,
    );
  });

  it("should render View All button", () => {
    const props = {
      title: "Over/Under",
      items: [
        {
          id: "ppb:tbd:market:1",
          text: "0.5",
        },
      ],
      selectedCardURN: "ppb:tbd:market:1",
      selectedCardTypename: "MarketCard",
    };

    renderComponent(props);

    expect(ActionLink).toHaveBeenCalledWith(
      {
        noPadding: true,
        onClick: expect.any(Function),
        text: "View All Label",
      },
      undefined,
    );
  });

  it("should render header", () => {
    const props = {
      title: "Over/Under",
      items: [
        {
          id: "ppb:tbd:market:1",
          text: "0.5",
        },
      ],
      selectedCardURN: "ppb:tbd:market:1",
      selectedCardTypename: "MarketCard",
    };

    const { queryByTestId } = renderComponent(props);

    expect(queryByTestId(PEBBLE_CARDGROUP_OUTER_TITLE_TEXT)).toHaveTextContent("Outer Title");
  });

  it("should not render titleContainer when title prop has undefined value", () => {
    const props = {
      title: undefined,
      items: [
        {
          id: "ppb:tbd:market:1",
          text: "0.5",
        },
      ],
      selectedCardURN: "ppb:tbd:market:1",
      cardGroupURN: "ppb:cardgroup:1",
    };

    const { queryByTestId } = renderComponent(props);

    expect(queryByTestId(PEBBLE_CARDGROUP)).not.toBeNull();
    expect(queryByTestId(PEBBLE_CARDGROUP_TITLE_CONTAINER)).toBeNull();
  });

  it("should not render header when outerTitle prop has undefined value", () => {
    const props = {
      outerTitle: null,
      items: [
        {
          id: "ppb:tbd:market:1",
          text: "0.5",
        },
      ],
      selectedCardURN: "ppb:tbd:market:1",
      cardGroupURN: "ppb:cardgroup:1",
    };

    const { queryByTestId } = renderComponent(props);

    expect(queryByTestId(PEBBLE_CARDGROUP)).not.toBeNull();
    expect(queryByTestId(PEBBLE_CARDGROUP_HEADER_CONTAINER)).toBeNull();
  });

  it("should not render header when viewAllLabel prop has undefined value", () => {
    const props = {
      viewAllLabel: null,
      items: [
        {
          id: "ppb:tbd:market:1",
          text: "0.5",
        },
      ],
      selectedCardURN: "ppb:tbd:market:1",
      cardGroupURN: "ppb:cardgroup:1",
    };

    const { queryByTestId } = renderComponent(props);

    expect(queryByTestId(PEBBLE_CARDGROUP)).not.toBeNull();
    expect(queryByTestId(PEBBLE_CARDGROUP_HEADER_CONTAINER)).toBeNull();
  });

  describe("when view all is clicked", () => {
    it("should call dispatchPushAction with the view link", () => {
      const PROPS = {
        viewLink: { viewUrn: "viewUrn" },
        cardGroupURN: "ppb:cardgroup:1",
        selectedCardURN: "ppb:tbd:market:1",
        selectedCardTypename: "MarketCard",
        items: [
          { id: "ppb:tbd:market:1", text: "ppb:tbd:market:1", typename: "MarketCard" },
          { id: "ppb:tbd:market:2", text: "ppb:tbd:market:2", typename: "MarketCard" },
        ],
      };

      renderComponent(PROPS);

      act(() => {
        ActionLink.mock.calls[0][0].onClick();
      });

      expect(DEFAULT_PROPS.dispatchPushAction).toHaveBeenCalledTimes(1);
      expect(DEFAULT_PROPS.dispatchPushAction).toHaveBeenCalledWith({ viewUrn: "viewUrn" });
    });
  });

  describe("when pebble item is clicked", () => {
    it("should call onPebblePress", () => {
      const props = {
        items: [
          {
            id: "ppb:tbd:market:1",
            text: "0.5",
            typename: "MarketCard",
          },
          {
            id: "ppb:tbd:market:2",
            text: "1.5",
            typename: "MarketCard",
          },
        ],
        selectedCardURN: "ppb:tbd:market:1",
        selectedCardTypename: "MarketCard",
        cardGroupURN: "ppb:cardgroup:1",
      };

      renderComponent(props);

      act(() => {
        PebbleMarketTemplate.mock.calls[0][0].onPebblePress("ppb:tbd:market:2");
      });

      expect(DEFAULT_PROPS.dispatchPebbleItemSelection).toHaveBeenCalledTimes(1);
      expect(DEFAULT_PROPS.dispatchPebbleItemSelection).toHaveBeenCalledWith(
        "ppb:tbd:market:2",
        "MarketCard",
        "ppb:cardgroup:1",
      );
    });

    it("should dispatch router push action", () => {
      const props = {
        title: "Over/Under",
        items: [
          {
            id: "ppb:tbd:market:1",
            text: "0.5",
            typename: "MarketCard",
          },
          {
            id: "ppb:tbd:market:2",
            text: "1.5",
            typename: "MarketCard",
          },
        ],
        selectedCardURN: "ppb:tbd:market:1",
        selectedCardTypename: "MarketCard",
        cardGroupURN: "ppb:cardgroup:1",
      };

      renderComponent(props);

      act(() => {
        const { onPebblePress } = PebbleMarketTemplate.mock.calls[0][0];
        onPebblePress("ppb:tbd:market:2");
      });

      expect(DEFAULT_PROPS.dispatchPebbleItemSelection).toHaveBeenCalledWith(
        "ppb:tbd:market:2",
        "MarketCard",
        "ppb:cardgroup:1",
      );
    });

    it("should dispatch fetch cards", () => {
      const props = {
        title: "Over/Under",
        items: [
          {
            id: "ppb:tbd:market:1",
            text: "0.5",
            typename: "MarketCard",
          },
          {
            id: "ppb:tbd:market:2",
            text: "1.5",
            typename: "MarketCard",
          },
        ],
        selectedCardURN: "ppb:tbd:market:1",
        selectedCardTypename: "MarketCard",
        cardGroupURN: "ppb:cardgroup:1",
      };

      renderComponent(props);

      act(() => {
        const { onPebblePress } = PebbleMarketTemplate.mock.calls[0][0];
        onPebblePress("ppb:tbd:market:2");
        onPebblePress("ppb:tbd:market:2");
        onPebblePress("ppb:tbd:market:2");
      });

      expect(DEFAULT_PROPS.dispatchFetchCardsAction).toHaveBeenCalledTimes(3);
      expect(DEFAULT_PROPS.dispatchFetchCardsAction).toHaveBeenCalledWith("ppb:tbd:market:2");
    });
  });

  describe("when Card is toggled", () => {
    it("should emit Card toggle event", () => {
      const props = {
        items: [
          {
            id: "ppb:tbd:market:1",
            text: "0.5",
            typename: "MarketCard",
          },
          {
            id: "ppb:tbd:market:2",
            text: "1.5",
            typename: "MarketCard",
          },
        ],
        pageType: "sport",
        gaTitle: "Title",
        tabName: "Tab name",
      };

      renderComponent(props);

      act(() => {
        const { onTitleClick } = Card.mock.calls[0][0];

        onTitleClick(true);
      });

      expect(emitCollapseToggleEvent).toHaveBeenCalledTimes(1);
      expect(emitCollapseToggleEvent).toHaveBeenCalledWith(true, "sport", "Title", "Tab name");
    });
  });
});
