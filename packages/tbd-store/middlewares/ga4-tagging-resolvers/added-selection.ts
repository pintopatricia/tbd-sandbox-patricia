import { AddedSelectionEvent, buildAddedSelectionEvent } from "tagging-library";

import { generateRunnerId } from "@ppb/betslip-core";
import { BetslipBetBuilderAddSelectionsAction } from "../../actions/betslip";
import {
  BettingObbToggleLegAction,
  BettingObbToggleMultipleLegAction,
  BettingSportsbookAddSelectionTaggingAction,
  MarketExchangeBetButtonClickAction,
} from "../../actions/betting";
import { ApplicationState, isOnlineUserDetails, Product, UserDetails } from "../../state";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import { createBettableCardByURNSelector, createCardByURNSelector } from "../../state/layout/cards/cards-selectors";

import {
  PackagedCreatedBetsCards,
  PopularMultiplesBetBuilderCards,
  PriceBoostMultisListCards,
} from "../../state/layout/cards/Card.types";
import URN from "../../state/layout/URN";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import { getBetslipExchangeContext } from "../../state/betslip/betslip-card-selectors";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { getBettingResolvers } from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import {
  getExchangeRunnerMetrics,
  getModuleData,
  getSportsbookRunnerMetrics,
  getVirtualRunnerMetrics,
} from "./helpers";
import { getLayoutMetadata } from "../../state/layout-snapshot";
import { createObbLegByIdSelector } from "../../state/entities/obb-legs/obb-legs-selector";
import { addLeg, clearPlaceFailures, obbTemplateIds, removeLeg } from "../../helpers/obb-betting";
import { ObbQuoteSuccess } from "../../state/entities/obb-legs/ObbLegs.types";
import { isSingleLegInState } from "../../helpers/sportsbook-betting";
import { getEventRegistry } from "eventemitter3-singleton";

const getPopularMultiplesBetBuilderCardByURN = createCardByURNSelector<PopularMultiplesBetBuilderCards, URN>();
const getPackagedCreatedBetsCardByURN = createCardByURNSelector<PackagedCreatedBetsCards, URN>();
const getPriceBoostMultisListCardByURN = createCardByURNSelector<PriceBoostMultisListCards, URN>();
const getViewTypeSelector = createViewTypeSelector();
const getBettableCardByURN = createBettableCardByURNSelector();

export const getBetslipBetBuilderAddSelections = (
  action: BetslipBetBuilderAddSelectionsAction,
  state: ApplicationState,
): AddedSelectionEvent | null => {
  const { cardUrn, selection, odds, cardMetadata } = action.payload;
  const metadata = getLayoutMetadata(cardUrn);

  const userDetails = <UserDetails>getUserDetails(state);
  const { currencyCode } = userDetails;

  const popularMultiplesBetBuilderCard = getPopularMultiplesBetBuilderCardByURN(
    state.layouts.cards.popularmultiplesbetbuilders,
    cardUrn,
  );
  const packagedCreatedBetsCard = getPackagedCreatedBetsCardByURN(state.layouts.cards.packagedcreatedbets, cardUrn);
  const priceboostmultislistcard = getPriceBoostMultisListCardByURN(
    state.layouts.cards.priceboostmultislistcards,
    cardUrn,
  );
  const cardTitle =
    popularMultiplesBetBuilderCard?.title ??
    packagedCreatedBetsCard?.displayName?.name ??
    priceboostmultislistcard?.displayName?.name ??
    cardMetadata?.title ??
    null;

  const pageType = getViewTypeSelector(state);

  const { verticalPosition, cardGroupTitle, tabName } = metadata;
  const horizontalPosition = metadata.horizontalPosition ?? cardMetadata?.horizontalPosition;

  const runnerMetrics = getSportsbookRunnerMetrics(state, selection.runnerUrn);
  if (!runnerMetrics) {
    return null;
  }
  const marketName = runnerMetrics.market_name;

  return buildAddedSelectionEvent({
    selectionId: runnerMetrics.selection_id.toString(),
    selection: runnerMetrics.selection,
    marketId: runnerMetrics.market_id,
    sport: runnerMetrics.sport_name,
    competition: runnerMetrics.competition_name || "null",
    market: runnerMetrics.market_name,
    sportId: runnerMetrics.sport_id.toString(),
    competitionId: runnerMetrics.competition_id?.toString() || "null",
    priceAtSelection: odds?.decimal?.toString() || "null",
    module: `${pageType} - primary swimlane - ${
      cardGroupTitle ? `${cardGroupTitle} | ${cardTitle}` : cardTitle
    } - ${marketName} - ${tabName}`,
    eventName: runnerMetrics.event_name,
    eventId: runnerMetrics.event_id.toString(),
    betDirection: "back",
    betIdentifier: selection.uniqueId || "null",
    position: horizontalPosition?.toString() || "null",
    moduleDisplayOrder: verticalPosition?.toString() || "null",
    inPlayIndicator: runnerMetrics.in_play_indicator,
    antepostFlag: runnerMetrics.antepost_flag,
    currency: currencyCode,
    bettingProduct: Product.Sportsbook,
  });
};

