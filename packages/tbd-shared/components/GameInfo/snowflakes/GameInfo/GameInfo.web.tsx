import { FunctionComponent, useCallback, MouseEvent } from "react";
import classnames from "classnames";
import { Link, PrimaryButton, RichTextComponent, SecondaryButton } from "@ppb/the-wall-web";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import type { GameInfoProperties } from "./GameInfo.types";
import styles from "./GameInfo.web.css";
import { getTableContent } from "../../helper";
import TableRow from "./components/TableRow/TableRow.web";
import { getIconByKey } from "../../iconMapper";
import { Pill } from "./components/Pill/Pill.web";
import { GameInfoCarousel } from "./components/GameInfoCarousel/GameInfoCarousel.web";

export const GameInfo: FunctionComponent<GameInfoProperties> = (props) => {
  const {
    gameMechanics,
    gameStudio,
    gameTheme,
    gameType,
    gameVolatility,
    gameHelp,
    jackpotType,
    minStake,
    maxStake,
    rtp,
    title,
    howToPlayDetails,
    i18n,
    cardRef,
    className,
    isDemoButtonDisplayed,
    playNowButtonOnClick,
    launchUrl,
    currencySymbol,
    launchUrlDemoMode,
    urlsTarget = "_self",
    screenshots,
    flattenedImage,
    isLoggedIn,
    isFavourite,
    isFavouriteGamesEnabled,
    onFavouritesButtonClick,
    gameLaunchId,
    dispatchAddToFavouriteGames,
    dispatchRemoveFromFavouriteGames,
    mainProduct,
    uid,
    gameName,
    gameProviderName,
    urn,
  } = props;

  const handleFavoriteClick = useCallback(
    (event: MouseEvent): void => {
      event.preventDefault();
      event.stopPropagation();

      if (!gameLaunchId) {
        return;
      }
      if (uid && mainProduct) {
        if (isFavourite) {
          dispatchRemoveFromFavouriteGames?.(uid, mainProduct, gameName, gameProviderName, urn);
        } else {
          dispatchAddToFavouriteGames?.(uid, mainProduct, gameName, gameProviderName, urn);
        }
      }
    },
    [
      uid,
      isFavourite,
      dispatchAddToFavouriteGames,
      dispatchRemoveFromFavouriteGames,
      gameLaunchId,
      mainProduct,
      gameName,
      gameProviderName,
      urn,
    ],
  );

  const favoriteHandler =
    onFavouritesButtonClick ||
    (dispatchAddToFavouriteGames && dispatchRemoveFromFavouriteGames ? handleFavoriteClick : undefined);

  const buttonContainerClass = classnames(styles.buttonContainer, className, {
    [styles.buttonContainerFlex]: isDemoButtonDisplayed,
  });
  const minStakeWithCurrency = `${currencySymbol}${minStake}`;
  const maxStakeWithCurrency = `${currencySymbol}${maxStake}`;
  const tableArray = getTableContent({
    gameMechanics,
    gameStudio,
    gameTheme,
    jackpotType,
    ...(minStake !== undefined && {
      minStakeWithCurrency,
    }),
    ...(maxStake !== undefined && {
      maxStakeWithCurrency,
    }),
  });
  const pillsArray = [
    rtp && `${i18n.rtp} ${rtp}`,
    gameType,
    gameVolatility && `${gameVolatility} ${i18n.volatility}`,
  ].filter(Boolean);

  return (
    <div className={styles.gameInfoContainer} ref={cardRef}>
      <div className={styles.gameInfowWrapper}>
        <GameInfoCarousel flattenedImage={flattenedImage} screenshots={screenshots} />
        <div className={styles.infoContainer}>
          <h1 className={styles.title}>{title}</h1>
          {pillsArray?.length > 0 && (
            <div className={styles.keyInfoSection}>
              {pillsArray?.map((label, index, arr) => (
                <Pill key={label} label={label} showDot={index < arr.length - 1} />
              ))}
            </div>
          )}
          {isLoggedIn && isFavouriteGamesEnabled && favoriteHandler && (
            <div className={styles.favoriteButtonContainer}>
              <button className={styles.favoriteButton} onClick={favoriteHandler} data-testid="favorite-button">
                <GenericIcon name={isFavourite ? SystemIconName.HEART_FILLED : SystemIconName.HEART_OUTLINE} />
                {isFavourite ? i18n.removeFromFavourites : i18n.addToFavourites}
              </button>
            </div>
          )}
          {!tableArray?.every((item) => !String(item.value || "").trim()) && (
            <div className={styles.table}>
              <div className={styles.tableHeader}>
                <p className={styles.tableTitle}>{i18n.glance}</p>
              </div>
              <div className={styles.tableContent}>
                {tableArray?.map(({ label, value, prop }) =>
                  value ? <TableRow key={prop ?? label} icon={getIconByKey(prop)} label={label} value={value} /> : null,
                )}
                {gameHelp && (
                  <TableRow key={"game-help"} icon={getIconByKey("gameHelp")} label={i18n.gameHelp} href={gameHelp} />
                )}
              </div>
            </div>
          )}
          {howToPlayDetails?.content && (
            <div className={styles.howToPlayDetails}>
              <h2 className={styles.infoHeadlineTitle}>{i18n.description}</h2>
              <RichTextComponent list={howToPlayDetails.content} />
            </div>
          )}
          <div className={buttonContainerClass}>
            {isDemoButtonDisplayed && (
              <Link
                item={{ viewLink: launchUrlDemoMode, target: urlsTarget }}
                onClick={() => playNowButtonOnClick(true)}
              >
                <SecondaryButton label="Demo" onTap={() => {}} stopAnimation />
              </Link>
            )}
            <Link item={{ viewLink: launchUrl, target: urlsTarget }} onClick={() => playNowButtonOnClick(false)}>
              <PrimaryButton label={i18n.playNow} onTap={() => {}} stopAnimation />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
