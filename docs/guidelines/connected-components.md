# Connected components

_Connected Components_ are the set of components that bridge the gap between the presentational components and the Redux Store. The core responsibilities of these components are:

* subscribe to the store state
* dispatch actions to it

<hr/>

##### ➡️ Guideline: Connected components should use a flat folder structure

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  On the [ADR-0045 - Connected Components Code Organization](..docs/decisions/0045-connected-components-code-organization.md) it was defined a folder structure for the connected components.

  The name of the folder should be named after the component it represents. See *RootBetslip* below.

</details>
<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />
  
  *Good:*
  ```
  .../components/
├── ComponentName
│   ├── ComponentName.native.tsx
│   ├── ComponentName.native.test.jsx
│   ├── ComponentName.native.styles.ts
│   ├── ComponentName.native.selectors.js
│   ├── ComponentName.web.tsx
│   ├── ComponentName.web.test.jsx
│   ├── ComponentName.web.css
│   ├── ComponentName.web.css.d.ts
│   ├── ComponentName.web.po.js
│   ├── ComponentName.web.selectors.js
│   ├── props.ts
│   ├── index.ts
│   ├── map-to-props-factory.ts
  ```

Below, there is the expected content of each of these files:

* `ComponentName.native.tsx`: contains the presentational native component
* `ComponentName.native.test.jsx`: contains the presentational native component unit tests
* `ComponentName.web.tsx`: contains the presentational web component
* `ComponentName.web.test.jsx`: contains the presentational web component unit tests
* `ComponentName.web.css` contains the css modules for style the web presentational component
* `ComponentName.web.d.ts` contains the type definitions for the css modules
* `ComponentName.native.styles.ts`: contains style sheets for the native component
* `map-to-props-factory.ts`: contains `makeMapStateToProps` and `makeMapDispatchToProps` functions.
* `props.ts` contains `ComponentName.web.tsx`/`ComponentName.native.tsx` component props (`ComponentNameProps`).
* `index.ts` contains the Universal Connected component, composing the `makeMapStateToProps`, `makeMapDispatchToProps` and the Universal Connector.
</details>

<details>
  <summary> ⚠️ Platform-specific (Android / iOS)</summary>
  <br />
  
  Although it is not expected that implementations differ between Android and iOS it may happen (either because of business requirements or because of platform limitations/features). In that scenario it is expected that we don't define the set of `.native.*` files and define a `.ios.*` and `.android.*` instead.

  An example of a folder structure with that structure would look like the following:

  *Good:*
  ```
  .../components/
├── ComponentName
│   ├── ComponentName.ios.tsx
│   ├── ComponentName.ios.test.jsx
│   ├── ComponentName.ios.styles.ts
│   ├── ComponentName.ios.selectors.js
│   ├── ComponentName.android.tsx
│   ├── ComponentName.android.test.jsx
│   ├── ComponentName.android.styles.ts
│   ├── ComponentName.android.selectors.js
│   ├── ComponentName.web.tsx
│   ├── ComponentName.web.test.jsx
│   ├── ComponentName.web.css
│   ├── ComponentName.web.css.d.ts
│   ├── ComponentName.web.po.js
│   ├── ComponentName.web.selectors.js
│   ├── props.ts
│   ├── index.ts
│   ├── map-to-props-factory.ts
  ```

Below, there is the expected content of each of these files:

* `ComponentName.ios.tsx`: contains the presentational ios native component
* `ComponentName.ios.test.jsx`: contains the presentational ios native component unit tests
* `ComponentName.ios.styles.ts`: contains style sheets for the ios native component
* `ComponentName.ios.selectors.ts`: contains style sheets for the ios native component
* `ComponentName.android.tsx`: contains the presentational android native component
* `ComponentName.android.test.jsx`: contains the presentational android native component unit tests
* `ComponentName.android.styles.ts`: contains style sheets for the android native component
* `ComponentName.android.selectors.ts`: contains style sheets for the android native component

