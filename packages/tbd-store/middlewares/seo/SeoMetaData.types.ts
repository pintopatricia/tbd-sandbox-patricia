export type SeoMetaDataDefault = {
  metaTitle: string;
  metaDescription: string;
  robotsMetaTags: {
    noIndex: boolean;
    noFollow: boolean;
    unavailableAfter: string;
  };
};
