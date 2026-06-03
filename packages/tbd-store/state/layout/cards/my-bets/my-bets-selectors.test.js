import { createViewByURNSelector } from "../../views/view-selectors";
import { getMyBetsCard, createGetMyBetsFiltersStateSelector } from "./my-bets-selectors";

jest.mock("../../views/view-selectors", () => ({
  createViewByURNSelector: jest.fn(),
}));

describe("getMyBetsCard", () => {
  it("should return mybets card", () => {
    const state = {
      router: {},
      layouts: {
        cards: {
          mybets: { orderTypeFilter: "open", productTypeFilter: "exc" },
        },
      },
    };
    expect(getMyBetsCard(state)).toBe(state.layouts.cards.mybets);
  });
});

describe("createGetMyBetsFiltersStateSelector", () => {
  describe("when myBetsState is defined on store", () => {
    it("should return myBetsState", () => {
      const state = {
        router: {},
        layouts: {
          cards: {
            mybets: { orderTypeFilter: "open", productTypeFilter: "exc", viewUrn: "viewUrn" },
          },
          views: {
            mybets: {},
          },
        },
      };
      expect(createGetMyBetsFiltersStateSelector()(state)).toBe(state.layouts.cards.mybets);
    });

    describe("when myBetsState is defined on store with isHeritageView and viewUrn only", () => {
      it("should return myBetsState", () => {
        const state = {
          router: {},
          layouts: {
            cards: {
              mybets: { isHeritageView: true, hasHeritageBets: true, viewUrn: "viewUrn" },
            },
            views: {
              mybets: {},
            },
          },
        };
        expect(createGetMyBetsFiltersStateSelector()(state)).toBe(state.layouts.cards.mybets);
      });
    });
  });

  describe("when myBetsState is not defined on store", () => {
    describe("when getCurrentViewURN return's null", () => {
      it("should return an empty object", () => {
        const state = {
          router: {
            currentUrn: null,
          },
          layouts: {
            cards: {
              mybets: {},
            },
            views: {
              mybets: {
                currentViewURNMock: {
                  filters: {
                    orderType: {
                      defaultIndex: 0,
                      items: ["orderTypeFilter_0"],
                    },
                    productType: {
                      defaultIndex: 1,
                      items: ["product_0", "product_1"],
                    },
                  },
                },
              },
            },
          },
        };

        expect(createGetMyBetsFiltersStateSelector()(state, state.layouts.views.mybets)).toEqual({});
      });
    });
    describe("when my bets view is defined on store", () => {
      describe("when has the view defined", () => {
        it("should return myBetsState inferred from view", () => {
          const state = {
            router: {
              currentUrn: "currentViewURNMock",
            },
            layouts: {
              cards: {
                mybets: {},
              },
              views: {
                mybets: {
                  currentViewURNMock: {
                    filters: {
                      orderType: {
                        defaultIndex: 0,
                        items: ["orderTypeFilter_0"],
                      },
                      productType: {
                        defaultIndex: 1,
                        items: ["product_0", "product_1"],
                      },
                      hasHeritageBets: true,
                      isHeritageView: true,
                    },
                  },
                },
              },
            },
          };
          createViewByURNSelector.mockReturnValue(() => state.layouts.views.mybets.currentViewURNMock);

          expect(createGetMyBetsFiltersStateSelector()(state, state.layouts.views.mybets)).toEqual({
            orderTypeFilter: "orderTypeFilter_0",
            productTypeFilter: "product_1",
            viewUrn: "currentViewURNMock",
            hasHeritageBets: true,
            isHeritageView: true,
          });
        });
      });

      describe("when doesn't have the view defined", () => {
        it("should return an empty object", () => {
          const state = {
            router: {},
            layouts: {
              cards: {
                mybets: {},
              },
              views: {
                mybets: {},
              },
            },
          };
          createViewByURNSelector.mockReturnValue(() => state.layouts.views.mybets.currentViewURNMock);

          expect(createGetMyBetsFiltersStateSelector()(state, state.layouts.views.mybets)).toEqual({});
        });
      });
    });
  });
});
