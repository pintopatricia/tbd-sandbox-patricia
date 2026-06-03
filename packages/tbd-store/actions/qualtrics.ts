export const QUALTRICS__SEND_NEW_PAGE_NAMED = "QUALTRICS/SEND_EVENT";

export type QualtricsSendAction = {
  type: typeof QUALTRICS__SEND_NEW_PAGE_NAMED;
  payload: {
    pageName: QualtricsView;
  };
};

export enum QualtricsView {
  Account = "Account",
  Betslip = "Betslip",
  GamesMenu = "Games Menu",
  Home = "Home",
  MyBets = "My Bets",
  SkyBetClub = "Sky Bet Club",
}
