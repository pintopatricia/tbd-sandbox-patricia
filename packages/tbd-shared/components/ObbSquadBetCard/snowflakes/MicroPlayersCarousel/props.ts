import { PlayerWithJersey } from "../../../../helpers/obb";

export type MicroPlayersCarouselProps = {
  players: PlayerWithJersey[];
  onScrollArrowClick?: (direction: "previous" | "next") => void;
  onClick?: () => void;
  onEditSquadButtonClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  onRemovePlayerClick?: (playerUrn: string) => void;
};

export const areMicroPlayersCarouselPropsEqual = (
  prevProps: MicroPlayersCarouselProps,
  nextProps: MicroPlayersCarouselProps,
): boolean => {
  const prevPlayers = prevProps.players;
  const nextPlayers = nextProps.players;

  if (prevPlayers.length !== nextPlayers.length) {
    return false;
  }

  for (let i = 0; i < prevPlayers.length; i += 1) {
    const prevPlayer = prevPlayers[i];
    const nextPlayer = nextPlayers[i];

    if (
      prevPlayer.status !== nextPlayer.status ||
      (prevPlayer.status === "loaded" &&
        nextPlayer.status === "loaded" &&
        (prevPlayer.urn !== nextPlayer.urn ||
          prevPlayer.jersey !== nextPlayer.jersey ||
          prevPlayer.firstName !== nextPlayer.firstName ||
          prevPlayer.lastName !== nextPlayer.lastName))
    ) {
      return false;
    }
  }

  if (prevProps.onClick !== nextProps.onClick) {
    return false;
  }

  if (prevProps.onEditSquadButtonClick !== nextProps.onEditSquadButtonClick) {
    return false;
  }

  if (prevProps.onRemovePlayerClick !== nextProps.onRemovePlayerClick) {
    return false;
  }

  return true;
};
