import ConnectedBetBuildersCard from "../../../../BetBuildersCard";
import { BetBuildersCard } from "../../../../BetBuildersCard/BetBuildersCard.native";
import ConnectedMultiBetBuilderCard from "../../../../MultiBetBuilderCard";
import { MultiBetBuilderCard } from "../../../../MultiBetBuilderCard/MultiBetBuilderCard.native";
import ConnectedMultiLinesMultiples from "../../../../MultiLinesMultiples";
import { MultiLinesMultiples } from "../../../../MultiLinesMultiples/MultiLinesMultiples.native";
import ConnectedOneLineMultiple from "../../../../OneLineMultiple";
import { OneLineMultiple } from "../../../../OneLineMultiple/OneLineMultiple.native";
import ConnectedPriceBoostSection from "../../../../PriceBoostSection";
import { PriceBoostSection } from "../../../../PriceBoostSection/PriceBoostSection.native";
import ConnectedCastBetsCard from "../../../../CastBetsCard";
import { CastBetsCard } from "../../../../CastBetsCard/CastBetsCard.native";
import ConnectedSinglesCard from "../../../../SinglesCard";
import { SinglesCard } from "../../../../SinglesCard/SinglesCard.native";
import { TabSection } from "./TabSection.native";
import { TabResolver, TabsResolvers } from "./SportsbookPlaceTabsPanel.types";
import { Fragment } from "react/jsx-runtime";

const ALL_RESOLVER: TabResolver = {
  key: "all",
  title: (props) => props.i18n.tabAllTitle,
  visible: (props) => {
    if (props.experimentVariant !== "with-all") {
      return false;
    }

    const visibleTabs = [BET_BUILDER_RESOLVER, MULTIPLES_RESOLVER, CAST_BET_RESOLVER, SINGLES_RESOLVER].filter(
      (resolver) => resolver.visible(props),
    );

    return visibleTabs.length > 1;
  },
  content: (props) => {
    return (
      <>
        {[BET_BUILDER_RESOLVER, MULTIPLES_RESOLVER, CAST_BET_RESOLVER, SINGLES_RESOLVER]
          .filter((resolver) => resolver.visible(props))
          .map((resolver) => (
            <Fragment key={resolver.key}>{resolver.content(props)}</Fragment>
          ))}
      </>
    );
  },
};

const BET_BUILDER_RESOLVER: TabResolver = {
  key: "bet-builder",
  title: (props) => props.i18n.tabBetBuildersTitle,
  visible: (props) => props.hasMultiBetBuilder || props.hasBetBuilders,
  content: (props) => {
    return (
      <>
        {props.hasMultiBetBuilder && (
          <TabSection
            card={
              <ConnectedMultiBetBuilderCard
                component={MultiBetBuilderCard}
                shouldFocusStakeField={props.shouldFocusBetBuilder}
                betControlsExperimentVariant={props.betControlsExperimentVariant}
              />
            }
            title={props.i18n.multiBetBuilder}
            withCollapsable
            onCollapseToggle={props.onCollapseToggle}
          />
        )}
        {props.hasBetBuilders && (
          <TabSection
            card={
              <ConnectedBetBuildersCard
                component={BetBuildersCard}
                combinationIds={props.betBuilderIds}
                failedCombinationGroups={props.failedCombinationGroups}
                shouldFocusStakeField={props.shouldFocusBetBuilder}
                betControlsExperimentVariant={props.betControlsExperimentVariant}
              />
            }
            title={props.i18n.betBuilder}
            withCollapsable
            onCollapseToggle={props.onCollapseToggle}
          />
        )}
      </>
    );
  },
};

const MULTIPLES_RESOLVER: TabResolver = {
  key: "multiples",
  title: (props) => props.i18n.tabMultiplesTitle,
  visible: (props) => props.hasPriceBoost || props.hasOneLineMultiple || props.hasMultipleLinesMultiples,
  content: (props) => {
    return (
      <>
        {props.hasPriceBoost && (
          <TabSection
            card={
              <ConnectedPriceBoostSection
                component={PriceBoostSection}
                boostedCombinationIds={props.boostedCombinationIds}
                failedCombinationGroupIds={props.failedCombinationGroupIds}
                shouldFocusStakeField={props.shouldFocusMultiple}
                betControlsExperimentVariant={props.betControlsExperimentVariant}
              />
            }
            title={props.i18n.priceBoosts}
            withCollapsable
            onCollapseToggle={props.onCollapseToggle}
          />
        )}
        {props.hasOneLineMultiple && (
          <TabSection
            card={
              <ConnectedOneLineMultiple
                component={OneLineMultiple}
                hasOneLineMultiple={props.hasOneLineMultiple}
                shouldFocusStakeField={props.shouldFocusMultiple}
                betControlsExperimentVariant={props.betControlsExperimentVariant}
              />
            }
            title={props.i18n.multiples}
            withCollapsable
            onCollapseToggle={props.onCollapseToggle}
          />
        )}
        {props.hasMultipleLinesMultiples && (
          <TabSection
            card={<ConnectedMultiLinesMultiples component={MultiLinesMultiples} shouldFocusStakeField={false} />}
            title={props.i18n.additionalMultiples}
            withCollapsable
            onCollapseToggle={props.onCollapseToggle}
          />
        )}
      </>
    );
  },
};

const CAST_BET_RESOLVER: TabResolver = {
  key: "cast-bet",
  title: (props) => props.i18n.tabCastTitle,
  visible: (props) => props.hasCastBets,
  content: (props) => {
    return (
      <TabSection
        card={<ConnectedCastBetsCard component={CastBetsCard} shouldFocusStakeField={props.shouldFocusCastBet} />}
        title={props.i18n.casts}
        withCollapsable
        onCollapseToggle={props.onCollapseToggle}
      />
    );
  },
};

const SINGLES_RESOLVER: TabResolver = {
  key: "singles",
  title: (props) => props.i18n.tabSinglesTitle,
  visible: (props) => props.hasSingles,
  content: (props) => {
    return (
      <TabSection
        card={
          <ConnectedSinglesCard
            component={SinglesCard}
            hasAvailabilityHints
            shouldFocusStakeField={props.hasOnlyOneSingle}
          />
        }
        title={props.i18n.singles}
        withCollapsable={!props.hasOnlyOneSingle}
        onCollapseToggle={props.onCollapseToggle}
      />
    );
  },
};

export const TAB_RESOLVERS: TabsResolvers = {
  ALL: ALL_RESOLVER,
  MULTIPLES: MULTIPLES_RESOLVER,
  BET_BUILDER: BET_BUILDER_RESOLVER,
  CAST_BET: CAST_BET_RESOLVER,
  SINGLES: SINGLES_RESOLVER,
};
