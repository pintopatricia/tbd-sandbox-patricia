import { render, act } from "@testing-library/react";
import { ShowMore, MarketPromo, Card } from "@ppb/the-wall-web";
import { ValueIconName } from "@ppb/the-wall-icons";
import { GenericIcon, IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import PriceBoostMultisListCard from "./PriceBoostMultisListCard.web";
import BettingOpportunity from "../BettingOpportunity/BettingOpportunity.web";
import ConnectedBettingOpportunity from "../BettingOpportunity";
import { NoContentAvailableCard } from "../NoContentAvailableCard/NoContentAvailableCard.web";
import { emitCollapseToggleEvent, emitShowMoreShowLessClickEvent } from "./event-emitters";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn((t) => t.key),
}));

jest.mock("@ppb/the-wall-web", () => ({
  ShowMore: jest.fn(() => <show-more-mock />),
  MarketPromo: jest.fn(() => <market-promo-mock />),
  Card: jest.fn(({ children, props }) => <card-mock {...props}>{children}</card-mock>),
}));

jest.mock("./event-emitters", () => ({
  emitCollapseToggleEvent: jest.fn(),
  emitShowMoreShowLessClickEvent: jest.fn(),
}));

jest.mock("../BettingOpportunity/BettingOpportunity.web", () =>
  jest.fn(() => <betting-opportunity data-testid="betting-opportunity" />),
);
jest.mock("../BettingOpportunity", () => jest.fn(() => <connected-betting-opportunity />));
jest.mock("../NoContentAvailableCard/NoContentAvailableCard.web", () => ({
  NoContentAvailableCard: jest.fn(() => <no-content-mock />),
}));
jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => {
  const actual = jest.requireActual("@ppb/the-wall-icons/GenericIcon/GenericIcon");
  return {
    ...actual,
    GenericIcon: jest.fn(() => <no-content-mock />),
  };
});

const BASE_PROPS = {
  cardUrn: "card:urn",
  title: "Title Card",
  items: ["tbd:urn:1", "tbd:urn:2"],
  hasMoreItems: false,
  hasNextPage: false,
  showWasPrice: true,
  pageType: "sport",
  tabName: "Tab name",
  blurb: {
    isExpanded: true,
    title: "blurb title",
    description: "blurb description",
    link: {
      text: "link text",
    },
  },
  dispatchFetchCards: jest.fn(),
};

function renderPriceBoostMultisListCard(overwrites) {
  const props = {
    ...BASE_PROPS,
    ...overwrites,
  };

  return render(<PriceBoostMultisListCard {...props} />);
}

