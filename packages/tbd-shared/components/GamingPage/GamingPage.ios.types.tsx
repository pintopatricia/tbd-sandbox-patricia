export type GameLaunchInfo = {
  gameId: string;
  isFromCpp: boolean;
};

export type GamesFrameworkConfigProps = {
  applicationKey?: string;
  countryCode?: string;
  currencyCode?: string;
  environment?: string;
  environmentType?: string;
  drkHeaderValue?: string;
  gameLaunchInfo?: GameLaunchInfo | null;
  jurisdiction?: string;
  localeCode?: string;
  loggedIn?: boolean;
  performanceCookiesStatus: number;
  screen?: string;
  deepLinkUrl?: string | undefined;
  deepLinkUrn?: string | undefined;
  ssoId?: string | null;
  openedLoginScreen?: boolean;
  theme?: string;
  otpConsent?: string;
};
