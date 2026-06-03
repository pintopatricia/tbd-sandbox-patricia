import {
  buildPlacedBetEvent,
  buildPlacedBetSelectionEvent,
  PlacedBetEvent,
  PlacedBetSelectionEvent,
} from "tagging-library";
import { BET_TYPES } from "@ppb/betslip-core";
import { getUserDetails } from "../../state/entities/user-details/user-details-selectors";
import {
  PlaceExchangeBetSuccessAction,
  PlaceObbBetSuccessAction,
  PlaceSportsbookBetSuccessAction,
  UpdateExchangeBetSuccessAction,
} from "../../actions/betslip";
import { ApplicationState, Product, UserDetails } from "../../state";
import { BetDirection, YesNo } from "../../state/tagging/AnalyticsConstants";
import {
  getBetMetrics,
  getBetResponseFromReport,
  getExchangeRunnerMetrics,
  getModuleData,
  getSportsbookRunnerMetrics,
  getVirtualRunnerMetrics,
} from "./helpers";
import { getRunnerUniqueTaggingId } from "../../helpers/betting";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import { createObbLegByIdSelector } from "../../state/entities/obb-legs/obb-legs-selector";
import { obbTemplateIds } from "../../helpers/obb-betting";

export const getExchangeSuccessPlaceBetEvents = (
  action: PlaceExchangeBetSuccessAction,
  state: ApplicationState,
): (PlacedBetEvent | PlacedBetSelectionEvent)[] | null => {
  const { betId, report } = action.payload;
  if (!betId || !report) return null;

  const { matched, unmatched } = report;
  const price = matched?.price || unmatched?.price;
  const size = matched?.size || unmatched?.size;

  const { currencyCode } = <UserDetails>getUserDetails(state);
  const events: (PlacedBetEvent | PlacedBetSelectionEvent)[] = [];

  // PlacedBet Event
  events.push(
    buildPlacedBetEvent({
      price: price?.toString() || "null",
      betType: "null",
      transactionId: "null",
      currency: currencyCode,
      betDirection: report.side,
      betId,
      totalStake: size || 0,
      eachWayIndicator: YesNo.No,
      module: "betslip",
      bettingProduct: Product.Exchange,
      numberOfLegs: 1,
      selectionsNumber: 1,
      numberOfLines: 1,
      numberOfPowerUps: 0,
      betTokenApplied: "null",
    }),
  );

  // PlacedBetSelection Event
  const runnerMetrics = getExchangeRunnerMetrics(state, report.runner);
  if (!runnerMetrics) return events;

  const betResponse = getBetResponseFromReport(report);
  const betDirection = report.side;
  // hard-coded for now since we don't have this indicator
  const eachwayIndicator = YesNo.No;
  const uniqueId = getRunnerUniqueTaggingId(state, report.runner);

  events.push(
    buildPlacedBetSelectionEvent({
      selectionId: runnerMetrics.selection_id.toString(),
      selection: runnerMetrics.selection,
      marketId: runnerMetrics.market_id,
      market: runnerMetrics.market_name,
      sport: runnerMetrics.sport_name,
      sportId: runnerMetrics.sport_id.toString(),
      competition: runnerMetrics.competition_name,
      competitionId: runnerMetrics.competition_id.toString(),
      totalStake: size || 0,
      betType: BET_TYPES.SINGLE,
      selectionsNumber: 1,
      inPlayIndicator: runnerMetrics.in_play_indicator,
      transactionId: "null",
      currency: currencyCode,
      betDirection,
      priceAtSelection: price?.toString() || "null",
      eventName: runnerMetrics.event_name,
      eventId: runnerMetrics.event_id.toString(),
      betId,
      antepostFlag: runnerMetrics.antepost_flag,
      betTokenApplied: "null",
      eachWayIndicator: eachwayIndicator,
      cashoutIndicator: "null",
      module: "betslip",
      betSource: "null",
      betOriginLocation: "null",
      betResponse,
      betIdentifier: uniqueId || "null",
      bettingProduct: Product.Exchange,
      numberOfLegs: 0,
      numberOfLines: 0,
      numberOfPowerUps: 0,
    }),
  );

  return events;
};

