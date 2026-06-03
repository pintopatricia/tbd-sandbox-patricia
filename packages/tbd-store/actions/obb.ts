import { ObbGetEventParticipantsQuery, ObbQuote } from "../clients/catalogue/catalogue-response-types";
import { ObbModuleMetadataTemplate } from "../middlewares/ga4-tagging-resolvers/helpers";
import { TaggingAction } from "../middlewares/tagging-resolvers/AnalyticsConstants";
import { NormalizedObbLeg } from "../services/catalogue/normalizer/entities/obb-leg/ObbLeg.types";
import { ObbLeg, ObbLegTemplateId } from "../state/entities/obb-legs/ObbLegs.types";
import { ObbParticipants } from "../state/entities/obb-participants/ObbParticipants.types";
import URN from "../state/layout/URN";

export const OBB_LEG_QUOTES_UPDATE_STATE = "OBB_LEG_QUOTES/UPDATE_STATE";
export const NETWORK__FETCH_OBB_CARD_QUOTES_SUCCESS = "NETWORK/FETCH_OBB_CARD_QUOTES_SUCCESS";
export const OBB_CARD__UPDATE_LEGS = "OBB_CARD/UPDATE_LEGS";
export const OBB_CARD__UPDATE_SELECTED_LEGS_STATE = "OBB_CARD/UPDATE_SELECTED_LEGS_STATE";
export const OBB_CARD__CLEAN_CARD_LEGS_STATE = "OBB_CARD/CLEAN_CARD_LEGS_STATE";
export const NETWORK__FETCH_OBB_CARD_QUOTES_FAILURE = "NETWORK/FETCH_OBB_CARD_QUOTES_FAILURE";
export const OBB_CARD__EVENT_SELECTION = "OBB_CARD/EVENT_SELECTION";
export const OBB_CARD__FETCH_EVENT_PARTICIPANTS = "OBB_CARD/FETCH_EVENT_PARTICIPANTS";
export const NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS = "NETWORK/FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS";
export const NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_FAILURE = "NETWORK/FETCH_OBB_EVENT_PARTICIPANTS_FAILURE";
export const NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING = "NETWORK/FETCH_OBB_SQUADBET_QUOTES_IS_LOADING";
export const OBB_CARD__FETCH_SQUADBET_QUOTES = "OBB_CARD/FETCH_SQUADBET_QUOTES";
export const NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS = "NETWORK/FETCH_OBB_SQUADBET_QUOTES_SUCCESS";
export const NETWORK__FETCH_OBB_SQUADBET_QUOTES_FAILURE = "NETWORK/FETCH_OBB_SQUADBET_QUOTES_FAILURE";
export const OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES = "OBB_CARD/FETCH_SQUADBET_MAIN_CARD_QUOTES";
export const NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS =
  "NETWORK/FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS";
export const NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_FAILURE =
  "NETWORK/FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_FAILURE";
export const OBB_CARD__ON_SQUADBET_MODAL_OPEN = "OBB_CARD/ON_SQUADBET_MODAL_OPEN";
export const OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE = "OBB_CARD/SET_SQUADBET_MODAL_DEFAULT_STATE";
export const OBB_CARD__RESET_SQUADBET_MODAL_STATE = "OBB_CARD/RESET_SQUADBET_MODAL_STATE";
export const OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS = "OBB_CARD/UPDATE_SQUADBET_MODAL_PARTICIPANTS";
export const OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS =
  "OBB_CARD/UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS";
export const OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT = "OBB_CARD/TOGGLE_SQUADBET_MODAL_PARTICIPANT";
export const OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS =
  "OBB_CARD/OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS";
export const OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS =
  "OBB_CARD/OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS";
export const UI__CLOSE_PLAYER_PICKER_MODAL = "UI/CLOSE_PLAYER_PICKER_MODAL";
export const UI__SQUAD_BET_PLAYER_PICKER_REMOVE_SQUAD_PARTICIPANT =
  "UI/UI__SQUAD_BET_PLAYER_PICKER_REMOVE_SQUAD_PARTICIPANT";
export const UI__TOGGLE_SQUAD_BET_PLAYER_PICKER_SQUAD_PARTICIPANT =
  "UI/TOGGLE_SQUAD_BET_PLAYER_PICKER_SQUAD_PARTICIPANT";
