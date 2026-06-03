# Memoized callbacks when passing them to children components

### useCallback (also applies to useMemo)

##### ➡️ Guideline: useCallback can not return a function

* Can be checked by Static Code Analysis: ✅
* Is this being checked by Static Code Analysis: 🚫

<details>
  <summary>💬 Detailed Explanation</summary>
  <br />

  When we need arguments inside a useCallback we should not create an additional function to receive that argument. When doing this, the useCallback is removed of its memoization and acts as a normal arrow function which triggers unnecessary updates on child components. 
  
  Instead, consider either using variable closure or split useCallbacks when possible.
  
  When none of these solutions are possible, consider creating a useCallback that receives the argument, but instead of creating an extra function on useCallback, like we see in example 1, pass that variable as an extra prop to the child and let the child call the callback with that argument, like in example 3.
</details>

<details>
  <summary>👍👎 Examples</summary>
  <br />

  *Good:*
  
```js
const onNavigateToSportsbook = useCallback(() => {
    dispatch<BackToCurrentChannelSelection>({
      type: UI__BACK_TO_CURRENT_CHANNEL_SELECTION,
      payload: Product.Sportsbook
    });
}, [dispatch]);

const onNavigateToExchange = useCallback(() => {
    dispatch<BackToCurrentChannelSelection>({
      type: UI__BACK_TO_CURRENT_CHANNEL_SELECTION,
      payload: Product.Exchange
    });
}, [dispatch]);
```
  
   *Bad:*
  
```js
const onNavigateToChannel = useCallback(
  (channel: Product) => () => {
    dispatch<BackToCurrentChannelSelection>({ 
      type: UI__BACK_TO_CURRENT_CHANNEL_SELECTION, 
      payload: channel 
    });
  },
  [dispatch]
);
```

*Good:*
  
```js
const onClick = useCallback(() => {
    dispatch<ClickSwimlane>({
      type: UI__CLICK_SWIMLANE,
      // cardgroupURN is declared outside of function and closured
      payload: { swimlaneUrn: cardgroupURN }
    });
}, [cardgroupURN, dispatch]);
```
  
   *Bad:*
  
```js
const onClick = useCallback(
    (cardgroupURN: string) => () => {
      dispatch<ClickSwimlane>({
        type: UI__CLICK_SWIMLANE,
        payload: { swimlaneUrn: cardgroupURN }
      });
    },
    [dispatch]
);
```

*Good:*
  
```js
const onClick = useCallback((variable: string) => {
    dispatch<Action>({
      type: ACTION,
      payload: { something: variable }
    });
}, [dispatch]);


<ComponentChild onClick={onClick} variable={variable} />
```
  
   *Bad:*
  
```js
const onClick = useCallback(
    (variable: string) => () => {
        dispatch<Action>({
          type: ACTION,
          payload: { something: variable }
        });
    }, [dispatch]);


<ComponentChild onClick={onClick(variable)} />
```

</details>
