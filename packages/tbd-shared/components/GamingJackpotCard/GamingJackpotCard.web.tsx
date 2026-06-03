import { FunctionComponent, useEffect, useRef } from "react";
import { JackpotMerchandise } from "./snowflakes/JackpotMerchandise/JackpotMerchandise.web";
import useTicker from "../../hooks/useTicker";
import { currencyFormatWithDecimalPlaces } from "../../formatters/currency-formatters";
import { CurrencyUserDetails } from "../../formatters/formatters";
import { LoadedComponentProps } from "./props";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import { jackpotTaggingService } from "../../services/TaggingService";

const GamingJackpotCard: FunctionComponent<LoadedComponentProps> = ({
  state,
  name,
  logoUrl,
  items,
  urn,
  userDetails,
  dispatchSubscribeJackpot,
  dispatchUnsubscribeJackpot,
  dispatchJackpotMerchandiseView,
  taggingService = jackpotTaggingService,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Dispatch GA4 event only when the card becomes visible
  const { observe } = useVisibilityObserver({
    onFirstShow: () => {
      if (!taggingService.hasFired(urn)) {
        taggingService.markFired(urn);
        const elementText =
          items
            ?.map((jackpot) => jackpot?.title?.trim() || "")
            .filter(Boolean)
            .join(", ") || "";
        dispatchJackpotMerchandiseView(state, name, urn, elementText);
      }
    },
  });

  // Observe the container element
  useEffect(() => {
    if (containerRef.current) {
      observe(containerRef.current, urn);
    }
  }, [observe, urn]);

  // Subscription runs on mount regardless of visibility (functional behavior)
  useEffect(() => {
    dispatchSubscribeJackpot(urn);

    return () => {
      dispatchUnsubscribeJackpot(urn);
    };
  }, [dispatchSubscribeJackpot, dispatchUnsubscribeJackpot, urn]);

  const JACKPOT_START_LESS = 6;

  const initTickerValue = (value: string | undefined): number => {
    const initValue = value ? Number(value) - JACKPOT_START_LESS : 0;
    return initValue >= 0 ? initValue : 0;
  };

  const tickers = [
    useTicker(initTickerValue(items[0]?.value), 100, true).ticker,
    useTicker(initTickerValue(items[1]?.value), 100, true).ticker,
    useTicker(initTickerValue(items[2]?.value), 100, true).ticker,
  ];

  if (items.length !== 3) {
    return <></>;
  }

  const jackpots = items.map((item, index) => ({
    ...item,
    value: currencyFormatWithDecimalPlaces({
      ...(userDetails as CurrencyUserDetails),
      value: tickers[index],
      decimalPlaces: 2,
    }),
  }));

  return (
    <div ref={containerRef}>
      <JackpotMerchandise state={state} logoUrl={logoUrl} items={jackpots} />
    </div>
  );
};

export default GamingJackpotCard;
