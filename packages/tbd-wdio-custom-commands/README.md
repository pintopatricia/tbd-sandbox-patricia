# WDIO Custom Commands

# Index

- [WDIO Custom Commands](#wdio-custom-commands)
- [Index](#index)
- [Context](#context)
- [How to include in your project](#how-to-include-in-your-project)
- [API](#api)
  - [addLogsToAllure](#addlogstoallure)
  - [containsClass](#containsclass)
  - [tickFakeClock](#tickfakeclock)
  - [getViewportSize](#getviewportsize)
  - [waitUntilAttributeContains](#waituntilattributecontains)
  - [waitUntilBrowserUrlContains](#waituntilbrowserurlcontains)
  - [waitUntilBrowserUrlNotContains](#waituntilbrowserurlnotcontains)
  - [waitUntilContainsClass](#waituntilcontainsclass)
  - [waitUntilDisplayed](#waituntildisplayed)
  - [waitUntilEquals](#waituntilequals)
  - [waitUntilIframeReady](#waituntiliframeready)
  - [waitUntilImageEquals](#waituntilimageequals)
  - [waitUntilInViewport](#waituntilinviewport)
  - [waitUntilNotContainsClass](#waituntilnotcontainsclass)
  - [waitUntilNotDisplayed](#waituntilnotdisplayed)
  - [waitUntilNotInDOM](#waituntilnotindom)
  - [waitUntilNotInViewport](#waituntilnotinviewport)
  - [waitUntilStopsMoving](#waituntilstopsmoving)
  - [waitUntilClickableNative](#waituntilclickablenative)
  - [waitUntilLengthCondition](#waituntillengthcondition)
  - [waitUntilNotEmpty](#waituntilnotempty)

# Context

This package is an aggregator of custom commands used in our tests using [WebdriverIO](https://webdriver.io/).

Custom commands allow us to extend the browser instance with your own set of commands. These commands can be created in a synchronous (default) or asynchronous (like when using WebdriverIO in standalone mode) way.

---

# How to include in your project

The best way to add custom commands to the WDIO framework is on the [before Hook](https://webdriver.io/docs/options/#before). This can be easily achieved by the following code:

```js
const customCommands = require("@ppb/tbd-wdio-custom-commands");

before: () => {
  Object.keys(customCommands).forEach((key) =>
    browser.addCommand(key, customCommands[key](browser, { timeout: 30000, visualTestsOpts }))
  );
};
```

The `timeout` parameter will override the default value for each timeout. (It's always possible to override individually).

`visualTestsOpts` is used on the [waitUntilImageEquals](#waitUntilImageEquals) method in order to wait until a given image equals the state of the application. It's possible to pass `diff` folder (where the temporary screenshots will be stored) and the `isMobileApp` parameter in order to use the right plugin. An example:

```javascript
const visualTestsOpts = { diff: "./path/diff-waitUntilImageEquals", isMobileApp: true };
```

# API

## addLogsToAllure

adds to the Allure report the browsers devtools console logs

Returns:

- `{AllureStep}` - the step added to the allure

---

## containsClass

checks if a certain `class` is present in an `element`

Params:

- `{Element}` - the element that we want to check
- `{String} testClass` - the class that must be present in the `element`

Returns:

- `{boolean}` - true if condition is fulfilled

---

## tickFakeClock

advances in time on the browsers internal clock

Params:

- `{String} time` - the time (`HH:MM:SS`) we want to advance in time. `24:00:00` by default.

---

## getViewportSize

returns the viewport size in a given moment

Returns:

- `{width}` - the width of the viewport
- `{height}` - the height of the viewport

---

## waitUntilAttributeContains

waits until a given elements attribute is present

Params:

- `{Element}` - the element that we want to check
- `{String} attribute` - the attribute `key` of the `element`
- `{String} matcher` - the attribute `value` of the `element`

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilBrowserUrlContains

waits until a given browsers url contains a given `value`

Params:

- `{String} urlPart` - the `value` that should be present on the url

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilBrowserUrlNotContains

waits until a given browsers url doesn't contain a given `value`

Params:

- `{String} urlPart` - the `value` that should not be present on the url

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilContainsClass

waits until a given element has a class present

Params:

- `{Element}` - the element that we want to check
- `{String} testClass` - the class that must be present in the `element`

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilDisplayed

waits until a given `element` is displayed in the viewport

Params:

- `{Element}` - the element that we want to check

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilEquals

waits until a given `elements text` is equal to a given text

Params:

- `{Element}` - the element that we want to check
- `{String} text` - the text that should be present on the `element`

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilIframeReady

waits until a given `element` is present on an Iframe

Params:

- `{String} iframe` - the iframe that we want to check
- `{String} element` - the element that must be present on the iframe

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilImageEquals

waits until the viewport is equal to a given image

Params:

- `{String} imageName` - the name of the image to be compared with
- `{String} rootElement (optional)` - the root element to be used by the checkElement

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilInViewport

waits until a given element is present on the viewport

Params:

- `{Element}` - the element that must be present on the viewport

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilNotContainsClass

waits until a given element doesn't have a given class

Params:

- `{Element}` - the element that we want to check
- `{String} testClass` - the class that should not be present on the `element`

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilNotDisplayed

waits until a given element is not displayed

Params:

- `{Element}` - the element that should not be displayed

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilNotInDOM

waits until a given element is not present in the DOM

Params:

- `{Element}` - the element that should not be present in the DOM

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilNotInViewport

waits until a given element not in the viewport

Params:

- `{Element}` - the element that should not be in the viewport

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilStopsMoving

waits until a given element is not moving on the screen

Params:

- `{Element}` - the element that should not be moving

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilClickableNative

waits until a given element is clickable in native tests

Params:

- `{Element}` - the element that should be clickable
- `{String} errorMessage (optional)` - the error message that should be shown when the expectation fails

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilLengthCondition

waits until a given element length is true in a given condition

Params:

- `{Element}` - the element that should be clickable
- `{Function} conditionFn` - the condition Fn to validate de element
- `{String} errorMessage (optional)` - the error message that should be shown when the expectation fails

Returns:

- `{boolean}` - true if condition is fulfilled

---

## waitUntilNotEmpty

waits until a given element's `text` is not an empty string

Params:

- `{Element}` - the element that we want to check

Returns:

- `{boolean}` - true if condition is fulfilled

---
