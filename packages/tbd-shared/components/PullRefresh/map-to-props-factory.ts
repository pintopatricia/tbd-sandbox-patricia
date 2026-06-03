import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { REFRESH, RefreshAction } from "@ppb/tbd-store/actions/router";
import * as React from "react";

export type ContainerProps = {
  viewUrn: string;
  children?: React.ReactNode;
};

export type StateProps = {
  isRefreshing: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () =>
  function mapStateToProps(state: ApplicationState) {
    return {
      isRefreshing: state.router.isRefreshing,
    };
  };

const dispatchRefresh = (urn: string): RefreshAction => ({
  type: REFRESH,
  payload: {
    urn,
  },
});

export type DispatchProps = {
  dispatchRefresh: typeof dispatchRefresh;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchRefresh,
};
