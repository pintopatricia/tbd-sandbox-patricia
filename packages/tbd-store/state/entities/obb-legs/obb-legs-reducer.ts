import produce from "immer";
import { ObbLegs } from "./ObbLegs.types";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import {
  ImplyObbBetsSuccessAction,
  NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS,
  NETWORK__OBB_IMPLY_BETS_SUCCESS,
  ObbQuotesUpdateSuccessAction,
} from "../../../actions/betslip";
import {
  FetchObbCardQuotesSuccessAction,
  FetchObbSquadbetMainCardQuotesSuccessAction,
  FetchObbSquadbetQuotesSuccessAction,
  FetchObbSquadVsSquadMainCardQuotesSuccessAction,
  FetchObbSquadVsSquadModalQuotesSuccessAction,
  NETWORK__FETCH_OBB_CARD_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS,
  NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS,
  OBB_CARD__UPDATE_LEGS,
  ObbCardUpdateLegsAction,
} from "../../../actions/obb";
import { buildObbLeg } from "./builders/obb-leg-builder";
import { BetDefinitionResult } from "../../../clients/catalogue/catalogue-response-types";

type ActionTypes =
  | FetchCatalogueSuccessAction
  | FetchObbCardQuotesSuccessAction
  | ObbQuotesUpdateSuccessAction
  | FetchObbSquadbetQuotesSuccessAction
  | FetchObbSquadbetMainCardQuotesSuccessAction
  | ImplyObbBetsSuccessAction
  | ObbCardUpdateLegsAction
  | FetchObbSquadVsSquadMainCardQuotesSuccessAction
  | FetchObbSquadVsSquadModalQuotesSuccessAction;

export default (currentState: undefined | ObbLegs, action: ActionTypes): ObbLegs => {
  const state = currentState || {};

  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const obbLegs = [...(action.payload.data.ObbLeg || [])];

      return obbLegs.reduce(
        (acc, leg) => {
          const normalizedLeg = buildObbLeg(leg);
          return normalizedLeg
            ? {
                ...acc,
                [leg.id]: normalizedLeg,
              }
            : acc;
        },
        { ...state },
      );
    }

    case NETWORK__FETCH_OBB_SQUADVSSQUAD_MODAL_QUOTES_SUCCESS:
    case NETWORK__FETCH_OBB_SQUADVSSQUAD_MAIN_CARD_QUOTES_SUCCESS:
    case OBB_CARD__UPDATE_LEGS: {
      const { legs } = action.payload;

      return legs.reduce(
        (acc, leg) => {
          if (acc[leg.id] && !leg.quote) {
            return acc;
          }

          return { ...acc, [leg.id]: leg };
        },
        { ...state },
      );
    }

    case NETWORK__FETCH_OBB_CARD_QUOTES_SUCCESS: {
      const { obbQuotes } = action.payload;

      return obbQuotes.reduce(
        (acc, obbQuote) => {
          if (acc[obbQuote.id]) {
            if (obbQuote.result.resultCode !== "SUCCESS") {
              acc[obbQuote.id] = {
                ...acc[obbQuote.id],
                quote: {
                  typename: "ObbQuoteError",
                  errorCode: obbQuote.result.resultCode,
                  errorDetails: obbQuote.result.errorDetails,
                },
              };

              return acc;
            }

            if (!obbQuote.price) {
              return acc;
            }

            acc[obbQuote.id] = {
              ...acc[obbQuote.id],
              quote: {
                typename: "ObbQuoteSuccess",
                price: { decimal: obbQuote.price.decimal, fractional: obbQuote.price.fractional },
              },
            };
          }

          return acc;
        },
        { ...state },
      );
    }

    case NETWORK__OBB_FETCH_LEG_QUOTES_SUCCESS: {
      const { legsQuotes } = action.payload;

      return produce(state, (draft) => {
        legsQuotes.forEach((legQuote) => {
          const { id, price, result } = legQuote;

          if (draft[id]) {
            if (!price || result.resultCode !== "SUCCESS") {
              // eslint-disable-next-line no-param-reassign
              draft[id].quote = {
                typename: "ObbQuoteError",
                errorCode: result.resultCode,
                errorDetails: result.errorDetails || null,
              };
              return;
            }

            if (price && result.resultCode === "SUCCESS") {
              // eslint-disable-next-line no-param-reassign
              draft[id].quote = {
                ...draft[id].quote,
                price,
                typename: "ObbQuoteSuccess",
              };
            }
          }
        });
      });
    }

    case NETWORK__OBB_IMPLY_BETS_SUCCESS: {
      const {
        implyBetsResponse: { betDefinitions },
      } = action.payload;

      return produce(state, (draft) => {
        betDefinitions.forEach((betDefinition: BetDefinitionResult) => {
          const { id, details, result } = betDefinition;

          if (draft[id]) {
            if (!details || result.resultCode !== "SUCCESS") {
              // eslint-disable-next-line no-param-reassign
              draft[id].quote = {
                typename: "ObbQuoteError",
                errorCode: result.resultCode,
                errorDetails: result.errorDetails,
              };
              return;
            }

            if (details.price && result.resultCode === "SUCCESS") {
              const { price } = details;
              // eslint-disable-next-line no-param-reassign
              draft[id].quote = {
                ...draft[id].quote,
                typename: "ObbQuoteSuccess",
                price: { decimal: price.decimal, fractional: price.fractional },
              };
            }
          }
        });
      });
    }
    case NETWORK__FETCH_OBB_SQUADBET_QUOTES_SUCCESS:
    case NETWORK__FETCH_OBB_SQUADBET_MAIN_CARD_QUOTES_SUCCESS: {
      const { obbQuotes } = action.payload;

      return produce(state, (draft) => {
        obbQuotes.forEach((leg) => {
          const normalizedLeg = buildObbLeg(leg);
          if (normalizedLeg) {
            // eslint-disable-next-line no-param-reassign
            draft[leg.id] = normalizedLeg;
          }
        });
      });
    }

    default:
      return state;
  }
};
