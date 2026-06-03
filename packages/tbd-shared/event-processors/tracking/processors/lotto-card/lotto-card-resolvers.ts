import { buildAddedSelectionEvent, buildInterfaceEvent } from "tagging-library";
import { formatDateWithOrdinal } from "@ppb/formatters";
import { LottoCardEvents } from "@ppb/tbd-components-sports-betting/components/LottoCard/viewmodel/events";
import { PEBBLES_IDS } from "@ppb/tbd-components-sports-betting/components/LottoCard/viewmodel/LottoCard.viewmodel";
import { getLayoutMetadata, Metadata } from "@ppb/tbd-store/state/layout-snapshot";
import { getStore } from "@ppb/tbd-store/create-store";
import { getSportsbookRunnerMetrics } from "@ppb/tbd-store/middlewares/ga4-tagging-resolvers/helpers";
import { ApplicationState, Product, UserDetails } from "@ppb/tbd-store";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { i18n } from "../../../../helpers/i18n";
import { getLottoCard } from "./LottoCard.graphql";

type ParamsType = {
  tabName?: string | undefined;
  pebbleName?: string;
  drawName?: string;
  drawDate?: string;
  currencyCode?: string | null;
  state: ApplicationState;
} & Metadata;

async function getLottoTrackingParams(payload: {
  cardUrn: string;
  pebbleId?: string;
  drawUrn?: string;
}): Promise<ParamsType | null> {
  const card = await getLottoCard(payload.cardUrn);

  if (!card) {
    return null;
  }

  let pebbleName;
  if (payload.pebbleId) {
    pebbleName = i18n({
      key: payload.pebbleId === PEBBLES_IDS.PICK_NUMBERS ? "I18N.LOTTERIES.PICK_NUMBERS" : "I18N.LOTTERIES.LUCKY_DIP",
    });
  }

  const state = getStore().getState();

  const userDetails = <UserDetails>getUserDetails(state);
  const { currencyCode } = userDetails;

  const translations = {
    other: i18n({ key: "I18N.LOTTERIES.DATE_ABBREVIATION_OTHER" }),
    first: i18n({ key: "I18N.LOTTERIES.DATE_ABBREVIATION_FIRST" }),
    second: i18n({ key: "I18N.LOTTERIES.DATE_ABBREVIATION_SECOND" }),
    third: i18n({ key: "I18N.LOTTERIES.DATE_ABBREVIATION_THIRD" }),
  };

  const metadata = getLayoutMetadata(payload.cardUrn);
  let drawName;
  let drawDate;
  if (payload.drawUrn) {
    const drawMarket = card.lottoMarkets?.find((market) => market.urn === payload.drawUrn);
    if (drawMarket?.hierarchy && "sportevent" in drawMarket.hierarchy) {
      drawName = drawMarket.hierarchy.sportevent.name;
      drawDate = formatDateWithOrdinal(
        drawMarket.hierarchy.sportevent.openDate,
        userDetails.localeCodeBcp47,
        userDetails.timezone,
        translations,
        true,
      );
    }
  }

  return {
    ...metadata,
    pebbleName,
    drawDate,
    drawName,
    currencyCode,
    state,
  };
}

export async function lottoPebbleClickTrackingResolver(
  payload: LottoCardEvents["@@UI/LOTTO_CARD_PEBBLE_CLICK"],
  sendEvent: (payload: any) => void,
) {
  if (!payload.cardUrn) {
    return;
  }

  const params = await getLottoTrackingParams(payload);
  if (!params) {
    return;
  }

  const event = buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `${params.pebbleName}`,
    module: `lotto - ${params.tabName} - pick ribbon`,
  });

  sendEvent(event);
}

export async function lottoLuckyDipRefreshButtonTrackingResolver(
  payload: LottoCardEvents["@@UI/LOTTO_LUCKY_DIP_REFRESH_BUTTON"],
  sendEvent: (payload: any) => void,
) {
  if (!payload.cardUrn) {
    return;
  }

  const params = await getLottoTrackingParams(payload);
  if (!params) {
    return;
  }

  const event = buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: "refresh",
    module: `lotto - ${params.tabName} - ${params.pebbleName}`,
  });

  sendEvent(event);
}

export async function lottoLuckyDipClearAllTrackingResolver(
  payload: LottoCardEvents["@@UI/LOTTO_LUCKY_DIP_CLEAR_ALL"],
  sendEvent: (payload: any) => void,
) {
  if (!payload.cardUrn) {
    return;
  }

  const params = await getLottoTrackingParams(payload);
  if (!params) {
    return;
  }

  const event = buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: "clear all",
    module: `lotto - ${params.tabName} - ${params.pebbleName}`,
  });

  sendEvent(event);
}

export async function lottoLuckyDipNumbersTrackingResolver(
  payload: LottoCardEvents["@@UI/LOTTO_LUCKY_DIP_NUMBERS"],
  sendEvent: (payload: any) => void,
) {
  if (!payload.cardUrn) {
    return;
  }

  const params = await getLottoTrackingParams(payload);
  if (!params) {
    return;
  }

  const event = buildInterfaceEvent({
    action: TaggingAction.CLICKED,
    elementText: `${payload.numbers} numbers`,
    module: `lotto - ${params.tabName} - ${params.pebbleName}`,
  });

  sendEvent(event);
}

export async function lottoDrawsSelectedTrackingResolver(
  payload: LottoCardEvents["@@UI/LOTTO_CARD_DRAWS_SELECTED"],
  sendEvent: (payload: any) => void,
) {
  if (!payload.cardUrn) {
    return;
  }

  const params = await getLottoTrackingParams(payload);
  if (!params) {
    return;
  }

  const event = buildInterfaceEvent({
    action: payload.added ? TaggingAction.ADDED : TaggingAction.REMOVED,
    elementText: `${params.drawName} - ${params.drawDate}`,
    module: `lotto - ${params.tabName} - select draws`,
  });

  sendEvent(event);
}

export async function lottoAddToBetslipTrackingResolver(
  payload: LottoCardEvents["@@BETSLIP/ADD_LOTTERIES_TO_BETSLIP"],
  sendEvent: (payload: any) => void,
) {
  if (!payload.cardUrn) {
    return;
  }

  const params = await getLottoTrackingParams(payload);
  if (!params) {
    return;
  }
  payload.runners.forEach((runner) => {
    const runnerMetrics = getSportsbookRunnerMetrics(params.state, runner.runnerURN, runner.runnerURN, true);

    if (runnerMetrics) {
      const event = buildAddedSelectionEvent({
        module: `${runnerMetrics.competition_name} - ${params.pebbleName}`,
        bettingProduct: Product.Sportsbook,
        betDirection: "back",
        betIdentifier: "null",
        currency: params.currencyCode || "null",
        position: params?.horizontalPosition?.toString() || "null",
        moduleDisplayOrder: params?.verticalPosition?.toString() || "null",
        sportId: runnerMetrics.sport_id?.toString() || "null",
        sport: runnerMetrics.sport_name || "null",
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

      sendEvent(event);
    }
  });
}
