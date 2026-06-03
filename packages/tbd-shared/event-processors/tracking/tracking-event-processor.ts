import { AnalyticsEvent } from "../../gtm/tagging-collector.native";
import subscribeEvent, { onAll } from "../../event-broker/event-subscriber";
import {
  prizeMachineCardLoadedTrackingResolver,
  prizeMachinePlayBtnClickTrackingResolver,
  prizeMachineTCsLinkClickTrackingResolver,
} from "./processors/gaming-prize-machine-card/gaming-prize-machine-card-resolvers";
import {
  packagedCreatedBetsCollapseToggleTrackingResolver,
  packagedCreatedBetsShowMoreTrackingResolver,
  packagedCreatedBetsShowLessTrackingResolver,
} from "./resolvers/packaged-created-bets-card/packaged-created-bets-card-resolvers";

import {
  priceBoostMultisCollapseToggleTrackingResolver,
  priceBoostMultisShowMoreShowLessTrackingResolver,
} from "./resolvers/price-boost-multis/price-boost-multis-resolvers";

import { pebbleCardGroupCollapseToggleTrackingResolver } from "./resolvers/pebble-card-group/pebble-card-group-resolvers";
import { couponStatsButtonClickTrackingResolver } from "./resolvers/coupon-card/coupon-card-resolvers";
import { statsPebbleClickTrackingResolver } from "./processors/stats-pebble-card-group/stats-pebble-card-group-resolvers";
import { statsSupportingContentButtonsClickTrackingResolver } from "./processors/stats-supporting-content-buttons-card-group/stats-supporting-content-buttons-card-group-resolvers";

import { statsContentCardGroupTabClickTrackingResolver } from "./processors/stats-content-card-group/stats-content-card-group-resolvers";
import { incidentsCardShowMoreClickTrackingResolver } from "./processors/incidents-card/incidents-card-resolvers";
import {
  statsPlayersInplayExpandableButtonTrackingResolver,
  statsPlayersInplayPressTermsTrackingResolver,
} from "./processors/stats-players-inplay-card/stats-players-inplay-resolvers";
import { statsPlayersSeasonStatsExpandableButtonTrackingResolver } from "./processors/stats-players-season-stats-card/stats-players-season-stats-card-resolver";
import { skyBetClubTrackerHomepageLinkTrackingResolver } from "./resolvers/sky-bet-club-tracker/sky-bet-club-tracker-card-resolvers";
import {
  betOpportunityPromoCardTapResolver,
  betOpportunityPromoCardTermsAndConditionsTapResolver,
  editorialPromoCardTapResolver,
  editorialPromoCardTermsAndConditionsTapResolver,
  gameTileClickEventResolver,
  getLoyaltyPromotionBottomSheetCloseEvent,
  getLoyaltyPromotionBottomSheetOpenEvent,
  getLoyaltyPromotionOptInTapEvent,
  loyaltyPromoCardCTATapResolver,
  loyaltyPromoCardTapResolver,
  selectionPromoCardTapResolver,
} from "./processors/promotions/promotions-resolvers";
import {
  lottoAddToBetslipTrackingResolver,
  lottoDrawsSelectedTrackingResolver,
  lottoLuckyDipClearAllTrackingResolver,
  lottoLuckyDipNumbersTrackingResolver,
  lottoLuckyDipRefreshButtonTrackingResolver,
  lottoPebbleClickTrackingResolver,
} from "./processors/lotto-card/lotto-card-resolvers";
import {
  penaltyTakersCardPlayerSwipeTrackingResolver,
  penaltyTakersCardSegmentChangeTrackingResolver,
  penaltyTakersCardVisibilityTrackingResolver,
} from "./processors/penalty-takers-card/penalty-takers-card-resolvers";
import { xSellBarItemClickAction } from "./resolvers/xsell-bar/xsell-bar-resolvers";
import { navigateToPlayerPageResolver } from "./processors/player-page/player-page-resolvers";
import { statsTeamsCardExpandableButtonTrackingResolver } from "./processors/stats-teams-card/stats-teams-card-resolvers";
import { pnInteractionRaceTrackingResolver } from "./processors/notifications-subscription/notifications-subscription-resolvers";
import {
  promotionsHubCardTapResolver,
  promotionsHubCardCTATapResolver,
  promotionsHubCardOptInTapResolver,
  promotionsHubCardGroupLoadedResolver,
  promotionsHubCardGroupPebbleListDisplayedResolver,
  promotionsHubCardGroupPebbleListClickResolver,
} from "./processors/promotions-hub/promotions-hub-resolvers";
import {
  popularSelectionsGoToBetslipTapTrackingResolver,
  popularSelectionsModalClosedTrackingResolver,
  popularSelectionsPromoBannerTapTrackingResolver,
  popularSelectionsSkippedTrackingResolver,
  popularSelectionsSwipeLeftTrackingResolver,
  popularSelectionsSwipeRightTrackingResolver,
} from "./processors/popular-selections-card/popular-selections-card-resolvers";
import { sportsbookChatbotMessageFeedbackTrackingResolver } from "./processors/sportsbook-chatbot/sportsbook-chatbot-resolvers";
import emit from "../../event-broker/event-emitter";
import { statsLineupsOnChangeViewTrackingResolver } from "./processors/stats-lineups-card/stats-lineups-card-resolver";
import {
  sportsbookChatbotHistoryLoadedTrackingResolver,
  sportsbookChatbotNewMessageDisplayedResolver,
  sportsbookChatbotSuggestedPromptSelectedTrackingResolver,
  sportsbookChatbotPromptInputTrackingResolver,
  sportsbookChatbotInputOpenedTrackingResolver,
  sportsbookChatbotTermsAndConditionsClickTrackingResolver,
  sportsbookChatbotMarketPromoExpandedTrackingResolver,
} from "./resolvers/sportsbook-chatbot/sportsbook-chatbot-resolvers";
import {
  upsellSuggestionsItemClickTrackingResolver,
  upsellSuggestionsLoadedTrackingResolver,
} from "./resolvers/upsell-suggestions/upsell-suggestions-resolvers";

