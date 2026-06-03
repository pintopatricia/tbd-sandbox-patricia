export const SUBSCRIBE_VIRTUALS_CARD = "SUBSCRIBE_VIRTUALS_CARD";
export const UNSUBSCRIBE_VIRTUALS_CARD = "UNSUBSCRIBE_VIRTUALS_CARD";

export type SubscribeVirtualsCard = {
  type: typeof SUBSCRIBE_VIRTUALS_CARD;
  payload: {
    urn: string;
  };
};

export type UnsubscribeVirtualsCard = {
  type: typeof UNSUBSCRIBE_VIRTUALS_CARD;
};
