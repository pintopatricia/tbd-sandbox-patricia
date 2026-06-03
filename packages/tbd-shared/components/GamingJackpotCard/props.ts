import { CardProps, StateProps, DispatchProps, ContainerProps } from "./map-to-props-factory";
import { TaggingService } from "../../services/TaggingService";

export type ComponentProps = StateProps & ContainerProps;

export type LoadedComponentProps = CardProps &
  DispatchProps &
  ContainerProps & {
    taggingService?: TaggingService;
  };
