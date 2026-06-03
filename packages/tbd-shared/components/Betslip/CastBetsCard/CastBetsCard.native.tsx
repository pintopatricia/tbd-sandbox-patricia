import { Fragment, FunctionComponent } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { TEST_ID } from "./CastBetsCard.native.selectors";
import { ComponentProps } from "./props";

import ConnectedCastBet from "../CastBet";
import { CastBet } from "../CastBet/CastBet.native";

export const CastBetsCard: FunctionComponent<ComponentProps> = ({ castGroupIds, shouldFocusStakeField }) => {
  if (!castGroupIds.length) {
    return null;
  }

  return (
    <View {...getTestProps(TEST_ID, false)}>
      {castGroupIds.map((castGroupId, index) => (
        <Fragment key={castGroupId}>
          <ConnectedCastBet
            component={CastBet}
            key={castGroupId}
            castGroupId={castGroupId}
            shouldFocusStakeField={shouldFocusStakeField && !index}
          />
        </Fragment>
      ))}
    </View>
  );
};
