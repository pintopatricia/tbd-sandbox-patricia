/* eslint-disable no-param-reassign */
import produce from "immer";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../../actions/catalogue";
import {
  OBB_CARD__UPDATE_SELECTED_LEGS_STATE,
  ObbSelectedLegsUpdateStateAction,
  OBB_CARD__CLEAN_CARD_LEGS_STATE,
  ObbCleanCardLegsAction,
  OBB_CARD__UPDATE_LEGS,
  ObbCardUpdateLegsAction,
  ObbSetSquadbetModalDefaultStateAction,
  OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
  FetchObbSquadbetQuotesSuccessAction,
  ObbUpdateSquadbetModalParticipantsSuccessAction,
  OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS,
  OBB_CARD__RESET_SQUADBET_MODAL_STATE,
  ObbResetSquadBetModalStateAction,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING,
  ObbSquadbetQuotesIsLoadingAction,
  OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR,
  ObbClearSquadBetModalErrorAction,
  OBB_CARD__SET_SQUADBET_MODAL_ERROR,
  ObbSetSquadBetModalErrorAction,
  NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS,
  OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS,
  ObbUpdateSquadbetMainCardParticipantsSuccessAction,
  FetchObbSquadbetMainCardQuotesSuccessAction,
  OBB_CARD__SET_SQUADVSSQUAD_MODAL_DEFAULT_STATE,
  ObbSetSquadVsSquadModalDefaultStateAction,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_QUOTES_IS_LOADING,
  ObbSquadVsSquadQuotesIsLoadingAction,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS,
  ObbUpdateSquadVsSquadModalParticipantsSuccessAction,
  OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS_SUCCESS,
  ObbUpdateSquadVsSquadMainCardParticipantsSuccessAction,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS,
  FetchObbSquadVsSquadMainCardQuotesSuccessAction,
  OBB_CARD__SET_SQUADVSSQUAD_MODAL_ERROR,
  ObbSetSquadVsSquadModalErrorAction,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS,
  FetchObbSquadVsSquadModalQuotesSuccessAction,
  OBB_CARD__SAVE_SQUADVSQUAD_MODAL_ACTION,
  ObbSaveSquadVsSquadModalAction,
  OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR,
  ObbClearSquadVsSquadModalErrorAction,
} from "../../../../actions/obb";
import { NormalizedObbPvpCard } from "../../../../services/catalogue/normalizer/cards/obb-pvp-card/ObbPvpCard.types";
import { NormalizedObbSquadBetCard } from "../../../../services/catalogue/normalizer/cards/obb-squad-bet-card/ObbSquadBetCard.types";
import { NormalizedObbSquadVsSquadCard } from "../../../../services/catalogue/normalizer/cards/obb-squad-vs-squad-card/ObbSquadVsSquadCard.types";
import { buildObbPvpCard } from "./builders/obb-pvp-card-builder";
import { buildObbSquadBetCard } from "./builders/obb-squad-bet-card-builder";
import { buildObbSquadVsSquadCard } from "./builders/obb-squad-vs-squad-card-builder";
import { ObbCard, ObbCards, ObbPvpCard } from "./ObbCard.types";

type ActionTypes =
  | FetchCatalogueSuccessAction
  | ObbSelectedLegsUpdateStateAction
  | ObbCleanCardLegsAction
  | ObbCardUpdateLegsAction
  | ObbSetSquadbetModalDefaultStateAction
  | FetchObbSquadbetQuotesSuccessAction
  | ObbUpdateSquadbetModalParticipantsSuccessAction
  | FetchObbSquadbetMainCardQuotesSuccessAction
  | ObbUpdateSquadbetMainCardParticipantsSuccessAction
  | ObbResetSquadBetModalStateAction
  | ObbSquadbetQuotesIsLoadingAction
  | ObbSetSquadBetModalErrorAction
  | ObbClearSquadBetModalErrorAction
  | ObbSetSquadVsSquadModalDefaultStateAction
  | ObbSquadVsSquadQuotesIsLoadingAction
  | ObbUpdateSquadVsSquadModalParticipantsSuccessAction
  | ObbUpdateSquadVsSquadMainCardParticipantsSuccessAction
  | FetchObbSquadVsSquadMainCardQuotesSuccessAction
  | ObbSetSquadVsSquadModalErrorAction
  | FetchObbSquadVsSquadModalQuotesSuccessAction
  | ObbSaveSquadVsSquadModalAction
  | ObbClearSquadVsSquadModalErrorAction;