describe("PriceBoostMultisListCard", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("header", () => {
    it("should render icon", () => {
      renderPriceBoostMultisListCard({ items: [] });

      const { startElement } = Card.mock.calls[0][0];
      render(startElement);

      expect(GenericIcon).toHaveBeenCalledWith(
        {
          name: ValueIconName.PRICE_BOOST,
          color: "var(--popular-bet-builder-card-header-boost-icon-colour)",
        },
        undefined,
      );
      expect(GenericIcon).toHaveBeenCalledTimes(1);
    });

    it("should render title", async () => {
      const { findByText } = renderPriceBoostMultisListCard({ title: "Card title", items: [] });

      render(Card.mock.calls[0][0].title);
      expect(await findByText("Card title")).toBeDefined();
    });
  });

  describe("when it does not have items", () => {
    it("should render Collapse component with correct props", () => {
      renderPriceBoostMultisListCard({ items: [] });

      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          startOpen: true,
          title: "Title Card",
          onTitleClick: expect.any(Function),
          startElement: expect.any(Object),
          children: expect.any(Object),
        }),
        undefined,
      );
    });

    it("should render NoContentAvailableCard component", () => {
      renderPriceBoostMultisListCard({ items: [] });

      expect(NoContentAvailableCard).toHaveBeenCalledTimes(1);
    });

    it("should not render ConnectedBettingOpportunity component", () => {
      renderPriceBoostMultisListCard({ items: [] });

      expect(ConnectedBettingOpportunity).not.toHaveBeenCalled();
    });

    it("should not render ShowMore component", () => {
      renderPriceBoostMultisListCard({ items: [] });

      expect(ShowMore).not.toHaveBeenCalled();
    });
  });

  describe("when handling pagination through show more", () => {
    describe("when there are no extra items", () => {
      it("should not call ShowMore", () => {
        renderPriceBoostMultisListCard({ hasMoreItems: false });

        expect(ShowMore).not.toHaveBeenCalled();
      });
    });

    describe("when there are extra items", () => {
      describe("when there is a next page", () => {
        it("should call ShowMore with opened as false", () => {
          renderPriceBoostMultisListCard({ hasMoreItems: true, hasNextPage: true });

          expect(ShowMore).toHaveBeenCalledWith(expect.objectContaining({ opened: false }), undefined);
        });

        it("should call ShowMore with text as I18N.SHOW_MORE", () => {
          renderPriceBoostMultisListCard({ hasMoreItems: true, hasNextPage: true });

          expect(ShowMore).toHaveBeenCalledWith(expect.objectContaining({ text: "I18N.SHOW_MORE" }), undefined);
        });

        describe("when ShowMore is clicked", () => {
          it("should call dispatchFetchCards", () => {
            const dispatchFetchCards = jest.fn();

            renderPriceBoostMultisListCard({ hasMoreItems: true, hasNextPage: true, dispatchFetchCards });

            act(() => {
              const [[{ onClick }]] = ShowMore.mock.calls;

              onClick();
            });

            expect(dispatchFetchCards).toHaveBeenCalled();
          });
        });
      });

      describe("when there are no more pages", () => {
        it("should call ShowMore with opened as true", () => {
          renderPriceBoostMultisListCard({ hasMoreItems: true, hasNextPage: false });

          expect(ShowMore).toHaveBeenCalledWith(expect.objectContaining({ opened: true }), undefined);
        });

        it("should call ShowMore with text as I18N.SHOW_LESS", () => {
          renderPriceBoostMultisListCard({ hasMoreItems: true, hasNextPage: false });

          expect(ShowMore).toHaveBeenCalledWith(expect.objectContaining({ text: "I18N.SHOW_LESS" }), undefined);
        });

        describe("when ShowMore is clicked", () => {
          it("should toggle ShowMore open state", () => {
            renderPriceBoostMultisListCard({ hasMoreItems: true, hasNextPage: false });

            expect(ShowMore).toHaveBeenNthCalledWith(1, expect.objectContaining({ opened: true }), undefined);

            act(() => {
              const [[{ onClick }]] = ShowMore.mock.calls;

              onClick();
            });

            expect(ShowMore).toHaveBeenNthCalledWith(2, expect.objectContaining({ opened: false }), undefined);
          });

          it("should limit to 4 items", () => {
            renderPriceBoostMultisListCard({
              hasMoreItems: true,
              hasNextPage: false,
              items: ["urn:1", "urn:2", "urn:3", "urn:4", "urn:5"],
            });

            expect(ConnectedBettingOpportunity).toHaveBeenCalledTimes(5);

            ConnectedBettingOpportunity.mockClear(); // Reset count to verify only 4 calls (instead of 9) happen next render

            act(() => {
              const [[{ onClick }]] = ShowMore.mock.calls;

              onClick();
            });

            expect(ConnectedBettingOpportunity).toHaveBeenCalledTimes(4);
          });
        });
      });
    });
  });

  it("should render Collapse with the correct props", () => {
    const { title, items } = BASE_PROPS;

    renderPriceBoostMultisListCard({ title, items });

    expect(Card).toHaveBeenCalledTimes(1);
    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        startOpen: true,
        title: "Title Card",
        onTitleClick: expect.any(Function),
        startElement: expect.any(Object),
        children: expect.any(Object),
      }),
      undefined,
    );
  });

  it("should render MarketPromo with the correct props", () => {
    renderPriceBoostMultisListCard();

    expect(MarketPromo).toHaveBeenCalledTimes(1);
    expect(MarketPromo).toHaveBeenCalledWith(
      expect.objectContaining({
        isExpanded: true,
        variant: "info",
        title: "blurb title",
        description: "blurb description",
        signposting: IconsList.NOTIFICATION_WARNING,
      }),
      undefined,
    );
  });

  it("should render ConnectedBettingOpportunity", () => {
    renderPriceBoostMultisListCard();

    expect(ConnectedBettingOpportunity).toHaveBeenNthCalledWith(
      1,
      {
        cardUrn: "card:urn",
        component: BettingOpportunity,
        opportunityUrn: "tbd:urn:1",
        showWasPrice: true,
      },
      undefined,
    );
    expect(ConnectedBettingOpportunity).toHaveBeenNthCalledWith(
      2,
      {
        cardUrn: "card:urn",
        component: BettingOpportunity,
        opportunityUrn: "tbd:urn:2",
        showWasPrice: true,
      },
      undefined,
    );
  });
  describe("when Collapse is toggled", () => {
    describe("when Card is not collapsed", () => {
      it("should emit onToggleEvent with falsy value", () => {
        renderPriceBoostMultisListCard();
        const [[{ onTitleClick }]] = Card.mock.calls;

        act(() => {
          onTitleClick(false);
        });

        expect(Card).toHaveBeenCalledTimes(1);
        expect(emitCollapseToggleEvent).toHaveBeenCalledTimes(1);
        expect(emitCollapseToggleEvent).toHaveBeenCalledWith(false, "sport", "Title Card", "Tab name");
      });
    });

    describe("when Card is collapsed", () => {
      it("should emit onToggleEvent with truthy value", () => {
        renderPriceBoostMultisListCard();
        const [[{ onTitleClick }]] = Card.mock.calls;

        act(() => {
          onTitleClick(true);
        });

        expect(Card).toHaveBeenCalledTimes(1);
        expect(emitCollapseToggleEvent).toHaveBeenCalledTimes(1);
        expect(emitCollapseToggleEvent).toHaveBeenCalledWith(true, "sport", "Title Card", "Tab name");
      });
    });
  });

  describe("when showMore is clicked", () => {
    describe("when Card has next page", () => {
      it("should emit show more with truthy value", () => {
        renderPriceBoostMultisListCard({ hasNextPage: true, hasMoreItems: true });
        const [[{ onClick }]] = ShowMore.mock.calls;

        act(() => {
          onClick();
        });

        expect(ShowMore).toHaveBeenCalledTimes(1);
        expect(emitShowMoreShowLessClickEvent).toHaveBeenCalledTimes(1);
        expect(emitShowMoreShowLessClickEvent).toHaveBeenCalledWith(true, "sport", "Title Card", "Tab name");
      });
    });

    describe("when Card doesn't have next page and is open", () => {
      it("should emit show more with falsy value", () => {
        renderPriceBoostMultisListCard({ hasNextPage: false, hasMoreItems: true });
        const [[{ onClick }]] = ShowMore.mock.calls;

        act(() => {
          onClick();
        });

        expect(emitShowMoreShowLessClickEvent).toHaveBeenCalledTimes(1);
        expect(emitShowMoreShowLessClickEvent).toHaveBeenCalledWith(false, "sport", "Title Card", "Tab name");
      });
    });
    describe("when Card doesn't have next page and is not open", () => {
      it("should emit show more with truthy value", () => {
        renderPriceBoostMultisListCard({ hasNextPage: false, hasMoreItems: true });
        const firstOnClick = ShowMore.mock.calls[0][0].onClick;

        act(() => {
          firstOnClick();
        });
        const secondClick = ShowMore.mock.calls[1][0].onClick;

        act(() => {
          secondClick();
        });

        expect(emitShowMoreShowLessClickEvent).toHaveBeenCalledTimes(2);
        expect(emitShowMoreShowLessClickEvent).toHaveBeenNthCalledWith(1, false, "sport", "Title Card", "Tab name");
        expect(emitShowMoreShowLessClickEvent).toHaveBeenNthCalledWith(2, true, "sport", "Title Card", "Tab name");
      });
    });
  });
});
