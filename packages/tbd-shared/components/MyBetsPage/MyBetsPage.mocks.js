export const orderTypeListMock = [
  {
    id: "open",
    title: "I18N.MY_BETS.ORDER_TYPE.OPEN",
  },
  {
    id: "settled",
    title: "I18N.MY_BETS.ORDER_TYPE.SETTLED",
  },
];

export const productTypeListMock = [
  {
    id: "exc",
    text: "I18N.EXCHANGE",
  },
  {
    id: "sbk",
    text: "I18N.SPORTSBOOK",
  },
];

export const defaultSelectedOrderTypeMock = orderTypeListMock[0].id;
export const defaultSelectedProductTypeMock = productTypeListMock[0].id;

export const labelsMock = {
  title: "title",
  resetButtonText: "resetButtonText",
  resetAlertText: "alertText",
  homepageButtonText: "homepageButtonMock",
  toastLabelText: "toastLabelText",
};

export const emptyStateSubTitleMock = "emptyStateSubtitleMock";
export const emptyTransactionTitleMock = "emptyTransactionTitleMock";

export const headerItemsMock = [
  {
    typename: "GenericSwitcherCard",
    urn: "ppb:tbd:card:genericswitcher:mybets",
  },
];

export const myBetsViewMock = {
  url: "mybets/myBets:settled",
  settlementLink: "brand.com/help",
  items: [
    { urn: "ppb:tbd:card:sbkBet:1", typename: "BetCardGroup" },
    { urn: "ppb:tbd:card:sbkBet:2", typename: "BetCardGroup" },
    { urn: "ppb:tbd:card:footer", typename: "Footer" },
  ],
  pageInfo: {
    hasNextPage: true,
  },
  headerItems: headerItemsMock,
};

export const myBetsItemsMock = [
  { urn: "ppb:tbd:card:sbkBet:1", typename: "BetCardGroup" },
  { urn: "ppb:tbd:card:sbkBet:2", typename: "BetCardGroup" },
  { urn: "ppb:tbd:card:footer", typename: "Footer" },
];

export const settlementLinkLabelMock = "Need help?";
