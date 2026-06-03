import { CardProps, DispatchProps, ContainerProps } from "./map-to-props-factory";
import { TaggingService } from "../../services/TaggingService";

export type ComponentProps = CardProps &
  DispatchProps &
  ContainerProps & {
    taggingService?: TaggingService;
  };
