import { AlertProps } from "@ppb/the-wall-common/types";
import { CombinationContainerProps } from "./Combination/props";
import { FailureContainerProps } from "./Failure/props";

type CardProps = {
  title?: string;
  isPopular: boolean;
  isPackagedCreatedBets: boolean;
  shouldFocusStakeField?: boolean;
  subtitle: string;
  odds: string;
  notifications: AlertProps[];
  legIds: string[];
  failedLegIds: string[];
  i18n: {
    odds: string;
    stake: string;
    popular: string;
    createdBets: string;
  };
};

export type StateProps = CardProps | Record<string, never>;

export type DispatchProps = Record<string, never>;

export type ComponentProps = StateProps & DispatchProps & CombinationContainerProps & FailureContainerProps;
