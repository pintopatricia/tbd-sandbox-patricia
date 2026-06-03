import { Fragment, FunctionComponent, ReactNode, useMemo } from "react";
import { Pressable, View, Keyboard } from "react-native";
import { Card, KeyboardAwareScrollView, MarketBlurbs } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";

import { SBK_PLACE_PANEL, SBK_PLACE_PANEL_COLLAPSABLE_SECTION } from "./SportsbookPlacePanel.native.selectors";
import styles from "./SportsbookPlacePanel.native.styles";
import { PlaceFooter } from "../PlaceFooter/PlaceFooter.native";

import {
  SportsbookPlacePanelCollapsableCardViewModel,
  SportsbookPlacePanelViewModel,
  BetslipCollapsableCards,
  CardContent,
} from "./SportsbookPlacePanel.types";

const CollapsableCard: FunctionComponent<SportsbookPlacePanelCollapsableCardViewModel> = ({
  title,
  card,
  startsOpen,
  onToggle,
}) => (
  <View style={styles.cardContainer} {...getTestProps(SBK_PLACE_PANEL_COLLAPSABLE_SECTION, false)}>
    <Card
      title={title}
      startOpen={startsOpen}
      onTitleClick={onToggle}
      theme={CardTheme.PRIMARY}
      size={CardHeaderSize.SMALL}
      isCollapsible
      fullWidthContent
    >
      <Pressable accessible={false} onPress={Keyboard.dismiss} style={styles.collapseCardContent}>
        {card}
      </Pressable>
    </Card>
  </View>
);

export const SportsbookPlacePanel: FunctionComponent<SportsbookPlacePanelViewModel> = ({
  betslipCards,
  isPanelDisabled,
  isSummaryDisabled,
  isPlaceDisabled,
  hasFreeBets = false,
  isFreeBetsSelected = false,
  isFreeBetsDisabled = false,
  isOddsBoosted,
  totalReturns,
  isOddsMovementOn,
  showAcceptOddsMovementAlert,
  oddsMovementLabels,
  totalOriginalReturns,
  hasPlaceError,
  notifications,
  footerPrefix,
  placeBtnLabel,
  placeBtnSecondaryLabel,
  placeBtnLoadingLabel,
  reversePlaceBtnLabels = false,
  hasCTALoading,
  i18n,
  secondaryButton,
  freeBetsAlertMessage,
  isLoggedIn = false,
  balanceAfterBet,
  hasMarketBlurbs = false,
  onFreeBetsChange,
  onPlaceClick,
  onRemoveAllClick,
  onCollapseToggle,
  onFreeBetsRemovePress,
  onOddsMovementPreferencesChange,
}) => {
  const scrollableSection = useMemo(() => {
    const transformContentToCollapsableCards = (content: CardContent[]): ReactNode[] =>
      content.reduce((acc: ReactNode[], { card, title, startsOpen, collapsable }, index) => {
        if (card) {
          acc.push(
            collapsable ? (
              <CollapsableCard
                key={`collapsableCard|${title}|${index}`}
                card={card}
                title={title}
                startsOpen={startsOpen}
                onToggle={onCollapseToggle}
              />
            ) : (
              <Fragment key={index}>{card}</Fragment>
            ),
          );
        }
        return acc;
      }, []);

    const betslipCollapsableCards: BetslipCollapsableCards[] = betslipCards.reduce(
      (acc: BetslipCollapsableCards[], section) => {
        const { id, content } = section;
        const collapsableCards: ReactNode[] = transformContentToCollapsableCards(content);
        acc.push({
          id,
          content: collapsableCards,
        });
        return acc;
      },
      [],
    );

    return betslipCollapsableCards.flatMap(({ content }) => content);
  }, [betslipCards, onCollapseToggle]);

  return (
    <View {...getTestProps(SBK_PLACE_PANEL, false)} style={styles.sbkPlacePanel}>
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        {...getTestProps("scrollview", false)}
      >
        <View style={styles.scrollable}>{scrollableSection}</View>
      </KeyboardAwareScrollView>
      <View>
        {hasMarketBlurbs && (
          <View style={styles.blurbContainer}>
            <MarketBlurbs text={i18n.voidBlurbText} marketInfoCallback={() => {}} />
          </View>
        )}
      </View>
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
        onFreeBetsChange={onFreeBetsChange}
        onFreeBetsRemovePress={onFreeBetsRemovePress}
        onRemoveAllPress={onRemoveAllClick}
        onPlacePress={onPlaceClick}
        onOddsMovementPreferencesChange={onOddsMovementPreferencesChange}
      />
    </View>
  );
};
