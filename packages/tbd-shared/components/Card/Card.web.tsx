import classnames from "classnames";
import { Fragment, FunctionComponent, Suspense } from "react";
import * as React from "react";
import GenericSwitcherCardPlaceholder from "@ppb/tbd-components-navigation/components/GenericSwitcherCard/view/GenericSwitcherCardPlaceholder.web";
import RaceSwitcherCardPlaceholder from "@ppb/tbd-components-navigation/components/RaceSwitcherCard/view/RaceSwitcherCardPlaceholder.web";
import SelfExclusionCardPlaceholder from "@ppb/tbd-components-navigation/components/SelfExclusionCard/view/SelfExclusionCardPlaceholder.web";
import StatsFormCardPlaceholder from "@ppb/tbd-components-rich-data/components/StatsFormCard/view/StatsFormCardPlaceholder.web";
import { StatsTeamsCardPlaceholder } from "@ppb/tbd-components-rich-data/components/StatsTeamsCard/view/StatsTeamsCardPlaceholder.web";
import LoyaltyPromoCardPlaceholder from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCardPlaceholder.web";
import MiniPromotionCardPlaceholder from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/MiniPromotionCardPlaceholder.web";
import EditorialPromoCardPlaceholder from "@ppb/tbd-components-promotions/components/EditorialPromoCard/view/EditorialPromoCardPlaceholder.web";
import BetOpportunityPromoCardPlaceholder from "@ppb/tbd-components-promotions/components/BetOpportunityPromoCard/view/BetOpportunityPromoCardPlaceholder.web";
import SelectionPromoCardPlaceholder from "@ppb/tbd-components-promotions/components/SelectionPromoCard/view/SelectionPromoCardPlaceholder.web";
import LottoCardPlaceholder from "@ppb/tbd-components-sports-betting/components/LottoCard/view/LottoCardPlaceholder.web";
import PopularSelectionsCardPlaceholder from "@ppb/tbd-components-sports-betting/components/PopularSelectionsCard/view/PopularSelectionsCardPlaceholder.web";
import GamingPrizeMachineCardPlaceholder from "@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/view/GamingPrizeMachineCardPlaceholder.web";
import SportsbookLotteriesBetLegCardGroupPlaceholder from "@ppb/tbd-components-my-bets/components/SportsbookLotteriesBetLegCardGroup/view/SportsbookLotteriesBetLegCardGroupPlaceholder.web";
import PenaltyTakersCardPlaceholder from "@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/PenaltyTakersCardPlaceholder.web";
import PriceBoostMultiplePromoCardPlaceholder from "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/view/PriceBoostMultiplePromoCardPlaceholder.web";
import PromotionsCardGroupPlaceholder from "@ppb/tbd-components-promotions/components/PromotionsCardGroup/view/PromotionsCardGroupPlaceholder.web";
import EmbeddedViewCardPlaceholder from "@ppb/tbd-components-regulatory-and-utils/components/EmbeddedViewCard/view/EmbeddedViewCardPlaceholder.web";
import { CardWhiteList, ComponentProps } from "./props";
import MonterosaContentPlaceholder from "../MonterosaContentCard/view/MonterosaContentPlaceholder.web";
import PromotionsHubCardGroupPlaceholder from "@ppb/tbd-components-promotions/components/PromotionsHubCardGroup/view/PromotionsHubCardGroupPlaceholder.web";
import SportsbookChatbotCardPlaceholder from "@ppb/tbd-components-sports-betting/components/SportsbookChatbot/view/snowflakes/SportsbookChatbotPlaceholder/SportsbookChatbotPlaceholder.web";

// Placeholders
import CompetitionRegionCardPlaceholder from "../CompetitionRegionCard/CompetitionRegionCardPlaceholder.web";
import CompetitionViewLinkCardPlaceholder from "../CompetitionViewLinkCard/CompetitionViewLinkCardPlaceholder.web";
import CorrectScoreCardPlaceholder from "../CorrectScoreCard/CorrectScoreCardPlaceholder.web";
import CouponHeaderCardPlaceholder from "../CouponHeaderCard/CouponHeaderCardPlaceholder.web";
import EventViewLinkCardPlaceholder from "../EventViewLinkCard/EventViewLinkCardPlaceholder.web";
import EventHeaderCardPlaceholder from "../EventHeaderCard/EventHeaderCardPlaceholder.web";
import ExpandableMarketCardPlaceholder from "../ExpandableMarketCard/ExpandableMarketCardPlaceholder.web";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.web";
import GameInfoCardPlaceholder from "../GameInfo/snowflakes/GameInfo/GameInfoPlaceholder.web";
import GamingLinkCardPlaceholder from "../GamingLinkCard/GamingLinkCardPlaceholder.web";
import BroadcastsAndStatisticsCardPlaceholder from "../BroadcastsAndStatisticsCard/BroadcastsAndStatisticsCardPlaceholder.web";
import TimeFormBroadCastsCardPlaceholder from "../TimeFormBroadCastsCard/TimeFormBroadCastsCardPlaceholder.web";
import HalfTimeSpecialsSwimlaneCardGroupPlaceholder from "../HalfTimeSpecialsSwimlaneCardGroup/HalfTimeSpecialsSwimlaneCardGroupPlaceholder.web";
import ImsPromotionDetailsCardPlaceholder from "../ImsPromotionDetailsCard/ImsPromotionDetailsCardPlaceholder.web";

import GenericViewLinkPlaceholder from "../GenericViewLinkCard/GenericViewLinkCardPlaceholder.web";
import GridCardPlaceholder from "../GridCard/GridCardPlaceholder.web";
import MarketCardPlaceholder from "../MarketCard/MarketCardPlaceholder.web";
import MarketViewLinkCardPlaceholder from "../MarketViewLinkCard/MarketViewLinkCardPlaceholder.web";
import RaceByTimeRangeCardPlaceholder from "../RaceByTimeRangeCard/RaceByTimeRangeCardPlaceholder.web";
import RaceDetailsCardPlaceholder from "../RaceDetailsCard/RaceDetailsCardPlaceholder.web";
import RaceViewLinkCardPlaceholder from "../RaceViewLinkCard/RaceViewLinkCardPlaceholder.web";
import RaceViewLinksCardPlaceholder from "../RaceViewLinksCard/RaceViewLinksCardPlaceholder.web";
import SportsbookBetCardPlaceholder from "../SportsbookBetCard/SportsbookBetCardPlaceholder.web";
import SportViewLinkPlaceholder from "../SportViewLinkCard/SportViewLinkPlaceholder.web";
import SportsbookExpandableLegCardGroupPlaceholder from "../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroupPlaceholder.web";
import SportsbookBetLegCardGroupPlaceholder from "../SportsbookBetLegCardGroup/SportsbookBetLegCardGroupPlaceholder.web";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import ObbCardGroupPlaceholder from "../ObbCardGroup/ObbCardGroupPlaceholder.web";
import EventMarketCardPlaceholder from "../EventMarketCard/EventMarketCardPlaceholder.web";
import ContentSummaryCardPlaceholder from "../ContentSummaryCard/ContentSummaryCardPlaceholder.web";
import GamingPlayNewCardPlaceholder from "../GamingPlayNewCard/GamingPlayNewCardPlaceholder.web";
import GamingJackpotCardPlaceholder from "../GamingJackpotCard/GamingJackpotCardPlaceholder.web";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.web";
import DefaultPlaceholder from "./DefaultPlaceholder.web";
import SportsbookBetLegCardPlaceholder from "../SportsbookBetLegCard/SportsbookBetLegCardPlaceholder.web";
import RegulatoryCardPlaceholder from "../RegulatoryCard/RegulatoryCardPlaceholder.web";
import MarketExtendedCardPlaceholder from "../MarketExtendedCard/MarketExtendedCardPlaceholder.web";
import RaceResultsCardPlaceholder from "../RaceResultsCard/RaceResultsCardPlaceholder.web";
import RaceMarketCardPlaceholder from "../RaceMarketCard/RaceMarketCardPlaceholder.web";
import QuickLinksCardPlaceholder from "../QuickLinksCard/QuickLinksCardPlaceholder.web";
import BroadcastsCardPlaceholder from "../BroadcastsCard/BroadcastsCardPlaceholder.web";
import ObbCreatedBetsCardGroupPlaceholder from "../ObbCreatedBetsCardGroup/placeholder/ObbCreatedBetsCardGroupPlaceholder.web";
import ObbEventPopularsCardPlaceholder from "../ObbEventPopularsCard/placeholder/ObbEventPopularsCardPlaceholder.web";
import ObbOnboardingCardsCardGroupPlaceholder from "../ObbOnboardingCardsCardGroup/placeholder/ObbOnboardingCardsCardGroupPlaceholder.web";

