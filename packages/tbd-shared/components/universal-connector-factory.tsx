import type { JSX } from "react";
import * as React from "react";
import {
  connect,
  MapStateToPropsParam,
  MapDispatchToPropsParam,
  MapDispatchToPropsNonObject,
  ReactReduxContext,
} from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";

// Copied from react-redux dist/ folder. Somehow this type is not exported by react-redux@8.0.5
type ConnectOptions<State = unknown, TStateProps = {}, TOwnProps = {}, TMergedProps = {}> = {
  forwardRef?: boolean;
  context?: typeof ReactReduxContext;
  areStatesEqual?: (nextState: State, prevState: State, nextOwnProps: TOwnProps, prevOwnProps: TOwnProps) => boolean;
  areOwnPropsEqual?: (nextOwnProps: TOwnProps, prevOwnProps: TOwnProps) => boolean;
  areStatePropsEqual?: (nextStateProps: TStateProps, prevStateProps: TStateProps) => boolean;
  areMergedPropsEqual?: (nextMergedProps: TMergedProps, prevMergedProps: TMergedProps) => boolean;
};

type UniversalConnectorProps<TComponentProps> = {
  component: React.ComponentType<TComponentProps>;
  placeholder?: React.ComponentType<TComponentProps>;
  visible?: boolean;
};

type MergedProps<TState, TActions, TOwnProps> = {
  state: TState;
  actions: TActions;
  ownProps: TOwnProps;
};

/**
 * Function component used to transfer the connected component props to the child component
 */
function UniversalConnector<TComponentProps>(
  props: UniversalConnectorProps<TComponentProps> & TComponentProps,
): JSX.Element {
  const {
    ownProps: { component: Component, placeholder: Placeholder, ...ownProps },
    state,
    actions,
  } = props as any;

  if ((!state || !Object.keys(state).length) && Placeholder) {
    return <Placeholder {...ownProps} {...actions} />;
  }

  return <Component {...ownProps} {...state} {...actions} />;
}

/**
 * A connected universal component is a platform-agnostic component that accepts
 * a single prop `component`, that is the child component. The `createUniversalConnector`
 * function defines a typesafe Redux connector and handles all the state and action mapping
 * logic to be included in the cross platform child component
 */

export function createUniversalConnector<StateProps, DispatchProps, ContainerProps, ChildComponentProps>(
  mapStateToProps: MapStateToPropsParam<StateProps, ContainerProps, ApplicationState>,
  mapDispatchToProps:
    | MapDispatchToPropsParam<DispatchProps, ContainerProps>
    | MapDispatchToPropsNonObject<DispatchProps, ContainerProps>,
  options: ConnectOptions<
    ApplicationState,
    StateProps,
    ContainerProps,
    MergedProps<StateProps, DispatchProps, ContainerProps>
  > = {},
) {
  return connect<
    StateProps,
    DispatchProps,
    ContainerProps & UniversalConnectorProps<ChildComponentProps>,
    MergedProps<StateProps, DispatchProps, ContainerProps>,
    ApplicationState
  >(
    mapStateToProps,
    mapDispatchToProps,
    (state, actions, ownProps) => ({
      state,
      actions,
      ownProps,
    }),
    options,
    // https://github.com/DefinitelyTyped/DefinitelyTyped/issues/31363
    // type coercion to expected type due to `WeakValidationMap` errors
  )(UniversalConnector as React.ComponentType);
}