const register = (sendEvent: (event: AnalyticsEvent) => void) => {
  subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_HISTORY_LOADED", (payload) => {
    sportsbookChatbotHistoryLoadedTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_NEW_MESSAGE_DISPLAYED", (payload) => {
    sportsbookChatbotNewMessageDisplayedResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_SUGGESTED_PROMPT_SELECTED", (payload) => {
    sportsbookChatbotSuggestedPromptSelectedTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_PROMPT_INPUT", (payload) => {
    sportsbookChatbotPromptInputTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_INPUT_OPENED", (payload) => {
    sportsbookChatbotInputOpenedTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_TERMS_AND_CONDITIONS_CLICK", (payload) => {
    sportsbookChatbotTermsAndConditionsClickTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_MARKET_PROMO_EXPANDED", (payload) => {
    sportsbookChatbotMarketPromoExpandedTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_MESSAGE_FEEDBACK_SENT", (payload) => {
    sportsbookChatbotMessageFeedbackTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PRIZE_MACHINE_CARD_LOADED", (payload) => {
    prizeMachineCardLoadedTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PRIZE_MACHINE_PLAY_BTN_CLICK", (payload) => {
    prizeMachinePlayBtnClickTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PRIZE_MACHINE_TCs_LINK_CLICK", (payload) => {
    prizeMachineTCsLinkClickTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PACKAGED_CREATED_BETS_COLLAPSE_TOGGLE", (payload) => {
    packagedCreatedBetsCollapseToggleTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PACKAGED_CREATED_BETS_SHOW_MORE_CLICK", (payload) => {
    packagedCreatedBetsShowMoreTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PACKAGED_CREATED_BETS_SHOW_LESS_CLICK", (payload) => {
    packagedCreatedBetsShowLessTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PEBBLE_CARD_GROUP_COLLAPSE_TOGGLE", (payload) => {
    pebbleCardGroupCollapseToggleTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/COUPON_STATS_BUTTON_CLICK", (payload) => {
    couponStatsButtonClickTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PEBBLE_STATS_CLICK", (payload) => {
    statsPebbleClickTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/SUPPORTING_CONTENT_BUTTON_STATS_CLICK", (payload) => {
    statsSupportingContentButtonsClickTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/STATS_PLAYERS_INPLAY_TERMS_TAP", (payload) => {
    statsPlayersInplayPressTermsTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/STATS_PLAYERS_INPLAY_EXPANDABLE_BUTTON_CLICK", (payload) => {
    statsPlayersInplayExpandableButtonTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/STATS_PLAYERS_SEASON_STATS_EXPANDABLE_BUTTON_CLICK", (payload) => {
    statsPlayersSeasonStatsExpandableButtonTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/STATS_TAB_CLICK", (payload) => {
    statsContentCardGroupTabClickTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/INCIDENTS_CARD_SHOW_MORE_CLICK", (payload) => {
    incidentsCardShowMoreClickTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PRICE_BOOST_MULTIS_LIST_COLLAPSE_TOGGLE", (payload) => {
    priceBoostMultisCollapseToggleTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PRICE_BOOST_MULTIS_LIST_SHOW_MORE_SHOW_LESS_CLICK", (payload) => {
    priceBoostMultisShowMoreShowLessTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/SKY_BET_CLUB_TRACKER_HOMEPAGE_LINK_TAP", (payload) => {
    skyBetClubTrackerHomepageLinkTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/LOYALTY_PROMO_CARD_TAP", (payload) => {
    loyaltyPromoCardTapResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/LOYALTY_PROMO_CARD_CTA_TAP", (payload) => {
    loyaltyPromoCardCTATapResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/LOYALTY_PROMO_CARD_OPT_IN_TAP", (payload) => {
    getLoyaltyPromotionOptInTapEvent(payload, sendEvent);
  });
  subscribeEvent("@@UI/LOYALTY_PROMO_CARD_BOTTOM_SHEET_OPEN", (payload) => {
    getLoyaltyPromotionBottomSheetOpenEvent(payload, sendEvent);
  });
  subscribeEvent("@@UI/LOYALTY_PROMO_CARD_BOTTOM_SHEET_CLOSE", (payload) => {
    getLoyaltyPromotionBottomSheetCloseEvent(payload, sendEvent);
  });
  subscribeEvent("@@UI/EDITORIAL_PROMO_CARD_PROMO_TAP", (payload) => {
    editorialPromoCardTapResolver(payload, sendEvent);
    gameTileClickEventResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/BET_OPPORTUNITY_PROMO_CARD_PROMO_TAP", (payload) => {
    betOpportunityPromoCardTapResolver(payload, sendEvent);
  });
  onAll(
    ["@@TRACKING/ADDED_SELECTION_FINISHED", "@@UI/SELECTION_PROMO_CARD_PROMO_TAP_BANNER_TAGGING_FINISHED"],
    (_, action) => {
      emit("@@UI/SELECTION_PROMO_CARD_PROMO_TAP_NAV", action);
    },
  );
  subscribeEvent("@@UI/SELECTION_PROMO_CARD_PROMO_TAP", (payload) => {
    selectionPromoCardTapResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/EDITORIAL_PROMO_CARD_TERMS_AND_CONDITIONS_TAP", (payload) => {
    editorialPromoCardTermsAndConditionsTapResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/BET_OPPORTUNITY_PROMO_CARD_TERMS_AND_CONDITIONS_TAP", (payload) => {
    betOpportunityPromoCardTermsAndConditionsTapResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/LOTTO_CARD_PEBBLE_CLICK", (payload) => {
    lottoPebbleClickTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/LOTTO_LUCKY_DIP_REFRESH_BUTTON", (payload) => {
    lottoLuckyDipRefreshButtonTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/LOTTO_LUCKY_DIP_CLEAR_ALL", (payload) => {
    lottoLuckyDipClearAllTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/LOTTO_LUCKY_DIP_NUMBERS", (payload) => {
    lottoLuckyDipNumbersTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/LOTTO_CARD_DRAWS_SELECTED", (payload) => {
    lottoDrawsSelectedTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@BETSLIP/ADD_LOTTERIES_TO_BETSLIP", (payload) => {
    lottoAddToBetslipTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("UI__NAVIGATE_XSELL", (payload) => {
    xSellBarItemClickAction(payload, sendEvent);
  });
  subscribeEvent("@@UI/STATS_PLAYERS_SEASON_STATS_PLAYER_CLICK", (payload) => {
    navigateToPlayerPageResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/STATS_TEAMS_CARD_EXPAND_ICON_CHANGED", (payload) => {
    statsTeamsCardExpandableButtonTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PN_INTERACTION_RACE", (payload) => {
    pnInteractionRaceTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_TAP", (payload) => {
    promotionsHubCardTapResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_CTA_TAP", (payload) => {
    promotionsHubCardCTATapResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_OPT_IN_TAP", (payload) => {
    promotionsHubCardOptInTapResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_GROUP_LOADED", (payload) => {
    promotionsHubCardGroupLoadedResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_GROUP_PEBBLE_LIST_DISPLAYED", (payload) => {
    promotionsHubCardGroupPebbleListDisplayedResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PROMOTIONS_HUB_CARD_GROUP_PEBBLE_CLICK", (payload) => {
    promotionsHubCardGroupPebbleListClickResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/STATS_LINEUPS_CARD_CHANGE_VIEW", (payload) => {
    statsLineupsOnChangeViewTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PENALTY_TAKERS_CARD_VISIBILITY_CHANGED", (payload) => {
    penaltyTakersCardVisibilityTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PENALTY_TAKERS_CARD_SLIDE_CHANGE", (payload) => {
    penaltyTakersCardPlayerSwipeTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/PENALTY_TAKERS_CARD_SEGMENT_CHANGE", (payload) => {
    penaltyTakersCardSegmentChangeTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/UPSELL_SUGGESTIONS_ITEM_CLICK", (payload) => {
    upsellSuggestionsItemClickTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/POPULAR_SELECTIONS_PROMO_BANNER_TAP", (payload) => {
    popularSelectionsPromoBannerTapTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/POPULAR_SELECTIONS_SWIPE_LEFT", (payload) => {
    popularSelectionsSwipeLeftTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/POPULAR_SELECTIONS_SWIPE_RIGHT", (payload) => {
    popularSelectionsSwipeRightTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/POPULAR_SELECTIONS_SKIPPED", (payload) => {
    popularSelectionsSkippedTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/POPULAR_SELECTIONS_GO_TO_BETSLIP_TAP", (payload) => {
    popularSelectionsGoToBetslipTapTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/POPULAR_SELECTIONS_MODAL_CLOSED", (payload) => {
    popularSelectionsModalClosedTrackingResolver(payload, sendEvent);
  });
  subscribeEvent("@@UI/UPSELL_SUGGESTIONS_LOADED", () => {
    upsellSuggestionsLoadedTrackingResolver(sendEvent);
  });
};

export default register;