import styles from "./Card.web.css";

const ConnectedFixtureCard = React.lazy(() => import(/* webpackChunkName: "Fixture" */ "../FixtureCard"));
const FixtureCard = React.lazy(() => import(/* webpackChunkName: "Fixture" */ "../FixtureCard/FixtureCard.web"));
const ConnectedEventHeaderCard = React.lazy(
  () => import(/* webpackChunkName: "EventHeaderCard" */ "../EventHeaderCard"),
);
const EventHeaderCard = React.lazy(
  () => import(/* webpackChunkName: "EventHeaderCard" */ "../EventHeaderCard/EventHeaderCard.web"),
);
const ConnectedMarketCard = React.lazy(() => import(/* webpackChunkName: "MarketCard" */ "../MarketCard"));
const MarketCard = React.lazy(() => import(/* webpackChunkName: "MarketCard" */ "../MarketCard/MarketCard.web"));
const ConnectedEventMarketCard = React.lazy(
  () => import(/* webpackChunkName: "EventMarketCard" */ "../EventMarketCard"),
);
const EventMarketCard = React.lazy(
  () => import(/* webpackChunkName: "EventMarketCard" */ "../EventMarketCard/EventMarketCard.web"),
);
const ConnectedHeadToHeadCard = React.lazy(() => import(/* webpackChunkName: "HeadToHeadCard" */ "../HeadToHeadCard"));
const HeadToHeadCard = React.lazy(
  () => import(/* webpackChunkName: "HeadToHeadCard" */ "../HeadToHeadCard/HeadToHeadCard.web"),
);
const ConnectedRecentFormCard = React.lazy(() => import(/* webpackChunkName: "RecentFormCard" */ "../RecentFormCard"));
const RecentFormCard = React.lazy(
  () => import(/* webpackChunkName: "RecentFormCard" */ "../RecentFormCard/RecentFormCard.web"),
);
const TeamLineupCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "TeamLineupCard" */ "@ppb/tbd-components-rich-data/components/TeamLineupCard/view/TeamLineupCard.web"
    ),
);
const ConnectedMatchTimelineCard = React.lazy(
  () => import(/* webpackChunkName: "MatchTimelineCard" */ "../MatchTimelineCard"),
);
const MatchTimelineCard = React.lazy(
  () => import(/* webpackChunkName: "MatchTimelineCard" */ "../MatchTimelineCard/MatchTimelineCard.web"),
);
const ConnectedMatchStatsCard = React.lazy(() => import(/* webpackChunkName: "MatchStatsCard" */ "../MatchStatsCard"));
const MatchStatsCard = React.lazy(
  () => import(/* webpackChunkName: "MatchStatsCard" */ "../MatchStatsCard/MatchStatsCard.web"),
);
const ConnectedEventStatsCard = React.lazy(() => import(/* webpackChunkName: "EventStatsCard" */ "../EventStatsCard"));
const EventStatsCard = React.lazy(
  () => import(/* webpackChunkName: "EventStatsCard" */ "../EventStatsCard/EventStatsCard.web"),
);
const ConnectedCompetitionViewLinkCard = React.lazy(
  () => import(/* webpackChunkName: "CompetitionViewLinkCard" */ "../CompetitionViewLinkCard"),
);
const CompetitionViewLinkCard = React.lazy(
  () =>
    import(/* webpackChunkName: "CompetitionViewLinkCard" */ "../CompetitionViewLinkCard/CompetitionViewLinkCard.web"),
);

const ConnectedSportViewLinkCard = React.lazy(
  () => import(/* webpackChunkName: "SportViewLinkCard" */ "../SportViewLinkCard"),
);
const SportViewLinkCard = React.lazy(
  () => import(/* webpackChunkName: "SportViewLinkCard" */ "../SportViewLinkCard/SportViewLinkCard.web"),
);

const ConnectedSportsbookBetCard = React.lazy(
  () => import(/* webpackChunkName: "MyBetsSportsbook" */ "../SportsbookBetCard"),
);
const SportsbookBetCard = React.lazy(
  () => import(/* webpackChunkName: "MyBetsSportsbook" */ "../SportsbookBetCard/SportsbookBetCard.web"),
);
const ConnectedBetCardGroup = React.lazy(() => import(/* webpackChunkName: "MyBetsSportsbook" */ "../BetCardGroup"));

const BetCardGroup = React.lazy(
  () => import(/* webpackChunkName: "MyBetsSportsbook" */ "../BetCardGroup/BetCardGroup.web"),
);

const ConnectedSportsbookBetLegCard = React.lazy(
  () => import(/* webpackChunkName: "MyBetsSportsbook" */ "../SportsbookBetLegCard"),
);
const SportsbookBetLegCard = React.lazy(
  () => import(/* webpackChunkName: "MyBetsSportsbook" */ "../SportsbookBetLegCard/SportsbookBetLegCard.web"),
);

const ConnectedSportsbookBetLegCardGroup = React.lazy(
  () => import(/* webpackChunkName: "MyBetsSportsbook" */ "../SportsbookBetLegCardGroup"),
);
const SportsbookBetLegCardGroup = React.lazy(
  () => import(/* webpackChunkName: "MyBetsSportsbook" */ "../SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.web"),
);

const ConnectedSportsbookExpandableLegCardGroup = React.lazy(
  () => import(/* webpackChunkName: "MyBetsSportsbook" */ "../SportsbookExpandableLegCardGroup"),
);

const SportsbookExpandableLegCardGroup = React.lazy(
  () =>
    import(
      /* webpackChunkName: "MyBetsSportsbook" */ "../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web"
    ),
);

const ConnectedSportsbookBetInfoCard = React.lazy(
  () => import(/* webpackChunkName: "MyBetsSportsbook" */ "../SportsbookBetInfoCard"),
);

const SportsbookBetInfoCard = React.lazy(
  () => import(/* webpackChunkName: "MyBetsSportsbook" */ "../SportsbookBetInfoCard/SportsbookBetInfoCard.web"),
);

