export type BetButtonsCarouselProps = {
  children: React.ReactNode;
  pageSize: number;
  initialIndex?: number;
  forceScrollToIndex?: boolean;
  onLeftArrowClick?: () => void;
  onRightArrowClick?: () => void;
};
