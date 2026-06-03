import { TimerProps } from "../../../TimerCountDown/snowflakes/Timer/Timer.types";

export type PlayNewProps = {
  isStaticPromo: boolean;
  title?: string;
  subtitle: string | null;
  buttonLabel?: string;
  moreInfoLabel: string;
  timer?: TimerProps;
  logoImage: string | null;
  backgroundImage: string | undefined;
  targetUrl: string | undefined;
  arrowImage: string | undefined;
  badgeLabel: string;
  onMoreInfoClick: () => void;
  onPlayNowClick: () => void;
  promotionsCDN: string;
  pmas3PromotionsCDN: string;
};