export type NormalizedObbCard = NormalizedObbPvpCard | NormalizedObbSquadBetCard | NormalizedObbSquadVsSquadCard;

export const isObbPvpCard = (obbCard: ObbCard): obbCard is ObbPvpCard => obbCard.typename === "ObbPvpCard";

export const buildObbCard = (obbCard: NormalizedObbCard): ObbCard | undefined => {
  switch (obbCard.typename) {
    case "ObbPvpCard":
      return buildObbPvpCard(obbCard);
    case "ObbSquadBetCard":
      return buildObbSquadBetCard(obbCard);
    case "ObbSquadVsSquadCard":
      return buildObbSquadVsSquadCard(obbCard);
    default: {
      return undefined;
    }
  }
};

export default (currentState: undefined | ObbCards, action: ActionTypes): ObbCards => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const obbCards = [
        ...(action.payload.data.ObbPvpCard || []),
        ...(action.payload.data.ObbSquadBetCard || []),
        ...(action.payload.data.ObbSquadVsSquadCard || []),
      ];

      return obbCards.reduce(
        (acc, obbCard): ObbCards => {
          const builtCard = buildObbCard(obbCard);
          if (!builtCard) {
            return acc;
          }

          acc[obbCard.urn] = builtCard;
          return acc;
        },
        { ...state },
      );
    }

    case OBB_CARD__UPDATE_LEGS: {
      const { urn, legs } = action.payload;

      const legIds = legs.map((obbLeg) => obbLeg.id);

      return state[urn] ? { ...state, [urn]: { ...state[urn], legs: legIds } } : { ...state };
    }

    case OBB_CARD__UPDATE_SELECTED_LEGS_STATE: {
      const { urn, selectedLegsId } = action.payload;
      const card = state[urn];

      if (isObbPvpCard(card)) {
        return { ...state, [urn]: { ...card, selectedLegs: selectedLegsId } };
      }

      return state;
    }
    case OBB_CARD__CLEAN_CARD_LEGS_STATE: {
      const { urn } = action.payload;
      return state[urn] ? { ...state, [urn]: { ...state[urn], legs: [] } } : { ...state };
    }

    case OBB_CARD__SET_SQUADBET_MODAL_DEFAULT_STATE: {
      const { cardUrn } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadBetCard") {
          return;
        }

        card.modalParticipants = card.squadParticipants;
        card.modalDefaultOutcomeIndex = card.defaultOutcomeIndex;
        card.modalLegs = card.defaultLegs || [];
        card.modalError = null;
      });
    }

    case OBB_CARD__RESET_SQUADBET_MODAL_STATE: {
      const { cardUrn } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadBetCard") {
          return;
        }

        card.modalParticipants = [];
        card.modalDefaultOutcomeIndex = 0;
        card.modalLegs = [];
        card.modalError = null;
      });
    }

    case NETWORK__FETCH_OBB_SQUADBET_QUOTES_IS_LOADING: {
      const { cardUrn, isLoadingQuotes } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadBetCard") {
          return;
        }

        card.modalIsLoadingQuotes = isLoadingQuotes;
      });
    }

    case OBB_CARD__SET_SQUADBET_MODAL_ERROR: {
      const { cardUrn, errorCode } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadBetCard") {
          return;
        }

        card.modalError = errorCode;
      });
    }

    case OBB_CARD__CLEAR_SQUADBET_MODAL_ERROR: {
      const { cardUrn } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadBetCard") {
          return;
        }

        card.modalError = null;
      });
    }

    case NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS: {
      const { cardUrn, obbQuotes, defaultOutcomeIndex } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadBetCard") {
          return;
        }

        const legIds = obbQuotes.map((obbQuote) => obbQuote.id);

        card.modalLegs = legIds;
        card.modalDefaultOutcomeIndex = defaultOutcomeIndex;
      });
    }

    case OBB_CARD__UPDATE_SQUADBET_MODAL_PARTICIPANTS_SUCCESS: {
      const { cardUrn, participants } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadBetCard") {
          return;
        }

        card.modalParticipants = participants;
      });
    }

    case NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS: {
      const { cardUrn, obbQuotes, defaultOutcomeIndex } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadBetCard") {
          return;
        }

        const legIds = obbQuotes.map((obbQuote) => obbQuote.id);

        card.defaultLegs = legIds;
        card.defaultOutcomeIndex = defaultOutcomeIndex;
      });
    }

    case OBB_CARD__UPDATE_SQUADBET_MAIN_CARD_PARTICIPANTS_SUCCESS: {
      const { cardUrn, participants } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadBetCard") {
          return;
        }

        card.squadParticipants = participants;
      });
    }

    case OBB_CARD__SET_SQUADVSSQUAD_MODAL_DEFAULT_STATE: {
      const { cardUrn } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadVsSquadCard") {
          return;
        }

        card.firstSquadModalParticipants = card.firstSquadParticipants;
        card.secondSquadModalParticipants = card.secondSquadParticipants;
        card.modalLegs = card.defaultLegs || [];
        card.modalError = null;
      });
    }

    case NETWORK__FETCH_OBB_SQUADVSSQUAD_QUOTES_IS_LOADING: {
      const { cardUrn, isLoadingQuotes } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadVsSquadCard") {
          return;
        }

        card.modalIsLoadingQuotes = isLoadingQuotes;
      });
    }

    case OBB_CARD__UPDATE_SQUADVSSQUAD_MODAL_PARTICIPANTS_SUCCESS: {
      const { cardUrn, firstSquadParticipants, secondSquadParticipants } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadVsSquadCard") {
          return;
        }

        card.firstSquadModalParticipants = firstSquadParticipants;
        card.secondSquadModalParticipants = secondSquadParticipants;
      });
    }

    case OBB_CARD__UPDATE_SQUADVSSQUAD_MAIN_CARD_PARTICIPANTS_SUCCESS: {
      const { cardUrn, firstSquadParticipants, secondSquadParticipants } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadVsSquadCard") {
          return;
        }

        card.firstSquadParticipants = firstSquadParticipants;
        card.secondSquadParticipants = secondSquadParticipants;
      });
    }

    case NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS: {
      const { cardUrn, legs } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadVsSquadCard") {
          return;
        }

        const legIds = legs.map((leg) => leg.id);
        card.defaultLegs = legIds;
      });
    }

    case OBB_CARD__SET_SQUADVSSQUAD_MODAL_ERROR: {
      const { cardUrn, errorCode } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadVsSquadCard") {
          return;
        }

        card.modalError = errorCode;
      });
    }

    case NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS: {
      const { legs, cardUrn } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadVsSquadCard") {
          return;
        }

        const legIds = legs.map((leg) => leg.id);
        card.modalLegs = legIds;
      });
    }

    case OBB_CARD__SAVE_SQUADVSQUAD_MODAL_ACTION: {
      const { cardUrn } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadVsSquadCard") {
          return;
        }

        card.firstSquadParticipants = card.firstSquadModalParticipants;
        card.secondSquadParticipants = card.secondSquadModalParticipants;
        card.firstSquadModalParticipants = [];
        card.secondSquadModalParticipants = [];
        card.defaultLegs = card.modalLegs;
        card.modalError = null;
        card.modalIsLoadingQuotes = false;
      });
    }

    case OBB_CARD__CLEAR_SQUADVSSQUAD_MODAL_ERROR: {
      const { cardUrn } = action.payload;

      return produce(state, (draft) => {
        const card = draft[cardUrn];

        if (!card || card.typename !== "ObbSquadVsSquadCard") {
          return;
        }

        card.modalError = null;
      });
    }

    default:
      return state;
  }
};