export const getExchangeBetEditSuccessfullEvents = (
  action: UpdateExchangeBetSuccessAction,
  state: ApplicationState,
): (PlacedBetEvent | PlacedBetSelectionEvent)[] | null => {
  const { report, betOriginURL } = action.payload;
  if (!report || !betOriginURL) return null;

  const betMetrics = getBetMetrics(state, betOriginURL);
  if (!betMetrics) return null;

  const { matched, unmatched, priceAtSelection } = report;
  const betId = matched?.betId || unmatched?.betId;
  const price = matched?.price || unmatched?.price;
  const size = matched?.size || unmatched?.size;
  if (!betId || !price || !size || !priceAtSelection) return null;

  const events: (PlacedBetEvent | PlacedBetSelectionEvent)[] = [];

  // PlacedBet Event
  events.push(
    buildPlacedBetEvent({
      price: price.toString() || "null",
      betType: "null",
      transactionId: "null",
      currency: betMetrics.currency,
      betDirection: betMetrics.betDirection,
      betId,
      totalStake: size,
      eachWayIndicator: YesNo.No,
      module: "betslip - update bet",
      bettingProduct: Product.Exchange,
      numberOfLegs: 1,
      selectionsNumber: 1,
      numberOfLines: 1,
      numberOfPowerUps: 0,
      betTokenApplied: "null",
    }),
  );

  // PlacedBetSelection Event
  const { currencyCode } = <UserDetails>getUserDetails(state);
  const runnerMetrics = getExchangeRunnerMetrics(state, report.runner);
  if (!runnerMetrics) return events;

  const betResponse = getBetResponseFromReport(report);
  const betDirection = report.side;
  // hard-coded for now since we don't have this indicator
  const eachWayIndicator = YesNo.No;
  const uniqueId = getRunnerUniqueTaggingId(state, report.runner);

  events.push(
    buildPlacedBetSelectionEvent({
      selectionId: runnerMetrics.selection_id.toString(),
      selection: runnerMetrics.selection,
      marketId: runnerMetrics.market_id,
      market: runnerMetrics.market_name,
      sport: runnerMetrics.sport_name,
      sportId: runnerMetrics.sport_id.toString(),
      competition: runnerMetrics.competition_name,
      competitionId: runnerMetrics.competition_id.toString(),
      totalStake: size,
      betType: BET_TYPES.SINGLE,
      selectionsNumber: 1,
      inPlayIndicator: runnerMetrics.in_play_indicator,
      transactionId: "null",
      currency: currencyCode,
      betDirection,
      priceAtSelection: price?.toString() || "null",
      eventName: runnerMetrics.event_name,
      eventId: runnerMetrics.event_id.toString(),
      betId,
      antepostFlag: runnerMetrics.antepost_flag,
      betTokenApplied: "null",
      eachWayIndicator,
      cashoutIndicator: "null",
      module: "betslip - update bet",
      betSource: "null",
      betOriginLocation: "null",
      betResponse,
      betIdentifier: uniqueId || "null",
      bettingProduct: Product.Exchange,
      numberOfLegs: 0,
      numberOfLines: 0,
      numberOfPowerUps: 0,
    }),
  );

  return events;
};

