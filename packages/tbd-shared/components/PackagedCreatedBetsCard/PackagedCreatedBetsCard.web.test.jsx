import { render, act } from "@testing-library/react";

import { Card, ShowMore } from "@ppb/the-wall-web";

import ConnectedBettingOpportunity from "../BettingOpportunity";
import BettingOpportunity from "../BettingOpportunity/BettingOpportunity.web";
import ConnectedFavouriteIcon from "../FavouriteIcon";
import FavouriteIcon from "../FavouriteIcon/FavouriteIcon.web";
import { NoContentAvailableCard } from "../NoContentAvailableCard/NoContentAvailableCard.web";

import { emitCollapseToggleEvent, emitShowMoreClickEvent, emitShowLessClickEvent } from "./event-emitters";
import PackagedCreatedBetsCard from "./PackagedCreatedBetsCard.web";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn((t) => t.key),
}));

jest.mock("@ppb/the-wall-web", () => ({
  ShowMore: jest.fn(() => <show-more-mock />),
  Card: jest.fn(({ children }) => <card-mock>{children}</card-mock>),
}));

jest.mock("../BettingOpportunity/BettingOpportunity.web", () =>
  jest.fn(() => <betting-opportunity data-testid="betting-opportunity" />),
);
jest.mock("../BettingOpportunity", () => jest.fn(() => <connected-betting-opportunity />));
jest.mock("../FavouriteIcon", () => jest.fn(() => <connected-favourite-icon-mock />));
jest.mock("../FavouriteIcon/FavouriteIcon.web", () => jest.fn(() => <favourite-icon-mock />));
jest.mock("../NoContentAvailableCard/NoContentAvailableCard.web", () => ({
  NoContentAvailableCard: jest.fn(() => <no-content-mock />),
}));

jest.mock("./event-emitters", () => ({
  emitCollapseToggleEvent: jest.fn(),
  emitShowMoreClickEvent: jest.fn(),
  emitShowLessClickEvent: jest.fn(),
}));

const dispatchFetchCards = jest.fn();
const dispatchRefreshCards = jest.fn();

const BASE_PROPS = {
  cardUrn: "card:urn",
  title: "Title Card",
  layoutType: "OUT_OF_CARD",
  items: ["tbd:urn:1", "tbd:urn:2"],
  hasMoreItems: false,
  hasNextPage: false,
  pageType: "sport",
  tabName: "Tab name",
  refreshEnabled: false,
  dispatchFetchCards,
  dispatchRefreshCards,
};

function renderPackagedCreatedBetsCard(overwrites) {
  const props = {
    ...BASE_PROPS,
    ...overwrites,
  };

  return render(<PackagedCreatedBetsCard {...props} />);
}

