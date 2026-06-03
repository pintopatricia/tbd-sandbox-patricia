import { SagaIterator } from "redux-saga";
import { call, delay, put, race, select, take, takeLatest } from "redux-saga/effects";
import { ApplicationState } from "../../state/ApplicationState.types";
import { FetchCatalogueSuccessAction, FETCH_CATALOGUE_SUCCESS } from "../../actions/catalogue";
import { PUSH } from "../../actions/router";
import catalogueService, { CatalogueServiceLayout } from "../../services/catalogue/catalogue-service";

import { createContextForBFFSelector } from "../../state/entities/isomorphic-selectors";
import { NavigationTab } from "../../state/layout/navigation-tabs-list/NavigationTabsList.types";
import { SUBSCRIBE_VIRTUALS_CARD, SubscribeVirtualsCard, UNSUBSCRIBE_VIRTUALS_CARD } from "../../actions/virtuals";
import { SelectableItemsCardGroup } from "../../state/layout/cardgroups/CardGroup.types";

const POLL_RATE = 5000;
const RETRY_DELAY = 2000;

const getContextForBFF = createContextForBFFSelector();

function* getCardData(card: NavigationTab | SelectableItemsCardGroup): SagaIterator<CatalogueServiceLayout | null> {
  const {
    userPreferences,
    productExclusions,
    experiments,
    throttleOverrides,
    router,
  }: ReturnType<typeof getContextForBFF> = yield select((state: ApplicationState) =>
    getContextForBFF(state.entities, state.router),
  );

  try {
    return yield call(
      catalogueService.getCards,
      [card.urn],
      undefined,
      userPreferences,
      productExclusions,
      experiments,
      throttleOverrides,
      router,
      undefined,
      undefined,
    );
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Virtual card update", err);
  }

  return null;
}

function* refreshSelectableCardGroup(card?: SelectableItemsCardGroup | null): SagaIterator {
  if (!card) {
    return RETRY_DELAY;
  }

  const response: CatalogueServiceLayout | null = yield call(getCardData, card);

  if (!response) {
    return RETRY_DELAY;
  }

  yield put<FetchCatalogueSuccessAction>({
    type: FETCH_CATALOGUE_SUCCESS,
    payload: response,
  });

  return POLL_RATE;
}

function* pollCycle(card?: SelectableItemsCardGroup | null): SagaIterator {
  while (true) {
    const nextTickDelay = yield call(refreshSelectableCardGroup, card);
    yield delay(nextTickDelay);
  }
}

function* pollVirtualSelectableItemsCardGroup(action: SubscribeVirtualsCard): SagaIterator {
  const card: SelectableItemsCardGroup = yield select((state: ApplicationState) =>
    Object.values(state.layouts.cardgroups.selectableitemscardgroups).find(({ items }) =>
      items.find((item) => item.urn === action.payload.urn),
    ),
  );

  yield race([take([PUSH, UNSUBSCRIBE_VIRTUALS_CARD]), call(pollCycle, card)]);
}

export function* virtualsSaga(): SagaIterator {
  yield takeLatest(SUBSCRIBE_VIRTUALS_CARD, pollVirtualSelectableItemsCardGroup);
}