export const getSportsbookSuccessPlaceBetsEvents = (
  action: PlaceSportsbookBetSuccessAction,
  state: ApplicationState,
): (PlacedBetEvent | PlacedBetSelectionEvent)[] => {
  const events: (PlacedBetEvent | PlacedBetSelectionEvent)[] = [];
  const userDetails = <UserDetails>getUserDetails(state);
  const { currencyCode } = userDetails;
  const {
    result: { combinations, legs },
    metadata,
  } = action.payload.report;

  for (const combination of Object.values(combinations)) {
    let betTokenApplied = "null";

    if (combination.isPriceBoosted) {
      betTokenApplied = "price boosted";
    } else if (combination.wallets?.some(({ type }) => type === "BONUS_CASH")) {
      betTokenApplied = "freebet";
    }

    // PlacedBet Events
    events.push(
      buildPlacedBetEvent({
        price: combination.displayOdds?.decimalOdds.toString() || "null",
        betType: combination.betType,
        transactionId: combination.betReceiptId,
        currency: currencyCode,
        betDirection: BetDirection.Back,
        betId: combination.betId.toString(),
        totalStake: combination.totalStake,
        eachWayIndicator: YesNo.No,
        module: "betslip",
        bettingProduct: Product.Sportsbook,
        numberOfLegs: combination.legs.length,
        selectionsNumber: combination.legs.flatMap((legKey) => legs[legKey]?.runners || []).length,
        numberOfLines: combination.lines,
        numberOfPowerUps: 0,
        betTokenApplied,
      }),
    );

    // PlacedBetSelection Events
    combination.legs.forEach((legId) => {
      const leg = legs[legId];

      leg.runners.forEach((runnerId) => {
        const { runnerUrn, bettingGroup } = metadata[runnerId];
        const runnerMetrics =
          bettingGroup === "REAL"
            ? getSportsbookRunnerMetrics(state, runnerUrn)
            : getVirtualRunnerMetrics(state, runnerUrn);
        if (!runnerMetrics) return;

        const uniqueId = getRunnerUniqueTaggingId(state, runnerUrn);

        events.push(
          buildPlacedBetSelectionEvent({
            selectionId: runnerMetrics.selection_id.toString(),
            selection: runnerMetrics.selection,
            marketId: runnerMetrics.market_id,
            market: runnerMetrics.market_name,
            sport: runnerMetrics.sport_name,
            sportId: runnerMetrics.sport_id.toString(),
            competition: runnerMetrics.competition_name || "null",
            competitionId: runnerMetrics?.competition_id?.toString() || "null",
            totalStake: combination.totalStake,
            betType: combination.betType,
            inPlayIndicator: runnerMetrics.in_play_indicator,
            transactionId: combination.betReceiptId,
            currency: currencyCode,
            betDirection: BetDirection.Back,
            priceAtSelection: leg.displayOdds?.decimalOdds.toString() || "null",
            eventName: runnerMetrics.event_name,
            eventId: runnerMetrics.event_id.toString(),
            betId: combination.betId.toString(),
            antepostFlag: runnerMetrics.antepost_flag,
            betTokenApplied,
            eachWayIndicator: YesNo.No,
            cashoutIndicator: "null",
            module: "betslip",
            betSource: "null",
            betOriginLocation: "null",
            betResponse: "matched",
            betIdentifier: uniqueId || "null",
            bettingProduct: Product.Sportsbook,
            selectionsNumber: combination.legs.length,
            numberOfLegs: combination.legs.length,
            numberOfLines: combination.lines,
            numberOfPowerUps: 0,
          }),
        );
      });
    });
  }

  return events;
};

const getViewTypeSelector = createViewTypeSelector();

