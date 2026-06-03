import { render } from "@testing-library/react";
import { BetBuildersCard } from "../../../../BetBuildersCard/BetBuildersCard.web";
import { CastBetsCard } from "../../../../CastBetsCard/CastBetsCard.web";
import { MultiBetBuilderCard } from "../../../../MultiBetBuilderCard/MultiBetBuilderCard.web";
import { MultiLinesMultiples } from "../../../../MultiLinesMultiples/MultiLinesMultiples.web";
import { OneLineMultiple } from "../../../../OneLineMultiple/OneLineMultiple.web";
import { PriceBoostSection } from "../../../../PriceBoostSection/PriceBoostSection.web";
import { SinglesCard } from "../../../../SinglesCard/SinglesCard.web";
import { TAB_RESOLVERS } from "./tabs-resolver.web";
import { TabSection } from "./TabSection.web";

jest.mock("./TabSection.web", () => ({
  TabSection: jest.fn((props) => <tab-section-mock {...props} />),
}));

jest.mock("../../../../BetBuildersCard", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-bet-builders-card-mock {...props} />),
}));

jest.mock("../../../../BetBuildersCard/BetBuildersCard.web", () => ({
  __esModule: true,
  BetBuildersCard: jest.fn((props) => <bet-builders-card-mock {...props} />),
}));

jest.mock("../../../../MultiBetBuilderCard", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-multi-bet-builder-card-mock {...props} />),
}));

jest.mock("../../../../MultiBetBuilderCard/MultiBetBuilderCard.web", () => ({
  __esModule: true,
  MultiBetBuilderCard: jest.fn((props) => <multi-bet-builder-card-mock {...props} />),
}));

jest.mock("../../../../MultiLinesMultiples", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-multi-lines-multiples-mock {...props} />),
}));

jest.mock("../../../../MultiLinesMultiples/MultiLinesMultiples.web", () => ({
  __esModule: true,
  MultiLinesMultiples: jest.fn((props) => <multi-lines-multiples-mock {...props} />),
}));

jest.mock("../../../../OneLineMultiple", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-one-line-multiple-mock {...props} />),
}));

jest.mock("../../../../OneLineMultiple/OneLineMultiple.web", () => ({
  __esModule: true,
  OneLineMultiple: jest.fn((props) => <one-line-multiple-mock {...props} />),
}));

jest.mock("../../../../PriceBoostSection", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-price-boost-section-mock {...props} />),
}));

jest.mock("../../../../PriceBoostSection/PriceBoostSection.web", () => ({
  __esModule: true,
  PriceBoostSection: jest.fn((props) => <price-boost-section-mock {...props} />),
}));

jest.mock("../../../../SinglesCard", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-singles-card-mock {...props} />),
}));

jest.mock("../../../../SinglesCard/SinglesCard.web", () => ({
  __esModule: true,
  SinglesCard: jest.fn((props) => <singles-card-mock {...props} />),
}));

jest.mock("../../../../CastBetsCard", () => ({
  __esModule: true,
  default: jest.fn((props) => <connected-cast-bets-card-mock {...props} />),
}));

jest.mock("../../../../CastBetsCard/CastBetsCard.web", () => ({
  __esModule: true,
  CastBetsCard: jest.fn((props) => <cast-bets-card-mock {...props} />),
}));

