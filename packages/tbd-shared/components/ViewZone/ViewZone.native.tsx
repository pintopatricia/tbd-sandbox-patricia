import { Fragment, FunctionComponent, useCallback } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import type { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { Text } from "@ppb/the-wall-native";
import type { ComponentProps } from "./props";

import styles from "./ViewZone.native.styles";
import selectors from "./ViewZone.native.selectors";

import ConnectedCardGroup from "../CardGroup";
import ConnectedSegmentedCardGroup from "../SegmentedCardGroup";

import CardGroup from "../CardGroup/CardGroup.native";
import SegmentedCardGroup from "../SegmentedCardGroup/SegmentedCardGroup.native";

import SegmentedCardGroupPlaceholder from "../SegmentedCardGroup/SegmentedCardGroupPlaceholder.native";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";

const ViewZone: FunctionComponent<ComponentProps> = ({ urn, title, items }) => {
  const renderItem = useCallback(({ urn: itemUrn, typename }: PartialItem) => {
    switch (typename) {
      case "SegmentedCardGroup":
        return (
          <ConnectedSegmentedCardGroup
            urn={itemUrn}
            component={SegmentedCardGroup}
            placeholder={SegmentedCardGroupPlaceholder}
          />
        );
      default:
        return <ConnectedCardGroup urn={itemUrn} typename={typename} component={CardGroup} />;
    }
  }, []);

  if (!items?.length) {
    return null;
  }

  return (
    <ErrorBoundary urn={urn}>
      <View {...getTestProps(selectors.VIEW_ZONE_CONTAINER, false)}>
        {!!title && (
          <Text style={styles.title} {...getTestProps(selectors.VIEW_ZONE_TITLE, false)}>
            {title}
          </Text>
        )}
        {items.map((item, index) => (
          <Fragment key={index}>{renderItem(item)}</Fragment>
        ))}
      </View>
    </ErrorBoundary>
  );
};

export default ViewZone;
