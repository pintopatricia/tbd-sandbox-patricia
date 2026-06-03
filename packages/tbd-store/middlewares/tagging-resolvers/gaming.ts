import {
  LaunchGame,
  LaunchGameFromGameInfo,
  LaunchGameFromPN,
  LoadPrizeMachine,
  LoadPlayNew,
  PlayNewClickToMoreInfoButtonAction,
  PlayNewClickToPlayNowButtonAction,
} from "../../state/tagging/Navigation.types";
import { LaunchGameFromWidget } from "../../actions/navigation";
import { TaggingAction, TaggingCategory, PlatformType } from "./AnalyticsConstants";
import { APPLICATION, BUSINESS, DEVICE } from "./AnalyticsDimensions";

export const loadPrizeMachine = (
  viewLink: string,
  itemVerticalPositionOnPage: number | undefined,
  hasJackpot: boolean,
  jackpotState: string,
  isPlus: string,
): LoadPrizeMachine => ({
  event: "ga_event",
  category: TaggingCategory.GAMING,
  action: TaggingAction.DISPLAYED,
  label: hasJackpot ? `prize machine -${isPlus} active jackpot - ${jackpotState}` : `prize machine${isPlus}`,
  [APPLICATION.MODULE]: "prize machine",
  [BUSINESS.GAME_NAME]: "prize pinball",
  [BUSINESS.GAME_ID]: "prize pinball",
  [BUSINESS.ERROR_CODE]: null,
  [BUSINESS.DESTINATION_URL]: viewLink,
  [BUSINESS.GAME_PROVIDER]: "ppb-internal",
  [DEVICE.POSITION]: null,
  [BUSINESS.GAME_STATE]: null,
  [BUSINESS.DECISION_MODEL_NAME]: null,
  [BUSINESS.DECISION_MODEL_VARIANT]: null,
  [BUSINESS.ZONE_DISPLAY_ORDER]: itemVerticalPositionOnPage ?? null,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: null,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: null,
  [BUSINESS.SEARCH_TEXT]: null,
});

export const loadPlayNew = (itemVerticalPositionOnPage: number | undefined, isStaticPromo: boolean): LoadPlayNew => ({
  event: "ga_event",
  category: TaggingCategory.GAMING,
  action: TaggingAction.DISPLAYED,
  label: isStaticPromo ? "spin until you win - hype building" : "spin until you win - active",
  [APPLICATION.MODULE]: "spin until you win",
  [BUSINESS.ZONE_DISPLAY_ORDER]: itemVerticalPositionOnPage ?? null,
});

export const getMoreInfoPlayNewClickEvent = (
  viewLink: string | undefined,
  itemVerticalPositionOnPage: number | undefined,
  isStaticPromo: boolean,
): PlayNewClickToMoreInfoButtonAction => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: isStaticPromo ? "terms & conditions - hype building state" : "terms & conditions - active state",
  [APPLICATION.MODULE]: "spin until you win",
  [BUSINESS.DESTINATION_URL]: viewLink,
  [BUSINESS.ZONE_DISPLAY_ORDER]: itemVerticalPositionOnPage ?? null,
});

export const getPlayNowPlayNewClickEvent = (
  viewLink: string | undefined,
  itemVerticalPositionOnPage: number | undefined,
): PlayNewClickToPlayNowButtonAction => ({
  event: "ga_event",
  category: TaggingCategory.NAVIGATION,
  action: TaggingAction.NAVIGATED_TO,
  label: "play now - active state",
  [APPLICATION.MODULE]: "spin until you win",
  [BUSINESS.DESTINATION_URL]: viewLink,
  [BUSINESS.ZONE_DISPLAY_ORDER]: itemVerticalPositionOnPage ?? null,
});

