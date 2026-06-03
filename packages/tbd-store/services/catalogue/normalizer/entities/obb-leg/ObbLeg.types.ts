import { ObbLegTemplateId, ObbQuote, ObbSportEvent } from "../../../../../state/entities/obb-legs/ObbLegs.types";
import { NormalizedObbTemplateParams } from "../obb-template-params/ObbTemplateParams.types";

export type NormalizedObbLeg = {
  id: string;
  templateId: ObbLegTemplateId;
  templateParams?: NormalizedObbTemplateParams;
  quote: ObbQuote;
  event: ObbSportEvent;
};
