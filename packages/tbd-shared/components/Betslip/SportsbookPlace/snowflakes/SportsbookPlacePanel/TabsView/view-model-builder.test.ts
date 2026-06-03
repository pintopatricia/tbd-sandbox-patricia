import { renderHook } from "@testing-library/react";
import { useTabsViewModel } from "./view-model-builder";
import { SportsbookPlaceTabsPanelViewModel, TabsResolvers } from "./SportsbookPlaceTabsPanel.types";

const TABS_RESOLVERS_MOCK: TabsResolvers = {
  ALL: {
    key: "ALL",
    title: () => "ALL title",
    visible: () => true,
    content: () => "ALL content",
  },
  BET_BUILDER: {
    key: "BET_BUILDER",
    title: () => "BET_BUILDER title",
    visible: () => false,
    content: () => "BET_BUILDER content",
  },
  MULTIPLES: {
    key: "MULTIPLES",
    title: () => "MULTIPLES title",
    visible: () => true,
    content: () => "MULTIPLES content",
  },
  CAST_BET: {
    key: "CAST_BET",
    title: () => "CAST_BET title",
    visible: () => false,
    content: () => "CAST_BET content",
  },
  SINGLES: {
    key: "SINGLES",
    title: () => "SINGLES title",
    visible: () => true,
    content: () => "SINGLES content",
  },
};

describe("useTabsViewModel", () => {
  function renderUseTabsViewModel({ experimentVariant }: { experimentVariant: "with-all" | "without-all" }) {
    const BASE_PROPS: SportsbookPlaceTabsPanelViewModel = {
      experimentVariant,
      betslipCards: [],
      hasPlaceError: false,
      isPlaceDisabled: false,
      placeBtnLabel: "placeBtnLabel",
      i18n: {
        oddsLabel: "oddsLabel",
        stakeLabel: "stakeLabel",
        totalReturns: "totalReturns",
        multiples: "multiples",
        additionalMultiples: "additionalMultiples",
        singles: "singles",
        removeLabel: "removeLabel",
        oddsMovementUp: "oddsMovementUp",
        oddsMovementDown: "oddsMovementDown",
        casts: "casts",
        eachWay: "eachWay",
        betBuilder: "betBuilder",
        multiBetBuilder: "multiBetBuilder",
        balanceAfterBet: "balanceAfterBet",
        priceBoosts: "priceBoosts",
        betslipAriaTitle: "betslipAriaTitle",
        tabAllTitle: "ALL title",
        tabMultiplesTitle: "MULTIPLES title",
        tabSinglesTitle: "SINGLES title",
        tabBetBuildersTitle: "BET_BUILDER title",
        tabCastTitle: "CAST_BET title",
      },
      totalReturns: "total returns",
      hasSingles: false,
      hasOnlyOneSingle: false,
      hasOneLineMultiple: false,
      hasMultipleLinesMultiples: false,
      hasMultiBetBuilder: false,
      hasCastBets: false,
      hasPriceBoost: false,
      hasBetBuilders: false,
      betBuilderIds: [],
      boostedCombinationIds: [],
      failedCombinationGroups: [],
      failedCombinationGroupIds: [],
      onPlaceClick: jest.fn(),
      onRemoveAllClick: jest.fn(),
      onCollapseToggle: jest.fn(),
    };

    return renderHook(({ props, tabsResolvers }) => useTabsViewModel(props, tabsResolvers), {
      initialProps: {
        props: {
          ...BASE_PROPS,
        },
        tabsResolvers: TABS_RESOLVERS_MOCK,
      },
    });
  }

  describe("when experimentVariant is without-all", () => {
    describe("headers", () => {
      it("should return headers view model without All tab and only for visible tabs", () => {
        const { result } = renderUseTabsViewModel({
          experimentVariant: "without-all",
        });

        expect(result.current.headers).toEqual([
          {
            id: "MULTIPLES",
            title: "MULTIPLES title",
          },
          {
            id: "SINGLES",
            title: "SINGLES title",
          },
        ]);
      });
    });

    describe("contents", () => {
      it("should return contents view model without All tab and only for visible tabs", () => {
        const { result } = renderUseTabsViewModel({
          experimentVariant: "without-all",
        });

        expect(result.current.contents).toEqual([
          {
            id: "MULTIPLES",
            content: "MULTIPLES content",
          },
          {
            id: "SINGLES",
            content: "SINGLES content",
          },
        ]);
      });
    });
  });

  describe("when experimentVariant is with-all", () => {
    describe("headers", () => {
      it("should return headers view model without All tab and only for visible tabs", () => {
        const { result } = renderUseTabsViewModel({
          experimentVariant: "with-all",
        });

        expect(result.current.headers).toEqual([
          {
            id: "ALL",
            title: "ALL title",
          },
          {
            id: "MULTIPLES",
            title: "MULTIPLES title",
          },
          {
            id: "SINGLES",
            title: "SINGLES title",
          },
        ]);
      });
    });

    describe("contents", () => {
      it("should return contents view model without All tab and only for visible tabs", () => {
        const { result } = renderUseTabsViewModel({
          experimentVariant: "with-all",
        });

        expect(result.current.contents).toEqual([
          {
            id: "ALL",
            content: "ALL content",
          },
          {
            id: "MULTIPLES",
            content: "MULTIPLES content",
          },
          {
            id: "SINGLES",
            content: "SINGLES content",
          },
        ]);
      });
    });
  });
});
