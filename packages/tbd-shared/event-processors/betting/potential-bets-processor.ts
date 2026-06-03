import subscribeEvent, { once } from "../../event-broker/event-subscriber";
import {
  addBettingOpportunityToBetslip,
  addChatbotSelectionsToBetslip,
  dispatchMarketSportsbookBetButtonClickAction,
  mapSportsbookOdds,
  type Odds,
  prefetchSportsbookMarket,
  potentialBetResolver,
  getSingleSelectionPromoAdder,
  getSingleBetButtonAdder,
  getUpsellSelectionAdder,
  getPopularSelectionsCardBetButtonAdder,
  prefetchBatchSportsbookMarkets,
  getPopularSelectionsSwipeRightAdder,
  openBetslip,
} from "./resolvers/potential-bet-resolver";
import { addLotteriesBetToBetslip } from "./resolvers/lotteries-bets-resolver";
import { parseURN, sportsbookMarketCodec, sportsbookRunnerCodec } from "@ppb/tbd-urn-codecs";
import { addMonterosaSelectionsToBetslip } from "./resolvers/monterosa-bets-resolver";

const register = () => {
  subscribeEvent("@@UI/SELECTION_PROMO_CARD_PROMO_TAP", (payload) => {
    const addSingle = getSingleSelectionPromoAdder(payload.urn, payload.marketUrn, payload.runnerUrn, payload.odds);

    once("@@NETWORK/SBK_MARKETS_SUCCESS", () => addSingle());
  });
  subscribeEvent("@@UI/PRICE_BOOST_MULTIPLE_PROMO_CARD_PROMO_TAP", (payload) => {
    addBettingOpportunityToBetslip(
      payload.urn,
      payload.selections,
      payload.bettingOpportunityId,
      payload.bettingOpportunityType,
    );
  });
  subscribeEvent("@@BETSLIP/ADD_LOTTERIES_TO_BETSLIP", (payload) => {
    const { cardUrn, runners, markets } = payload;
    const selectionIds = runners.map((r: { selectionId: number }) => r.selectionId);

    addLotteriesBetToBetslip(
      cardUrn,
      markets,
      runners.map((r: { runnerURN: string }) => r.runnerURN),
      selectionIds,
    );
  });
  subscribeEvent("@@BETSLIP/ADD_MONTEROSA_TO_BETSLIP", (payload) => {
    const { cardUrn, selections } = payload;
    addMonterosaSelectionsToBetslip(cardUrn, selections);
  });
  subscribeEvent("@@BETSLIP/SBK_RUNNER_ADDED", (payload) => {
    potentialBetResolver(payload.marketId, payload.selectionId, "ADDED");
  });
  subscribeEvent("@@BETSLIP/SBK_RUNNER_REMOVED", (payload) => {
    potentialBetResolver(payload.marketId, payload.selectionId, "REMOVED");
  });
  subscribeEvent("@@UI/SPORTSBOOK_BET_BUTTON_TAP", (payload) => {
    const addSingleBetToBetslip = getSingleBetButtonAdder(
      payload.urn,
      (payload.odds as Odds | null) ?? null,
      payload.status,
    );
    addSingleBetToBetslip();
  });
  // Eagerly fetches market data when a bet button scrolls into view,
  // so odds are ready by the time the user taps.
  subscribeEvent("@@UI/SPORTSBOOK_BET_BUTTON_VISIBILITY_CHANGED", ({ visible, marketUrn }) => {
    if (visible) {
      prefetchSportsbookMarket(marketUrn);
    }
  });

  // The embedded SportsbookBetButton inside the chatbot suggestion already emits
  // @@UI/SPORTSBOOK_BET_BUTTON_TAP, which drives the betslip add via the handler above.
  // This subscriber only forwards chatbot-card attribution (cardUrn + horizontalPosition) to the
  // betting analytics middleware via UI__MARKET_SBK_BET_BUTTON_CLICK.
  subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_SINGLE_BET_SUGGESTION_TAP", (payload) => {
    const {
      cardUrn,
      metadata: { horizontalPosition },
    } = payload;
    dispatchMarketSportsbookBetButtonClickAction(payload.runnerUrn, cardUrn, mapSportsbookOdds(payload.odds as Odds), {
      cardUrn,
      typename: "SportsbookChatbotCard",
      title: "bets you can explore",
      horizontalPosition,
    });
  });

  subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_MULTIPLE_BET_SUGGESTION_TAP", (payload) => {
    const {
      cardUrn,
      metadata: { horizontalPosition },
    } = payload;

    payload.selections.forEach(({ marketUrn, runnerUrn }: { marketUrn: string; runnerUrn: string }) => {
      const marketId = sportsbookMarketCodec.decode(marketUrn);
      const runnerUrnParsed = parseURN(runnerUrn);
      const runner = runnerUrnParsed && sportsbookRunnerCodec.extract(runnerUrnParsed);

      if (!marketId || !runner?.selectionId) {
        return;
      }

      potentialBetResolver(marketId, runner.selectionId, "ADDED");
    });

    addChatbotSelectionsToBetslip(payload.selections, cardUrn, payload.odds as Odds, horizontalPosition);
  });

  subscribeEvent("@@UI/POPULAR_SELECTIONS_VISIBILITY_CHANGED", ({ visible, marketUrn }) => {
    if (visible) {
      prefetchSportsbookMarket(marketUrn);
    }
  });
  subscribeEvent("@@UI/POPULAR_SELECTIONS_BET_BUTTON_TAP", (payload) => {
    const addPopularSelectionsCardBetButton = getPopularSelectionsCardBetButtonAdder(
      payload.runnerUrn,
      payload.odds as Odds,
      payload.cardMetadata,
    );
    addPopularSelectionsCardBetButton();
  });
  subscribeEvent("@@UI/POPULAR_SELECTIONS_SWIPE_RIGHT", (payload) => {
    const addSwipeSelection = getPopularSelectionsSwipeRightAdder(
      payload.runnerUrn,
      payload.odds as Odds,
      payload.cardUrn,
      payload.status,
    );
    addSwipeSelection();
  });
  subscribeEvent("@@UI/POPULAR_SELECTIONS_CARD_VISIBILITY_CHANGED", ({ visible, urn }) => {
    if (visible) {
      prefetchSportsbookMarket(urn);
    }
  });

  subscribeEvent("@@UI/POPULAR_SELECTIONS_GO_TO_BETSLIP_TAP", () => {
    openBetslip();
  });
  subscribeEvent("@@UI/UPSELL_SUGGESTIONS_ITEM_CLICK", (payload) => {
    const toggleSelection = getUpsellSelectionAdder(payload.runnerUrn, payload.odds as Odds | null, payload.marketUrn);
    toggleSelection();
  });
  subscribeEvent("@@UI/PENALTY_TAKERS_CARD_RUNNER_TAP", (payload) => {
    const addSingleBetToBetslip = getSingleBetButtonAdder(
      payload.runnerURN,
      (payload.odds as Odds | null) ?? null,
      payload.status,
      payload.cardUrn,
    );
    addSingleBetToBetslip();
  });

  // Eagerly fetches market data when card scrolls into view,
  // so odds are ready by the time the user taps.
  subscribeEvent("@@UI/PENALTY_TAKERS_CARD_VISIBILITY_CHANGED", (payload) => {
    if (payload.visible) {
      prefetchBatchSportsbookMarkets(payload.marketUrns);
    }
  });
};

export default register;