const createPropsMock = ({ experimentVariant, ...props } = {}) => {
  return {
    experimentVariant,
    betslipCards: [],
    hasPlaceError: false,
    isPlaceDisabled: false,
    placeBtnLabel: "place",
    totalReturns: "0",
    i18n: {
      oddsLabel: "odds",
      stakeLabel: "stake",
      totalReturns: "returns",
      multiples: "Multiples",
      additionalMultiples: "Additional Multiples",
      singles: "Singles",
      removeLabel: "Remove",
      oddsMovementUp: "Up",
      oddsMovementDown: "Down",
      casts: "Casts",
      eachWay: "Each way",
      betBuilder: "Bet Builder",
      multiBetBuilder: "Multi Bet Builder",
      balanceAfterBet: "Balance",
      priceBoosts: "Price Boosts",
      tabAllTitle: "All",
      tabBetBuildersTitle: "Bet Builders",
      tabMultiplesTitle: "Multiples",
      tabCastTitle: "Casts",
      tabSinglesTitle: "Singles",
      betslipAriaTitle: "Betslip",
    },
    hasSingles: false,
    hasOnlyOneSingle: false,
    hasOneLineMultiple: false,
    hasMultipleLinesMultiples: false,
    hasMultiBetBuilder: false,
    hasCastBets: false,
    hasPriceBoost: false,
    hasBetBuilders: false,
    betBuilderIds: ["bet-builder-1", "bet-builder-2"],
    boostedCombinationIds: [],
    failedCombinationGroups: ["failed-group-1", "failed-group-2"],
    failedCombinationGroupIds: ["failed-group-id-1", "failed-group-id-2"],
    shouldFocusBetBuilder: false,
    shouldFocusMultiple: false,
    shouldFocusCastBet: false,
    onPlaceClick: jest.fn(),
    onRemoveAllClick: jest.fn(),
    onCollapseToggle: jest.fn(),
    ...props,
  };
};

function renderResolverContent(resolver, props) {
  return render(<>{resolver.content(props)}</>);
}

