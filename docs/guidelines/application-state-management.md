# Application State Management

The application state management solution, uses Redux to provide a centralized Store.

## Actions / Action Creators

This section focuses on guidelines and best practices about how to create, organize and maintain _state actions_ in order to promote:

- better code reading
- better separation of concerns
- consistency accross all the existing redux actions

##### ➡️ Guideline: Use `WHERE/WHAT(_STATUS)?` for Action Types

- Can be checked by Static Code Analysis: ⚠️
- Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

- WHERE indicates the source that emits the action. If the action is emitted by an entity that is not related to UI, such as a saga, then the external data source name should be used. List of possible sources:
- UI: `UI/(PAGE_X_)?COMPONENT_Y_VERB`: e.g.: `UI/BETSLIP_EXC_PRICE_INPUT_CHANGE`, the price input component for an exchange potential bet in the betslip overlay
- URL: the url can be parsed with a command from query params, e.g.: `URL/EXC_ADD_BETS`
- NETWORK: events related to network requests, e.g.: `NETWORK/EXC_MARKET_UPDATES_FETCH_SUCCESS, NETWORK/LAYOUT_FETCH_SUCCESS`
- Other structures should be added to this list of prefixes
- WHAT describes the interaction `SUBJECT_VERB`
  - should contain a subject, e.g.: `BETSLIP_EXC_PRICE_INPUT`
  - should contain a verb e.g.: `CLICK, SWIPE, SCROLL, CHANGE, DRAG, FETCH`.
- STATUS describes a possible state of a multi-stage action
  - Network requests always have `_IN_PROGRESS, _SUCCESS, _FAILURE`
  - Drag and drop event could be interpreted as `DRAG_START, DRAG_MOVE, DRAG_STOP` (this is just an example, drag and drop can be local state)

Note: As per `/` is not valid for variable names, it should be replaced by `__`.

</details>

<details>
  <summary>👍👎 Examples</summary>
  <br />

_Good:_
`export const UI__MARKET_EXC_BET_BUTTON_CLICK = "UI/MARKET_EXC_BET_BUTTON_CLICK";`

_Bad:_
`export const THE_MARKET_BET_BUTTON_ACTION = "UI/MARKET_EXC_BET_BUTTON_CLICK";`

</details>

##### ➡️ Guideline: Do not use Action Creators (use Typed Actions instead)

- Can be checked by Static Code Analysis: ✅
- Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

By using action creators, the developer must explicitly create a function to be called by the `dispatch` method. This function leads to extra code (and unit tests), leading to higher maintenance costs. By leveraging the type system that Typescript offers, we are able to get the same functionality without having to maintain code on the long run.

</details>

<details>
  <summary>👍👎 Examples</summary>
  <br />
  
  *Good:*
  ```
  dispatch<BetslipExchangeRemovePotentialBetClickAction>({
        type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_BET_CLICK,
        payload
      })
  ```

❗ _Good:_ ❗

```
function persistenceTypeChange(runner: URN, side: ExchangeSide, persistenceType: string, size?: number, price?: number ): PersistenceTypeInputChange[] {
return [
  {
    type: UI__BETSLIP_EXC_UNMATCHED_PERSISTENCE_ITEM_CLICK
  },
  {
    type: BETTING__UPDATE_UNMATCHED_BET_ACTION,
    payload: {
      runner,
      price,
      size,
      side,
      persistenceType
    }
  }
];
}
```

_Bad:_

```
function createMarketExchangeBetButtonClickAction({urn, price, side }: { urn; price?: number; side: ExchangeSide; }): MarketExchangeBetButtonAction[] {
  // Action creator goes here
}

dispatch(createMarketExchangeBetButtonClickAction(bet))
```

</details>

## State selectors and View Models

This section focuses on guidelines and best practices about how to create, organize and maintain _state selectors_ and _view models_ in order to promote:

- better code reading
- better separation of concerns
- composition and code reuse
- better performance on querying the store for data
- better performance on calculating view models for a certain piece of DOM/View trees.

### Selectors

State selectors are those responsible for querying the state for data and should be the only ones performing such queries. I.e. everytime there's the need for querying data on the `state` it should be done via selector. Whether the consumer is a _Connected component_ or a _middleware_ or any other piece of JS that needs access to the application state.

##### ➡️ Guideline: Selectors should be memoized and consumed through factory functions

- Can be checked by Static Code Analysis: ✅
- Is this being checked by Static Code Analysis: ✅

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

