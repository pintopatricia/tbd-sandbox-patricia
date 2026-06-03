import type { JSX } from "react";
import { FunctionComponent, useCallback } from "react";
import { FlatList, View } from "react-native";
import { Card, Divider, QuickLink, TBDImage } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FLAT_LIST_DEFAULTS } from "@ppb/the-wall-native/helpers/flatlist-props";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { navigate } from "@ppb/tbd-router/native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { CompetitionRegionMapped } from "./competition-region-card-view-model";
import { COLLAPSE_WRAPPER, COMPETITION_REGION_CARD_CONTAINER } from "./CompetitionRegionCard.native.selectors";
import { ComponentProps } from "./props";

import styles from "./CompetitionRegionCard.native.styles";

const CompetitionRegionCard: FunctionComponent<ComponentProps> = ({
  urn,
  competitionRegions,
  dispatchNavigateToCompetitionView,
}) => {
  const handleOnPress = useCallback(
    (viewLink: ViewLink, text: string) => {
      dispatchNavigateToCompetitionView(urn, viewLink.viewUrl, text);
      navigate(viewLink);
    },
    [dispatchNavigateToCompetitionView, urn],
  );

  const renderCompetitionRegion = useCallback(
    ({
      item: { title, flag, competitionViewLinks },
      index,
    }: {
      item: CompetitionRegionMapped;
      index: number;
    }): JSX.Element => (
      <View {...getTestProps(COLLAPSE_WRAPPER, false)}>
        <Card
          startOpen={false}
          isCollapsible={true}
          theme={CardTheme.PRIMARY}
          size={CardHeaderSize.LARGE}
          fullWidthContent={true}
          removeBorderRadius={true}
          title={title}
          startElement={
            !!flag && (
              <View style={styles.header}>
                <View style={styles.flag}>
                  <TBDImage source={flag} />
                </View>
              </View>
            )
          }
        >
          {competitionViewLinks.map(({ viewLink, title: quickLinkTitle }, competitionLinksIndex) => (
            <View key={`${urn}-${viewLink.viewUrn}`}>
              <QuickLink
                isIndented
                isLightBackground
                item={{ viewLink, text: quickLinkTitle }}
                onPress={() => handleOnPress(viewLink, quickLinkTitle)}
              />
              {competitionLinksIndex !== competitionViewLinks.length - 1 && <Divider />}
            </View>
          ))}
        </Card>
        {competitionRegions && index !== competitionRegions.length - 1 && <Divider />}
      </View>
    ),
    [handleOnPress, urn, competitionRegions],
  );

  const keyExtractor = useCallback(
    (competitionRegion: CompetitionRegionMapped) => `competition-region-card-${competitionRegion.urn}`,
    [],
  );

  if (!competitionRegions) {
    return null;
  }

  return (
    <View {...getTestProps(COMPETITION_REGION_CARD_CONTAINER, false)} style={styles.container}>
      <Card theme={CardTheme.PRIMARY} fullWidthContent={true}>
        <FlatList
          keyExtractor={keyExtractor}
          data={competitionRegions}
          renderItem={renderCompetitionRegion}
          removeClippedSubviews={FLAT_LIST_DEFAULTS.removeClippedSubviews}
        />
      </Card>
    </View>
  );
};

export default CompetitionRegionCard;
