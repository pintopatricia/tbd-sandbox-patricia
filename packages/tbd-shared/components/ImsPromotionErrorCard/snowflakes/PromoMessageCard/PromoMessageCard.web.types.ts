import { AlertType } from "@ppb/the-wall-common/types";

export type PromoMessageI18N = {
  seeAllLabel: string;
  seeAllInfo: string;
  recommended: string;
};

export type PromoMessageProps = {
  title: string;
  body: string;
  type: AlertType;
  i18n: PromoMessageI18N;
} & PromoMessageCallbacks;

export type SeeAllPromosOnButtonClick = () => void;

export type PromoMessageCallbacks = {
  onSeeAll: SeeAllPromosOnButtonClick;
};
