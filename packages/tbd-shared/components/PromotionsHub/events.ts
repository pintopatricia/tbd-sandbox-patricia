import { ViewLink } from "@ppb/the-wall-common/types";

type BasePromotionsHubCardAction = {
  urn: string;
};

type ViewLinkPromotionsHubCardAction = BasePromotionsHubCardAction & {
  action?: ViewLink;
};

type CardTapPromotionsHubCardAction = CtaTapPromotionsHubCardAction & {
  action?: ViewLink;
  title: string;
};

type CtaTapPromotionsHubCardAction = ViewLinkPromotionsHubCardAction & {
  promoCode: string;
};

type OptInPromotionsHubCardAction = {
  _typename: string;
  promotionUrn: string;
  promoCode: string;
  title: string;
  subTitle: string | null;
  optInState: string;
  status: string | null;
  actionLabel: string;
};

type PebblesPromotionsHubCardAction = BasePromotionsHubCardAction & {
  filters: Array<{ filterName: string; filterCount: number }>;
};

type PebblePromotionsHubCardAction = BasePromotionsHubCardAction & {
  pebbleUrn: string;
  filterName: string;
};

export type PromotionsHubEvents = {
  "@@UI/PROMOTIONS_HUB_CARD_TAP": CardTapPromotionsHubCardAction;
  "@@UI/PROMOTIONS_HUB_CARD_CTA_TAP": CtaTapPromotionsHubCardAction;
  "@@UI/PROMOTIONS_HUB_CARD_OPT_IN_TAP": OptInPromotionsHubCardAction;
  "@@UI/PROMOTIONS_HUB_CARD_GROUP_BACK_TO_HOMEPAGE_TAP": BasePromotionsHubCardAction;
  "@@UI/PROMOTIONS_HUB_CARD_GROUP_LOADED": BasePromotionsHubCardAction;
  "@@UI/PROMOTIONS_HUB_CARD_GROUP_PEBBLE_LIST_DISPLAYED": PebblesPromotionsHubCardAction;
  "@@UI/PROMOTIONS_HUB_CARD_GROUP_PEBBLE_CLICK": PebblePromotionsHubCardAction;
  "@@UI/PROMOTIONS_HUB_CARD_GROUP_EMPTY": BasePromotionsHubCardAction;
};
