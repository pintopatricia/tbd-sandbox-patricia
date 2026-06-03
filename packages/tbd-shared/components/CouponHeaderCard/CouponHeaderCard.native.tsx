import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { navigate } from "@ppb/tbd-router";
import { CompetitionHeader } from "./snowflakes/CompetitionHeader/CompetitionHeader.native";

import { COUPON_HEADER } from "./CouponHeaderCard.native.selectors";
import { ComponentProps } from "./props";

const CouponHeaderCard: FunctionComponent<ComponentProps> = ({
  title,
  titleLink,
  columns,
  showComponent = true,
  hasStats,
}) => {
  const onTitleClick = useCallback(() => {
    if (!titleLink) {
      return;
    }

    navigate(titleLink);
  }, [titleLink]);

  if (!showComponent) {
    return null;
  }

  return (
    <View {...getTestProps(COUPON_HEADER, false)}>
      <CompetitionHeader title={title} columns={columns} onTitleClick={onTitleClick} hasStats={hasStats} />
    </View>
  );
};

export default CouponHeaderCard;