const ConnectedQuickLinksCard = React.lazy(() => import(/* webpackChunkName: "QuickLinksCard" */ "../QuickLinksCard"));
const QuickLinksCard = React.lazy(
  () => import(/* webpackChunkName: "QuickLinksCard" */ "../QuickLinksCard/QuickLinksCard.web"),
);
const ConnectedGameCard = React.lazy(() => import(/* webpackChunkName: "GameCard" */ "../GameCard"));
const GameCard = React.lazy(() => import(/* webpackChunkName: "GameCard" */ "../GameCard/GameCard.web"));
const ConnectedViewZone = React.lazy(() => import(/* webpackChunkName: "ViewZone" */ "../ViewZone"));
const ViewZone = React.lazy(() => import(/* webpackChunkName: "ViewZone" */ "../ViewZone/ViewZone.web"));
const GamingPrizeMachineCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "GamingPrizeMachineCard" */ "@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/view/GamingPrizeMachineCard.web"
    ),
);
const ConnectedGamingPlayNewCard = React.lazy(
  () => import(/* webpackChunkName: "GamingPlayNewCard" */ "../GamingPlayNewCard"),
);
const GamingPlayNewCard = React.lazy(
  () => import(/* webpackChunkName: "GamingPlayNewCard" */ "../GamingPlayNewCard/GamingPlayNewCard.web"),
);
const ConnectedSegmentedCardGroup = React.lazy(
  () => import(/* webpackChunkName: "SegmentedCardGroup" */ "../SegmentedCardGroup"),
);
const SegmentedCardGroup = React.lazy(
  () => import(/* webpackChunkName: "SegmentedCardGroup" */ "../SegmentedCardGroup/SegmentedCardGroup.web"),
);
const ConnectedRaceDetailsCard = React.lazy(
  () => import(/* webpackChunkName: "RaceDetailsCard" */ "../RaceDetailsCard"),
);
const RaceDetailsCard = React.lazy(
  () => import(/* webpackChunkName: "RaceDetailsCard" */ "../RaceDetailsCard/RaceDetailsCard.web"),
);
const ConnectedRaceResultsCard = React.lazy(
  () => import(/* webpackChunkName: "RaceResultsCard" */ "../RaceResultsCard"),
);
const RaceResultsCard = React.lazy(
  () => import(/* webpackChunkName: "RaceResultsCard" */ "../RaceResultsCard/RaceResultsCard.web"),
);
const ConnectedRaceMarketCard = React.lazy(() => import(/* webpackChunkName: "RaceMarketCard" */ "../RaceMarketCard"));
const RaceMarketCard = React.lazy(
  () => import(/* webpackChunkName: "RaceMarketCard" */ "../RaceMarketCard/RaceMarketCard.web"),
);
const ConnectedRaceViewLinksCard = React.lazy(
  () => import(/* webpackChunkName: "RaceViewLinksCard" */ "../RaceViewLinksCard"),
);
const RaceViewLinksCard = React.lazy(
  () => import(/* webpackChunkName: "RaceViewLinksCard" */ "../RaceViewLinksCard/RaceViewLinksCard.web"),
);
const ConnectedRaceViewLinkCard = React.lazy(
  () => import(/* webpackChunkName: "RaceViewLinkCard" */ "../RaceViewLinkCard"),
);
const RaceViewLinkCard = React.lazy(
  () => import(/* webpackChunkName: "RaceViewLinkCard" */ "../RaceViewLinkCard/RaceViewLinkCard.web"),
);
const ConnectedHighlightedSelectionCard = React.lazy(
  () => import(/* webpackChunkName: "HighlightedSelectionCard" */ "../HighlightedSelectionCard"),
);
const HighlightedSelectionCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "HighlightedSelectionCard" */ "../HighlightedSelectionCard/HighlightedSelectionCard.web"
    ),
);
const MatchStatSelectionCard = React.lazy(
  () => import(/* webpackChunkName: "MatchStatSelectionCard" */ "../MatchStatSelectionCard/MatchStatSelectionCard.web"),
);
const ConnectedMatchStatSelectionCard = React.lazy(
  () => import(/* webpackChunkName: "MatchStatSelectionCard" */ "../MatchStatSelectionCard"),
);
const ConnectedEventViewLinkCard = React.lazy(
  () => import(/* webpackChunkName: "EventViewLinkCard" */ "../EventViewLinkCard"),
);
const EventViewLinkCard = React.lazy(
  () => import(/* webpackChunkName: "EventViewLinkCard" */ "../EventViewLinkCard/EventViewLinkCard.web"),
);
const ConnectedPromotionCard = React.lazy(() => import(/* webpackChunkName: "PromotionCard" */ "../PromotionCard"));
const PromotionCard = React.lazy(
  () => import(/* webpackChunkName: "PromotionCard" */ "../PromotionCard/PromotionCard.web"),
);

const ConnectedMarketExtendedCard = React.lazy(
  () => import(/* webpackChunkName: "MarketExtendedCard" */ "../MarketExtendedCard"),
);
const MarketExtendedCard = React.lazy(
  () => import(/* webpackChunkName: "MarketExtendedCard" */ "../MarketExtendedCard/MarketExtendedCard.web"),
);
const ConnectedMarketRules = React.lazy(() => import(/* webpackChunkName: "MarketRulesCard" */ "../MarketRulesCard"));
const MarketRulesCard = React.lazy(
  () => import(/* webpackChunkName: "MarketRulesCard" */ "../MarketRulesCard/MarketRulesCard.web"),
);
const ConnectedGameInfoCard = React.lazy(() => import(/* webpackChunkName: "GameInfoCard" */ "../GameInfo"));
const GameInfoCard = React.lazy(() => import(/* webpackChunkName: "GameInfoCard" */ "../GameInfo/GameInfo.web"));

const ConnectedMarketViewLinkCard = React.lazy(
  () => import(/* webpackChunkName: "MarketViewLinkCard" */ "../MarketViewLinkCard"),
);
const MarketViewLinkCard = React.lazy(
  () => import(/* webpackChunkName: "MarketViewLinkCard" */ "../MarketViewLinkCard/MarketViewLinkCard.web"),
);
const ConnectedGamingLinkCard = React.lazy(() => import(/* webpackChunkName: "GamingLinkCard" */ "../GamingLinkCard"));
const GamingLinkCard = React.lazy(
  () => import(/* webpackChunkName: "GamingLinkCard" */ "../GamingLinkCard/GamingLinkCard.web"),
);
const ConnectedContentSummaryCard = React.lazy(
  () => import(/* webpackChunkName: "ContentSummaryCard" */ "../ContentSummaryCard"),
);
const ContentSummaryCard = React.lazy(
  () => import(/* webpackChunkName: "ContentSummaryCard" */ "../ContentSummaryCard/ContentSummaryCard.web"),
);

const ConnectedGamingJackpotCard = React.lazy(
  () => import(/* webpackChunkName: "GamingJackpotCard" */ "../GamingJackpotCard"),
);
const GamingJackpotCard = React.lazy(
  () => import(/* webpackChunkName: "GamingJackpotCard" */ "../GamingJackpotCard/GamingJackpotCard.web"),
);

const ConnectedBroadcastsCard = React.lazy(() => import(/* webpackChunkName: "BroadcastsCard" */ "../BroadcastsCard"));
const BroadcastsCard = React.lazy(
  () => import(/* webpackChunkName: "BroadcastsCard" */ "../BroadcastsCard/BroadcastsCard.web"),
);

const ConnectedBroadcastsAndStatisticsCard = React.lazy(
  () => import(/* webpackChunkName: "BroadcastsAndStatisticsCard" */ "../BroadcastsAndStatisticsCard"),
);
const BroadcastsAndStatisticsCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "BroadcastsAndStatisticsCard" */ "../BroadcastsAndStatisticsCard/BroadcastsAndStatisticsCard.web"
    ),
);

const GenericSwitcherCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "GenericSwitcherCard" */ "@ppb/tbd-components-navigation/components/GenericSwitcherCard/view/GenericSwitcherCard.web"
    ),
);

const RaceSwitcherCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "RaceSwitcherCard" */ "@ppb/tbd-components-navigation/components/RaceSwitcherCard/view/RaceSwitcherCard.web"
    ),
);

const ConnectedImsPromotionDetailsCard = React.lazy(
  () => import(/* webpackChunkName: "ims-promotion-details-card" */ "../ImsPromotionDetailsCard"),
);
const ImsPromotionDetailsCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ims-promotion-details-card" */ "../ImsPromotionDetailsCard/ImsPromotionDetailsCard.web"
    ),
);

const ConnectedRunnerInfoCard = React.lazy(() => import(/* webpackChunkName: "RunnerInfoCard" */ "../RunnerInfoCard"));
const RunnerInfoCard = React.lazy(
  () => import(/* webpackChunkName: "RunnerInfoCard" */ "../RunnerInfoCard/RunnerInfoCard.web"),
);

const ConnectedImsPromotionTermsAndConditionsCard = React.lazy(
  () => import(/* webpackChunkName: "ims-promotion-terms-card" */ "../ImsPromotionTermsAndConditionsCard"),
);
const ImsPromotionTermsAndConditionsCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ims-promotion-terms-card" */ "../ImsPromotionTermsAndConditionsCard/ImsPromotionTermsAndConditionsCard.web"
    ),
);

const ConnectedImsPromotionErrorCard = React.lazy(
  () => import(/* webpackChunkName: "ims-promotion-error-card" */ "../ImsPromotionErrorCard"),
);
const ImsPromotionErrorCard = React.lazy(
  () => import(/* webpackChunkName: "ims-promotion-error-card" */ "../ImsPromotionErrorCard/ImsPromotionErrorCard.web"),
);

const EmbeddedViewCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "EmbeddedViewCard" */ "@ppb/tbd-components-regulatory-and-utils/components/EmbeddedViewCard/view/EmbeddedViewCard.web"
    ),
);

