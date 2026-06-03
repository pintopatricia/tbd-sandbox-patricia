export type AcceptPromoCardI18N = {
  accept: string;
};

export type AcceptPromoCardProps = {
  title: string;
  tcText: string;
  image: string;
  i18n: AcceptPromoCardI18N;
} & AcceptPromoCardViewModel;

export type AcceptPromoCardOnAcceptCallback = () => void;

export type AcceptPromoCardViewModel = {
  onAccept: AcceptPromoCardOnAcceptCallback;
};