export const UI__SQUAD_BET_PLAYER_PICKER_OPEN = "UI/SQUAD_BET_PLAYER_PICKER_OPEN";
export const UI__SQUAD_VS_SQUAD_PLAYER_PICKER_OPEN = "UI/SQUAD_VS_SQUAD_PLAYER_PICKER_OPEN";
export const OBB_CARD__SET_SQUADBET_MODAL_ERROR = "OBB_CARD/SET_SQUADBET_MODAL_ERROR";
export const OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR = "OBB_CARD/CLEAR_SQUADBET_MODAL_ERROR";
export const OBB_PARTICIPANTS_STATE_UPDATE = "OBB_PARTICIPANTS/STATE_UPDATE";
export const UI__SQUAD_BET_PLAYER_PICKER_BET_BUTTON_CLICK = "UI/SQUAD_BET_PLAYER_PICKER_BET_BUTTON_CLICK";
export const OBB_CARD_GROUP__SET_FILTER = "OBB_CARD_GROUP/SET_FILTER";
export const UI__OBB_ENHANCED_TRACKING_PLAYER_COUNTER = "UI/OBB_ENHANCED_TRACKING_PLAYER_COUNTER";
export const UI__OBB_INPLAY_BET_CLICK = "UI/OBB_INPLAY_BET_CLICK";
export const OBB_CARD__ON_SQUADVSSQUAD_MODAL_OPEN = "OBB_CARD/ON_SQUADVSSQUAD_MODAL_OPEN";
export const OBB_CARD__SET_SQUADVSSQUAD_MODAL_ERROR = "OBB_CARD/SET_SQUADVSSQUAD_MODAL_ERROR";
export const OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR = "OBB_CARD/CLEAR_SQUADVSSQUAD_MODAL_ERROR";
export const OBB_CARD__SET_SQUADVSSQUAD_MODAL_DEFAULT_STATE = "OBB_CARD/SET_SQUADVSSQUAD_MODAL_DEFAULT_STATE";
export const NETWORK__FETCH_OBB_SQUADVSSQUAD_QUOTES_IS_LOADING = "NETWORK/FETCH_OBB_SQUADVSSQUAD_QUOTES_IS_LOADING";
export const OBB_CARD__FETCH_SQUADVSSQUAD_QUOTES = "OBB_CARD/FETCH_SQUADVSSQUAD_QUOTES";
export const OBB_CARD__TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT = "OBB_CARD/TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT";
export const OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS =
  "OBB_CARD/UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS";
export const NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS =
  "NETWORK/FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS";
export const NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_FAILURE =
  "NETWORK/FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_FAILURE";
export const OBB_CARD__SAVE_SQUADVSQUAD_MODAL_ACTION = "NETWORK/SAVE_SQUADVSQUAD_MODAL_ACTION";
export const OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS = "OBB_CARD/UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS";
export const OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS =
  "OBB_CARD/OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS";
export const OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS_SUCCESS =
  "OBB_CARD/OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS_SUCCESS";
export const OBB_CARD__FETCH_SQUADVSSQUAD_MAIN_CARD_QUOTES = "OBB_CARD/FETCH_SQUADVSSQUAD_MAIN_CARD_QUOTES";
export const NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS =
  "NETWORK/FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS";
export const NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_FAILURE =
  "NETWORK/FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_FAILURE";
export const UI__SQUAD_VS_SQUAD_TOGGLE_PLAYERS_TOOLTIP = "UI/SQUAD_VS_SQUAD_TOGGLE_PLAYERS_TOOLTIP";
export const OBB_CARD_GROUP__LAYOUT_SELECTION = "OBB_CARD_GROUP/LAYOUT_SELECTION";
export const OBB_CARD_GROUP__SECTION_TOGGLED = "OBB_CARD_GROUP/SECTION_TOGGLED";
export const OBB_CARD_GROUP__SHOW_MORE_CLICKED = "OBB_CARD_GROUP/SHOW_MORE_CLICKED";
export const OBB_EVENT_POPULARS_CARD__SHOW_MORE_CLICKED = "OBB_EVENT_POPULARS_CARD/SHOW_MORE_CLICKED";
export const OBB_ONBOARDING_CARDS__CARD_GROUP_SWIPED = "OBB_ONBOARDING_CARDS/CARD_GROUP_SWIPED";
export const OBB_ONBOARDING_CARDS__CARD_GROUP_DISPLAYED = "OBB_ONBOARDING_CARDS/CARD_GROUP_DISPLAYED";

export type ObbToggleSquadBetModalParticipantAction = {
  type: typeof OBB_CARD__TOGGLE_SQUADBET_MODAL_PARTICIPANT;
  payload: {
    cardUrn: URN;
    participantUrn: string;
  };
};

