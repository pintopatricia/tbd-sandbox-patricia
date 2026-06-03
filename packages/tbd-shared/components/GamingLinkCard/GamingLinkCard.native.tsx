import { FunctionComponent, useCallback } from "react";
import { HighlightedLinkCard } from "@ppb/the-wall-native/components/HighlightedLinkCard/HighlightedLinkCard";
import { navigate } from "@ppb/tbd-router/native";
import styles from "./GamingLinkCard.native.styles";
import { LoadedComponentProps } from "./props";

const GamingLinkCard: FunctionComponent<LoadedComponentProps> = ({
  urn,
  viewLink,
  name,
  icon,
  dispatchNavigateToGameCategoryViewAction,
}) => {
  const onTapHandler = useCallback(() => {
    dispatchNavigateToGameCategoryViewAction(viewLink, urn, icon, name);
    navigate(viewLink);
  }, [dispatchNavigateToGameCategoryViewAction, icon, name, urn, viewLink]);
  return (
    <HighlightedLinkCard
      urn={urn}
      label={name}
      cardIcon={icon}
      onTap={onTapHandler}
      style={styles.highlightedLinkCardContainer}
    />
  );
};

export default GamingLinkCard;
