import { MarketId, SelectionId } from "@ppb/betslip-core/src/types/place/response";
import type URN from "@ppb/tbd-store/state/layout/URN";
import type { OddsDisplayFormat as GraphQLOddsDisplayFormat } from "../../../types/__generated__/graphql";

type Props = {
  urn: URN;
  visible?: boolean;
};

type MonterosaOddsDisplayFormat = GraphQLOddsDisplayFormat;
const MONTEROSA_ACTIONS = {
  BETSLIP_SELECTIONS: "mr_betslip_selections",
} as const;

type MonterosaBetslipAction = typeof MONTEROSA_ACTIONS.BETSLIP_SELECTIONS;

const MONTEROSA_MESSAGE_TYPES = {
  EXPERIENCE_EVENT: "experienceEvent",
  EXPERIENCE_MESSAGE: "experienceMessage",
} as const;

type MonterosaMessageType = (typeof MONTEROSA_MESSAGE_TYPES)[keyof typeof MONTEROSA_MESSAGE_TYPES];

const MONTEROSA_EXPERIENCE_EVENTS = {
  DID_BECOME_READY: "didBecomeReady",
  DID_CHANGE_INTRINSIC_SIZE: "didChangeIntrinsicSize",
} as const;

const MONTEROSA_COMMANDS = {
  SET_USER_PREFERENCES: "set_user_preferences",
} as const;

type MonterosaCommand = (typeof MONTEROSA_COMMANDS)[keyof typeof MONTEROSA_COMMANDS];

type MonterosaExperienceEvent = (typeof MONTEROSA_EXPERIENCE_EVENTS)[keyof typeof MONTEROSA_EXPERIENCE_EVENTS];

type MonterosaNativeEvent = {
  type: MonterosaMessageType | string;
  payload: {
    action?: MonterosaBetslipAction | string;
    payload: {
      selections?: {
        marketId: MarketId;
        selectionId: SelectionId;
        selectionName: string;
        priceDecimal: number;
        priceNumerator: number;
        priceDenominator: number;
      }[];
    };
    event?: MonterosaExperienceEvent | string;
    error?: { message?: string };
    size?: { height?: number };
  };
};

type MonterosaSelection = {
  marketId: MarketId;
  selectionId: SelectionId;
  selectionName: string;
  priceDecimal: number;
  priceNumerator: number;
  priceDenominator: number;
};

type MonterosaBetslipPayload = {
  selections?: MonterosaSelection[];
};

export { MONTEROSA_ACTIONS, MONTEROSA_MESSAGE_TYPES, MONTEROSA_EXPERIENCE_EVENTS, MONTEROSA_COMMANDS };

export type {
  Props,
  MonterosaOddsDisplayFormat,
  MonterosaNativeEvent,
  MonterosaSelection,
  MonterosaBetslipPayload,
  MonterosaBetslipAction,
  MonterosaMessageType,
  MonterosaExperienceEvent,
  MonterosaCommand,
};
