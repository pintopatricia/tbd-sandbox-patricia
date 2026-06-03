import { IntersectionProps } from "@ppb/the-wall-common/types/web";

type IntersectionConfig = {
  rootMargin: IntersectionProps["intersectOffset"];
};

// The first value represents 3 * COUPON-HEIGHT
const INTERSECTION_CONFIG: IntersectionConfig = {
  rootMargin: "210px 100%",
};

export default INTERSECTION_CONFIG;