const ConnectedImsPromotionStateCard = React.lazy(
  () => import(/* webpackChunkName: "ims-promotion-state-card" */ "../ImsPromotionStateCard"),
);
const ImsPromotionStateCard = React.lazy(
  () => import(/* webpackChunkName: "ims-promotion-state-card" */ "../ImsPromotionStateCard/ImsPromotionStateCard.web"),
);
const ConnectedPreferenceSingleChoiceCard = React.lazy(
  () => import(/* webpackChunkName: "preference-single-choice-card" */ "../PreferenceSingleChoiceCard"),
);
const PreferenceSingleChoiceCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "preference-single-choice-card" */ "../PreferenceSingleChoiceCard/PreferenceSingleChoiceCard.web"
    ),
);

const ConnectedRegulatoryCard = React.lazy(() => import(/* webpackChunkName: "RegulatoryCard" */ "../RegulatoryCard"));
const RegulatoryCard = React.lazy(
  () => import(/* webpackChunkName: "RegulatoryCard" */ "../RegulatoryCard/RegulatoryCard.web"),
);
const ConnectedRaceByTimeRangeCard = React.lazy(
  () => import(/* webpackChunkName: "RaceByTimeRangeCard" */ "../RaceByTimeRangeCard"),
);
const RaceByTimeRangeCard = React.lazy(
  () => import(/* webpackChunkName: "RaceByTimeRangeCard" */ "../RaceByTimeRangeCard/RaceByTimeRangeCard.web"),
);

const ConnectedForbiddenContentCard = React.lazy(
  () => import(/* webpackChunkName: "ForbiddenContentCard" */ "../ForbiddenContentCard"),
);
const ForbiddenContentCard = React.lazy(
  () => import(/* webpackChunkName: "ForbiddenContentCard" */ "../ForbiddenContentCard/ForbiddenContentCard.web"),
);
const ConnectedGenericViewLinkCard = React.lazy(
  () => import(/* webpackChunkName: "GenericViewLinkCard" */ "../GenericViewLinkCard"),
);
const GenericViewLinkCard = React.lazy(
  () => import(/* webpackChunkName: "GenericViewLinkCard" */ "../GenericViewLinkCard/GenericViewLinkCard.web"),
);

const ConnectedCompetitionRegionCard = React.lazy(
  () => import(/* webpackChunkName: "CompetitionRegionCard" */ "../CompetitionRegionCard"),
);
const CompetitionRegionCard = React.lazy(
  () => import(/* webpackChunkName: "CompetitionRegionCard" */ "../CompetitionRegionCard/CompetitionRegionCard.web"),
);

const ConnectedExpandableCardGroup = React.lazy(
  () => import(/* webpackChunkName: "ExpandableCardGroup" */ "../ExpandableCardGroup"),
);
const ExpandableCardGroup = React.lazy(
  () => import(/* webpackChunkName: "ExpandableCardGroup" */ "../ExpandableCardGroup/ExpandableCardGroup.web"),
);

const ConnectedCouponHeaderCard = React.lazy(
  () => import(/* webpackChunkName: "CouponHeaderCard" */ "../CouponHeaderCard"),
);
const CouponHeaderCard = React.lazy(
  () => import(/* webpackChunkName: "CouponHeaderCard" */ "../CouponHeaderCard/CouponHeaderCard.web"),
);

const ConnectedTimeFormBroadCastsCard = React.lazy(
  () => import(/* webpackChunkName: "TimeFormBroadCastsCard" */ "../TimeFormBroadCastsCard"),
);
const TimeFormBroadCastsCard = React.lazy(
  () => import(/* webpackChunkName: "TimeFormBroadCastsCard" */ "../TimeFormBroadCastsCard/TimeFormBroadCastsCard.web"),
);

const ConnectedGridCard = React.lazy(() => import(/* webpackChunkName: "GridCard" */ "../GridCard"));
const GridCard = React.lazy(() => import(/* webpackChunkName: "GridCard" */ "../GridCard/GridCard.web"));

const ConnectedCorrectScoreCard = React.lazy(
  () => import(/* webpackChunkName: "CorrectScoreCard" */ "../CorrectScoreCard"),
);
const CorrectScoreCard = React.lazy(
  () => import(/* webpackChunkName: "CorrectScoreCard" */ "../CorrectScoreCard/CorrectScoreCard.web"),
);

const ConnectedVirtualEventDetailsCard = React.lazy(
  () => import(/* webpackChunkName: "VirtualEventDetailsCard" */ "../VirtualEventDetailsCard"),
);
const VirtualEventDetailsCard = React.lazy(
  () =>
    import(/* webpackChunkName: "VirtualEventDetailsCard" */ "../VirtualEventDetailsCard/VirtualEventDetailsCard.web"),
);

const ConnectedExpandableMarketCard = React.lazy(
  () => import(/* webpackChunkName: "ExpandableMarketCard" */ "../ExpandableMarketCard"),
);
const ExpandableMarketCard = React.lazy(
  () => import(/* webpackChunkName: "ExpandableMarketCard" */ "../ExpandableMarketCard/ExpandableMarketCard.web"),
);

const ConnectedVirtualMarketCard = React.lazy(
  () => import(/* webpackChunkName: "VirtualMarketCard" */ "../VirtualMarketCard"),
);
const VirtualMarketCard = React.lazy(
  () => import(/* webpackChunkName: "VirtualMarketCard" */ "../VirtualMarketCard/VirtualMarketCard.web"),
);

const ConnectedVirtualCardGroup = React.lazy(
  () => import(/* webpackChunkName: "VirtualCardGroup" */ "../VirtualCardGroup"),
);
const VirtualCardGroup = React.lazy(
  () => import(/* webpackChunkName: "VirtualCardGroup" */ "../VirtualCardGroup/VirtualCardGroup.web"),
);

const ConnectedPopularBetBuilderCard = React.lazy(
  () => import(/* webpackChunkName: "PopularBetBuilderCard" */ "../PopularBetBuilderCard"),
);
const PopularBetBuilderCard = React.lazy(
  () => import(/* webpackChunkName: "PopularBetBuilderCard" */ "../PopularBetBuilderCard/PopularBetBuilderCard.web"),
);

const ConnectedPackagedCreatedBetsCard = React.lazy(
  () => import(/* webpackChunkName: "PackagedCreatedBetsCard" */ "../PackagedCreatedBetsCard"),
);

const PackagedCreatedBetsCard = React.lazy(
  () =>
    import(/* webpackChunkName: "PackagedCreatedBetsCard" */ "../PackagedCreatedBetsCard/PackagedCreatedBetsCard.web"),
);

const ConnectedPriceBoostMultisListCard = React.lazy(
  () => import(/* webpackChunkName: "PriceBoostMultisListCard" */ "../PriceBoostMultisListCard"),
);

const PriceBoostMultisListCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "PriceBoostMultisListCard" */ "../PriceBoostMultisListCard/PriceBoostMultisListCard.web"
    ),
);

const ConnectedOutrightMarketListCard = React.lazy(
  () => import(/* webpackChunkName: "OutrightMarketListCard" */ "../OutrightMarketListCard"),
);
const OutrightMarketListCard = React.lazy(
  () => import(/* webpackChunkName: "OutrightMarketListCard" */ "../OutrightMarketListCard/OutrightMarketListCard.web"),
);

const ConnectedMarketBetCardGroup = React.lazy(
  () => import(/* webpackChunkName: "MyBetsExchange" */ "../MarketBetCardGroup"),
);

const MarketBetCardGroup = React.lazy(
  () => import(/* webpackChunkName: "MyBetsExchange" */ "../MarketBetCardGroup/MarketBetCardGroup.web"),
);

const ConnectedMarketBetCard = React.lazy(() => import(/* webpackChunkName: "MyBetsExchange" */ "../MarketBetCard"));

const MarketBetCard = React.lazy(
  () => import(/* webpackChunkName: "MyBetsExchange" */ "../MarketBetCard/MarketBetCard.web"),
);

const ConnectedMarketBetExpandableCardGroup = React.lazy(
  () => import(/* webpackChunkName: "MyBetsExchange" */ "../MarketBetExpandableCardGroup"),
);

const MarketBetExpandableCardGroup = React.lazy(
  () =>
    import(/* webpackChunkName: "MyBetsExchange" */ "../MarketBetExpandableCardGroup/MarketBetExpandableCardGroup.web"),
);