const buildLaunchGameEvent = (params: {
  moduleName: string;
  label?: string;
  gameName?: string;
  href?: string;
  gameProvider?: string;
  gameId?: string;
  platformType: PlatformType;
  gamePosition?: number;
  itemVerticalPositionOnPage?: number;
  swimlaneIndex?: number;
  itemPositionInSwimlane?: number;
}): LaunchGame => ({
  event: "ga_event",
  category: TaggingCategory.GAMING,
  action: TaggingAction.CLICKED_PLAY_NOW,
  label: params.label ?? params.gameName ?? "",
  [APPLICATION.MODULE]: params.moduleName,
  [BUSINESS.GAME_ID]: params.gameId ?? "",
  [BUSINESS.GAME_NAME]: params.gameName ?? "",
  [BUSINESS.GAME_PROVIDER]: params.gameProvider ?? "",
  [BUSINESS.GAME_STATE]: undefined,
  [DEVICE.POSITION]: params.gamePosition !== undefined ? params.gamePosition + 1 : undefined,
  [BUSINESS.DESTINATION_URL]: params.href ?? "",
  [BUSINESS.ZONE_DISPLAY_ORDER]: params.itemVerticalPositionOnPage,
  [BUSINESS.TRANS_IN_PLAY_INDICATOR]: params.swimlaneIndex,
  [BUSINESS.TRANS_CASHOUT_INDICATOR]: params.itemPositionInSwimlane,
  [BUSINESS.DATA_BRIDGE_PROJECT]: "rebuild",
  [BUSINESS.DATA_BRIDGE_PLATFORM]: params.platformType,
});

export const getGameTileClickEvent = (
  zoneTitle: string | undefined,
  label: string | undefined,
  gameName: string | undefined,
  href: string | undefined,
  gameProvider: string | undefined,
  gameId: string | undefined,
  gamePosition: number | undefined,
  itemVerticalPositionOnPage: number | undefined,
  swimlaneIndex: number | undefined,
  itemPositionInSwimlane: number | undefined,
  platformType: PlatformType,
): LaunchGame =>
  buildLaunchGameEvent({
    moduleName: zoneTitle ?? "",
    label,
    gameName,
    href,
    gameProvider,
    gameId,
    platformType,
    gamePosition,
    itemVerticalPositionOnPage,
    swimlaneIndex,
    itemPositionInSwimlane,
  });

export const getGameLaunchFromGameInfoEvent = (
  gameName: string | undefined,
  href: string | undefined,
  gameProvider: string | undefined,
  gameId: string | undefined,
  platformType: PlatformType,
): LaunchGameFromGameInfo =>
  buildLaunchGameEvent({
    moduleName: "game info cta",
    gameName,
    href,
    gameProvider,
    gameId,
    platformType,
    gamePosition: undefined,
    itemVerticalPositionOnPage: undefined,
    swimlaneIndex: undefined,
    itemPositionInSwimlane: undefined,
  });

export const getGameLaunchFromPNEvent = (
  gameName: string | undefined,
  href: string | undefined,
  gameProvider: string | undefined,
  gameId: string | undefined,
  platformType: PlatformType,
): LaunchGameFromPN =>
  buildLaunchGameEvent({
    moduleName: "push notification",
    gameName,
    href,
    gameProvider,
    gameId,
    platformType,
    gamePosition: undefined,
    itemVerticalPositionOnPage: undefined,
    swimlaneIndex: undefined,
    itemPositionInSwimlane: undefined,
  });

export const getGameLaunchFromWidgetEvent = (
  action: LaunchGameFromWidget,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  state: unknown,
): LaunchGame => {
  const { href, platformType } = action.payload;

  return buildLaunchGameEvent({
    moduleName: "x-sell enhancement - floating icon",
    gameName: undefined,
    href,
    gameProvider: undefined,
    gameId: undefined,
    platformType,
    gamePosition: 0,
    itemVerticalPositionOnPage: undefined,
    swimlaneIndex: undefined,
    itemPositionInSwimlane: undefined,
  });
};
