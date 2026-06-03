/* eslint-disable no-underscore-dangle */
import { AccountBannersCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { AccountBannersCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const attentionLevelMapper = (attentionLevel: string): string => {
  switch (attentionLevel) {
    case "CONFIRMATION":
      return "SUCCESS";
    case "SEVERE":
      return "ERROR";
    default:
      return attentionLevel;
  }
};

const normalizeAccountBannersCardFragmentIntoAccountBannersCard = (
  fragment: AccountBannersCardFragment,
): TransformedFragment<AccountBannersCard> => {
  const rgBanners =
    fragment.bannerDetails && fragment.bannerDetails.filter((banner) => banner && banner.bannerType === "rg");
  const totalRgBannersNumber = rgBanners && rgBanners.length;
  const bannerDetails =
    fragment.bannerDetails &&
    fragment.bannerDetails.map((banner, index) => {
      if (!banner) {
        return { index };
      }
      return {
        index,
        bannerInfo: banner.bannerInfo && {
          title:
            banner.bannerType === "rg"
              ? `${banner.bannerInfo.title} ${rgBanners && rgBanners.indexOf(banner) + 1}/${totalRgBannersNumber}`
              : banner.bannerInfo.title,
          bodyContent: banner.bannerInfo.bodyContent && {
            text: banner.bannerInfo.bodyContent.text,
            items: banner.bannerInfo.bodyContent.items,
            formContent: banner.bannerInfo.bodyContent.formContent && {
              addressInfo: banner.bannerInfo.bodyContent.formContent.addressInfo && {
                addressLabel: banner.bannerInfo.bodyContent.formContent.addressInfo.addressLabel,
                postcodeLabel: banner.bannerInfo.bodyContent.formContent.addressInfo.postcodeLabel,
                jumioAddressStreetName: banner.bannerInfo.bodyContent.formContent.addressInfo.jumioAddressStreetName,
                jumioAddressCity: banner.bannerInfo.bodyContent.formContent.addressInfo.jumioAddressCity,
                jumioAddressProvince: banner.bannerInfo.bodyContent.formContent.addressInfo.jumioAddressProvince,
              },
            },
            contactUsInfo: banner.bannerInfo.bodyContent.contactUsInfo && {
              link: banner.bannerInfo.bodyContent.contactUsInfo.link,
              label: banner.bannerInfo.bodyContent.contactUsInfo.label,
            },
          },
        },
        minimizedBannerInfo: banner.minimizedBannerInfo && {
          bodyText: banner.minimizedBannerInfo.bodyText,
        },
        bannerActions:
          (banner.bannerActions &&
            banner.bannerActions.map((action) => ({
              label: action && action.label,
              gaLabel: action && action.gaLabel,
              minimizedLabel: action && action.minimizedLabel,
              type: action && action.type,
              buttonType: action && action.buttonType,
              path: action && action.path,
              url: action && action.url,
              target: action && action.target,
              action: action && action.action,
              data: action && action.data,
              actionFinalize: {
                onErrorBanner: action &&
                  action.actionFinalize &&
                  action.actionFinalize.onErrorBanner && {
                    index,
                    bannerInfo: action.actionFinalize.onErrorBanner.bannerInfo && {
                      title: action.actionFinalize.onErrorBanner.bannerInfo.title,
                      bodyContent: action.actionFinalize.onErrorBanner.bannerInfo.bodyContent && {
                        text: action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.text,
                        items: action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.items,
                        formContent: action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.formContent && {
                          addressInfo: action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.formContent
                            .addressInfo && {
                            addressLabel:
                              action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.formContent.addressInfo
                                .addressLabel,
                            postcodeLabel:
                              action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.formContent.addressInfo
                                .postcodeLabel,
                            jumioAddressStreetName:
                              action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.formContent.addressInfo
                                .jumioAddressStreetName,
                            jumioAddressCity:
                              action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.formContent.addressInfo
                                .jumioAddressCity,
                            jumioAddressProvince:
                              action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.formContent.addressInfo
                                .jumioAddressProvince,
                          },
                        },
                        contactUsInfo: action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.contactUsInfo && {
                          link: action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.contactUsInfo.link,
                          label: action.actionFinalize.onErrorBanner.bannerInfo.bodyContent.contactUsInfo.label,
                        },
                      },
                    },
                    minimizedBannerInfo: action.actionFinalize.onErrorBanner.minimizedBannerInfo && {
                      bodyText: action.actionFinalize.onErrorBanner.minimizedBannerInfo.bodyText,
                    },
                    bannerActions:
                      (action &&
                        action.actionFinalize &&
                        action.actionFinalize.onErrorBanner &&
                        action.actionFinalize.onErrorBanner.bannerActions &&
                        action?.actionFinalize?.onErrorBanner?.bannerActions.map((reducedAction) => ({
                          label: reducedAction && reducedAction.label,
                          gaLabel: reducedAction && reducedAction.gaLabel,
                          minimizedLabel: reducedAction && reducedAction.minimizedLabel,
                          type: reducedAction && reducedAction.type,
                          buttonType: reducedAction && reducedAction.buttonType,
                          path: reducedAction && reducedAction.path,
                          url: reducedAction && reducedAction.url,
                          target: reducedAction && reducedAction.target,
                          action: reducedAction && reducedAction.action,
                          data: reducedAction && reducedAction.data,
                        }))) ||
                      [],
                    isMinimized: action.actionFinalize.onErrorBanner.isMinimized,
                    priority: action.actionFinalize.onErrorBanner.priority,
                    useCase: action.actionFinalize.onErrorBanner.useCase,
                    flow: action.actionFinalize.onErrorBanner.flow,
                    template: action.actionFinalize.onErrorBanner.template,
                    attentionLevel:
                      action.actionFinalize.onErrorBanner.attentionLevel &&
                      attentionLevelMapper(action.actionFinalize.onErrorBanner.attentionLevel),
                    maxDisplays: action.actionFinalize.onErrorBanner.maxDisplays,
                    version: action.actionFinalize.onErrorBanner.version,
                    isClosable: action.actionFinalize.onErrorBanner.isClosable,
                  },
              },
            }))) ||
          [],
        isMinimized: banner.isMinimized,
        priority: banner.priority,
        useCase: banner.useCase,
        flow: banner.flow,
        template: banner.template,
        attentionLevel: banner.attentionLevel && attentionLevelMapper(banner?.attentionLevel),
        maxDisplays: banner.maxDisplays,
        version: banner.version,
        isClosable: banner.isClosable,
        bannerType: banner.bannerType,
      };
    });

  return {
    data: {
      typename: fragment.__typename,
      urn: fragment.urn,
      bannerDetails: bannerDetails || [],
      currentBanner: bannerDetails && bannerDetails[0],
    },
  };
};

export default normalizeAccountBannersCardFragmentIntoAccountBannersCard;
