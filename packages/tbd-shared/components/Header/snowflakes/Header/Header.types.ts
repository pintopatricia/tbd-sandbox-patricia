import { LogoProduct } from "../../../BetSharingCardGroup/snowflakes/Logo/Logo.types";

export type HeaderCommonProps = {
  isLoggedIn: boolean;
  isMaintenance: boolean;
  isNotificationsCenterEnabled: boolean;
  hasUnreadNotifications: boolean;
  logoProduct?: LogoProduct;
  showBalances: boolean;
  accountBalance?: string;
  showMenu?: boolean;
  labels: {
    headerWalletLabel?: string;
    loginButtonLabel: string;
    joinNowButtonLabel: string;
  };
};
