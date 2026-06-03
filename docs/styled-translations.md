## Styled translations

The `<Styled />` component has a simple API and enables any styling to be applied to a part of a string.

As example let's imagine we have the following translation: `Returns: [oldValue]£40.00[/oldValue] [newValue]£55.00[/newValue]`

In order to apply styles to the values inside `[...]some value[/...]` we just have to create the styles, import them inside a component like any other style and pass it to `<Styled />` along with the translation, example:

####Styles
```css
.old {
  color: var(--white);
  text-decoration: line-through;
}

.new {
  color: var(--casino-jackpot-background-default);
}
```

####Component usage
```js
import { Styled } from "@ppb/the-wall-web";
import cssStyles from "./styles.css";

export const Example = () => {
  const translation = "Returns: [oldValue]£40.00[/oldValue] [newValue]£55.00[/newValue]";
  const styles = {
    oldValue: cssStyles.old,
    newValue: cssStyles.new,
  };

  return <Styled translation={translation} styles={styles} />;
};
```