export type ObbResetSquadBetModalStateAction = {
  type: typeof OBB_CARD__RESET_SQUADBET_MODAL_STATE;
  payload: {
    cardUrn: URN;
  };
};

export type ObbUpdateSquadbetModalParticipantsSuccessAction = {
  type: typeof OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS;
  payload: {
    cardUrn: URN;
    participants: string[];
  };
};

export type ObbUpdateSquadbetModalParticipantsAction = {
  type: typeof OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS;
  payload: {
    cardUrn: URN;
  };
};

export type ObbUpdateSquadbetMainCardParticipantsAction = {
  type: typeof OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS;
  payload: {
    cardUrn: URN;
  };
};

export type ObbUpdateSquadbetMainCardParticipantsSuccessAction = {
  type: typeof OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS;
  payload: {
    cardUrn: URN;
    participants: string[];
  };
};

export type ObbSetSquadbetModalDefaultStateAction = {
  type: typeof OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE;
  payload: {
    cardUrn: URN;
  };
};

export type ObbSquadbetOnModalOpenAction = {
  type: typeof OBB_CARD__ON_SQUADBET_MODAL_OPEN;
  payload: {
    cardUrn: URN;
  };
};

export type ObbClosePlayerPickerModalAction = {
  type: typeof UI__CLOSE_PLAYER_PICKER_MODAL;
  payload: {
    cardUrn: URN;
    eventName: string;
    incidentType: string;
  };
};

export type ObbToggleSquadBetPlayerPickerSquadParticipantAction = {
  type: typeof UI__TOGGLE_SQUAD_BET_PLAYER_PICKER_SQUAD_PARTICIPANT;
  payload: {
    cardUrn: URN;
    eventName: string;
    incidentType: string;
    participantUrn: string;
    playerName?: string | null;
    selectedSquadId?: "1" | "2";
  };
};

export type ObbSquadBetPlayerPickerRemoveSquadParticipantAction = {
  type: typeof UI__SQUAD_BET_PLAYER_PICKER_REMOVE_SQUAD_PARTICIPANT;
  payload: {
    cardUrn: URN;
    eventName: string;
    moduleName: string;
    incidentType: string;
  };
};

export type ObbSquadBetPlayerPickerBetButtonClickAction = {
  type: typeof UI__SQUAD_BET_PLAYER_PICKER_BET_BUTTON_CLICK;
  payload: {
    eventName: string;
    incidentType: string;
    buttonStatus: string;
    buttonLabel: string;
  };
};

export type ObbSquadBetPlayerPickerOpenAction = {
  type: typeof UI__SQUAD_BET_PLAYER_PICKER_OPEN;
  payload: {
    cardUrn: URN;
    element?: string;
  };
};

export type ObbSquadVsSquadTogglePlayersTooltipAction = {
  type: typeof UI__SQUAD_VS_SQUAD_TOGGLE_PLAYERS_TOOLTIP;
  payload: {
    cardUrn: URN;
    actionType: TaggingAction.OPENED | TaggingAction.CLOSED;
  };
};

export type ObbSetSquadBetModalErrorAction = {
  type: typeof OBB_CARD__SET_SQUADBET_MODAL_ERROR;
  payload: {
    cardUrn: URN;
    errorCode: string;
  };
};

export type ObbClearSquadBetModalErrorAction = {
  type: typeof OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR;
  payload: {
    cardUrn: URN;
  };
};

export type ObbLegQuotesUpdateStateAction = {
  type: typeof OBB_LEG_QUOTES_UPDATE_STATE;
  payload: {
    urn: string;
    unquotedLegs: ObbLeg[];
  };
};

export type ObbGetEventParticipantsStateAction = {
  type: typeof OBB_CARD__FETCH_EVENT_PARTICIPANTS;
  payload: {
    cardUrn: URN;
    event: URN;
    incidentType: string;
    period: string;
  };
};

export type FetchObbEventParticipantsSuccessAction = {
  type: typeof NETWORK__FETCH_OBB_EVENT_PARTICIPANTS_SUCCESS;
  payload: {
    cardUrn: URN;
    cardParticipants: string[];
    eventParticipants: NonNullable<ObbGetEventParticipantsQuery["obb"]>["eventParticipants"];
    requestInput: {
      event: URN;
      incidentType: string;
      period: string;
    };
  };
};

export type ObbSquadbetQuotesIsLoadingAction = {
  type: typeof NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING;
  payload: {
    cardUrn: URN;
    isLoadingQuotes: boolean;
  };
};

