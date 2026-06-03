import { NormalizersResult } from "@ppb/tbd-store/services/catalogue/normalizer/normalizer-engine";
import {
  AppContextQuery,
  SelectionPromoCardFragment,
  SportsbookLotteriesBetLegCardGroupFragment,
} from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { getApolloClient } from "./client";
import { AppContextDetailsQuery } from "./AppContextDetails.graphql";
import {
  BetOpportunityPromoCardFragment,
  EditorialPromoCardFragment,
  GamingPrizeMachineCardFragment,
  GenericSwitcherCardFragment,
  IncidentsCardFragment,
  LottoCardFragment,
  LoyaltyPromoCardFragment,
  MiniPromoBannerCardFragment,
  PriceBoostMultiplePromoCardFragment,
  PromotionsCardGroupFragment,
  RaceSwitcherCardFragment,
  SelfExclusionCardFragment,
  StatsBroadcastsCardFragment,
  StatsContentCardGroupFragment,
  StatsGoalsAndShotsCardFragment,
  StatsPebbleCardGroupFragment,
  StatsSupportingContentButtonsCardGroupFragment,
  StatsPlayersInPlayCardFragment,
  StatsMatchStatsCardFragment,
  StatsLineupsCardFragment,
  PopularSelectionsCardEnrichedPartialFragment,
  PopularSelectionsCardFragment,
  EmbeddedViewCardFragment,
  SportsbookChatbotCardFragment,
} from "../types/__generated__/graphql";

/**
 * Apollo Cache Warm Up module
 *
 * This module comprises a set of loaders that are responsible for loading some data sets into the Apollo Client Cache
 * these loaders are intended to be used for warming up the Apollo Cache with any existing data in the Client so we avoid
 * hitting the network to load data that is already available
 */

/**
 * loadCatalogue
 *
 * used when loading Catalog data via Redux Middlewares.
 * this method takes TBD Catalogue Service payload (comprised of Layout and Business entities) and feeds it into the Apollo Cache
 * with this data in place, we have a warm cache and components using Apollo Client will be able to retrieve data from the Cache
 * rather that fething data through the WWW

 */
