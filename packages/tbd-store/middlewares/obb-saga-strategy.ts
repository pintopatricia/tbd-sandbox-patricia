// eslint-disable-next-line import/no-extraneous-dependencies
import {
  ObbGetEventParticipantsStateAction,
  FetchObbSquadbetQuotesAction,
  FetchObbSquadbetQuotesSuccessAction,
  ObbSetSquadbetModalDefaultStateAction,
  ObbUpdateSquadbetModalParticipantsAction,
  ObbUpdateSquadbetModalParticipantsSuccessAction,
  FetchObbSquadbetQuotesFailureAction,
  ObbToggleSquadBetModalParticipantAction,
  ObbUpdateSquadbetMainCardParticipantsAction,
  FetchObbSquadbetMainCardQuotesAction,
  FetchObbSquadbetMainCardQuotesSuccessAction,
  FetchObbSquadbetMainCardQuotesFailureAction,
  ObbUpdateSquadbetMainCardParticipantsSuccessAction,
  ObbSetSquadVsSquadModalDefaultStateAction,
  FetchObbSquadVsSquadQuotesAction,
  ObbToggleSquadVsSquadModalParticipantAction,
  ObbUpdateSquadVsSquadModalParticipantsSuccessAction,
  ObbUpdateSquadVsSquadModalParticipantsAction,
  ObbUpdateSquadVsSquadMainCardParticipantsAction,
  ObbUpdateSquadVsSquadMainCardParticipantsSuccessAction,
  FetchObbSquadVsSquadMainCardQuotesAction,
  FetchObbSquadVsSquadMainCardQuotesSuccessAction,
  FetchObbSquadVsSquadMainCardQuotesFailureAction,
  FetchObbSquadVsSquadModalQuotesSuccessAction,
  FetchObbSquadVsSquadModalQuotesFailureAction,
  ObbSquadbetQuotesIsLoadingAction,
  ObbSquadVsSquadQuotesIsLoadingAction,
  ObbSetSquadBetModalErrorAction,
  ObbSetSquadVsSquadModalErrorAction,
  ObbClearSquadBetModalErrorAction,
  ObbClearSquadVsSquadModalErrorAction,
} from "@ppb/tbd-store/actions/obb";
import { ApplicationState } from "../state/ApplicationState.types";
import { QuotesRequestInput, SquadBetQuotesRequestInput } from "../clients/catalogue/catalogue-response-types";
import { ObbLeg } from "../state/entities/obb-legs/ObbLegs.types";
import { ObbQuotesResponse, QuotesApiFn, SelectorCardWithModalFields } from "./obb-saga-strategy.types";

export type ObbCardStrategy = {
  getEventParticipantsAction(
    cardUrn: string,
    eventUrn: string,
    incidentType: string,
  ): ObbGetEventParticipantsStateAction;
  updateParticipantsAction(
    cardUrn: string,
    isModal: boolean,
  ):
    | ObbUpdateSquadbetModalParticipantsAction
    | ObbUpdateSquadVsSquadModalParticipantsAction
    | ObbUpdateSquadbetMainCardParticipantsAction
    | ObbUpdateSquadVsSquadMainCardParticipantsAction;
  setModalDefaultStateAction(
    cardUrn: string,
  ): ObbSetSquadbetModalDefaultStateAction | ObbSetSquadVsSquadModalDefaultStateAction;
  setModalErrorAction(
    cardUrn: string,
    errors: string[],
    modalError: string | null,
  ): ObbSetSquadBetModalErrorAction | ObbSetSquadVsSquadModalErrorAction;
  setPlayerRemovedModalErrorAction(
    cardUrn: string,
    errors: string[],
    modalError: string | null,
  ): ObbSetSquadBetModalErrorAction | ObbSetSquadVsSquadModalErrorAction;
  clearModalErrorAction(cardUrn: string): ObbClearSquadBetModalErrorAction | ObbClearSquadVsSquadModalErrorAction;
  setQuotesIsLoadingAction(
    cardUrn: string,
    isLoadingQuotes: boolean,
  ): ObbSquadbetQuotesIsLoadingAction | ObbSquadVsSquadQuotesIsLoadingAction;
  fetchQuotesAction(
    cardUrn: string,
    isModal: boolean,
  ):
    | FetchObbSquadbetQuotesAction
    | FetchObbSquadVsSquadQuotesAction
    | FetchObbSquadbetMainCardQuotesAction
    | FetchObbSquadVsSquadMainCardQuotesAction;
  fetchQuotesSuccessAction(
    cardUrn: string,
    isModal: boolean,
    quotes?: ObbQuotesResponse,
    obbLegs?: ObbLeg[],
  ):
    | FetchObbSquadbetQuotesSuccessAction
    | FetchObbSquadVsSquadModalQuotesSuccessAction
    | FetchObbSquadbetMainCardQuotesSuccessAction
    | FetchObbSquadVsSquadMainCardQuotesSuccessAction;
  fetchQuotesFailureAction(
    error: string,
    isModal: boolean,
  ):
    | FetchObbSquadbetQuotesFailureAction
    | FetchObbSquadVsSquadModalQuotesFailureAction
    | FetchObbSquadbetMainCardQuotesFailureAction
    | FetchObbSquadVsSquadMainCardQuotesFailureAction;

  updateParticipantsSuccessAction(
    cardUrn: string,
    isModal: boolean,
    newParticipants: string[] | [string[], string[]],
  ):
    | ObbUpdateSquadbetModalParticipantsSuccessAction
    | ObbUpdateSquadVsSquadModalParticipantsSuccessAction
    | ObbUpdateSquadbetMainCardParticipantsSuccessAction
    | ObbUpdateSquadVsSquadMainCardParticipantsSuccessAction;

  toggleModalParticipantAction(
    card: SelectorCardWithModalFields,
    action: ObbToggleSquadBetModalParticipantAction | ObbToggleSquadVsSquadModalParticipantAction,
  ):
    | ObbUpdateSquadbetModalParticipantsSuccessAction
    | ObbUpdateSquadVsSquadModalParticipantsSuccessAction
    | ObbUpdateSquadbetMainCardParticipantsSuccessAction
    | ObbUpdateSquadVsSquadMainCardParticipantsSuccessAction;
  getParticipants(card: SelectorCardWithModalFields, isModal: boolean): string[] | [string[], string[]];
  hasParticipantsChanged(
    card: SelectorCardWithModalFields,
    isModal: boolean,
    newParticipants: string[] | [string[], string[]],
  ): boolean;
  hasEmptyParticipants(cardWithModalFields: SelectorCardWithModalFields, isModal: boolean): boolean;
  getObbQuotesRequestInput(
    card: SelectorCardWithModalFields,
    isModal: boolean,
    obbLegs?: ObbLeg[],
  ): SquadBetQuotesRequestInput | QuotesRequestInput;
  getCardWithModalFields(state: ApplicationState, cardUrn: string): SelectorCardWithModalFields | undefined;
  getQuotesApi(): QuotesApiFn;
  getQuotesErrors(quotes: ObbQuotesResponse): string[];
  filterNewModalErrors?(modalErrors: string[], quotes: ObbQuotesResponse): string[];
  buildUnquotedLegs?(card: SelectorCardWithModalFields, isModal: boolean): ObbLeg[];
};
