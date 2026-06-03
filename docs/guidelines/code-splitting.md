# Code Splitting Strategy

## What is Code splitting

Code splitting allows us to split the code into various bundles which can then be loaded on demand or in parallel. It can be used to achieve smaller bundles and control resource load prioritization which, if used correctly, can have a major impact on load time.

The aim of this file is to have a set of guidelines to help developers to know how/when to apply this strategies.

### Why do we need code splitting

Since TBD has a strategy for performance with a max size defined for a chunk (150kb) and since not all pages uses the same code, we will have some benefits with this strategy.

For example:

- Market Rules are only available on Market Page so it makes sense to request that code only on Market Page.

If we fail to comply with max size, we get a failed build

```
06:30:40 $ bundlesize --config .bundlesize.json
06:30:41  FAIL  ./dist/app-b1f81d96a1a776290aca.js.gz: 155.26KB > maxSize 155KB (no compression)
06:30:41  PASS  ./dist/vendors~app-8eef1bdda86e62018e6d.js.gz: 126.4KB < maxSize 140KB (no compression)
06:30:41  PASS  ./dist/gaming-page-28380bce4a3938df5323.js.gz: 1.04KB < maxSize 10KB (no compression)
06:30:41  PASS  ./dist/horse-racing-page-239c257d16b9e0ba5ad0.js.gz: 562B < maxSize 10KB (no compression)
06:30:41  PASS  ./dist/market-graphs-23e9acc712cbcc1cb871.js.gz: 605B < maxSize 10KB (no compression)
06:30:41  PASS  ./dist/market-rules-2c2f799693eb142d5c7e.js.gz: 1.97KB < maxSize 10KB (no compression)
06:30:41  PASS  ./dist/my-bets-page-36edd7018d757d958c6e.js.gz: 1.01KB < maxSize 10KB (no compression)
06:30:41  PASS  ./dist/tagging-7fff2fc23f03bdcea407.js.gz: 4.08KB < maxSize 10KB (no compression)
06:30:41  PASS  ./dist/user-profile-c9e1810968a1c5f68220.js.gz: 4.96KB < maxSize 10KB (no compression)
```

## Guidelines

- [Tree shaking](https://webpack.js.org/guides/tree-shaking/) of known packages (`sideEffects: false`)
- Split Modals/Overlay or any components that are requested later in navigation
  - Market-rules, market-graphs, betslip, footer, etc.
- Split pages under throttle
- Split pages that not use ConnectedCard
  - Browse page, AllMarkets Page, Market Page
- Conditional rendering should not be done in the Connected component

  - If the conditional rendering is done in the component, it gets requested even though it's not being used. Example:

  ```
  /** ConnectedApp.tsx **/
  <SomeComponent />

  /** SomeComponent.tsx **/
  return (
    <>
      {shouldComponentBeRendered && (
        <ComponentToRender/>
      )}
    </>
  );
  ```

- [Preload vs Prefetch](https://webpack.js.org/guides/code-splitting/#prefetchingpreloading-modules)
  - Preload resources when you have high-confidence that they will be used in the current page (e.g. lib specific for a page)
  - Prefetch resources that might be used in future navigations (e.g. betslip)
- Preload critical assets on server (access-control)
  - app.js
  - vendors.js
  - runtime.js

## FAQ

> I'm going to add a new library to the project, just to be used in one page. Should it be splitted?

Yes. We should have a dynamic import for that lib since it will not be requested elsewhere. If that page is not bundled within our `app.js`, that lib can also be `preloaded` when requesting that page

> Why are we not preloading more chunks since i'm pretty sure they are going to be used in the future?

If everything is a priority, nothing is a priority. We should preload only the critical assets, prefetch some assets that are going to be used during the navigation and dynamic import the remaining assets. With placeholders/loading states it should not be a problem

More Info:

- [Webpack Code Splitting](https://webpack.js.org/guides/code-splitting/)
- [Code Splitting Spike](https://flutteruki.atlassian.net/wiki/spaces/BSBG/pages/145397579/TBD+Split+Code+Guidelines)
