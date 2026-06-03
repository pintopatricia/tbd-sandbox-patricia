import { FunctionComponent, useCallback, useMemo } from "react";
import { Pressable } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { navigate } from "@ppb/tbd-router/native";
import { CircularImageSize } from "./snowflakes/CircularImage/CircularImage.types";
import { CircularImage } from "./snowflakes/CircularImage/CircularImage.native";

import { ComponentProps } from "./props";
import { COMPETITION_VIEW_LINK_CARD } from "./CompetitionViewLinkCard.native.selectors";
import styles from "./CompetitionViewLinkCard.native.styles";

const CompetitionViewLinkCard: FunctionComponent<ComponentProps> = ({
  urn,
  viewLink,
  name,
  logo,
  fallbackIcon,
  dispatchNavigateToCompetitionView,
}) => {
  const onCompetitionLinkClick = useCallback((): void => {
    if (viewLink) {
      dispatchNavigateToCompetitionView(viewLink.viewUrl, name, urn);
      navigate(viewLink);
    }
  }, [viewLink, dispatchNavigateToCompetitionView, name, urn]);

  const circularImage = useMemo(
    () => <CircularImage imageURL={logo} fallbackIcon={fallbackIcon} text={name} size={CircularImageSize.Small} />,
    [fallbackIcon, logo, name],
  );

  return (
    <Pressable
      key={urn}
      onPress={onCompetitionLinkClick}
      {...getTestProps(COMPETITION_VIEW_LINK_CARD, false)}
      style={styles.container}
    >
      {circularImage}
    </Pressable>
  );
};

export default CompetitionViewLinkCard;