</details>

<hr/>

##### ➡️ Guideline: Connected Component (`ComponentName/index.ts`) should not be React aware

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />
  
  Connected Components files should not be React aware.
  
  This means that they should not `import React from 'react'` and shouldn't use the constructs from React like hooks. Therefore don't require the `tsx` extension (as per the guideline below).

</details>
<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

  *Bad:*
  ```javascript
  import React from 'react'
  ```  

  *Bad:*
  ```javascript
  import {useDispatch} from 'react'
  ```    
</details>


<hr/>

##### ➡️ Guideline: Connected Component (`ComponentName/index.ts`) should have `.ts` extension

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />
  
  The file that exports the cross-platform connected component (`ComponentName/index.ts`) should have the `.ts` extension as it does not require `JSX`.
</details>
<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

  *Good:*
  ```bash
  $ ls ComponentName/

  ├── ComponentName
     ├── index.ts
  ```  

  *Bad:*
  ```bash
  $ ls ComponentName/

  ├── ComponentName
     ├── index.tsx
  ```  
</details>

<hr/>

##### ➡️ Guideline: Connected Component (`ComponentName/index.ts`) should use `UniversalConnectorComponent` abstraction

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />
  
  The `UniversalConnectorComponent` was created to abstract the usage of `connect` function from react-redux, in order to reduce boilerplate across the codebase.
  Also, the `UniversalConnectorComponent` provides the `component` prop which can be used for the parent to provide the presentational component to be "connected".

</details>
<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

  *Good:*
  ```javascript
  //ComponentName/index.ts

  import {
  makeMapStateToProps,
  mapDispatchToProps,
  StateProps,
  DispatchProps,
  ContainerProps
} from "./map-to-props-factory";
import { createUniversalConnector } from "../../universal-connector-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps
);
```
  
</details>

<hr/>

##### ➡️ Guideline: Connected Components should not have platform-specific code

* Can be checked by Static Code Analysis: ⚠
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />
  
  Connected Components should only be concerned with business logic:
  
  * mapping store state to presentational components props
  * mapping presentational component events to actions (action dispatching)

  Therefore, platform-specific code should exist in the presentational components as per the following examples:

  * Styling: only the presentational components should be styled
  * Web APIs / Native APIs: The presentational components should invoke them and map accordingly to actions to be dispatched.
</details>

<hr/>

##### ➡️ Guideline: Connected Components should not have side-effects

* Can be checked by Static Code Analysis: ⚠
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />
  
  Connected Components should not have side-effects.
  
  Side-effects behavior should not be handled inside the connected components.
  Most likely, the side-effects will be executed either by the application store (via a middleware) or by the presentational components (for DOM manipulation, usage of timer APIs, etc).

  Below, there are a few examples of side-effects and how they should be handled in TBD:

  * *Network requests (XHR/fetch)*: should be handled by middleware in the application store.
  * *Local Storage*: should happen in the application store.
  * *DOM manipulation (web)*: should happen in the presentational components.
  * *Animations (web/native)*: should happen in the presentational components.

</details>

<hr/>


##### ➡️ Guideline: Connected Components should not have `data-testid`'s

* Can be checked by Static Code Analysis: ⚠
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  `data-testid` selectors shouldn't be a concern of the Connected Component: it should be defined and managed by the immediate child presentational component that the Connected Component renders.

</details>

<hr/>

##### ➡️ Guideline: `map-to-props-factories.ts` file should export `makeMapStateToProps` and `makeMapDispatchToProps` as factories

