import { MouseEvent } from "react";
import { ViewLink } from "@ppb/the-wall-common/types";
import { HeaderCommonProps } from "./Header.types";

type HeaderOnBalanceButtonClick = (event: MouseEvent) => void;
type HeaderOnGenerosityWalletButtonClick = (event: MouseEvent) => void;
type HeaderOnBackClick = (event: MouseEvent) => void;
type HeaderJoinNowBtnTap = () => void;
type HeaderLoginBtnTap = () => void;
type HeaderOnLogoClick = (event: MouseEvent) => void;
type HeaderOnMenuClick = (event: MouseEvent) => void;
type HeaderOnNotificationsClick = (event: MouseEvent) => void;

type HeaderCallbacks = {
  onBackClick: HeaderOnBackClick;
  onLogoClick: HeaderOnLogoClick;
  onBalanceButtonClick: HeaderOnBalanceButtonClick;
  onGenerosityWalletButtonClick: HeaderOnGenerosityWalletButtonClick | HeaderOnBalanceButtonClick;
  onLoginButtonTap?: HeaderLoginBtnTap;
  onJoinNowButtonTap?: HeaderJoinNowBtnTap;
  onMenuClick?: HeaderOnMenuClick;
  onNotificationsClick?: HeaderOnNotificationsClick;
  shouldAccountForXSellBar?: boolean;
};

type HeaderWebProps = HeaderCommonProps & {
  canGoBack: boolean;
  /** Logo link aria-label */
  logoUrl?: ViewLink["viewUrl"];
  viewUrn: string;
  extraHeaderHeight?: number;
  shouldAccountForXSellBar?: boolean;
};

export type HeaderWebViewModel = HeaderWebProps & HeaderCallbacks;
