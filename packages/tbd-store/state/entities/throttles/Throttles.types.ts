export type FeatureThrottle = {
  isActive: boolean;
  isOverriden?: boolean;
};

export type Throttles = {
  [throttleId: string]: FeatureThrottle;
};

export type ThrottleOverrides = { throttlesOn?: Array<string>; throttlesOff?: Array<string> };

export type ThrottlesState = Throttles;
