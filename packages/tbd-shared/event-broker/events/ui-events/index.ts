import { BetslipEvents } from "@ppb/tbd-store/actions/betting";
import { CatalogueEvents } from "@ppb/tbd-store/actions/catalogue";
import { NotificationsSubscriptionEvents } from "@ppb/tbd-store/actions/push-notifications";
import { StatsFormCardEvents } from "@ppb/tbd-components-rich-data/components/StatsFormCard/viewmodel/events";
import { GenericSwitcherCardEvents } from "@ppb/tbd-components-navigation/components/GenericSwitcherCard/viewmodel/events";
import { RaceSwitcherCardEvents } from "@ppb/tbd-components-navigation/components/RaceSwitcherCard/viewmodel/events";
import { LoyaltyPromoCardEvents } from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/viewmodel/events";
import { EditorialPromoCardEvents } from "@ppb/tbd-components-promotions/components/EditorialPromoCard/viewmodel/events";
import { BetOpportunityPromoCardEvents } from "@ppb/tbd-components-promotions/components/BetOpportunityPromoCard/viewmodel/events";
import { SelectionPromoCardEvents } from "@ppb/tbd-components-promotions/components/SelectionPromoCard/viewmodel/events";
import { LottoCardEvents } from "@ppb/tbd-components-sports-betting/components/LottoCard/viewmodel/events";
import { PenaltyTakersCardEvents } from "@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/viewmodel/events";
import { SportsbookBetButtonEvents } from "@ppb/tbd-components-sports-betting/components/SportsbookBetButton/viewmodel/events";
import { PopularSelectionsCardEvents } from "@ppb/tbd-components-sports-betting/components/PopularSelectionsCard/viewmodel/events";
import { SportsbookChatbotEvents } from "@ppb/tbd-components-sports-betting/components/SportsbookChatbot/viewmodel/events";
import { PopularSelectionsEvents } from "@ppb/tbd-components-sports-betting/components/PopularSelections/viewmodel/events";
import { PopularSelectionsPromoBannerEvents } from "@ppb/tbd-components-sports-betting/components/PopularSelectionsPromoBanner/viewmodel/events";
import { PriceBoostMultiplePromoCardEvents } from "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/viewmodel/events";
import { GamingPrizeMachineCardEvents } from "@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/viewmodel/events";
import { QuicklinksGridItemCardEvents } from "@ppb/tbd-components-navigation/components/QuicklinksGridItemCard/viewmodel/events";
import { UpsellSuggestionsEvents } from "@ppb/tbd-components-flexible-betting-opportunities/components/UpsellSuggestions/viewmodel/events";
import { PackagedCreatedBetCardEvents } from "../../../components/PackagedCreatedBetsCard/events";
import { PebbleCardGroupEvents } from "../../../components/PebbleCardGroup/events";
import { SkyBetClubTrackerCardEvents } from "../../../components/SkyBetClubTrackerCard/viewmodel/events";
import { CouponEvents } from "../../../components/Coupon/events";
import { StatsPebbleCardGroupEvents } from "../../../components/StatsPebbleCardGroup/viewmodel/events";
import { StatsSupportingContentButtonsCardGroupEvents } from "../../../components/StatsSupportingContentButtonsCardGroup/viewmodel/events";
import { SelfExclusionCardEvents } from "@ppb/tbd-components-navigation/components/SelfExclusionCard/viewmodel/events";
import { StatsMatchStatsCardEvents } from "@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/viewmodel/events";
import { StatsContentCardGroupEvents } from "../../../components/StatsContentCardGroup/viewmodel/events";
import { IncidentsCardEvents } from "@ppb/tbd-components-rich-data/components/IncidentsCard/viewmodel/events";
import { StatsPlayersInPlayEvents } from "../../../components/StatsPlayersInPlayCard/viewmodel/events";
import { StatsLineupsCardEvents } from "@ppb/tbd-components-rich-data/components/StatsLineupsCard/viewmodel/events";
import { TeamLineupCardEvents } from "@ppb/tbd-components-rich-data/components/TeamLineupCard/viewmodel/events";
import { StatsPlayersSeasonStatsEvents } from "@ppb/tbd-components-rich-data/components/StatsPlayersSeasonStatsCard/viewmodel/events";
import { PriceBoostMultisListCardEvents } from "../../../components/PriceBoostMultisListCard/events";
import { XSellBarEvents } from "../../../components/Header/events";
import { PlayerViewEvents } from "../../../components/PlayerView/viewmodel/events";
import { StatsTeamsCardEvents } from "../../../components/StatsTeamsCard/viewmodel/events";
import { MonterosaContentCardEvents } from "../../../components/MonterosaContentCard/events";
import { RaceMeetingViewEvents } from "../../../components/RaceMeetingView/components/RaceMeetingView/viewmodel/events";
import { RaceDetailsCardEvents } from "../../../components/RaceMeetingView/components/RaceDetailsCard/viewmodel/events";
import { PromotionsHubEvents } from "../../../components/PromotionsHub/events";
import { FloatingContainerEvents } from "../../../components/FloatingContainer/events";
import { BreadcrumbsCardEvents } from "@ppb/tbd-components-navigation/components/BreadcrumbsCard/viewmodel/events";

export type UIEvents = BetOpportunityPromoCardEvents &
  BetslipEvents &
  CatalogueEvents &
  CouponEvents &
  EditorialPromoCardEvents &
  GamingPrizeMachineCardEvents &
  GenericSwitcherCardEvents &
  IncidentsCardEvents &
  LottoCardEvents &
  LoyaltyPromoCardEvents &
  NotificationsSubscriptionEvents &
  PackagedCreatedBetCardEvents &
  PebbleCardGroupEvents &
  PenaltyTakersCardEvents &
  PopularSelectionsCardEvents &
  PopularSelectionsEvents &
  PopularSelectionsPromoBannerEvents &
  PriceBoostMultiplePromoCardEvents &
  UpsellSuggestionsEvents &
  XSellBarEvents &
  PlayerViewEvents &
  PriceBoostMultiplePromoCardEvents &
  PriceBoostMultisListCardEvents &
  RaceDetailsCardEvents &
  RaceMeetingViewEvents &
  PromotionsHubEvents &
  RaceSwitcherCardEvents &
  SelectionPromoCardEvents &
  SelfExclusionCardEvents &
  SkyBetClubTrackerCardEvents &
  SportsbookBetButtonEvents &
  SportsbookChatbotEvents &
  StatsContentCardGroupEvents &
  StatsFormCardEvents &
  StatsLineupsCardEvents &
  StatsMatchStatsCardEvents &
  StatsPebbleCardGroupEvents &
  StatsPlayersInPlayEvents &
  StatsPlayersSeasonStatsEvents &
  StatsSupportingContentButtonsCardGroupEvents &
  StatsTeamsCardEvents &
  MonterosaContentCardEvents &
  TeamLineupCardEvents &
  XSellBarEvents &
  QuicklinksGridItemCardEvents &
  FloatingContainerEvents &
  BreadcrumbsCardEvents;
