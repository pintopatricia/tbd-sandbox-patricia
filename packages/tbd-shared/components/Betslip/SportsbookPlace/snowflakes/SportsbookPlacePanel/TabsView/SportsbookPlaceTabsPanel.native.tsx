import { KeyboardAwareScrollView, MarketBlurbs, TabsGroup } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FunctionComponent, ReactNode, useMemo } from "react";
import { Keyboard, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { PlaceFooter } from "../../PlaceFooter/PlaceFooter.native";
import { SportsbookPlaceTabsPanelViewModel } from "./SportsbookPlaceTabsPanel.types";
import styles from "./SportsbookPlaceTabsPanel.native.styles";
import { useTabsViewModel } from "./view-model-builder";
import { TabsGroupSize } from "@ppb/the-wall-common/types";
import { TAB_RESOLVERS } from "./tabs-resolver.native";
import { SCROLL_VIEW } from "./SportsbookPlaceTabsPanel.native.selectors";

type KeyboardScrollViewProps = {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const KeyboardScrollView: FunctionComponent<KeyboardScrollViewProps> = ({ children, style }) => (
  <KeyboardAwareScrollView
    keyboardShouldPersistTaps="handled"
    keyboardDismissMode="on-drag"
    style={style}
    {...getTestProps(SCROLL_VIEW, false)}
  >
    <Pressable onPress={Keyboard.dismiss}>{children}</Pressable>
  </KeyboardAwareScrollView>
);

export const SportsbookPlaceTabsPanel: FunctionComponent<SportsbookPlaceTabsPanelViewModel> = (props) => {
  const {
    i18n,
    isPanelDisabled,
    isPlaceDisabled,
    notifications,
    footerPrefix,
    termsUrl,
    hasFreeBets,
    isFreeBetsSelected,
    isFreeBetsDisabled,
    freeBetsAlertMessage,
    isSummaryDisabled,
    balanceAfterBet,
    totalReturns,
    isOddsMovementOn,
    showAcceptOddsMovementAlert,
    oddsMovementLabels,
    totalOriginalReturns,
    isOddsBoosted,
    hasCTALoading,
    hasPlaceError,
    placeBtnLabel,
    placeBtnSecondaryLabel,
    placeBtnLoadingLabel,
    reversePlaceBtnLabels,
    isLoggedIn,
    secondaryButton,
    onFreeBetsChange,
    onFreeBetsRemovePress,
    onRemoveAllClick,
    onPlaceClick,
    hasMarketBlurbs,
    onTabSwitch,
    onOddsMovementPreferencesChange,
  } = props;

  const { headers, contents } = useTabsViewModel(props, TAB_RESOLVERS);

  const isSingleContent = contents?.length === 1;

  const content = useMemo(() => {
    if (!onTabSwitch || headers.length === 0 || contents?.length === 0) {
      return <></>;
    }

    if (isSingleContent) {
      return <KeyboardScrollView>{contents[0].content}</KeyboardScrollView>;
    }

    const scrollableContents = contents?.map((tab) => ({
      id: tab.id,
      content: <KeyboardScrollView style={styles.scrollableContentContainer}>{tab.content}</KeyboardScrollView>,
    }));

    return (
      <TabsGroup
        headers={headers}
        contents={scrollableContents}
        onTabSwitch={onTabSwitch}
        label={i18n.betslipAriaTitle}
        size={TabsGroupSize.Regular}
      />
    );
  }, [onTabSwitch, headers, contents, i18n.betslipAriaTitle]);

  return (
    <View style={[styles.sbkPlacePanel, !isSingleContent && { height: "100%" }]}>
      {content}
      {hasMarketBlurbs && (
        <View style={styles.blurbContainer}>
          <MarketBlurbs text={i18n.voidBlurbText} />
        </View>
      )}
      <PlaceFooter
        i18n={i18n}
        isPanelDisabled={isPanelDisabled}
        isPlaceDisabled={isPlaceDisabled}
        notifications={notifications}
        footerPrefix={footerPrefix}
        hasFreeBets={hasFreeBets}
        isFreeBetsSelected={isFreeBetsSelected}
        isFreeBetsDisabled={isFreeBetsDisabled}
        freeBetsAlertMessage={freeBetsAlertMessage}
        isSummaryDisabled={isSummaryDisabled}
        showAcceptOddsMovementAlert={showAcceptOddsMovementAlert}
        isOddsMovementOn={isOddsMovementOn}
        oddsMovementLabels={oddsMovementLabels}
        balanceAfterBet={balanceAfterBet}
        totalReturns={totalReturns}
        totalOriginalReturns={totalOriginalReturns}
        isOddsBoosted={isOddsBoosted}
        hasCTALoading={hasCTALoading}
        hasPlaceError={hasPlaceError}
        placeBtnLabel={placeBtnLabel}
        placeBtnSecondaryLabel={placeBtnSecondaryLabel}
        placeBtnLoadingLabel={placeBtnLoadingLabel}
        reversePlaceBtnLabels={reversePlaceBtnLabels}
        isLoggedIn={isLoggedIn}
        secondaryButton={secondaryButton}
        termsUrl={termsUrl}
        onFreeBetsChange={onFreeBetsChange}
        onFreeBetsRemovePress={onFreeBetsRemovePress}
        onRemoveAllPress={onRemoveAllClick}
        onPlacePress={onPlaceClick}
        onOddsMovementPreferencesChange={onOddsMovementPreferencesChange}
      />
    </View>
  );
};
