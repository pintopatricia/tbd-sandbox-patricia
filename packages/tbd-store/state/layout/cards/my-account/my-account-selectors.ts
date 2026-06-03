import { createSelector, ParametricSelector } from "reselect";
import { RewardsCard, AccountBannersCard, Cards } from "../Card.types";
import { ApplicationState } from "../../../ApplicationState.types";
import { createFindCardbyURNSelector } from "../cards-selectors";
import { getUserFirstName, getUserJurisdiction } from "../../../entities/user-details/user-details-selectors";
import { Jurisdiction } from "../../../../config/Jurisdiction";
import URN from "../../URN";

export const getMyAccountInterfaceOpenState = (state: ApplicationState): boolean =>
  state.layouts.cards.myaccount.isOpen;

export const createMyAccountInterfaceStateSelector = () =>
  createSelector(
    [
      (state: ApplicationState) => <string>getUserFirstName(state),
      (state: ApplicationState) => <Jurisdiction>getUserJurisdiction(state.entities.userdetails),
      getMyAccountInterfaceOpenState,
    ],
    (firstName, jurisdiction, isOpen) => ({ firstName, jurisdiction, isOpen }),
  );

export const createMyAccountViewItemsSelector = (urn: URN) =>
  createSelector([(state: ApplicationState) => state.layouts.views.myAccount[urn]], (view) => (view ? view.items : []));

export const createQuickLinksSelector = (urn: URN) => {
  const getCardbyURNSelector = createFindCardbyURNSelector();
  return createSelector([(state: ApplicationState) => state.layouts.cards], (cards) => {
    const card = getCardbyURNSelector(cards, urn);
    return card !== null && card.typename === "QuickLinksCard" ? card.links : [];
  });
};

export const createWalletNamesSelector = (urn: URN) => {
  const getCardbyURNSelector = createFindCardbyURNSelector();
  return createSelector([(state: ApplicationState) => state.layouts.cards], (cards) => {
    const card = getCardbyURNSelector(cards, urn);
    return card !== null && card.typename === "BalanceCard" ? card.wasWallets : [];
  });
};

export const createWalletSectionsSelector = (urn: URN) => {
  const getCardbyURNSelector = createFindCardbyURNSelector();
  return createSelector([(state: ApplicationState) => state.layouts.cards], (cards) => {
    const card = getCardbyURNSelector(cards, urn);
    return card !== null && card.typename === "BalanceCard" ? card.walletSections : [];
  });
};

export const createLinksSelector = (urn: URN) => {
  const getCardbyURNSelector = createFindCardbyURNSelector();
  return createSelector([(state: ApplicationState) => state.layouts.cards], (cards) => {
    const card = getCardbyURNSelector(cards, urn);
    return card !== null && card.typename === "LinksCard" ? card.sections : [];
  });
};

export const createRewardsCardBySelector = (): ParametricSelector<Cards, URN, RewardsCard | undefined> => {
  const getCardbyURNSelector = createFindCardbyURNSelector();

  return createSelector(
    [(cards: Cards, urn: URN) => getCardbyURNSelector(cards, urn)],
    (card): RewardsCard | undefined => (card && card.typename === "RewardsCard" ? card : undefined),
  );
};

export const createAccountBannersCardBySelector = (): ParametricSelector<
  Cards,
  URN,
  AccountBannersCard | undefined
> => {
  const getCardbyURNSelector = createFindCardbyURNSelector();

  return createSelector(
    [(cards: Cards, urn: URN) => getCardbyURNSelector(cards, urn)],
    (card): AccountBannersCard | undefined => (card && card.typename === "AccountBannersCard" ? card : undefined),
  );
};
