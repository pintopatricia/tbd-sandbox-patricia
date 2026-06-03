import { createUniversalConnector } from "../universal-connector-factory";
import { makeMapStateToProps, StateProps } from "./map-to-props-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, {}, {}, ComponentProps>(makeMapStateToProps, {});