export const getObbPlaceBetSuccessEvent = (
  action: PlaceObbBetSuccessAction,
  state: ApplicationState,
): (PlacedBetEvent | PlacedBetSelectionEvent)[] => {
  const events: (PlacedBetEvent | PlacedBetSelectionEvent)[] = [];
  const { currencyCode } = getUserDetails(state) as UserDetails;
  const getObbLegById = createObbLegByIdSelector();

  const { bets } = action.payload;
  if (!state.betslip) return events;

  const { obbTaggingMetadata } = state.betslip;

  for (const bet of Object.values(bets)) {
    const betType = bet.numberOfBaseBets > 1 ? "MULTIPLE" : bet.betType;

    events.push(
      buildPlacedBetEvent({
        price: bet.price.decimal.toString() || "null",
        betType,
        transactionId: bet.receiptId,
        currency: currencyCode,
        betDirection: BetDirection.Back,
        betId: bet.betId.toString(),
        totalStake: bet.stake,
        eachWayIndicator: YesNo.No,
        module: "betslip",
        bettingProduct: Product.Sportsbook,
        numberOfLegs: bet.legs.length,
        selectionsNumber: bet.numberOfBaseBets,
        numberOfLines: 1,
        numberOfPowerUps: 0,
        betTokenApplied: "null",
      }),
    );

    bet.legs.forEach((leg) => {
      const { legId } = leg;
      if (!legId) return;

      const stateLeg = getObbLegById(state, legId);

      let obbLegTemplateId: string = "null";

      if (stateLeg) {
        obbLegTemplateId = obbTemplateIds[stateLeg.templateId];
      }

      const obbLegTaggingMetadata = obbTaggingMetadata[legId];
      const uniqueId = obbLegTaggingMetadata?.uniqueId;

      let sportId = obbLegTaggingMetadata?.sportId?.toString();
      let sportName = obbLegTaggingMetadata?.sport;
      let obbBettingLegsQuotes = leg.price.decimal.toString();
      let eventNameDescription = leg.event.name;
      let eventIdDescription = obbLegTaggingMetadata?.eventId?.toString();
      let competitionIdDescription = obbLegTaggingMetadata?.competitionId?.toString();
      let competitionNameDescription = obbLegTaggingMetadata?.competition;
      let layout = obbLegTaggingMetadata?.layout;
      let tabName = obbLegTaggingMetadata?.tabName;

      const pageType = getViewTypeSelector(state);
      const swimlaneType = "null";

      if (bet.numberOfBaseBets > 1) {
        obbBettingLegsQuotes = leg.metadata.obbBettingLegsQuotes || "null";
        eventNameDescription = leg.metadata.eventsNames || "null";
        eventIdDescription = leg.metadata.eventsIds || "null";
        competitionIdDescription = leg.metadata.competitionIds || "null";
        competitionNameDescription = leg.metadata.competitionNames || "null";
        sportId = leg.metadata.sportsIds || "null";
        sportName = leg.metadata.sportsNames || "null";
        layout = leg.metadata.layout || "null";
        tabName = leg.metadata.tabName || "null";
      }

      const module = getModuleData(
        pageType,
        swimlaneType,
        `${obbLegTaggingMetadata?.group || ""} ${layout || ""}`,
        obbLegTemplateId,
        tabName,
      );

      events.push(
        buildPlacedBetSelectionEvent({
          sport: sportName ?? "null",
          sportId: sportId || "null",
          competition: competitionNameDescription || "null",
          competitionId: competitionIdDescription || "null",
          betType,
          inPlayIndicator: YesNo.No,
          currency: currencyCode,
          betDirection: BetDirection.Back,
          priceAtSelection: obbBettingLegsQuotes || "null",
          eventName: eventNameDescription || "null",
          eventId: eventIdDescription || "null",
          antepostFlag: YesNo.No,
          totalStake: state.betting.obbBetting.totalStake ?? bet.stake,
          eachWayIndicator: YesNo.No,
          module: "betslip",
          betSource: module,
          selectionId: "null",
          selection: `${leg.metadata.legDescription}`,
          marketId: "null",
          selectionsNumber: bet.numberOfBaseBets,
          transactionId: bet.receiptId,
          betTokenApplied: "null",
          cashoutIndicator: "null",
          betResponse: "matched",
          betOriginLocation: state.router.currentUrl ?? "null",
          bettingProduct: Product.Sportsbook,
          betIdentifier: uniqueId ?? "null",
          numberOfLegs: bet.legs.length,
          numberOfLines: 1,
          market: `${leg.metadata.legTypeDescription}`,
          numberOfPowerUps: 0,
          betId: bet.betId,
        }),
      );
    });
  }

  return events;
};
