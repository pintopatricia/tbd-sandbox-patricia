import { FunctionComponent, useContext, Fragment, ReactNode, forwardRef, useMemo } from "react";
import classnames from "classnames";

import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";

import { Card, MarketBlurbs } from "@ppb/the-wall-web";

import { PlaceFooter } from "../PlaceFooter/PlaceFooter.web";
import {
  SportsbookPlacePanelCollapsableCardViewModel,
  SportsbookPlacePanelViewModel,
  BetslipCollapsableCards,
  CardContent,
} from "./SportsbookPlacePanel.types";

import styles from "./SportsbookPlacePanel.web.css";
import { ConfigContext } from "../../../../Config/ConfigContext";

const CollapsableCard: FunctionComponent<SportsbookPlacePanelCollapsableCardViewModel> = ({
  title,
  card,
  startsOpen,
  onToggle,
}) => (
  <div className={styles.cardContainer}>
    <Card
      title={title}
      startOpen={startsOpen}
      onTitleClick={onToggle}
      theme={CardTheme.PRIMARY}
      size={CardHeaderSize.SMALL}
      isCollapsible
      fullWidthContent
    >
      <div className={styles.cardContent}>{card}</div>
    </Card>
  </div>
);

export const SportsbookPlacePanel = forwardRef<HTMLDivElement, SportsbookPlacePanelViewModel>(
  (
    {
      betslipCards,
      footerPrefix,
      hasCTALoading = true,
      hasFreeBets,
      hasPlaceError,
      i18n,
      isDesktop,
      isFreeBetsSelected,
      isFreeBetsDisabled = false,
      isOddsBoosted = false,
      isPanelDisabled,
      isPlaceDisabled,
      isOddsMovementOn,
      oddsMovementLabels,
      isSummaryDisabled,
      showAcceptOddsMovementAlert,
      notifications,
      placeBtnLabel,
      placeBtnSecondaryLabel,
      placeBtnLoadingLabel,
      reversePlaceBtnLabels = false,
      totalOriginalReturns,
      totalReturns,
      secondaryButton,
      termsUrl,
      freeBetsAlertMessage,
      isLoggedIn = false,
      balanceAfterBet,
      hasMarketBlurbs = false,
      onCollapseToggle,
      onFreeBetsChange,
      onRemoveAllClick,
      onPlaceClick,
      onFreeBetsRemovePress,
      onOddsMovementPreferencesChange,
    },
    ref,
  ) => {
    const { isDesktopLayout } = useContext(ConfigContext);

    const scrollableClassnames = classnames(styles.scrollable, {
      [styles.scrollableDesktop]: isDesktop,
    });

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
      <section
        className={classnames(styles.sbkPlacePanel, {
          [styles.desktopView]: isDesktopLayout,
        })}
      >
        <div className={scrollableClassnames} ref={ref}>
          {scrollableSection}
        </div>
        {hasMarketBlurbs && (
          <div className={styles.blurbContainer}>
            <MarketBlurbs text={i18n.voidBlurbText} marketInfoCallback={() => {}} />
          </div>
        )}
        <PlaceFooter
          i18n={i18n}
          isPanelDisabled={isPanelDisabled}
          isPlaceDisabled={isPlaceDisabled}
          notifications={notifications}
          isOddsMovementOn={isOddsMovementOn}
          footerPrefix={footerPrefix}
          showAcceptOddsMovementAlert={showAcceptOddsMovementAlert}
          oddsMovementLabels={oddsMovementLabels}
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
  },
);

SportsbookPlacePanel.displayName = "SportsbookPlacePanel";