* Can be checked by Static Code Analysis: ⚠
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  The `map-to-props-factories.ts` file should export two factory functions:

  * `makeMapStateToProps`: this function has the responsibility of mapping `ApplicationState` and `OwnProps` to the child component props.
  * `makeMapDispatchToProps`: this function has the responsibility of mapping actions to be dispatched by the child component to store actions.

  The reason why they should be factory functions is to ensure that memoization on data that should not vary per state changes is defined on the function. For more details Please take a look at the [Application State Management Guidelines](application-state-management.md#selectors).

  There may be the case where we don't need to use a factory function and we shouldn't as it may have a negative impact on the application performance. See ❗Exceptions below for more details.

  **Please**, make sure you make due diligence in optimizing the `mapStateToProps` and `mapDispatchToProps` functions as they can cause a severe degradation on the application performance.

</details>

<details>
  <summary>❗Exception #1 - Plain Objects</summary>
  <br/>

  It may happen the scenario where `StateProps` or `DispatchedProps` is not required and can be replaced by empty plain object `{}`.

  ```javascript
  // Usage on Component/index.ts
  import { makeMapStateToProps, makeMapDispatchToProps } from "map-to-props-factory.ts";

  // Scenario where we don't pass `mapDispatchToProps`
  createUniversalConnector<StateProps, {}, {}, ContainerProps, ChildComponentProps>(makeMapStateToProps)
  
  // Scenario where we pass null as `mapDispatchToProps`
  createUniversalConnector<StateProps, null, {}, ContainerProps, ChildComponentProps>(makeMapStateToProps, null)
  
  // Scenario where we pass null to the `makeMapStateToProps`
  createUniversalConnector<null, DispatchProps, {}, ContainerProps, ChildComponentProps>(null, makeMapDispatchToProps)
  ```
</details>

<details>
  <summary>❗Exception #2 - Performance Optimizations</summary>
  <br/>

It may happen that we may need to perform optimizations within the `mapStateToProps`/`mapDispatchToProps` functions on a connected component that needs some tuning (such as avoid multiple rerenders, etc).

On these scenarios, it may be viable to not export factory functions but the direct `mapStateToProps` or `mapDispatchToProps`.

  ```javascript
  // Usage on Component/index.ts
  import { mapStateToProps, mapDispatchToProps } from "map-to-props-factory.ts"

  createUniversalConnector<StateProps, DispatchProps, {}, ContainerProps, ChildComponentProps>(mapStateToProps, mapDispatchToProps)
  ```
</details>
<hr/>

##### ➡️ Guideline: `react-redux` should only be imported in the `map***ToProps`factory files

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: ✅

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  The `react-redux` should be used exclusively in the `map-to-props-factory.ts` file in order to leverave `MakeMapStateToPropsFactory` and `MakeMapDispatchToPropsFactory` generic types.
</details>

<hr/>

##### ➡️ Guideline: `map-to-props-factories` should export `StateProps`, `DispatchProps`

* Can be checked by Static Code Analysis: ⚠
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  The `StateProps` and `DispatchProps` should be defined alongside the `makeMapStateToProps` and `makeMapDispatchToProps` functions. Either `StateProps` and `DispatchProps` should be exported to be used to create the `ComponentProps` in the `props.ts` file and to be used when required (for example on the `index.ts` file).
</details>
<hr/>

##### ➡️ Guideline: `props.ts` file should export `ComponentProps`

* Can be checked by Static Code Analysis: ⚠
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  The main motivation for the `props.ts` file is hold the presentational component props that will be used on the `.web` and `.native` components.
  

</details>

<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

  *Good:*
  ```javascript 

  // props.ts

  import { StateProps, DispatchProps, ContainerProps } from "./map-to-props-factory";

  export type ComponentProps = StateProps & DispatchProps & ContainerProps;
  ```
</details>

<hr/>

##### ➡️ Guideline: Define Connected types and leverage `UniversalConnectorComponent` generic typings

* Can be checked by Static Code Analysis: ⚠
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  Considering the interface of the `UniversalConnector`, it takes as input five different types:

  * `StateProps`: These props are the output of the `mapStateToProps` function.
    * This typing should be defined in the `map-to-props-factory.ts` file
  * `DispatchProps`: These props are the output of the `mapDispatchToProps` function.
    * This typing should be defined in the `map-to-props-factory.ts` file
  * `ContainerProps`: These props are the ones passed to the mapStateToProps (second argument alongside `ApplicationState`). Typically named as `OwnProps` in `react-redux` terminology.
    * On an invocation like `<ConnectedComponent urn={urn} component={PresentationalComponent}/>`, the `urn` field is part of the `OwnProps`.
    * This typing should be defined in the `map-to-props-factory.ts` file
  * `ComponentProps`: These props are the set of values that the function component (the one injected to the connected component) receives. It consists on the union of `StateProps`, `DispatchProps` and `ContainerProps`.
    * This typing should be defined in the `props.ts` file.
</details>
<hr/>

##### ➡️ Guideline: Add internationalization details to `makeMapStateToProps` function

* Can be checked by Static Code Analysis: 🚫
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  Internationalization for non-interpolated values should be added within the `makeMapStateToProps`:

  * Static values should be placed within the factory function in order to execute once.
  * For interpolated values, they should be placed within the inner function (and will be calculated per `mapStateToProps` execution).

</details>

<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />
  
  *Good:*
  ```javascript
  export const makeMapStateToProps: MapStateToPropsFactory<StateProps, {}, ApplicationState> = () => {
    const labels = {
      title: i18n({ key: "I18N.TITLE" }),
      subtitle: i18n({ key: "I18N.SUBTITLE" }),
    };

    return (state: ApplicationState): StateProps => {
      const { value } = state.value;

      return {
        labels,
        value
      };
    }
  }
  ```

  *Good:*
  ```javascript
  export const makeMapStateToProps: MapStateToPropsFactory<StateProps, {}, ApplicationState> = () => {
  return {
    title: i18n({ key, interpolationValues }),

    return (state: ApplicationState): StateProps => {
      const { value } = state.value;
      const translatedValue = i18n({key: "I18N.VALUE", {value})

      return {
        translatedValue,
        value
      };
    }
  }
  ```
</details>

<hr/>



##### ➡️ Guideline: Don't add "platform-specific" details to `DispatchProps`

* Can be checked by Static Code Analysis: ⚠
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  Avoid using terminology that is platform-specific like "click" or "press" or "tap" on the dispatched actions. As this is platform agnostic code, it should capture the change it does on the store rather than the action that was executed to initiate it.

</details>

<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />
  
  *Good:*
  ```javascript
  const dispatchHeaderToggle = (dispatch: Dispatch<BetslipHeaderToggleAction>): BetslipHeaderToggleAction =>  dispatch({ type: UI__BETSLIP_HEADER_TOGGLE });
  ```  

  *Bad:*
  ```javascript
  const dispatchHeaderClick = (dispatch: Dispatch<BetslipHeaderClickAction>): BetslipHeaderClickAction => dispatch({ type: UI__BETSLIP_HEADER_CLICK });
  ```

  *Bad:*
  ```javascript
  const dispatchHeaderPress = (dispatch: Dispatch<BetslipHeaderPressAction>): BetslipHeaderPressAction => dispatch({ type: UI__BETSLIP_HEADER_PRESS });
  ```  
</details>

<hr/>

##### ➡️ Guideline: Only import types from `@ppb/the-wall-web/types`.

* Can be checked by Static Code Analysis: ⚠
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  There may be scenarios where you may need to import types from `@ppb/the-wall-web`: the main use case happens when the `makeMapStateToProps` function needs to know a type of a children presentational component.

  That said, connected components should only import types from `@ppb/the-wall-web` and those types should be exported via `@ppb/the-wall-web/types` file.
</details>

<details>
  <summary>👍👎 EXAMPLES</summary>
  <br />

  *Good:*
  ```javascript
  import { DualUsageMarketProps } from "@ppb/the-wall-web/types";
  ```

  *Bad:*
  ```javascript
  import { DualUsageMarketProps } from "@ppb/the-wall-web"
  ```  
</details>

<hr/>
