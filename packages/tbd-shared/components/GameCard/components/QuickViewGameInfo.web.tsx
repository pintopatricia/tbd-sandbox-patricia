import { FunctionComponent, useEffect, useRef, useState } from "react";
import type { MouseEvent, KeyboardEvent } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import classNames from "classnames";
import { createPortal } from "react-dom";

import { QuickViewGameInfoProps } from "./QuickViewGameInfo.types";
import styles from "./QuickViewGameInfo.web.css";
import GameInfo from "../../GameInfo/GameInfo.web";
import RegulatoryCard from "../../RegulatoryCard/RegulatoryCard.web";
import ConnectedRegulatoryCard from "../../RegulatoryCard";
import { useFavouriteGamesErrorToast } from "../../../hooks/useFavouriteGamesErrorToast";
import { ErrorToast } from "../../ErrorToast/ErrorToast.web";

const QuickViewGameInfo: FunctionComponent<QuickViewGameInfoProps> = ({
  urn,
  gameUrn,
  isLoggedIn,
  mainProduct,
  gameLaunchId,
  providerUid,
  currencyCode,
  currencySymbol,
  localeCodeBcp47,
  jackpotAmount,
  tableNames,
  isBetslipContainerDisplayed,
  gameInfoProps,
  dispatchLaunchGame,
  dispatchSubscribeToUpdateGameFeedResults,
  dispatchUnsubscribeToUpdateGameFeedResults,
  onClose,
  isFavourite,
  isFavouriteGamesEnabled,
  onFavouritesButtonClick,
  uid,
  gameName,
  gameProviderName,
  favouriteGamesErrorState,
  dispatchClearFavouriteGamesError,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const modalContainerRef = useRef<HTMLDivElement>(null);

  const { isVisible: isErrorVisible, hideToast } = useFavouriteGamesErrorToast({
    errorTimestamp: favouriteGamesErrorState?.timestamp ?? null,
    errorGameId: favouriteGamesErrorState?.gameId ?? null,
    gameId: uid,
    onDismiss: dispatchClearFavouriteGamesError,
  });

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const container = modalContainerRef.current;

    if (!container) return undefined;

    const handleScroll = () => {
      setScrolled(container.scrollTop > 0);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if ("key" in e) {
      if (e.key !== "Enter" && e.key !== " ") return;
    }
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const modalHeaderClass = classNames(styles.modalHeader, {
    [styles.modalHeaderScrolled]: scrolled,
  });

  if (!urn) {
    return null;
  }

  return createPortal(
    <div
      className={styles.overlay}
      data-testid="quickview-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleOverlayClick}
      role="button"
      tabIndex={0}
    >
      <div className={styles.modal}>
        <div className={modalHeaderClass}>
          {scrolled && <h3 className={styles.modalTitle}>{gameInfoProps?.title}</h3>}
          <div
            role="button"
            tabIndex={0}
            onClick={onClose}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClose();
              }
            }}
            className={styles.closeButton}
          >
            <GenericIcon name={SystemIconName.CLOSE} color="#F4F4F4" />
          </div>
        </div>
        <div className={styles.modalContainer} ref={modalContainerRef} data-testid="scroll-container">
          <div>
            <GameInfo
              urn={urn}
              gameUrn={gameUrn}
              gameName={gameName}
              currencyCode={currencyCode}
              localeCodeBcp47={localeCodeBcp47}
              gameLaunchId={gameLaunchId}
              gameProviderName={gameProviderName}
              providerUid={providerUid}
              mainProduct={mainProduct}
              gameInfoProps={gameInfoProps}
              dispatchLaunchGame={dispatchLaunchGame}
              dispatchSubscribeToUpdateGameFeedResults={dispatchSubscribeToUpdateGameFeedResults}
              dispatchUnsubscribeToUpdateGameFeedResults={dispatchUnsubscribeToUpdateGameFeedResults}
              jackpotAmount={jackpotAmount}
              tableNames={tableNames}
              isBetslipContainerDisplayed={isBetslipContainerDisplayed}
              isLoggedIn={isLoggedIn}
              actionsClassName={styles.modalFooter}
              currencySymbol={currencySymbol}
              isFavourite={isFavourite}
              isFavouriteGamesEnabled={isFavouriteGamesEnabled}
              onFavouritesButtonClick={onFavouritesButtonClick}
              uid={uid}
            />
          </div>
          <div>
            <ConnectedRegulatoryCard component={RegulatoryCard} urn={"ppb:tbd:card:regulatory:footer"} />
          </div>
        </div>
        {isErrorVisible && <ErrorToast message={"Failed to update favourite games"} onClose={hideToast} />}
      </div>
    </div>,
    document.body,
  );
};

export default QuickViewGameInfo;