export type FetchObbSquadbetQuotesAction = {
  type: typeof OBB_CARD__FETCH_SQUADBET_QUOTES;
  payload: {
    cardUrn: URN;
  };
};

export type FetchObbSquadbetQuotesSuccessAction = {
  type: typeof NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS;
  payload: {
    cardUrn: URN;
    obbQuotes: NormalizedObbLeg[];
    defaultOutcomeIndex: number;
  };
};

export type FetchObbSquadbetQuotesFailureAction = {
  type: typeof NETWORK__FETCH_OBB_SQUADBET_QUOTES_FAILURE;
  payload: {};
};

export type FetchObbSquadbetMainCardQuotesAction = {
  type: typeof OBB_CARD__FETCH_SQUADBET_MAIN_CARD_QUOTES;
  payload: {
    cardUrn: URN;
  };
};

export type FetchObbSquadbetMainCardQuotesSuccessAction = {
  type: typeof NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS;
  payload: {
    cardUrn: URN;
    obbQuotes: NormalizedObbLeg[];
    defaultOutcomeIndex: number;
  };
};

export type FetchObbSquadbetMainCardQuotesFailureAction = {
  type: typeof NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_FAILURE;
  payload: {};
};

export type FetchObbCardQuotesSuccessAction = {
  type: typeof NETWORK__FETCH_OBB_CARD_QUOTES_SUCCESS;
  payload: {
    urn: URN;
    obbQuotes: ObbQuote[];
  };
};

export type ObbCardUpdateLegsAction = {
  type: typeof OBB_CARD__UPDATE_LEGS;
  payload: {
    urn: URN;
    legs: ObbLeg[];
  };
};

export type ObbSelectedLegsUpdateStateAction = {
  type: typeof OBB_CARD__UPDATE_SELECTED_LEGS_STATE;
  payload: {
    urn: URN;
    selectedLegsId: string[];
  };
};

export type FetchObbCardQuotesFailureAction = {
  type: typeof NETWORK__FETCH_OBB_CARD_QUOTES_FAILURE;
  payload: {
    // TODO: obb - failure
  };
};

export type ObbCleanCardLegsAction = {
  type: typeof OBB_CARD__CLEAN_CARD_LEGS_STATE;
  payload: {
    urn: URN;
  };
};

export type ObbEventSelectionAction = {
  type: typeof OBB_CARD__EVENT_SELECTION;
  payload: {
    event: {
      elementText: string;
      module?: ObbModuleMetadataTemplate | string;
    };
    urn?: string;
    eventName?: string;
  };
};

export type ObbParticipantsStateUpdateAction = {
  type: typeof OBB_PARTICIPANTS_STATE_UPDATE;
  payload: {
    participants: ObbParticipants;
  };
};

export type ObbCardGroupSetFilterAction = {
  type: typeof OBB_CARD_GROUP__SET_FILTER;
  payload: {
    selectedFilter: string;
    urn: string;
  };
};

export type ObbEnhancedTrackingPlayerCounterAction = {
  type: typeof UI__OBB_ENHANCED_TRACKING_PLAYER_COUNTER;
  payload: {
    actionType: TaggingAction.OPENED | TaggingAction.CLOSED;
    eventName: string;
    betLegPartType: string | undefined;
    cardUrn: string;
  };
};

export type ObbInPlayBetButtonClickAction = {
  type: typeof UI__OBB_INPLAY_BET_CLICK;
  payload: {
    legTemplateId?: ObbLegTemplateId;
  };
};

export type ObbSquadVsSquadOnModalOpenAction = {
  type: typeof OBB_CARD__ON_SQUADVSSQUAD_MODAL_OPEN;
  payload: {
    cardUrn: URN;
  };
};

export type ObbSetSquadVsSquadModalDefaultStateAction = {
  type: typeof OBB_CARD__SET_SQUADVSSQUAD_MODAL_DEFAULT_STATE;
  payload: {
    cardUrn: URN;
  };
};

export type ObbSquadVsSquadQuotesIsLoadingAction = {
  type: typeof NETWORK__FETCH_OBB_SQUADVSSQUAD_QUOTES_IS_LOADING;
  payload: {
    cardUrn: URN;
    isLoadingQuotes: boolean;
  };
};

export type ObbSetSquadVsSquadModalErrorAction = {
  type: typeof OBB_CARD__SET_SQUADVSSQUAD_MODAL_ERROR;
  payload: {
    cardUrn: URN;
    errorCode: string;
  };
};

