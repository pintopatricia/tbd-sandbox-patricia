# Redux Action Definition

## TL;DR

1. Actions should describe interactions and not consequences of said interactions
2. Actions have sources: user input, network, url, and other sources based on browser events
3. [Actions do not have a 1:1 relationship with a reducer.](https://redux.js.org/faq/actions#is-there-always-a-one-to-one-mapping-between-reducers-and-actions) Any reducer can listen to an existing action (1:N action:reducer).
4. [N simultaneous number of actions can be dispatched synchronously.](https://redux.js.org/faq/actions#should-i-dispatch-multiple-actions-in-a-row-from-one-action-creator) However, ask if these actions are related but independent, or should actually be represented as one action (a single event source).
5. Actions should discriminate their origin through naming conventions, i.e. a prefix (e.g.: `UI, URL, NETWORK`)
6. Action names should contain a verb (e.g.: `CLICK, SWIPE, SCROLL, FETCH, ADD`)
7. Multi-stage actions should clearly define all states with a suffix (e.g.: `_IN_PROGRESS, _SUCCESS, _FAILURE`)
8. Actions should always cause changes in the store or trigger side effects
   - e.g.: a button might emit an action that doesn't trigger any immediate visual change (loading state not implemented, but a middleware dispatches a network request)
   - Actions for analytics / logging are an exception to this rule. With only local UI state, an action must be emitted with all local UI state for the analytics middleware.

## Naming conventions

According to 5,6,7, actions should be modelled as WHERE/WHAT(_STATUS)?
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

## Reasoning

Reasons for 1-4: If an action describes its consequences:
   - A tight coupling between component and business logic is created
   - New features on top of existing behaviour force the developer to emit new actions in component callbacks instead of reacting to the source event
   - Multiple action dispatch would be a recurrent issue (e.g.: a `BET_BUTTON_CLICK` would instead be `[ADD_POTENTIAL_BET, SHOW_BETSLIP, HIDE_SEARCH, FLASH_THAT_FANCY_ANIMATION]`)
   - Actions are coupled to a single reducer which handles the specific consequence
   - Action overload makes the action log harder to read and debug
   - Reducer boilerplate increases significantly over time with more actions and reducers

[As stated in the redux FAQ](https://redux.js.org/faq/actions#should-i-dispatch-multiple-actions-in-a-row-from-one-action-creator)

>In general, ask if (...) actions are related but independent, or should actually be represented as one action. Do what makes sense for your own situation but try to balance the readability of reducers with readability of the action log. For example, an action that includes the whole new state tree would make your reducer a one-liner, but the downside is now you have no history of why the changes are happening, so debugging gets really difficult. On the other hand, if you emit actions in a loop to keep them granular, it's a sign that you might want to introduce a new action type that is handled in a different way.  
>Try to avoid dispatching several times synchronously in a row in the places where you're concerned about performance. There are a number of addons and approaches that can batch up dispatches as well.
