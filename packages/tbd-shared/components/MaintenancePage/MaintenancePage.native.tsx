import { FC, useEffect, useState, useCallback, useRef, useMemo } from "react";
import { WebView, WebViewNavigation } from "react-native-webview";
import { View, ActivityIndicator, ScrollView } from "react-native";

import { QuickLink, PrimaryButton, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { navigate, resetNavigationStack, popLastFromStack } from "@ppb/tbd-router/native";
import { GenericIcon, GenericIconProps } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { SplashStatus } from "@ppb/tbd-store/state/layout/views/View.types";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { EntityType } from "@ppb/tbd-urn-codecs";

import config from "../../config/app-configuration.native";
import { getEndpoint } from "../../config/endpoints";
import { ComponentProps } from "./props";
import { LOADING_CONTAINER, REFRESH_BUTTON } from "./MaintenancePage.native.selectors";
import { splashedStyles, webSplashViewStyles } from "./MaintenancePage.native.styles";
import RegulatoryCard from "../RegulatoryCard/RegulatoryCard.native";
import ConnectedRegulatoryCard from "../RegulatoryCard";
import { Product } from "./map-to-props-factory";
import NativeWebView from "../Navigation/screens/NativeWebView.native";
import { getQuicklinkRoundCorners } from "../../helpers/quicklink";

const iconPropsBy: IconPropsByStatus = {
  OK: {
    name: SystemIconName.NOTIFICATION_SUCCESS,
    color: tokens.MessagingSuccessIconDefault,
  },
  SPLASHED: {
    name: SystemIconName.NOTIFICATION_WARNING,
    color: tokens.QuickLinkPrimaryDefaultIconErrorColour,
  },
};

type IconPropsByStatus = Record<SplashStatus, GenericIconProps>;

type SplashedLinkProps = Product & Pick<ComponentProps, "isExchangeEnabled" | "dispatchToProduct">;

const SplashedLink: FC<SplashedLinkProps> = ({
  product,
  status,
  viewLink,
  title,
  isExchangeEnabled,
  dispatchToProduct,
  roundCorners,
}) => {
  const item = useMemo(() => ({ text: title }), [title]);

  const onPress = useCallback(() => {
    if (product === ProductsOption.exchange && !isExchangeEnabled) {
      navigate({
        viewUrn: EntityType.ExternalView,
        viewUrl: "bfsportsbetting://",
        fallbackViewUrl: getEndpoint("EXCHANGE_SITE"),
      });
      return;
    }

    dispatchToProduct({ product, viewLink });
    popLastFromStack();
    navigate(viewLink);
  }, [dispatchToProduct, product, viewLink, isExchangeEnabled]);

  const icon = (
    <View style={splashedStyles.icon}>
      <GenericIcon {...iconPropsBy[status]} />
    </View>
  );

  return (
    <QuickLink icon={icon} item={item} roundCorners={roundCorners} onPress={status === "OK" ? onPress : undefined} />
  );
};

type SplashedProps = Pick<
  ComponentProps,
  "urn" | "twitterURL" | "text" | "products" | "isExchangeEnabled" | "dispatchToProduct" | "dispatchFetchCatalogue"
>;

const Splashed: FC<SplashedProps> = ({
  urn,
  twitterURL,
  text,
  products,
  isExchangeEnabled,
  dispatchToProduct,
  dispatchFetchCatalogue,
}) => {
  const webViewRef = useRef<WebView>(null);

  const handleNavigationStateChange = useCallback(
    (event: WebViewNavigation) => {
      if (twitterURL && event.url.includes(twitterURL)) {
        return;
      }

      webViewRef?.current?.stopLoading();
      navigate({
        viewUrl: event.url,
        viewUrn: "ppb:tbd:view:external",
      });
    },
    [twitterURL],
  );

  useEffect(() => {
    const timer = setInterval(() => {
      dispatchFetchCatalogue(urn);
    }, 60000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <ScrollView
      style={splashedStyles.container}
      contentContainerStyle={splashedStyles.containerContent}
      scrollEventThrottle={16}
    >
      <View style={splashedStyles.wrap}>
        <Text style={splashedStyles.title}>{text.pageTitle}</Text>
        <Text style={splashedStyles.description}>{text.description}</Text>
      </View>

      <View style={splashedStyles.wrap}>
        <Text style={splashedStyles.title}>{text.productsTitle}</Text>
        <View style={splashedStyles.links}>
          {products.map((maintenanceProduct, index) => {
            const roundCorners = getQuicklinkRoundCorners(products, index);

            return (
              <SplashedLink
                key={maintenanceProduct.product}
                isExchangeEnabled={isExchangeEnabled}
                {...maintenanceProduct}
                dispatchToProduct={dispatchToProduct}
                roundCorners={roundCorners}
              />
            );
          })}
        </View>
      </View>
      {twitterURL ? (
        <>
          <Text style={splashedStyles.twitterTitle}>{text.twitter}</Text>
          <View style={splashedStyles.twitterWrap}>
            <NativeWebView
              ref={webViewRef}
              style={splashedStyles.twitterFrame}
              source={{ uri: twitterURL }}
              onNavigationStateChange={handleNavigationStateChange}
            />
          </View>
        </>
      ) : null}
      <ConnectedRegulatoryCard component={RegulatoryCard} urn={"ppb:tbd:card:regulatory:footer"} />
    </ScrollView>
  );
};

const REFRESH_BUTTON_THROTTLE = 5000;

const WebSplashView: FC<{
  url: ComponentProps["webSplashURL"];
  refreshButton: ComponentProps["text"]["refreshButton"];
}> = ({ url, refreshButton }) => {
  const [enableRefresh, setEnableRefresh] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const webViewRef = useRef<WebView>(null);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setEnableRefresh(true);
    }, REFRESH_BUTTON_THROTTLE);

    return () => {
      clearTimeout(timeout);
    };
  }, []);

  const onLoadEnd = useCallback(() => {
    if (!hasLoaded) {
      setHasLoaded(true);
    }
  }, [hasLoaded]);

  const handleWebViewNavigationStateChange = useCallback(
    (event: WebViewNavigation) => {
      if (!event.url.includes(url)) {
        webViewRef?.current?.stopLoading();
        navigate({
          viewUrl: event.url,
          viewUrn: "ppb:tbd:view:external",
        });
      }
    },
    [url],
  );

  const webViewStyles = useMemo(() => [!hasLoaded && { opacity: 0 }], [hasLoaded]);

  return (
    <>
      {!hasLoaded && (
        <View {...getTestProps(LOADING_CONTAINER, false)}>
          <ActivityIndicator style={webSplashViewStyles.loading} />
        </View>
      )}
      <NativeWebView
        ref={webViewRef}
        style={webViewStyles}
        cacheEnabled={false}
        sharedCookiesEnabled
        source={{ uri: `${url}?swa_product=${config.appName}` }}
        onNavigationStateChange={handleWebViewNavigationStateChange}
        onLoadEnd={onLoadEnd}
      />
      <View style={webSplashViewStyles.refreshButtonContainer}>
        <PrimaryButton
          label={refreshButton}
          disabled={!enableRefresh}
          onTap={resetNavigationStack}
          {...getTestProps(REFRESH_BUTTON)}
        />
      </View>
    </>
  );
};

const MaintenancePage: FC<ComponentProps> = ({
  urn,
  webSplashURL,
  twitterURL,
  text,
  products,
  isExchangeEnabled,
  dispatchToProduct,
  dispatchFetchCatalogue,
}) => {
  if (webSplashURL) {
    return <WebSplashView url={webSplashURL} refreshButton={text.refreshButton} />;
  }

  return (
    <Splashed
      urn={urn}
      text={text}
      products={products}
      twitterURL={twitterURL}
      isExchangeEnabled={isExchangeEnabled}
      dispatchToProduct={dispatchToProduct}
      dispatchFetchCatalogue={dispatchFetchCatalogue}
    />
  );
};

export default MaintenancePage;