const ConnectedMarketBetSelectionCardGroup = React.lazy(
  () => import(/* webpackChunkName: "MyBetsExchange" */ "../MarketBetSelectionCardGroup"),
);

const MarketBetSelectionCardGroup = React.lazy(
  () =>
    import(/* webpackChunkName: "MyBetsExchange" */ "../MarketBetSelectionCardGroup/MarketBetSelectionCardGroup.web"),
);

const ConnectedMarketBetSelectionCard = React.lazy(
  () => import(/* webpackChunkName: "MyBetsExchange" */ "../MarketBetSelectionCard"),
);

const MarketBetSelectionCard = React.lazy(
  () => import(/* webpackChunkName: "MyBetsExchange" */ "../MarketBetSelectionCard/MarketBetSelectionCard.web"),
);

const EmbeddedContentCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "EmbeddedContentCard" */ "@ppb/tbd-components-rich-data/components/EmbeddedContentCard/view/EmbeddedContentCard.web"
    ),
);

const ConnectedBetSharingCardGroup = React.lazy(
  () => import(/* webpackChunkName: "BetSharingCardGroup" */ "../BetSharingCardGroup"),
);
const BetSharingCardGroup = React.lazy(
  () => import(/* webpackChunkName: "BetSharingCardGroup" */ "../BetSharingCardGroup/BetSharingCardGroup.web"),
);

const ConnectedSearchBarCard = React.lazy(() => import(/* webpackChunkName: "SearchBarCard" */ "../SearchBarCard"));
const SearchBarCard = React.lazy(
  () => import(/* webpackChunkName: "SearchBarCard" */ "../SearchBarCard/SearchBarCard.web"),
);

const ConnectedHalfTimeSpecialsCard = React.lazy(
  () => import(/* webpackChunkName: "ConnectedHalfTimeSpecialsCard" */ "../HalfTimeSpecialsSwimlaneCardGroup"),
);
const HalfTimeSpecialsSwimlaneCardGroup = React.lazy(
  () =>
    import(
      /* webpackChunkName: "HalfTimeSpecialsCard" */ "../HalfTimeSpecialsSwimlaneCardGroup/HalfTimeSpecialsSwimlaneCardGroup.web"
    ),
);

const ConnectedExtraWalletCard = React.lazy(
  () => import(/* webpackChunkName: "GenerosityWallet" */ "../ExtraWalletCard"),
);
const ExtraWalletCard = React.lazy(
  () => import(/* webpackChunkName: "GenerosityWallet" */ "../ExtraWalletCard/ExtraWalletCard.web"),
);

const StatsFormCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "StatsFormCard" */ "@ppb/tbd-components-rich-data/components/StatsFormCard/view/StatsFormCard.web"
    ),
);

const SelfExclusionCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "SelfExclusionCard" */ "@ppb/tbd-components-navigation/components/SelfExclusionCard/view/SelfExclusionCard.web"
    ),
);

const StatsHeadToHeadCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "StatsHeadToHeadCard" */ "@ppb/tbd-components-rich-data/components/StatsHeadToHeadCard/view/StatsHeadToHeadCard.web"
    ),
);

const StatsLeagueTableCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "StatsLeagueTableCard" */ "@ppb/tbd-components-rich-data/components/StatsLeagueTableCard/view/StatsLeagueTableCard.web"
    ),
);

const ConnectedExtraWalletCardGroup = React.lazy(
  () => import(/* webpackChunkName: "GenerosityWallet" */ "../ExtraWalletCardGroup"),
);

const ExtraWalletCardGroup = React.lazy(
  () => import(/* webpackChunkName: "GenerosityWallet" */ "../ExtraWalletCardGroup/ExtraWalletCardGroup.web"),
);

const ConnectedObbCardGroup = React.lazy(() => import(/* webpackChunkName: "ObbCardGroup" */ "../ObbCardGroup"));

const ObbCardGroup = React.lazy(
  () => import(/* webpackChunkName: "ObbCardGroup" */ "../ObbCardGroup/ObbCardGroup.web"),
);

const ConnectedObbCreatedBetsCardGroup = React.lazy(
  () => import(/* webpackChunkName: "ObbCreatedBetsCardGroup" */ "../ObbCreatedBetsCardGroup"),
);

const ObbCreatedBetsCardGroup = React.lazy(
  () =>
    import(/* webpackChunkName: "ObbCreatedBetsCardGroup" */ "../ObbCreatedBetsCardGroup/ObbCreatedBetsCardGroup.web"),
);

const ConnectedObbEventPopularsCard = React.lazy(
  () => import(/* webpackChunkName: "ObbEventPopularsCard" */ "../ObbEventPopularsCard"),
);

const ObbEventPopularsCard = React.lazy(
  () => import(/* webpackChunkName: "ObbEventPopularsCard" */ "../ObbEventPopularsCard/ObbEventPopularsCard.web"),
);

const ConnectedObbOnboardingCardsCardGroup = React.lazy(
  () => import(/* webpackChunkName: "ObbOnboardingCardsCardGroup" */ "../ObbOnboardingCardsCardGroup"),
);

const ObbOnboardingCardsCardGroup = React.lazy(
  () =>
    import(
      /* webpackChunkName: "ObbOnboardingCardsCardGroup" */ "../ObbOnboardingCardsCardGroup/ObbOnboardingCardsCardGroup.web"
    ),
);

const StatsMatchStatsCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "StatsMatchStatsCard" */ "@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/view/StatsMatchStatsCard.web"
    ),
);

const StatsGoalsAndShotsCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "StatsGoalsAndShotsCard" */ "@ppb/tbd-components-rich-data/components/StatsGoalsAndShotsCard/view/StatsGoalsAndShotsCard.web"
    ),
);
const StatsPlayersInPlayCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "StatsPlayersInPlayCard" */ "../StatsPlayersInPlayCard/view/StatsPlayersInPlayCard.web"
    ),
);

const StatsPlayersSeasonStatsCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "StatsPlayersSeasonStatsCard" */ "@ppb/tbd-components-rich-data/components/StatsPlayersSeasonStatsCard/view/StatsPlayersSeasonStatsCard.web"
    ),
);

const StatsTeamsCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "StatsTeamsCard" */ "@ppb/tbd-components-rich-data/components/StatsTeamsCard/view/StatsTeamsCard.web"
    ),
);

const StatsBroadcastsCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "StatsBroadcastsCard" */ "@ppb/tbd-components-rich-data/components/StatsBroadcastsCard/view/StatsBroadcastsCard.web"
    ),
);

const StatsRaceResultsCard = React.lazy(
  () => import(/* webpackChunkName: "StatsRaceResultsCard" */ "../StatsRaceResultsCard/view/StatsRaceResultsCard.web"),
);

const IncidentsCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "IncidentsCard" */ "@ppb/tbd-components-rich-data/components/IncidentsCard/view/IncidentsCard.web"
    ),
);

const StatsLineupsCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "StatsLineupsCard" */ "@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/StatsLineupsCard.web"
    ),
);

const LoyaltyPromoCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Promotions" */ "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCard.web"
    ),
);
const MiniPromotionCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Promotions" */ "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/MiniPromotionCard.web"
    ),
);

const EditorialPromoCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Promotions" */ "@ppb/tbd-components-promotions/components/EditorialPromoCard/view/EditorialPromoCard.web"
    ),
);

const BetOpportunityPromoCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Promotions" */ "@ppb/tbd-components-promotions/components/BetOpportunityPromoCard/view/BetOpportunityPromoCard.web"
    ),
);

const SelectionPromoCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Promotions" */ "@ppb/tbd-components-promotions/components/SelectionPromoCard/view/SelectionPromoCard.web"
    ),
);

const LottoCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "LottoCard" */ "@ppb/tbd-components-sports-betting/components/LottoCard/view/LottoCard.web"
    ),
);

const PopularSelectionsCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "PopularSelectionsCard" */ "@ppb/tbd-components-sports-betting/components/PopularSelectionsCard/view/PopularSelectionsCard.web"
    ),
);

const PriceBoostMultiplePromoCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Promotions" */ "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/view/PriceBoostMultiplePromoCard.web"
    ),
);

