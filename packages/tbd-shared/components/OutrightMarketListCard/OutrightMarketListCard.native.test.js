import { render } from "@testing-library/react-native";
import { Card } from "@ppb/the-wall-native";

import ConnectedFavouriteIcon from "../FavouriteIcon";
import FavouriteIcon from "../FavouriteIcon/FavouriteIcon.native";
import ConnectedSportsbookMarket from "../SportsbookMarket";
import OutrightMarketListCard from "./OutrightMarketListCard.native";
import ShowMore from "../ShowMore/ShowMore.native";
import useShowMore from "../../hooks/useShowMore";

const OUTRIGHT_MARKETS = [
  { marketName: "m1", marketUrn: "1.1234567890", runnersUrns: ["1", "2", "3"] },
  { marketName: "m2", marketUrn: "1.1234567891", runnersUrns: ["4", "5", "6"] },
  { marketName: "m3", marketUrn: "1.1234567892", runnersUrns: ["7", "8", "9"] },
];

jest.mock("../FavouriteIcon", () => jest.fn(() => <connected-favourite-icon-mock />));
jest.mock("../FavouriteIcon/FavouriteIcon.native", () => jest.fn(() => <favourite-icon-mock />));
jest.mock("../SportsbookMarket", () => jest.fn(() => <connected-sportsbook-market />));
jest.mock("../SportsbookMarket/SportsbookMarket.native", () => jest.fn(() => <sportsbook-market />));
jest.mock("../ShowMore/ShowMore.native", () => jest.fn(() => <show-more-mock />));
jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
}));
jest.mock("../../hooks/useNativeLazyLoading.native", () => ({
  useVisibilityStatus: jest.fn(() => true),
}));
jest.mock("../../hooks/useShowMore", () =>
  jest.fn(() => ({
    itemsToDisplay: OUTRIGHT_MARKETS,
    isItemsListCollapsed: true,
    isShowMoreAvailable: true,
    onShowMoreChange: jest.fn(),
  })),
);
jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn(({ children, props }) => <card-mock {...props}>{children}</card-mock>),
  Text: jest.requireActual("react-native").Text,
}));

const CARD_URN = "cardUrn";
const FAVOURITE_MARKETS_STATE_URN = "favouriteMarketsStateURN";
const TITLE = "title";
const INLINE_TEMPLATE = "INLINE";
const dispatchToggleShowMoreRunnersMock = jest.fn();
const dispatchRefreshCardMock = jest.fn();

const DEFAULT_PROPS = {
  cardUrn: CARD_URN,
  outrightMarkets: OUTRIGHT_MARKETS,
  title: TITLE,
  numberOfRowsToDisplay: 3,
  dispatchRefreshCard: dispatchRefreshCardMock,
  dispatchToggleShowMoreRunners: dispatchToggleShowMoreRunnersMock,
};

const renderComponent = (props = {}) => render(<OutrightMarketListCard {...DEFAULT_PROPS} {...props} />);

describe("OutrightMarketListCard", () => {
  beforeEach(jest.clearAllMocks);

  it("should draw the outright market list card", () => {
    renderComponent({});

    expect(Card).toHaveBeenCalledTimes(1);
    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        startOpen: true,
      }),
      undefined,
    );

    expect(ConnectedSportsbookMarket).toHaveBeenCalledTimes(3);
    expect(ConnectedSportsbookMarket.mock.calls[0][0]).toEqual({
      cardUrn: CARD_URN,
      component: expect.any(Function),
      displayRunnersUrns: ["1", "2", "3"],
      isUppercase: true,
      template: INLINE_TEMPLATE,
      urn: "1.1234567890",
    });
    expect(ConnectedSportsbookMarket.mock.calls[1][0]).toEqual({
      cardUrn: CARD_URN,
      component: expect.any(Function),
      displayRunnersUrns: ["4", "5", "6"],
      isUppercase: true,
      template: INLINE_TEMPLATE,
      urn: "1.1234567891",
    });
    expect(ConnectedSportsbookMarket.mock.calls[2][0]).toEqual({
      cardUrn: CARD_URN,
      component: expect.any(Function),
      displayRunnersUrns: ["7", "8", "9"],
      isUppercase: true,
      template: INLINE_TEMPLATE,
      urn: "1.1234567892",
    });

    expect(ShowMore).toHaveBeenCalledTimes(1);
    expect(ShowMore).toHaveBeenCalledWith(
      {
        cardRef: expect.anything(),
        onToggleShowMoreRunners: expect.any(Function),
        numberOfItemsToDisplay: 3,
        numberOfLines: 3,
        setShowMore: expect.any(Function),
        showMore: true,
      },
      undefined,
    );
  });

  it("should call useShowMore with the expected props", () => {
    renderComponent({});

    expect(useShowMore).toHaveBeenCalledWith({
      items: OUTRIGHT_MARKETS,
      numberOfItemsToDisplay: 3,
    });
  });

  describe("when favouriteMarketsStateURN is provided", () => {
    it("should call FavouriteIcon with the expected props", () => {
      renderComponent({ favouriteMarketsStateURN: FAVOURITE_MARKETS_STATE_URN });

      render(Card.mock.calls[0][0].endElement);

      expect(ConnectedFavouriteIcon).toHaveBeenCalledTimes(1);
      expect(ConnectedFavouriteIcon).toHaveBeenCalledWith(
        {
          component: FavouriteIcon,
          urn: FAVOURITE_MARKETS_STATE_URN,
          contentSectionURN: CARD_URN,
        },
        undefined,
      );
    });
  });
});