export const getExchangeAddSelectionToBetslip = (
  action: MarketExchangeBetButtonClickAction,
  state: ApplicationState,
): AddedSelectionEvent | null => {
  const { urn: runnerUrn, price, side, cardUrn, uniqueId } = action.payload;

  const metadata = getLayoutMetadata(cardUrn);
  const { currencyCode } = <UserDetails>getUserDetails(state);

  const {
    layouts: { views },
    router,
  } = state;

  const betslipContext = getBetslipExchangeContext(state);

  if (betslipContext && betslipContext.runner === runnerUrn && betslipContext.side === side) {
    // removing the bet
    return null;
  }

  const viewUrn = router.currentUrn;
  if (!viewUrn) {
    return null;
  }

  const view = getViewbyURN(views, viewUrn);
  if (!view) {
    return null;
  }

  const card = getBettableCardByURN(state.layouts.cards, cardUrn);
  if (!card) {
    return null;
  }

  const runnerMetrics = getExchangeRunnerMetrics(state, runnerUrn);
  if (!runnerMetrics) return null;

  const pageType = getViewTypeSelector(state);

  const cardType = card.typename === "HighlightedSelectionCard" ? "secondary swimlane" : "primary swimlane";

  const { horizontalPosition, verticalPosition, tabName, cardGroupTitle } = metadata;

  const module = `${pageType} - ${cardType} - ${cardGroupTitle} - ${runnerMetrics.market_name} - ${tabName}`;

  return buildAddedSelectionEvent({
    selectionId: runnerMetrics.selection_id.toString(),
    selection: runnerMetrics.selection,
    marketId: runnerMetrics.market_id,
    sport: runnerMetrics.sport_name,
    competition: runnerMetrics.competition_name,
    market: runnerMetrics.market_name,
    sportId: runnerMetrics.sport_id.toString(),
    competitionId: runnerMetrics.competition_id.toString(),
    priceAtSelection: price?.toString() || "null",
    module,
    eventName: runnerMetrics.event_name,
    eventId: runnerMetrics.event_id.toString(),
    betDirection: "back",
    betIdentifier: uniqueId || "null",
    position: horizontalPosition?.toString() || "null",
    moduleDisplayOrder: verticalPosition?.toString() || "null",
    inPlayIndicator: runnerMetrics.in_play_indicator,
    antepostFlag: runnerMetrics.antepost_flag,
    currency: currencyCode,
    bettingProduct: Product.Exchange,
  });
};

