import { FunctionComponent, memo } from "react";
import { Pressable, View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { navigate } from "@ppb/tbd-router/native";
import FixtureHeader from "../../FixtureHeader/FixtureHeader.native";
import ConnectedFixtureHeader from "../../FixtureHeader";
import { ComponentProps } from "../props";
import selectors from "../FixtureCard.native.selectors";

const MemoizedFixtureCard: FunctionComponent<ComponentProps> = memo(
  ({
    dispatchNavigateToEventFromMarketScoreboard,
    eventViewLink,
    eventName,
    cardURN,
    availableToSubscribe,
    fixture,
    sporteventURN,
    showEventDateBelow,
  }) => {
    const onPress = (): void => {
      if (eventViewLink) {
        dispatchNavigateToEventFromMarketScoreboard(eventViewLink, eventName);
        navigate(eventViewLink);
      }
    };

    return (
      <View key={`mybets-${cardURN}`}>
        <Pressable {...getTestProps(selectors.FIXTURE_CARD, false)} onPress={onPress}>
          <ConnectedFixtureHeader
            fixture={fixture}
            cardURN={cardURN}
            sporteventURN={sporteventURN}
            viewMode={ScoreboardViewMode.COUPON}
            stickyOnScroll={false}
            availableToSubscribe={availableToSubscribe}
            showBottomSeparator={false}
            showEventDateBelow={showEventDateBelow}
            showHorizontalDuration={false}
            component={FixtureHeader}
          />
        </Pressable>
      </View>
    );
  },
);
MemoizedFixtureCard.displayName = "MemoizedFixtureCard";

const MyBetsFixtureCard: FunctionComponent<ComponentProps> = (props) => {
  return <MemoizedFixtureCard {...props} />;
};

export default MyBetsFixtureCard;
