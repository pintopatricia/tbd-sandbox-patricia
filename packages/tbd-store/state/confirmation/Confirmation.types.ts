export type ActionLike = { type: string; payload?: Record<string, unknown> };

export type ConfirmationCode = "BETTING_GROUP_SWITCH" | "BETTING_CLEAR" | "BETTING_BETSLIP_TYPE_SWITCH";

export type ConfirmationState = {
  refuseActions: ActionLike[];
  acceptActions: ActionLike[];
  id: ConfirmationCode;
} | null;
