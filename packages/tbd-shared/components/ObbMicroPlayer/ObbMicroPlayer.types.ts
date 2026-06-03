import { PlayerNames } from "../../helpers/obb";

export type Jersey = string | undefined;

export type ObbMicroPlayerVariant = "single" | "multi";

export type ObbMicroPlayerSize = "small" | "large";

export type ObbMicroPlayerProps = {
  players: Array<PlayerNames>;
  jerseys: Array<Jersey>;
  jerseySize?: ObbMicroPlayerSize;
  variant?: ObbMicroPlayerVariant;
  hasBackground?: boolean;
  onRemovePlayerClick?: () => void;
  isActionLinkEnabled?: boolean;
  onActionLinkClick?: () => void;
};