export const getSportsbookAddSelectionToBetslip = (
  action: BettingSportsbookAddSelectionTaggingAction,
  state: ApplicationState,
): AddedSelectionEvent | null => {
  const {
    betting: { sportsbookBetting },
    entities,
    layouts,
  } = state;
  const { urn: runnerUrn, cardUrn, deeplink, group, uniqueId, cardMetadata } = action.payload;
  const { currencyCode } = <UserDetails>getUserDetails(state);
  const { emit } = getEventRegistry();
  const runnerIds = getBettingResolvers(group).getMarketRunnerIdAssociation(entities, runnerUrn);

  if (!runnerIds) {
    return null;
  }

  const runnerTuple = [generateRunnerId(runnerIds)];

  if (isSingleLegInState(sportsbookBetting, runnerTuple)) {
    // removing the bet
    emit("@@TRACKING/ADDED_SELECTION_FINISHED", {});
    return null;
  }

  const runnerMetrics =
    group === "VIRTUAL" ? getVirtualRunnerMetrics(state, runnerUrn) : getSportsbookRunnerMetrics(state, runnerUrn);

  if (!runnerMetrics) {
    return null;
  }

  let module;
  let metadata;
  const pageType = getViewTypeSelector(state);
  if (deeplink) {
    module = deeplink.isBetSharing ? "bet sharing" : "deeplink";
  } else {
    const card = getBettableCardByURN(layouts.cards, cardUrn);
    metadata = getLayoutMetadata(cardUrn);

    if (metadata.horizontalPosition == null && cardMetadata?.horizontalPosition != null) {
      metadata = { ...metadata, horizontalPosition: cardMetadata.horizontalPosition };
    }

    emit("@@TRACKING/ADDED_SELECTION_FINISHED", {});

    const { cardGroupTitle, tabName } = metadata;
    const resolvedCard = card ?? cardMetadata;

    if (!resolvedCard) {
      const module_name = `${pageType} - primary swimlane - ${cardGroupTitle || runnerMetrics.selection} - ${
        runnerMetrics.market_name
      }`;

      return buildAddedSelectionEvent({
        module: module_name,
        bettingProduct: Product.Sportsbook,
        betDirection: "back",
        betIdentifier: uniqueId || "null",
        currency: currencyCode,
        position: metadata?.horizontalPosition?.toString() || "null",
        moduleDisplayOrder: metadata?.verticalPosition?.toString() || "null",
        sportId: runnerMetrics.sport_id.toString(),
        sport: runnerMetrics.sport_name,
        competitionId: runnerMetrics.competition_id?.toString() || "null",
        competition: runnerMetrics.competition_name || "null",
        eventId: runnerMetrics.event_id.toString(),
        eventName: runnerMetrics.event_name,
        marketId: runnerMetrics.market_id,
        market: runnerMetrics.market_name,
        selectionId: runnerMetrics.selection_id.toString(),
        selection: runnerMetrics.selection,
        priceAtSelection: runnerMetrics.price_at_selection?.toString() || "null",
        inPlayIndicator: runnerMetrics.in_play_indicator,
        antepostFlag: runnerMetrics.antepost_flag,
      });
    }

    const cardType = resolvedCard.typename === "HighlightedSelectionCard" ? "secondary swimlane" : "primary swimlane";

    const cardMetadataTitle = !card && cardMetadata?.title ? cardMetadata.title : null;

    module =
      resolvedCard.typename === "MatchStatSelectionCard"
        ? `${pageType} - ${cardType} - ${cardGroupTitle || null} - obp`
        : `${pageType} - ${cardType} - ${cardGroupTitle || cardMetadataTitle || null} - ${runnerMetrics.market_name}${
            tabName ? ` - ${tabName}` : ""
          }`;
  }

  return buildAddedSelectionEvent({
    module,
    bettingProduct: Product.Sportsbook,
    betDirection: "back",
    betIdentifier: uniqueId || "null",
    currency: currencyCode,
    position: metadata?.horizontalPosition?.toString() || "null",
    moduleDisplayOrder: metadata?.verticalPosition?.toString() || "null",
    sportId: runnerMetrics.sport_id.toString(),
    sport: runnerMetrics.sport_name,
    competitionId: runnerMetrics.competition_id?.toString() || "null",
    competition: runnerMetrics.competition_name || "null",
    eventId: runnerMetrics.event_id.toString(),
    eventName: runnerMetrics.event_name,
    marketId: runnerMetrics.market_id,
    market: runnerMetrics.market_name,
    selectionId: runnerMetrics.selection_id.toString(),
    selection: runnerMetrics.selection,
    priceAtSelection: runnerMetrics.price_at_selection?.toString() || "null",
    inPlayIndicator: runnerMetrics.in_play_indicator,
    antepostFlag: runnerMetrics.antepost_flag,
  });
};

