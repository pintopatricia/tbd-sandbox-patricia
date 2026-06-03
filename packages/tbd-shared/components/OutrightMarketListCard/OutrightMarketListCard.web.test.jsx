import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { Card } from "@ppb/the-wall-web";

import OutrightMarketListCard from "./OutrightMarketListCard.web";
import ConnectedFavouriteIcon from "../FavouriteIcon";
import FavouriteIcon from "../FavouriteIcon/FavouriteIcon.web";
import ConnectedSportsbookMarket from "../SportsbookMarket";
import ShowMore from "../ShowMore/ShowMore.web";
import SportsbookMarket from "../SportsbookMarket/SportsbookMarket.web";
import useShowMore from "../../hooks/useShowMore";

const outrightMarketsMock = [
  { marketUrn: "marketUrn1", runnersUrns: "runnersUrns1", marketName: "marketName1" },
  { marketUrn: "marketUrn2", runnersUrns: "runnersUrns2", marketName: "marketName2" },
];

jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn(({ children }) => <card-mock>{children}</card-mock>),
  useOnIntersect: jest.fn(() => ({ isIntersecting: false, ref: null })),
}));

jest.mock("../FavouriteIcon", () => jest.fn(() => <connected-favourite-icon-mock />));

jest.mock("../FavouriteIcon/FavouriteIcon.web", () => jest.fn(() => <favourite-icon-mock />));

jest.mock("../SportsbookMarket", () => jest.fn(({ props }) => <connected-sportsbook-market-mock {...props} />));

jest.mock("../ShowMore/ShowMore.web", () => jest.fn(() => <show-more-mock />));

jest.mock("../../hooks/useShowMore", () =>
  jest.fn(() => ({
    itemsToDisplay: outrightMarketsMock,
    isItemsListCollapsed: false,
    onShowMoreChange: jest.fn(),
  })),
);

const DEFAULT_PROPS = {
  cardUrn: "cardUrn",
  outrightMarkets: [],
  numberOfRowsToDisplay: 4,
  dispatchRefreshCard: jest.fn(),
  dispatchToggleShowMoreRunners: jest.fn(),
};

const renderComponent = (props = {}) => render(<OutrightMarketListCard {...DEFAULT_PROPS} {...props} />);

describe("OutrightMarketListCard", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there is no title", () => {
    it("should not render the Card component", () => {
      renderComponent({ title: undefined });

      expect(Card).not.toHaveBeenCalled();
    });
  });

  describe("when there is title", () => {
    beforeEach(() => {
      renderComponent({
        title: "title",
        outrightMarkets: outrightMarketsMock,
      });
    });

    it("should call useShowMore with the expected props", () => {
      expect(useShowMore).toHaveBeenCalledWith({
        items: outrightMarketsMock,
        numberOfItemsToDisplay: 4,
      });
    });

    it("should call the ShowMore component with the expected props", () => {
      expect(ShowMore).toHaveBeenCalledWith(
        {
          cardRef: null,
          numberOfItemsToDisplay: 4,
          numberOfLines: 2,
          showMore: false,
          setShowMore: expect.any(Function),
          onToggleShowMoreRunners: expect.any(Function),
        },
        undefined,
      );
    });

    it("should render the Card component", () => {
      expect(Card).toHaveBeenCalledTimes(2);
      const firstCall = Card.mock.calls[0][0];

      expect(firstCall).toMatchObject({
        startOpen: true,
        title: "title",
        children: expect.anything(),
      });
    });

    it("should render the ConnectedSportsbookMarket components", () => {
      expect(ConnectedSportsbookMarket).toHaveBeenNthCalledWith(
        1,
        {
          component: SportsbookMarket,
          urn: "marketUrn1",
          cardUrn: "cardUrn",
          template: MarketTemplate.Inline,
          displayRunnersUrns: "runnersUrns1",
          isUppercase: true,
        },
        undefined,
      );
      expect(ConnectedSportsbookMarket).toHaveBeenNthCalledWith(
        2,
        {
          component: SportsbookMarket,
          urn: "marketUrn2",
          cardUrn: "cardUrn",
          template: MarketTemplate.Inline,
          displayRunnersUrns: "runnersUrns2",
          isUppercase: true,
        },
        undefined,
      );
    });
  });

  describe("when there is title and favouriteMarketsStateURN is provided", () => {
    it("should render the FavouriteIcon component with the correct props", () => {
      renderComponent({
        title: "title",
        favouriteMarketsStateURN: "favouriteMarketsStateURN",
      });

      render(Card.mock.calls[0][0].endElement);

      expect(ConnectedFavouriteIcon).toHaveBeenCalledWith(
        {
          component: FavouriteIcon,
          urn: "favouriteMarketsStateURN",
          contentSectionURN: "cardUrn",
        },
        undefined,
      );
    });
  });
});
