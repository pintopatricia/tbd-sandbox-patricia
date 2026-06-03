import { TabsGroupSize } from "@ppb/the-wall-common/types";
import classnames from "classnames";
import { MarketBlurbs, TabsGroup } from "@ppb/the-wall-web";
import { FunctionComponent, useMemo } from "react";
import { PlaceFooter } from "../../PlaceFooter/PlaceFooter.web";
import { SportsbookPlaceTabsPanelViewModel } from "./SportsbookPlaceTabsPanel.types";
import styles from "./SportsbookPlaceTabsPanel.web.css";
import { useTabsViewModel } from "./view-model-builder";
import { TAB_RESOLVERS } from "./tabs-resolver.web";

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
    totalOriginalReturns,
    isOddsBoosted,
    isOddsMovementOn,
    showAcceptOddsMovementAlert,
    oddsMovementLabels,
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
      return contents[0].content;
    }

    return (
      <TabsGroup
        headers={headers}
        contents={contents}
        onTabSwitch={onTabSwitch}
        label={i18n.betslipAriaTitle}
        size={TabsGroupSize.Regular}
      />
    );
  }, [onTabSwitch, headers, contents, i18n.betslipAriaTitle]);

  return (
    <section className={classnames(styles.container, { [styles.singlesContainer]: isSingleContent })}>
      {content}
      {hasMarketBlurbs && (
        <div className={styles.blurbContainer}>
          <MarketBlurbs text={i18n.voidBlurbText} />
        </div>
      )}
      <PlaceFooter
        i18n={i18n}
        isPanelDisabled={isPanelDisabled}
        isPlaceDisabled={isPlaceDisabled}
        notifications={notifications}
        footerPrefix={footerPrefix}
        termsUrl={termsUrl}
        hasFreeBets={hasFreeBets}
        isFreeBetsSelected={isFreeBetsSelected}
        isFreeBetsDisabled={isFreeBetsDisabled}
        freeBetsAlertMessage={freeBetsAlertMessage}
        isSummaryDisabled={isSummaryDisabled}
        balanceAfterBet={balanceAfterBet}
        totalReturns={totalReturns}
        totalOriginalReturns={totalOriginalReturns}
        isOddsBoosted={isOddsBoosted}
        showAcceptOddsMovementAlert={showAcceptOddsMovementAlert}
        isOddsMovementOn={isOddsMovementOn}
        oddsMovementLabels={oddsMovementLabels}
        hasCTALoading={hasCTALoading}
        hasPlaceError={hasPlaceError}
        placeBtnLabel={placeBtnLabel}
        placeBtnSecondaryLabel={placeBtnSecondaryLabel}
        placeBtnLoadingLabel={placeBtnLoadingLabel}
        reversePlaceBtnLabels={reversePlaceBtnLabels}
        isLoggedIn={isLoggedIn}
        secondaryButton={secondaryButton}
        onFreeBetsChange={onFreeBetsChange}
        onFreeBetsRemovePress={onFreeBetsRemovePress}
        onRemoveAllPress={onRemoveAllClick}
        onPlacePress={onPlaceClick}
        onOddsMovementPreferencesChange={onOddsMovementPreferencesChange}
      />
    </section>
  );
};