export const getObbToggleLegEvent = (
  action: BettingObbToggleLegAction,
  state: ApplicationState,
): AddedSelectionEvent | null => {
  const { legId, cardUrn, metadataOverride } = action.payload;

  const getObbLegById = createObbLegByIdSelector();
  const leg = getObbLegById(state, legId);

  if (!leg) return null;

  const resetStateWithEmptyFailures = clearPlaceFailures(state.betting.obbBetting);
  const isLegInState = !!resetStateWithEmptyFailures.legs[legId];

  if (isLegInState) return null; /// Don't send event when removing leg

  const newObbBettingState = isLegInState
    ? removeLeg(resetStateWithEmptyFailures, legId)
    : addLeg(resetStateWithEmptyFailures, leg);

  const legMetadata = newObbBettingState.legs[legId]?.metadata;

  const obbCardTitle = legMetadata?.legTypeDescription;
  const obbLegTemplateId = obbTemplateIds[leg.templateId];
  const simpleSelection = `${legMetadata?.participantsDescription} | ${legMetadata?.outcomeDescription}`;
  const selection = obbLegTemplateId ? `(${obbLegTemplateId}) ${simpleSelection}` : simpleSelection;

  const bettingProduct = state.betslip?.activeProduct ?? "sportsbook";
  const legEventUrn = leg?.event.urn;
  const eventName = legEventUrn ? state.entities.sportevents[legEventUrn]?.name : "";
  const eventId = legEventUrn ? String(state.entities.sportevents[legEventUrn]?.eventId) : "";

  const swimlaneType = metadataOverride?.swimlaneType || "null";
  const pageType = metadataOverride?.pageType || getViewTypeSelector(state);
  const metadata = cardUrn ? getLayoutMetadata(cardUrn) : null;

  const cardCategory =
    metadataOverride?.group ||
    (metadata?.cardGroupTitle || metadata?.cardLayoutTitle
      ? `${metadata?.cardGroupTitle || ""} ${metadata?.cardLayoutTitle || ""}`
      : obbCardTitle);

  const moduleName = metadataOverride?.card || metadata?.title || obbCardTitle;

  const moduleTabName = metadataOverride?.tab || metadata?.tabName;

  const module = getModuleData(pageType, swimlaneType, cardCategory, moduleName, moduleTabName);
  const competitionUrn = leg?.event.urn ? state.entities.sportevents[leg.event.urn]?.competition : "";
  const competitionName = competitionUrn ? state.entities.competitions[competitionUrn]?.name : "";
  const competitionId = competitionUrn ? String(state.entities.competitions[competitionUrn]?.competitionId) : "";

  const sportUrn = competitionUrn ? state.entities.competitions[competitionUrn]?.sport : "";
  const sport = state.entities.sports[sportUrn]?.name;
  const sportId = String(state.entities.sports[sportUrn]?.sportId);

  const currency = isOnlineUserDetails(state.entities.userdetails) ? state.entities.userdetails.currencyCode : "";
  const isQuotePriceSuccess = leg?.quote?.typename === "ObbQuoteSuccess";
  const price =
    isQuotePriceSuccess && leg.quote && (leg.quote as ObbQuoteSuccess).price
      ? String((leg.quote as ObbQuoteSuccess).price.decimal)
      : "null";

  const position = action.payload.position?.verticalPosition.toString() ?? "null";
  const moduleDisplayOrder = action.payload.position?.horizontalPosition.toString() ?? "null";

  return buildAddedSelectionEvent({
    antepostFlag: "no",
    betDirection: "back",
    sport,
    selection,
    sportId,
    eventName,
    eventId,
    competition: competitionName,
    currency,
    competitionId,
    selectionId: "null",
    marketId: "null",
    market: obbCardTitle,
    bettingProduct,
    priceAtSelection: price,
    module,
    inPlayIndicator: "no",
    position,
    moduleDisplayOrder,
    betIdentifier: legId,
  });
};