const SportsbookLotteriesBetLegCardGroup = React.lazy(
  () =>
    import(
      /* webpackChunkName: "SportsbookLotteriesBetLegCardGroup" */ "@ppb/tbd-components-my-bets/components/SportsbookLotteriesBetLegCardGroup/view/SportsbookLotteriesBetLegCardGroup.web"
    ),
);

const PenaltyTakersCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "PenaltyTakersCard" */ "@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/PenaltyTakersCard.web"
    ),
);

const PromotionsCardGroup = React.lazy(
  () =>
    import(
      /* webpackChunkName: "Promotions" */ "@ppb/tbd-components-promotions/components/PromotionsCardGroup/view/PromotionsCardGroup.web"
    ),
);

const MonterosaContentCard = React.lazy(
  () => import(/* webpackChunkName: "MonterosaContentCard" */ "../MonterosaContentCard/view/MonterosaContentCard.web"),
);

const PromotionsHubCardGroup = React.lazy(
  () =>
    import(
      /* webpackChunkName: "PromotionsHub" */ "@ppb/tbd-components-promotions/components/PromotionsHubCardGroup/view/PromotionsHubCardGroup.web"
    ),
);

const SportsbookChatbotCard = React.lazy(
  () => import(/* webpackChunkName: "SportsbookChatbot" */ "../SportsbookChatbotCard/SportsbookChatbotCard.web"),
);

type ConnectedCardsList =
  | typeof ConnectedFixtureCard
  | typeof ConnectedEventHeaderCard
  | typeof ConnectedMarketCard
  | typeof ConnectedEventMarketCard
  | typeof ConnectedHeadToHeadCard
  | typeof ConnectedRecentFormCard
  | typeof ConnectedMatchTimelineCard
  | typeof ConnectedMatchStatsCard
  | typeof ConnectedEventStatsCard
  | typeof ConnectedCompetitionViewLinkCard
  | typeof ConnectedMarketExtendedCard
  | typeof ConnectedMarketRules
  | typeof ConnectedQuickLinksCard
  | typeof ConnectedGameCard
  | typeof ConnectedGamingPlayNewCard
  | typeof ConnectedViewZone
  | typeof ConnectedSegmentedCardGroup
  | typeof ConnectedEventViewLinkCard
  | typeof ConnectedSportsbookBetCard
  | typeof ConnectedRaceMarketCard
  | typeof ConnectedHighlightedSelectionCard
  | typeof ConnectedPromotionCard
  | typeof ConnectedRaceViewLinksCard
  | typeof ConnectedRaceViewLinkCard
  | typeof ConnectedSportViewLinkCard
  | typeof ConnectedRaceDetailsCard
  | typeof ConnectedRaceResultsCard
  | typeof ConnectedGameInfoCard
  | typeof ConnectedMarketViewLinkCard
  | typeof ConnectedGamingLinkCard
  | typeof ConnectedContentSummaryCard
  | typeof ConnectedGamingJackpotCard
  | typeof ConnectedBroadcastsCard
  | typeof ConnectedBroadcastsAndStatisticsCard
  | typeof ConnectedImsPromotionDetailsCard
  | typeof ConnectedImsPromotionTermsAndConditionsCard
  | typeof ConnectedRunnerInfoCard
  | typeof ConnectedImsPromotionStateCard
  | typeof ConnectedImsPromotionErrorCard
  | typeof ConnectedRegulatoryCard
  | typeof ConnectedPreferenceSingleChoiceCard
  | typeof ConnectedRaceByTimeRangeCard
  | typeof ConnectedForbiddenContentCard
  | typeof ConnectedBetCardGroup
  | typeof ConnectedSportsbookBetLegCard
  | typeof ConnectedSportsbookBetLegCardGroup
  | typeof ConnectedSportsbookExpandableLegCardGroup
  | typeof ConnectedGenericViewLinkCard
  | typeof ConnectedCompetitionRegionCard
  | typeof ConnectedExpandableCardGroup
  | typeof ConnectedCouponHeaderCard
  | typeof ConnectedTimeFormBroadCastsCard
  | typeof ConnectedGridCard
  | typeof ConnectedVirtualEventDetailsCard
  | typeof ConnectedExpandableMarketCard
  | typeof ConnectedVirtualMarketCard
  | typeof ConnectedPopularBetBuilderCard
  | typeof ConnectedPackagedCreatedBetsCard
  | typeof ConnectedPriceBoostMultisListCard
  | typeof ConnectedCorrectScoreCard
  | typeof ConnectedSportsbookBetInfoCard
  | typeof ConnectedOutrightMarketListCard
  | typeof ConnectedMarketBetCardGroup
  | typeof ConnectedMarketBetCard
  | typeof ConnectedMarketBetExpandableCardGroup
  | typeof ConnectedMarketBetSelectionCardGroup
  | typeof ConnectedMarketBetSelectionCard
  | typeof ConnectedBetSharingCardGroup
  | typeof ConnectedVirtualCardGroup
  | typeof ConnectedSearchBarCard
  | typeof ConnectedExtraWalletCardGroup
  | typeof ConnectedExtraWalletCard
  | typeof ConnectedObbCardGroup
  | typeof ConnectedObbCreatedBetsCardGroup
  | typeof ConnectedObbOnboardingCardsCardGroup
  | typeof ConnectedHalfTimeSpecialsCard
  | typeof ConnectedMatchStatSelectionCard
  | typeof ConnectedObbEventPopularsCard;

export type MigratedCardWhiteList = {
  [key: string]: {
    component: React.FunctionComponent<{ urn: string; visible: boolean }>;
    placeholder?: React.FunctionComponent<any>;
  };
};
/**
 * This contains the list of Web Visual components for each type of Card
 * They will be added here during the refactor of each of the connected cards
 */
