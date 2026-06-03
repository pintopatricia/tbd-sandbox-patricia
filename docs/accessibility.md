# Accessibility

## Outline

It provides visual feedback for links that have "focus" when navigating a web document using the TAB key (or equivalent). This is especially useful for people who can't use a mouse or have a visual impairment. If the outline is removed, the site becomes inaccessible for these people.

[Source](http://www.outlinenone.com/)


### Problem

Many developers disable the default focus ring in their CSS styles, others attempt to style it in concert with their design. The former often seems to be a result of finding the default focus ring both aesthetically unpleasant and confusing to users when applied after a mouse or touch event and introduces accessibility problems. The latter inevitably creates considerably more of the kind of problem that the former was trying to solve.



### Solution: focus-visible pseudo selector

The `:focus-visible` pseudo-class applies while an element matches the :focus pseudo-class and the UA (User Agent) determines via heuristics that the focus should be made evident on the element. (Many browsers show a “focus ring” by default in this case.)

This selector is useful to provide a different focus indicator based on the user’s input modality (mouse vs. keyboard).

Source: https://developer.mozilla.org/en-US/docs/Web/CSS/:focus-visible

Problem: compatibility https://caniuse.com/#search=focus-visible. 

### Polyfill

Based on the proposed CSS :focus-visible pseudo-selector, this prototype adds a focus-visible class
to the focused element, in situations in which the :focus-visible pseudo-selector should match.

https://github.com/WICG/focus-visible


