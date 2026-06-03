export enum GameTileContainerLayout {
  SQUARE = "SQUARE",
  RECTANGLE = "RECTANGLE",
}

export type GameTileContainerProps = {
  layout?: GameTileContainerLayout;
  children: React.ReactNode;
  cardRef?: React.Ref<HTMLDivElement>;
};
