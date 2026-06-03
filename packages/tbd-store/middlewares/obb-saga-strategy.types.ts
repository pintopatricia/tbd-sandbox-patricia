import {
  ObbQuotesQuery,
  QuotesRequestInput,
  SquadBetQuotesRequestInput,
} from "../clients/catalogue/catalogue-response-types";
import { NormalizedObbLeg } from "../services/catalogue/normalizer/entities/obb-leg/ObbLeg.types";
import {
  SelectorSquadBetCardWithModalFields,
  SelectorSquadVsSquadCardWithModalFields,
} from "../state/layout/cards/obb-card/ObbCard.types";
import { ThrottleOverrides } from "../state";

export type SelectorCardWithModalFields = SelectorSquadBetCardWithModalFields | SelectorSquadVsSquadCardWithModalFields;

export type ObbSquadBetQuotesResponse = { legs: NormalizedObbLeg[]; defaultOutcomeIndex: number };

export type ObbQuotesRequest = SquadBetQuotesRequestInput | QuotesRequestInput;

export type ObbQuotesResponse = ObbSquadBetQuotesResponse | ObbQuotesQuery;

export type QuotesApiFn = (req: ObbQuotesRequest, throttleOverrides?: ThrottleOverrides) => Promise<ObbQuotesResponse>;
