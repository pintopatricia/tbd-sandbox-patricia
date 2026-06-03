import { mapStateToProps, mapDispatchToProps, StateProps, ContainerProps } from "./map-to-props-factory";
import { createUniversalConnector } from "../../universal-connector-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, {}, ContainerProps, ComponentProps>(mapStateToProps, mapDispatchToProps);