const cardWhiteList: CardWhiteList<ConnectedCardsList> = {
  CompetitionViewLinkCard: {
    connected: ConnectedCompetitionViewLinkCard,
    component: CompetitionViewLinkCard,
    placeholder: CompetitionViewLinkCardPlaceholder,
  },
  EventViewLinkCard: {
    connected: ConnectedEventViewLinkCard,
    component: EventViewLinkCard,
    placeholder: EventViewLinkCardPlaceholder,
  },
  MarketViewLinkCard: {
    connected: ConnectedMarketViewLinkCard,
    component: MarketViewLinkCard,
    placeholder: MarketViewLinkCardPlaceholder,
  },
  MarketCard: {
    connected: ConnectedMarketCard,
    component: MarketCard,
    placeholder: MarketCardPlaceholder,
  },
  HighlightedSelectionCard: {
    connected: ConnectedHighlightedSelectionCard,
    component: HighlightedSelectionCard,
  },
  MatchStatSelectionCard: {
    connected: ConnectedMatchStatSelectionCard,
    component: MatchStatSelectionCard,
  },
  HalfTimeSpecialsSwimlaneCardGroup: {
    connected: ConnectedHalfTimeSpecialsCard,
    component: HalfTimeSpecialsSwimlaneCardGroup,
    placeholder: HalfTimeSpecialsSwimlaneCardGroupPlaceholder,
  },
  HeadToHeadCard: {
    connected: ConnectedHeadToHeadCard,
    component: HeadToHeadCard,
  },
  MatchStatsCard: {
    connected: ConnectedMatchStatsCard,
    component: MatchStatsCard,
  },
  EventStatsCard: {
    connected: ConnectedEventStatsCard,
    component: EventStatsCard,
  },
  TeamFormCard: {
    connected: ConnectedRecentFormCard,
    component: RecentFormCard,
  },
  MatchTimelineCard: {
    connected: ConnectedMatchTimelineCard,
    component: MatchTimelineCard,
  },
  RaceMarketCard: {
    connected: ConnectedRaceMarketCard,
    component: RaceMarketCard,
    placeholder: RaceMarketCardPlaceholder,
  },
  RaceDetailsCard: {
    connected: ConnectedRaceDetailsCard,
    component: RaceDetailsCard,
    placeholder: RaceDetailsCardPlaceholder,
  },
  RaceResultsCard: {
    connected: ConnectedRaceResultsCard,
    component: RaceResultsCard,
    placeholder: RaceResultsCardPlaceholder,
  },
  FixtureCard: {
    connected: ConnectedFixtureCard,
    component: FixtureCard,
    placeholder: FixtureCardPlaceholder,
  },
  EventHeaderCard: {
    connected: ConnectedEventHeaderCard,
    component: EventHeaderCard,
    placeholder: EventHeaderCardPlaceholder,
  },
  MarketExtendedCard: {
    connected: ConnectedMarketExtendedCard,
    component: MarketExtendedCard,
    placeholder: MarketExtendedCardPlaceholder,
  },
  MarketRulesCard: { connected: ConnectedMarketRules, component: MarketRulesCard },
  QuickLinksCard: {
    connected: ConnectedQuickLinksCard,
    component: QuickLinksCard,
    placeholder: QuickLinksCardPlaceholder,
  },
  SportsbookBetCard: {
    connected: ConnectedSportsbookBetCard,
    component: SportsbookBetCard,
    placeholder: SportsbookBetCardPlaceholder,
  },
  PromotionCard: { connected: ConnectedPromotionCard, component: PromotionCard },
  EventMarketCard: {
    connected: ConnectedEventMarketCard,
    component: EventMarketCard,
    placeholder: EventMarketCardPlaceholder,
  },
  RaceViewLinksCard: {
    connected: ConnectedRaceViewLinksCard,
    component: RaceViewLinksCard,
    placeholder: RaceViewLinksCardPlaceholder,
  },
  RaceViewLinkCard: {
    connected: ConnectedRaceViewLinkCard,
    component: RaceViewLinkCard,
    placeholder: RaceViewLinkCardPlaceholder,
  },
  RegulatoryCard: {
    connected: ConnectedRegulatoryCard,
    component: RegulatoryCard,
    placeholder: RegulatoryCardPlaceholder,
  },
  SportViewLinkCard: {
    connected: ConnectedSportViewLinkCard,
    component: SportViewLinkCard,
    placeholder: SportViewLinkPlaceholder,
  },
  GameCard: { connected: ConnectedGameCard, component: GameCard, placeholder: GameCardPlaceholder },
  GamingPlayNewCard: {
    connected: ConnectedGamingPlayNewCard,
    component: GamingPlayNewCard,
    placeholder: GamingPlayNewCardPlaceholder,
  },
  GamingLinkCard: {
    connected: ConnectedGamingLinkCard,
    component: GamingLinkCard,
    placeholder: GamingLinkCardPlaceholder,
  },
  ContentSummaryCard: {
    connected: ConnectedContentSummaryCard,
    component: ContentSummaryCard,
    placeholder: ContentSummaryCardPlaceholder,
  },
  GameInfoCard: { connected: ConnectedGameInfoCard, component: GameInfoCard, placeholder: GameInfoCardPlaceholder },
  GamingJackpotCard: {
    connected: ConnectedGamingJackpotCard,
    component: GamingJackpotCard,
    placeholder: GamingJackpotCardPlaceholder,
  },
  BroadcastsCard: {
    connected: ConnectedBroadcastsCard,
    component: BroadcastsCard,
    placeholder: BroadcastsCardPlaceholder,
  },
  BroadcastsAndStatisticsCard: {
    connected: ConnectedBroadcastsAndStatisticsCard,
    component: BroadcastsAndStatisticsCard,
    placeholder: BroadcastsAndStatisticsCardPlaceholder,
  },
  RaceByTimeRangeCard: {
    connected: ConnectedRaceByTimeRangeCard,
    component: RaceByTimeRangeCard,
    placeholder: RaceByTimeRangeCardPlaceholder,
  },
  RunnerInfoCard: { connected: ConnectedRunnerInfoCard, component: RunnerInfoCard },
  ImsPromotionDetailsCard: {
    connected: ConnectedImsPromotionDetailsCard,
    component: ImsPromotionDetailsCard,
    placeholder: ImsPromotionDetailsCardPlaceholder,
  },
  ImsPromotionTermsAndConditionsCard: {
    connected: ConnectedImsPromotionTermsAndConditionsCard,
    component: ImsPromotionTermsAndConditionsCard,
  },
  ImsPromotionStateCard: {
    connected: ConnectedImsPromotionStateCard,
    component: ImsPromotionStateCard,
  },
  ImsPromotionErrorCard: {
    connected: ConnectedImsPromotionErrorCard,
    component: ImsPromotionErrorCard,
  },
  CompetitionRegionCard: {
    connected: ConnectedCompetitionRegionCard,
    component: CompetitionRegionCard,
    placeholder: CompetitionRegionCardPlaceholder,
  },
  CouponHeaderCard: {
    connected: ConnectedCouponHeaderCard,
    component: CouponHeaderCard,
    placeholder: CouponHeaderCardPlaceholder,
  },
  // Lazy loaded groups
  BetCardGroup: {
    connected: ConnectedBetCardGroup,
    component: BetCardGroup,
  },
  ViewZone: { connected: ConnectedViewZone, component: ViewZone },
  SegmentedCardGroup: {
    connected: ConnectedSegmentedCardGroup,
    component: SegmentedCardGroup,
  },
  PreferenceSingleChoiceCard: {
    connected: ConnectedPreferenceSingleChoiceCard,
    component: PreferenceSingleChoiceCard,
  },
  ForbiddenContentCard: {
    connected: ConnectedForbiddenContentCard,
    component: ForbiddenContentCard,
  },
  BetLegCard: {
    connected: ConnectedSportsbookBetLegCard,
    component: SportsbookBetLegCard,
    placeholder: SportsbookBetLegCardPlaceholder,
  },
  SportsbookBetLegCardGroup: {
    connected: ConnectedSportsbookBetLegCardGroup,
    component: SportsbookBetLegCardGroup,
    placeholder: SportsbookBetLegCardGroupPlaceholder,
  },
  SportsbookExpandableLegCardGroup: {
    connected: ConnectedSportsbookExpandableLegCardGroup,
    component: SportsbookExpandableLegCardGroup,
    placeholder: SportsbookExpandableLegCardGroupPlaceholder,
  },
  GenericViewLinkCard: {
    connected: ConnectedGenericViewLinkCard,
    component: GenericViewLinkCard,
    placeholder: GenericViewLinkPlaceholder,
  },
  ExpandableCardGroup: {
    connected: ConnectedExpandableCardGroup,
    component: ExpandableCardGroup,
  },
  TimeFormBroadCastsCard: {
    connected: ConnectedTimeFormBroadCastsCard,
    component: TimeFormBroadCastsCard,
    placeholder: TimeFormBroadCastsCardPlaceholder,
  },
  GridCard: {
    connected: ConnectedGridCard,
    component: GridCard,
    placeholder: GridCardPlaceholder,
  },
  CorrectScoreCard: {
    connected: ConnectedCorrectScoreCard,
    component: CorrectScoreCard,
    placeholder: CorrectScoreCardPlaceholder,
  },
  VirtualEventDetailsCard: { connected: ConnectedVirtualEventDetailsCard, component: VirtualEventDetailsCard },
  ExpandableMarketCard: {
    connected: ConnectedExpandableMarketCard,
    component: ExpandableMarketCard,
    placeholder: ExpandableMarketCardPlaceholder,
  },
  VirtualMarketCard: { connected: ConnectedVirtualMarketCard, component: VirtualMarketCard },
  VirtualCardGroup: { connected: ConnectedVirtualCardGroup, component: VirtualCardGroup },
  PopularBetBuilderCard: { connected: ConnectedPopularBetBuilderCard, component: PopularBetBuilderCard },
  PriceBoostMultisCard: { connected: ConnectedPopularBetBuilderCard, component: PopularBetBuilderCard },
  PackagedCreatedBetsCard: { connected: ConnectedPackagedCreatedBetsCard, component: PackagedCreatedBetsCard },
  PriceBoostMultisListCard: { connected: ConnectedPriceBoostMultisListCard, component: PriceBoostMultisListCard },
  OutrightMarketListCard: { connected: ConnectedOutrightMarketListCard, component: OutrightMarketListCard },
  PopularMultiplesBetBuilderCard: { connected: ConnectedPopularBetBuilderCard, component: PopularBetBuilderCard },
  SportsbookBetInfoCard: {
    connected: ConnectedSportsbookBetInfoCard,
    component: SportsbookBetInfoCard,
    placeholder: () => <></>,
  },
  MarketBetCardGroup: {
    connected: ConnectedMarketBetCardGroup,
    component: MarketBetCardGroup,
    placeholder: () => <></>,
  },
  MarketBetCard: { connected: ConnectedMarketBetCard, component: MarketBetCard, placeholder: () => <></> },
  MarketBetExpandableCardGroup: {
    connected: ConnectedMarketBetExpandableCardGroup,
    component: MarketBetExpandableCardGroup,
  },
  MarketBetSelectionCardGroup: {
    connected: ConnectedMarketBetSelectionCardGroup,
    component: MarketBetSelectionCardGroup,
  },
  MarketBetSelectionCard: { connected: ConnectedMarketBetSelectionCard, component: MarketBetSelectionCard },
  BetSharingCardGroup: {
    connected: ConnectedBetSharingCardGroup,
    component: BetSharingCardGroup,
    placeholder: () => <></>,
  },
  SearchBarCard: { connected: ConnectedSearchBarCard, component: SearchBarCard },
  ExtraWalletCardGroup: {
    connected: ConnectedExtraWalletCardGroup,
    component: ExtraWalletCardGroup,
  },
  ExtraWalletCard: { connected: ConnectedExtraWalletCard, component: ExtraWalletCard },
  ObbCardGroup: {
    connected: ConnectedObbCardGroup,
    component: ObbCardGroup,
    placeholder: ObbCardGroupPlaceholder,
  },
  ObbCreatedBetsCardGroup: {
    connected: ConnectedObbCreatedBetsCardGroup,
    component: ObbCreatedBetsCardGroup,
    placeholder: ObbCreatedBetsCardGroupPlaceholder,
  },
  ObbEventPopularsCard: {
    connected: ConnectedObbEventPopularsCard,
    component: ObbEventPopularsCard,
    placeholder: ObbEventPopularsCardPlaceholder,
  },
  ObbOnboardingCardsCardGroup: {
    connected: ConnectedObbOnboardingCardsCardGroup,
    component: ObbOnboardingCardsCardGroup,
    placeholder: ObbOnboardingCardsCardGroupPlaceholder,
  },
};