export const getObbToggleMultipleLegEvent = (
  action: BettingObbToggleMultipleLegAction,
  state: ApplicationState,
): AddedSelectionEvent[] => {
  const { legIds, cardUrn } = action.payload;

  const getObbLegById = createObbLegByIdSelector();

  return legIds.reduce<AddedSelectionEvent[]>((acc, legId) => {
    const leg = getObbLegById(state, legId);

    if (!leg) return acc;

    const resetStateWithEmptyFailures = clearPlaceFailures(state.betting.obbBetting);

    const obbLegTemplateId = obbTemplateIds[leg.templateId] ?? "null";

    const isLegInState = !!resetStateWithEmptyFailures.legs[legId];

    if (isLegInState) return acc;

    const newObbBettingState = isLegInState
      ? removeLeg(resetStateWithEmptyFailures, legId)
      : addLeg(resetStateWithEmptyFailures, leg);

    const legMetadata = newObbBettingState.legs[legId]?.metadata;

    const obbCardTitle = legMetadata?.legTypeDescription;
    const selection = `(${obbLegTemplateId}) ${legMetadata?.participantsDescription} | ${legMetadata?.outcomeDescription}`;

    const bettingProduct = state.betslip?.activeProduct ?? "sportsbook";

    const pageType = getViewTypeSelector(state);
    const legEventUrn = leg?.event.urn;
    const eventName = legEventUrn ? state.entities.sportevents[legEventUrn]?.name : "";
    const eventId = legEventUrn ? String(state.entities.sportevents[legEventUrn]?.eventId) : "";
    const metadata = cardUrn ? getLayoutMetadata(cardUrn) : null;

    const cardCategory =
      metadata?.cardGroupTitle || metadata?.cardLayoutTitle
        ? `${metadata?.cardGroupTitle ?? ""} ${metadata?.cardLayoutTitle ?? ""}`
        : obbCardTitle;

    const swimlaneType = "null";
    const moduleName = "player picker";
    const tabName = "null";

    const module = getModuleData(pageType, swimlaneType, cardCategory, moduleName, tabName);
    const competitionUrn = leg?.event.urn ? state.entities.sportevents[leg.event.urn]?.competition : "";
    const competitionName = competitionUrn ? state.entities.competitions[competitionUrn]?.name : "";
    const competitionId = competitionUrn ? String(state.entities.competitions[competitionUrn]?.competitionId) : "";

    const sportUrn = competitionUrn ? state.entities.competitions[competitionUrn]?.sport : "";
    const sport = state.entities.sports[sportUrn]?.name;
    const sportId = String(state.entities.sports[sportUrn]?.sportId);

    const currency = isOnlineUserDetails(state.entities.userdetails) ? state.entities.userdetails.currencyCode : "";
    const isQuotePriceSuccess = leg?.quote?.typename === "ObbQuoteSuccess";
    const price =
      isQuotePriceSuccess && leg.quote && (leg.quote as ObbQuoteSuccess).price
        ? String((leg.quote as ObbQuoteSuccess).price.decimal)
        : "null";

    const position = action.payload.position?.verticalPosition.toString() ?? "null";
    const moduleDisplayOrder = action.payload.position?.horizontalPosition.toString() ?? "null";

    acc.push(
      buildAddedSelectionEvent({
        antepostFlag: "no",
        betDirection: "back",
        sport,
        selection,
        sportId,
        eventName,
        eventId,
        competition: competitionName,
        currency,
        competitionId,
        selectionId: "null",
        marketId: "null",
        market: obbCardTitle,
        bettingProduct,
        priceAtSelection: price,
        module,
        inPlayIndicator: "no",
        position,
        moduleDisplayOrder,
        betIdentifier: legId,
      }),
    );
    return acc;
  }, []);
};