async function loadCatalogue(catalogue: NormalizersResult) {
  const apollo = getApolloClient();

  // Warmup for GamingPrizeMachineCard UserDetails - runs once if there are cards
  if (catalogue.GamingPrizeMachineCard?.length) {
    const appContextData = apollo.readQuery({ query: AppContextDetailsQuery });
    if (appContextData?.AppContext) {
      const { GamingPrizeMachineUserDetailsQuery } = await import(
        /* webpackChunkName: "GamingPrizeMachineCard" */
        "@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/model/GamingPrizeMachine.graphql"
      );
      apollo.writeQuery({
        query: GamingPrizeMachineUserDetailsQuery,
        data: { AppContext: appContextData.AppContext },
      });
    }
  }

  catalogue.GamingPrizeMachineCard?.forEach(async (gamingPrizeMachineCard) => {
    const { GamingPrizeMachineQuery } = await import(
      /* webpackChunkName: "GamingPrizeMachineCard" */
      "@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/model/GamingPrizeMachine.graphql"
    );

    apollo.writeQuery({
      query: GamingPrizeMachineQuery,
      variables: {
        urn: gamingPrizeMachineCard.urn,
      },
      data: {
        Cards: [gamingPrizeMachineCard satisfies GamingPrizeMachineCardFragment],
      },
    });
  });

  catalogue.LottoCard?.forEach(async (lottoCard) => {
    const { LottoCardQuery } = await import(
      /* webpackChunkName: "LottoCard" */
      "@ppb/tbd-components-sports-betting/components/LottoCard/model/LottoCard.graphql"
    );

    apollo.writeQuery({
      query: LottoCardQuery,
      variables: {
        urn: lottoCard.urn,
      },
      data: {
        Cards: [lottoCard satisfies LottoCardFragment],
      },
    });
  });

  catalogue.SportsEvent?.forEach(async (sportsevent) => {
    const { buildSportEventFragment, SportsEventFragment } = await import(
      /* webpackChunkName: "SportsEventFragment" */
      "./fragments/sportsevent.graphql"
    );

    const data = buildSportEventFragment(sportsevent, catalogue);

    if (data) {
      const id = apollo.cache.identify({
        __typename: "SportsEvent",
        urn: data.urn,
      });

      apollo.writeFragment({
        id,
        fragment: SportsEventFragment,
        data,
      });
    }
  });

  catalogue.StatsContentCardGroup?.forEach(async (statsContent) => {
    const { StatsContentCardGroupQuery, LocalStatsContentCardGroup } = await import(
      /* webpackChunkName: "StatsContentCardGroup" */
      "../components/StatsContentCardGroup/model/StatsContentCardGroup.graphql"
    );

    const id = apollo.cache.identify({
      __typename: "StatsContentCardGroup",
      urn: statsContent.urn,
    });

    apollo.writeQuery({
      query: StatsContentCardGroupQuery,
      variables: {
        urn: statsContent.urn,
      },
      data: {
        Cards: [statsContent satisfies StatsContentCardGroupFragment],
      },
    });

    apollo.writeFragment({
      id,
      fragment: LocalStatsContentCardGroup,
      data: {
        selectedTab: null,
      },
    });
  });

  catalogue.IncidentsCard?.forEach(async (incidents) => {
    const { IncidentsCardQuery } = await import(
      /* webpackChunkName: "IncidentsCard" */
      "@ppb/tbd-components-rich-data/components/IncidentsCard/model/IncidentsCard.graphql"
    );

    apollo.writeQuery({
      query: IncidentsCardQuery,
      variables: {
        urn: [incidents.urn],
      },
      data: {
        Cards: [incidents satisfies IncidentsCardFragment],
      },
    });
  });

  catalogue.StatsPebbleCardGroup?.forEach(async (statsPebble) => {
    const { StatsPebbleCardGroupQuery, StatsPebbleCardGroupBaseDataFragment } = await import(
      /* webpackChunkName: "StatsPebbleCardGroup" */
      "../components/StatsPebbleCardGroup/model/StatsPebbleCardGroup.graphql"
    );

    const id = apollo.cache.identify({
      __typename: "StatsPebbleCardGroup",
      urn: statsPebble.urn,
    });

    if (statsPebble.partials && statsPebble.full) {
      apollo.writeQuery({
        query: StatsPebbleCardGroupQuery,
        variables: {
          urn: statsPebble.urn,
        },
        data: {
          Cards: [statsPebble satisfies StatsPebbleCardGroupFragment],
        },
      });
    } else if (statsPebble.status) {
      // TODO: Once the SportsbookBetLegCardGroup becomes an apollo component, we can remove this
      apollo.writeFragment({
        id,
        fragment: StatsPebbleCardGroupBaseDataFragment,
        fragmentName: "StatsPebbleCardGroupBaseData",
        data: {
          urn: statsPebble.urn,
          __typename: statsPebble.__typename,
          status: statsPebble.status,
        },
      });
    }
  });

  catalogue.StatsSupportingContentButtonsCardGroup?.forEach(async (statsSupportingContentButtonsCardGroup) => {
    const { StatsSupportingContentButtonsCardGroupQuery } = await import(
      /* webpackChunkName: "StatsSupportingContentButtonsCardGroup" */
      "../components/StatsSupportingContentButtonsCardGroup/model/StatsSupportingContentButtonsCardGroup.graphql"
    );

    if (statsSupportingContentButtonsCardGroup.partials && statsSupportingContentButtonsCardGroup.full) {
      apollo.writeQuery({
        query: StatsSupportingContentButtonsCardGroupQuery,
        variables: {
          urn: statsSupportingContentButtonsCardGroup.urn,
        },
        data: {
          Cards: [statsSupportingContentButtonsCardGroup satisfies StatsSupportingContentButtonsCardGroupFragment],
        },
      });
    }
  });

  catalogue.StatsGoalsAndShotsCard?.forEach(async (statsGoalsAndShots) => {
    const { StatsGoalsAndShotsCardQuery } = await import(
      /* webpackChunkName: "StatsGoalsAndShotsCard" */
      "@ppb/tbd-components-rich-data/components/StatsGoalsAndShotsCard/model/StatsGoalsAndShotsCard.graphql"
    );

    apollo.writeQuery({
      query: StatsGoalsAndShotsCardQuery,
      variables: {
        urn: statsGoalsAndShots.urn,
      },
      data: {
        Cards: [statsGoalsAndShots satisfies StatsGoalsAndShotsCardFragment],
      },
    });
  });

  catalogue.StatsPlayersInPlayCard?.forEach(async (statsPlayersInPlayCard) => {
    const { StatsPlayersInPlayCardQuery } = await import(
      /* webpackChunkName: "StatsPlayersInPlayCard" */
      "../components/StatsPlayersInPlayCard/model/StatsPlayersInPlayCard.graphql"
    );

    apollo.writeQuery({
      query: StatsPlayersInPlayCardQuery,
      variables: {
        urn: statsPlayersInPlayCard.urn,
      },
      data: {
        Cards: [statsPlayersInPlayCard satisfies StatsPlayersInPlayCardFragment],
      },
    });
  });

  catalogue.StatsBroadcastsCard?.forEach(async (statsBroadcastsCard) => {
    const { StatsBroadcastsCardQuery } = await import(
      /* webpackChunkName: "StatsBroadcastsCard" */
      "@ppb/tbd-components-rich-data/components/StatsBroadcastsCard/model/StatsBroadcastsCard.graphql"
    );

    apollo.writeQuery({
      query: StatsBroadcastsCardQuery,
      variables: {
        urn: statsBroadcastsCard.urn,
      },
      data: {
        Cards: [statsBroadcastsCard satisfies StatsBroadcastsCardFragment],
      },
    });
  });

  catalogue.StatsLineupsCard?.forEach(async (statsLineupsCard) => {
    const { StatsLineupsCardQuery } = await import(
      /* webpackChunkName: "StatsLineupsCard" */
      "@ppb/tbd-components-rich-data/components/StatsLineupsCard/model/StatsLineupsCard.graphql"
    );

    apollo.writeQuery({
      query: StatsLineupsCardQuery,
      variables: {
        urn: statsLineupsCard.urn,
      },
      data: {
        Cards: [statsLineupsCard satisfies StatsLineupsCardFragment],
      },
    });
  });

  catalogue.GenericSwitcherCard?.forEach(async (genericSwitcherCard) => {
    const { GenericSwitcherCardQuery } = await import(
      /* webpackChunkName: "GenericSwitcherCard" */
      "@ppb/tbd-components-navigation/components/GenericSwitcherCard/model/GenericSwitcherCard.graphql"
    );

    apollo.writeQuery({
      query: GenericSwitcherCardQuery,
      variables: {
        urn: genericSwitcherCard.urn,
      },
      data: {
        Cards: [genericSwitcherCard satisfies GenericSwitcherCardFragment],
      },
    });
  });

  catalogue.RaceSwitcherCard?.forEach(async (raceSwitcherCard) => {
    const { RaceSwitcherCardQuery } = await import(
      /* webpackChunkName: "RaceSwitcherCard" */
      "@ppb/tbd-components-navigation/components/RaceSwitcherCard/model/RaceSwitcherCard.graphql"
    );

    apollo.writeQuery({
      query: RaceSwitcherCardQuery,
      variables: {
        urn: raceSwitcherCard.urn,
      },
      data: {
        Cards: [raceSwitcherCard satisfies RaceSwitcherCardFragment],
      },
    });
  });

  catalogue.SelfExclusionCard?.forEach(async (selfExclusionCard) => {
    const { SelfExclusionCardQuery } = await import(
      /* webpackChunkName: "SelfExclusionCard" */
      "@ppb/tbd-components-navigation/components/SelfExclusionCard/model/SelfExclusionCard.graphql"
    );

    apollo.writeQuery({
      query: SelfExclusionCardQuery,
      variables: {
        urn: selfExclusionCard.urn,
      },
      data: {
        Cards: [selfExclusionCard satisfies SelfExclusionCardFragment],
      },
    });
  });

  catalogue.LoyaltyPromoCard?.forEach(async (loyaltyPromoCard) => {
    const { LoyaltyPromoCardQuery } = await import(
      /* webpackChunkName: "LoyaltyPromoCard" */
      "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/model/LoyaltyPromoCard.graphql"
    );

    apollo.writeQuery({
      query: LoyaltyPromoCardQuery,
      variables: {
        urn: loyaltyPromoCard.urn,
      },
      data: {
        Cards: [loyaltyPromoCard satisfies LoyaltyPromoCardFragment],
      },
    });
  });

  catalogue.MiniPromoBannerCard?.forEach(async (miniPromoBannerCard) => {
    const { LoyaltyPromoCardQuery } = await import(
      /* webpackChunkName: "LoyaltyPromoCard" */
      "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/model/LoyaltyPromoCard.graphql"
    );

    apollo.writeQuery({
      query: LoyaltyPromoCardQuery,
      variables: {
        urn: miniPromoBannerCard.urn,
      },
      data: {
        Cards: [miniPromoBannerCard satisfies MiniPromoBannerCardFragment],
      },
    });
  });

  catalogue.EditorialPromoCard?.forEach(async (editorialPromoCard) => {
    const { EditorialPromoCardQuery } = await import(
      /* webpackChunkName: "EditorialPromoCard" */
      "@ppb/tbd-components-promotions/components/EditorialPromoCard/model/EditorialPromoCard.graphql"
    );

    apollo.writeQuery({
      query: EditorialPromoCardQuery,
      variables: {
        urn: editorialPromoCard.urn,
      },
      data: {
        Cards: [editorialPromoCard satisfies EditorialPromoCardFragment],
      },
    });
  });

  catalogue.BetOpportunityPromoCard?.forEach(async (betOpportunityPromoCard) => {
    const { BetOpportunityPromoCardQuery } = await import(
      /* webpackChunkName: "BetOpportunityPromoCard" */
      "@ppb/tbd-components-promotions/components/BetOpportunityPromoCard/model/BetOpportunityPromoCard.graphql"
    );

    apollo.writeQuery({
      query: BetOpportunityPromoCardQuery,
      variables: {
        urn: betOpportunityPromoCard.urn,
      },
      data: {
        Cards: [betOpportunityPromoCard satisfies BetOpportunityPromoCardFragment],
      },
    });
  });

  catalogue.SelectionPromoCard?.forEach(async (selectionPromoCard) => {
    const { SelectionPromoCardQuery } = await import(
      /* webpackChunkName: "SelectionPromoCard" */
      "@ppb/tbd-components-promotions/components/SelectionPromoCard/model/SelectionPromoCard.graphql"
    );

    apollo.writeQuery({
      query: SelectionPromoCardQuery,
      variables: {
        urn: selectionPromoCard.urn,
      },
      data: {
        Cards: [selectionPromoCard satisfies SelectionPromoCardFragment],
      },
    });
  });

  catalogue.SportsbookChatbotCard?.forEach(async (sportsbookChatbotCard) => {
    const { SportsbookChatbotCardQuery } = await import(
      /* webpackChunkName: "SportsbookChatbotCard" */
      "@ppb/tbd-components-sports-betting/components/SportsbookChatbot/model/SportsbookChatbotCard.graphql"
    );

    apollo.writeQuery({
      query: SportsbookChatbotCardQuery,
      variables: {
        urn: sportsbookChatbotCard.urn,
      },
      data: {
        Cards: [sportsbookChatbotCard satisfies SportsbookChatbotCardFragment],
      },
    });
  });

  catalogue.PriceBoostMultiplePromoCard?.forEach(async (priceBoostMultiplePromoCard) => {
    const { PriceBoostMultiplePromoCardQuery } = await import(
      /* webpackChunkName: "PriceBoostMultiplePromoCard" */
      "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/model/PriceBoostMultiplePromoCard.graphql"
    );

    apollo.writeQuery({
      query: PriceBoostMultiplePromoCardQuery,
      variables: {
        urn: priceBoostMultiplePromoCard.urn,
      },
      data: {
        Cards: [priceBoostMultiplePromoCard satisfies PriceBoostMultiplePromoCardFragment],
      },
    });
  });

  catalogue.SportsbookLotteriesBetLegCardGroup?.forEach(async (sbkLotteriesBetLeg) => {
    const { SportsbookLotteriesBetLegCardGroupQuery } = await import(
      /* webpackChunkName: "SportsbookLotteriesBetLegCardGroup" */
      "@ppb/tbd-components-my-bets/components/SportsbookLotteriesBetLegCardGroup/model/SportsbookLotteriesBetLegCardGroup.graphql"
    );

    apollo.writeQuery({
      query: SportsbookLotteriesBetLegCardGroupQuery,
      variables: {
        urn: sbkLotteriesBetLeg.urn,
      },
      data: {
        Cards: [sbkLotteriesBetLeg satisfies SportsbookLotteriesBetLegCardGroupFragment],
      },
    });
  });

  catalogue.PromotionsCardGroup?.forEach(async (promotionsCardGroup) => {
    const { PromotionsCardGroupQuery } = await import(
      /* webpackChunkName: "Promotions" */
      "@ppb/tbd-components-promotions/components/PromotionsCardGroup/model/PromotionsCardGroup.graphql"
    );

    apollo.writeQuery({
      query: PromotionsCardGroupQuery,
      variables: {
        urn: promotionsCardGroup.urn,
      },
      data: {
        Cards: [promotionsCardGroup satisfies PromotionsCardGroupFragment],
      },
    });
  });

  catalogue.StatsLeagueTableCard?.forEach(async (statsLeagueTableCard) => {
    const { StatsLeagueTableQuery } = await import(
      /* webpackChunkName: "StatsLeagueTableCard" */
      "@ppb/tbd-components-rich-data/components/StatsLeagueTableCard/model/StatsLeagueTableCard.graphql"
    );

    apollo.writeQuery({
      query: StatsLeagueTableQuery,
      variables: {
        urn: statsLeagueTableCard.urn,
      },
      data: {
        Cards: [statsLeagueTableCard],
      },
    });
  });

  [
    ...(catalogue.SportView || []),
    ...(catalogue.GamingCategoryView || []),
    ...(catalogue.GamingSegmentationView || []),
    ...(catalogue.EventView || []),
    ...(catalogue.MarketView || []),
    ...(catalogue.AllMarketsView || []),
    ...(catalogue.AllCompetitionsView || []),
    ...(catalogue.GameView || []),
    ...(catalogue.CompetitionView || []),
    ...(catalogue.GamingView || []),
    ...(catalogue.ImsPromotionView || []),
    ...(catalogue.PromotionsView || []),
    ...(catalogue.MyBetsView || []),
    ...(catalogue.MyAccountView || []),
    ...(catalogue.BrowseView || []),
    ...(catalogue.SettingsView || []),
    ...(catalogue.RaceView || []),
    ...(catalogue.RunnerView || []),
    ...(catalogue.MaintenanceView || []),
    ...(catalogue.GenericView || []),
    ...(catalogue.NotFoundView || []),
    ...(catalogue.MarketRulesView || []),
    ...(catalogue.SelfExcludedView || []),
    ...(catalogue.ObbLandingPageView || []),
  ]?.forEach(async (view) => {
    const { XSellBarQuery } = await import(
      /* webpackChunkName: "XSellBar" */
      "@ppb/tbd-components-navigation/components/XSellBar/model/XSellBar.graphql"
    );

    if (!view.xsellBar) {
      return;
    }

    apollo.writeQuery({
      query: XSellBarQuery,
      data: {
        XSellBar: view.xsellBar,
      },
    });
  });

  catalogue.StatsMatchStatsCard?.forEach(async (statsMatchStatsCard) => {
    const { StatsMatchStatsCardQuery } = await import(
      /* webpackChunkName: "StatsMatchStatsCard" */
      "@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/model/StatsMatchStatsCard.graphql"
    );

    apollo.writeQuery({
      query: StatsMatchStatsCardQuery,
      variables: {
        urn: statsMatchStatsCard.urn,
      },
      data: {
        Cards: [statsMatchStatsCard satisfies StatsMatchStatsCardFragment],
      },
    });
  });

  catalogue.PopularSelectionsCard?.forEach(async (popularSelectionsCard) => {
    const { PopularSelectionsCardQuery, PopularSelectionsCardEnrichedPartialFragment } = await import(
      /* webpackChunkName: "PopularSelectionsCard" */
      "@ppb/tbd-components-sports-betting/components/PopularSelections/model/PopularSelections.graphql"
    );

    // If the catalogue item has the full data, write the complete query to the cache so the card renders immediately.
    if ("popularSelectionsCardItems" in popularSelectionsCard) {
      apollo.writeQuery({
        query: PopularSelectionsCardQuery,
        variables: { urn: popularSelectionsCard.urn },
        data: {
          Cards: [popularSelectionsCard satisfies PopularSelectionsCardFragment],
        },
      });
    } else {
      // For partial data, write only the available fragment so Apollo can merge it with later fetches.
      const id = apollo.cache.identify({
        __typename: "PopularSelectionsCard",
        urn: popularSelectionsCard.urn,
      });

      apollo.writeFragment({
        id,
        fragment: PopularSelectionsCardEnrichedPartialFragment,
        fragmentName: "PopularSelectionsCardEnrichedPartial",
        data: popularSelectionsCard satisfies PopularSelectionsCardEnrichedPartialFragment,
      });
    }
  });

  catalogue.EmbeddedViewCard?.forEach(async (embeddedViewCard) => {
    const { EmbeddedViewCardQuery } = await import(
      /* webpackChunkName: "EmbeddedViewCard" */
      "@ppb/tbd-components-regulatory-and-utils/components/EmbeddedViewCard/model/EmbeddedViewCard.graphql"
    );

    apollo.writeQuery({
      query: EmbeddedViewCardQuery,
      variables: {
        urn: embeddedViewCard.urn,
      },
      data: {
        Cards: [embeddedViewCard satisfies EmbeddedViewCardFragment],
      },
    });
  });

  catalogue.PenaltyTakersCard?.forEach(async (penaltyTakersCard) => {
    const { PenaltyTakersCardQuery } = await import(
      /* webpackChunkName: "PenaltyTakersCard" */
      "@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/model/PenaltyTakersCard.graphql"
    );

    apollo.writeQuery({
      query: PenaltyTakersCardQuery,
      variables: {
        urn: penaltyTakersCard.urn,
      },
      data: {
        Cards: [penaltyTakersCard],
      },
    });
  });
}

/**
 * loadAppContext
 *
 * used during the page load, with App Context data that is inlined in the HTML doc by the http-webserver strand
 * this App Context data contains information like User Details, User Preferences, Throttles, etc.
 */
function loadAppContext(appContext: AppContextQuery) {
  const apollo = getApolloClient();

  apollo.writeQuery({
    query: AppContextDetailsQuery,
    data: {
      AppContext: {
        ...appContext.AppContext,
        __typename: "AppContextDetails",
      },
    },
  });
}

export const apolloCacheWarmUp = {
  loadCatalogue,
  loadAppContext,
};