describe("TAB_RESOLVERS", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe("ALL", () => {
    describe("title", () => {
      it("returns the expected title", () => {
        const props = createPropsMock({ experimentVariant: "with-all" });

        expect(TAB_RESOLVERS.ALL.title(props)).toBe(props.i18n.tabAllTitle);
      });
    });

    describe("visible", () => {
      it("should not be visible for experiment variants other than with-all", () => {
        expect(
          TAB_RESOLVERS.ALL.visible(
            createPropsMock({ experimentVariant: "without-all", hasSingles: true, hasCastBets: true }),
          ),
        ).toBe(false);
      });

      it("should not be visible when only one tab is visible", () => {
        expect(TAB_RESOLVERS.ALL.visible(createPropsMock({ experimentVariant: "with-all" }))).toBe(false);
        expect(
          TAB_RESOLVERS.ALL.visible(createPropsMock({ experimentVariant: "with-all", hasSingles: true })),
        ).toBe(false);
        expect(
          TAB_RESOLVERS.ALL.visible(createPropsMock({ experimentVariant: "with-all", hasCastBets: true })),
        ).toBe(false);
        expect(
          TAB_RESOLVERS.ALL.visible(createPropsMock({ experimentVariant: "with-all", hasBetBuilders: true })),
        ).toBe(false);
        expect(
          TAB_RESOLVERS.ALL.visible(createPropsMock({ experimentVariant: "with-all", hasOneLineMultiple: true })),
        ).toBe(false);
      });

      it("should be visible when more than one tab is visible", () => {
        expect(
          TAB_RESOLVERS.ALL.visible(
            createPropsMock({ experimentVariant: "with-all", hasSingles: true, hasCastBets: true }),
          ),
        ).toBe(true);
        expect(
          TAB_RESOLVERS.ALL.visible(
            createPropsMock({ experimentVariant: "with-all", hasSingles: true, hasOneLineMultiple: true }),
          ),
        ).toBe(true);
        expect(
          TAB_RESOLVERS.ALL.visible(
            createPropsMock({ experimentVariant: "with-all", hasBetBuilders: true, hasCastBets: true }),
          ),
        ).toBe(true);
      });
    });

    describe("content", () => {
      it("should render the content of all visible sections", () => {
        jest.spyOn(TAB_RESOLVERS.BET_BUILDER, "content");
        jest.spyOn(TAB_RESOLVERS.BET_BUILDER, "visible").mockReturnValue(true);
        jest.spyOn(TAB_RESOLVERS.MULTIPLES, "content");
        jest.spyOn(TAB_RESOLVERS.MULTIPLES, "visible").mockReturnValue(false);
        jest.spyOn(TAB_RESOLVERS.CAST_BET, "content");
        jest.spyOn(TAB_RESOLVERS.CAST_BET, "visible").mockReturnValue(true);
        jest.spyOn(TAB_RESOLVERS.SINGLES, "content");
        jest.spyOn(TAB_RESOLVERS.SINGLES, "visible").mockReturnValue(false);

        const props = createPropsMock();
        renderResolverContent(TAB_RESOLVERS.ALL, props);

        expect(TAB_RESOLVERS.BET_BUILDER.content).toHaveBeenCalledTimes(1);
        expect(TAB_RESOLVERS.BET_BUILDER.content).toHaveBeenCalledWith(props);

        expect(TAB_RESOLVERS.MULTIPLES.content).not.toHaveBeenCalled();

        expect(TAB_RESOLVERS.CAST_BET.content).toHaveBeenCalledTimes(1);
        expect(TAB_RESOLVERS.CAST_BET.content).toHaveBeenCalledWith(props);

        expect(TAB_RESOLVERS.SINGLES.content).not.toHaveBeenCalled();
      });
    });
  });

  describe("BET_BUILDER", () => {
    describe("title", () => {
      it("returns the expected title", () => {
        const props = createPropsMock({ experimentVariant: "with-all" });

        expect(TAB_RESOLVERS.BET_BUILDER.title(props)).toBe(props.i18n.tabBetBuildersTitle);
      });
    });

    describe("visible", () => {
      it("should be visible whenever there are bet builders or multi bet builders", () => {
        expect(TAB_RESOLVERS.BET_BUILDER.visible(createPropsMock())).toBe(false);
        expect(TAB_RESOLVERS.BET_BUILDER.visible(createPropsMock({ hasMultiBetBuilder: true }))).toBe(true);
        expect(TAB_RESOLVERS.BET_BUILDER.visible(createPropsMock({ hasBetBuilders: true }))).toBe(true);
      });
    });

    describe("content", () => {
      it("should render a collapsable section for the multi bet builder card", () => {
        const props = createPropsMock({ hasMultiBetBuilder: true, shouldFocusBetBuilder: true });
        renderResolverContent(TAB_RESOLVERS.BET_BUILDER, props);

        expect(TabSection).toHaveBeenCalledTimes(1);

        expect(TabSection.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            title: props.i18n.multiBetBuilder,
            withCollapsable: true,
            onCollapseToggle: props.onCollapseToggle,
            card: expect.objectContaining({
              props: {
                component: MultiBetBuilderCard,
                shouldFocusStakeField: props.shouldFocusBetBuilder,
              },
            }),
          }),
        );
      });
    });

    it("should render a collapsable section for the bet builder card", () => {
      const props = createPropsMock({ hasBetBuilders: true, shouldFocusBetBuilder: true });
      renderResolverContent(TAB_RESOLVERS.BET_BUILDER, props);

      expect(TabSection).toHaveBeenCalledTimes(1);

      expect(TabSection.mock.calls[0][0]).toEqual(
        expect.objectContaining({
          title: props.i18n.betBuilder,
          withCollapsable: true,
          onCollapseToggle: props.onCollapseToggle,
          card: expect.objectContaining({
            props: {
              component: BetBuildersCard,
              combinationIds: props.betBuilderIds,
              failedCombinationGroups: props.failedCombinationGroups,
              shouldFocusStakeField: props.shouldFocusBetBuilder,
            },
          }),
        }),
      );
    });
  });

  describe("MULTIPLES", () => {
    describe("title", () => {
      it("returns the expected title", () => {
        const props = createPropsMock({ experimentVariant: "with-all" });

        expect(TAB_RESOLVERS.MULTIPLES.title(props)).toBe(props.i18n.tabMultiplesTitle);
      });
    });

    describe("visible", () => {
      it("should be visible whenever there are multiples to show", () => {
        expect(TAB_RESOLVERS.MULTIPLES.visible(createPropsMock())).toBe(false);
        expect(TAB_RESOLVERS.MULTIPLES.visible(createPropsMock({ hasOneLineMultiple: true }))).toBe(true);
        expect(TAB_RESOLVERS.MULTIPLES.visible(createPropsMock({ hasMultipleLinesMultiples: true }))).toBe(true);
        expect(TAB_RESOLVERS.MULTIPLES.visible(createPropsMock({ hasPriceBoost: true }))).toBe(true);
      });
    });

    describe("content", () => {
      it("should render a section for the price boost", () => {
        const props = createPropsMock({ hasPriceBoost: true, shouldFocusMultiple: true });
        renderResolverContent(TAB_RESOLVERS.MULTIPLES, props);

        expect(TabSection).toHaveBeenCalledTimes(1);

        expect(TabSection.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            title: props.i18n.priceBoosts,
            withCollapsable: true,
            onCollapseToggle: props.onCollapseToggle,
            card: expect.objectContaining({
              props: {
                component: PriceBoostSection,
                boostedCombinationIds: props.boostedCombinationIds,
                failedCombinationGroupIds: props.failedCombinationGroupIds,
                shouldFocusStakeField: props.shouldFocusMultiple,
              },
            }),
          }),
        );
      });

      it("should render a section for the one line multiple", () => {
        const props = createPropsMock({ hasOneLineMultiple: true, shouldFocusMultiple: true });
        renderResolverContent(TAB_RESOLVERS.MULTIPLES, props);

        expect(TabSection).toHaveBeenCalledTimes(1);

        expect(TabSection.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            title: props.i18n.multiples,
            withCollapsable: true,
            onCollapseToggle: props.onCollapseToggle,
            card: expect.objectContaining({
              props: {
                component: OneLineMultiple,
                hasOneLineMultiple: props.hasOneLineMultiple,
                shouldFocusStakeField: props.shouldFocusMultiple,
              },
            }),
          }),
        );
      });

      it("should render a section for the multiple lines multiples", () => {
        const props = createPropsMock({ hasMultipleLinesMultiples: true });
        renderResolverContent(TAB_RESOLVERS.MULTIPLES, props);

        expect(TabSection).toHaveBeenCalledTimes(1);

        expect(TabSection.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            title: props.i18n.additionalMultiples,
            withCollapsable: true,
            onCollapseToggle: props.onCollapseToggle,
            card: expect.objectContaining({
              props: {
                component: MultiLinesMultiples,
                shouldFocusStakeField: false,
              },
            }),
          }),
        );
      });
    });
  });

  describe("CAST_BET", () => {
    describe("title", () => {
      it("returns the expected title", () => {
        const props = createPropsMock({ experimentVariant: "with-all" });

        expect(TAB_RESOLVERS.CAST_BET.title(props)).toBe(props.i18n.tabCastTitle);
      });
    });

    describe("visible", () => {
      it("should be visible whenever there are cast bets to show", () => {
        expect(TAB_RESOLVERS.CAST_BET.visible(createPropsMock())).toBe(false);
        expect(TAB_RESOLVERS.CAST_BET.visible(createPropsMock({ hasCastBets: true }))).toBe(true);
      });
    });

    describe("content", () => {
      it("should render a section for the cast bets", () => {
        const props = createPropsMock({ hasCastBets: true, shouldFocusCastBet: true });
        renderResolverContent(TAB_RESOLVERS.CAST_BET, props);

        expect(TabSection).toHaveBeenCalledTimes(1);

        expect(TabSection.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            title: props.i18n.casts,
            withCollapsable: true,
            onCollapseToggle: props.onCollapseToggle,
            card: expect.objectContaining({
              props: {
                component: CastBetsCard,
                shouldFocusStakeField: props.shouldFocusCastBet,
              },
            }),
          }),
        );
      });
    });
  });

  describe("SINGLES", () => {
    describe("title", () => {
      it("returns the expected title", () => {
        const props = createPropsMock({ experimentVariant: "with-all" });

        expect(TAB_RESOLVERS.SINGLES.title(props)).toBe(props.i18n.tabSinglesTitle);
      });
    });

    describe("visible", () => {
      it("should be visible whenever there are singles to show", () => {
        expect(TAB_RESOLVERS.SINGLES.visible(createPropsMock())).toBe(false);
        expect(TAB_RESOLVERS.SINGLES.visible(createPropsMock({ hasSingles: true }))).toBe(true);
      });
    });

    describe("content", () => {
      it("should render a section for the singles", () => {
        const props = createPropsMock({ hasSingles: true });
        renderResolverContent(TAB_RESOLVERS.SINGLES, props);

        expect(TabSection).toHaveBeenCalledTimes(1);

        expect(TabSection.mock.calls[0][0]).toEqual(
          expect.objectContaining({
            title: props.i18n.singles,
            withCollapsable: true,
            onCollapseToggle: props.onCollapseToggle,
            card: expect.objectContaining({
              props: {
                component: SinglesCard,
                hasAvailabilityHints: true,
                shouldFocusStakeField: false,
              },
            }),
          }),
        );
      });
    });
  });
});