export type ObbToggleSquadVsSquadModalParticipantAction = {
  type: typeof OBB_CARD__TOGGLE_SQUADVSSQUAD_MODAL_PARTICIPANT;
  payload: {
    cardUrn: URN;
    participantUrn: string;
    selectedSquadId: "1" | "2";
  };
};

export type ObbUpdateSquadVsSquadModalParticipantsSuccessAction = {
  type: typeof OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS;
  payload: {
    cardUrn: URN;
    firstSquadParticipants: string[];
    secondSquadParticipants: string[];
  };
};

export type FetchObbSquadVsSquadQuotesAction = {
  type: typeof OBB_CARD__FETCH_SQUADVSSQUAD_QUOTES;
  payload: {
    cardUrn: URN;
  };
};

export type FetchObbSquadVsSquadModalQuotesSuccessAction = {
  type: typeof NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS;
  payload: {
    cardUrn: URN;
    legs: ObbLeg[];
  };
};

export type FetchObbSquadVsSquadModalQuotesFailureAction = {
  type: typeof NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_FAILURE;
  payload: {};
};

export type ObbSaveSquadVsSquadModalAction = {
  type: typeof OBB_CARD__SAVE_SQUADVSQUAD_MODAL_ACTION;
  payload: {
    cardUrn: URN;
  };
};

export type ObbUpdateSquadVsSquadModalParticipantsAction = {
  type: typeof OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS;
  payload: {
    cardUrn: URN;
  };
};

export type ObbUpdateSquadVsSquadMainCardParticipantsAction = {
  type: typeof OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS;
  payload: {
    cardUrn: URN;
  };
};

export type ObbUpdateSquadVsSquadMainCardParticipantsSuccessAction = {
  type: typeof OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS_SUCCESS;
  payload: {
    cardUrn: URN;
    firstSquadParticipants: string[];
    secondSquadParticipants: string[];
  };
};

export type FetchObbSquadVsSquadMainCardQuotesAction = {
  type: typeof OBB_CARD__FETCH_SQUADVSSQUAD_MAIN_CARD_QUOTES;
  payload: {
    cardUrn: URN;
  };
};

export type FetchObbSquadVsSquadMainCardQuotesSuccessAction = {
  type: typeof NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS;
  payload: {
    cardUrn: URN;
    legs: ObbLeg[];
  };
};

export type FetchObbSquadVsSquadMainCardQuotesFailureAction = {
  type: typeof NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_FAILURE;
  payload: {};
};

export type ObbSquadVsSquadPlayerPickerOpenAction = {
  type: typeof UI__SQUAD_VS_SQUAD_PLAYER_PICKER_OPEN;
  payload: {
    cardUrn: URN;
  };
};

export type ObbClearSquadVsSquadModalErrorAction = {
  type: typeof OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR;
  payload: {
    cardUrn: URN;
  };
};

export type ObbCardGroupLayoutSelectionAction = {
  type: typeof OBB_CARD_GROUP__LAYOUT_SELECTION;
  payload: {
    urn: string;
    sectionUrn: string;
    layoutUrn: string;
    eventName: string | undefined;
  };
};

export type ObbCardGroupSectionToggledAction = {
  type: typeof OBB_CARD_GROUP__SECTION_TOGGLED;
  payload: {
    cardGroupUrn: string;
    sectionUrn: string;
    isOpen: boolean;
    eventName: string | undefined;
  };
};

export type ObbCardGroupShowMoreClickedAction = {
  type: typeof OBB_CARD_GROUP__SHOW_MORE_CLICKED;
  payload: {
    cardGroupUrn: string;
    sectionUrn: string;
    layoutUrn: string;
    isOpen: boolean;
    eventName: string | undefined;
  };
};

export type ObbEventPopularsShowMoreAction = {
  type: typeof OBB_EVENT_POPULARS_CARD__SHOW_MORE_CLICKED;
  payload: {
    cardUrn: string;
    eventName: string;
    showMore: boolean;
  };
};

export type ObbOnboardingCardsCardGroupNavigationAction = {
  type: typeof OBB_ONBOARDING_CARDS__CARD_GROUP_SWIPED;
  payload: {
    urn: string;
    eventName: string;
    direction: "left" | "right";
  };
};

export type ObbOnboardingCardsCardGroupDisplayedAction = {
  type: typeof OBB_ONBOARDING_CARDS__CARD_GROUP_DISPLAYED;
  payload: {
    urn: string;
    eventName: string;
    numberOfCards: number;
  };
};
