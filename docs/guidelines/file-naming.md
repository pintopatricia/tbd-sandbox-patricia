# File naming

Regarding naming conventions, ReactJS is unopinionated. At this stage, there are three conventions for file naming.

##### ➡️Guideline: React Components should use `PascalCase` on the filename

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬Detailed Explanation</summary>
  
  As per react styleguides, `PascalCase` should be used for files that export a React Component.
     
</details>
<details>
  <summary>👍👎Examples</summary>

  *Good:*
  `SearchBar.tsx`
  
  *Bad:* 
  `searchBar.tsx`

  *Bad:*
  `search-bar.tsx`  
     
  *Bad:*
  `search_bar.tsx`
</details>


##### ➡️Guideline: React Hooks should use `lowerCamelCase` on the filename

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬Detailed Explanation</summary>
  
  Although there isn't a clear guideline on this, some popular community projects (such as https://github.com/beautifulinteractions/beautiful-react-hooks/) follow the `lowerCamelCase` pattern, starting with the `use` keyword.
     
</details>
<details>
  <summary>👍👎Examples</summary>

  *Good:*
  `useDebounce.ts`
  
  *Bad:*
  `UseDebounce.ts`

  *Bad:*
  `use-debounce.ts`
</details>

##### ➡️Guideline: All other files should follow `kebab-case` on the filename

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬Detailed Explanation</summary>
  
  Other javascript / typescript / JSX / TSX files should follow the `kebab-case` pattern.
  This applies for store javsacript modules, application services, routing, etc.
     
</details>
<details>
  <summary>👍👎Examples</summary>
  
  *Good:* 
  ```
  super-sayan-saga-middleware.ts
  ```
  
  *Bad:* 

  ```
  SuperSayanSagaMiddleware.ts
  ```

  *Bad:* 

  ```
  super_sayan_SagaMiddleware.tsx
  ```
</details>