describe("PackagedCreatedBets", () => {
  beforeEach(() => jest.clearAllMocks());

  describe("when any layout type", () => {
    describe("when it does not have items", () => {
      it("should render Card component with correct props", () => {
        renderPackagedCreatedBetsCard({ items: [] });

        expect(Card).toHaveBeenCalledWith(
          expect.objectContaining({
            startOpen: true,
            title: "Title Card",
            onTitleClick: expect.any(Function),
          }),
          undefined,
        );
        expect(Card).toHaveBeenCalledTimes(1);
      });

      it("should render NoContentAvailableCard component", () => {
        renderPackagedCreatedBetsCard({ items: [] });

        expect(NoContentAvailableCard).toHaveBeenCalledTimes(1);
      });

      it("should not render ConnectedBettingOpportunity component", () => {
        renderPackagedCreatedBetsCard({ items: [] });

        expect(ConnectedBettingOpportunity).not.toHaveBeenCalled();
      });

      it("should not render ShowMore component", () => {
        renderPackagedCreatedBetsCard({ items: [] });

        expect(ShowMore).not.toHaveBeenCalled();
      });
    });
  });

  describe("when handling pagination through show more", () => {
    describe("when there are no extra items", () => {
      it("should not call ShowMore", () => {
        renderPackagedCreatedBetsCard({ hasMoreItems: false });

        expect(ShowMore).not.toHaveBeenCalled();
      });
    });

    describe("when there are extra items", () => {
      describe("when there is a next page", () => {
        it("should call ShowMore with opened as false", () => {
          renderPackagedCreatedBetsCard({ hasMoreItems: true, hasNextPage: true });

          expect(ShowMore).toHaveBeenCalledWith(expect.objectContaining({ opened: false }), undefined);
        });

        it("should call ShowMore with text as I18N.SHOW_MORE", () => {
          renderPackagedCreatedBetsCard({ hasMoreItems: true, hasNextPage: true });

          expect(ShowMore).toHaveBeenCalledWith(expect.objectContaining({ text: "I18N.SHOW_MORE" }), undefined);
        });

        describe("when ShowMore is clicked", () => {
          it("should call dispatchFetchCards", () => {
            renderPackagedCreatedBetsCard({ hasMoreItems: true, hasNextPage: true, dispatchFetchCards });

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
          renderPackagedCreatedBetsCard({ hasMoreItems: true, hasNextPage: false });

          expect(ShowMore).toHaveBeenCalledWith(expect.objectContaining({ opened: true }), undefined);
        });

        it("should call ShowMore with text as I18N.SHOW_LESS", () => {
          renderPackagedCreatedBetsCard({ hasMoreItems: true, hasNextPage: false });

          expect(ShowMore).toHaveBeenCalledWith(expect.objectContaining({ text: "I18N.SHOW_LESS" }), undefined);
        });

        describe("when ShowMore is clicked", () => {
          it("should toggle ShowMore open state", () => {
            renderPackagedCreatedBetsCard({ hasMoreItems: true, hasNextPage: false });

            expect(ShowMore).toHaveBeenNthCalledWith(1, expect.objectContaining({ opened: true }), undefined);

            act(() => {
              const [[{ onClick }]] = ShowMore.mock.calls;

              onClick();
            });

            expect(ShowMore).toHaveBeenNthCalledWith(2, expect.objectContaining({ opened: false }), undefined);
          });
          it("should limit to 4 items", () => {
            renderPackagedCreatedBetsCard({
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
          describe("when it has more items and next page", () => {
            it("should emit show more click event", () => {
              renderPackagedCreatedBetsCard({ hasMoreItems: true, hasNextPage: true });

              act(() => {
                const [[{ onClick }]] = ShowMore.mock.calls;

                onClick();
              });

              expect(emitShowMoreClickEvent).toHaveBeenCalledWith("sport", "Title Card", "Tab name");
              expect(emitShowMoreClickEvent).toHaveBeenCalledTimes(1);
            });
          });

          describe("when it's fully open and has no next page", () => {
            it("should emit show less click event", () => {
              renderPackagedCreatedBetsCard({ hasMoreItems: true, hasNextPage: false });

              act(() => {
                const [[{ onClick }]] = ShowMore.mock.calls;
                onClick();
              });

              expect(emitShowLessClickEvent).toHaveBeenCalledTimes(1);
            });

            it("should emit showLess on first click and show more on second click", () => {
              renderPackagedCreatedBetsCard({ hasMoreItems: true, hasNextPage: false });

              act(() => {
                const [[{ onClick }]] = ShowMore.mock.calls;
                onClick();
              });

              expect(emitShowLessClickEvent).toHaveBeenCalledTimes(1);

              act(() => {
                ShowMore.mock.calls[1][0].onClick();
              });
              expect(emitShowMoreClickEvent).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
    });
  });

  describe("when layout type is OUT_OF_CARD", () => {
    it("should render Card with the correct props", () => {
      const { title, layoutType, items } = BASE_PROPS;

      renderPackagedCreatedBetsCard({ title, layoutType, items });

      expect(Card).toHaveBeenCalledTimes(1);
      expect(Card).toHaveBeenCalledWith(
        expect.objectContaining({
          startOpen: true,
          title: "Title Card",
          onTitleClick: expect.any(Function),
        }),
        undefined,
      );
    });

    it("should render ConnectedBettingOpportunity", () => {
      renderPackagedCreatedBetsCard();

      expect(ConnectedBettingOpportunity).toHaveBeenNthCalledWith(
        1,
        {
          cardUrn: "card:urn",
          component: BettingOpportunity,
          opportunityUrn: "tbd:urn:1",
        },
        undefined,
      );
      expect(ConnectedBettingOpportunity).toHaveBeenNthCalledWith(
        2,
        {
          cardUrn: "card:urn",
          component: BettingOpportunity,
          opportunityUrn: "tbd:urn:2",
        },
        undefined,
      );
    });

    describe("when collapse is toggled", () => {
      it("should emit collapse toggle event", () => {
        renderPackagedCreatedBetsCard({ hasMoreItems: true, hasNextPage: false });

        act(() => {
          const [[{ onTitleClick }]] = Card.mock.calls;

          onTitleClick(true);
        });

        expect(emitCollapseToggleEvent).toHaveBeenCalledWith(true, "sport", "Title Card", "Tab name");
        expect(emitCollapseToggleEvent).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when layout type is IN_CARD", () => {
    it("should render ConnectedBettingOpportunity", () => {
      renderPackagedCreatedBetsCard({ layoutType: "IN_CARD" });

      expect(ConnectedBettingOpportunity).toHaveBeenNthCalledWith(
        1,
        {
          cardUrn: "card:urn",
          component: BettingOpportunity,
          opportunityUrn: "tbd:urn:1",
        },
        undefined,
      );
      expect(ConnectedBettingOpportunity).toHaveBeenNthCalledWith(
        2,
        {
          cardUrn: "card:urn",
          component: BettingOpportunity,
          opportunityUrn: "tbd:urn:2",
        },
        undefined,
      );
    });
  });

  describe("when favouriteMarketsStateURN is present", () => {
    it("should render ConnectedFavouriteIcon", () => {
      renderPackagedCreatedBetsCard({ favouriteMarketsStateURN: "urn:1" });

      render(Card.mock.calls[0][0].endElement);

      expect(ConnectedFavouriteIcon).toHaveBeenCalledWith(
        {
          component: FavouriteIcon,
          urn: "urn:1",
          contentSectionURN: "card:urn",
        },
        undefined,
      );
    });
  });

  describe("useRefreshComponent", () => {
    beforeEach(() => {
      jest.clearAllTimers();
      jest.useRealTimers();
    });

    describe("when refreshEnabled is false", () => {
      describe("when refresh is triggered before 140 seconds", () => {
        it("should not call dispatchRefreshCards", () => {
          renderPackagedCreatedBetsCard({ refreshEnabled: false });

          jest.useFakeTimers();
          jest.advanceTimersByTime(139000);

          renderPackagedCreatedBetsCard({ refreshEnabled: false });

          expect(dispatchRefreshCards).not.toHaveBeenCalled();
        });
      });

      describe("when refresh is triggered after 140 seconds", () => {
        it("should not call dispatchRefreshCards", () => {
          renderPackagedCreatedBetsCard({ refreshEnabled: false });

          jest.useFakeTimers();
          jest.advanceTimersByTime(141000);

          renderPackagedCreatedBetsCard({ refreshEnabled: false });

          expect(dispatchRefreshCards).not.toHaveBeenCalled();
        });
      });
    });

    describe("when refreshEnabled is true", () => {
      describe("when refresh is triggered before 140 seconds", () => {
        it("should not call dispatchRefreshCards", () => {
          renderPackagedCreatedBetsCard({ refreshEnabled: true });

          jest.useFakeTimers();
          jest.advanceTimersByTime(139000);

          renderPackagedCreatedBetsCard({ refreshEnabled: true });

          expect(dispatchRefreshCards).not.toHaveBeenCalled();
        });
      });

      describe("when refresh is triggered after 140 seconds", () => {
        it("should call dispatchRefreshCards", () => {
          renderPackagedCreatedBetsCard({ refreshEnabled: true });

          jest.useFakeTimers();
          jest.advanceTimersByTime(141000);

          renderPackagedCreatedBetsCard({ refreshEnabled: true });
          expect(dispatchRefreshCards).toHaveBeenCalledWith(BASE_PROPS.cardUrn, 2);
        });
      });
    });
  });
});
