# Typescript guidelines (WIP)

_Extracted and adapted from [Microsoft guidelines](https://github.com/Microsoft/TypeScript/wiki/Coding-guidelines), [Typescript Book](https://github.com/basarat/typescript-book/blob/master/docs/styleguide/styleguide.md) and [React Typescript Cheatsheets](https://github.com/typescript-cheatsheets/react-typescript-cheatsheet)_

**Table of Contents**

- [Import React](#import-react)
- [Function Components](#function-components)
- [Class components](#class-components)
- [Hooks](#hooks)
- [Enums](#enums)
- [Types or Interfaces?](#types-or-interfaces)
- [Components](#components)
- [Array](#array)
- [`null` and `undefined`](#null-and-undefined)
- [General Assumptions](#general-assumptions)
- [Comments](#comments)
- [More info](#more-info)
  - [What about `React.FC`/`React.FunctionComponent`?](#what-about-reactfcreactfunctioncomponent)
  - [Why I should avoid returning arrays in effects?](#why-i-should-avoid-returning-arrays-in-effects)
  - [Why types are better than interfaces?](#why-types-are-better-than-interfaces)

## Import React

In [TypeScript 2.7+](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-7.html), you can run TypeScript with `--allowSyntheticDefaultImports` (or add `"allowSyntheticDefaultImports": true` to tsconfig) to import like in regular jsx:

```tsx
import React from "react";
```

## Function Components

These are written as normal functions that take a `props` argument and return a JSX element.

```tsx
import React, { ReactElement, FormEvent } from "react";

export interface Props {
  odd: string;
  onClick?: (event: FormEvent) => void;
}

const SportsbookBetButton = ({ price, onClick }: Props): ReactElement => {
  return <button onClick={onClick} />;
};
```

[What about `React.FC`/`React.FunctionComponent`?](#what-about-reactfcreactfunctioncomponent)

## Class components

Don't use them, move on!

## Hooks

Hooks are [supported in `@types/react` from v16.8 up](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/5565fe5e46e329a5ee02ddf739abe11bf16f278d/types/react/index.d.ts#L765-L973).

**useState**

Type inference works very well most of the time:

```tsx
const [val, toggle] = React.useState(false); // `val` is inferred to be a boolean, `toggle` only takes booleans
```

See also the [Using Inferred Types](#using-inferred-types) section if you need to use a complex type that you've relied on inference for.

However, many hooks are initialized with null-ish default values, and you may wonder how to provide types. Explicitly declare the type, and use a union type:

```tsx
const [user, setUser] = React.useState<IUser | null>(null);

// later...
setUser(newUser);
```

**useRef**

When using `useRef`, you have two options when creating a ref container that does not have an initial value:

```ts
const ref1 = useRef<HTMLElement>(null!);
const ref2 = useRef<HTMLElement | null>(null);
```

The first option will make `ref1.current` read-only, and is intended to be passed in to built-in `ref` attributes that React will manage (because React handles setting the `current` value for you).

The second option will make `ref2.current` mutable, and is intended for "instance variables" that you manage yourself.

Full example of `useRef` usage:

```tsx
function TextInputWithFocusButton() {
  // initialise with null, but tell TypeScript we are looking for an HTMLInputElement
  const inputEl = React.useRef<HTMLInputElement>(null);
  const onButtonClick = () => {
    // strict null checks need us to check if inputEl and current exist.
    // but once current exists, it is of type HTMLInputElement, thus it
    // has the method focus! ✅
    if (inputEl && inputEl.current) {
      inputEl.current.focus();
    }
  };
  return (
    <>
      {/* in addition, inputEl only can be used with input elements. Yay! */}
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

example from [Stefan Baumgartner](https://fettblog.eu/typescript-react/hooks/#useref)

**Custom Hooks**

When using Custom Hooks the React team recommends that if you need to return more than one values you should use proper objects instead of tuples, example:

```tsx
import React, { useState } from "react";

interface LoadingState {
  load: Function<Promise>,
  isLoading: boolean
}

export function useLoading: LoadingState () {
  const [isLoading, setState] = useState(false);
  const load = (promise: Promise<any>) => {
    setState(true);
    return promise.finally(() => setState(false));
  };

  return {
    isLoading,
    load
  };
}
```

[Why I should avoid returning arrays?](#why-i-should-avoid-returning-arrays-in-effects)

## Enums

Use PascalCase for enum values and members. All enums should be defined as String enums for a lot of reasons mentioned on the [official documentation](https://www.typescriptlang.org/docs/handbook/enums.html_):

> While string enums don’t have auto-incrementing behavior, string enums have the benefit that they “serialize” well. In other words, if you were debugging and had to read the runtime value of a numeric enum, the value is often opaque - it doesn’t convey any useful meaning on its own (though reverse mapping can often help), string enums allow you to give a meaningful and readable value when your code runs, independent of the name of the enum member itself.

Example:

```ts
enum MarketStatus {
  Open = "Open"
  Closed = "Closed"
  Suspended = "Suspended"
  Inplay = "Inplay"
}
```

## Types or Interfaces?

Always use types over interfaces.

```ts
// Bad
interface Market {
  name: string;
  id: string;
}

// Good
type Market = {
  name: string;
  id: string;
};
```

The only exception is for public API's definition when authoring a library or 3rd party ambient type definitions. A good example is using `react-redux`:

```ts
import { Action } from "redux";

interface ExchangeRunnerOddsAction extends Action<string> {
  type: "SUBSCRIBE_EXCHANGE_MARKET_UPDATES";
  payload: ExchangeRunners;
}
```

Extending `Action` is the only way to have correct typing on [store reducers](https://github.com/reduxjs/redux/blob/v4.0.4/index.d.ts#L61).

[Why types are better than interfaces?](#why-types-are-better-than-interfaces)

Another generic rules:

- Do not use "I" as a prefix for interface names.
- Do not export types/interfaces unless you need to share it across multiple components.
- Do not introduce new types/values to the global namespace.
- Shared types should be defined in '@types/'.
- Within a file, type definitions should come first.

## Components

- One typescript file per logical component (e.g. store entry, visual component, service).
- Do not add new files. :)
- files with "\*.d.ts" suffix are auto-generated, do not hand-edit them.

## Array

Annotate arrays as `foos:Foo[]` instead of `foos:Array<Foo>`.

> Reasons: Its easier to read. Its used by the TypeScript team. Makes easier to know something is an array as the mind is trained to detect `[]`.

## `null` and `undefined`

Use **undefined**. Do not use null.

## Comments

Use JSDoc style comments for functions, interfaces, enums, and classes. Types should be omitted:

```ts
/**
 * @param {number} a // WRONG number can be ommited because you are
 * already declaring the type on function signature
 * @param a // GOOD
 * @param b
 * @return the sum of a with b
 */
function sum(a: number, b: number): number {
  return a + b;
}
```

## More info

### What about `React.FC`/`React.FunctionComponent`?

You can also write components with `React.FunctionComponent` (or the shorthand `React.FC`):

```tsx
const App: React.FC<{ message: string }> = ({ message }) => <div>{message}</div>;
```

Some differences from the "normal function" version:

- It provides typechecking and autocomplete for static properties like `displayName`, `propTypes`, and `defaultProps` - **However**, there are currently known issues using `defaultProps` with `React.FunctionComponent`. See [this issue for details](https://github.com/sw-yx/react-typescript-cheatsheet/issues/87) - scroll down to our `defaultProps` section for typing recommendations there.

- It provides an implicit definition of `children` (see below) - however there are some issues with the implicit `children` type (e.g. [DefinitelyTyped#33006](https://github.com/DefinitelyTyped/DefinitelyTyped/issues/33006)), and it might considered better style to be explicit about components that consume `children`, anyway.

```tsx
const Title: React.FunctionComponent<{ title: string }> = ({ children, title }) => <div title={title}>{children}</div>;
```

- _In the future_, it may automatically mark props as `readonly`, though that's a moot point if the props object is destructured in the constructor.

- `React.FunctionComponent` is explicit about the return type, while the normal function version is implicit (or else needs additional annotation).

In most cases it makes very little difference which syntax is used, but the `React.FC` syntax is slightly more verbose without providing clear advantage, so precedence was given to the "normal function" syntax.

### Why I should avoid returning arrays in effects?

If you are returning an array in your Custom Hook, you will want to avoid type inference as Typescript will infer a union type (when you actually want different types in each position of the array). Instead, use [TS 3.4 const assertions](https://devblogs.microsoft.com/typescript/announcing-typescript-3-4/#const-assertions):

```tsx
export function useLoading() {
  const [isLoading, setState] = React.useState(false);
  const load = (aPromise: Promise<any>) => {
    setState(true);
    return aPromise.finally(() => setState(false));
  };
  return [isLoading, load] as const; // infers [boolean, typeof load] instead of (boolean | typeof load)[]
}
```

This way, when you destructure you actually get the right types based on destructure position.

### Why types are better than interfaces?

You can define same interface multiple times, and its definitions will merge into one:

```ts
interface Market {
  name: string;
}

interface Market {
  id: string;
}

const market: Market = {
  id: "1.12345",
  name: "Match odds"
};
```

This doesn’t work with type aliases, because type is an unique type entity (for both global or module scope).

```ts
// [ts] Error: Duplicate identifier 'Market'.
type Market = {
  name: string;
};

// [ts] Error: Duplicate identifier 'Market'.
type Market = {
  id: string;
};
```

Declaration merging via interfaces is very important, when we are writing 3rd party ambient type definitions for libraries that are not authored with TypeScript, so consumer has option to extend them, if some definition are missing.
Same applies if our library is written in TypeScript and ambient type definitions are generated automatically.

This is the only use case, where you definitely should always use interface instead of type alias!

You can still "extend" typed aliases via intersection operator `&`:

```ts
type Runner = {
  name: string;
};

type RunnerPrices = {
  back: number[];
  lay: number[];
};

type RunnerOdds = {
  odds: number[];
};

type ExchangeRunner = Runner & RunnerPrices;
type SportsbookRunner = Runner & RunnerOdds;
```
