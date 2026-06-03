import type { JSX } from "react";
import { FunctionComponent } from "react";
import { View } from "react-native";
import { AvBFixture, FootballScoreboard } from "@ppb/the-wall-native";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";

import { ComponentProps } from "./props";
import { FOOTBALL_FIXTURE_CONTAINER } from "./FootballFixture.native.selectors";
import ConnectedNotificationsSubscription from "../NotificationsSubscription";
import NotificationsSubscription from "../NotificationsSubscription/NotificationsSubscription.native";
import { NotificationsViewMode } from "../NotificationsSubscription/map-to-props-factory";

const FootballFixture: FunctionComponent<ComponentProps> = ({
  competition,
  scoreboardProps,
  viewMode = ScoreboardViewMode.DEFAULT,
  showBottomSeparator,
  showEventDateBelow,
  availableToSubscribe,
  sporteventURN,
  iconsList,
  showHorizontalDuration,
}) => {
  let notificationIcon: JSX.Element | undefined;
  let competitionLabel: string | undefined;

  if (viewMode === ScoreboardViewMode.DEFAULT) {
    if (sporteventURN && availableToSubscribe) {
      notificationIcon = (
        <ConnectedNotificationsSubscription
          viewMode={NotificationsViewMode.EVENT_OR_RACE}
          component={NotificationsSubscription}
        />
      );
    }
    competitionLabel = competition;
  }

  const isCouponView = ScoreboardViewMode.COUPON === viewMode;

  return (
    <View testID={FOOTBALL_FIXTURE_CONTAINER}>
      <AvBFixture
        competitionLabel={competitionLabel}
        viewMode={viewMode}
        notificationsSubscription={notificationIcon}
        showBottomSeparator={showBottomSeparator}
      >
        <FootballScoreboard
          viewMode={viewMode}
          {...scoreboardProps}
          iconsList={iconsList}
          showEventDateBelow={showEventDateBelow}
          showHorizontalDuration={showHorizontalDuration}
          isHighlighted={!isCouponView}
        />
      </AvBFixture>
    </View>
  );
};

export default FootballFixture;
