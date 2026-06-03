import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import {
  BetSegmentInfo,
  BetSegmentsProps,
  StatusLabelProps,
  LabelProps,
  AlertViewModel,
} from "@ppb/the-wall-common/types";
import type { ReactNode, JSX } from "react";

export type SportsbookBetPanelProps = {
  /** The main title text for the bet */
  title: string;
  /** Optional subtitle text displayed below the title */
  subTitle?: string;
  /** Optional supporting descriptive text about the bet */
  supportingText?: string;
  /** Text content for the status label indicator */
  statusLabelText?: StatusLabelProps["text"];
  /** Optional icon to display in the status label */
  statusLabelIcon?: Icons;
  /** The visual type/style of the status label (e.g., success, warning, error) */
  statusLabelType?: StatusLabelProps["statusLabelType"];
  /** When true, indicates this is a multiple bet (affects layout and indicators). @default false */
  isMultiple?: boolean;
  /** When true, shows the guaranteed price (BOG) indicator. @default false */
  isGuaranteedPriceSelected?: boolean;
  /** Text label for the guaranteed price indicator */
  guaranteedPriceLabel?: LabelProps["text"];
  /** Bet segment data showing stake and returns information */
  segmentData?: BetSegmentsProps;
  /** List of additional bet information items to display (e.g., cashout available, live streaming) */
  betSegmentInfos?: BetSegmentInfo[];
  /** Optional additional content to render in the panel body */
  children?: ReactNode;
  /** Secondary bet segment data for additional stake/returns information */
  secondarySegmentData?: BetSegmentsProps;
  /** Optional connected notification component */
  notification?: JSX.Element;
  /** Optional alert information to display an alert message within the panel */
  alert?: AlertViewModel;
};

type SportsbookBetPanelCallbacks = {
  /** Callback function triggered when the share icon is tapped */
  onShareIconTap?: () => void;
  /** Callback function triggered when an external URL link is opened. Receives the URL string */
  onOpenExternalUrl?: (url: string) => void;
};

export type SportsbookBetPanelViewModel = SportsbookBetPanelProps & SportsbookBetPanelCallbacks;