const migratedCardWhiteList: MigratedCardWhiteList = {
  GamingPrizeMachineCard: {
    component: GamingPrizeMachineCard,
    placeholder: GamingPrizeMachineCardPlaceholder,
  },
  StatsFormCard: {
    component: StatsFormCard,
    placeholder: StatsFormCardPlaceholder,
  },
  SelfExclusionCard: {
    component: SelfExclusionCard,
    placeholder: SelfExclusionCardPlaceholder,
  },
  StatsHeadToHeadCard: {
    component: StatsHeadToHeadCard,
  },
  StatsTeamsCard: {
    component: StatsTeamsCard,
    placeholder: StatsTeamsCardPlaceholder,
  },
  StatsPlayersSeasonStatsCard: {
    component: StatsPlayersSeasonStatsCard,
  },
  StatsMatchStatsCard: {
    component: StatsMatchStatsCard,
  },
  IncidentsCard: {
    component: IncidentsCard,
  },
  StatsGoalsAndShotsCard: {
    component: StatsGoalsAndShotsCard,
  },
  StatsPlayersInPlayCard: {
    component: StatsPlayersInPlayCard,
  },
  StatsBroadcastsCard: {
    component: StatsBroadcastsCard,
  },
  StatsLineupsCard: {
    component: StatsLineupsCard,
  },
  StatsTableCard: {
    component: StatsLeagueTableCard,
  },
  StatsRaceResultsCard: {
    component: StatsRaceResultsCard,
  },
  TeamLineupCard: {
    component: TeamLineupCard,
  },
  GenericSwitcherCard: {
    component: GenericSwitcherCard,
    placeholder: GenericSwitcherCardPlaceholder,
  },
  RaceSwitcherCard: {
    component: RaceSwitcherCard,
    placeholder: RaceSwitcherCardPlaceholder,
  },
  MiniPromoBannerCard: {
    component: MiniPromotionCard,
    placeholder: MiniPromotionCardPlaceholder,
  },
  EditorialPromoCard: {
    component: EditorialPromoCard,
    placeholder: EditorialPromoCardPlaceholder,
  },
  BetOpportunityPromoCard: {
    component: BetOpportunityPromoCard,
    placeholder: BetOpportunityPromoCardPlaceholder,
  },
  LoyaltyPromoCard: {
    component: LoyaltyPromoCard,
    placeholder: LoyaltyPromoCardPlaceholder,
  },
  SelectionPromoCard: {
    component: SelectionPromoCard,
    placeholder: SelectionPromoCardPlaceholder,
  },
  LottoCard: {
    component: LottoCard,
    placeholder: LottoCardPlaceholder,
  },
  PenaltyTakersCard: {
    component: PenaltyTakersCard,
    placeholder: PenaltyTakersCardPlaceholder,
  },
  PopularSelectionsCard: {
    component: PopularSelectionsCard,
    placeholder: PopularSelectionsCardPlaceholder,
  },
  PriceBoostMultiplePromoCard: {
    component: PriceBoostMultiplePromoCard,
    placeholder: PriceBoostMultiplePromoCardPlaceholder,
  },
  SportsbookLotteriesBetLegCardGroup: {
    component: SportsbookLotteriesBetLegCardGroup,
    placeholder: SportsbookLotteriesBetLegCardGroupPlaceholder,
  },
  PromotionsCardGroup: {
    component: PromotionsCardGroup,
    placeholder: PromotionsCardGroupPlaceholder,
  },
  MonterosaContentCard: {
    component: MonterosaContentCard,
    placeholder: MonterosaContentPlaceholder,
  },
  EmbeddedContentCard: {
    component: EmbeddedContentCard,
  },
  EmbeddedViewCard: {
    component: EmbeddedViewCard,
    placeholder: EmbeddedViewCardPlaceholder,
  },
  PromotionsHubCardGroup: {
    component: PromotionsHubCardGroup,
    placeholder: PromotionsHubCardGroupPlaceholder,
  },
  SportsbookChatbotCard: {
    component: SportsbookChatbotCard,
    placeholder: SportsbookChatbotCardPlaceholder,
  },
};

export const isCardImplemented = (typename: string): boolean =>
  !!cardWhiteList[typename] || !!migratedCardWhiteList[typename];

const Card: FunctionComponent<ComponentProps> = ({ urn, visible, typename, isCardLoaded, moduleTitle, theme }) => {
  if (!isCardImplemented(typename)) {
    console.warn("Unsupported card:", typename);
    return <></>;
  }

  const ComponentPlaceholder =
    cardWhiteList[typename]?.placeholder || migratedCardWhiteList[typename]?.placeholder || DefaultPlaceholder;

  const externalSettingsViews = [
    "ppb:tbd:card:embeddedView:personalDetails",
    "ppb:tbd:card:embeddedView:notifications",
  ];

  const cardContainerStyle = classnames(styles.cardContainer, {
    [styles.externalSettingsView]: externalSettingsViews.includes(urn),
  });

  const renderCard = () => {
    if (migratedCardWhiteList[typename]) {
      const Component = migratedCardWhiteList[typename].component;

      return <Component urn={urn} visible={visible} />;
    }

    if (isCardLoaded) {
      const { connected: ConnectedCard, component } = cardWhiteList[typename];
      return (
        // @ts-expect-error Final union type is too complex
        <ConnectedCard
          // @ts-expect-error Final union type is too complex
          urn={urn}
          component={component}
          placeholder={ComponentPlaceholder}
          moduleTitle={moduleTitle}
          visible={visible}
          theme={theme ?? undefined}
        />
      );
    }

    // if the card hasn't been loaded from BFF yet, avoid downloading its assets (JS/CSS chunks) until it's needed
    return <ComponentPlaceholder />;
  };

  // TODO remove @ts-expect-error after fixing typechecking on connected universal components
  return (
    <ErrorBoundary urn={urn}>
      <Fragment key={urn}>
        <Suspense fallback={<ComponentPlaceholder />}>
          <div className={cardContainerStyle}>{renderCard()}</div>
        </Suspense>
      </Fragment>
    </ErrorBoundary>
  );
};

export default Card;