In order to avoid repeated queries to the store and lead to potential and undesired component updates, selectors should be memoized using [reselect], according to our decision outcome at [ADR 0028-memoization](https://gitlab.app.betfair/tbd/mobile-site/blob/master/docs/decisions/0028-memoization.md).

Additionaly, due to the [constraints of reselect's cache size of 1](https://github.com/reduxjs/reselect#q-can-i-share-a-selector-across-multiple-component-instances), and in order to avoid invalidating other memoized functions, reselect selectors should be exported and consumed via factory functions.

</details>

<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

_Good:_

```js
// cards.ts
export const createFixtureCardbyURNSelector = () => createSelector(...);;
export const createEventMarketCardByURNSelector = () => createSelector(...);;
export const createViewLinkCardByURNSelector = () => createSelector(...);;
```

_Bad:_

```js
// cards.ts
export const getFixtureCardbyURN = createSelector(...);
export const getEventMarketCardByURN = createSelector(...);
export const getViewLinkCardByURN = createSelector(...);
```

</details>

##### ➡️ Guideline: Connected components should implement factory functions too

- Can be checked by Static Code Analysis: ✅
- Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

Consuming selectors via factory functions implies implementing factory functions on `mapStateToProps` method in connected components.

</details>

<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

_Good:_

```js
const makeMapStateToProps = () => {
  const getEventMarketCardByURN = createEventMarketCardByURNSelector();

  return function mapStateToProps(state, { urn }) {
    const eventMarket = getEventMarketCardByURN(state.layouts.cards.eventmarkets, urn);
    ...
  };
};
```

_Bad:_

```js
function mapStateToProps(state, { urn }) {
    const eventMarket = createEventMarketCardByURNSelector()(
      state.layouts.cards.eventmarkets,
      urn
    );
    ...
};
```

</details>

##### ➡️ Guideline: Selectors should consume the smallest store slice possible

- Can be checked by Static Code Analysis: 🚫
- Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

Having selectors consuming smaller state slices promotes its reuse, its composition and less cache invalidations, because:

- if I have the selector `A(state, props)` and I need to use this selector on B as follows:

```js
const B = createSelector([
  state => state,
  state => C(state, props)
], (state, resultFromC) => {
  const resultFromC.items.map(id => A(state, { id }));
});
```

This implies that the selector `B` receives the entire `state` as input, and since the state is always updated in a immutable manner, it will be always invalidating cache which defeats the purpose of using `createSelector` in the first place.

</details>

<details>
  <summary>👍👎 Examples</summary>
  <br />
  
  *Good:*
  ```js
  const getSportEventByFixtureURN = createSelector(
    [
      (entities, urn) => getFootballFixtureByURN(entities.footballfixtures, urn),
      (entities) => entities.sportevents
    ],
    (fixture, sportevents) => {
      return fixture ? getSportEventByURN(sportevents, fixture.sportevent) : undefined;
    }
  );
  ```

_Bad:_

```js
const getSportEventByFixtureURN = createSelector(
  [state => state, (state, urn) => getFootballFixtureByURN(state, urn)],
  (state, fixture) => {
    // <----- STATE AS INPUT - cache invalidated on every state update
    return fixture ? getSportEventByURN(state, fixture.sportevent) : undefined;
  }
);
```

</details>

##### ➡️ Guideline: Selectors should live next to the store (`store/state/` folder).

- Can be checked by Static Code Analysis: 🚫
- Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

In order to group files with similar responsabilities, our store scaffold is organized by Domain (reference: ["Domain-style"](https://redux.js.org/faq/code-structure#what-should-my-file-structure-look-like-how-should-i-group-my-action-creators-and-reducers-in-my-project-where-should-my-selectors-go)), meaning that all reducers and selectors are close to each other and are organized according to the Data Domain that each one is dealing with.

I.e. selectors should be placed on the file that identifies the state slice it consumes, and so it should look like the following:

```
.
|____state
| |____state-selectors.ts
| |____state-selectors.test.js
| |____layouts
| | |____layouts-selectors.ts
| | |____layouts-selectors.test.js
| | |____views
| | | |____sport-view-reducer.ts
| | | |____sport-view-reducer.test.js
| | | |____event-view-reducer.ts
| | | |____event-view-reducer.test.js
| | | |____sport-view-selectors.ts
| | | |____sport-view-selectors.test.js
| | | |____event-view-selectors.ts
| | | |____event-view-selectors.test.js
| | | |____market-view-selectors.ts
| | | |____market-view-selectors.test.js
| | | |____...
| | |____cards
| | |____cardgroups
| |____entities
| | |____sports
| | |____...
| |____router
| | |____router-reducer.ts
| | |____router-reducer.test.js
| | |____router-selectors.ts
| | |____router-selectors.test.js
```

</details>

<details>
  <summary>👍👎 Examples</summary>
  <br />

```js
const getCardbyURN = createSelector(
  [
    (cards: Cards, urn) => getMarketCardByURN(cards.markets, urn),
    (cards: Cards, urn) => getEventMarketCardByURN(cards.eventmarkets, urn),
    (cards: Cards, urn) => getFixtureCardbyURN(cards.fixtures, urn),
    ...
  ],
  (marketCard, eventMarketCard, fixtureCard, ...): Card | null => {
    return marketCard || eventMarketCard || fixtureCard || ... || null;
  }
);
```

_Good:_
This selector composes "market", "event market" and "fixture" cards. Since its common ancestor is the _"Cards"_ it consumes this slice and it's placed at `state/layouts/cards/cards.ts`

_Bad:_
This selector is placed at `state/state-selectors.ts`

---

```js
const getSportEventByFixtureURN = createSelector(
  [(entities, urn) => getFootballFixtureByURN(entities.footballfixtures, urn), entities => entities.sportevents],
  (fixture, sportevents) => {
    return fixture ? getSportEventByURN(sportevents, fixture.sportevent) : undefined;
  }
);
```

_Good:_
This selector composes "fixtures" and "sport event" entities. Since its common ancestor is the _"Entities"_ slice it consumes this slice and it's placed at `store/state/entities/entities-selectors.ts`

_Bad:_
This selector is placed at `store/state/applicational-state-selectors.ts`

</details>

##### ➡️ Guideline: Selectors shouldn't have logic to adapt the domain data model to the view data model.

- Can be checked by Static Code Analysis: ✅
- Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

The responsability of the selector is exclusively to query data from the store.
The responsability of adapting it to a view model or a different data model (e.g, analytics) should be done as a separate javascript module, aiming for function composability.

</details>

<details>
  <summary>👍👎 Examples</summary>
  <br />
  
  *Good:*
  ```js
  // fixtures.ts
  const createPenaltyShootoutByFixtureURNSelector = (footballfixtures, urn) => {
    return footballfixtures[urn].penaltyShootout; // a subset of state
  };

// view-model-factories/scoreboard.ts
function getPenaltyShootoutProps(penaltyShootout) {
return { // the view model
...
}
}

// SomeConnectedComponent.tsx
const makeMapStateToProps = () => {
...
const getPenaltyShootoutByFixtureURN = createPenaltyShootoutByFixtureURNSelector();

    return function mapStateToProps(state, { urn, viewMode, clickable = false }) {
      const penaltyShootout = getPenaltyShootoutByFixtureURN(state.entities.footballfixtures, urn);

      return getPenaltyShootoutProps(penaltyShootout); // view model
      ...
    }

}

````

*Bad:*

```js
// view-model-factories/scoreboard.ts
import { getPenaltyShootoutProps } from "view-model-factories/scoreboard.ts";
const createPenaltyShootoutByFixtureURNSelector = (footballfixtures, urn) => {
  return getPenaltyShootoutProps(footballfixtures[urn].penaltyShootout); // View Model
};
````

</details>

##### ➡️ Guideline: Selectors should keep consistency on its nomenclature

- Can be checked by Static Code Analysis: ✅
- Is this being checked by Static Code Analysis: ✅

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

Selectors should be exported always as factory functions as discussed above, and so the nomenclature should be consistent in order for developers easily spot selectors and know that it is a factory function. Plus, the selector

The nomenclature should follow the following template: `create[selector-name]Selector`, where selector nname should be clear on describing what data it is fetching from the store.

</details>

<details>
  <summary>👍👎 Examples</summary>
  <br />

_Good:_

- `createTeamLineupCardByURNSelector`
- `createMarketCardByURNSelector`
- `createRecentFormCardByURNSelector`

_Bad:_

- `getTeamLineup`
- `marketCard`
- `fetchRecentFormFromStore`
  </details>

### View models

##### ➡️ Guideline: View model functions that generate new references should be memoized

- Can be checked by Static Code Analysis: 🚫
- Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

For those VMs that require the manipulation of the selector's outputs by creating new objects and therefore leading to new object references, must be memoized too. Otherwise the `mapStateToProps` will be always returning new object refereces, leading to undesired tree/component updates.

</details>

<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

_Good:_

```js
 // scoreboard.ts
 export const createPropsForScoreboardVm = () =>
   createSelector(
     [footballFixture => footballFixture],
     (footballFixture) => {
       ...
     }
   );

 // ConnectedFootballFixture.tsx
 const makeMapStateToProps = () => {
   ...
   const getPropsForScoreboard = createPropsForScoreboardVm();

   return function mapStateToProps(state, { urn, viewMode, clickable = false }) {
     const footballFixture = getFootballFixture(state.entities.footballfixtures, urn);
     const scoreboardProps = getPropsForScoreboard(footballFixture, urn);
     ...
   }
 }
```

_Bad:_

```js
 return function mapStateToProps(state, { urn, viewMode, clickable = false }) {
   const footballFixture = getFootballFixture(state.entities.footballfixtures, urn);
   const scoreboardProps = getPropsForScoreboard(footballFixture, urn); // <---- NO MEMOIZATION AT ALL, returning always a new object and therefore, invalidating cache
   ...
 }
```

</details>

##### ➡️ Guideline: View models should not depend on selectors, it should receive plain data objects

- Can be checked by Static Code Analysis: 🚫
- Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

When applying the `createSelector` to a VM function, it can be tempting to have selectors being directly called in the array of input selectors. However, this should be avoided to keep a clear and strong boundary between selectors and view models.

</details>

<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

_Good:_

```js
 export const createPropsForScoreboardVm = createSelector(
     [footballFixture => footballFixture], // just a plain object, doesn't matter where it comes from
     (footballFixture) => {
       ...
     }
   );
```

_Bad:_

```js
 export const createPropsForScoreboardVm = () =>
   const getFootballFixtureByURN = createFootballFixtureByURNSelector();

   return createSelector(
     [
       (footballFixtures, urn) => getFootballFixtureByURN(footballFixtures, urn) // now our VM knows about selectors and depends on them
     ],
     (footballFixture) => {
       ...
     }
   );
```

</details>

## Other considerations to keep in mind

##### ➡️ You might need a "shallow/deep equality" compare function

For those selectors that return more complex and nested data structures like market prices and football fixtures, it's very likely that the default "reference equality" check from reselect would not be enough, in the sense that object references might be lost but the values are still the same.

For these cases, having a "shallow/deep equality" compare function might be the way to go. Check [defaultMemoize(func, equalityCheck = defaultEqualityCheck)] and [Customize equalityCheck for defaultMemoize] sections at [reselect]'s docs for further details.

## Auxiliary resources

**Memoization demo on a real use case**

Additionally to these guidelines, a series of videos was recorded exploring a specific use case where we had some performance issues. This use case was a "_match stats card_" that would render everytime there was a state update, even if there was no new data to be present to the user.

In the videos the author approaches different problems in terms of store selectors, view models and memoization and so, videos are organized as follows:

1. [Get to know your data model and use cases](https://betfairprod-my.sharepoint.com/:v:/g/personal/rodolfo_goncalves_paddypowerbetfair_com/EYzVwH9EsvVDmulHgrOMclQB_Wg2JN1smPbEr_aFggXCAg?e=TvIvgL)

Really brief introduction looking at the use case that we will be working on, having an overview about the component props and the pieces of state that are being used.

2. [What data do you really need?](https://betfairprod-my.sharepoint.com/:v:/g/personal/rodolfo_goncalves_paddypowerbetfair_com/ERlIMlXVsJJKjPUZYxJuX7ABXMOBO70_YPVdsgOZX4_BKw?e=n3hDX7)

A bit more detailed analysis about the data that is being used by the component _VS_ the data we really need to present to the user.

3. [Do we need custom compare functions?](https://betfairprod-my.sharepoint.com/:v:/g/personal/rodolfo_goncalves_paddypowerbetfair_com/EYXT67R-vtdBrPs3xhW_YDcBDMC9jJ_gcjoe_yQ6jq_Efw?e=wkRFHa)

A use case of custom compare functions. Evaluating if we should use these and when.

4. [Favour selectors composition](https://betfairprod-my.sharepoint.com/:v:/g/personal/rodolfo_goncalves_paddypowerbetfair_com/ETnMuxzTVNBCjurCUCWP1ZcBR_NMU5bhtbPAhf5VmUILZg?e=y5Za8a)

A sum up of all the different selectors that we have been working on, composing all this into a single and data rich Match Stats selector.

5. [What about View Models? (and a final wrap up)](https://betfairprod-my.sharepoint.com/:v:/g/personal/rodolfo_goncalves_paddypowerbetfair_com/EZFHSxiMaddBlMJ0JQsEeH0BkBs-_wxKebFfoUjeHanUFQ?e=TtCRGW)

Final results, and a quick review over our current selector guidelines.

[reselect]: https://github.com/reduxjs/reselect
[defaultmemoize(func, equalitycheck = defaultequalitycheck)]: https://github.com/reduxjs/reselect#defaultmemoizefunc-equalitycheck--defaultequalitycheck
[customize equalitycheck for defaultmemoize]: https://github.com/reduxjs/reselect#customize-equalitycheck-for-defaultmemoize
