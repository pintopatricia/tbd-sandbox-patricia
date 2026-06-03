export type NormalizedObbTemplateParams =
  | NormalizedObbPvpTemplateParams
  | NormalizeObbSquadBetTemplateParams
  | NormalizeObbSquadVsSquadTemplateParams;

type TemplateParamsParticipant = {
  urn: string;
  typename: string;
};
export type NormalizedObbPvpTemplateParams = {
  participantIdA: TemplateParamsParticipant;
  participantIdB: TemplateParamsParticipant;
  outcomeId: string;
  timePeriodId: string;
};

export type NormalizeObbSquadBetTemplateParams = {
  participantIds: Array<TemplateParamsParticipant>;
  outcomeIds: Array<string>;
  value: number;
  timePeriodId: string;
  quantifier: string;
};

export type NormalizeObbSquadVsSquadTemplateParams = {
  squadAParticipantIds: Array<TemplateParamsParticipant>;
  squadBParticipantIds: Array<TemplateParamsParticipant>;
  outcomeIds: Array<string>;
  timePeriodId: string;
  quantifier: string;
};
